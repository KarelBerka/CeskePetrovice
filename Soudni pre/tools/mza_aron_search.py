#!/usr/bin/env python3
"""Vyhledávání archiválií a fondů na portálu ARON MZA v Brně (https://www.mza.cz/aron).

Šetrný nástroj respektující limity portálu: mezi každým HTTP dotazem čeká min. 2,5 s (pozor: opakované HTTP 400/404 při neplatných filtrech či UUID spouštějí firewall/fail2ban blokaci MZA)
a podrobné záznamy ukládá do mezipaměti `pracovni/.cache_aron/<apu_id>.json`.

Použití:
  mza_aron_search.py search "<slovo1,slovo2>" [--field description|name] [--type ARCH_DESC|FUND] [--name-filter "<filtr>"] [--max 50]
  mza_aron_search.py detail <apu_id1> [<apu_id2> ...] [--refresh]
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from typing import Any

for _s in (sys.stdout, sys.stderr):
    if hasattr(_s, "reconfigure"):
        _s.reconfigure(encoding="utf-8", errors="replace")

BASE_URL = "https://www.mza.cz/aron"
API = f"{BASE_URL}/api/aron"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_DIR = os.path.join(ROOT, "pracovni", ".cache_aron")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": f"{BASE_URL}/",
}

_LAST_REQ_TS = 0.0


def _rate_limit(delay: float = 2.5) -> None:
    global _LAST_REQ_TS
    now = time.monotonic()
    wait = delay - (now - _LAST_REQ_TS)
    if wait > 0:
        time.sleep(wait)
    _LAST_REQ_TS = time.monotonic()


def api_post(path: str, body: dict[str, Any], delay: float = 2.5) -> dict[str, Any]:
    _rate_limit(delay)
    headers = {**HEADERS, "Content-Type": "application/json"}
    req = urllib.request.Request(API + path, data=json.dumps(body).encode("utf-8"), headers=headers)
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r)


def api_get(path: str, delay: float = 2.5) -> dict[str, Any]:
    _rate_limit(delay)
    req = urllib.request.Request(API + path, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r)


def fetch_apu_detail(apu_id: str, refresh: bool = False, delay: float = 2.5) -> dict[str, Any]:
    os.makedirs(CACHE_DIR, exist_ok=True)
    cache_path = os.path.join(CACHE_DIR, f"{apu_id}.json")
    if not refresh and os.path.exists(cache_path):
        with open(cache_path, encoding="utf-8") as f:
            return json.load(f)
    data = api_get(f"/apu/{apu_id}", delay=delay)
    tmp_path = f"{cache_path}.{os.getpid()}.tmp"
    with open(tmp_path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(tmp_path, cache_path)
    return data


def _extract_fund_from_result(raw_result: str | None) -> str:
    if not raw_result:
        return ""
    try:
        parsed = json.loads(raw_result)
        for grp in parsed.get("l", []):
            for row in grp:
                if row.get("t") == "J_F":
                    vals = [v.get("v", "") for v in row.get("v", []) if v.get("v")]
                    if vals:
                        return "; ".join(vals)
    except Exception:
        pass
    return ""


def _collect_chain(obj: dict[str, Any]) -> list[str]:
    chain: list[str] = []
    cur = obj.get("parent")
    while isinstance(cur, dict):
        nm = cur.get("name")
        if nm:
            chain.append(nm)
        cur = cur.get("parent")
    chain.reverse()
    return chain


def _extract_items(obj: dict[str, Any]) -> dict[str, list[str]]:
    out: dict[str, list[str]] = {}
    for part in obj.get("parts", []):
        for it in part.get("items", []):
            t = it.get("type")
            v = it.get("value")
            if t and v is not None:
                out.setdefault(t, []).append(str(v))
    return out


def cmd_search(args: argparse.Namespace) -> int:
    filters: list[dict[str, Any]] = []
    if args.type:
        filters.append({"field": "type", "operation": "EQ", "value": args.type})
    for word in args.query.split(","):
        w = word.strip()
        if w:
            filters.append({"operation": "FTXF", "field": args.field, "value": w})
    if args.name_filter:
        for nw in args.name_filter.split(","):
            nw = nw.strip()
            if nw:
                filters.append({"operation": "FTXF", "field": "name", "value": nw})

    if not filters:
        print("Chyba: zadej alespoň jeden vyhledávací výraz.", file=sys.stderr)
        return 2

    items: list[dict[str, Any]] = []
    offset = 0
    total = 0
    page_size = min(50, args.max)

    while offset < args.max:
        size = min(page_size, args.max - offset)
        resp = api_post(
            "/apu/listview?listType=SEARCH",
            {"filters": filters, "sort": [], "offset": offset, "size": size, "aggregations": []},
            delay=args.delay,
        )
        total = resp.get("count", 0)
        batch = resp.get("items", [])
        items.extend(batch)
        offset += len(batch)
        if not batch or offset >= min(total, args.max):
            break

    print(f"count: {total} (zobrazeno {len(items)})")
    for it in items:
        uid = it.get("id", "")
        itype = it.get("type") or "-"
        name = (it.get("name") or "").replace("\n", " ").strip()
        desc = (it.get("description") or "").replace("\n", " ").strip()[:240]
        fund = _extract_fund_from_result(it.get("result"))
        fund_lbl = f" [{fund}]" if fund else ""
        print(f"{uid} | {itype}{fund_lbl} | {name} | {desc}")
    return 0


def cmd_detail(args: argparse.Namespace) -> int:
    for idx, apu_id in enumerate(args.apu_ids):
        d = fetch_apu_detail(apu_id, refresh=args.refresh, delay=args.delay if idx > 0 or args.refresh else 0.2)
        chain = _collect_chain(d)
        meta = _extract_items(d)
        digis = d.get("digitalObjects") or []
        print("=" * 72)
        print(f"ID:   {apu_id}")
        print(f"URL:  {BASE_URL}/apu/{apu_id}")
        print(f"TYPE: {d.get('type')} | DIGI: {len(digis)}")
        print(f"NAME: {d.get('name')}")
        if chain:
            print(f"CHAIN: {' > '.join(chain)}")
        if d.get("description"):
            print(f"DESC: {d.get('description')}")
        for key in (
            "INV~CISLO",
            "OTHERID~SIG",
            "OTHERID~SIG~ORIG",
            "STORAGE",
            "UNIT~DATE~TEXT",
            "UNIT~DATE",
            "UNIT~CONTENT",
            "CONTENT",
            "SIZE",
            "UNIT~TYPE",
            "EXISTING~COPY",
        ):
            if key in meta:
                val = " | ".join(v.replace("\n", " ") for v in meta[key])
                print(f"  {key}: {val}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="mza_aron_search.py",
        description="Šetrné vyhledávání v katalogu ARON Moravského zemského archivu v Brně. Neposílejte neověřené filtry/UUID (HTTP 400/404 vyvolává fail2ban/firewall blokaci).",
    )
    p.add_argument("--delay", type=float, default=2.5, help="Minimální pauza mezi HTTP dotazy v sekundách (výchozí 2.5; snižuje riziko firewall/fail2ban blokace při HTTP 400/404)")
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("search", help="Vyhledá záznamy ARCH_DESC nebo FUND v MZA ARON")
    s.add_argument("query", help="Hledané výrazy oddělené čárkou (AND)")
    s.add_argument("--field", choices=("description", "name"), default="description", help="Pole pro dotaz (výchozí description)")
    s.add_argument("--type", choices=("ARCH_DESC", "FUND", ""), default="ARCH_DESC", help="Typ entity (výchozí ARCH_DESC)")
    s.add_argument("--name-filter", default="", help="Doplňkový filtr názvu (čárkou oddělené výrazy)")
    s.add_argument("--max", type=int, default=50, help="Maximální počet stažených výsledků (výchozí 50)")

    dt = sub.add_parser("detail", help="Stáhne a vypíše plná metadata zadaných APU ID (s cachováním)")
    dt.add_argument("apu_ids", nargs="+", help="Jedno nebo více UUID archivní jednotky")
    dt.add_argument("--refresh", action="store_true", help="Vynutit znovustažení mimo mezipaměť")
    return p


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        if args.cmd == "search":
            return cmd_search(args)
        if args.cmd == "detail":
            return cmd_detail(args)
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        print(f"CHYBA SÍTĚ MZA ARON: {e}. Zastav další dotazy a zkus později.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
