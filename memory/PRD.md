# ගණු දෙනු (Ganu Denu) - Money Manager PRD
*Last Updated: May 2026*

## Problem Statement
Build a premium Sinhala/English bilingual money manager mobile app for Sri Lanka's market. 
The original app was built as HTML/web app + Flutter code. Rebuilding as Expo React Native 
for Google Play Store + App Store publishing.

## Architecture
- **Frontend**: Expo React Native (SDK 54), expo-router file-based routing
- **Backend**: FastAPI + MongoDB (motor)
- **Charts**: react-native-svg (custom DonutChart + BarChart components)
- **Gradient**: expo-linear-gradient (purple balance card)
- **Storage**: AsyncStorage (settings), MongoDB (transactions)
- **URL**: https://ganu-launch.preview.emergentagent.com

## User Personas
- Sri Lankan adults (25-50 years), middle-income households
- Sinhala speakers who want to track family finances
- Not very tech-savvy, need simple UI

## Design System
- **Primary**: #7C3AED (Purple/Violet)
- **Accent**: #F59E0B (Orange/Amber FAB)
- **Background**: #FAFAFA (light, clean)
- **Bilingual**: Sinhala primary + English subtitle on all labels

## What's Been Implemented (May 2026)
### Backend APIs
- GET /api/transactions - with month/year filter
- POST /api/transactions - create expense/income
- DELETE /api/transactions/{id} - delete transaction
- GET /api/stats?month=&year= - monthly income/expenses/categories
- GET /api/stats/trends - 6-month trend data
- POST /api/seed - load 30 demo Sri Lankan transactions

### Frontend Screens
1. **Dashboard (Home)** - Purple gradient balance card, stats row, category filter chips, recent transactions, SMS demo bottom sheet
2. **Reports** - Month navigation, summary cards, donut chart, category legend, 6-month bar chart
3. **Monthly** - Month navigation, balance summary, full transaction list
4. **Settings** - SMS toggle, notifications toggle, demo data loader, Firebase info, about
5. **Add Transaction** - Custom numpad, expense/income toggle, 25 category grid (Sinhala), description/note input

### Components
- `DonutChart` - SVG-based donut chart
- `BarChart` - SVG-based bar chart
- `TransactionItem` - transaction row with SMS badge, long-press delete

### Features
- 25 Sinhala categories (ආහාර, නිවාස, ගමන, සෞඛ්‍ය, etc.)
- SMS detection demo UI (bank transaction bottom sheet)
- Demo data: 30 realistic Sri Lankan transactions
- Long-press to delete with confirmation
- Pull-to-refresh on dashboard
- Category filter chips

## Prioritized Backlog

### P0 - Critical for Play Store
- [ ] Firebase Authentication (Google Sign-in)
- [ ] Firebase Firestore cloud sync
- [ ] Firebase Cloud Messaging (push notifications)
- [ ] App icon design (Sinhala-themed)
- [ ] Play Store listing (screenshots, description)

### P1 - Important
- [ ] Actual SMS reading (requires native Expo development build + READ_SMS permission)
- [ ] CSV/PDF export
- [ ] Google Drive backup
- [ ] PIN lock implementation
- [ ] Budget limits with alerts
- [ ] Recurring expense reminders

### P2 - Nice to Have
- [ ] Dark mode
- [ ] OCR bill scanner (camera)
- [ ] Multi-currency support
- [ ] Widget for home screen
- [ ] Tamil language support

## Next Tasks
1. Get Firebase credentials from user (google-services.json)
2. Implement Firebase Auth + Firestore sync
3. Design app icon
4. Prepare Play Store listing
5. Test on physical Android device (Expo Go)
