#!/usr/bin/env python3
"""n8n'deki workflow'ları listeler ve isimlendirme standardına uyup uymadığını kontrol eder.

Kullanım:  python3 scripts/n8n-workflow-listesi.py
API key:   N8N_API_KEY ortam değişkeni ya da ~/.n8n_api_key dosyası (repoya girmez).

Standart: "AtölyeKart · <Alan> · <Ne yapar>", sub-workflow'lar "(sub)" ile biter.
Alanlar docs/final-plan.md'de.
"""
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

N8N_URL = os.environ.get("N8N_URL", "http://localhost:5678")
ALANLAR = {"Sipariş", "Ortak", "Hata", "Rapor", "RAG", "Asistan", "Bakım"}
DESEN = re.compile(r"^AtölyeKart · (?P<alan>[^·]+) · (?P<is>.+)$")
SUB_TETIKLEYICI = "n8n-nodes-base.executeWorkflowTrigger"


def api_key():
    key = os.environ.get("N8N_API_KEY")
    path = Path.home() / ".n8n_api_key"
    if not key and path.exists():
        key = path.read_text().strip()
    if not key:
        sys.exit("API key bulunamadı: N8N_API_KEY ya da ~/.n8n_api_key")
    return key


def workflows(key):
    cursor, out = None, []
    while True:
        url = f"{N8N_URL}/api/v1/workflows?limit=100" + (f"&cursor={cursor}" if cursor else "")
        req = urllib.request.Request(url, headers={"X-N8N-API-KEY": key, "Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=30) as res:
            page = json.load(res)
        out += page["data"]
        cursor = page.get("nextCursor")
        if not cursor:
            return out


def kontrol(w):
    m = DESEN.match(w["name"])
    if not m:
        return "ad standarda uymuyor"
    if m["alan"] not in ALANLAR:
        return f"bilinmeyen alan: {m['alan']}"
    sub = any(n["type"] == SUB_TETIKLEYICI for n in w["nodes"])
    if sub != w["name"].endswith("(sub)"):
        return "sub-workflow ise '(sub)' ile bitmeli, değilse bitmemeli"
    return "uygun"


def main():
    rows = sorted(workflows(api_key()), key=lambda w: w["name"])
    uyan = 0
    print(f"{'ID':<18} {'Durum':<7} {'Node':>4}  {'Standart':<26} Ad")
    for w in rows:
        sonuc = kontrol(w)
        uyan += sonuc == "uygun"
        durum = "yayında" if w["active"] else "taslak"
        print(f"{w['id']:<18} {durum:<7} {len(w['nodes']):>4}  {sonuc:<26} {w['name']}")
    print(f"\n{len(rows)} workflow, {uyan} tanesi standarda uygun")


if __name__ == "__main__":
    main()
