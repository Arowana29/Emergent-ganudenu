# 📲 Ganu Denu — Play Store Publishing Guide

## 🎯 Overview
- **App**: Ganu Denu (ගණු දෙනු)
- **Package ID**: `com.sismath.ganudenu`
- **Version**: 1.0.0
- **Platform**: Android (Play Store)

---

## ✅ STEP-BY-STEP GUIDE

### 📋 Step 1 — Create Expo Developer Account (FREE, 2 minutes)

> Note: This is DIFFERENT from "Expo Go" app on your phone. We need the developer account at expo.dev.

1. Open: **https://expo.dev/signup**
2. Sign up with the **same Gmail** you use for Play Console
3. Verify your email
4. ✅ Done — note your username

---

### 📋 Step 2 — Install EAS CLI on your computer (FREE, 1 minute)

You need a computer (Windows/Mac/Linux) with Node.js installed.

```bash
# Install Node.js first if not installed: https://nodejs.org/
npm install -g eas-cli
```

Then login:
```bash
eas login
# Enter your Expo username and password
```

---

### 📋 Step 3 — Build Production AAB (15-20 minutes, runs on Expo's cloud)

```bash
# Navigate to your app folder (on your computer)
cd ganu-denu

# Build for Play Store
eas build --platform android --profile production
```

**What happens:**
- Expo's cloud builds your `.aab` file (~20 min)
- You get a download link when done
- Save the `.aab` file — this is what you upload to Play Store

---

### 📋 Step 4 — Google Play Console — Create App (10 minutes)

1. Go to **https://play.google.com/console**
2. Click **"Create app"**

Fill in:
| Field | Value |
|-------|-------|
| App name | **Ganu Denu** |
| Default language | **Sinhala (si-LK)** |
| App or game | **App** |
| Free or paid | **Free** |
| Declarations | Tick both required boxes |

Click **Create app**.

---

### 📋 Step 5 — Fill App Content (Required Questionnaires)

In the left sidebar, click **"Policy" → "App content"**. Complete each:

#### 5.1 Privacy Policy
- **Privacy Policy URL**: I will provide this URL after hosting it
- (Temporarily use: `https://sismathtrading.kamfa.net/privacy` — we'll set this up)

#### 5.2 App Access
- ✅ "All functionality is available without special access"
- (No login required)

#### 5.3 Ads
- ✅ "No, my app does not contain ads"

#### 5.4 Content Rating
- Click **Start questionnaire**
- Email: your Gmail
- Category: **Utility, Productivity, Communication, or Other** → **Finance**
- Answer: No to all violence/sexual/gambling questions
- Submit → Rating: **Everyone** (3+)

#### 5.5 Target Audience
- Age groups: **18 and over**
- ❌ Not targeting children

#### 5.6 News App
- ❌ No

#### 5.7 COVID-19 Contact Tracing
- ❌ No

#### 5.8 Data Safety (IMPORTANT — fill carefully)
Click **Start**:
- Does your app collect or share user data? → **Yes**
- Data collected:
  - **Financial info** → Transaction history (collected, not shared, optional, processed on device)
  - **App activity** → App interactions (collected, not shared, optional)
  - **Device IDs** (collected, not shared)
- Security practices:
  - ✅ Data encrypted in transit
  - ✅ Users can request data deletion
  - ✅ Independent security review: No (for now)

---

### 📋 Step 6 — Set Up Closed Testing (For your 20 testers)

In sidebar: **"Testing" → "Closed testing"** → **Create track**:

1. Name: **Closed test - v1.0.0**
2. Click **"Create new release"**
3. **Upload your `.aab` file** (from Step 3)
4. **Release name**: `1.0.0 - First Release`
5. **Release notes**:
```
🎉 Ganu Denu (ගණු දෙනු) — මුල් release එක!

✨ Features:
• සිංහල + English bilingual UI
• ආදායම් / වියදම් track කරන්න
• 25+ categories (ආහාර හා පාන, ප්‍රවාහන, විදුලිය, etc.)
• Charts & monthly reports
• PIN lock + biometric security
• In-app Sinhala keyboard

📞 ඔබේ feedback: sismathtrading@kamfa.net

Initial release for closed testing.
```

6. Click **"Save"** → **"Review release"** → **"Start rollout"**

#### 6.1 Add Testers (20 emails required)

Same page → **"Testers"** tab:
1. Click **"Create email list"**
2. Name: `Ganu Denu Testers`
3. Paste your testers' Gmail addresses (one per line, **20 emails minimum** for production approval)
4. Save

#### 6.2 Share opt-in link
- Bottom of the same page: **"How testers join"** → Copy the **opt-in URL**
- Share via WhatsApp:
```
Hi! 👋 මගේ අලුත් app එක test කරන්න ඔබට කැමතිද?

Ganu Denu — Sinhala money manager 📱💰

Link: [PASTE_OPT_IN_URL_HERE]

1. ඉහත link එක click කරන්න
2. "Become a tester" click කරන්න
3. Play Store link එක click කරන්න → Install
4. App එක use කරන්න, feedback එක්ක reply කරන්න 🙏

Stuthi! ❤️
```

---

### 📋 Step 7 — Store Listing (10 minutes)

Sidebar: **"Grow" → "Store presence" → "Main store listing"**:

#### 7.1 App name (limit 30 chars)
```
Ganu Denu - ගණු දෙනු
```

#### 7.2 Short description (limit 80 chars)
```
Sinhala money manager — track income, expenses & save smartly. ශ්‍රී ලංකා සඳහා.
```

#### 7.3 Full description (limit 4000 chars)
```
🇱🇰 Ganu Denu (ගණු දෙනු) — ශ්‍රී ලාංකීය පවුල් සඳහා නිර්මාණය කළ සිංහල මුදල් කළමනාකරු

═══ Sinhala (සිංහල) ═══

ඔබේ දෛනික වියදම් සහ ආදායම් සිංහල භාෂාවෙන් ම track කරන්න! ශ්‍රී ලංකාවේ පවුල් සඳහාම නිර්මාණය කළ පහසු app එකක්.

✨ විශේෂාංග:
• 📊 මාසික වියදම් සහ ආදායම් track කරන්න
• 🍚 සති පොළ, ආහාර හා පාන, ඉන්ධන, විදුලිය වැනි 25+ categories
• 📈 අලංකාර charts එක්ක reports
• 🔒 PIN අගුල + fingerprint security
• ⌨️ In-app සිංහල keyboard (Helakuru download කරන්න ඕන නෑ!)
• 💰 ණය ලැබුණා / ණයට දීම track කරන්න
• 🙏 දන්දීම, ආගමික වියදම් වෙන වෙනම
• 🏥 රෝහල්: Asiri, Nawaloka, Durdens quick-pick
• 📱 Internet නැතුව offline use කරන්න

🎯 ඔබට ඕන කරන්නේ:
✅ සිංහල UI 100%
✅ Sri Lankan rupee (රු.) currency
✅ Sri Lankan merchants ලිස්ට් (Keells, Arpico, Cargills, Dialog, Mobitel)
✅ ඉතාම පහසු interface

═══ English ═══

The first Sinhala-first money manager for Sri Lankan families. Track your daily income & expenses in your own language.

✨ Features:
• 📊 Monthly income & expense tracking
• 🍚 25+ categories tailored for Sri Lanka (සති පොළ, ආහාර හා පාන, ඉන්ධන, විදුලිය)
• 📈 Beautiful charts and reports
• 🔒 PIN lock + fingerprint security
• ⌨️ Built-in Sinhala keyboard (no Helakuru needed!)
• 💰 Track loans given & received separately
• 🏥 Quick-pick merchants: Asiri Hospital, Keells Super, Cargills, etc.
• 📱 Works offline

💜 Made with love for Sri Lankan families.

📞 Contact: sismathtrading@kamfa.net | silshabir@gmail.com
```

#### 7.4 Graphics

| Asset | Spec | I'll provide |
|-------|------|--------------|
| App icon | 512×512 PNG | ✅ Yes |
| Feature graphic | 1024×500 PNG | ✅ Yes |
| Phone screenshots | At least 2, min 320px | ✅ Yes (4-6 screenshots) |
| Tablet screenshots | Optional | Skip |

I'll generate these next.

#### 7.5 App category
- **Application** → **Finance**
- Tags: budget, expense tracker, money, finance, Sri Lanka

#### 7.6 Contact details
- Email: `sismathtrading@kamfa.net`
- Phone (optional)
- Website: `https://sismathtrading.kamfa.net` (or skip)

---

### 📋 Step 8 — Submit for Review (Closed testing)

After completing all checklist items, click **"Send for review"**.

- Google reviews: **1-7 days**
- Once approved → testers can download via your opt-in link
- **14 days minimum** of active testing required before applying for production

---

### 📋 Step 9 — Promote to Production (After 14 days)

1. **"Testing" → "Closed testing"** → click **"Promote to..."**
2. Choose **"Production"**
3. Submit → Google reviews again (1-7 days)
4. App goes live worldwide ✓

---

## 📞 What I'll Prepare for You

1. ✅ App icon (1024×1024) — Already done!
2. ⏳ Feature graphic (1024×500) — Building now
3. ⏳ Phone screenshots (4-6 PNG) — Capturing from preview
4. ✅ Privacy Policy text — Already in app
5. ⏳ Privacy Policy hosted URL — Will host on GitHub Pages or similar
6. ⏳ EAS Build setup — Configure when you provide Expo username

## 📞 What YOU Need

1. **Google Play Console Gmail** — Tell me which Gmail you used (I'll customize accordingly)
2. **Expo username** — Sign up at expo.dev and tell me your username
3. **20 Tester Gmail addresses** — Collect from your network (family, friends, Sri Lankan WhatsApp groups)
4. **$25 USD** for Play Console (one-time, you've likely paid this already)

---

## 🎯 Timeline

| Phase | Duration |
|-------|----------|
| Today: Setup + Build AAB | 1-2 hours (mostly waiting for build) |
| Day 1-2: Upload + Submit for review | 2 hours |
| Day 2-7: Google reviews internal test | 1-7 days |
| Day 7-21: 20 testers actively use (Google's requirement) | 14 days |
| Day 21-28: Promote to Production + review | 1-7 days |
| **Total to go live**: **~3-4 weeks** | |
