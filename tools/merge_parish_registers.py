#!/usr/bin/env python3
"""Sloučí přepisové dávky předfarních matrik do data/matriky_1591_1784.json a spočítá kontinuitu rodů.

Použití:
  merge_parish_registers.py --volume 2-8336 --slices pracovni/m_2_8336_slice_1.json ... --status completed --inspected-summary "..."
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from datetime import datetime
from pathlib import Path
from typing import Any

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
MASTER_PATH = ROOT / "data" / "matriky_1591_1784.json"
DOMY_PATH = ROOT / "data" / "domy_1771_1921.json"

PROOF_SCAN_BY_KEY: dict[tuple[str, int], str] = {
    ("2-8336", 4): "assets/archives/matrika_2_8336_1591_s04.jpg",
    ("2-8336", 6): "assets/archives/matrika_2_8336_1596.jpg",
    ("2-8336", 10): "assets/archives/matrika_2_8336_1601.jpg",
    ("2-8336", 89): "assets/archives/matrika_2_8336_behm_petersdorff.jpg",
    ("83-1", 22): "assets/archives/matrika_83_1_petersdorf.jpg",
    ("83-2", 6): "assets/archives/matrika_83_2_petersdorf.jpg",
    ("109-1", 115): "assets/archives/matrika_109_1_1734_petersdorf.jpg",
    ("109-1", 121): "assets/archives/matrika_109_1_1734_petersdorf.jpg",
    ("109-2", 134): "assets/archives/matrika_109_2_petersdorf.jpg",
}


def norm_key(text: str) -> str:
    s = unicodedata.normalize("NFD", (text or "").lower().replace("ß", "ss"))
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")
    return re.sub(r"[^a-z0-9]+", "", s)


CANONICAL_FAMILY_ALIASES = {
    "adler": "Adler",
    "adlerova": "Adler",
    "aedler": "Adler",
    "edler": "Adler",
    "bayer": "Beier / Baier",
    "baier": "Beier / Baier",
    "beier": "Beier / Baier",
    "beyer": "Beier / Baier",
    "baijer": "Beier / Baier",
    "beierova": "Beier / Baier",
    "baierova": "Beier / Baier",
    "blumel": "Blümel",
    "bluemel": "Blümel",
    "blum": "Blümel",
    "efenberger": "Effenberger",
    "effenberger": "Effenberger",
    "efenbergerova": "Effenberger",
    "exler": "Exler / Esler",
    "esler": "Exler / Esler",
    "esseler": "Exler / Esler",
    "oessler": "Exler / Esler",
    "effler": "Exler / Esler",
    "efler": "Exler / Esler",
    "froler": "Schroller",
    "frohler": "Schroller",
    "froehler": "Schroller",
    "holtz": "Scholtz / Scholz",
    "holz": "Scholtz / Scholz",
    "heinrich": "Heinrich",
    "hinrich": "Heinrich",
    "hendrych": "Heinrich",
    "heymann": "Heymann / Heimann",
    "heimann": "Heymann / Heimann",
    "urban": "Urban",
    "wrba": "Urban",
    "wrban": "Urban",
    "gottschlich": "Gottschlich / Kotzschlich",
    "gottschlik": "Gottschlich / Kotzschlich",
    "gotschlich": "Gottschlich / Kotzschlich",
    "hensel": "Hensel",
    "henselova": "Hensel",
    "hoffer": "Hofer / Hoffer",
    "hofer": "Hofer / Hoffer",
    "hoffman": "Hoffmann",
    "hoffmann": "Hoffmann",
    "hofman": "Hoffmann",
    "kittner": "Kittner / Küttner",
    "kuttner": "Kittner / Küttner",
    "kuettner": "Kittner / Küttner",
    "langer": "Langer",
    "langerova": "Langer",
    "lux": "Lux",
    "luxova": "Lux",
    "pacha": "Pacha / Pácha",
    "sacha": "Pacha / Pácha (?Sacha)",
    "peinelt": "Peinelt",
    "reinelt": "Reinelt",
    "frimel": "Frimmel / Frimel",
    "friml": "Frimmel / Frimel",
    "fremel": "Frimmel / Frimel",
    "frimmel": "Frimmel / Frimel",
    "svoboda": "Svoboda / Swoboda",
    "swoboda": "Svoboda / Swoboda",
    "nahlik": "Náhlík / Nahlik",
    "kunes": "Kuneš / Kunesch",
    "kunesch": "Kuneš / Kunesch",
    "steiner": "Steiner",
    "stegnar": "Steiner",
    "pleva": "Pleva",
    "plewa": "Pleva",
    "pescha": "Pešcha / Pescha",
    "brozek": "Brožek",
    "folkmer": "Folkmer / Volkmer",
    "volker": "Folkmer / Volkmer",
    "schmolk": "Schmok / Šmok",
    "schmok": "Schmok / Šmok",
    "schmock": "Schmok / Šmok",
    "smok": "Schmok / Šmok",
    "scholz": "Scholtz / Scholz",
    "scholtz": "Scholtz / Scholz",
    "schultz": "Scholtz / Scholz",
    "schulz": "Scholtz / Scholz",
    "scholzova": "Scholtz / Scholz",
    "schroller": "Schroller",
    "schrollerova": "Schroller",
    "schmid": "Schmid / Schmidt",
    "schmidt": "Schmid / Schmidt",
    "smit": "Schmid / Schmidt",
    "smide": "Schmid / Schmidt",
    "orbe": "Orbe / Orben",
    "orben": "Orbe / Orben",
    "olssler": "Ölßler / Olßler",
    "oelssler": "Ölßler / Olßler",
    "hein": "Hein / Heine",
    "heine": "Hein / Heine",
    "eppel": "Öppel / Eppel",
    "oppel": "Öppel / Eppel",
    "oeppel": "Öppel / Eppel",
    "prause": "Prause",
    "vogt": "Vogt",
    "ludwig": "Ludwig",
    "wachsmann": "Wachsmann",
    "hanig": "Hanig",
    "hanyk": "Hanig",
    "herman": "Herman",
    "hirman": "Herman",
    "seiffert": "Seiffert",
    "umlauf": "Umlauf",
    "umlaufova": "Umlauf",
    "vogel": "Vogel",
    "fogel": "Vogel",
    "vogelova": "Vogel",
    "wagner": "Wagner",
    "wagener": "Wagner",
    "wagnerova": "Wagner",
    "weber": "Weber",
}


def canon_family(raw_surname: str) -> str:
    cleaned = re.sub(r"\(\?\)|\[[^\]]*\]|\?", " ", raw_surname or "").strip()
    if not cleaned:
        return ""
    tokens = [t.strip() for t in re.split(r"[/,;]+", cleaned) if t.strip()]
    mapped = []
    for tok in tokens:
        k = norm_key(tok)
        if not k:
            continue
        if k in CANONICAL_FAMILY_ALIASES:
            mapped.append(CANONICAL_FAMILY_ALIASES[k])
        else:
            k_base = re.sub(r"(owa|ova|in|inn|e|en|n|s)$", "", k)
            mapped.append(CANONICAL_FAMILY_ALIASES.get(k_base, tok))
    if not mapped:
        return ""
    uniq = list(dict.fromkeys(mapped))
    if len(uniq) == 1:
        return uniq[0]
    return raw_surname.strip()


def load_23_1_and_1921_stats() -> tuple[dict[str, int], dict[str, set[str]]]:
    with open(DOMY_PATH, encoding="utf-8") as f:
        domy = json.load(f)
    counts_23_1: dict[str, int] = {}
    houses_1921: dict[str, set[str]] = {}
    for h in domy.get("houses", []):
        cp_str = f"čp. {h['cp']}"
        e71 = h.get("earliest_1771_1784") or {}
        for row in e71.get("repertorium_entries_for_neue") or []:
            father_name = (row.get("father") or row.get("child") or "").strip()
            if father_name:
                sur = father_name.split()[0]
                cf = canon_family(sur)
                if cf:
                    counts_23_1[cf] = counts_23_1.get(cf, 0) + 1
        c21 = h.get("census_1921") or {}
        owner = (c21.get("house_owner") or "").strip()
        if owner and owner not in ("-", "?", "Obec České Petrovice", "Stát ČSR"):
            cf = canon_family(owner.split()[0])
            if cf:
                houses_1921.setdefault(cf, set()).add(cp_str)
        for inh in c21.get("inhabitants") or []:
            nm = (inh.get("name") or "").strip()
            if nm:
                cf = canon_family(nm.split()[0])
                if cf and inh.get("relation") in ("majitel", "hospodář", "držitel", "manželka", "hlava"):
                    houses_1921.setdefault(cf, set()).add(cp_str)
    return counts_23_1, houses_1921


def compute_surname_continuity(entries: list[dict[str, Any]]) -> list[dict[str, Any]]:
    counts_23_1, houses_1921 = load_23_1_and_1921_stats()
    vol_order = ["2-8336", "83-1", "83-2", "109-1", "109-2"]
    fam_map: dict[str, dict[str, Any]] = {}

    for e in entries:
        raw_s = (e.get("surname_norm") or "").strip()
        if not raw_s or raw_s in ("-", "?", "[…]"):
            continue
        cf = canon_family(raw_s)
        if not cf:
            continue
        info = fam_map.setdefault(
            cf,
            {
                "surname": cf,
                "variants": set(),
                "earliest_year": 9999,
                "earliest_sign": "",
                "earliest_scan": 9999,
                "earliest_epistemic": "doc",
                "counts_by_volume": {v: 0 for v in vol_order},
                "total_pre_1784": 0,
            },
        )
        info["variants"].add(raw_s)
        sig = e.get("sign", "")
        if sig in info["counts_by_volume"]:
            info["counts_by_volume"][sig] += 1
        info["total_pre_1784"] += 1
        yr = int(e.get("year") or 9999)
        sc = int(e.get("scan") or 9999)
        ep = e.get("epistemic", "doc")
        # Prefer earliest undisputed record when years tie
        if (yr, 0 if ep == "doc" else 1, sc) < (
            info["earliest_year"],
            0 if info["earliest_epistemic"] == "doc" else 1,
            info["earliest_scan"],
        ):
            info["earliest_year"] = yr
            info["earliest_sign"] = sig
            info["earliest_scan"] = sc
            info["earliest_epistemic"] = ep

    out: list[dict[str, Any]] = []
    for cf, info in fam_map.items():
        c23 = counts_23_1.get(cf, 0)
        h21 = sorted(houses_1921.get(cf, set()), key=lambda x: int(re.search(r"\d+", x).group()))
        if info["total_pre_1784"] < 2 and c23 == 0 and not h21:
            continue
        note_parts = []
        if info["earliest_epistemic"] == "doc_disputed":
            note_parts.append(f"nejstarší výskyt {info['earliest_year']} sporné [Pitzßdorff]")
        if h21:
            note_parts.append(f"r. 1921 doloženo v {len(h21)} domech ({', '.join(h21[:6])}{'...' if len(h21) > 6 else ''})")
        out.append(
            {
                "surname": cf,
                "variants": sorted(info["variants"]),
                "earliest_year": info["earliest_year"],
                "earliest_sign": info["earliest_sign"],
                "earliest_scan": info["earliest_scan"],
                "counts_by_volume": info["counts_by_volume"],
                "total_pre_1784": info["total_pre_1784"],
                "count_23_1_1771_1784": c23,
                "houses_1921_count": len(h21),
                "houses_1921": h21,
                "notes": "; ".join(note_parts),
            }
        )

    out.sort(key=lambda r: (-r["total_pre_1784"], -r["count_23_1_1771_1784"], r["earliest_year"], r["surname"]))
    return out


def main() -> int:
    ap = argparse.ArgumentParser(description="Sloučí vytěžené dávky předfarních matrik do data/matriky_1591_1784.json")
    ap.add_argument("--volume", required=True, help="Signatura svazku (např. 2-8336, 83-1)")
    ap.add_argument("--slices", nargs="+", required=True, help="Cesty k slice JSON souborům")
    ap.add_argument("--status", default="completed", choices=["t0_mapped", "in_progress", "completed"])
    ap.add_argument("--inspected-summary", default="")
    ap.add_argument("--proof-scan", default="")
    ap.add_argument("--proof-caption", default="")
    args = ap.parse_args()

    with open(MASTER_PATH, encoding="utf-8") as f:
        master = json.load(f)

    new_entries: list[dict[str, Any]] = []
    seen_keys: set[tuple[Any, ...]] = set()
    slice_notes_all: list[str] = []

    for spath in args.slices:
        with open(ROOT / spath if not Path(spath).is_absolute() else spath, encoding="utf-8") as f:
            sd = json.load(f)
        if sd.get("slice_notes"):
            slice_notes_all.append(f"{Path(spath).name}: {sd['slice_notes']}")
        for e in sd.get("entries", []):
            item = dict(e)
            item["sign"] = args.volume
            sc = int(item.get("scan") or 0)
            if not item.get("scan_file"):
                pf = PROOF_SCAN_BY_KEY.get((args.volume, sc), "")
                if pf and (ROOT / pf).exists():
                    item["scan_file"] = pf
            key = (
                args.volume,
                sc,
                (item.get("record_type") or "").strip(),
                norm_key(item.get("subject") or ""),
                norm_key(item.get("date_raw") or ""),
                norm_key(item.get("father") or ""),
            )
            if key in seen_keys:
                continue
            seen_keys.add(key)
            new_entries.append(item)

    # Keep entries from other volumes, replace entries for args.volume
    other_entries = [e for e in master.get("entries", []) if e.get("sign") != args.volume]
    vol_rank = {"2-8336": 0, "83-1": 1, "83-2": 2, "109-1": 3, "109-2": 4}
    all_entries = other_entries + new_entries
    all_entries.sort(
        key=lambda e: (
            vol_rank.get(e.get("sign", ""), 99),
            int(e.get("year") or 9999),
            int(e.get("scan") or 9999),
            str(e.get("record_type") or ""),
            str(e.get("id") or ""),
        )
    )

    verified_cnt = sum(1 for e in new_entries if e.get("epistemic") != "doc_disputed")
    disputed_cnt = sum(1 for e in new_entries if e.get("epistemic") == "doc_disputed")

    completed_vols: list[str] = []
    for v in master.get("volumes", []):
        if v.get("sign") == args.volume:
            v["status"] = args.status
            v["verified_count"] = verified_cnt
            v["disputed_count"] = disputed_cnt
            if args.inspected_summary:
                v["inspected_scans_summary"] = args.inspected_summary
            if args.proof_scan:
                v["proof_scan"] = args.proof_scan
            if args.proof_caption:
                v["proof_caption"] = args.proof_caption
        if v.get("status") == "completed":
            completed_vols.append(v["sign"])

    master["entries"] = all_entries
    master["surname_continuity"] = compute_surname_continuity(all_entries)
    master["metadata"]["updated_at"] = datetime.now().isoformat(timespec="seconds")
    master["metadata"]["completed_volumes"] = completed_vols
    master["metadata"]["total_verified_entries"] = sum(1 for e in all_entries if e.get("epistemic") != "doc_disputed")
    master["metadata"]["total_disputed_entries"] = sum(1 for e in all_entries if e.get("epistemic") == "doc_disputed")

    with open(MASTER_PATH, "w", encoding="utf-8", newline="\n") as f:
        json.dump(master, f, ensure_ascii=False, indent=2)

    print(
        f"OK merged {args.volume}: verified={verified_cnt}, disputed={disputed_cnt} | "
        f"total_entries={len(all_entries)} | surname_continuity={len(master['surname_continuity'])}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
