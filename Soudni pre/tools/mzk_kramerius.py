#!/usr/bin/env python3
"""Vyhledávání, stahování OCR a IIIF výřezů map v digitální knihovně Kramerius MZK (API v7).

Použití:
  mzk_kramerius.py search "<SOLR_QUERY>" [--rows 20] [--sort "<sort>"]
  mzk_kramerius.py ocr <pid1> [<pid2> ...] [--max-chars 0]
  mzk_kramerius.py pages <root_pid> [--from 0] [--to 20] [--rows 25]
  mzk_kramerius.py iiif-info <page_pid>
  mzk_kramerius.py iiif-fetch <page_pid> <out_path> [--region full|x,y,w,h] [--width 1800] [--enhance]
"""
from __future__ import annotations

import argparse
import io
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

from PIL import Image, ImageOps

for _s in (sys.stdout, sys.stderr):
    if hasattr(_s, "reconfigure"):
        _s.reconfigure(encoding="utf-8", errors="replace")

BASE = "https://api.kramerius.mzk.cz/search/api/client/v7.0"
IIIF_BASE = "https://api.kramerius.mzk.cz/search/iiif"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}


def get_json(url: str) -> dict:
    time.sleep(0.5)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r)


def get_text(url: str) -> str:
    time.sleep(0.5)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read().decode("utf-8", errors="replace")


def get_bytes(url: str) -> bytes:
    time.sleep(0.5)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def cmd_search(args: argparse.Namespace) -> int:
    params = {
        "q": args.query,
        "fl": "pid,root.title,root.pid,date.str,accessibility,page.number,page.index,own_parent.title",
        "rows": str(args.rows),
    }
    if args.sort:
        params["sort"] = args.sort
    u = f"{BASE}/search?{urllib.parse.urlencode(params)}"
    d = get_json(u)
    resp = d.get("response", {})
    print(f"numFound: {resp.get('numFound', 0)}")
    for doc in resp.get("docs", []):
        print(
            f"[{doc.get('accessibility')}] {doc.get('date.str')} | "
            f"{doc.get('root.title')} | p.{doc.get('page.number')} (idx={doc.get('page.index')}) | "
            f"{doc.get('pid')} (root={doc.get('root.pid')})"
        )
    return 0


def cmd_ocr(args: argparse.Namespace) -> int:
    for pid in args.pids:
        txt = get_text(f"{BASE}/items/{urllib.parse.quote(pid, safe=':')}/ocr/text")
        print(f"=== {pid} ===")
        if args.max_chars > 0:
            print(txt[: args.max_chars])
        else:
            print(txt)
    return 0


def cmd_pages(args: argparse.Namespace) -> int:
    q = f'root.pid:"{args.root_pid}" AND page.index:[{args.idx_from} TO {args.idx_to}]'
    params = {
        "q": q,
        "fl": "pid,page.number,page.index,accessibility",
        "rows": str(args.rows),
        "sort": "page.index asc",
    }
    u = f"{BASE}/search?{urllib.parse.urlencode(params)}"
    d = get_json(u)
    for doc in d.get("response", {}).get("docs", []):
        print(f"idx={doc.get('page.index')} | p.{doc.get('page.number')} | {doc.get('accessibility')} | {doc.get('pid')}")
    return 0


def cmd_iiif_info(args: argparse.Namespace) -> int:
    pid_enc = urllib.parse.quote(args.page_pid, safe=":")
    info = get_json(f"{IIIF_BASE}/{pid_enc}/info.json")
    print(f"PID: {args.page_pid}")
    print(f"Dimensions: {info.get('width')} x {info.get('height')}")
    print(f"Context: {info.get('@context')}")
    return 0


def cmd_iiif_fetch(args: argparse.Namespace) -> int:
    pid_enc = urllib.parse.quote(args.page_pid, safe=":")
    info = get_json(f"{IIIF_BASE}/{pid_enc}/info.json")
    w_img = int(info.get("width", 0))
    h_img = int(info.get("height", 0))
    region = args.region.strip()
    if region != "full":
        parts = [int(p.strip()) for p in region.split(",")]
        if len(parts) != 4:
            raise ValueError("--region musí být 'full' nebo 'x,y,w,h'")
        x, y, cw, ch = parts
        x = max(0, min(x, max(0, w_img - 1)))
        y = max(0, min(y, max(0, h_img - 1)))
        cw = max(1, min(cw, w_img - x))
        ch = max(1, min(ch, h_img - y))
        region = f"{x},{y},{cw},{ch}"

    if args.width > 0:
        size_param = f"{args.width},"
    else:
        ctx = str(info.get("@context", ""))
        size_param = "max" if "/image/3" in ctx else "full"

    url = f"{IIIF_BASE}/{pid_enc}/{region}/{size_param}/0/default.jpg"
    raw = get_bytes(url)
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    out_dir = os.path.dirname(os.path.abspath(args.out_path))
    os.makedirs(out_dir, exist_ok=True)
    img.save(args.out_path, "JPEG", quality=92)
    print(f"Uloženo: {args.out_path} ({img.width}x{img.height} px) z {url}")

    if args.enhance:
        stem, _ = os.path.splitext(args.out_path)
        enh_path = f"{stem}_enhanced.jpg"
        gray = ImageOps.grayscale(img)
        enh = ImageOps.autocontrast(gray, cutoff=1)
        enh.save(enh_path, "JPEG", quality=92)
        print(f"Uloženo (enhanced): {enh_path} ({enh.width}x{enh.height} px)")
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="mzk_kramerius.py", description="Klient pro API v7 Kramerius MZK Brno.")
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("search", help="Fulltextové nebo metadatové vyhledávání")
    s.add_argument("query")
    s.add_argument("--rows", type=int, default=20)
    s.add_argument("--sort", default="")

    o = sub.add_parser("ocr", help="Stáhne text OCR z veřejných stránek")
    o.add_argument("pids", nargs="+")
    o.add_argument("--max-chars", type=int, default=0)

    pg = sub.add_parser("pages", help="Vypíše stránky svazku podle page.index")
    pg.add_argument("root_pid")
    pg.add_argument("--from", dest="idx_from", type=int, default=0)
    pg.add_argument("--to", dest="idx_to", type=int, default=20)
    pg.add_argument("--rows", type=int, default=25)

    ii = sub.add_parser("iiif-info", help="Zobrazí rozměry a kontext IIIF obrázku")
    ii.add_argument("page_pid")

    ifetch = sub.add_parser("iiif-fetch", help="Stáhne celek nebo výřez mapy přes IIIF")
    ifetch.add_argument("page_pid")
    ifetch.add_argument("out_path")
    ifetch.add_argument("--region", default="full", help="'full' nebo 'x,y,w,h' v plném rozlišení")
    ifetch.add_argument("--width", type=int, default=1800, help="Šířka výstupu (0 = plné rozlišení)")
    ifetch.add_argument("--enhance", action="store_true", help="Uloží i kontrastní šedotónový výřez")
    return p


def main() -> int:
    args = build_parser().parse_args()
    try:
        if args.cmd == "search":
            return cmd_search(args)
        if args.cmd == "ocr":
            return cmd_ocr(args)
        if args.cmd == "pages":
            return cmd_pages(args)
        if args.cmd == "iiif-info":
            return cmd_iiif_info(args)
        if args.cmd == "iiif-fetch":
            return cmd_iiif_fetch(args)
    except urllib.error.HTTPError as e:
        print(f"HTTP CHYBA MZK: {e.code} {e.read().decode('utf-8', 'replace')[:300]}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"CHYBA MZK: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
