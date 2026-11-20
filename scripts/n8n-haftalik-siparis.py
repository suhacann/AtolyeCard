#!/usr/bin/env python3
"""Bu hafta kaç sipariş geldi? — n8n public API ile sorgu (Hafta 6.3).

Sipariş workflow'unun (Webhook → Sheet) bu haftaki execution'larını
/api/v1/executions'tan çeker, webhook'a gelen gövdeye bakarak sipariş ile stok
bildirimini ayırır, başarılı ve başarısız olanları ayrı sayar.

Kullanım:
    python3 scripts/n8n-haftalik-siparis.py            # bu hafta (Pazartesi → bugün)
    python3 scripts/n8n-haftalik-siparis.py 2026-11-09 # o tarihin haftası

API key: N8N_API_KEY ortam değişkeni ya da ~/.n8n_api_key dosyası.
Key repoya girmez; n8n → Settings → n8n API'den oluşturulur.

Not: n8n eski execution'ları zamanla siler (pruning). Siparişlerin kalıcı
kaydı Google Sheet'tir; bu sorgu n8n'in o hafta ne işlediğini gösterir.
"""
import json
import os
import sys
import urllib.parse
import urllib.request
from collections import Counter
from datetime import date, datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

N8N_URL = os.environ.get("N8N_URL", "http://localhost:5678")
WORKFLOW_ID = "PUAcp9tnJCGqbO3x"  # AtölyeKart — Sipariş → Sheet + AI teşekkür maili
WEBHOOK_NODE = "Sipariş Webhook"
TZ = ZoneInfo("Europe/Istanbul")


def api_key():
    key = os.environ.get("N8N_API_KEY")
    if not key:
        path = Path.home() / ".n8n_api_key"
        if path.exists():
            key = path.read_text().strip()
    if not key:
        sys.exit("API key bulunamadı: N8N_API_KEY ya da ~/.n8n_api_key")
    return key


def get(path, params, key):
    url = f"{N8N_URL}/api/v1/{path}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"X-N8N-API-KEY": key, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as res:
        return json.load(res)


def week_range(day):
    start = datetime.combine(day - timedelta(days=day.weekday()), datetime.min.time(), TZ)
    return start, start + timedelta(days=7)


def executions_in(start, end, key):
    """Execution'lar yeniden eskiye gelir; haftanın başından eskisine inince durur."""
    cursor = None
    while True:
        params = {"workflowId": WORKFLOW_ID, "includeData": "true", "limit": 50}
        if cursor:
            params["cursor"] = cursor
        page = get("executions", params, key)
        for ex in page["data"]:
            started = datetime.fromisoformat(ex["startedAt"].replace("Z", "+00:00"))
            if started < start:
                return
            if started < end:
                yield ex, started
        cursor = page.get("nextCursor")
        if not cursor:
            return


def webhook_body(ex):
    try:
        run = ex["data"]["resultData"]["runData"][WEBHOOK_NODE][0]
        return run["data"]["main"][0][0]["json"]["body"]
    except (KeyError, IndexError, TypeError):
        return {}


def main():
    day = date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else datetime.now(TZ).date()
    start, end = week_range(day)
    key = api_key()

    orders, stock, failed, other = [], [], Counter(), 0
    for ex, started in executions_in(start, end, key):
        body = webhook_body(ex)
        event = body.get("event", "?")
        if ex["status"] != "success":
            failed[event] += 1
        elif event == "order_created":
            orders.append((ex["id"], started, body))
        elif event == "stock_notification_requested":
            stock.append((ex["id"], started, body))
        else:
            other += 1

    print(f"Hafta: {start:%d.%m.%Y} – {(end - timedelta(days=1)):%d.%m.%Y} (Europe/Istanbul)")
    print(f"Kaynak: n8n API /api/v1/executions, workflow {WORKFLOW_ID}\n")

    units = Counter()
    for _, _, b in orders:
        units[b.get("productName", b.get("productId", "?"))] += int(b.get("quantity", 1))
    print(f"Sipariş: {len(orders)} (toplam {sum(units.values())} adet)")
    for name, qty in units.most_common():
        print(f"  - {name}: {qty} adet")
    for ex_id, started, b in sorted(orders, key=lambda o: o[1]):
        print(f"    #{ex_id} {started.astimezone(TZ):%d.%m %H:%M} {b.get('productName')} × {b.get('quantity')}")
    print(f"Stok bildirimi: {len(stock)}")
    print(f"Başarısız execution: {sum(failed.values())}" + (f" ({dict(failed)})" if failed else ""))
    if other:
        print(f"Diğer: {other}")


if __name__ == "__main__":
    main()
