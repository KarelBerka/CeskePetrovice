#!/usr/bin/env python3
"""Stahování jednotlivých snímků z oficiálních archivů ZIP SOA Hradec Králové (storage.vychodoceskearchivy.cz) přes HTTP Range.

Nepoužívá obrazový dlaždicový server imgx.vychodoceskearchivy.cz. Místo toho přečte
veřejný odkaz na ZIP svazku z metadat ARON (parts -> items -> type == "URL"),
jednorázově nacachuje centrální adresář ZIPu do pracovni/.cache_aron/<apu_id>.zipdir.json
a jednotlivé snímky stahuje jediným HTTP 206 Range požadavkem s prodlevou (výchozí 0,4 s).

Použití:
  vca_aron_img.py info <apu_id> [--refresh]
  vca_aron_img.py link <apu_id> <order>
  vca_aron_img.py fetch <apu_id> <order> <out_path> [--level-offset 1] [--crop x0,y0,x1,y1] [--split] [--enhance] [--delay 0.4]
"""
from __future__ import annotations

import argparse
import io
import json
import os
import struct
import sys
import time
import urllib.error
import urllib.request
import zlib
from typing import Any

from PIL import Image, ImageOps

for _s in (sys.stdout, sys.stderr):
    if hasattr(_s, "reconfigure"):
        _s.reconfigure(encoding="utf-8", errors="replace")

BASE_URL = "https://aron.vychodoceskearchivy.cz"
API = f"{BASE_URL}/api/aron"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_DIR = os.path.join(ROOT, "pracovni", ".cache_aron")
PRACOVNI_DIR = os.path.normcase(os.path.abspath(os.path.join(ROOT, "pracovni")))
VYREZY_DIR = os.path.join(ROOT, "vyrezy")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": f"{BASE_URL}/",
}
IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".tif", ".tiff")


def http_req(
    url: str,
    *,
    method: str = "GET",
    headers: dict[str, str] | None = None,
    delay: float = 0.4,
    timeout: int = 30,
) -> tuple[bytes, Any]:
    if delay > 0:
        time.sleep(delay)
    hdrs = dict(HEADERS)
    if headers:
        hdrs.update(headers)
    req = urllib.request.Request(url, method=method, headers=hdrs)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read(), r.headers


def load_volume(apu_id: str, refresh: bool = False) -> dict[str, Any]:
    os.makedirs(CACHE_DIR, exist_ok=True)
    path = os.path.join(CACHE_DIR, f"{apu_id}.json")
    if not refresh and os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    raw, _ = http_req(f"{API}/apu/{apu_id}", delay=1.5)
    text = raw.decode("utf-8", errors="replace")
    tmp = f"{path}.{os.getpid()}.tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    os.replace(tmp, path)
    return json.loads(text)


def extract_zip_url(vol: dict[str, Any]) -> str | None:
    for part in vol.get("parts", []) or []:
        for it in part.get("items", []) or []:
            if it.get("type") == "URL":
                href = (it.get("href") or "").strip()
                if href.startswith("https://storage.vychodoceskearchivy.cz/"):
                    return href
    return None


def index_published(vol: dict[str, Any]) -> dict[int, tuple[str, dict[str, Any]]]:
    published: dict[int, tuple[str, dict[str, Any]]] = {}
    for dao in vol.get("digitalObjects", []) or []:
        dao_id = dao.get("id", "")
        for f in dao.get("files", []) or []:
            if f.get("type") == "PUBLISHED" and f.get("order") is not None:
                published[int(f["order"])] = (dao_id, f)
    return published


def load_zip_directory(apu_id: str, zip_url: str, refresh: bool = False, delay: float = 0.4) -> dict[str, Any]:
    os.makedirs(CACHE_DIR, exist_ok=True)
    cache_path = os.path.join(CACHE_DIR, f"{apu_id}.zipdir.json")
    if not refresh and os.path.exists(cache_path):
        with open(cache_path, encoding="utf-8") as f:
            return json.load(f)

    _, hdrs = http_req(zip_url, method="HEAD", delay=delay)
    total = int(hdrs["Content-Length"])
    tail_len = min(total, 131072)
    tail, _ = http_req(
        zip_url,
        headers={"Range": f"bytes={max(0, total - tail_len)}-{total - 1}"},
        delay=delay,
    )
    eocd_pos = tail.rfind(b"PK\x05\x06")
    if eocd_pos < 0:
        raise RuntimeError(f"EOCD PK\\x05\\x06 nenalezen v ZIPu {zip_url}")
    _, _, _, _, total_entries, cd_size, cd_offset, _ = struct.unpack(
        "<4sHHHHIIH", tail[eocd_pos : eocd_pos + 22]
    )

    cd, _ = http_req(
        zip_url,
        headers={"Range": f"bytes={cd_offset}-{cd_offset + cd_size - 1}"},
        delay=delay,
    )

    pos = 0
    entries: list[dict[str, Any]] = []
    while pos + 46 <= len(cd) and cd[pos : pos + 4] == b"PK\x01\x02":
        (
            _,
            _,
            _,
            _,
            method,
            _,
            _,
            _,
            comp_size,
            uncomp_size,
            fn_len,
            extra_len,
            comm_len,
            _,
            _,
            _,
            lhoff,
        ) = struct.unpack("<4sHHHHHHIIIHHHHHII", cd[pos : pos + 46])
        fname = cd[pos + 46 : pos + 46 + fn_len].decode("utf-8", errors="replace")
        pos += 46 + fn_len + extra_len + comm_len
        if not fname.endswith("/") and fname.lower().endswith(IMAGE_EXTS):
            entries.append(
                {
                    "name": fname,
                    "method": method,
                    "comp_size": comp_size,
                    "uncomp_size": uncomp_size,
                    "lhoff": lhoff,
                }
            )

    entries.sort(key=lambda e: e["name"])
    payload = {
        "apu_id": apu_id,
        "zip_url": zip_url,
        "total_bytes": total,
        "total_entries": total_entries,
        "entries": entries,
    }
    tmp = f"{cache_path}.{os.getpid()}.tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    os.replace(tmp, cache_path)
    return payload


def cmd_info(args: argparse.Namespace) -> int:
    vol = load_volume(args.apu_id, refresh=args.refresh)
    published = index_published(vol)
    zip_url = extract_zip_url(vol)
    print(f"ID:              {args.apu_id}")
    print(f"PERMALINK:       {BASE_URL}/apu/{args.apu_id}")
    print(f"NAME:            {vol.get('name')}")
    if vol.get("description"):
        print(f"DESC:            {vol.get('description')}")
    print(f"PUBLISHED files: {len(published)}")
    print(f"STORAGE ZIP URL: {zip_url or 'N/A'}")
    if zip_url:
        zdir = load_zip_directory(args.apu_id, zip_url, refresh=args.refresh, delay=0.3)
        print(f"ZIP total bytes: {zdir['total_bytes']} | image entries: {len(zdir['entries'])}")
        if zdir["entries"]:
            print(f"FIRST ENTRY:     #1 {zdir['entries'][0]['name']}")
            print(f"LAST ENTRY:      #{len(zdir['entries'])} {zdir['entries'][-1]['name']}")
    if published:
        first_p = min(published)
        dao_id, ps = published[first_p]
        print(f"SAMPLE LINK (#{first_p}): {BASE_URL}/apu/{args.apu_id}/dao/{dao_id}/file/{ps.get('id')}")
    return 0


def cmd_link(args: argparse.Namespace) -> int:
    vol = load_volume(args.apu_id)
    published = index_published(vol)
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


def _save_derivatives(img: Image.Image, out_path: str, do_split: bool, do_enhance: bool) -> None:
    norm_out_dir = os.path.normcase(os.path.abspath(os.path.dirname(out_path)))
    if norm_out_dir.startswith(PRACOVNI_DIR):
        deriv_dir = os.path.dirname(out_path)
    else:
        deriv_dir = VYREZY_DIR
    os.makedirs(deriv_dir, exist_ok=True)
    stem = os.path.splitext(os.path.basename(out_path))[0]

    w, h = img.size
    if do_split or do_enhance:
        if w > 1600 or h > 1600:
            preview = img.copy()
            preview.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        else:
            preview = img
        prev_path = os.path.join(deriv_dir, f"{stem}_preview.jpg")
        preview.save(prev_path, "JPEG", quality=82, optimize=True)
        print(f"Náhled uložen: {prev_path} ({preview.size[0]}x{preview.size[1]})")

    if do_split:
        boxes = {
            "header": (0, 0, w, max(1, int(h * 0.35))),
            "left": (0, 0, max(1, int(w * 0.54)), h),
            "right": (min(w - 1, int(w * 0.46)), 0, w, h),
            "bottom": (0, min(h - 1, int(h * 0.65)), w, h),
        }
        for suf, box in boxes.items():
            sub = img.crop(box)
            sp = os.path.join(deriv_dir, f"{stem}_{suf}.jpg")
            sub.save(sp, "JPEG", quality=88)
            print(f"Výřez uložen: {sp} ({sub.size[0]}x{sub.size[1]})")

    if do_enhance:
        gray = ImageOps.grayscale(img)
        enh = ImageOps.autocontrast(gray, cutoff=2)
        enh_path = os.path.join(deriv_dir, f"{stem}_enhanced.jpg")
        enh.save(enh_path, "JPEG", quality=88)
        print(f"Kontrastní verze uložena: {enh_path} ({enh.size[0]}x{enh.size[1]})")


def cmd_fetch(args: argparse.Namespace) -> int:
    vol = load_volume(args.apu_id)
    zip_url = extract_zip_url(vol)
    if not zip_url:
        print(f"Chyba: Svazek {args.apu_id} nemá veřejný odkaz na ZIP na storage.vychodoceskearchivy.cz.", file=sys.stderr)
        return 1

    crop = None
    if args.crop:
        parts = tuple(float(v) for v in args.crop.split(","))
        if len(parts) != 4 or not (0.0 <= parts[0] < parts[2] <= 1.0 and 0.0 <= parts[1] < parts[3] <= 1.0):
            print("Chyba: --crop musí být 4 zlomky x0,y0,x1,y1 v intervalu 0..1.", file=sys.stderr)
            return 2
        crop = parts

    zdir = load_zip_directory(args.apu_id, zip_url, delay=args.delay)
    entries = zdir["entries"]
    total = zdir["total_bytes"]
    if not (1 <= args.order <= len(entries)):
        print(f"Chyba: Požadovaný snímek #{args.order} je mimo rozsah 1..{len(entries)}.", file=sys.stderr)
        return 1

    entry = entries[args.order - 1]
    lhoff = int(entry["lhoff"])
    comp_size = int(entry["comp_size"])
    method = int(entry["method"])
    end_byte = min(total - 1, lhoff + 30 + 256 + comp_size)
    chunk, _ = http_req(
        zip_url,
        headers={"Range": f"bytes={lhoff}-{end_byte}"},
        delay=args.delay,
        timeout=45,
    )
    _, _, _, _, _, _, _, _, _, fn_l, ex_l = struct.unpack("<4sHHHHHIIIHH", chunk[:30])
    data_start = 30 + fn_l + ex_l
    raw_comp = chunk[data_start : data_start + comp_size]
    if method == 0:
        raw_bytes = raw_comp
    elif method == 8:
        raw_bytes = zlib.decompress(raw_comp, -zlib.MAX_WBITS)
    else:
        raise RuntimeError(f"Nepodporovaná metoda komprese ZIP: {method}")

    with Image.open(io.BytesIO(raw_bytes)) as im:
        img = im.convert("RGB")
    full_dims = img.size

    if args.level_offset > 0:
        factor = 2 ** args.level_offset
        new_size = (max(1, img.size[0] // factor), max(1, img.size[1] // factor))
        img = img.resize(new_size, Image.Resampling.LANCZOS)

    if crop:
        w, h = img.size
        img = img.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))

    out_path = os.path.abspath(args.out_path)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, "JPEG", quality=90)
    print(f"Uloženo: {out_path} ({img.size[0]}x{img.size[1]}, full={full_dims}, zip_entry={entry['name']})")
    _save_derivatives(img, out_path, args.split, args.enhance)
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="vca_aron_img.py",
        description="Stahování snímků ze storage.vychodoceskearchivy.cz přes HTTP Range (Pillow).",
    )
    sub = p.add_subparsers(dest="cmd", required=True)

    i = sub.add_parser("info", help="Vypíše informace o svazku a ZIP archivu na storage.vychodoceskearchivy.cz")
    i.add_argument("apu_id")
    i.add_argument("--refresh", action="store_true")

    lk = sub.add_parser("link", help="Vypíše trvalý odkaz na konkrétní snímek")
    lk.add_argument("apu_id")
    lk.add_argument("order", type=int)

    ft = sub.add_parser("fetch", help="Stáhne snímek přes HTTP Range a vygeneruje náhledy/výřezy")
    ft.add_argument("apu_id")
    ft.add_argument("order", type=int, help="Pořadové číslo snímku (1-based pořadí v ZIP archivu)")
    ft.add_argument("out_path", help="Cesta výstupního souboru (např. zdroje/snimek.jpg)")
    ft.add_argument("--level-offset", type=int, default=1, help="0 = plné rozlišení, 1 = polovina (výchozí), 2 = čtvrtina")
    ft.add_argument("--crop", default="", help="Výřez jako zlomky 0..1: x0,y0,x1,y1")
    ft.add_argument("--split", action="store_true", help="Uloží půlené čitelné výřezy (_header, _left, _right, _bottom)")
    ft.add_argument("--enhance", action="store_true", help="Uloží kontrastní šedotónovou verzi (_enhanced)")
    ft.add_argument("--delay", type=float, default=0.4, help="Prodleva před HTTP dotazem v s (výchozí 0.4)")
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
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, OSError) as e:
        print(f"CHYBA SÍTĚ VCA STORAGE: {e}. Zastav stahování.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
