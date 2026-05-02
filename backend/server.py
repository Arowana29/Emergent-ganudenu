from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ── Models ───────────────────────────────────────────────────────

class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    amount: float
    category: str
    description: str
    note: Optional[str] = None
    date: str
    is_income: bool = False
    from_sms: bool = False
    raw_sms: Optional[str] = None
    merchant: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class TransactionCreate(BaseModel):
    amount: float
    category: str
    description: str
    note: Optional[str] = None
    date: Optional[str] = None
    is_income: bool = False
    from_sms: bool = False
    raw_sms: Optional[str] = None
    merchant: Optional[str] = None

# ── Helpers ──────────────────────────────────────────────────────

def _match_month(doc: dict, month: int, year: int) -> bool:
    try:
        d = datetime.fromisoformat(doc['date'].replace('Z', '+00:00'))
        return d.month == month and d.year == year
    except Exception:
        return False

# ── Routes ───────────────────────────────────────────────────────

@api_router.get("/")
async def root():
    return {"status": "ගණු දෙනු API v1.0"}

@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(month: Optional[int] = None, year: Optional[int] = None):
    docs = await db.ganu_transactions.find({}, {"_id": 0}).to_list(2000)
    if month and year:
        docs = [d for d in docs if _match_month(d, month, year)]
    return sorted(docs, key=lambda x: x.get('date', ''), reverse=True)

@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(data: TransactionCreate):
    t = Transaction(
        amount=data.amount,
        category=data.category,
        description=data.description,
        note=data.note,
        date=data.date or datetime.now(timezone.utc).isoformat(),
        is_income=data.is_income,
        from_sms=data.from_sms,
        raw_sms=data.raw_sms,
        merchant=data.merchant,
    )
    await db.ganu_transactions.insert_one(t.dict())
    return t

@api_router.delete("/transactions/{tid}")
async def delete_transaction(tid: str):
    result = await db.ganu_transactions.delete_one({"id": tid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"success": True}

@api_router.get("/stats")
async def get_stats(month: int, year: int):
    docs = await db.ganu_transactions.find({}, {"_id": 0}).to_list(2000)
    monthly = [d for d in docs if _match_month(d, month, year)]

    income = sum(d['amount'] for d in monthly if d.get('is_income', False))
    expenses = sum(d['amount'] for d in monthly if not d.get('is_income', False))

    cat_map: dict = {}
    for d in monthly:
        if not d.get('is_income', False):
            cat = d.get('category', 'other')
            cat_map[cat] = cat_map.get(cat, 0) + d['amount']

    categories = sorted(
        [{"category": k, "amount": v, "pct": round(v / expenses * 100) if expenses > 0 else 0}
         for k, v in cat_map.items()],
        key=lambda x: -x['amount']
    )

    return {
        "income": income,
        "expenses": expenses,
        "balance": income - expenses,
        "total_count": len(monthly),
        "sms_count": sum(1 for d in monthly if d.get('from_sms', False)),
        "categories": categories,
    }

@api_router.get("/stats/trends")
async def get_trends():
    docs = await db.ganu_transactions.find({}, {"_id": 0}).to_list(2000)
    now = datetime.now(timezone.utc)
    SI_MONTHS = ['ජන', 'පෙබ', 'මාර්', 'අප්‍ර', 'මැයි', 'ජූනි', 'ජූලි', 'අගෝ', 'සැප්', 'ඔක්', 'නොවැ', 'දෙසැ']

    trends = []
    for i in range(5, -1, -1):
        year = now.year
        month = now.month - i
        while month <= 0:
            month += 12
            year -= 1
        monthly = [d for d in docs if _match_month(d, month, year)]
        income = sum(d['amount'] for d in monthly if d.get('is_income', False))
        expenses = sum(d['amount'] for d in monthly if not d.get('is_income', False))
        trends.append({
            "month": month, "year": year,
            "label": SI_MONTHS[month - 1],
            "income": income, "expenses": expenses,
        })
    return trends

@api_router.post("/seed")
async def seed_data():
    await db.ganu_transactions.delete_many({})
    now = datetime.now(timezone.utc)

    samples = [
        # Current month
        {"cat": "salary", "desc": "මාසික වැටුප · Monthly Salary", "amt": 120000, "inc": True, "day": 1, "mo": 0},
        {"cat": "food", "desc": "Keells Super Colombo", "amt": 3500, "inc": False, "day": 14, "mo": 0, "sms": True, "raw": "BOC Bank: Debit Rs.3,500.00. Keells Super Colombo. Ref:TXN2847B"},
        {"cat": "transport", "desc": "PickMe Taxi", "amt": 450, "inc": False, "day": 13, "mo": 0},
        {"cat": "education", "desc": "School Fees - Grade 7", "amt": 8500, "inc": False, "day": 5, "mo": 0},
        {"cat": "utilities", "desc": "Dialog Postpaid Bill", "amt": 1200, "inc": False, "day": 10, "mo": 0, "sms": True},
        {"cat": "food", "desc": "Arpico Super", "amt": 6400, "inc": False, "day": 9, "mo": 0, "sms": True},
        {"cat": "housing", "desc": "ගෙදර Loan EMI · Home Loan", "amt": 25000, "inc": False, "day": 3, "mo": 0},
        {"cat": "health", "desc": "Osusala Pharmacy", "amt": 1850, "inc": False, "day": 7, "mo": 0},
        {"cat": "transport", "desc": "Petrol · Lanka IOC", "amt": 5500, "inc": False, "day": 11, "mo": 0, "sms": True},
        {"cat": "food", "desc": "Saturday Pola · Weekly Market", "amt": 2800, "inc": False, "day": 12, "mo": 0},
        {"cat": "education", "desc": "Tuition Classes", "amt": 3000, "inc": False, "day": 8, "mo": 0},
        {"cat": "utilities", "desc": "CEB Electricity Bill", "amt": 2800, "inc": False, "day": 6, "mo": 0},
        # Month -1
        {"cat": "salary", "desc": "Salary", "amt": 120000, "inc": True, "day": 1, "mo": -1},
        {"cat": "food", "desc": "Supermarket", "amt": 15200, "inc": False, "day": 15, "mo": -1},
        {"cat": "housing", "desc": "Home Loan EMI", "amt": 25000, "inc": False, "day": 3, "mo": -1},
        {"cat": "transport", "desc": "Transport", "amt": 6800, "inc": False, "day": 10, "mo": -1},
        {"cat": "health", "desc": "Pharmacy", "amt": 2300, "inc": False, "day": 8, "mo": -1},
        # Month -2
        {"cat": "salary", "desc": "Salary", "amt": 120000, "inc": True, "day": 1, "mo": -2},
        {"cat": "food", "desc": "Food & Groceries", "amt": 18000, "inc": False, "day": 15, "mo": -2},
        {"cat": "housing", "desc": "Home Loan", "amt": 25000, "inc": False, "day": 3, "mo": -2},
        {"cat": "utilities", "desc": "Monthly Bills", "amt": 4500, "inc": False, "day": 7, "mo": -2},
        # Month -3
        {"cat": "salary", "desc": "Salary", "amt": 115000, "inc": True, "day": 1, "mo": -3},
        {"cat": "food", "desc": "Food", "amt": 16500, "inc": False, "day": 15, "mo": -3},
        {"cat": "housing", "desc": "Home Loan", "amt": 25000, "inc": False, "day": 3, "mo": -3},
        # Month -4
        {"cat": "salary", "desc": "Salary", "amt": 115000, "inc": True, "day": 1, "mo": -4},
        {"cat": "food", "desc": "Food", "amt": 17200, "inc": False, "day": 15, "mo": -4},
        {"cat": "housing", "desc": "Home Loan", "amt": 25000, "inc": False, "day": 3, "mo": -4},
        # Month -5
        {"cat": "salary", "desc": "Salary", "amt": 115000, "inc": True, "day": 1, "mo": -5},
        {"cat": "food", "desc": "Food", "amt": 19000, "inc": False, "day": 15, "mo": -5},
        {"cat": "housing", "desc": "Home Loan", "amt": 25000, "inc": False, "day": 3, "mo": -5},
    ]

    to_insert = []
    for s in samples:
        year = now.year
        month = now.month + s["mo"]
        while month <= 0:
            month += 12
            year -= 1
        while month > 12:
            month -= 12
            year += 1
        try:
            date = datetime(year, month, s["day"], 10, 0, 0, tzinfo=timezone.utc)
        except ValueError:
            date = datetime(year, month, 1, 10, 0, 0, tzinfo=timezone.utc)
        t = Transaction(
            amount=s["amt"], category=s["cat"],
            description=s["desc"], date=date.isoformat(),
            is_income=s["inc"], from_sms=s.get("sms", False),
            raw_sms=s.get("raw"),
        )
        to_insert.append(t.dict())

    if to_insert:
        await db.ganu_transactions.insert_many(to_insert)
    return {"seeded": len(to_insert), "message": "Demo data loaded!"}

# ── App setup ────────────────────────────────────────────────────
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
