#!/usr/bin/env python3
"""
Generátor datových JS modulů pro web České Petrovice (Böhmisch Petersdorf):
  1) data/houses.js      (const housesData = [...], 170 mapových objektů vč. 467 obyv. 1921)
  2) data/boundaries.js  (const villageBoundariesData = {...}, katastrální polygon, CENIA_POLY2, pohledy)
  3) data/references.js  (const referencesData = {...}, ČSN ISO 690 katalog, ke stažení, citace projektu)

Vstupy:
  - data/domy_1771_1921.json
  - data/archival_sources.json
  - pracovni/ruian_622702.json
  - pracovni/s1869_sampled.json
  - pracovni/s1910_complete.json
  - pracovni/s1921_slice_1.json
  - pracovni/s1921_slice_2.json
  - pracovni/s1921_slice_145_216.json
  - pracovni/s1921_prepis_217_286.md
  - Soudni pre/data/mza_nalezy.json
"""
from __future__ import annotations

import json
import math
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
ARON_1921_URL = "https://aron.vychodoceskearchivy.cz/apu/aa9e7810-4b4e-4bb6-841e-fd736ff21fa6"
ARON_1910_URL = "https://aron.vychodoceskearchivy.cz/apu/72e89763-f325-44f2-aa13-1c4166d34487"
ARON_1869_URL = "https://aron.vychodoceskearchivy.cz/apu/197cb94c-11c1-46db-958e-17538da057dc"
ARON_M23_1_URL = "https://aron.vychodoceskearchivy.cz/apu/f276e7f7-f682-47d6-b386-0ccdf304c92a"

# Ověřené optimalizované náhledy v assets/archives/ podle čp. / typu
ARCHIVE_SCANS_1921 = {
    1: ("assets/archives/scitani_1921_cp1_umlauf.jpg", "Sčítání 1921 – čp. 1 (Umlaufovi, sn. 1)"),
    7: ("assets/archives/scitani_1921_cp7_koth.jpg", "Sčítání 1921 – čp. 7 (Kothovi a Bařinkovi, sn. 13)"),
    21: ("assets/archives/scitani_1921_cp21_schroller.jpg", "Sčítání 1921 – čp. 21 (Schrollerovi, sn. 40)"),
    25: ("assets/archives/scitani_1921_cp25_fara.jpg", "Sčítání 1921 – čp. 25 (Fara, P. Vrábel, sn. 48)"),
    27: ("assets/archives/scitani_1921_cp27_skola.jpg", "Sčítání 1921 – čp. 27 (Německá škola, sn. 51–52)"),
    152: ("assets/archives/scitani_1921_cp152_mlyn.jpg", "Sčítání 1921 – čp. 152 (Scholzův vodní mlýn, sn. 269)"),
    156: ("assets/archives/scitani_1921_cp156_hostinec.jpg", "Sčítání 1921 – čp. 156 (Hostinec Pacha, sn. 277)"),
    160: ("assets/archives/scitani_1921_cp160_straz.jpg", "Sčítání 1921 – čp. 160 (Finanční stráž & učitel Gruber, sn. 285)"),
}

ARCHIVE_SCANS_1869 = {
    1: ("assets/archives/scitani_1869_cp1_umlauf.jpg", "Sčítání 1869 – čp. 1 (Umlaufovi, vložka křestní)"),
    25: ("assets/archives/scitani_1869_cp25_fara.jpg", "Sčítání 1869 – čp. 25 (Fara, P. Sabata, sn. 71)"),
    27: ("assets/archives/scitani_1869_cp27_skola.jpg", "Sčítání 1869 – čp. 27 (Obecná škola, sn. 75–76)"),
    152: ("assets/archives/scitani_1869_cp152_mlyn.jpg", "Sčítání 1869 – čp. 152 (Mlýn – prázdný po rozpisu, sn. 342)"),
}

PUBLIC_HOUSE_META = {
    1: ("Usedlost čp. 1 (Umlauf / Schroller)", "Usedlost / Starý grunt"),
    7: ("Usedlost čp. 7 (Koth / Bařinka)", "Usedlost / Rodinné stavení"),
    21: ("Usedlost čp. 21 (Schroller)", "Selský grunt"),
    25: ("Fara čp. 25", "Fara (římskokatolická)"),
    27: ("Bývalá obecná škola čp. 27", "Obecná škola (1869–1938)"),
    36: ("Hostinec & usedlost čp. 36", "Hostinec / Usedlost (1910)"),
    40: ("Usedlost / stará škola čp. 40 (st. čp. 25)", "Stavení / Historická usedlost"),
    83: ("Chalupa čp. 83 (Adler)", "Chalupa (civilní matriky)"),
    152: ("Scholzův vodní mlýn čp. 152", "Vodní mlýn (na Orlici / potoce)"),
    156: ("Hostinec čp. 156 (Pacha)", "Hostinec & sál"),
    158: ("Bývalý obecní chudobinec čp. 158", "Obecní chudobinec (1921)"),
    160: ("Finanční stráž & menšinová škola čp. 160", "Celní / finanční stráž & menšinová škola (1920–1921)"),
}


def load_json(rel: str):
    with open(ROOT / rel, encoding="utf-8") as f:
        return json.load(f)


def parse_birth_year(raw: str | None) -> int | None:
    if not raw:
        return None
    m = re.search(r"\b(1[789]\d{2})\b", str(raw))
    return int(m.group(1)) if m else None


def norm_nationality(val: str | None) -> str:
    if not val:
        return ""
    s = str(val).lower().strip()
    if "česk" in s or "čes." in s or "boehm" in s or s == "cs":
        return "česká"
    if "něm" in s or "deutsch" in s or s == "de":
        return "německá"
    return str(val).strip()


def infer_sex(name: str, rel: str, raw_sex: str = "") -> str:
    s = (raw_sex or "").lower().strip()
    if s.startswith("m"):
        return "M"
    if s.startswith("ž") or s.startswith("z") or s.startswith("f"):
        return "Ž"
    r = (rel or "").lower()
    if any(k in r for k in ["manželka", "dcera", "matka", "vnučka", "vdova", "majitelka", "babička", "sestra", "teta", "schovanka", "služebná", "družka", "švakrová"]):
        return "Ž"
    if any(k in r for k in ["syn", "manžel", "otec", "vnuk", "bratr", "strýc", "děd", "schovanec", "učedník", "pomocník"]):
        return "M"
    first_tok = (name or "").split()[0].lower() if name else ""
    if first_tok.endswith("ová") or first_tok.endswith("á"):
        return "Ž"
    return "M"


def parse_slice1_resident(text: str) -> dict:
    """Rozebere formát Slice 1: 'Příjmení Jméno (*datum, poměr, stav, ..., č. N)'."""
    s = text.strip()
    seq = None
    m_seq = re.search(r";\s*č\.\s*(\d+)\)?$", s)
    if m_seq:
        seq = int(m_seq.group(1))
    m_head = re.match(r"^([^\(]+?)\s*\((.*)\)\s*$", s)
    if not m_head:
        return {"name": s, "seq": seq}
    name = m_head.group(1).strip()
    inner = re.sub(r";\s*č\.\s*\d+\s*$", "", m_head.group(2)).strip()
    parts = [p.strip() for p in inner.split(",") if p.strip()]
    birth_date = ""
    rel = ""
    marital = ""
    nat = ""
    occ_parts = []
    notes_parts = []
    for i, p in enumerate(parts):
        pl = p.lower()
        if i == 0 and p.startswith("*"):
            birth_date = p.lstrip("*").strip()
        elif "v obci od" in pl or "návštěv" in pl or "roztrž" in pl or "částeč" in pl:
            notes_parts.append(p)
        elif pl in ("něm.", "něm", "německá", "němec", "čes.", "čes", "česká", "cizinec", "německá (cizinec)", "něm. (ciz.)"):
            nat = norm_nationality(p)
        elif "něm." in pl or "česká" in pl:
            if not nat:
                nat = norm_nationality(p)
            notes_parts.append(p)
        elif pl in ("svob.", "svobodný", "svobodná", "ženatý", "vdaná", "vdova", "vdovec", "ovdovělý", "ovdovělá", "rozvedený", "rozvedená"):
            marital = p
        elif i <= 2 and not rel and not any(k in pl for k in ["zemědělství", "tkalcov", "zedn", "hostin", "mlynář", "lesnictv", "truhlář", "obuv", "obchod"]):
            rel = p
        else:
            occ_parts.append(p)
    return {
        "name": name,
        "relation": rel,
        "sex": infer_sex(name, rel),
        "maritalStatus": marital,
        "birthDate": birth_date,
        "birthYear": parse_birth_year(birth_date),
        "birthPlace": "",
        "inVillageSince": "",
        "domovska": "",
        "nationality": nat,
        "religion": "římskokatolické",
        "literacy": "",
        "occupation": ", ".join(occ_parts),
        "employer": "",
        "occupation1914": "",
        "seq": seq,
        "notes": "; ".join(notes_parts) if notes_parts else "",
    }


def parse_slice2_resident(text: str) -> dict:
    """Rozebere formát Slice 2: '#98 Příjmení Jméno (poměr, rok/datum, něm., povolání);'."""
    s = re.sub(r"[;\.]+\s*$", "", text.strip())
    m = re.match(r"^#(\d+)\s+([^\(]+?)\s*\((.*)\)\s*$", s)
    if not m:
        return {"name": s}
    seq = int(m.group(1))
    name = m.group(2).strip()
    inner = m.group(3).strip()
    parts = [p.strip() for p in inner.split(",") if p.strip()]
    rel = ""
    marital = ""
    birth_date = ""
    birth_place = ""
    domovska = ""
    nat = ""
    occ_parts = []
    for p in parts:
        pl = p.lower()
        if not rel and not re.search(r"\b1[89]\d{2}\b", p) and pl not in ("něm.", "čes.", "německá", "česká"):
            rel = p
        elif re.search(r"^(?:\d{1,2}\.(?:/\d{1,2}\.)?\d{1,2}\.|(?:\d{1,2}\.\s*\d{1,2}\.\s*)?)1[789]\d{2}$", p) or re.match(r"^\d+\.\s*(?:[a-záčďéěíňóřšťúůýž]+\s+)?1[789]\d{2}$", pl):
            birth_date = p
        elif pl in ("svob.", "svobodný", "svobodná", "ženatý", "vdaná", "vdova", "vdovec", "ovdovělý", "ovdovělá"):
            marital = p
        elif "dom./státní" in pl or "dom." in pl:
            domovska = re.sub(r"^dom\.(?:/státní\s+příslušnost)?\s*", "", p, flags=re.I).strip()
        elif "mateřský jazyk" in pl or pl in ("něm.", "něm", "čes.", "čes", "německá", "česká"):
            nat = norm_nationality(p.replace("mateřský jazyk", "").strip())
        elif any(k in pl for k in ["německo", "čechy", "morava", "rothfloss", "králíky", "žamberk", "mezilesí"]) and not any(k in pl for k in ["dělník", "tkadl", "zedn", "hostin", "mlyn"]):
            birth_place = p
        else:
            occ_parts.append(p)
    return {
        "name": name,
        "relation": rel,
        "sex": infer_sex(name, rel),
        "maritalStatus": marital,
        "birthDate": birth_date,
        "birthYear": parse_birth_year(birth_date),
        "birthPlace": birth_place,
        "inVillageSince": "",
        "domovska": domovska,
        "nationality": nat,
        "religion": "římskokatolické",
        "literacy": "",
        "occupation": ", ".join(occ_parts),
        "employer": "",
        "occupation1914": "",
        "seq": seq,
        "notes": "",
    }


def parse_slice3_person(p: dict, sheet_owner: str = "") -> dict:
    """Převede položku z s1921_slice_145_216.json."""
    full = f"{p.get('prijmeni_2') or ''} {p.get('jmeno_3') or ''}".strip()
    dob = (p.get("datum_narozeni_7") or "").strip()
    bp = ", ".join(x for x in [p.get("rodiciste_obec_8a"), p.get("rodiciste_okres_8b"), p.get("rodiciste_zeme_8c")] if x and x != "-")
    hp = ", ".join(x for x in [p.get("domovska_obec_10a"), p.get("domovska_okres_10b"), p.get("domovska_zeme_10c")] if x and x != "-")
    occ_main = (p.get("povolani_1921_14") or "").strip()
    pos_main = (p.get("postaveni_1921_15") or "").strip()
    occ = " – ".join(x for x in [occ_main, pos_main] if x and x not in ("-", '"'))
    emp = (p.get("zavod_1921_16") or "").strip()
    if emp in ("-", '"'):
        emp = ""
    occ14 = " / ".join(x for x in [p.get("povolani_1914_18"), p.get("postaveni_1914_19")] if x and x not in ("-", '"'))
    rel = (p.get("pomer_k_majiteli_4") or "").strip()
    byt = (p.get("cislo_bytu_1a") or "").strip()
    if byt:
        rel = f"Byt {byt}: {rel}" if rel else f"Byt {byt}"
    return {
        "name": full,
        "relation": rel,
        "sex": infer_sex(full, rel, p.get("pohlavi_5") or ""),
        "maritalStatus": (p.get("rodinny_stav_6") or "").strip(),
        "birthDate": dob,
        "birthYear": parse_birth_year(dob),
        "birthPlace": bp,
        "inVillageSince": (p.get("v_obci_od_9") or "").strip(),
        "domovska": hp,
        "nationality": norm_nationality(p.get("narodnost_11")),
        "religion": (p.get("vyznani_12") or "").strip(),
        "literacy": (p.get("znalost_cteni_a_psani_13") or "").strip(),
        "occupation": occ,
        "employer": emp,
        "occupation1914": occ14,
        "seq": p.get("poznamka_poradove_cislo_20"),
        "notes": (p.get("kriticka_poznamka") or p.get("poznamka_text_20") or "").strip(),
    }


def parse_slice4_markdown() -> dict[int, dict]:
    """Parsuje všech 35 archů (čp. 120–160) a všech 133 osob (#335–#467) z pracovni/s1921_prepis_217_286.md."""
    md_path = ROOT / "pracovni" / "s1921_prepis_217_286.md"
    lines = md_path.read_text(encoding="utf-8").splitlines()

    sheets: dict[int, dict] = {}
    cur_cp: int | None = None
    cur_byt: str = ""
    last_bp: str = ""
    last_dom: str = ""
    last_relig: str = ""

    for ln in lines[73:]:
        m_h = re.match(r"^###\s+čp\.\s+(\d+)\s+\((.*?)\)(.*)$", ln)
        if m_h:
            cur_cp = int(m_h.group(1))
            meta_txt = m_h.group(2)
            tail_txt = m_h.group(3).strip(" —-")
            m_sn = re.search(r"sn\.\s*(\d+)", meta_txt)
            scan_order = int(m_sn.group(1)) if m_sn else None
            sheets[cur_cp] = {
                "cp": cur_cp,
                "scan_order": scan_order,
                "meta_raw": meta_txt,
                "subtitle": tail_txt,
                "house_owner": "",
                "households_count": 1,
                "inhabitants": [],
                "summary_note": "",
            }
            cur_byt = ""
            last_bp = ""
            last_dom = ""
            last_relig = ""
            continue

        if cur_cp is None:
            continue

        m_own = re.match(r"^-\s+\*\*Majitel domu:\*\*\s*`([^`]*)`(.*)$", ln)
        if m_own:
            sheets[cur_cp]["house_owner"] = m_own.group(1).strip()
            sheets[cur_cp]["summary_note"] = m_own.group(2).strip(" |.")
            m_hh = re.search(r"ve\s+(\d+)\s+bytech|v\s+(\d+)\s+bytech", m_own.group(2))
            if m_hh:
                sheets[cur_cp]["households_count"] = int(m_hh.group(1) or m_hh.group(2))
            continue

        m_byt = re.match(r"^-\s+\*\*Byt\s+(\d+)[^:]*:\*\*", ln)
        if m_byt:
            cur_byt = f"Byt {m_byt.group(1)}"
            continue

        m_p = re.match(r"^\s*\d+\.\s+(.*)$", ln)
        if m_p:
            body = m_p.group(1).strip()
            # Oddělí jméno před ' — '
            if " — " in body:
                name_part, rest = body.split(" — ", 1)
            else:
                name_part, rest = body, ""

            # Očistí poznámky *(sn. 234, ř. 9)*, *(Byt 1)*, *(sic)*, **tučné**
            clean_name = re.sub(r"\*\([^)]+\)\*", "", name_part)
            clean_name = re.sub(r"\*\*|\*", "", clean_name)
            clean_name = re.sub(r"\s+", " ", clean_name).strip()

            # Rozdělí středníky
            segs = [x.strip() for x in rest.split(";") if x.strip()]
            rel = re.sub(r"`|\*[^*]+\*", "", segs[0]).strip() if len(segs) > 0 else ""
            if cur_byt and cur_byt.lower() not in rel.lower():
                rel = f"{cur_byt}: {rel}" if rel else cur_byt
            m_bnote = re.search(r"\*\((Byt\s+\d+)\)\*", name_part)
            if m_bnote and m_bnote.group(1).lower() not in rel.lower():
                rel = f"{m_bnote.group(1)}: {rel}" if rel else m_bnote.group(1)

            raw_sex = ""
            marital = ""
            dob = ""
            bp = ""
            in_since = ""
            dom = ""
            nat = ""
            relig = ""
            lit = ""
            occ = ""
            emp = ""
            occ14 = ""
            seq = None

            m_seq = re.search(r"pozn\.\s*`[^`]*?\b(\d+)\s*`", rest)
            if m_seq:
                seq = int(m_seq.group(1))

            for seg in segs[1:]:
                sl = seg.lower()
                if seg.startswith("M") or seg.startswith("Ž"):
                    raw_sex = seg[0]
                elif any(sl.startswith(k) for k in ("svob", "ženat", "vdan", "ovdov", "rozved", "vdov")):
                    marital = seg.split("*")[0].strip()
                elif sl.startswith("nar."):
                    ticks = re.findall(r"`([^`]+)`", seg)
                    if ticks:
                        dob = ticks[0].strip()
                    if len(ticks) >= 2:
                        bp_raw = ticks[1].strip()
                        bp = last_bp if bp_raw == '"' else bp_raw
                        if bp:
                            last_bp = bp
                elif sl.startswith("v obci"):
                    m_t = re.search(r"`([^`]+)`", seg)
                    if m_t:
                        in_since = m_t.group(1).strip()
                elif sl.startswith("dom."):
                    m_t = re.search(r"`([^`]+)`", seg)
                    if m_t:
                        dom_raw = m_t.group(1).strip()
                        dom = last_dom if dom_raw == '"' else dom_raw
                        if dom:
                            last_dom = dom
                elif "německá" in sl or "česká" in sl or "polská" in sl or "maďarská" in sl:
                    if not nat and ("`německá`" in sl or "`česká`" in sl or seg.startswith("`")):
                        m_t = re.search(r"`([^`]+)`", seg)
                        if m_t:
                            nat = norm_nationality(m_t.group(1))
                elif "katol" in sl or "evang" in sl or "bez vyznání" in sl or "vyzn" in sl:
                    m_t = re.search(r"`([^`]+)`", seg)
                    if m_t:
                        r_raw = m_t.group(1).strip()
                        relig = "římskokatolické" if "katol" in r_raw.lower() else r_raw
                        last_relig = relig
                elif seg == '`"`' or seg.startswith('`"` ('):
                    if not relig and last_relig:
                        relig = last_relig
                    elif not lit:
                        lit = "čísti i psáti"
                elif "čísti" in sl or seg.strip("` ") in ("(3)", "(15)", "(16)", "čísti i psáti", "čísti a psáti"):
                    lit = seg.strip("` ")
                elif sl.startswith("1914:"):
                    ticks = re.findall(r"`([^`]+)`", seg)
                    occ14 = " / ".join(t for t in ticks if t not in ('"', "-", "–"))
                elif sl.startswith("pozn."):
                    continue
                elif "/" in seg and not sl.startswith("nar."):
                    ticks = re.findall(r"`([^`]+)`", seg)
                    if ticks:
                        p_occ = ticks[0].strip()
                        p_pos = ticks[1].strip() if len(ticks) > 1 else ""
                        p_emp = ticks[2].strip() if len(ticks) > 2 else ""
                        if p_occ not in ('"', "-", "–"):
                            occ = p_occ + (f" ({p_pos})" if p_pos and p_pos not in ('"', "-", "–") else "")
                        elif p_pos and p_pos not in ('"', "-", "–"):
                            occ = p_pos
                        if p_emp and p_emp not in ('"', "-", "–"):
                            emp = p_emp

            sheets[cur_cp]["inhabitants"].append({
                "name": clean_name,
                "relation": rel,
                "sex": infer_sex(clean_name, rel, raw_sex),
                "maritalStatus": marital,
                "birthDate": dob,
                "birthYear": parse_birth_year(dob),
                "birthPlace": bp,
                "inVillageSince": in_since,
                "domovska": dom,
                "nationality": nat,
                "religion": relig or last_relig or "římskokatolické",
                "literacy": lit,
                "occupation": occ,
                "employer": emp,
                "occupation1914": occ14,
                "seq": seq,
                "notes": "",
            })

    return sheets


def load_all_1921_sheets() -> dict[int, dict]:
    """Načte a sloučí všechny 4 disjunktní úseky sčítání 1921 a ověří součet 467 osob / 143 archů."""
    by_cp: dict[int, dict] = {}

    # Úsek 1: čp. 1–38 (pracovni/s1921_slice_1.json)
    s1 = load_json("pracovni/s1921_slice_1.json")
    for sh in s1:
        cp = int(sh["cp"])
        inh = [parse_slice1_resident(r) for r in (sh.get("residents_summary") or [])]
        by_cp[cp] = {
            "cp": cp,
            "scan_order": sh.get("scan_order"),
            "house_owner": sh.get("house_owner") or "",
            "inhabited": bool(sh.get("inhabited")),
            "households_count": sh.get("households_count") or (1 if inh else 0),
            "inhabitants": inh,
            "notes": sh.get("notes") or "",
        }

    # Úsek 2: čp. 39–76 (pracovni/s1921_slice_2.json, vč. sn. 114 čp. 61 a sn. 141 čp. 45)
    s2 = load_json("pracovni/s1921_slice_2.json")
    for sc in s2["scans"]:
        if sc.get("sheet_type") == "back_blank":
            continue
        cp = int(sc["cp"])
        txt = (sc.get("residents_summary") or "").strip()
        inh_new = []
        if txt:
            for part in re.split(r"(?=#\d+\s)", txt):
                part = part.strip()
                if part.startswith("#"):
                    inh_new.append(parse_slice2_resident(part))
        if cp not in by_cp:
            by_cp[cp] = {
                "cp": cp,
                "scan_order": sc.get("scan_order"),
                "house_owner": sc.get("house_owner") or "",
                "inhabited": bool(sc.get("inhabited")),
                "households_count": sc.get("households_count") or (1 if inh_new else 0),
                "inhabitants": inh_new,
                "notes": sc.get("notes") or "",
            }
        else:
            # Rubová strana pokračování (např. čp. 61 sn. 114)
            by_cp[cp]["inhabitants"].extend(inh_new)
            if sc.get("notes"):
                by_cp[cp]["notes"] = (by_cp[cp]["notes"] + " " + sc["notes"]).strip()

    # Úsek 3: čp. 77–119 (pracovni/s1921_slice_145_216.json)
    s3 = load_json("pracovni/s1921_slice_145_216.json")
    for sh in s3["sheets"]:
        cp = int(sh["cislo_orientacni_cp"])
        owner = sh.get("majitel_domu") or ""
        persons = sh.get("persons") or []
        inh = [parse_slice3_person(p, owner) for p in persons]
        byt_nums = set(str(p.get("cislo_bytu_1a") or "1").strip() or "1" for p in persons)
        by_cp[cp] = {
            "cp": cp,
            "scan_order": sh.get("scan_front"),
            "house_owner": owner,
            "inhabited": len(inh) > 0,
            "households_count": len(byt_nums) if inh else 0,
            "inhabitants": inh,
            "notes": (sh.get("house_note") or sh.get("hlavicka_poznamka") or "").strip(),
        }

    # Úsek 4: čp. 120–160 (pracovni/s1921_prepis_217_286.md)
    s4 = parse_slice4_markdown()
    for cp, sh in s4.items():
        by_cp[cp] = {
            "cp": cp,
            "scan_order": sh.get("scan_order"),
            "house_owner": sh.get("house_owner") or "",
            "inhabited": len(sh["inhabitants"]) > 0,
            "households_count": sh.get("households_count") or (1 if sh["inhabitants"] else 0),
            "inhabitants": sh["inhabitants"],
            "notes": (sh.get("subtitle") + (" | " + sh["summary_note"] if sh.get("summary_note") else "")).strip(" |"),
        }

    total_sheets = len(by_cp)
    total_inh = sum(len(v["inhabitants"]) for v in by_cp.values())
    assert total_sheets == 143, f"Očekáváno 143 archů 1921, zjištěno {total_sheets}"
    assert total_inh == 467, f"Očekáváno 467 obyvatel 1921, zjištěno {total_inh}"
    print(f"OK 1921 sčítání: {total_sheets} archů, {total_inh} obyvatel (97 + 119 + 118 + 133)")
    return by_cp


def parse_1869_resident(raw: str) -> dict:
    """Převede položku z pracovni/s1869_sampled.json do čitelného záznamu obyvatele."""
    s = raw.strip()
    m_star = re.search(r"\(\*(?:ca\.\s*)?(\d{4})([^)]*)\)", s)
    byear = int(m_star.group(1)) if m_star else None
    name_part = s.split("(")[0].strip().rstrip(",")
    # Zachová poctivé čtení i u zakrytých archů bez vymýšlení jmen
    occ = ""
    rel = "Obyvatel (vzorek 1869)"
    if ":" in s and not s.startswith("Sabata") and ("řádky zakryty" in s.lower() or "zakryt" in s.lower() or "strana" in s.lower()):
        occ = s
    elif m_star:
        tail = [x.strip() for x in m_star.group(2).split(",") if x.strip()]
        if tail:
            occ = ", ".join(tail)
    elif ":" in name_part:
        name_part, occ = [x.strip() for x in name_part.split(":", 1)]
    return {
        "name": name_part or "Záznam 1869",
        "relation": rel,
        "sex": infer_sex(name_part, occ),
        "maritalStatus": "",
        "birthDate": str(byear) if byear else "",
        "birthYear": byear,
        "birthPlace": "",
        "inVillageSince": "",
        "domovska": "",
        "nationality": "",
        "religion": "římskokatolické",
        "literacy": "",
        "occupation": occ or s,
        "employer": "",
        "occupation1914": "",
        "notes": "Výběrový přepis ze sčítání lidu 1869 (SOkA Ústí nad Orlicí / ARON SOA HK)",
    }


def classify_sector(lat: float, lon: float) -> str:
    if lat >= 50.1255 or lon >= 16.615:
        return "Hřeben / Adam & hranice"
    if lon < 16.5935:
        return "Západní díl (k Mladkovu)"
    if 16.5935 <= lon <= 16.5975 and 50.1205 <= lat <= 50.1245:
        return "Jádro u kostela a fary"
    if lon <= 16.605:
        return "Střední díl"
    return "Východní díl (k Čiháku)"


def compute_approx_coords(cp: int, ruian_by_cp: dict[int, tuple[float, float]]) -> tuple[float, float]:
    """Interpoluje orientační souřadnici pro zaniklá čp. mezi nejbližšími dochovanými sousedními čp."""
    existing_cps = sorted(ruian_by_cp.keys())
    lowers = [c for c in existing_cps if c < cp]
    uppers = [c for c in existing_cps if c > cp]
    if lowers and uppers:
        c1, c2 = lowers[-1], uppers[0]
        t = (cp - c1) / (c2 - c1)
        lat1, lon1 = ruian_by_cp[c1]
        lat2, lon2 = ruian_by_cp[c2]
        lat = lat1 + t * (lat2 - lat1)
        lon = lon1 + t * (lon2 - lon1)
    elif uppers:
        lat, lon = ruian_by_cp[uppers[0]]
    else:
        lat, lon = ruian_by_cp[lowers[-1]]
    # Jemný deterministický rozestup (~16 m), aby se značky zaniklých domů nepřekrývaly
    angle = ((cp * 137.5) % 360) * math.pi / 180.0
    lat += 0.00014 * math.sin(angle)
    lon += 0.00022 * math.cos(angle)
    return (round(lat, 6), round(lon, 6))


def fit_poly2_3857_to_5514(ruian_buildings: list[dict]) -> dict:
    """Načte všechny body (lat, lon) <-> (sjtsk_x, sjtsk_y) a spočítá 2. řád polynomu metodou nejmenších čtverců."""
    R = 6378137.0
    pts = []
    for b in ruian_buildings:
        lat, lon = b.get("lat"), b.get("lon")
        sx_t, sy_t = b.get("sjtsk_x"), b.get("sjtsk_y")
        if lat and lon and sx_t and sy_t:
            mx = R * math.radians(lon)
            my = R * math.log(math.tan(math.pi / 4.0 + math.radians(lat) / 2.0))
            pts.append((mx, my, sx_t, sy_t))

    n = len(pts)
    assert n >= 20, f"Příliš málo bodů pro CENIA_POLY2: {n}"
    cx = sum(p[0] for p in pts) / n
    cy = sum(p[1] for p in pts) / n
    sx = math.sqrt(sum((p[0] - cx) ** 2 for p in pts) / n)
    sy = math.sqrt(sum((p[1] - cy) ** 2 for p in pts) / n)

    A_rows = []
    bx_vec = []
    by_vec = []
    for mx, my, tx, ty in pts:
        u = (mx - cx) / sx
        v = (my - cy) / sy
        A_rows.append([1.0, u, v, u * u, u * v, v * v])
        bx_vec.append(tx)
        by_vec.append(ty)

    def solve_lsq(A, b):
        m = 6
        ATA = [[sum(A[k][i] * A[k][j] for k in range(len(A))) for j in range(m)] for i in range(m)]
        ATb = [sum(A[k][i] * b[k] for k in range(len(A))) for i in range(m)]
        aug = [ATA[i] + [ATb[i]] for i in range(m)]
        for col in range(m):
            piv = max(range(col, m), key=lambda r: abs(aug[r][col]))
            aug[col], aug[piv] = aug[piv], aug[col]
            div = aug[col][col]
            for j in range(col, m + 1):
                aug[col][j] /= div
            for r in range(m):
                if r != col and aug[r][col] != 0:
                    fac = aug[r][col]
                    for j in range(col, m + 1):
                        aug[r][j] -= fac * aug[col][j]
        return [aug[i][m] for i in range(m)]

    kx = solve_lsq(A_rows, bx_vec)
    ky = solve_lsq(A_rows, by_vec)

    sq_err = 0.0
    for row, tx, ty in zip(A_rows, bx_vec, by_vec):
        px = sum(kx[i] * row[i] for i in range(6))
        py = sum(ky[i] * row[i] for i in range(6))
        sq_err += (px - tx) ** 2 + (py - ty) ** 2
    rmse = math.sqrt(sq_err / n)
    assert rmse < 0.1, f"CENIA_POLY2 RMSE {rmse:.4f} m překračuje limit 0.1 m"
    print(f"OK CENIA_POLY2 z {n} bodů RÚIAN: RMSE = {rmse:.4f} m")
    return {
        "cx": round(cx, 6),
        "cy": round(cy, 6),
        "sx": round(sx, 6),
        "sy": round(sy, 6),
        "kx": [round(v, 8) for v in kx],
        "ky": [round(v, 8) for v in ky],
        "rmseM": round(rmse, 4),
        "pointCount": n,
    }


def fetch_ruian_boundary_and_church() -> tuple[list[list[float]], bool, tuple[float, float]]:
    """Pokusí se načíst hranici k. ú. 622702 a kostel st. p. 57 z ČÚZK RÚIAN s krátkým timeoutem."""
    ku_rings = []
    church_coords = (50.12256, 16.59488)
    is_approx = True

    try:
        q = urllib.parse.urlencode({"where": "kod=622702", "outFields": "kod,nazev", "f": "geojson", "outSR": "4326"})
        url = f"https://ags.cuzk.gov.cz/arcgis/rest/services/RUIAN/Vyhledavaci_sluzba_na_data_RUIAN/MapServer/7/query?{q}"
        req = urllib.request.Request(url, headers={"User-Agent": "CeskePetroviceWeb/1.0"})
        with urllib.request.urlopen(req, timeout=8) as resp:
            gj = json.loads(resp.read().decode("utf-8"))
        feats = gj.get("features") or []
        if feats:
            geom = feats[0]["geometry"]
            coords = geom["coordinates"]
            if geom["type"] == "Polygon":
                for ring in coords:
                    ku_rings.append([[round(pt[1], 6), round(pt[0], 6)] for pt in ring])
                is_approx = False
            elif geom["type"] == "MultiPolygon":
                for poly in coords:
                    for ring in poly:
                        ku_rings.append([[round(pt[1], 6), round(pt[0], 6)] for pt in ring])
                is_approx = False
            print(f"OK Živá hranice k.ú. 622702 z ČÚZK ({len(ku_rings)} prstence)")
    except Exception as ex:
        print(f"INFO Živá hranice k.ú. 622702 nedostupná ({ex}) -> použit záložní polygon z ruian_622702.json")

    try:
        q0 = urllib.parse.urlencode({"where": "katastralniuzemi=622702 AND cisloparcely='57'", "outFields": "cisloparcely,vymeraparcely", "f": "geojson", "outSR": "4326"})
        url0 = f"https://ags.cuzk.gov.cz/arcgis/rest/services/RUIAN/Vyhledavaci_sluzba_na_data_RUIAN/MapServer/0/query?{q0}"
        req0 = urllib.request.Request(url0, headers={"User-Agent": "CeskePetroviceWeb/1.0"})
        with urllib.request.urlopen(req0, timeout=8) as resp0:
            gj0 = json.loads(resp0.read().decode("utf-8"))
        feats0 = gj0.get("features") or []
        if feats0 and feats0[0].get("geometry"):
            ring0 = feats0[0]["geometry"]["coordinates"][0]
            if isinstance(ring0[0][0], list):
                ring0 = ring0[0]
            lat_c = sum(p[1] for p in ring0) / len(ring0)
            lon_c = sum(p[0] for p in ring0) / len(ring0)
            church_coords = (round(lat_c, 6), round(lon_c, 6))
            print(f"OK Živá parcela kostela st. p. 57: {church_coords}")
    except Exception:
        pass

    return ku_rings, is_approx, church_coords


def convex_hull_wgs84(points: list[tuple[float, float]]) -> list[list[float]]:
    """Jednoduchá konvexní obálka v (lat, lon) s mírným okrajem jako čistý fallback."""
    pts = sorted(set(points))
    if len(pts) < 3:
        return [[p[0], p[1]] for p in pts]

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower = []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    upper = []
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    hull = lower[:-1] + upper[:-1]
    c_lat = sum(p[0] for p in hull) / len(hull)
    c_lon = sum(p[1] for p in hull) / len(hull)
    padded = []
    for lat, lon in hull:
        padded.append([round(c_lat + 1.12 * (lat - c_lat), 6), round(c_lon + 1.12 * (lon - c_lon), 6)])
    padded.append(padded[0])
    return padded


def build_houses(c21_by_cp: dict[int, dict], church_coords: tuple[float, float]) -> list[dict]:
    domy = load_json("data/domy_1771_1921.json")
    s69 = load_json("pracovni/s1869_sampled.json")["houses"]
    s10 = load_json("pracovni/s1910_complete.json")
    ruian_raw = load_json("pracovni/ruian_622702.json")

    s10_po_by_cp = {str(r["cp"]): r for r in s10["population"]["rows"]}
    s10_pz_by_cp = {str(r["cp"]): r for r in s10["livestock"]["rows"]}
    s10_hilf_by_cp = {str(r["cp"]): r for r in s10["hilfsausweis"]["rows"]}

    ruian_by_cp: dict[int, tuple[float, float]] = {}
    for b in ruian_raw["buildings"]:
        if b.get("typ_kod") == 1 and str(b.get("cislodomovni") or "").isdigit():
            cnum = int(b["cislodomovni"])
            if 1 <= cnum <= 160 and b.get("lat") and b.get("lon"):
                ruian_by_cp[cnum] = (b["lat"], b["lon"])

    houses_out: list[dict] = []

    for rec in domy["houses"]:
        cp = int(rec["cp"])
        r_cur = rec.get("ruian_current") or {}
        exists_2026 = bool(r_cur.get("exists_2026") and r_cur.get("lat") and r_cur.get("lon"))

        if exists_2026:
            lat, lon = float(r_cur["lat"]), float(r_cur["lon"])
            precision = "ruian_verified"
            parcel_txt = r_cur.get("parcela_cislo") or ""
            area_m2 = r_cur.get("zastavena_plocha_m2")
            loc_source = f"ČÚZK RÚIAN (SO {r_cur.get('so_kod')}, {parcel_txt}, {area_m2} m²)"
            ruian_code = r_cur.get("so_kod")
        else:
            lat, lon = compute_approx_coords(cp, ruian_by_cp)
            precision = "approx_vanished"
            parcel_txt = "nedochováno v RÚIAN"
            area_m2 = None
            loc_source = "Orientační poloha interpolovaná z řady sousedních čp. v RÚIAN (stavení zaniklé po r. 1921)"
            ruian_code = None

        sector = classify_sector(lat, lon)
        custom_meta = PUBLIC_HOUSE_META.get(cp)
        c21 = c21_by_cp.get(cp)
        c69 = s69.get(str(cp))
        c10_po = s10_po_by_cp.get(str(cp))
        c10_pz = s10_pz_by_cp.get(str(cp))
        e71 = rec.get("earliest_1771_1784") or {}
        subs10 = rec.get("sub_houses_1910") or []

        if custom_meta:
            local_name, htype = custom_meta
        elif not exists_2026:
            owner_hint = c21["house_owner"] if c21 and c21.get("house_owner") else ""
            local_name = f"Zaniklé stavení čp. {cp}" + (f" ({owner_hint})" if owner_hint else "")
            htype = "Zaniklé stavení"
        else:
            owner_hint = c21["house_owner"] if c21 and c21.get("house_owner") else ""
            local_name = f"Stavení čp. {cp}" + (f" ({owner_hint})" if owner_hint else "")
            htype = "Usedlost / Rodinný dům"

        # Popis domu
        desc_parts = [f"Historické číslo popisné {cp} v Českých Petrovicích (Böhmisch Petersdorf), sektor {sector}."]
        if exists_2026:
            desc_parts.append(f"Objekt v RÚIAN 2026 evidován na stavební parcele {parcel_txt} (zastavěná plocha {area_m2} m²).")
        else:
            desc_parts.append("Stavení zaniklo v průběhu 20. století (chybí v aktuální evidenci RÚIAN 2026; bod na mapě má orientační polohu).")

        conc_notes = []
        for c in (e71.get("repertorium_from_alte") or []):
            conc_notes.append(f"přijalo nové čp. {cp} po starém č. {c.get('alte')} (rod {c.get('sample_family')})")
        for c in (e71.get("repertorium_to_neue") or []):
            conc_notes.append(f"staré č. {cp} (1771–1784, rod {c.get('sample_family')}) přečíslováno 1805/1806 na čp. {c.get('neue')}")
        if conc_notes:
            desc_parts.append("Konkordance Repertoria 23-1 (1771–1806): " + "; ".join(conc_notes) + ".")

        # Timeline
        timeline = []
        alte_entries = e71.get("as_alte_entries") or []
        neue_entries = e71.get("repertorium_entries_for_neue") or []
        if alte_entries or neue_entries or conc_notes:
            sample_e = (alte_entries or neue_entries)[0] if (alte_entries or neue_entries) else None
            ev_txt = "; ".join(conc_notes) if conc_notes else f"{len(alte_entries)} matričních zápisů (1771–1784)"
            if sample_e:
                f_str = sample_e.get("father") or sample_e.get("mother") or "rodina"
                ev_txt += f". První zachycený zápis: {sample_e.get('date')} – {f_str}, dítě {sample_e.get('child')} ({sample_e.get('status') or 'obyvatel'})."
            timeline.append({
                "year": "1771–1806",
                "owner": sample_e.get("father") or "Kožíškovo Repertorium" if sample_e else "Repertorium 23-1",
                "event": ev_txt,
                "source": "SOA Hradec Králové, Sbírka matrik Východočeského kraje, sign. 23-1 (1770–1784) & Repertorium 1805/1806.",
                "sourceType": "verified",
                "scanFile": "assets/archives/matrika_23_1_repertorium_s35.jpg" if conc_notes else "assets/archives/matrika_23_1_1771_cp.jpg",
                "archiveUrl": ARON_M23_1_URL,
            })

        # Census záznamy [1869?, 1910?, 1921?]
        censuses = []
        if c69:
            c69_inh = [parse_1869_resident(r) for r in (c69.get("residents_summary") or [])]
            s69_scan = ARCHIVE_SCANS_1869.get(cp)
            censuses.append({
                "year": 1869,
                "date": "31. 12. 1869",
                "archiveSource": "SOkA Ústí nad Orlicí (OÚ Žamberk)",
                "source": f"Sčítání lidu 1869, České Petrovice čp. {cp} (ARON SOA HK, sn. {c69.get('scan_inside') or '-'})",
                "originalUrl": c69.get("aron_permalink_inside") or ARON_1869_URL,
                "scanFile": s69_scan[0] if s69_scan else "",
                "scanTitle": s69_scan[1] if s69_scan else "",
                "inhabited": bool(c69.get("inhabited")),
                "householdsCount": c69.get("wohnparteien") or (1 if c69.get("inhabited") else 0),
                "isSample": True,
                "note": c69.get("notes") or f"Přítomných {c69.get('present_count', 0)}, nepřítomných {c69.get('absent_count', 0)}.",
                "livestock": c69.get("livestock"),
                "inhabitants": c69_inh,
            })
            timeline.append({
                "year": "1869",
                "owner": c69.get("head_name") or f"Obyvatelé čp. {cp}",
                "event": f"Výběrový vzorek sčítání 1869: {c69.get('present_count', 0)} přítomných / {c69.get('absent_count', 0)} nepřítomných osob ({c69.get('head_occupation') or '-'}).",
                "source": f"SOkA Ústí nad Orlicí, OÚ Žamberk – Sčítání lidu 1869 (sn. {c69.get('scan_inside') or '-'}).",
                "sourceType": "verified",
                "scanFile": s69_scan[0] if s69_scan else "",
                "archiveUrl": c69.get("aron_permalink_inside") or ARON_1869_URL,
            })

        census_1910_meta = None
        if c10_po or c10_pz:
            de_cnt = int(c10_po.get("sprache_deutsch", 0)) if c10_po else 0
            cs_cnt = int(c10_po.get("sprache_boehmisch", 0)) if c10_po else 0
            pres_cnt = int(c10_po.get("anwesend_gesamt", 0)) if c10_po else 0
            abs_cnt = int(c10_po.get("abwesend_gesamt", 0)) if c10_po else 0
            fremde_cnt = int(c10_po.get("fremde_staaten", 0)) if c10_po else 0
            lv10 = None
            if c10_pz:
                lv10 = {
                    "horses": c10_pz.get("pferde_gesamt", 0),
                    "cattle": c10_pz.get("rinder_gesamt", 0),
                    "goats": c10_pz.get("ziegen", 0),
                    "pigs": c10_pz.get("schweine_gesamt_actual", 0),
                    "poultry": c10_pz.get("gefluegel_gesamt", 0),
                    "beehives": c10_pz.get("bienenstoecke_gesamt", 0),
                }
            census_1910_meta = {
                "present": pres_cnt,
                "de": de_cnt,
                "cs": cs_cnt,
                "fremde": fremde_cnt,
                "absent": abs_cnt,
                "inhabitants_households": c10_po.get("wohnparteien", 0) if c10_po else 0,
                "inhabited": bool(c10_po.get("bewohnt")) if c10_po else False,
                "hilfsausweis": s10_hilf_by_cp.get(str(cp)),
                "livestock": lv10,
                "subHouses": [
                    {
                        "cp": sh.get("cp"),
                        "present": (sh.get("population") or {}).get("anwesend_gesamt", 0),
                        "de": (sh.get("population") or {}).get("sprache_deutsch", 0),
                        "cs": (sh.get("population") or {}).get("sprache_boehmisch", 0),
                        "livestock": {
                            "horses": (sh.get("livestock") or {}).get("pferde_gesamt", 0),
                            "cattle": (sh.get("livestock") or {}).get("rinder_gesamt", 0),
                            "goats": (sh.get("livestock") or {}).get("ziegen", 0),
                            "pigs": (sh.get("livestock") or {}).get("schweine_gesamt_actual", 0),
                            "poultry": (sh.get("livestock") or {}).get("gefluegel_gesamt", 0),
                        } if sh.get("livestock") else None,
                    }
                    for sh in subs10
                ],
                "scanFile": "assets/archives/scitani_1910_po_s10.jpg" if cp == 160 else "assets/archives/scitani_1910_po_s02.jpg",
                "livestockScanFile": "assets/archives/scitani_1910_pz_s08.jpg" if (c10_pz and c10_pz.get("sheet") == "s1910_pz_08") else "assets/archives/scitani_1910_pz_s02.jpg",
            }
            ev10 = f"Součet 1910 (PO/PZ): {pres_cnt} přítomných osob ({de_cnt} něm., {cs_cnt} čes." + (f", {fremde_cnt} ciz." if fremde_cnt else "") + f"; {abs_cnt} nepřítomných)."
            if lv10 and (lv10["cattle"] or lv10["horses"] or lv10["goats"]):
                ev10 += f" Zvířectvo: {lv10['horses']} koní, {lv10['cattle']} skotu, {lv10['goats']} koz, {lv10['pigs']} prasat."
            timeline.append({
                "year": "1910",
                "owner": f"Sčítací sumář 1910 (čp. {cp})",
                "event": ev10,
                "source": "SOkA Ústí nad Orlicí, OÚ Žamberk – Sčítání 1910 (Přehled obyvatelstva & Přehled zvířectva).",
                "sourceType": "verified",
                "scanFile": census_1910_meta["scanFile"],
                "archiveUrl": ARON_1910_URL,
            })

        if c21:
            s21_scan = ARCHIVE_SCANS_1921.get(cp)
            censuses.append({
                "year": 1921,
                "date": "15. 2. 1921",
                "archiveSource": "SOkA Ústí nad Orlicí (OÚ Žamberk, s. o. Králíky)",
                "source": f"Sčítání lidu 1921, České Petrovice čp. {cp} (ARON SOA HK, sn. {c21.get('scan_order') or '-'})",
                "originalUrl": ARON_1921_URL,
                "scanFile": s21_scan[0] if s21_scan else "",
                "scanTitle": s21_scan[1] if s21_scan else f"Sčítání 1921 – čp. {cp} (sn. {c21.get('scan_order')})",
                "inhabited": c21["inhabited"],
                "householdsCount": c21["households_count"],
                "isSample": False,
                "houseOwner": c21["house_owner"],
                "note": c21.get("notes") or "",
                "inhabitants": c21["inhabitants"],
            })
            timeline.append({
                "year": "1921",
                "owner": c21.get("house_owner") or f"Majitel čp. {cp}",
                "event": (
                    f"Sčítání lidu 15. 2. 1921: {len(c21['inhabitants'])} přítomných osob v {c21['households_count'] or 1} domácnosti."
                    if c21["inhabitants"] else "Sčítací arch 1921 dochován jako neobydlené stavení (0 osob)."
                ),
                "source": f"SOkA Ústí nad Orlicí, OÚ Žamberk – Sčítání lidu 1921, sn. {c21.get('scan_order') or '-'}.",
                "sourceType": "verified",
                "scanFile": s21_scan[0] if s21_scan else "",
                "archiveUrl": ARON_1921_URL,
            })

        # Specifické dokumenty podle čp.
        docs = []
        if cp == 7:
            docs.append({
                "type": "Matrika & Paměť",
                "year": "1911–1945",
                "title": "Dům rodin Koth a Bařinka (rodiště Františka Bařinky *5. 1. 1911)",
                "description": "Zde žila rodina Kothova (křestní zápisy v matrice 23-6334) a narodil se československý finanční úředník a odbojář František Bařinka († 3. 5. 1945 na lodi Thielbek, pohřben v Sandby v Dánsku).",
                "source": "SOA HK sign. 23-6334; Vojenská kmenová kniha; Památník Terezín / Sandby.",
                "scanFile": "assets/archives/matrika_23_6334_1919_koth.jpg",
                "originalUrl": ARON_1921_URL,
            })
        elif cp == 83:
            docs.append({
                "type": "Civilní matrika",
                "year": "1922–1928",
                "title": "Civilní úmrtí / sňatek u OÚ Žamberk (Filomena Adlerová)",
                "description": "Příklad obyvatel bez vyznání v pohraničí evidovaných civilními knihami OÚ Žamberk (sign. 6376, 8272).",
                "source": "SOA HK, OÚ Žamberk, civilní matriky sign. 6376 a 8272.",
                "scanFile": "assets/archives/civil_8272_petrovice.jpg",
                "originalUrl": "https://aron.vychodoceskearchivy.cz/apu/72d83ec6-aa33-4a91-b03a-d62f5a0ee62e",
            })
        elif cp == 160:
            docs.append({
                "type": "Menšinová škola & Stráž",
                "year": "1920–1923",
                "title": "Česká menšinová škola, Finanční stráž & František Šlesinger",
                "description": "V čp. 160 sídlilo v roce 1921 6 Čechů (5 členů Pohraniční finanční stráže vč. vrchního strážmistra F. Šlesingera a učitel Josef Gruber, sčítací komisař). Dobový tisk Naše menšiny (1923) popisuje boj o umístění české školy.",
                "source": "Naše menšiny, 1923, s. 84–85; Sčítání 1921 sn. 285.",
                "scanFile": "assets/archives/tisk_1923_nase_mensiny_p84.jpg",
                "originalUrl": ARON_1921_URL,
            })

        houses_out.append({
            "id": f"cp{cp}",
            "number": str(cp),
            "localName": local_name,
            "type": htype,
            "isHeritage": cp in (25, 27, 152, 160),
            "exists2026": exists_2026,
            "sector": sector,
            "location": {
                "lat": lat,
                "lng": lon,
                "precision": precision,
                "cadastralParcel": parcel_txt,
                "areaM2": area_m2,
                "ruianCode": ruian_code,
                "source": loc_source,
            },
            "description": " ".join(desc_parts),
            "statusStableCadastre": "Stabilní katastr 1840 (č. k. 622702) — grafický otisk není v ÚAZK online stažen; historická výměra k.ú. 629,83 ha.",
            "cadastreSource": "ČÚZK RÚIAN 2026 & Stabilní katastr 1840 (k.ú. 622702 České Petrovice).",
            "earliest1771": {
                "alteEntries": e71.get("as_alte_entries") or [],
                "neueEntries": e71.get("repertorium_entries_for_neue") or [],
                "fromAlte": e71.get("repertorium_from_alte") or [],
                "toNeue": e71.get("repertorium_to_neue") or [],
            },
            "census1910Meta": census_1910_meta,
            "timeline": timeline,
            "census": censuses,
            "documents": docs,
        })

    # Post-1921 domy čp. 161, 162, 163
    for p21 in domy["metadata"]["post_1921_and_evidencni"]["post_1921_cp"]:
        cnum = int(p21["cislo"])
        lat, lon = float(p21["lat"]), float(p21["lon"])
        houses_out.append({
            "id": f"cp{cnum}",
            "number": str(cnum),
            "localName": f"Novější objekt čp. {cnum} (po r. 1921)",
            "type": "Objekt po r. 1921",
            "isHeritage": False,
            "exists2026": True,
            "isPost1921": True,
            "sector": classify_sector(lat, lon),
            "location": {
                "lat": lat,
                "lng": lon,
                "precision": "ruian_verified",
                "cadastralParcel": p21.get("parcela_cislo") or "",
                "areaM2": p21.get("zastavena_plocha_m2"),
                "ruianCode": p21.get("so_kod"),
                "source": f"ČÚZK RÚIAN 2026 (SO {p21.get('so_kod')}, {p21.get('parcela_cislo')})",
            },
            "description": f"Novostavba či dostavba čp. {cnum} vzniklá po sčítání lidu z 15. 2. 1921 (chybí v řadě archů 1921 čp. 1–160).",
            "statusStableCadastre": "Postaveno po r. 1921.",
            "cadastreSource": "ČÚZK RÚIAN 2026",
            "timeline": [],
            "census": [],
            "documents": [],
        })

    # Rekreační objekty č. ev. 32, 82, 99, 107, 111, 117
    for cev in domy["metadata"]["post_1921_and_evidencni"]["evidencni_cev"]:
        cnum = int(cev["cislo"])
        lat, lon = float(cev["lat"]), float(cev["lon"])
        houses_out.append({
            "id": f"cev{cnum}",
            "number": f"ev. {cnum}",
            "localName": f"Rekreační objekt č. ev. {cnum}",
            "type": "Chata / Rekreační objekt (č. ev.)",
            "isHeritage": False,
            "exists2026": True,
            "isEvidencni": True,
            "sector": classify_sector(lat, lon),
            "location": {
                "lat": lat,
                "lng": lon,
                "precision": "ruian_verified",
                "cadastralParcel": cev.get("parcela_cislo") or "",
                "areaM2": cev.get("zastavena_plocha_m2"),
                "ruianCode": cev.get("so_kod"),
                "source": f"ČÚZK RÚIAN 2026 (SO {cev.get('so_kod')}, {cev.get('parcela_cislo')})",
            },
            "description": f"Objekt individuální rekreace č. ev. {cnum} v katastru Českých Petrovic ({cev.get('zastavena_plocha_m2')} m²).",
            "statusStableCadastre": "Rekreační zástavba z 2. poloviny 20. století.",
            "cadastreSource": "ČÚZK RÚIAN 2026",
            "timeline": [],
            "census": [],
            "documents": [],
        })

    # Památkový objekt: Kostel sv. Petra a Pavla (ÚSKP 1000146326_0001)
    houses_out.append({
        "id": "kostel_sv_petra_a_pavla",
        "number": "st. p. 57",
        "localName": "Kostel sv. Petra a Pavla",
        "type": "Kulturní památka (sakrální architektura)",
        "isHeritage": True,
        "exists2026": True,
        "uskpNumber": "1000146326_0001",
        "npuDirectUrl": "https://pamatkovykatalog.cz/kostel-sv-petra-a-pavla-18704008",
        "heritageDescription": "Barokní farní kostel sv. Petra a Pavla z let 1732–1734, postavený při proměně původní kaple v samostatnou duchovní správu (lokálie 1785).",
        "heritageSource": "NPÚ Památkový katalog – ÚSKP 1000146326_0001",
        "sector": "Jádro u kostela a fary",
        "location": {
            "lat": church_coords[0],
            "lng": church_coords[1],
            "precision": "historic_church",
            "cadastralParcel": "st. 57",
            "areaM2": None,
            "source": "Stavební parcela st. 57 v jádru obce mezi farou čp. 25 a školou čp. 27; ÚSKP 1000146326_0001",
        },
        "description": "Ústřední sakrální dominanta Českých Petrovic postavená v letech 1732–1734 (první matriční doklad z r. 1734 v matrice Nekoř 109-1). Roku 1785 povýšena na samostatnou lokálii a později farnost.",
        "statusStableCadastre": "Zděný farní kostel sv. Petra a Pavla v centru jádra obce na st. p. 57.",
        "cadastreSource": "NPÚ ÚSKP 1000146326_0001 & matrika 109-1 (1734).",
        "timeline": [
            {
                "year": "1732–1734",
                "owner": "Panství Žamberk / místní obec",
                "event": "Stavba barokního kostela sv. Petra a Pavla; nejstarší dochovaný křestní zápis 'in Novo Exstructo Sacello Petersdorf' zaznamenán roku 1734 v matrice Nekoř 109-1.",
                "source": "SOA HK, matrika sign. 109-1 (1734); NPÚ Památkový katalog 1000146326_0001.",
                "sourceType": "verified",
                "scanFile": "assets/archives/matrika_109_1_1734_petersdorf.jpg",
                "archiveUrl": "https://pamatkovykatalog.cz/kostel-sv-petra-a-pavla-18704008",
            },
            {
                "year": "1785",
                "owner": "Lokálie České Petrovice (P. Josef Kožíšek)",
                "event": "Zřízení samostatné lokálie pod patronátem žamberského panství; vedení farních knih přešlo z Nekoře přímo do Českých Petrovic (23-1 až 23-5).",
                "source": "SOA HK, farní úřad České Petrovice; Repertorium 23-1.",
                "sourceType": "verified",
                "scanFile": "assets/archives/matrika_23_1_1770_s05.jpg",
                "archiveUrl": ARON_M23_1_URL,
            },
        ],
        "census": [],
        "documents": [
            {
                "type": "Kulturní památka",
                "year": "1734",
                "title": "Záznam nově zbudované kaple v Petrovicích (1734)",
                "description": "Zápis v matrice farnosti Nekoř (109-1) zachycuje nově vystavěnou petrovickou svatyni.",
                "source": "SOA HK, sign. 109-1; NPÚ ÚSKP 1000146326_0001.",
                "scanFile": "assets/archives/matrika_109_1_1734_petersdorf.jpg",
                "originalUrl": "https://pamatkovykatalog.cz/kostel-sv-petra-a-pavla-18704008",
            }
        ],
    })

    assert len(houses_out) == 170, f"Očekáváno 170 mapových objektů, získáno {len(houses_out)}"
    print(f"OK housesData: {len(houses_out)} mapových objektů (160 čp. 1–160 + 3 novější + 6 č.ev. + 1 kostel)")
    return houses_out


def build_boundaries(ku_rings: list[list[float]], is_approx: bool, church_coords: tuple[float, float]) -> dict:
    ruian_raw = load_json("pracovni/ruian_622702.json")
    poly2 = fit_poly2_3857_to_5514(ruian_raw["buildings"])
    if is_approx or not ku_rings:
        pts = [(b["lat"], b["lon"]) for b in ruian_raw["buildings"] if b.get("lat") and b.get("lon")]
        ku_rings = [convex_hull_wgs84(pts)]
    final_church = church_coords

    return {
        "kuCode": "622702",
        "obecCode": "580066",
        "municipalityName": "České Petrovice",
        "germanName": "Böhmisch Petersdorf",
        "ceniaPoly2": poly2,
        "coverageBounds": [[50.05, 16.50], [50.20, 16.72]],
        "cadastralPolygons": {
            "ceske_petrovice": {
                "code": "622702",
                "name": "České Petrovice",
                "isApproximate": is_approx,
                "rings": ku_rings,
            }
        },
        "localityViews": {
            "katastr": {"label": "Celý katastr", "center": [50.1210, 16.6010], "zoom": 14},
            "zapad": {"label": "Západní díl (Umlauf čp. 1, Koth čp. 7)", "center": [50.1212, 16.5915], "zoom": 17},
            "jadro": {"label": "Jádro (Kostel, fara čp. 25, škola čp. 27)", "center": [50.1223, 16.5952], "zoom": 17},
            "stred": {"label": "Střední díl", "center": [50.1200, 16.5990], "zoom": 16},
            "vychod": {"label": "Východní díl (k Čiháku & Kašparova chata)", "center": [50.1190, 16.6120], "zoom": 15},
            "adam": {"label": "Hřeben Adam / Pomezí 1938", "center": [50.1095, 16.6010], "zoom": 15},
        },
        "landmarks": {
            "kostel": {"label": "Kostel sv. Petra a Pavla (st. p. 57)", "lat": final_church[0], "lng": final_church[1]},
            "fara_25": {"label": "Fara čp. 25", "lat": 50.122581, "lng": 16.594409},
            "skola_27": {"label": "Obecná škola čp. 27", "lat": 50.122381, "lng": 16.595121},
            "fin_straz_160": {"label": "Finanční stráž čp. 160", "lat": 50.121784, "lng": 16.595463},
            "mlyn_152": {"label": "Scholzův vodní mlýn čp. 152", "lat": 50.118689, "lng": 16.590890},
            "adam_762": {"label": "Vrch Adam (766 m / tvrz)", "lat": 50.1128, "lng": 16.6075},
            "zemska_brana": {"label": "Zemská brána (Divoká Orlice)", "lat": 50.1380, "lng": 16.5640},
            "kamienczyk": {"label": "Kamieńczyk (hranice PL)", "lat": 50.1288, "lng": 16.6250},
        },
    }


def build_references() -> dict:
    src = load_json("data/archival_sources.json")
    mza = load_json("Soudni pre/data/mza_nalezy.json")

    items = [
        {
            "id": "ref_aron_matriky_cp",
            "category": "archivy",
            "typeLabel": "Matriční sbírka (N/O/Z)",
            "typeLabelEn": "Parish Vital Registers (B/M/D)",
            "typeLabelDe": "Kirchenbücher / Matriken (G/T/S)",
            "year": "1591–1942",
            "title": "Římskokatolické matriky Českých Petrovic (farnosti Bartošovice, Lukavice, Nekoř & České Petrovice)",
            "titleEn": "Roman Catholic Parish Registers for České Petrovice (1591–1942)",
            "titleDe": "Röm.-kath. Matriken für Böhmisch Petersdorf (1591–1942)",
            "institution": "SOA v Hradci Králové (sbírka matrik Východočeského kraje – ARON)",
            "institutionEn": "State Regional Archives in Hradec Králové (ARON)",
            "institutionDe": "Staatliches Gebietsarchiv Königgrätz (ARON)",
            "signature": "Bartošovice 2-8336 (1591–1647); Lukavice 83-1, 83-2 (1659–1718); Nekoř 109-1..15 (1674–1785); České Petrovice 23-1..23-8990 & index 23-3317 (1770–1942)",
            "description": "Kompletní 18svazková posloupnost dochovaných farních matrik pokrývající území Českých Petrovic od prvního dokladu Petersdorfu v bartošovické matrice (1591) až po rok 1942.",
            "descriptionEn": "Complete 18-volume succession of surviving parish registers covering České Petrovice from 1591 (Bartošovice 2-8336) to 1942 (23-8990).",
            "descriptionDe": "Vollständige 18-bändige Matrikenfolge von 1591 (Bartošovice 2-8336) bis 1942.",
            "url": ARON_M23_1_URL,
            "citationIso690": "STÁTNÍ OBLASTNÍ ARCHIV V HRADCI KRÁLOVÉ. Sbírka matrik Východočeského kraje: Farní úřad České Petrovice (sign. 23-1 až 23-8990, index 23-3317), Nekoř (sign. 109-1..15), Lukavice (83-1..2) a Bartošovice (2-8336), 1591–1942 [online]. ARON SOA HK.",
        },
        {
            "id": "ref_aron_civilni_matriky",
            "category": "archivy",
            "typeLabel": "Civilní matriky (OÚ Žamberk)",
            "typeLabelEn": "Civil Registers (District Office Žamberk)",
            "typeLabelDe": "Zivilmatriken (Bezirksamt Senftenberg)",
            "year": "1919–1949",
            "title": "Civilní matriky oddaných a zemřelých Okresního úřadu Žamberk (sign. 6376, 8272)",
            "titleEn": "Civil Marriage & Death Registers of District Office Žamberk (1919–1949)",
            "titleDe": "Ziviltrauungs- & Zivilsterberegister Bezirksamt Senftenberg (1919–1949)",
            "institution": "SOA v Hradci Králové – Sbírka civilních matrik (ARON)",
            "institutionEn": "SOA Hradec Králové – Civil Registers",
            "institutionDe": "SGA Königgrätz – Zivilmatriken",
            "signature": "Sign. 6376 (civilní oddavky 1919–1942, 434 sn.); sign. 8272 (civilní úmrtí 1919–1949, 102 sn.)",
            "description": "Civilní knihy zachycující obyvatele bez vyznání po r. 1919 (mj. Josefa Dolečka 1922 a Filomenu Adlerovou z čp. 83).",
            "descriptionEn": "Post-1919 civil registers capturing non-denominational residents (e.g. Josef Doleček 1922, Filomena Adlerová at No. 83).",
            "descriptionDe": "Zivilbücher ab 1919 für konfessionslose Einwohner.",
            "url": "https://aron.vychodoceskearchivy.cz/apu/72d83ec6-aa33-4a91-b03a-d62f5a0ee62e",
            "citationIso690": "STÁTNÍ OBLASTNÍ ARCHIV V HRADCI KRÁLOVÉ. Okresní úřad Žamberk – civilní matriky, sign. 6376 (oddaní 1919–1942) a sign. 8272 (zemřelí 1919–1949) [online]. ARON SOA HK.",
        },
        {
            "id": "ref_aron_scitani_1869_1921",
            "category": "archivy",
            "typeLabel": "Sčítání lidu 1869–1921",
            "typeLabelEn": "Population Censuses 1869–1921",
            "typeLabelDe": "Volkszählungen 1869–1921",
            "year": "1869–1921",
            "title": "Sčítací operáty obce České Petrovice (1869, 1880, 1890, 1900, 1910 PO/PZ, 1921)",
            "titleEn": "Census Records of České Petrovice (1869–1921)",
            "titleDe": "Volkszählungsoperaten Böhmisch Petersdorf (1869–1921)",
            "institution": "SOkA Ústí nad Orlicí (fond Okresní úřad Žamberk – ARON SOA HK)",
            "institutionEn": "State District Archives Ústí nad Orlicí (District Office Žamberk)",
            "institutionDe": "Staatliches Bezirksarchiv Ústí nad Orlicí (Bezirksamt Senftenberg)",
            "signature": "8 digitalizovaných svazků v ARON: 1869 (364 sn.), 1880, 1890, 1900, 1910 PO (11 sn.) & PZ (9 sn.), 1921 (286 sn., 143 archů, 467 přít. osob)",
            "description": "Kompletně přepsáno sčítání 1910 PO/PZ (148 domů, 531 přítomných, 3 barevné vrstvy inkoustu, 272 skotu) a 1921 (všech 143 domovních archů, 467 osob); u r. 1869 pořízen 17domovní vzorek.",
            "descriptionEn": "100% transcribed 1910 PO/PZ (531 present, 3 ink layers) and 1921 census (143 sheets, 467 residents), plus 17-house 1869 sample.",
            "descriptionDe": "Vollständig transkribiert: Zählungen 1910 (531 Einw.) und 1921 (143 Bögen, 467 Einw.) sowie 1869-Stichprobe.",
            "url": ARON_1921_URL,
            "citationIso690": "STÁTNÍ OKRESNÍ ARCHIV ÚSTÍ NAD ORLICÍ. Fond Okresní úřad Žamberk: Sčítání lidu obce České Petrovice 1869, 1880, 1890, 1900, 1910 a 1921 [online]. ARON SOA HK.",
        },
        {
            "id": "ref_mza_hranice_16st",
            "category": "archivy",
            "typeLabel": "Zemské desky & Soudní pře",
            "typeLabelEn": "Moravian Land Tables & Border Lawsuits",
            "typeLabelDe": "Mährische Landtafel & Grenzstreitigkeiten",
            "year": "1511–1633",
            "title": "Hraniční soudní pře na česko-moravsko-kladském trojmezí (panství Žamberk, Kolštejn, Šilperk & MZA A 3)",
            "titleEn": "16th-Century Border Lawsuits at the Bohemia–Moravia–Glatz Tri-Border (MZA Brno)",
            "titleDe": "Grenzprozesse im 16. Jh. am Dreiländereck Böhmen–Mähren–Glatz (MZA Brünn)",
            "institution": "Moravský zemský archiv v Brně (MZA A 3 Zemské desky, E 3, F 186)",
            "institutionEn": "Moravian Provincial Archives in Brno",
            "institutionDe": "Mährisches Landesarchiv in Brünn",
            "signature": "MZA A 3 Zemské desky olomoucké (MZD II, r. 1511 fol. 251, r. 1531 fol. 346); fondy A 1, C 1, F 186 Kolštejn",
            "description": "Edičně i archivně ověřené zápisy o prodeji šilpersko-zábřežské zboží (Jan ze Zvole 1511, prodej Šilperka 1531) a soudní spory o hranice v orlickokladském pohraničí.",
            "descriptionEn": "Moravian Land Table entries (1511, 1531) and regional border disputes across the Bohemia–Moravia–Glatz watershed.",
            "descriptionDe": "Einträge der Olmützer Landtafel (1511, 1531) und Grenzstreitigkeiten im Adlergebirge.",
            "url": "https://www.mza.cz/aron/",
            "citationIso690": "MORAVSKÝ ZEMSKÝ ARCHIV V BRNĚ. Fond A 3 Stavovské rukopisy – Zemské desky olomoucké II (1511, 1531) & fondy o hraničních přích na trojmezí [online]. MZA ARON.",
        },
        {
            "id": "ref_mapy_16_20_stol",
            "category": "kartografie",
            "typeLabel": "Historická kartografie",
            "typeLabelEn": "Historical Cartography",
            "typeLabelDe": "Historische Kartografie",
            "year": "1561–1938",
            "title": "Od Helwigovy mapy Slezska (1561) a Komenského Moravy (1633) přes 3. vojenské mapování po reambulaci VZÚ 1938",
            "titleEn": "Historical Maps 1561–1938 (Helwig, Fabricius, Comenius, 3rd Military Survey, VZÚ 1938)",
            "titleDe": "Historische Karten 1561–1938 (Helwig, Fabricius, Comenius, Landesaufnahme, VZÚ 1938)",
            "institution": "Moravská zemská knihovna (Mollova sbírka), ÚAZK ČÚZK, Chartae Antiquae",
            "institutionEn": "Moravian Library Brno (Moll Map Collection) & ČÚZK Central Archive",
            "institutionDe": "Mährische Landesbibliothek Brünn & ČÚZK Zentralarchiv",
            "signature": "MZK Moll: Helwig 1561, Fabricius 1569/1573, Komenský 1633, Boehmen 16; Speciální mapa 1:75 000 Senftenberg 1894 & Žamberk VZÚ 1938",
            "description": "Soubor kartografických děl zachycujících prameny Divoké Orlice, polohu Petrovic u prusko-kladské hranice a proměny sídelní sítě.",
            "descriptionEn": "Cartographic corpus documenting the Bohemia–Prussia/Glatz border and settlement morphology from 1561 to 1938.",
            "descriptionDe": "Kartensammlung zum schlesisch-böhmischen Grenzraum von 1561 bis 1938.",
            "url": "https://mapy.mzk.cz/",
            "citationIso690": "MORAVSKÁ ZEMSKÁ KNIHOVNA / ČÚZK. Historické mapy Králicka a Orlických hor (1561–1938) [online]. Mollova mapová sbírka MZK & Geoportál ČÚZK.",
        },
        {
            "id": "ref_gis_cuzk_cenia",
            "category": "kartografie",
            "typeLabel": "GIS & Letecké snímky WMS",
            "typeLabelEn": "GIS & Aerial WMS Orthophotos",
            "typeLabelDe": "GIS & Historische Orthofotos WMS",
            "year": "1953–2026",
            "title": "ČÚZK RÚIAN, Katastrální mapa KN, WMS-ORTOARCHIV (2000–2022) & Historická ortofotomapa CENIA (1953–1954)",
            "titleEn": "ČÚZK RÚIAN, Cadastral WMS, Archival Orthophotos (2000–2022) & CENIA 1953–1954",
            "titleDe": "ČÚZK RÚIAN, Kataster-WMS, Archiv-Orthofotos (2000–2022) & CENIA 1953–1954",
            "institution": "Český úřad zeměměřický a katastrální (ČÚZK) & CENIA",
            "institutionEn": "Czech Office for Surveying, Mapping and Cadastre & CENIA",
            "institutionDe": "Tschechisches Vermessungs- und Katasteramt (ČÚZK) & CENIA",
            "signature": "k.ú. 622702 České Petrovice; ZÚJ 580066; 114 budov v RÚIAN; EPSG:5514 -> 3857 polynomiální projekce (RMSE < 0,1 m)",
            "description": "Živé mapové vrstvy ve webové mapě s přesnou transformací leteckého snímkování 1953 i řady novodobých snímků 2000–2022.",
            "descriptionEn": "Live WMS layers integrated into the Leaflet portal with sub-decimeter polynomial transformation for 1953–2022 orthophotos.",
            "descriptionDe": "Live-WMS-Kartenebenen im Webportal inkl. S-JTSK-Transformation der Luftbilder 1953–2022.",
            "url": "https://geoportal.cuzk.gov.cz/",
            "citationIso690": "ČESKÝ ÚŘAD ZEMĚMĚŘICKÝ A KATASTRÁLNÍ & CENIA. RÚIAN (k.ú. 622702), Katastr nemovitostí, WMS-ORTOARCHIV (2000–2022) a Historická ortofotomapa ČR 1953–1954 [online]. Praha: ČÚZK / CENIA, 2026.",
        },
        {
            "id": "ref_npu_rekos_csu",
            "category": "statistika_pamatky",
            "typeLabel": "Památky, heraldika & ČSÚ",
            "typeLabelEn": "Heritage, Heraldry & Statistics",
            "typeLabelDe": "Denkmäler, Heraldik & Statistik",
            "year": "1654–2026",
            "title": "Kostel sv. Petra a Pavla (NPÚ ÚSKP), Znak obce (REKOS 5727) & Historický lexikon obcí ČSÚ (1869–2026)",
            "titleEn": "Church Heritage Record (NPÚ), Municipal Coat of Arms (REKOS 5727) & ČSÚ Historical Statistics",
            "titleDe": "Kirchen-Denkmalregister (NPÚ), Gemeindewappen (REKOS 5727) & ČSÚ-Statistik",
            "institution": "Národní památkový ústav, Poslanecká sněmovna PČR (REKOS), Český statistický úřad",
            "institutionEn": "National Heritage Institute, Chamber of Deputies (REKOS), Czech Statistical Office",
            "institutionDe": "Nationales Denkmalamt (NPÚ), Abgeordnetenhaus (REKOS), Tschechisches Statistikamt",
            "signature": "ÚSKP 1000146326_0001; REKOS id 5727 (rozhodnutí č. 52 ze dne 25. 3. 2005); ČSÚ Historický lexikon 1869–2011 & SLDB 2021",
            "description": "Úřední blazon znaku Českých Petrovic, památková ochrana barokního kostela a dlouhodobá statistická časová řada domů a obyvatel 1654–2026.",
            "descriptionEn": "Official blazon of the municipal coat of arms, baroque church listing, and long-term demographic series 1654–2026.",
            "descriptionDe": "Offizielle Wappenbeschreibung, Denkmalschutz der Barockkirche und Zeitreihe 1654–2026.",
            "url": "https://rekos.psp.cz/detail-symbolu/id/5727",
            "citationIso690": "NÁRODNÍ PAMÁTKOVÝ ÚSTAV; POSLANECKÁ SNĚMOVNA PČR; ČSÚ. Památkový katalog (ÚSKP 1000146326_0001), Registr komunálních symbolů REKOS (č. 5727) a Historický lexikon obcí ČR [online]. 2005–2026.",
        },
        {
            "id": "ref_kramerius_tisk_1898_1946",
            "category": "literatura",
            "typeLabel": "Dobový tisk & vlastivěda",
            "typeLabelEn": "Historical Press & Regional Studies",
            "typeLabelDe": "Historische Presse & Heimatkunde",
            "year": "1898–1946",
            "title": "Führer durch das Adlergebirge (1898), Naše menšiny (1923, 1935), Turistický Hrádeček (1936) & Věstník Sokolské župy Orlické (1946)",
            "titleEn": "Regional Press & Tourism Guides 1898–1946 (MZK & SVK Hradec Králové Kramerius)",
            "titleDe": "Heimatpresse & Reiseführer 1898–1946 (MZK & SVK Königgrätz Kramerius)",
            "institution": "Moravská zemská knihovna & Studijní a vědecká knihovna v Hradci Králové",
            "institutionEn": "Moravian Library & Research Library Hradec Králové (Kramerius)",
            "institutionDe": "Mährische Landesbibliothek & Wissenschaftliche Bibliothek Königgrätz",
            "signature": "Sign. 7 příloh SVK HK & 4 svazků MZK Kramerius (Führer 1898, Jazykové předlohy 1909, Lexikon 1924, Schematismus 1938, Naše menšiny, Sokol 1946)",
            "description": "Digitalizované regionální periodické a turistické tisky zachycující MUDr. Josefa Moravce, boj o českou menšinovou školu (1923), otevření Kašparovy chaty na Adamu (1936) a poválečnou obnovu Sokola (1946).",
            "descriptionEn": "Digitized periodicals documenting Dr. Josef Moravec, the 1923 minority school controversy, Kašparova chata chalet (1936), and post-war Sokol (1946).",
            "descriptionDe": "Digitalisierte Periodika und Heimatführer zu Dr. Josef Moravec, der Minderheitenschule 1923, der Kašpar-Baude 1936 und 1946.",
            "url": "https://kramerius.svkhk.cz/",
            "citationIso690": "SVK HRADEC KRÁLOVÉ & MZK BRNO. Digitální knihovna Kramerius: Dobový tisk k historii Českých Petrovic (1898–1946) [online]. Dostupné z: https://kramerius.svkhk.cz/",
        },
        {
            "id": "ref_barinka_archiv_1945",
            "category": "statistika_pamatky",
            "typeLabel": "Odboj & osud 1939–1945",
            "typeLabelEn": "WWII Resistance & Memorial Record",
            "typeLabelDe": "Widerstand & Gedenkdokumentation",
            "year": "1911–1945",
            "title": "Biografická rekonstrukce Františka Bařinky (*5. 1. 1911 České Petrovice čp. 7 – †3. 5. 1945 loď Thielbek)",
            "titleEn": "Biographical Reconstruction of František Bařinka (1911–1945, SS Thielbek / Sandby)",
            "titleDe": "Biographische Rekonstruktion von František Bařinka (1911–1945, Thielbek / Sandby)",
            "institution": "SOA HK (sign. 23-6334), VÚA-VHA Praha, KZ-Gedenkstätte Dachau & Neuengamme, farní hřbitov Sandby (Dánsko)",
            "institutionEn": "SOA HK, Military Historical Archive Prague, Dachau/Neuengamme & Sandby Cemetery",
            "institutionDe": "SGA Königgrätz, Militärarchiv Prag, KZ-Gedenkstätten Dachau/Neuengamme & Sandby",
            "signature": "Dachau vězeň č. 21743; Neuengamme vězeň č. 4230; Vojenská kmenová kniha 1931–1937; Československý válečný kříž 1939",
            "description": "Doložený životní příběh českopetrovického rodáka z čp. 7 (rodina Kothova): pohraniční stráž a opevnění tvrze Adam/Dobrošov, zatčení v Braunschweigu 25. 3. 1940, koncentrační tábory Dachau a Neuengamme a smrt při potopení vězeňské lodi Thielbek 3. 5. 1945.",
            "descriptionEn": "Verified WWII biography of native František Bařinka (house No. 7): border fortification service (tvrz Adam), 1940 arrest in Braunschweig, Dachau/Neuengamme, and death aboard SS Thielbek on 3 May 1945.",
            "descriptionDe": "Belegte Biographie von František Bařinka (*1911 Nr. 7): Verhaftung 1940 in Braunschweig, KZ Dachau/Neuengamme, Tod auf der Thielbek 1945.",
            "url": "docs/archivni_dotazy.md",
            "citationIso690": "BERKA, Karel a kol. Příběh Františka Bařinky (1911–1945) na základě matriky 23-6334, vojenské kmenové knihy a archiválií KZ Dachau / Neuengamme [online]. České Petrovice, 2026.",
        },
        {
            "id": "ref_nedigitalizovane_fondy",
            "category": "archivy",
            "typeLabel": "Archivní rešeršní agenda",
            "typeLabelEn": "Non-Digitized Archival Agenda",
            "typeLabelDe": "Nicht digitalisierte Bestände",
            "year": "1654–1950",
            "title": "Soupis dosud nedigitalizovaných fondů k badatelské návštěvě (Berní rula, Josefský a Stabilní katastr, MNV, školní kroniky)",
            "titleEn": "Inventory of Unscanned Archival Units for On-Site Research (NA Praha, AO Zámrsk, SOkA ÚO)",
            "titleDe": "Übersicht nicht digitalisierter Bestände für Archivbesuche",
            "institution": "Národní archiv Praha, SOkA Ústí nad Orlicí, Státní archiv Zámrsk, ÚAZK, AP Wrocław",
            "institutionEn": "National Archives Prague, SOkA Ústí n. O., SOA Zámrsk, ÚAZK, AP Wrocław",
            "institutionDe": "Nationalarchiv Prag, SOkA Ústí n. O., StA Zámrsk, ÚAZK, AP Breslau",
            "signature": "20 archivních jednotek (mj. Velkostatek Žamberk, MNV České Petrovice, Školní kronika, Císařské povinné otisky 1840)",
            "description": "Přesné badatelské žádosti pro doplnění chybějících pozemkových knih, otisků stabilního katastru 1840 a poválečných kronik.",
            "descriptionEn": "Target archival requests for land books, 1840 Stable Cadastre imperial imprints, and post-war chronicles.",
            "descriptionDe": "Forschungsagenda für Grundbücher, Stabiles Kataster 1840 und Nachkriegschroniken.",
            "url": "docs/archivni_dotazy.md",
            "citationIso690": "CESKE PETROVICE ARCHIVE PROJECT. Přehled archivních dotazů k nedigitalizovaným fondům (docs/archivni_dotazy.md) [online]. 2026.",
        },
    ]

    return {
        "categories": [
            {"key": "all", "label": "Všechny prameny", "labelEn": "All Sources", "labelDe": "Alle Quellen", "icon": "📚"},
            {"key": "archivy", "label": "Archivní fondy & matriky", "labelEn": "Archives & Registers", "labelDe": "Archive & Matriken", "icon": "🗄️"},
            {"key": "kartografie", "label": "Historické mapy & GIS", "labelEn": "Maps & GIS", "labelDe": "Karten & GIS", "icon": "🗺️"},
            {"key": "statistika_pamatky", "label": "Statistika, památky & odboj", "labelEn": "Statistics, Heritage & Resistance", "labelDe": "Statistik, Denkmäler & Geschichte", "icon": "🏛️"},
            {"key": "literatura", "label": "Dobový tisk & literatura", "labelEn": "Historical Press & Literature", "labelDe": "Presse & Heimatkunde", "icon": "📖"},
        ],
        "projectCitation": {
            "author": "BERKA, Karel a přispěvatelé projektu České Petrovice",
            "title": "České Petrovice (Böhmisch Petersdorf): Historická kronika, sčítání lidu 1869–1921, matriky 1591–1942 a interaktivní mapa",
            "url": "https://karelberka.github.io/CeskePetrovice/",
            "repoUrl": "https://github.com/KarelBerka/CeskePetrovice",
            "licenseNote": "Dvojí licence: zdrojový kód aplikace pod licencí MIT, strukturované přepisy a texty pod CC BY-SA 4.0 (s uvedením primárního archivu SOA HK / SOkA ÚO / ČÚZK / MZA a odkazu na projekt). Archivní skeny podléhají podmínkám příslušných archivů.",
            "licenseNoteEn": "Dual license: code under MIT License; transcriptions, metadata and texts under CC BY-SA 4.0 (crediting SOA HK / SOkA ÚO / ČÚZK / MZA and this project).",
            "licenseNoteDe": "Doppellizenz: Quellcode unter MIT-Lizenz; Transkriptionen und Texte unter CC BY-SA 4.0 (mit Quellenangabe SOA HK / SOkA ÚO / ČÚZK / MZA).",
            "iso690Template": "BERKA, Karel a kol. České Petrovice (Böhmisch Petersdorf): Historická kronika, sčítání lidu 1869–1921, matriky a interaktivní mapa [online]. GitHub Pages, 2026 [cit. {TODAY}]. Dostupné z: https://karelberka.github.io/CeskePetrovice/",
            "bibtexTemplate": "@misc{berka_ceske_petrovice_2026,\n  author = {Berka, Karel},\n  title = {České Petrovice (Böhmisch Petersdorf): Historický archivní portál a sčítání lidu 1869–1921},\n  year = {2026},\n  url = {https://github.com/KarelBerka/CeskePetrovice}\n}",
            "acknowledgment": "Výzkum, datová konsolidace a vývoj webového portálu vznikly s pomocí nástroje Google Antigravity.",
        },
        "downloadableWorks": {
            "badge": "Studie, monografie a strojově čitelné datové soubory",
            "badgeEn": "Research Studies & Machine-Readable Datasets",
            "badgeDe": "Forschungsstudien & Maschinenlesbare Datensätze",
            "title": "📥 Badatelské studie a datové korpusy ke stažení",
            "titleEn": "📥 Downloadable Studies & Archival Datasets",
            "titleDe": "📥 Studien & Archivdatensätze zum Download",
            "subtitle": "Všechny syntetické studie (.md) i strukturovaná JSON data použitá pro vybudování webu jsou veřejně přístupná přímo v repozitáři projektu.",
            "subtitleEn": "All historical synthesis studies (.md) and structured JSON datasets generated by this research project.",
            "subtitleDe": "Alle historischen Studien (.md) und strukturierten JSON-Datensätze dieses Forschungsprojekts.",
            "groups": [
                {
                    "title": "Syntetické studie a místopis (.md)",
                    "items": [
                        {"title": "Historie Českých Petrovic (8 kapitol, 1591–2026)", "url": "docs/historie_ceskych_petrovic.md", "note": "Hlavní syntetická studie s úplnou citací pramenů"},
                        {"title": "Historická demografie a sčítání 1654–2026", "url": "docs/demografie_a_scitani_1654_2026.md", "note": "Vč. třívrstvé revize sčítání 1910 a úpravy Lexikonu 1924"},
                        {"title": "Rody, demografie a civilní matriky (1591–1942)", "url": "docs/rody_demografie_a_civilni_matriky.md", "note": "12 hlavních rodů, přečíslování 1805/1806 a krize úmrtnosti"},
                        {"title": "Místopis a historie všech 160 domů (čp. 1–160)", "url": "docs/mistopis_domu_cp1_160.md", "note": "Konkordance Alte/Neue, 1869, 1910, 1921, RÚIAN 2026"},
                        {"title": "Stabilní katastr 1840 a využití půdy (629,83 ha)", "url": "docs/stabilni_katastr_1840.md", "note": "1 777 parcel, sektory zástavby a dlouhodobá stabilita"},
                        {"title": "Regionální tisk a turistika (1898–1946)", "url": "docs/regionalni_tisk_a_turistika.md", "note": "MUDr. J. Moravec, menšinová škola 1923, Kašparova chata 1936"},
                        {"title": "Hraniční soudní pře 16. stol. na trojmezí (MZA Brno)", "url": "Soudni pre/README_Soudni_pre_o_hranice_16_stoleti_MZA.md", "note": "Trojmezí Čech, Moravy a Kladska, Helwig 1561, ZDO 1511/1531"},
                        {"title": "Badatelský průvodce & seznam nedigitalizovaných fondů", "url": "docs/badatelsky_pruvodce_ceske_petrovice.md", "note": "Přímé ARON odkazy, glosář a pojistka proti homonymům"},
                    ],
                },
                {
                    "title": "Strukturované datové soubory (.json)",
                    "items": [
                        {"title": "Katalog archivních pramenů a demografických řad", "url": "data/archival_sources.json", "note": f"{len(src['aron_parish_registers'])} matrik + {len(src['aron_censuses'])} sčítání + 20 nedigi fondů"},
                        {"title": "Konsolidovaná databáze domů čp. 1–160 (1771–1921)", "url": "data/domy_1771_1921.json", "note": "Sloučený datový korpus pro jednotlivá popisná čísla"},
                        {"title": "Nálezy ze soudních pří 16. století (MZA ARON)", "url": "Soudni pre/data/mza_nalezy.json", "note": f"{len(mza.get('mza_records_verified_in_aron', []))} ověřených archivních záznamů"},
                    ],
                },
            ],
        },
        "items": items,
        "summaryCounts": {
            "parishRegisters": len(src["aron_parish_registers"]),
            "civilRegisters": len(src["aron_civil_registers"]),
            "censuses": len(src["aron_censuses"]),
            "otherArchivalUnits": len(src["aron_other_archival_units"]),
            "krameriusMzk": len(src["mzk_kramerius_sources"]),
            "krameriusSvkHk": len(src["svkhk_kramerius_sources"]),
        },
    }


def write_js(path: Path, header: str, decl: str, obj) -> None:
    content = header.rstrip() + "\n\n" + f"const {decl} = " + json.dumps(obj, ensure_ascii=False, indent=2) + ";\n"
    path.write_text(content, encoding="utf-8")
    print(f"Wrote {path.relative_to(ROOT)} ({path.stat().st_size / 1024:.1f} KB)")


def main() -> None:
    c21_by_cp = load_all_1921_sheets()
    ku_rings, is_approx, church_coords = fetch_ruian_boundary_and_church()
    houses = build_houses(c21_by_cp, church_coords)
    boundaries = build_boundaries(ku_rings, is_approx, church_coords)
    refs = build_references()

    write_js(
        ROOT / "data" / "houses.js",
        "// Automaticky generováno skriptem tools/build_web_data.py – České Petrovice (170 mapových objektů, 467 obyv. 1921)",
        "housesData",
        houses,
    )
    write_js(
        ROOT / "data" / "boundaries.js",
        "// Automaticky generováno skriptem tools/build_web_data.py – k.ú. 622702 České Petrovice & CENIA_POLY2",
        "villageBoundariesData",
        boundaries,
    )
    write_js(
        ROOT / "data" / "references.js",
        "// Automaticky generováno skriptem tools/build_web_data.py – Katalog pramenů a citací ČSN ISO 690",
        "referencesData",
        refs,
    )


if __name__ == "__main__":
    main()
