#!/usr/bin/env python3
"""Lokální extrakce snímků, kontaktních archů a výřezů z archivních ZIPů ve složce originaly/.

Neprovádí žádné síťové dotazy na ARON ani VCA storage. Pracuje přímo se staženými
ZIP archivy SOA Hradec Králové v originaly/.

Použití:
  local_zip_scans.py info <vol>
  local_zip_scans.py sheet <vol> --out-dir <dir> [--per-sheet 25 --cols 5 --thumb-w 420]
  local_zip_scans.py extract <vol> --scans <spec> --out-dir <dir> [--level-offset 1] [--split] [--quads] [--enhance] [--single-out <path>]
"""
from __future__ import annotations

import argparse
import io
import math
import os
import sys
import zipfile
from typing import Any

from PIL import Image, ImageDraw, ImageFont, ImageOps

for _s in (sys.stdout, sys.stderr):
    if hasattr(_s, "reconfigure"):
        _s.reconfigure(encoding="utf-8", errors="replace")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGINALY_DIR = os.path.join(ROOT, "originaly")
IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".tif", ".tiff")

VOLUMES: dict[str, dict[str, Any]] = {
    "2-8336": {
        "zip_name": "CZ_215000010_00190_PRP4POUN_sign-2-8336.zip",
        "apu_id": "8dcb1638-0a4e-412c-a4de-64f58bdb7d1b",
        "originator": "Farní úřad Bartošovice v Orlických horách",
        "dates": "NOZ 1591–1624",
    },
    "83-1": {
        "zip_name": "CZ_215000010_00190_VDFTL4E6_sign-83-1.zip",
        "apu_id": "8892a7da-a31a-4a18-a59f-2df1b606c5be",
        "originator": "Farní úřad Lukavice",
        "dates": "NOZ 1646–1671",
    },
    "83-2": {
        "zip_name": "CZ_215000010_00190_TZIRZ5IQ_sign-83-2.zip",
        "apu_id": "5cc6920c-e18d-4dd6-80c2-4ff282d9eadc",
        "originator": "Farní úřad Lukavice",
        "dates": "NOZ 1672–1702",
    },
    "109-1": {
        "zip_name": "CZ_215000010_00190_F3CLLWXH_sign-109-1.zip",
        "apu_id": "fd865aa0-64b3-40ab-b855-2d914eb6e360",
        "originator": "Farní úřad Nekoř",
        "dates": "N 10.1705–9.1753",
    },
    "109-2": {
        "zip_name": "CZ_215000010_00190_ERFGBI7U_sign-109-2.zip",
        "apu_id": "77b1c8ff-f67b-4d67-8a1a-0c175eeb84a2",
        "originator": "Farní úřad Nekoř",
        "dates": "N 1753–1784",
    },
}


def get_volume_zip_path(vol: str) -> str:
    if vol not in VOLUMES:
        raise ValueError(f"Neznámá signatura svazku '{vol}'. Povolené: {', '.join(VOLUMES.keys())}")
    zpath = os.path.join(ORIGINALY_DIR, VOLUMES[vol]["zip_name"])
    if not os.path.isfile(zpath):
        raise FileNotFoundError(f"Chybí ZIP archiv: {zpath}")
    return zpath


def list_sorted_images(zf: zipfile.ZipFile) -> list[str]:
    names = [
        info.filename
        for info in zf.infolist()
        if not info.is_dir() and info.filename.lower().endswith(IMAGE_EXTS)
    ]
    names.sort()
    return names


def parse_scan_spec(spec: str, max_scan: int) -> list[int]:
    scans: list[int] = []
    seen: set[int] = set()
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a_str, b_str = part.split("-", 1)
            a, b = int(a_str.strip()), int(b_str.strip())
            if a > b:
                a, b = b, a
            for idx in range(a, b + 1):
                if not (1 <= idx <= max_scan):
                    raise ValueError(f"Sken s{idx:03d} je mimo rozsah 1..{max_scan}")
                if idx not in seen:
                    seen.add(idx)
                    scans.append(idx)
        else:
            idx = int(part)
            if not (1 <= idx <= max_scan):
                raise ValueError(f"Sken s{idx:03d} je mimo rozsah 1..{max_scan}")
            if idx not in seen:
                seen.add(idx)
                scans.append(idx)
    return scans


def _load_font(size: int) -> ImageFont.ImageFont | ImageFont.FreeTypeFont:
    for cand in (
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/DejaVuSans-Bold.ttf",
    ):
        if os.path.exists(cand):
            try:
                return ImageFont.truetype(cand, size=size)
            except OSError:
                pass
    return ImageFont.load_default()


def cmd_info(args: argparse.Namespace) -> int:
    zpath = get_volume_zip_path(args.vol)
    meta = VOLUMES[args.vol]
    sz_mb = os.path.getsize(zpath) / (1024 * 1024)
    with zipfile.ZipFile(zpath, "r") as zf:
        imgs = list_sorted_images(zf)
    print(f"Signatura: {args.vol} ({meta['originator']}, {meta['dates']})")
    print(f"ZIP: {zpath} ({sz_mb:.2f} MB)")
    print(f"Počet snímků: {len(imgs)}")
    if imgs:
        print(f"První: {imgs[0]}")
        print(f"Poslední: {imgs[-1]}")
    print(f"ARON permalink: https://aron.vychodoceskearchivy.cz/apu/{meta['apu_id']}")
    return 0


def cmd_sheet(args: argparse.Namespace) -> int:
    zpath = get_volume_zip_path(args.vol)
    out_dir = os.path.abspath(args.out_dir)
    os.makedirs(out_dir, exist_ok=True)
    per_sheet = args.per_sheet
    cols = args.cols
    thumb_w = args.thumb_w
    pad = 8
    font = _load_font(22)

    with zipfile.ZipFile(zpath, "r") as zf:
        imgs = list_sorted_images(zf)
        total = len(imgs)
        if total == 0:
            print("Žádné obrázky v ZIPu.", file=sys.stderr)
            return 1

        for start_idx in range(0, total, per_sheet):
            batch_indices = list(range(start_idx, min(total, start_idx + per_sheet)))
            thumbs: list[tuple[int, Image.Image]] = []
            max_h = 1
            for idx0 in batch_indices:
                raw = zf.read(imgs[idx0])
                with Image.open(io.BytesIO(raw)) as im:
                    im = ImageOps.exif_transpose(im).convert("RGB")
                    ratio = thumb_w / max(1, im.size[0])
                    th_h = max(1, int(round(im.size[1] * ratio)))
                    thumb = im.resize((thumb_w, th_h), Image.Resampling.LANCZOS)
                    max_h = max(max_h, th_h)
                    thumbs.append((idx0 + 1, thumb))

            rows = math.ceil(len(thumbs) / cols)
            sheet_w = cols * thumb_w + (cols + 1) * pad
            sheet_h = rows * max_h + (rows + 1) * pad
            canvas = Image.new("RGB", (sheet_w, sheet_h), (24, 24, 27))
            draw = ImageDraw.Draw(canvas)

            for pos, (scan_no, thumb) in enumerate(thumbs):
                r = pos // cols
                c = pos % cols
                x0 = pad + c * (thumb_w + pad)
                y0 = pad + r * (max_h + pad)
                canvas.paste(thumb, (x0, y0))
                label = f"s{scan_no:03d}"
                bbox = draw.textbbox((0, 0), label, font=font)
                tw = bbox[2] - bbox[0]
                th = bbox[3] - bbox[1]
                draw.rectangle([x0 + 4, y0 + 4, x0 + tw + 16, y0 + th + 12], fill=(15, 23, 42), outline=(251, 191, 36), width=2)
                draw.text((x0 + 10, y0 + 6), label, fill=(254, 243, 199), font=font)

            first_no = batch_indices[0] + 1
            last_no = batch_indices[-1] + 1
            out_path = os.path.join(out_dir, f"sheet_{first_no:03d}_{last_no:03d}.jpg")
            canvas.save(out_path, "JPEG", quality=82)
            print(f"Kontaktní arch uložen: {out_path} ({sheet_w}x{sheet_h}, s{first_no:03d}-s{last_no:03d})")
    return 0


def _enhance_image(im: Image.Image) -> Image.Image:
    gray = ImageOps.grayscale(im)
    return ImageOps.autocontrast(gray, cutoff=2)


def _save_crops_for_image(
    img: Image.Image,
    base_no_ext: str,
    do_split: bool,
    do_quads: bool,
    do_enhance: bool,
) -> None:
    w, h = img.size
    if do_enhance:
        enh = _enhance_image(img)
        enh_path = f"{base_no_ext}_enhanced.jpg"
        enh.save(enh_path, "JPEG", quality=88)

    if do_split:
        for suffix, box in [
            ("left", (0, 0, int(round(w * 0.52)), h)),
            ("right", (int(round(w * 0.48)), 0, w, h)),
        ]:
            sub = img.crop(box)
            sp = f"{base_no_ext}_{suffix}.jpg"
            sub.save(sp, "JPEG", quality=90)
            if do_enhance:
                _enhance_image(sub).save(f"{base_no_ext}_{suffix}_enhanced.jpg", "JPEG", quality=88)

    if do_quads:
        mid_x0 = int(round(w * 0.47))
        mid_x1 = int(round(w * 0.53))
        mid_y0 = int(round(h * 0.47))
        mid_y1 = int(round(h * 0.53))
        quad_boxes = [
            ("tl", (0, 0, mid_x1, mid_y1)),
            ("bl", (0, mid_y0, mid_x1, h)),
            ("tr", (mid_x0, 0, w, mid_y1)),
            ("br", (mid_x0, mid_y0, w, h)),
        ]
        for suffix, box in quad_boxes:
            sub = img.crop(box)
            qp = f"{base_no_ext}_{suffix}.jpg"
            sub.save(qp, "JPEG", quality=90)
            if do_enhance:
                _enhance_image(sub).save(f"{base_no_ext}_{suffix}_enhanced.jpg", "JPEG", quality=88)


def cmd_extract(args: argparse.Namespace) -> int:
    zpath = get_volume_zip_path(args.vol)
    out_dir = os.path.abspath(args.out_dir) if args.out_dir else None
    single_out = os.path.abspath(args.single_out) if args.single_out else None

    if not out_dir and not single_out:
        print("Chyba: Je nutné zadat --out-dir nebo --single-out.", file=sys.stderr)
        return 2

    with zipfile.ZipFile(zpath, "r") as zf:
        imgs = list_sorted_images(zf)
        scan_nums = parse_scan_spec(args.scans, len(imgs))
        if single_out and len(scan_nums) != 1:
            print("Chyba: --single-out vyžaduje přesně 1 snímek.", file=sys.stderr)
            return 2

        if out_dir:
            os.makedirs(out_dir, exist_ok=True)
        if single_out:
            os.makedirs(os.path.dirname(single_out), exist_ok=True)

        for scan_no in scan_nums:
            entry_name = imgs[scan_no - 1]
            raw = zf.read(entry_name)
            with Image.open(io.BytesIO(raw)) as im:
                img = ImageOps.exif_transpose(im).convert("RGB")
            full_dims = img.size
            if args.level_offset > 0:
                factor = 2 ** args.level_offset
                new_size = (max(1, img.size[0] // factor), max(1, img.size[1] // factor))
                img = img.resize(new_size, Image.Resampling.LANCZOS)

            if single_out:
                out_path = single_out
            else:
                assert out_dir is not None
                out_path = os.path.join(out_dir, f"s{scan_no:03d}.jpg")

            img.save(out_path, "JPEG", quality=90)
            base_no_ext = os.path.splitext(out_path)[0]
            _save_crops_for_image(img, base_no_ext, args.split, args.quads, args.enhance)
            print(
                f"s{scan_no:03d}: {out_path} ({img.size[0]}x{img.size[1]}, full={full_dims}, zip={entry_name})"
            )
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="local_zip_scans.py",
        description="Lokální extrakce snímků a kontaktních archů ze ZIPů v originaly/.",
    )
    sub = p.add_subparsers(dest="cmd", required=True)

    i = sub.add_parser("info", help="Vypíše základní informace o ZIP archivu svazku")
    i.add_argument("vol", help="Signatura svazku (2-8336, 83-1, 83-2, 109-1, 109-2)")

    sh = sub.add_parser("sheet", help="Vytvoří kontaktní archy se štítky s001..sNNN")
    sh.add_argument("vol", help="Signatura svazku")
    sh.add_argument("--out-dir", required=True, help="Výstupní adresář pro kontaktní archy")
    sh.add_argument("--per-sheet", type=int, default=25, help="Počet snímků na jeden arch (výchozí 25)")
    sh.add_argument("--cols", type=int, default=5, help="Počet sloupců (výchozí 5)")
    sh.add_argument("--thumb-w", type=int, default=420, help="Šířka jednoho náhledu v px (výchozí 420)")

    ex = sub.add_parser("extract", help="Extrahuje vybrané snímky a výřezy")
    ex.add_argument("vol", help="Signatura svazku")
    ex.add_argument("--scans", required=True, help="Výběr snímků, např. '1,4,10-15'")
    ex.add_argument("--out-dir", default="", help="Výstupní složka (např. pracovni/2_8336)")
    ex.add_argument("--single-out", default="", help="Výstupní cesta pro jediný snímek (např. zdroje/...)")
    ex.add_argument("--level-offset", type=int, default=1, help="0 = plné rozlišení, 1 = polovina (výchozí), 2 = čtvrtina")
    ex.add_argument("--split", action="store_true", help="Uloží půlené výřezy _left a _right (s 4%% přesahem)")
    ex.add_argument("--quads", action="store_true", help="Uloží 4 kvadranty _tl, _bl, _tr, _br (s 6%% přesahem)")
    ex.add_argument("--enhance", action="store_true", help="Uloží kontrastní šedotónové verze (_enhanced)")
    return p


def main() -> int:
    args = build_parser().parse_args()
    if args.cmd == "info":
        return cmd_info(args)
    if args.cmd == "sheet":
        return cmd_sheet(args)
    if args.cmd == "extract":
        return cmd_extract(args)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
