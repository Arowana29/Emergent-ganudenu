"""Backend tests for Ganu Denu — verifying new category IDs after seed update."""
import os
import sys
import requests
from pathlib import Path

# Load REACT_APP_BACKEND_URL from frontend/.env (since this is an Expo app it's EXPO_PUBLIC_BACKEND_URL)
FRONTEND_ENV = Path(__file__).parent / "frontend" / ".env"
BASE = None
for line in FRONTEND_ENV.read_text().splitlines():
    if line.startswith("EXPO_PUBLIC_BACKEND_URL="):
        BASE = line.split("=", 1)[1].strip().strip('"').rstrip("/")
        break
assert BASE, "EXPO_PUBLIC_BACKEND_URL not found"
API = f"{BASE}/api"
print(f"Testing API at: {API}\n")

results = []
created_ids = []  # for cleanup

def check(name, cond, detail=""):
    status = "PASS" if cond else "FAIL"
    results.append((name, status, detail))
    print(f"[{status}] {name} — {detail}")


# 1. POST /api/seed → returns {seeded: 47, message: "Demo data loaded!"}
print("\n── Test 1: POST /api/seed ──")
r = requests.post(f"{API}/seed", timeout=30)
print(f"status={r.status_code}")
seed_body = r.json()
print(f"body={seed_body}")
check("seed status 200", r.status_code == 200, f"got {r.status_code}")
check("seed count == 47", seed_body.get("seeded") == 47, f"got {seed_body.get('seeded')}")
check("seed message", seed_body.get("message") == "Demo data loaded!", f"got {seed_body.get('message')}")


# 2. GET /api/transactions?month=5&year=2026 → must include new categories
print("\n── Test 2: GET /api/transactions?month=5&year=2026 ──")
r = requests.get(f"{API}/transactions", params={"month": 5, "year": 2026}, timeout=30)
print(f"status={r.status_code}, count={len(r.json())}")
txs = r.json()
check("transactions status 200", r.status_code == 200)
cats_found = {t["category"] for t in txs}
print(f"Categories found in May 2026: {sorted(cats_found)}")

required_present = ['loan_received', 'loan_given', 'charity',
                    'insurance_car', 'insurance_medical', 'business_income']
for c in required_present:
    check(f"category '{c}' present in May 2026 list", c in cats_found,
          f"present={c in cats_found}")


# 3. GET /api/stats?month=5&year=2026 — income aggregates + expense categories
print("\n── Test 3: GET /api/stats?month=5&year=2026 ──")
r = requests.get(f"{API}/stats", params={"month": 5, "year": 2026}, timeout=30)
stats = r.json()
print(f"income={stats.get('income')}, expenses={stats.get('expenses')}, balance={stats.get('balance')}")
print(f"Expense categories breakdown: {[c['category'] for c in stats.get('categories', [])]}")
check("stats status 200", r.status_code == 200)

# Build expected income = salary(120000) + business_income(35000) + loan_received(15000) = 170000
# (only from current-month seed entries; loan_received was added today's run)
income_txs = [t for t in txs if t.get("is_income")]
income_cats = {t["category"] for t in income_txs}
print(f"Income categories present in tx list: {income_cats}")
for c in ['loan_received', 'business_income', 'salary']:
    check(f"income category '{c}' contributes to May 2026", c in income_cats)

# Verify stats.income == sum of income tx amounts
expected_income = sum(t["amount"] for t in income_txs)
check("stats.income == sum(income txs)", abs(stats["income"] - expected_income) < 0.01,
      f"stats={stats['income']}, calc={expected_income}")

# Verify expense categories breakdown includes the new ones
expense_cat_list = {c["category"] for c in stats["categories"]}
for c in ['loan_given', 'charity', 'insurance_car', 'insurance_medical',
          'sathipola', 'telephone', 'petrol', 'electricity', 'water']:
    check(f"expense breakdown contains '{c}'", c in expense_cat_list,
          f"present={c in expense_cat_list}")

# Percentage should sum to ~100
pct_sum = sum(c["pct"] for c in stats["categories"])
check("expense pct sums ~100", 98 <= pct_sum <= 102, f"pct_sum={pct_sum}")


# 4. POST /api/transactions with charity (expense, Sinhala desc)
print("\n── Test 4: POST charity transaction ──")
body4 = {"amount": 5000, "category": "charity", "description": "පන්සල", "is_income": False}
r = requests.post(f"{API}/transactions", json=body4, timeout=15)
print(f"status={r.status_code}, body={r.json()}")
tx4 = r.json()
check("POST charity status 200", r.status_code == 200, f"got {r.status_code}")
check("POST charity category preserved", tx4.get("category") == "charity")
check("POST charity Sinhala description preserved", tx4.get("description") == "පන්සල",
      f"got {tx4.get('description')!r}")
check("POST charity is_income False", tx4.get("is_income") is False)
check("POST charity has id", bool(tx4.get("id")))
if tx4.get("id"):
    created_ids.append(tx4["id"])


# 5. POST /api/transactions loan_received (income)
print("\n── Test 5: POST loan_received transaction ──")
body5 = {"amount": 50000, "category": "loan_received",
         "description": "Friend ලගින් ණයක්", "is_income": True}
r = requests.post(f"{API}/transactions", json=body5, timeout=15)
print(f"status={r.status_code}, body={r.json()}")
tx5 = r.json()
check("POST loan_received status 200", r.status_code == 200, f"got {r.status_code}")
check("POST loan_received category preserved", tx5.get("category") == "loan_received")
check("POST loan_received Sinhala desc preserved",
      tx5.get("description") == "Friend ලගින් ණයක්",
      f"got {tx5.get('description')!r}")
check("POST loan_received is_income True", tx5.get("is_income") is True)
check("POST loan_received amount", tx5.get("amount") == 50000)
if tx5.get("id"):
    created_ids.append(tx5["id"])


# ── Cleanup ──
print("\n── Cleanup created transactions ──")
for tid in created_ids:
    rr = requests.delete(f"{API}/transactions/{tid}", timeout=10)
    print(f"DELETE {tid} → {rr.status_code}")


# ── Summary ──
print("\n" + "=" * 60)
passed = sum(1 for _, s, _ in results if s == "PASS")
failed = sum(1 for _, s, _ in results if s == "FAIL")
print(f"TOTAL: {passed} passed, {failed} failed (of {len(results)})")
if failed:
    print("\nFailures:")
    for n, s, d in results:
        if s == "FAIL":
            print(f"  - {n}: {d}")
    sys.exit(1)
print("All backend tests passed ✓")
