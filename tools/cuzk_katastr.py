#!/usr/bin/env python3
"""Klient pro veřejné GIS služby ČÚZK (RÚIAN ArcGIS REST a katastrální WMS) pro k. ú. České Petrovice (622702).

Použití:
  cuzk_katastr.py buildings [--ku 622702] [--obec 580066] [--out pracovni/ruian_622702.json]
  cuzk_katastr.py wms-map [--ku 622702] [--layers KN] [--width 2400] [--bbox minx,miny,maxx,maxy] [--ortofoto] [--out zdroje/katastr_cuzk_622702_celek.png]
"""
from __future__ import annotations

import argparse
import io
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from typing import Any

from PIL import Image, ImageDraw, ImageFont

for _s in (sys.stdout, sys.stderr):
    if hasattr(_s, "reconfigure"):
        _s.reconfigure(encoding="utf-8", errors="replace")

RUIAN_BASE = "https://ags.cuzk.gov.cz/arcgis/rest/services/RUIAN/MapServer"
KN_WMS = "https://services.cuzk.gov.cz/wms/wms.asp"
ORTOFOTO_WMS = "https://ags.cuzk.gov.cz/arcgis1/services/ORTOFOTO/MapServer/WMSServer"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}


def get_json(url: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
    time.sleep(0.25)
    if params:
        url = f"{url}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def get_bytes(url: str, params: dict[str, Any] | None = None) -> bytes:
    time.sleep(0.25)
    if params:
        url = f"{url}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.read()


def arcgis_query_all(layer_id: int, where: str, out_fields: str, out_sr: int = 5514, return_geometry: bool = True) -> list[dict[str, Any]]:
    features: list[dict[str, Any]] = []
    offset = 0
    batch = 1000
    while True:
        params = {
            "where": where,
            "outFields": out_fields,
            "returnGeometry": "true" if return_geometry else "false",
            "outSR": str(out_sr),
            "resultOffset": str(offset),
            "resultRecordCount": str(batch),
            "f": "json",
        }
        d = get_json(f"{RUIAN_BASE}/{layer_id}/query", params)
        if "error" in d:
            raise RuntimeError(f"ArcGIS error layer {layer_id}: {d['error']}")
        feats = d.get("features", [])
        features.extend(feats)
        if not d.get("exceededTransferLimit") or len(feats) < batch:
            break
        offset += len(feats)
    return features


def fetch_ku_data(ku_code: int, obec_code: int) -> dict[str, Any]:
    # Layer 7: KatastralniUzemi
    ku_feats = arcgis_query_all(7, f"kod={ku_code}", "kod,nazev,obec,existujedigitalnimapa", out_sr=5514, return_geometry=True)
    if not ku_feats:
        raise RuntimeError(f"Katastrální území {ku_code} nenalezeno v RÚIAN.")
    ku_geom = ku_feats[0]["geometry"]
    rings = ku_geom.get("rings", [])
    xs = [pt[0] for ring in rings for pt in ring]
    ys = [pt[1] for ring in rings for pt in ring]
    bbox_5514 = [min(xs), min(ys), max(xs), max(ys)]

    # Layer 7 v WGS84 pro orientační souřadnice
    ku_wgs = arcgis_query_all(7, f"kod={ku_code}", "kod", out_sr=4326, return_geometry=True)
    wgs_rings = ku_wgs[0]["geometry"].get("rings", [])
    wxs = [pt[0] for ring in wgs_rings for pt in ring]
    wys = [pt[1] for ring in wgs_rings for pt in ring]
    bbox_4326 = [min(wxs), min(wys), max(wxs), max(wys)]

    # Layer 11: CastObce (pro obec 580066)
    casti = arcgis_query_all(11, f"obec={obec_code}", "kod,nazev,obec", out_sr=5514, return_geometry=False)
    cast_codes = [c["attributes"]["kod"] for c in casti]
    cast_names = {c["attributes"]["kod"]: c["attributes"]["nazev"] for c in casti}

    # Layer 2: StavebnihoObjektuDefinicniBod (v S-JTSK i WGS84 přes souřadnice nebo dotaz podle castobce)
    where_cast = f"castobce IN ({','.join(str(c) for c in cast_codes)})" if cast_codes else f"kod>0"
    so_5514 = arcgis_query_all(
        2,
        where_cast,
        "kod,cisladomovni,identifikacniparcela,typstavebnihoobjektukod,zpusobvyuzitikod,castobce,dokonceni,pocetpodlazi,zastavenaplocha",
        out_sr=5514,
        return_geometry=True,
    )
    so_4326 = arcgis_query_all(
        2,
        where_cast,
        "kod",
        out_sr=4326,
        return_geometry=True,
    )
    coords_wgs = {f["attributes"]["kod"]: f.get("geometry", {}) for f in so_4326}

    # Layer 1: AdresniMisto pro vazbu stavebniobjekt -> adresa / cislo domovni
    so_kods = [f["attributes"]["kod"] for f in so_5514]
    am_by_so: dict[int, list[dict[str, Any]]] = {}
    for idx in range(0, len(so_kods), 100):
        chunk = so_kods[idx : idx + 100]
        am_feats = arcgis_query_all(
            1,
            f"stavebniobjekt IN ({','.join(str(k) for k in chunk)})",
            "kod,cislodomovni,cisloorientacni,psc,stavebniobjekt,adresa",
            out_sr=5514,
            return_geometry=False,
        )
        for af in am_feats:
            a = af["attributes"]
            am_by_so.setdefault(a["stavebniobjekt"], []).append(a)

    # Layer 5: Parcela count (atributy bez plných polygonů)
    parcel_pts = arcgis_query_all(
        0,
        f"katastralniuzemi={ku_code}",
        "id,kmenovecislo,poddelenicisla,cisloparcely,druhcislovanikod,druhpozemkukod,vymeraparcely",
        out_sr=5514,
        return_geometry=True,
    )
    parcel_by_id = {p["attributes"]["id"]: p for p in parcel_pts}

    buildings: list[dict[str, Any]] = []
    for f in so_5514:
        att = dict(f["attributes"])
        g5514 = f.get("geometry") or {}
        gwgs = coords_wgs.get(att["kod"], {})
        ams = am_by_so.get(att["kod"], [])
        parc = parcel_by_id.get(att.get("identifikacniparcela"), {})
        parc_att = parc.get("attributes", {})
        # typstavebnihoobjektukod: 1 = budova s čp., 2 = budova s č. ev., 3 = budova bez čp./č. ev.
        buildings.append(
            {
                "so_kod": att["kod"],
                "typ_kod": att.get("typstavebnihoobjektukod"),
                "typ_label": {1: "čp.", 2: "č. ev.", 3: "bez čp./ev."}.get(att.get("typstavebnihoobjektukod"), "?"),
                "cislodomovni": att.get("cisladomovni"),
                "cast_obce": cast_names.get(att.get("castobce"), att.get("castobce")),
                "identifikacni_parcela_id": att.get("identifikacniparcela"),
                "parcela_cislo": parc_att.get("cisloparcely"),
                "parcela_druh_cislovani": "st." if parc_att.get("druhcislovanikod") == 1 else "pozemková" if parc_att.get("druhcislovanikod") == 2 else None,
                "zpusob_vyuziti_kod": att.get("zpusobvyuzitikod"),
                "zastavena_plocha_m2": att.get("zastavenaplocha"),
                "dokonceni": att.get("dokonceni"),
                "sjtsk_x": round(g5514.get("x", 0.0), 2) if g5514 else None,
                "sjtsk_y": round(g5514.get("y", 0.0), 2) if g5514 else None,
                "lat": round(gwgs.get("y", 0.0), 6) if gwgs else None,
                "lon": round(gwgs.get("x", 0.0), 6) if gwgs else None,
                "adresy": [a.get("adresa") for a in ams if a.get("adresa")],
            }
        )

    buildings.sort(key=lambda b: (b["typ_kod"] or 99, min(b["cislodomovni"]) if isinstance(b["cislodomovni"], list) and b["cislodomovni"] else 999999))
    return {
        "ku_kod": ku_code,
        "ku_nazev": ku_feats[0]["attributes"]["nazev"],
        "obec_kod": obec_code,
        "casti_obce": casti,
        "bbox_sjtsk": [round(v, 2) for v in bbox_5514],
        "bbox_wgs84": [round(v, 6) for v in bbox_4326],
        "parcel_count": len(parcel_pts),
        "building_count": len(buildings),
        "buildings": buildings,
    }


def cmd_buildings(args: argparse.Namespace) -> int:
    data = fetch_ku_data(args.ku, args.obec)
    out_abs = os.path.abspath(args.out)
    os.makedirs(os.path.dirname(out_abs), exist_ok=True)
    with open(out_abs, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    cp_nums = [b for b in data["buildings"] if b["typ_kod"] == 1 and b["cislodomovni"]]
    ev_nums = [b for b in data["buildings"] if b["typ_kod"] == 2 and b["cislodomovni"]]
    print(f"K. ú. {data['ku_nazev']} ({data['ku_kod']}): {data['parcel_count']} parcel, {data['building_count']} stavebních objektů")
    print(f"  s čp.: {len(cp_nums)} | s č. ev.: {len(ev_nums)} | bbox S-JTSK: {data['bbox_sjtsk']}")
    print(f"Uloženo do {out_abs}")
    return 0


def cmd_wms_map(args: argparse.Namespace) -> int:
    ruian_cache = args.ruian_json
    if ruian_cache and os.path.exists(ruian_cache):
        with open(ruian_cache, encoding="utf-8") as f:
            rdata = json.load(f)
    else:
        rdata = fetch_ku_data(args.ku, args.obec)

    if args.bbox:
        minx, miny, maxx, maxy = [float(x) for x in args.bbox.split(",")]
    else:
        bx0, by0, bx1, by1 = rdata["bbox_sjtsk"]
        pad_x = (bx1 - bx0) * 0.04
        pad_y = (by1 - by0) * 0.04
        minx, miny, maxx, maxy = bx0 - pad_x, by0 - pad_y, bx1 + pad_x, by1 + pad_y

    w = args.width
    h = max(100, int(round(w * (maxy - miny) / (maxx - minx))))

    # WMS 1.1.1 / ArcGIS export pro EPSG:5514
    if getattr(args, "ruian_export", False):
        wms_url = f"{RUIAN_BASE}/export"
        params = {
            "bbox": f"{minx:.2f},{miny:.2f},{maxx:.2f},{maxy:.2f}",
            "bboxSR": "5514",
            "imageSR": "5514",
            "size": f"{w},{h}",
            "layers": args.layers if args.layers else "show:3,5",
            "format": "png",
            "transparent": "false",
            "f": "image",
        }
    else:
        wms_url = ORTOFOTO_WMS if args.ortofoto else KN_WMS
        layers = args.layers if args.layers else ("0" if args.ortofoto else "hranice_parcel,parcelni_cisla,POL_BUDOV")
        params = {
            "SERVICE": "WMS",
            "VERSION": "1.1.1",
            "REQUEST": "GetMap",
            "LAYERS": layers,
            "STYLES": "",
            "SRS": "EPSG:5514",
            "BBOX": f"{minx:.2f},{miny:.2f},{maxx:.2f},{maxy:.2f}",
            "WIDTH": str(w),
            "HEIGHT": str(h),
            "FORMAT": "image/jpeg" if args.ortofoto else "image/png",
        }
    raw = get_bytes(wms_url, params)
    if raw[:5].startswith(b"<?xml") or raw[:5].startswith(b"<Serv"):
        raise RuntimeError(f"WMS vrátilo XML chybu: {raw.decode('utf-8', 'replace')[:400]}")

    img = Image.open(io.BytesIO(raw)).convert("RGB")
    if args.annotate:
        draw = ImageDraw.Draw(img)
        font = ImageFont.load_default()
        for b in rdata["buildings"]:
            sx, sy = b.get("sjtsk_x"), b.get("sjtsk_y")
            if sx is None or sy is None or not (minx <= sx <= maxx and miny <= sy <= maxy):
                continue
            px = (sx - minx) / (maxx - minx) * w
            py = (maxy - sy) / (maxy - miny) * h
            if b["typ_kod"] == 1 and b["cislodomovni"]:
                lbl = str(b["cislodomovni"][0] if isinstance(b["cislodomovni"], list) else b["cislodomovni"])
                color = (200, 20, 20)
            elif b["typ_kod"] == 2 and b["cislodomovni"]:
                val = b["cislodomovni"][0] if isinstance(b["cislodomovni"], list) else b["cislodomovni"]
                lbl = f"E{val}"
                color = (20, 80, 200)
            else:
                continue
            draw.ellipse((px - 3, py - 3, px + 3, py + 3), fill=color)
            draw.rectangle((px + 4, py - 7, px + 7 + len(lbl) * 6, py + 5), fill=(255, 255, 255))
            draw.text((px + 5, py - 6), lbl, fill=color, font=font)

    out_abs = os.path.abspath(args.out)
    os.makedirs(os.path.dirname(out_abs), exist_ok=True)
    ext = os.path.splitext(out_abs)[1].lower()
    if ext in (".jpg", ".jpeg"):
        img.save(out_abs, "JPEG", quality=92)
    else:
        img.save(out_abs, "PNG")
    print(f"WMS mapa uložena: {out_abs} ({img.width}x{img.height} px), BBOX EPSG:5514 = {minx:.1f},{miny:.1f},{maxx:.1f},{maxy:.1f}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="cuzk_katastr.py", description="ČÚZK RÚIAN & Katastr WMS nástroj pro České Petrovice (k. ú. 622702).")
    sub = p.add_subparsers(dest="cmd", required=True)

    b = sub.add_parser("buildings", help="Stáhne objekty, čísla popisná/evidenční a parcely z RÚIAN MapServer")
    b.add_argument("--ku", type=int, default=622702)
    b.add_argument("--obec", type=int, default=580066)
    b.add_argument("--out", default="pracovni/ruian_622702.json")

    w = sub.add_parser("wms-map", help="Stáhne aktuální katastrální mapu nebo ortofoto ČÚZK přes WMS")
    w.add_argument("--ku", type=int, default=622702)
    w.add_argument("--obec", type=int, default=580066)
    w.add_argument("--ruian-json", default="pracovni/ruian_622702.json")
    w.add_argument("--layers", default="")
    w.add_argument("--bbox", default="", help="minx,miny,maxx,maxy v EPSG:5514 (výchozí celé k. ú.)")
    w.add_argument("--width", type=int, default=2800)
    w.add_argument("--ortofoto", action="store_true")
    w.add_argument("--ruian-export", action="store_true", help="Použije ArcGIS RUIAN/MapServer/export (výchozí vrstvy show:3,5)")
    w.add_argument("--annotate", action="store_true", help="Vykreslí čp. (červeně) a č. ev. (modře) z RÚIAN")
    w.add_argument("--out", required=True)
    return p


def main() -> int:
    args = build_parser().parse_args()
    try:
        if args.cmd == "buildings":
            return cmd_buildings(args)
        if args.cmd == "wms-map":
            return cmd_wms_map(args)
    except Exception as e:
        print(f"CHYBA ČÚZK: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
