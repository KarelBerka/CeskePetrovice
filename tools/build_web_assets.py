#!/usr/bin/env python3
"""Optimalizuje historické mapy, archivní skeny a obecní znak do webové složky assets/.

Spuštění:
  & "C:\\Users\\krapn\\AppData\\Local\\Python\\pythoncore-3.14-64\\python.exe" -X utf8 tools/build_web_assets.py
"""
from __future__ import annotations

import pathlib
import sys
import urllib.request
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = pathlib.Path(__file__).resolve().parent.parent
ASSETS_DIR = BASE_DIR / "assets"
ICONS_DIR = ASSETS_DIR / "icons"
ARCHIVES_DIR = ASSETS_DIR / "archives"
MAPS_DIR = ASSETS_DIR / "maps"

COMMONS_SVG_URL = "https://upload.wikimedia.org/wikipedia/commons/8/80/%C4%8Cesk%C3%A9_Petrovice.svg"

ARCHIVE_SOURCES = [
    ("zdroje/civil_6376_petrovice.jpg", "civil_6376_petrovice.jpg"),
    ("zdroje/civil_8272_petrovice.jpg", "civil_8272_petrovice.jpg"),
    ("zdroje/lexikon_1924_p092.jpg", "lexikon_1924_p092.jpg"),
    ("zdroje/schematismus_1938_p67_68.jpg", "schematismus_1938_p67_68.jpg"),
    ("zdroje/matrika_2_8336_1591_s04.jpg", "matrika_2_8336_1591_s04.jpg"),
    ("zdroje/matrika_2_8336_1596.jpg", "matrika_2_8336_1596.jpg"),
    ("zdroje/matrika_2_8336_1601.jpg", "matrika_2_8336_1601.jpg"),
    ("zdroje/matrika_2_8336_behm_petersdorff.jpg", "matrika_2_8336_behm_petersdorff.jpg"),
    ("zdroje/matrika_109_1_1734_petersdorf.jpg", "matrika_109_1_1734_petersdorf.jpg"),
    ("zdroje/matrika_23_1_1770_s05.jpg", "matrika_23_1_1770_s05.jpg"),
    ("zdroje/matrika_23_1_1771_cp.jpg", "matrika_23_1_1771_cp.jpg"),
    ("zdroje/matrika_23_1_repertorium_s35.jpg", "matrika_23_1_repertorium_s35.jpg"),
    ("zdroje/matrika_23_5_1806_umrti.jpg", "matrika_23_5_1806_umrti.jpg"),
    ("zdroje/matrika_23_6334_1919_koth.jpg", "matrika_23_6334_1919_koth.jpg"),
    ("zdroje/matrika_23_8990_1918_umrti.jpg", "matrika_23_8990_1918_umrti.jpg"),
    ("zdroje/scitani_1869_cp1_umlauf.jpg", "scitani_1869_cp1_umlauf.jpg"),
    ("zdroje/scitani_1869_cp25_fara.jpg", "scitani_1869_cp25_fara.jpg"),
    ("zdroje/scitani_1869_cp27_skola.jpg", "scitani_1869_cp27_skola.jpg"),
    ("zdroje/scitani_1869_cp152_mlyn.jpg", "scitani_1869_cp152_mlyn.jpg"),
    ("zdroje/scitani_1910_po_s02.jpg", "scitani_1910_po_s02.jpg"),
    ("zdroje/scitani_1910_po_s10.jpg", "scitani_1910_po_s10.jpg"),
    ("zdroje/scitani_1910_pz_s02.jpg", "scitani_1910_pz_s02.jpg"),
    ("zdroje/scitani_1910_pz_s08.jpg", "scitani_1910_pz_s08.jpg"),
    ("zdroje/scitani_1921_cp1_umlauf.jpg", "scitani_1921_cp1_umlauf.jpg"),
    ("zdroje/scitani_1921_cp21_schroller.jpg", "scitani_1921_cp21_schroller.jpg"),
    ("zdroje/scitani_1921_cp25_fara.jpg", "scitani_1921_cp25_fara.jpg"),
    ("zdroje/scitani_1921_cp27_skola.jpg", "scitani_1921_cp27_skola.jpg"),
    ("zdroje/scitani_1921_cp152_mlyn.jpg", "scitani_1921_cp152_mlyn.jpg"),
    ("zdroje/scitani_1921_cp156_hostinec.jpg", "scitani_1921_cp156_hostinec.jpg"),
    ("zdroje/scitani_1921_cp160_straz.jpg", "scitani_1921_cp160_straz.jpg"),
    ("zdroje/scitani_1921_koth.jpg", "scitani_1921_cp7_koth.jpg"),
    ("zdroje/tisk_1898_fuhrer_adlergebirge_p21.jpg", "tisk_1898_fuhrer_adlergebirge_p21.jpg"),
    ("zdroje/tisk_1909_jazykove_predlohy_p20.jpg", "tisk_1909_jazykove_predlohy_p20.jpg"),
    ("zdroje/tisk_1923_nase_mensiny_p84.jpg", "tisk_1923_nase_mensiny_p84.jpg"),
    ("zdroje/tisk_1923_nase_mensiny_p85.jpg", "tisk_1923_nase_mensiny_p85.jpg"),
    ("zdroje/tisk_1935_nase_mensiny_moravec_p114.jpg", "tisk_1935_nase_mensiny_moravec_p114.jpg"),
    ("zdroje/tisk_1936_turisticky_hradecek_kasparova_chata.jpg", "tisk_1936_turisticky_hradecek_kasparova_chata.jpg"),
    ("zdroje/tisk_1946_sokol_zpravy_p4.jpg", "tisk_1946_sokol_zpravy_p4.jpg"),
    ("Soudni pre/vyrezy/mzd2_1531_silperk_prodej_p346.jpg", "mzd2_1531_silperk_prodej_p346.jpg"),
    ("Soudni pre/vyrezy/mzd2_1511_zvole_goldstejn_p251.jpg", "mzd2_1511_zvole_goldstejn_p251.jpg"),
]

MAP_SOURCES = [
    ("Soudni pre/zdroje/mapa_helwig_1561_1579_celek.jpg", "mapa_1561_helwig.jpg"),
    ("Soudni pre/vyrezy/helwig_1561_1579_kladsko_morava_detail.jpg", "mapa_1561_helwig_detail.jpg"),
    ("Soudni pre/zdroje/mapa_fabricius_1569_celek.jpg", "mapa_1569_fabricius.jpg"),
    ("Soudni pre/vyrezy/fabricius_1569_severni_morava_kladsko_detail.jpg", "mapa_1569_fabricius_detail.jpg"),
    ("Soudni pre/zdroje/mapa_fabricius_1573_celek.jpg", "mapa_1573_fabricius.jpg"),
    ("Soudni pre/zdroje/mapa_komensky_1633_celek.jpg", "mapa_1633_komensky.jpg"),
    ("Soudni pre/vyrezy/komensky_1633_severni_morava_kladsko_detail.jpg", "mapa_1633_komensky_detail.jpg"),
    ("zdroje/mapa_18stol_boehmen16_celek.jpg", "mapa_18stol_boehmen16.jpg"),
    ("zdroje/mapa_1894_senftenberg_celek.jpg", "mapa_1894_senftenberg.jpg"),
    ("zdroje/mapa_1938_zamberk_celek.jpg", "mapa_1938_zamberk.jpg"),
    ("vyrezy/mapa_1938_ceske_petrovice_pomezi.jpg", "mapa_1938_pomezi_detail.jpg"),
    ("zdroje/katastr_cuzk_622702_celek.png", "mapa_2026_katastr_celek.jpg"),
    ("zdroje/ortofoto_cuzk_622702_celek.jpg", "mapa_2026_ortofoto_celek.jpg"),
    ("vyrezy/katastr_cuzk_622702_kostel_jadro.png", "mapa_2026_kostel_jadro.jpg"),
]


def convert_to_web_jpg(src: pathlib.Path, dst: pathlib.Path, max_width: int, quality: int) -> tuple[int, int, int]:
    with Image.open(src) as im:
        if im.mode in ("RGBA", "LA", "P"):
            bg = Image.new("RGB", im.size, (255, 255, 255))
            if im.mode == "P":
                im = im.convert("RGBA")
            if "A" in im.getbands():
                bg.paste(im, mask=im.split()[-1])
            else:
                bg.paste(im)
            im = bg
        elif im.mode != "RGB":
            im = im.convert("RGB")

        w, h = im.size
        if w > max_width:
            new_h = max(1, int(round(h * (max_width / w))))
            im = im.resize((max_width, new_h), Image.Resampling.LANCZOS)
        dst.parent.mkdir(parents=True, exist_ok=True)
        im.save(dst, format="JPEG", quality=quality, optimize=True, progressive=True)
        return im.size[0], im.size[1], dst.stat().st_size


def download_coat_of_arms() -> None:
    ICONS_DIR.mkdir(parents=True, exist_ok=True)
    svg_path = ICONS_DIR / "ceske_petrovice_erb.svg"
    req = urllib.request.Request(
        COMMONS_SVG_URL,
        headers={"User-Agent": "CeskePetroviceHistoricalPortal/1.0 (https://github.com/KarelBerka/CeskePetrovice)"},
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        svg_bytes = resp.read()
    text = svg_bytes.decode("utf-8", errors="ignore")
    if "<svg" not in text.lower():
        raise RuntimeError("Stažený soubor z Wikimedia Commons není platné SVG.")
    svg_path.write_bytes(svg_bytes)
    print(f"Downloaded SVG: {svg_path.relative_to(BASE_DIR)} ({len(svg_bytes)} B)")


def draw_heraldic_favicon(size: int, out_path: pathlib.Path) -> None:
    """Kreslí heraldický PNG favicon dle blazonu REKOS ID 5727 (modro-červeně polcený štít, meč, koruna, klíče)."""
    scale = 4
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Štít (španělský / gotický zaoblený dole)
    margin = int(s * 0.08)
    left = margin
    right = s - margin
    top = int(s * 0.06)
    mid_x = s // 2
    curve_y = int(s * 0.62)
    bottom = s - int(s * 0.06)

    # Levá polovina modrá, pravá červená
    blue = (18, 72, 160, 255)
    red = (196, 30, 38, 255)
    gold = (242, 189, 28, 255)
    silver = (242, 245, 250, 255)
    border = (40, 28, 18, 255)

    # Polygon aproximace štítu
    pts_left = [
        (left, top),
        (mid_x, top),
        (mid_x, bottom),
        (int(s * 0.32), int(s * 0.88)),
        (int(s * 0.14), int(s * 0.74)),
        (left, curve_y),
    ]
    pts_right = [
        (mid_x, top),
        (right, top),
        (right, curve_y),
        (int(s * 0.86), int(s * 0.74)),
        (int(s * 0.68), int(s * 0.88)),
        (mid_x, bottom),
    ]
    d.polygon(pts_left, fill=blue)
    d.polygon(pts_right, fill=red)

    # Meč uprostřed (stříbrná čepel + zlatý jílec)
    bw = max(2, int(s * 0.04))
    d.polygon([(mid_x, int(s * 0.82)), (mid_x - bw, int(s * 0.34)), (mid_x + bw, int(s * 0.34))], fill=silver)
    d.rectangle([mid_x - int(s * 0.11), int(s * 0.32), mid_x + int(s * 0.11), int(s * 0.36)], fill=gold)
    d.rectangle([mid_x - bw // 2, int(s * 0.22), mid_x + bw // 2, int(s * 0.34)], fill=gold)
    d.ellipse([mid_x - int(s * 0.04), int(s * 0.19), mid_x + int(s * 0.04), int(s * 0.25)], fill=gold)

    # Zlatá koruna nad mečem
    d.rectangle([mid_x - int(s * 0.11), int(s * 0.14), mid_x + int(s * 0.11), int(s * 0.18)], fill=gold)
    d.polygon([
        (mid_x - int(s * 0.11), int(s * 0.14)),
        (mid_x - int(s * 0.12), int(s * 0.09)),
        (mid_x - int(s * 0.05), int(s * 0.13)),
        (mid_x, int(s * 0.08)),
        (mid_x + int(s * 0.05), int(s * 0.13)),
        (mid_x + int(s * 0.12), int(s * 0.09)),
        (mid_x + int(s * 0.11), int(s * 0.14)),
    ], fill=gold)

    # Dva klíče po stranách (vlevo zlatý, vpravo stříbrný)
    for kx, col, dir_x in [(int(s * 0.28), gold, -1), (int(s * 0.72), silver, 1)]:
        d.rectangle([kx - bw // 2, int(s * 0.34), kx + bw // 2, int(s * 0.63)], fill=col)
        d.ellipse([kx - int(s * 0.065), int(s * 0.60), kx + int(s * 0.065), int(s * 0.72)], outline=col, width=max(2, bw))
        rx0 = min(kx, kx + dir_x * int(s * 0.08))
        rx1 = max(kx, kx + dir_x * int(s * 0.08))
        d.rectangle([rx0, int(s * 0.34), rx1, int(s * 0.42)], fill=col)

    # Tenký okraj štítu
    outline_pts = [
        (left, top),
        (right, top),
        (right, curve_y),
        (int(s * 0.86), int(s * 0.74)),
        (int(s * 0.68), int(s * 0.88)),
        (mid_x, bottom),
        (int(s * 0.32), int(s * 0.88)),
        (int(s * 0.14), int(s * 0.74)),
        (left, curve_y),
        (left, top),
    ]
    d.line(outline_pts, fill=border, width=max(2, int(s * 0.025)))

    out = img.resize((size, size), Image.Resampling.LANCZOS)
    out.save(out_path, format="PNG", optimize=True)


def main() -> int:
    download_coat_of_arms()
    draw_heraldic_favicon(64, ICONS_DIR / "favicon-64.png")
    draw_heraldic_favicon(180, ICONS_DIR / "apple-touch-icon.png")
    print("Generated PNG favicons: favicon-64.png, apple-touch-icon.png")

    total_bytes = 0
    print("\n--- Converting archive scans (max 1400px, q=70) ---")
    for rel_src, out_name in ARCHIVE_SOURCES:
        src = BASE_DIR / rel_src
        if not src.exists():
            raise FileNotFoundError(f"Chybí zdrojový archivní snímek: {src}")
        dst = ARCHIVES_DIR / out_name
        w, h, sz = convert_to_web_jpg(src, dst, max_width=1400, quality=68)
        total_bytes += sz
        print(f"  {out_name:48s} {w:4d}x{h:<4d} {sz/1024:6.1f} KB")

    print("\n--- Converting historical & cadastral maps (max 1600px, q=72) ---")
    for rel_src, out_name in MAP_SOURCES:
        src = BASE_DIR / rel_src
        if not src.exists():
            raise FileNotFoundError(f"Chybí zdrojová mapa: {src}")
        dst = MAPS_DIR / out_name
        w, h, sz = convert_to_web_jpg(src, dst, max_width=1600, quality=72)
        total_bytes += sz
        print(f"  {out_name:48s} {w:4d}x{h:<4d} {sz/1024:6.1f} KB")

    all_asset_bytes = sum(f.stat().st_size for f in ASSETS_DIR.rglob("*") if f.is_file())
    print(f"\nDONE! Total assets/ size: {all_asset_bytes / 1024 / 1024:.2f} MB ({len(list(ASSETS_DIR.rglob('*')))} entries)")
    if all_asset_bytes > 15 * 1024 * 1024:
        raise RuntimeError(f"assets/ překročila limit 15 MB: {all_asset_bytes}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
