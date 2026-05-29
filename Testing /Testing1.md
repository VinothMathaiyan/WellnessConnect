# WellnessConnect — Tester's Guide

*For the two-person QA pass. This doc explains both **what to test** and **why it matters to the business**, so you understand the product while you test it. Work through it top to bottom.*

---

## What is WellnessConnect? (read this first — 2 min)

WellnessConnect connects **clients** (people wanting fitness/wellness coaching) with **trainers**, with an **assessment team** acting as the quality gate in the middle. The core idea: nobody gets matched blindly.

The flow at a business level:

1. A **client** signs up and fills a health profile.
2. The **assessment team** reviews them — checks health risks, fitness level — and either clears them for training or flags conditions. A client can't access the full app until cleared.
3. Once cleared, a **recommendation engine** matches the client to suitable trainers, and the assessment team can also hand-pick trainers.
4. A **trainer** must ALSO be approved by the assessment team before they can take clients (so unvetted trainers never reach clients).
5. Cleared client + approved trainer connect, and the trainer builds programs, schedules sessions, monitors check-ins and risk.

The assessment team is the trust layer on both sides. That's the product's whole differentiator — vetted on both ends.

---

## How to log in (all roles)

- **App URL:** `https://wellness-connect-git-dev-vinothm13579-7150s-projects.vercel.app`
- **Always test in a fresh incognito window** (avoids stale cached versions).
- Log in with the phone number for the account you're testing, then **OTP `123456`** (dev bypass — no real SMS).
- **Admin portal** (for pre-registering assessors): app URL + `/admin` → `admin@wellnessconnect.in` / `WellnessAdmin@2026`

> ⚠️ **Do not modify data in Supabase.** If an account ends up in a weird state, note it and report — don't fix it directly. The point is to test what real users would experience.

---

## The test accounts (organized by role)

### 👤 Clients
| Name | Phone | State | Use for |
|---|---|---|---|
| Arun Kumar | 9100000011 | Cleared, linked to a trainer | Testing a fully-onboarded client |
| Priya Sharma | 9100000012 | Cleared, linked | Second cleared client |
| Test Client | 9300000099 | Cleared, linked | General client testing |
| TestClient One | 9200000001 | Cleared, linked | General client testing |
| Alex Johnson | 9100000001 | Linked, not cleared | Edge case: linked but unclear status |
| Michael Torres | 9100000003 | Conditional clearance | Edge case: conditional status |
| ClientVinothAsses | 9800000001 | Cleared, no trainer yet | Testing trainer discovery/matching |

> Note: phone ranges are a bit mixed (Test Client is on a 93… number) — this is existing test data, just go by the name.

### 🏋️ Trainers
| Name | Phone | State | Use for |
|---|---|---|---|
| Vinoth Trainer | 9200000011 | Approved, has 2 clients | Primary trainer — **don't break this one** |
| VinothTest | 9200000002 | Approved, has 4 clients | Secondary trainer testing |
| Nalinitesta | 9000000103 | Approved, no clients | Fresh-trainer testing |

### 🛡️ Assessment Team
| Name | Phone | Notes |
|---|---|---|
| Test Assessor | 9600000001 | **Use this one** — messaging works correctly |
| Asha Assessor | 9600000011 | Works, but client messages don't route to her — avoid for messaging tests |
| Assessment Team | *(no phone)* | System account — don't try to log in as this |

> **For any NEW signups you create** (e.g. testing fresh client/trainer signup), use unused numbers like **9100000050+** (clients), **9200000050+** (trainers) so you don't collide with the accounts above.

---

## TEST 1 — Client journey: signup → assessment gate → app unlock

**Business context:** This is the front door. A new client must be reviewed before they get full access. If the gate leaks (client gets in before clearance), that's a serious failure — it's the product's core promise.

**Who:** a NEW client number (e.g. 9100000050) + Test Assessor (9600000001)

1. ☐ Incognito → sign up as new client (9100000050) → OTP 123456
2. ☐ Select **Client** role
3. ☐ Fill the health profile (age, goals, any conditions)
4. ☐ **EXPECT:** you land on an "assessment pending" screen — NOT the full app. *(This is the gate doing its job.)*
5. ☐ Confirm there's a "Check status" button and you cannot reach the dashboard
6. ☐ Now log in as **Test Assessor (9600000001)** in a separate incognito window
7. ☐ Go to the client queue → find your new client → open their assessment form
8. ☐ Complete the 8-section questionnaire → **Clear for Training**
9. ☐ Back as the client → tap "Check status" (or wait ~30s) → **EXPECT:** full app unlocks, lands on client dashboard

✅ **Pass if:** client is gated until cleared, then unlocks. ❌ **Fail if:** client reaches the dashboard before being cleared.

---

## TEST 2 — Trainer journey: signup → approval gate → activation

**Business context:** The mirror of Test 1, for trainers. An unapproved trainer must never appear to clients. This protects clients from unvetted coaches.

**Who:** a NEW trainer number (e.g. 9200000050) + Test Assessor (9600000001)

1. ☐ Incognito → sign up as new trainer (9200000050) → OTP 123456
2. ☐ Select **Trainer** role
3. ☐ Complete onboarding — **upload a real profile photo** (required), certification, specialisations, languages, session types
4. ☐ Submit final step
5. ☐ **EXPECT:** lands on "Your application is under review" screen — NOT the dashboard
6. ☐ Try typing `/trainer/dashboard` in the URL → **EXPECT:** bounced back to the pending screen
7. ☐ Log in as **Test Assessor (9600000001)** → Trainer Approval Queue → find your trainer
8. ☐ Click **Approve**
9. ☐ Log in as the trainer again → **EXPECT:** now lands on the trainer dashboard

✅ **Pass if:** trainer is gated until approved, then activates.

---

## TEST 3 — Trainer rejection & resubmission

**Business context:** Not every trainer passes first time. They need to know *why* and be able to fix it — otherwise good trainers are lost.

**Who:** the trainer from Test 2 (before approving) + Test Assessor

1. ☐ As Test Assessor, in the approval queue, click **Reject** with the notes field EMPTY
2. ☐ **EXPECT:** blocked — "Please provide a reason for rejection" *(an assessor must always give a reason)*
3. ☐ Reject WITH a reason: "Please re-upload a clearer certification"
4. ☐ Log in as the trainer → **EXPECT:** pending screen now shows the rejection + your reason in an amber box, with an "Update profile and resubmit" button
5. ☐ Click resubmit → onboarding opens with a banner showing the rejection reason
6. ☐ *(KNOWN ISSUE: the form opens blank — you'll need to re-enter details + photo. This is a logged item, not a bug to report.)*
7. ☐ Submit → **EXPECT:** back to "under review"
8. ☐ As Test Assessor → approve → trainer reaches dashboard

✅ **Pass if:** empty reason is blocked, reason is shown to the trainer, resubmit works.

⚠️ **Known cosmetic issue:** on a narrow mobile screen, the rejection banner text may run off the edge. Note if you see it, but it's already logged.

---

## TEST 4 — Client sees only approved trainers

**Business context:** This is where the trainer gate pays off. A client browsing trainers must only ever see approved ones.

**Who:** Arun Kumar (9100000011) — a cleared client

1. ☐ Log in as Arun → go to the **Trainers** tab
2. ☐ Browse **Discover / All Trainers** → note which trainers appear
3. ☐ **EXPECT:** only approved trainers (Vinoth Trainer, VinothTest, Nalinitesta) show
4. ☐ Check the **My Trainer** tab → **EXPECT:** Arun's linked trainer appears
5. ☐ If recommendations show, check the **Care Team / Recommended** section

✅ **Pass if:** only approved trainers are visible to the client.

---

## TEST 5 — Profile menu (every role)

**Business context:** Every user needs to edit their profile and log out reliably. This menu had a history of bugs, so verify it across roles.

1. ☐ As **Vinoth Trainer (9200000011)** → tap avatar → **EXPECT:** "Edit Profile" present → opens trainer profile editor
2. ☐ As **Test Client (9300000099)** → tap avatar → **EXPECT:** "Edit Profile" present → opens client profile editor
3. ☐ As **Test Assessor (9600000001)** → tap avatar → **EXPECT:** NO "Edit Profile" (correct for assessors), "Sign Out" works
4. ☐ As Vinoth, go to a sub-screen (My Clients) → tap avatar → **EXPECT:** same menu as on the dashboard

✅ **Pass if:** Edit Profile shows for client + trainer, hidden for assessor, consistent everywhere.

⚠️ **Known issue:** clicking Edit Profile opens a BLANK form (doesn't pre-fill existing details). Logged already — confirm the menu item works, ignore the blankness.

---

## TEST 6 — Core screens load (each role smoke test)

**Business context:** Quick "nothing is broken" sweep. Just confirm every screen opens without crashing or showing a blank/error.

**Trainer (Vinoth Trainer 9200000011):**
- ☐ Dashboard ☐ My Clients ☐ a Client Detail ☐ Program Builder ☐ Schedule Session ☐ Risk Monitor ☐ Notifications ☐ Messages

**Client (Test Client 9300000099):**
- ☐ Dashboard ☐ Daily Check-In ☐ Nutrition Log ☐ Progress ☐ Weekly Report ☐ Trainers ☐ Alerts ☐ Session Detail

**Assessor (Test Assessor 9600000001):**
- ☐ Dashboard ☐ Client Queue ☐ Trainer Approval Queue ☐ Escalations ☐ Messages ☐ Monthly Review ☐ Notifications

✅ **Pass if:** every screen renders without a crash or error.

---

## TEST 7 — Messaging (client ↔ assessment team)

**Business context:** Clients reach the assessment team for help; the team must receive it. (Client↔trainer messaging routes via the assessment team by design.)

**Who:** Test Client (9300000099) + Test Assessor (9600000001)

1. ☐ As Test Client → Alerts → "Contact Assessment Team" box → type a message → send
2. ☐ As Test Assessor → Messages tab → **EXPECT:** the client's message appears
3. ☐ Reply as the assessor
4. ☐ As the client → **EXPECT:** the reply appears

✅ **Pass if:** messages flow both directions.

> Use **Test Assessor (9600000001)**, not Asha — messages route to Test Assessor.

---

## How to report results

For each test, use this format (fast to scan):

```
TEST 1 — Client gate: PASS / FAIL
  - Step 4 (gated before clearance): ✅/❌ [what you saw]
  - Step 9 (unlocks after clearance): ✅/❌
  - Console errors? [paste if any]
  - Screenshot of anything unexpected

TEST 2 — Trainer gate: PASS / FAIL
  ...
```

**Rules for good reports:**
- Describe what you **actually saw**, not what you expected.
- For any FAIL: exact test + step number, expected vs actual, screenshot if visual.
- If a step was blocked or you couldn't complete it, say so — don't skip silently.
- **Don't fix data in Supabase** — report weird states instead.
- If two of you split the work: one takes Tests 1–4 (the gates — most important), the other takes Tests 5–7.

---

## What's already known (don't report these)

These are logged issues — confirm they behave as described, don't file them as new bugs:
1. **Edit Profile / resubmit form opens blank** — doesn't pre-fill. Fix is planned.
2. **Rejection banner overflows on narrow mobile** — cosmetic, logged.
3. **Asha Assessor doesn't receive routed messages** — use Test Assessor instead.

