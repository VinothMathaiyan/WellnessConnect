# WellnessConnect — Visual QA Pass (30 min)
 
**Dev URL:** `https://wellness-connect-git-dev-vinothm13579-7150s-projects.vercel.app`
**Commit deployed:** `7b27d92` (READY)
**What we're verifying:** UI consistency work — avatars, headers, design system across all 3 apps
 
> **Before starting:** Open the dev URL in an **incognito window**. Hard refresh (Ctrl+Shift+R) on each first load to bypass cache.
 
---
 
## How to use this checklist
 
Walk through each section. For each item:
- ✅ if it matches expected
- ❌ if it doesn't (note what you see)
- 🟡 if uncertain or different but not necessarily wrong
Don't try to fix anything during the walkthrough. Just observe and note. We'll triage at the end.
 
---
 
## Section A — Assessor App (5 min)
 
**Login:** Test Assessor — `9600000001` / OTP `123456`
 
### A1 — Dashboard (`/assessment/dashboard`)
- X Top of screen: gradient hero banner (teal → purple)
- X Banner text: "Good morning, Test 👋" or similar greeting
- X Sub-text: "Assessment Command Center"
- X Top-right avatar shows **"T"** (NOT "TA")
- X Below hero: stat cards (escalations, clients, trainer approvals, reviews)
### A2 — Sub-screens — same header pattern everywhere
Visit each from the bottom nav and confirm:
| Screen | White bg? | Back arrow? | Title clear? | Avatar (T) top-right? |
|---|---|---|---|---|
| Clients (Client Queue) | ✅ | ✅ | "Client Queue" | ✅ |
| Escalations | ✅ | ✅ | "Escalations" | ✅ |
| Messages | ✅ | ✅ | "Messages" | ✅ |
| Alerts (Notifications) | ✅ | ✅ | ✅ or 🟡 (this was deferred) - It worked | ✅ |
 
### A3 — Avatar consistency check
- 🟡 Click avatar from dashboard → opens menu with "Edit Profile" and "Sign out" - There is no Edit Profile 
- ✅ Navigate to a sub-screen (e.g. Clients) → avatar still shows **"T"**
- ✅ The avatar style (circle border, white bg, colored text) looks the **same** on dashboard and sub-screen — no visual jump when navigating
---
 
## Section B — Trainer App (10 min)
 
**Logout, then login:** Vinoth Trainer — `9200000011` / OTP `123456`
 
### B1 — Dashboard (`/trainer/dashboard`)
- ✅ Top of screen: gradient hero banner (teal → green)
- ✅ Banner shows greeting + dashboard title
- 🟡 Top-right avatar shows **"V"** (NOT "VT") - Photo shown
### B2 — Sub-screens
| Screen (route) | Header consistent? | Back arrow? | Avatar (V) top-right? | Note |
|---|---|---|---|---|
| My Clients | 🟡 | ✅ | ✅ | | - V in all subscreen. Only in Dashboard screen it is Photo. THis is fine
| Client Detail (tap any client) | ❌ | ❌ | 🟡 (intentional risk-dot) | risk-dot avatar OK | - there is no Avator in client page
| Risk Monitor | ✅ | ✅ | ✅ | newly standardized |
| Notifications | ✅ | ✅ | ✅ | newly standardized |
| Messages | ✅ | ✅ | ✅ | |
| Schedule Session (tap +) | ✅ | ✅ | ✅ | |
 
### B3 — Visual flow check
- ✅ Navigate Dashboard → My Clients → Client Detail → Back → My Clients → Back → Dashboard
- ✅ No visual jarring jumps. Same fonts, same spacing, same back-arrow style at each step.
---
 
## Section C — Client App (10 min)
 
**Logout, then login:** Test Client — `9300000099` / OTP `123456`
 
### C1 — Home (`/client/home` or `/client/dashboard`)
- ✅ **NO gradient hero banner** (this is intentional — calm/minimal design)
- ✅ White/light background
- ✅ Readiness Score card is the visual anchor at top
- ✅ Top-right avatar shows **"T"**
- ✅ Greeting/title looks calm, not "command center"-style
### C2 — Sub-screens
| Screen | Header consistent? | Back arrow? | Avatar (T) top-right? | Note |
|---|---|---|---|---|
| Daily Check-In | 🟡 | 🟡 | 🟡 | No Avator in Daily Tracking Log and this is fine|
| Nutrition Log | 🟡 | 🟡 | 🟡 | No Avator in Daily Tracking Log and this is fine|
| Progress | ✅ | ❌ | ✅ | No Back arrow in Progress |
| Weekly Report | ✅ | ✅ | ✅ (Share button + avatar) | deferred |
| Trainers (Discover) | ✅ | ✅ | ✅ | newly standardized |
| Alerts | ❌ | ❌ | ✅ (deferred) | |
| Session Detail (if available) | 🟡 | 🟡 | 🟡 | Unable to see Session as there are no session scheduled |
 
### C3 — Critical check: Client Home does NOT have a gradient
- ✅ Hard refresh the Client Home page
- ✅ Confirm: NO green-to-green gradient banner above the Readiness card
- ✅ The whole screen feels minimal, calm, and clean — not "operational dashboard"
---
 
## Section D — Cross-app comparison (5 min)
 
This is where the consistency work pays off. Compare side-by-side.
 
### D1 — Same shared component, different apps  [Notification i see the difference between Client and Trainer]
Open two browser windows side by side: [Client and Assessment have different in Client cards display. SCreenshot attached]
- Window 1: logged in as Vinoth Trainer (avatar "V")
- Window 2: logged in as Test Assessor (avatar "T")
On each, navigate to a sub-screen. [Notification also have a difference. Assuming this is okay. Your suggestion?]
- 🟡 Both headers look like the **same component** with different content
- 🟡 Both avatars are the same size, shape, border style — just different letter and color theme
### D2 — Dashboard hero comparison
- ✅ Trainer Dashboard hero (teal→green) and Assessor Dashboard hero (teal→purple) feel like **the same component**, just with different gradient colors
- ✅ Client Home has **no hero** — intentional difference, not a bug
### D3 — The big test: same user, different screens
- ✅ Stay logged in as one user. Visit 5 different screens (mix of dashboards and sub-screens).
- ✅ The avatar's **letter** is the same on every screen (first letter of first name).
- ✅ The avatar's **visual style** is the same (size, shape, border).
If both of those hold, the consistency goal is met.
 
---
 
## At the end — write a 3-line summary
 
Reply back with something like:
 
```
A — All ✅. Saw "T" everywhere.
B — All ✅ except Client Detail has risk-dot (expected).
C — All ✅. No gradient on Client home — calm look working.
D — Consistent. Same component pattern across apps.
 
Issues found: [list anything you noted]
```
 
---
 
## What to do if you find issues
 
**Critical (must fix before continuing):**
- Build error / blank page
- Wrong avatar letter (e.g. "TA" instead of "T")
- Client Home has gradient hero (the rejected design)
- Sub-screen completely missing header
**Important but not blocking:**
- Spacing/alignment subtly off on one screen
- Avatar color slightly different (theme variant)
- Header height inconsistent by a few pixels
**Acceptable (don't report):**
- Weekly Report has Share button (deferred)
- Alerts screen looks different (deferred)
- Client Detail has risk-dot (intentional)
---
 
## After visual QA passes
 
Then we pick between:
- **Backfill button** (15 min, separate problem)
- **PART 2 of QA feedback** (BLOCKS 3, 5, 6, 7 — longer)
