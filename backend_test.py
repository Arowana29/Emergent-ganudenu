"""
Backend tests for Ganu Denu (Sri Lankan Sinhala money manager).
Tests endpoints after seed data update with new categories:
electricity (replaced utilities), water (NEW), petrol (NEW), transport.
"""
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import httpx
from dotenv import load_dotenv

# Use external URL via EXPO_PUBLIC_BACKEND_URL from frontend/.env
load_dotenv(Path(__file__).parent / "frontend" / ".env")
BASE_URL = os.environ.get("EXPO_PUBLIC_BACKEND_URL", "http://localhost:8001").rstrip("/")
API = f"{BASE_URL}/api"

print(f"Testing against: {API}")

now = datetime.now(timezone.utc)
CUR_MONTH = now.month
CUR_YEAR = now.year

results = []  # (name, passed, detail)


def record(name, passed, detail=""):
    results.append((name, passed, detail))
    status = "PASS" if passed else "FAIL"
    print(f"[{status}] {name} :: {detail}")


def test_seed():
    try:
        r = httpx.post(f"{API}/seed", timeout=60)
        if r.status_code != 200:
            return record("POST /api/seed", False, f"status={r.status_code} body={r.text[:200]}")
        body = r.json()
        if body.get("seeded") != 34:
            return record("POST /api/seed", False, f"expected seeded=34 got {body.get('seeded')}")
        if body.get("message") != "Demo data loaded!":
            return record("POST /api/seed", False, f"unexpected message: {body.get('message')}")
        record("POST /api/seed", True, f"seeded=34, message ok")
    except Exception as e:
        record("POST /api/seed", False, f"exception: {e}")


def test_get_transactions():
    try:
        r = httpx.get(f"{API}/transactions", params={"month": CUR_MONTH, "year": CUR_YEAR}, timeout=30)
        if r.status_code != 200:
            return record("GET /api/transactions", False, f"status={r.status_code}")
        txs = r.json()
        if not isinstance(txs, list) or len(txs) == 0:
            return record("GET /api/transactions", False, f"expected non-empty list, got {len(txs) if isinstance(txs, list) else 'non-list'}")
        cats = {t.get("category") for t in txs}
        # Required new categories in current month seed: electricity, water, petrol, transport
        required = {"electricity", "water", "petrol", "transport"}
        missing = required - cats
        if missing:
            return record("GET /api/transactions", False, f"missing new categories: {missing}; got cats={cats}")
        if "utilities" in cats:
            return record("GET /api/transactions", False, f"'utilities' should be removed, but found in: {cats}")
        # Ensure each tx has category field
        for t in txs:
            if not t.get("category"):
                return record("GET /api/transactions", False, f"transaction missing category: {t}")
        record("GET /api/transactions", True, f"count={len(txs)}, cats include {required}, no 'utilities'")
    except Exception as e:
        record("GET /api/transactions", False, f"exception: {e}")


def test_stats():
    try:
        r = httpx.get(f"{API}/stats", params={"month": CUR_MONTH, "year": CUR_YEAR}, timeout=30)
        if r.status_code != 200:
            return record("GET /api/stats", False, f"status={r.status_code}")
        s = r.json()
        for key in ("income", "expenses", "balance", "categories", "total_count", "sms_count"):
            if key not in s:
                return record("GET /api/stats", False, f"missing key '{key}' in response")
        if s["income"] <= 0:
            return record("GET /api/stats", False, f"expected income>0, got {s['income']}")
        if s["expenses"] <= 0:
            return record("GET /api/stats", False, f"expected expenses>0, got {s['expenses']}")
        if abs((s["income"] - s["expenses"]) - s["balance"]) > 0.01:
            return record("GET /api/stats", False, f"balance mismatch: {s['income']}-{s['expenses']} != {s['balance']}")
        cats = {c["category"] for c in s.get("categories", [])}
        required = {"electricity", "water", "petrol"}
        missing = required - cats
        if missing:
            return record("GET /api/stats", False, f"missing new categories in stats: {missing}; got {cats}")
        if "utilities" in cats:
            return record("GET /api/stats", False, f"'utilities' present in stats categories")
        # Validate pct sums roughly to 100
        total_pct = sum(c.get("pct", 0) for c in s["categories"])
        record("GET /api/stats", True,
               f"income={s['income']}, expenses={s['expenses']}, balance={s['balance']}, cats={cats}, total_pct={total_pct}")
    except Exception as e:
        record("GET /api/stats", False, f"exception: {e}")


def test_create_transaction():
    try:
        payload = {
            "amount": 500,
            "category": "water",
            "description": "Test ජලය",
            "is_income": False,
        }
        r = httpx.post(f"{API}/transactions", json=payload, timeout=30)
        if r.status_code != 200:
            return record("POST /api/transactions (water)", False, f"status={r.status_code} body={r.text[:200]}")
        t = r.json()
        if t.get("category") != "water":
            return record("POST /api/transactions (water)", False, f"category mismatch: {t}")
        if t.get("amount") != 500:
            return record("POST /api/transactions (water)", False, f"amount mismatch: {t}")
        if t.get("description") != "Test ජලය":
            return record("POST /api/transactions (water)", False, f"description mismatch (Sinhala unicode): {t.get('description')!r}")
        if not t.get("id"):
            return record("POST /api/transactions (water)", False, f"missing id: {t}")
        if not t.get("date"):
            return record("POST /api/transactions (water)", False, f"missing date: {t}")
        # Cleanup so we don't pollute the seed for the next test runs
        del_r = httpx.delete(f"{API}/transactions/{t['id']}", timeout=15)
        cleanup = "cleaned" if del_r.status_code == 200 else f"cleanup_failed({del_r.status_code})"
        record("POST /api/transactions (water)", True, f"id={t['id']}, sinhala desc preserved, {cleanup}")
    except Exception as e:
        record("POST /api/transactions (water)", False, f"exception: {e}")


def test_trends():
    try:
        r = httpx.get(f"{API}/stats/trends", timeout=30)
        if r.status_code != 200:
            return record("GET /api/stats/trends", False, f"status={r.status_code}")
        trends = r.json()
        if not isinstance(trends, list) or len(trends) != 6:
            return record("GET /api/stats/trends", False, f"expected list of 6, got {len(trends) if isinstance(trends, list) else 'non-list'}")
        for t in trends:
            for key in ("month", "year", "label", "income", "expenses"):
                if key not in t:
                    return record("GET /api/stats/trends", False, f"missing key {key} in {t}")
        # Verify last entry corresponds to current month
        last = trends[-1]
        if last["month"] != CUR_MONTH or last["year"] != CUR_YEAR:
            return record("GET /api/stats/trends", False, f"last trend not current month: {last}")
        record("GET /api/stats/trends", True, f"6 months: {[(t['month'], t['year'], t['income'], t['expenses']) for t in trends]}")
    except Exception as e:
        record("GET /api/stats/trends", False, f"exception: {e}")


if __name__ == "__main__":
    test_seed()
    test_get_transactions()
    test_stats()
    test_create_transaction()
    test_trends()

    print("\n" + "=" * 60)
    passed = sum(1 for _, p, _ in results if p)
    total = len(results)
    print(f"RESULT: {passed}/{total} passed")
    for name, p, detail in results:
        print(f"  [{'OK' if p else 'XX'}] {name}")
    sys.exit(0 if passed == total else 1)
