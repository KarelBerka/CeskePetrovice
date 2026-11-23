#!/usr/bin/env python3
"""Stahování a příprava výřezů digitalizátů z portálu ARON MZA v Brně (čistě přes Pillow, bez ImageMagicku).

Podporuje DeepZoom (.dzi), IIIF (info.json) i přímé soubory (PUBLISHED).
Dlaždice stahuje sekvenčně s povinnou prodlevou (výchozí 0,12 s) a ukládá
přehledový náhled, případné půlené výřezy (--split) a kontrastní šedotón (--enhance).

Použití:
  mza_aron_img.py info <apu_id>
  mza_aron_img.py link <apu_id> <order>
  mza_aron_img.py fetch <apu_id> <order> <level_offset> <out_path> [--crop x0,y0,x1,y1] [--split] [--enhance]
"""
from __future__ import annotations

import argparse
import io
import json
import math
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from typing import Any

from PIL import Image, ImageOps

for _s in (sys.stdout, sys.stderr):
    if hasattr(_s, "reconfigure"):
        _s.reconfigure(encoding="utf-8", errors="replace")

BASE_URL = "https://www.mza.cz/aron"
API = f"{BASE_URL}/api/aron"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_DIR = os.path.join(ROOT, "pracovni", ".cache_aron")
VYREZY_DIR = os.path.join(ROOT, "vyrezy")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": f"{BASE_URL}/",
}


def http_get(url: str, binary: bool = False, delay: float = 0.12) -> bytes | str:
    if delay > 0:
        time.sleep(delay)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as r:
        data = r.read()
    return data if binary else data.decode("utf-8", errors="replace")


def resolve_url(ref: str) -> str:
    if ref.startswith("http://") or ref.startswith("https://"):
        return ref
    if ref.startswith("/aron/"):
        return "https://www.mza.cz" + ref
    if ref.startswith("/"):
        return BASE_URL + ref
    return f"{BASE_URL}/{ref}"


def load_volume(apu_id: str, refresh: bool = False) -> dict[str, Any]:
    os.makedirs(CACHE_DIR, exist_ok=True)
    path = os.path.join(CACHE_DIR, f"{apu_id}.json")
    if not refresh and os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    raw = http_get(f"{API}/apu/{apu_id}", binary=False, delay=1.5)
    assert isinstance(raw, str)
    tmp = f"{path}.{os.getpid()}.tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        f.write(raw)
    os.replace(tmp, path)
    return json.loads(raw)


def index_files(vol: dict[str, Any]) -> tuple[dict[int, dict[str, Any]], dict[int, tuple[str, dict[str, Any]]], list[dict[str, Any]]]:
    tiles: dict[int, dict[str, Any]] = {}
    published: dict[int, tuple[str, dict[str, Any]]] = {}
    all_files: list[dict[str, Any]] = []
    for dao in vol.get("digitalObjects", []) or []:
        dao_id = dao.get("id", "")
        for f in dao.get("files", []) or []:
            all_files.append(f)
            ftype = f.get("type", "")
            order = f.get("order")
            if order is None:
                continue
            if ftype == "TILE":
                tiles[int(order)] = f
            elif ftype == "PUBLISHED":
                published[int(order)] = (dao_id, f)
    return tiles, published, all_files


def cmd_info(args: argparse.Namespace) -> int:
    vol = load_volume(args.apu_id, refresh=args.refresh)
    tiles, published, all_files = index_files(vol)
    print(f"ID:    {args.apu_id}")
    print(f"URL:   {BASE_URL}/apu/{args.apu_id}")
    print(f"NAME:  {vol.get('name')}")
    if vol.get("description"):
        print(f"DESC:  {vol.get('description')}")
    print(f"DIGITAL OBJECTS: {len(vol.get('digitalObjects') or [])}")
    print(f"TILE scans:      {len(tiles)}")
    print(f"PUBLISHED files: {len(published)}")
    type_counts: dict[str, int] = {}
    for f in all_files:
        t = f.get("type", "UNKNOWN")
        type_counts[t] = type_counts.get(t, 0) + 1
    print(f"FILE TYPES:      {type_counts}")
    if tiles:
        first_ord = min(tiles)
        sample = tiles[first_ord]
        print(f"SAMPLE TILE (#{first_ord}): referencedFile={sample.get('referencedFile')} | id={sample.get('id')}")
    if published:
        first_p = min(published)
        dao_id, ps = published[first_p]
        print(f"SAMPLE PUBLISHED (#{first_p}): dao={dao_id} file={ps.get('id')} contentType={ps.get('contentType')} ref={ps.get('referencedFile')}")
    return 0


def cmd_link(args: argparse.Namespace) -> int:
    vol = load_volume(args.apu_id)
    _, published, _ = index_files(vol)
    if args.order in published:
        dao_id, f = published[args.order]
        print(f"{BASE_URL}/apu/{args.apu_id}/dao/{dao_id}/file/{f['id']}")
        return 0
    for dao in vol.get("digitalObjects", []) or []:
        files = [f for f in (dao.get("files") or []) if f.get("type") == "PUBLISHED"]
        if files and 1 <= args.order <= len(files):
            f = files[args.order - 1]
            print(f"{BASE_URL}/apu/{args.apu_id}/dao/{dao['id']}/file/{f['id']}")
            return 0
    print(f"Permalink pro snímek {args.order} nenalezen; odkaz na celek: {BASE_URL}/apu/{args.apu_id}", file=sys.stderr)
    return 1


def _fetch_dzi(dzi_url: str, level_offset: int, crop: tuple[float, float, float, float] | None, delay: float) -> tuple[Image.Image, tuple[int, int]]:
    xml_text = http_get(dzi_url, binary=False, delay=delay)
    assert isinstance(xml_text, str)
    dzi = ET.fromstring(xml_text)
    ns = {"d": "http://schemas.microsoft.com/deepzoom/2009"}
    ts = int(dzi.attrib["TileSize"])
    ov = int(dzi.attrib.get("Overlap", "0"))
    fmt = dzi.attrib.get("Format", "jpg")
    size_el = dzi.find("d:Size", ns)
    if size_el is None:
        size_el = dzi.find("Size")
    assert size_el is not None, "DZI neobsahuje element Size"
    W, H = int(size_el.attrib["Width"]), int(size_el.attrib["Height"])

    maxlevel = math.ceil(math.log2(max(W, H)))
    level = max(0, maxlevel - level_offset)
    scale = 2 ** (maxlevel - level)
    w, h = math.ceil(W / scale), math.ceil(H / scale)

    if crop:
        x0, y0, x1, y1 = crop
        px0 = max(0, int(math.floor(x0 * w)))
        py0 = max(0, int(math.floor(y0 * h)))
        px1 = min(w, int(math.ceil(x1 * w)))
        py1 = min(h, int(math.ceil(y1 * h)))
    else:
        px0, py0, px1, py1 = 0, 0, w, h

    cols, rows = math.ceil(w / ts), math.ceil(h / ts)
    c0 = max(0, px0 // ts)
    c1 = min(cols - 1, max(0, (px1 - 1) // ts))
    r0 = max(0, py0 // ts)
    r1 = min(rows - 1, max(0, (py1 - 1) // ts))

    stem = dzi_url[:-4] if dzi_url.lower().endswith(".dzi") else dzi_url
    base_files = f"{stem}_files/{level}"

    canvas_w = (c1 - c0 + 1) * ts
    canvas_h = (r1 - r0 + 1) * ts
    # Přesná cílová velikost dlaždicového obdélníku
    actual_w = min(w - c0 * ts, canvas_w)
    actual_h = min(h - r0 * ts, canvas_h)
    canvas = Image.new("RGB", (actual_w, actual_h), (255, 255, 255))

    total_tiles = (r1 - r0 + 1) * (c1 - c0 + 1)
    print(f"DZI full={W}x{H}, level={level}/{maxlevel} ({w}x{h}), tiles={total_tiles} (cols {c0}..{c1}, rows {r0}..{r1})")

    for r in range(r0, r1 + 1):
        for c in range(c0, c1 + 1):
            tile_url = f"{base_files}/{c}_{r}.{fmt}"
            raw_tile = http_get(tile_url, binary=True, delay=delay)
            assert isinstance(raw_tile, bytes)
            with Image.open(io.BytesIO(raw_tile)) as tile_img:
                tile_rgb = tile_img.convert("RGB")
                ox = ov if c > 0 else 0
                oy = ov if r > 0 else 0
                cw = min(ts, w - c * ts)
                ch = min(ts, h - r * ts)
                cropped_tile = tile_rgb.crop((ox, oy, ox + cw, oy + ch))
                canvas.paste(cropped_tile, ((c - c0) * ts, (r - r0) * ts))

    if crop:
        rel_box = (px0 - c0 * ts, py0 - r0 * ts, px1 - c0 * ts, py1 - r0 * ts)
        canvas = canvas.crop(rel_box)

    return canvas, (W, H)


def _fetch_iiif(info_url: str, level_offset: int, crop: tuple[float, float, float, float] | None, delay: float) -> tuple[Image.Image, tuple[int, int]]:
    raw = http_get(info_url, binary=False, delay=delay)
    assert isinstance(raw, str)
    info = json.loads(raw)
    W, H = int(info["width"]), int(info["height"])
    base_id = (info.get("@id") or info.get("id") or info_url.rsplit("/", 1)[0]).rstrip("/")
    tiles_meta = (info.get("tiles") or [{}])[0]
    tw = int(tiles_meta.get("width", 512))
    th = int(tiles_meta.get("height", tw))
    sfs = sorted(tiles_meta.get("scaleFactors") or [1, 2, 4, 8])
    target_sf = 2 ** level_offset
    sf = min(sfs, key=lambda x: abs(x - target_sf))

    w, h = math.ceil(W / sf), math.ceil(H / sf)
    if crop:
        x0, y0, x1, y1 = crop
        px0, py0 = max(0, int(math.floor(x0 * w))), max(0, int(math.floor(y0 * h)))
        px1, py1 = min(w, int(math.ceil(x1 * w))), min(h, int(math.ceil(y1 * h)))
    else:
        px0, py0, px1, py1 = 0, 0, w, h

    c0, c1 = px0 // tw, max(0, (px1 - 1) // tw)
    r0, r1 = py0 // th, max(0, (py1 - 1) // th)
    actual_w = min(w - c0 * tw, (c1 - c0 + 1) * tw)
    actual_h = min(h - r0 * th, (r1 - r0 + 1) * th)
    canvas = Image.new("RGB", (actual_w, actual_h), (255, 255, 255))

    print(f"IIIF full={W}x{H}, sf={sf} ({w}x{h}), tiles={(r1-r0+1)*(c1-c0+1)}")
    for r in range(r0, r1 + 1):
        for c in range(c0, c1 + 1):
            rx = c * tw * sf
            ry = r * th * sf
            rw = min(tw * sf, W - rx)
            rh = min(th * sf, H - ry)
            out_w = min(tw, w - c * tw)
            tile_url = f"{base_id}/{rx},{ry},{rw},{rh}/{out_w},/0/default.jpg"
            raw_tile = http_get(tile_url, binary=True, delay=delay)
            assert isinstance(raw_tile, bytes)
            with Image.open(io.BytesIO(raw_tile)) as tile_img:
                canvas.paste(tile_img.convert("RGB"), ((c - c0) * tw, (r - r0) * th))

    if crop:
        canvas = canvas.crop((px0 - c0 * tw, py0 - r0 * th, px1 - c0 * tw, py1 - r0 * th))
    return canvas, (W, H)


def _save_derivatives(img: Image.Image, out_path: str, do_split: bool, do_enhance: bool) -> None:
    os.makedirs(VYREZY_DIR, exist_ok=True)
    stem = os.path.splitext(os.path.basename(out_path))[0]

    # Přehledový náhled do šířky max. 1600 px
    w, h = img.size
    if w > 1600 or h > 1600:
        preview = img.copy()
        preview.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
    else:
        preview = img
    prev_path = os.path.join(VYREZY_DIR, f"{stem}_preview.jpg")
    preview.save(prev_path, "JPEG", quality=82, optimize=True)
    print(f"Náhled uložen: {prev_path} ({preview.size[0]}x{preview.size[1]})")

    if do_split:
        # Půlení levá/pravá s mírným přesahem uprostřed i horní/dolní
        boxes = {
            "left": (0, 0, int(w * 0.54), h),
            "right": (int(w * 0.46), 0, w, h),
            "top": (0, 0, w, int(h * 0.54)),
            "bottom": (0, int(h * 0.46), w, h),
        }
        for suf, box in boxes.items():
            sub = img.crop(box)
            sp = os.path.join(VYREZY_DIR, f"{stem}_{suf}.jpg")
            sub.save(sp, "JPEG", quality=88)
            print(f"Výřez uložen: {sp} ({sub.size[0]}x{sub.size[1]})")

    if do_enhance:
        gray = ImageOps.grayscale(img)
        enh = ImageOps.autocontrast(gray, cutoff=2)
        enh_path = os.path.join(VYREZY_DIR, f"{stem}_enhanced.jpg")
        enh.save(enh_path, "JPEG", quality=88)
        print(f"Kontrastní verze uložena: {enh_path} ({enh.size[0]}x{enh.size[1]})")


def cmd_fetch(args: argparse.Namespace) -> int:
    vol = load_volume(args.apu_id)
    tiles, published, _ = index_files(vol)
    crop = None
    if args.crop:
        parts = tuple(float(v) for v in args.crop.split(","))
        if len(parts) != 4 or not (0.0 <= parts[0] < parts[2] <= 1.0 and 0.0 <= parts[1] < parts[3] <= 1.0):
            print("Chyba: --crop musí být 4 zlomky x0,y0,x1,y1 v intervalu 0..1.", file=sys.stderr)
            return 2
        crop = parts

    out_path = os.path.abspath(args.out_path)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    if args.order in tiles:
        ref = tiles[args.order].get("referencedFile") or ""
        ref_url = resolve_url(ref)
        if ".dzi" in ref_url.lower():
            img, full_dims = _fetch_dzi(ref_url, args.level_offset, crop, args.delay)
        elif "info.json" in ref_url.lower():
            img, full_dims = _fetch_iiif(ref_url, args.level_offset, crop, args.delay)
        else:
            raise RuntimeError(f"Neznámý formát dlaždicového souboru: {ref_url}")
    elif args.order in published:
        dao_id, f = published[args.order]
        file_url = resolve_url(f.get("referencedFile") or f"/api/aron/file/{f['id']}")
        raw = http_get(file_url, binary=True, delay=args.delay)
        assert isinstance(raw, bytes)
        with Image.open(io.BytesIO(raw)) as im:
            img = im.convert("RGB")
            full_dims = img.size
            if crop:
                W, H = img.size
                img = img.crop((int(crop[0] * W), int(crop[1] * H), int(crop[2] * W), int(crop[3] * H)))
    else:
        print(f"Chyba: Snímek č. {args.order} nebyl u {args.apu_id} nalezen (TILE={len(tiles)}, PUBLISHED={len(published)}).", file=sys.stderr)
        return 1

    img.save(out_path, "JPEG", quality=90)
    print(f"Uloženo: {out_path} ({img.size[0]}x{img.size[1]}, full={full_dims})")
    _save_derivatives(img, out_path, args.split, args.enhance)
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="mza_aron_img.py",
        description="Stahování snímků a příprava výřezů z MZA Brno ARON (Pillow).",
    )
    p.add_argument("--delay", type=float, default=0.12, help="Prodleva mezi dlaždicemi v s (výchozí 0.12)")
    sub = p.add_subparsers(dest="cmd", required=True)

    i = sub.add_parser("info", help="Vypíše informace o digitalizátech u daného APU ID")
    i.add_argument("apu_id")
    i.add_argument("--refresh", action="store_true")

    lk = sub.add_parser("link", help="Vypíše trvalý odkaz na konkrétní snímek")
    lk.add_argument("apu_id")
    lk.add_argument("order", type=int)

    ft = sub.add_parser("fetch", help="Stáhne snímek (nebo výřez) a vygeneruje náhledy")
    ft.add_argument("apu_id")
    ft.add_argument("order", type=int, help="Pořadové číslo snímku (order)")
    ft.add_argument("level_offset", type=int, help="0 = plné rozlišení, 1 = polovina, 2 = čtvrtina")
    ft.add_argument("out_path", help="Cesta výstupního souboru (např. zdroje/mapa_full.jpg)")
    ft.add_argument("--crop", default="", help="Výřez jako zlomky 0..1: x0,y0,x1,y1")
    ft.add_argument("--split", action="store_true", help="Uloží půlené čitelné výřezy do vyrezy/")
    ft.add_argument("--enhance", action="store_true", help="Uloží kontrastní šedotónovou verzi do vyrezy/")
    return p


def main() -> int:
    args = build_parser().parse_args()
    try:
        if args.cmd == "info":
            return cmd_info(args)
        if args.cmd == "link":
            return cmd_link(args)
        if args.cmd == "fetch":
            return cmd_fetch(args)
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        print(f"CHYBA SÍTĚ MZA ARON: {e}. Zastav stahování.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
