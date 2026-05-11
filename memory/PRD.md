# Ganu Denu (ගණු දෙනු) — Product Requirements Document

## Vision
A Sinhala-first money manager app designed for Sri Lankans (and the SL diaspora) to track income & expenses, detect SMS transactions, visualize spending, and stay financially organized — without needing English fluency.

## Target Audience
- Sri Lankan nationals in Sri Lanka & abroad (Dubai, Middle East, etc.)
- Non-technical users who prefer Sinhala UI
- Families managing household budgets
- Small business owners

## Tech Stack
- **Frontend**: Expo (React Native), Expo Router
- **Backend**: FastAPI + MongoDB
- **State**: Local component state (no Redux yet)
- **Future**: Firebase (Auth + Cloud Firestore + FCM) — deferred to post-launch

## Brand
- App Name: **Ganu Denu** (ගණු දෙනු) — both same prominence
- Tagline: Money Manager 🇱🇰
- Primary Color: Deep Purple `#4C1D95`
- Accent: Amber `#F59E0B`
- Greeting: "ආයුබෝවන් 🙏" (Welcome)
- Contact: sismathtrading@kamfa.net, silshabir@gmail.com

## Implemented Features ✅
- [x] Dashboard with monthly balance, income/expenses, transaction list
- [x] Categories (with Sinhala names + English subtitles): ආහාර හා පාන, සති පොළ, නිවාස, ප්‍රවාහන, ඉන්ධන, විදුලිය, ජලය, දුරකථන (Telecom), සෞඛ්‍ය, අධ්‍යාපන, etc.
- [x] Merchant quick-picks per category (e.g., Dialog/Mobitel/Hutch/SLT for Telecom)
- [x] Add transaction with bilingual numpad, Sinhala/English category labels
- [x] SMS detection UI (mocked)
- [x] Monthly/Reports tabs with charts (DonutChart, BarChart)
- [x] Settings (PIN toggle UI, contact emails)
- [x] **In-app Sinhala Keyboard** — Singlish (Phonetic) + Wijesekara modes
- [x] QR code page at `/qr` for easy app onboarding

## Pending Features (P0 — Required for Play Store)
- [ ] **Privacy Policy screen** (Sinhala + English) — MANDATORY for Google Play
- [ ] **PIN Lock functionality** (4-digit + biometric) — toggle UI exists, logic needed
- [ ] App icon (1024x1024, Play Store-compliant)

## Pending Features (P1 — Quality of life)
- [ ] **Google Account backup** (sign-in with Google + cloud sync)
- [ ] **Excel sheet download** from Reports (.xlsx export)

## Future / Backlog (P2)
- [ ] Firebase Auth + Firestore sync
- [ ] Push notifications (FCM)
- [ ] Real SMS detection (Android permission + SMS parser)
- [ ] Recurring transactions
- [ ] Budget vs actual tracking
- [ ] Multi-account support (Bank A, Bank B, Cash)
- [ ] Dark mode

## Backend API
- `GET /api/transactions?month=&year=`
- `POST /api/transactions`
- `DELETE /api/transactions/{id}`
- `GET /api/stats?month=&year=`
- `GET /api/stats/trends`
- `POST /api/seed`

## DB Schema (MongoDB collection `ganu_transactions`)
```
{
  id: uuid,
  amount: float,
  category: str (e.g., 'food', 'telephone', 'sathipola'),
  description: str (merchant name or note),
  note: str?,
  date: ISO datetime,
  is_income: bool,
  from_sms: bool,
  raw_sms: str?,
  merchant: str?,
  created_at: ISO datetime,
}
```

## Open Questions
- Should "Telecom" subcategories (Dialog/Mobitel/etc.) auto-show under one parent in Reports?
- Should Sinhala Keyboard be the default on all text fields?
