# WellnessConnect — E2E Testing Guide (Updated May 30, 2026)

*For the QA pass. This doc explains both **what to test** and **why it matters**, so you understand the product while you test it. Work through it top to bottom.*

> **Dev URL:** `https://wellness-connect-git-dev-vinothm13579-7150s-projects.vercel.app`
> **Deployment:** commit `bb2b8dd` — "Update recent changes" — built 30 May 2026, includes all changes through T15.
> **Always test in a fresh incognito window** (avoids stale cached versions).

---

## What is WellnessConnect? (read this first — 2 min)

WellnessConnect connects **clients** with **trainers**, with an **assessment team** as the quality gate.

The flow:
1. A **client** signs up and fills a health profile.
2. The **assessment team** reviews them — checks health risks, fitness level — and either clears them or flags conditions. A client can't access the full app until cleared.
3. Once cleared, a **recommendation engine** matches the client to suitable trainers.
4. A **trainer** must also be approved by the assessment team before they can take clients.
5. Cleared client + approved trainer connect — the trainer builds programs, schedules sessions, monitors check-ins and risk.

The assessment team is the trust layer on both sides. That's the product's core differentiator.

---

## How to log in (all roles)

- **Dev URL:** `https://wellness-connect-git-dev-vinothm13579-7150s-projects.vercel.app`
- **OTP:** `123456` for any phone number (dev bypass — no real SMS)
- **Admin portal** (pre-registering assessors): app URL + `/admin` → `admin@wellnessconnect.in` / `WellnessAdmin@2026`

> ⚠️ **Do not modify data directly in Supabase.** If an account ends up in a weird state, note it and report — don't fix it directly.

---

## Test accounts

### Clients

| # | Name | Phone | Assessment | Trainer link | Existing data | Use for |
|---|------|-------|------------|--------------|---------------|---------|
| C1 | **Test Client** | `9300000099` | ✅ cleared | active | 4 check-ins, avg readiness 65 | General client testing |
| C2 | **Arun Kumar** | `9100000011` | ✅ cleared | active | 3 check-ins, avg readiness 62 | Readiness/adherence testing |
| C3 | **TestClient One** | `9200000001` | ✅ cleared | active | 2 check-ins | General client testing |
| C4 | **Priya Sharma** | `9100000012` | ✅ cleared | active | 1 check-in + meal logs | Meal log testing |
| C5 | **ClientVinothAsses** | `9800000001` | ✅ cleared | none | 0 check-ins | Trainer discovery/matching |
| C6 | **Michael Torres** | `9100000003` | ✅ cleared | active | 0 check-ins | Clean slate — readiness formula discovery |
| C7 | **Alex Johnson** | `9100000001` | ❌ **none** | none | 0 data | Edge case — clearance filter |

### Trainers

| # | Name | Phone | State | Use for |
|---|------|-------|-------|---------|
| T1 | **Vinoth Trainer** | `9200000011` | Approved, active clients | Primary trainer — most tests |
| T2 | **VinothTest** | `9200000002` | Approved, active clients | Secondary trainer |
| T3 | **Nalinitesta** | `9000000103` | Approved, no clients | Fresh trainer testing |

### Assessors

| # | Name | Phone | Notes |
|---|------|-------|-------|
| A1 | **Test Assessor** | `9600000001` | **Use this one** — messaging routes correctly |
| A2 | **Asha Assessor** | `9600000011` | Works but client messages don't route to her — avoid for messaging tests |

> **For NEW signups you create during testing**, use unused numbers like **9100000050+** (clients), **9200000050+** (trainers) so you don't collide with the accounts above.

---

# PART 1 — Onboarding Gates (existing tests, re-verified)

---

## TEST 1 — Client journey: signup → assessment gate → app unlock

**Business context:** The front door. A new client must be reviewed before they get full access. If the gate leaks, that's a serious failure — it's the product's core promise.

**Accounts:** new client `9100000050` + Test Assessor `9600000001`

1. ☐ Incognito → sign up as new client (`9100000050`) → OTP `123456`
2. ☐ Select **Client** role
3. ☐ Fill the health profile (age, goals, any conditions)
4. ☐ **EXPECT:** land on "assessment pending" screen — NOT the full app
5. ☐ Confirm there's a "Check status" button and you cannot reach the dashboard
6. ☐ Log in as **Test Assessor** in a separate incognito window
7. ☐ Go to client queue → find the new client → open assessment form
8. ☐ Complete the 8-section questionnaire → **Clear for Training**
9. ☐ Back as the client → tap "Check status" → **EXPECT:** full app unlocks, lands on dashboard

✅ **Pass:** client gated until cleared, then unlocks.
❌ **Fail:** client reaches dashboard before being cleared.

---

## TEST 2 — Trainer journey: signup → approval gate → activation

**Business context:** Mirror of Test 1. An unapproved trainer must never appear to clients.

**Accounts:** new trainer `9200000050` + Test Assessor `9600000001`

1. ☐ Incognito → sign up as new trainer (`9200000050`) → OTP `123456`
2. ☐ Select **Trainer** role
3. ☐ Complete onboarding — upload a real profile photo, certification, specialisations, languages, session types
4. ☐ Submit final step
5. ☐ **EXPECT:** "Your application is under review" — NOT the dashboard
6. ☐ Type `/trainer/dashboard` in URL → **EXPECT:** bounced back to pending screen
7. ☐ As Test Assessor → Trainer Approval Queue → find the trainer → **Approve**
8. ☐ Log in as the trainer again → **EXPECT:** lands on trainer dashboard

✅ **Pass:** trainer gated until approved, then activates.

---

## TEST 3 — Trainer rejection & resubmission

**Business context:** Not every trainer passes first time. They need to know why and be able to fix it.

1. ☐ As Test Assessor, in the approval queue, click **Reject** with reason field EMPTY
2. ☐ **EXPECT:** blocked — "Please provide a reason for rejection"
3. ☐ Reject WITH a reason: "Please re-upload a clearer certification"
4. ☐ Log in as the trainer → **EXPECT:** pending screen shows the rejection reason in an amber box, with "Update profile and resubmit" button
5. ☐ Click resubmit → onboarding opens with a banner showing the rejection reason
6. ☐ Submit → **EXPECT:** back to "under review"
7. ☐ As Test Assessor → approve → trainer reaches dashboard

✅ **Pass:** empty reason is blocked, reason shown to trainer, resubmit works.
⚠️ **Known:** resubmit form opens blank — doesn't pre-fill. Already logged.

---

## TEST 4 — Client sees only approved trainers

**Business context:** A client browsing trainers must only ever see approved ones.

**Account:** Arun Kumar `9100000011`

1. ☐ Log in as Arun → go to **Trainers** tab → **Discover**
2. ☐ **EXPECT:** only approved trainers (Vinoth Trainer, VinothTest, Nalinitesta) appear
3. ☐ Check **My Trainer** tab → Arun's linked trainer appears
4. ☐ Check **Recommended** section if visible

✅ **Pass:** only approved trainers visible.

---

## TEST 5 — Profile menu (every role)

1. ☐ As **Vinoth Trainer** → tap avatar → **Edit Profile** present → opens trainer profile editor
2. ☐ As **Test Client** → tap avatar → **Edit Profile** present → opens client profile editor
3. ☐ As **Test Assessor** → tap avatar → NO "Edit Profile" (correct for assessors), **Sign Out** works
4. ☐ As Vinoth, go to My Clients sub-screen → tap avatar → same menu as dashboard

✅ **Pass:** Edit Profile for client + trainer, hidden for assessor, consistent everywhere.
⚠️ **Known:** Edit Profile opens a blank form — doesn't pre-fill. Already logged.

---

## TEST 6 — Core screens load (smoke test, all roles)

**Trainer (Vinoth Trainer `9200000011`):**
- ☐ Dashboard ☐ My Clients ☐ Client Detail ☐ Program Builder ☐ Schedule Session ☐ Risk Monitor ☐ Notifications ☐ Messages ☐ **Client Progress View** (tap "View Full Progress" on any client)

**Client (Test Client `9300000099`):**
- ☐ Dashboard ☐ Daily Check-In ☐ Nutrition Log ☐ Progress ☐ Weekly Report ☐ Trainers ☐ Alerts ☐ Session Detail

**Assessor (Test Assessor `9600000001`):**
- ☐ Dashboard ☐ Client Queue ☐ Trainer Approval Queue ☐ Escalations ☐ Messages ☐ Monthly Review ☐ Notifications

✅ **Pass:** every screen renders without crash or error.

---

## TEST 7 — Messaging (client ↔ assessment team)

**Accounts:** Test Client `9300000099` + Test Assessor `9600000001`

1. ☐ As Test Client → Alerts → "Contact Assessment Team" → type a message → send
2. ☐ As Test Assessor → Messages tab → **EXPECT:** client's message appears
3. ☐ Reply as the assessor
4. ☐ As the client → **EXPECT:** reply appears

✅ **Pass:** messages flow both directions.
> Use **Test Assessor (`9600000001`)**, not Asha Assessor.

---

# PART 2 — Supabase Wiring & Data (new tests, added May 30 2026)

*These tests cover all the wiring built in Phases 3C, 4, P3.1, P4, pre-T15 cleanup, and T15.*

> **How these work:** After each ✋ PAUSE, paste your result back into the Claude chat (e.g. "TEST 8, Step 2.1 — score = 87"). Claude will query the live Supabase DB and reply with ✅ confirmed / ❌ mismatch / 🟡 note within seconds.

---

## TEST 8 — Auth guard on hard refresh

**What's being tested:** `isAuthLoading` guard in App.tsx prevents null-userId on F5.

1. ☐ Log in as any user
2. ☐ Hit **F5** (hard refresh)
3. ☐ **EXPECT:** brief centered loading spinner → then same screen loads correctly
4. ☐ **NOT acceptable:** flash of login page, blank screen, or "userId is null" error

✅ **Pass:** spinner shows briefly, then screen loads correctly.

---

## TEST 9 — Daily Check-in & Readiness Score

**What's being tested:** `submitDailyCheckin` upserts to `daily_metrics`, readiness score is calculated and displayed correctly.

**Account:** Michael Torres `9100000003` (C6 — clean slate, zero existing data)

### 9.1 — High score baseline
1. ☐ Log in as Michael Torres
2. ☐ Open **Daily Check-in**
3. ☐ Enter:
   - Sleep: **8 hours**
   - Mood: **5/5**
   - Energy: **5/5**
   - Water: **8 glasses**
   - Pain: **0**
4. ☐ Submit

Note the **readiness score** shown = ______ /100 and its **colour** (green/amber/red).

✋ **PAUSE — reply: "TEST 9.1 done, score = XX, colour = green/amber/red"**
*Claude will query `daily_metrics` to confirm what was saved and verify the score.*

### 9.2 — Low score (risk trigger)
5. ☐ Still as Michael Torres, tap **Daily Check-in** again (same day)
6. ☐ Enter:
   - Sleep: **3 hours**
   - Mood: **1/5**
   - Energy: **1/5**
   - Water: **1 glass**
   - Pain: **9**
7. ☐ Submit

Note: new **readiness score** = ______ /100, any **risk alert or banner** shown = yes/no

✋ **PAUSE — reply: "TEST 9.2 done, score = XX, alert = yes/no"**
*Claude will verify: (a) still only 1 row in DB (upsert worked, not duplicate), (b) whether a `risk_alerts` row was created, (c) score formula.*

### 9.3 — Medium score
8. ☐ Submit check-in again:
   - Sleep: **6 hours**
   - Mood: **3/5**
   - Energy: **3/5**
   - Water: **5 glasses**
   - Pain: **3**

Note score = ______ /100

✋ **PAUSE — reply: "TEST 9.3 done, score = XX"**
*Claude will confirm still 1 row (3 upserts = 1 row), and whether earlier alert auto-cleared.*

### 9.4 — Pain score not hardcoded
9. ☐ Navigate to **Progress** screen
10. ☐ **EXPECT:** Pain shows `3` (or the value you entered) — NOT `0` and NOT `—`

✋ **PAUSE — reply: "TEST 9.4 pain shows = XX"**

---

## TEST 10 — Meal Log Upsert (no duplicates)

**What's being tested:** `logMeal` upserts on `(user_id, log_date, meal_type)` — same meal type same day updates, not duplicates.

**Account:** Priya Sharma `9100000012` (C4 — has existing meal data)

### 10.1 — Add breakfast
1. ☐ Log in as Priya Sharma
2. ☐ Open **Nutrition Log** → **Add Meal**
3. ☐ Type: **Breakfast**, Name: **Test Breakfast A**, Calories: **300**
4. ☐ Save

✋ **PAUSE — reply: "TEST 10.1 done"**
*Claude will confirm exactly 1 breakfast row for Priya today.*

### 10.2 — Re-add breakfast (should update, not duplicate)
5. ☐ Add **Breakfast** again: Name: **Test Breakfast B**, Calories: **500**
6. ☐ Save
7. ☐ **EXPECT:** the nutrition log shows **Test Breakfast B / 500 cal** (not two breakfasts)

✋ **PAUSE — reply: "TEST 10.2 done, shows = [what you see]"**
*Claude will confirm: 1 breakfast row in DB, updated to B/500.*

### 10.3 — Different meal type should add (not replace)
8. ☐ Add **Lunch**: Name: **Lunch C**, Calories: **600**
9. ☐ **EXPECT:** now 2 meal entries today (Breakfast B + Lunch C)

✋ **PAUSE — reply: "TEST 10.3 done"**

---

## TEST 11 — Session Logging & Adherence

**What's being tested:** `logWorkoutSession` writes correct `adherence_score` (effort × 20) and `session_status`. No `[No-show]` prefix in notes.

**Account:** Vinoth Trainer `9200000011` logging sessions for Arun Kumar

### 11.1 — Completed session
1. ☐ Log in as Vinoth Trainer
2. ☐ My Clients → **Arun Kumar** → **Log Session**
3. ☐ Date: today, Status: **Completed**, Effort: **4/5**
4. ☐ Pick 2 exercises. Notes: leave blank. Save.
5. ☐ **EXPECT:** success toast → returns to client detail

✋ **PAUSE — reply: "TEST 11.1 done"**
*Claude will verify: `adherence_score = 80` (not 4), `session_status = 'completed'`, `exercise_sets` rows created, `client_notes` is null.*

### 11.2 — No-show session
6. ☐ Log another session for **Arun Kumar**
7. ☐ Status: **No-show**, Notes: **"Did not show up, called twice"**
8. ☐ Save

✋ **PAUSE — reply: "TEST 11.2 done"**
*Claude will verify: `session_status = 'no_show'`, notes contain the text WITHOUT a `[No-show]` prefix, no `exercise_sets` inserted.*

### 11.3 — Cancelled by client
9. ☐ Log another session: Status: **Cancelled** (client-cancelled), Notes: **"Cancelled 2hr before"**

✋ **PAUSE — reply: "TEST 11.3 done"**
*Claude will verify: `session_status = 'cancelled_client'`.*

---

## TEST 12 — Risk Monitor & Escalation Routing

**What's being tested:** Risk alerts scoped to trainer's clients. Escalation routes to the assessor who cleared the client (not just any assessor).

**Account:** Vinoth Trainer `9200000011`

### 12.1 — Risk Monitor shows correct clients
1. ☐ As Vinoth Trainer, open **Risk** tab (Risk Monitor)
2. ☐ Note which clients appear and their severity
3. ☐ **EXPECT:** only clients linked to Vinoth appear — no unrelated clients

✋ **PAUSE — reply: "TEST 12.1 — clients shown: [names]"**
*Claude will cross-check against `trainer_client_links` for Vinoth.*

### 12.2 — Mark alert as read
4. ☐ Tap any alert in the Risk Monitor list
5. ☐ On the detail screen, tap **Acknowledge / Mark Read**
6. ☐ **EXPECT:** badge or "Acknowledged" label appears; alert moves to read state in list

✋ **PAUSE — reply: "TEST 12.2 done"**
*Claude will confirm `risk_alerts.is_read = true` for that row.*

### 12.3 — Escalate to Assessment Team (H1 routing fix)
7. ☐ On a Risk Alert detail screen, tap **"Escalate to Assessment Team"**
8. ☐ Confirm any prompt
9. ☐ **EXPECT:** success toast

✋ **PAUSE — reply: "TEST 12.3 — escalated for client = [name]"**
*Claude will verify: (a) `escalations` row has `assessor_id` SET — not null, (b) assessor_id matches the one who cleared this client in `assessments`, (c) a `notifications` row of type `risk_escalation` was sent to that same assessor.*

### 12.4 — Assessor receives the escalation
10. ☐ Log in as **Test Assessor `9600000001`**
11. ☐ Open **Notifications** tab → **EXPECT:** new `risk_escalation` notification at top
12. ☐ Open **Escalations** tab → new open escalation visible, assigned to me

✅ **Pass:** escalation routed to correct assessor, not random one.

---

## TEST 13 — Trainer Clearance Filter (H2)

**What's being tested:** Alex Johnson (no assessment) is invisible to all trainers. Active client count only counts cleared clients.

**Account:** Vinoth Trainer `9200000011`

### 13.1 — Alex Johnson not in client list
1. ☐ As Vinoth Trainer → **My Clients** tab
2. ☐ **EXPECT:** Alex Johnson does NOT appear in any list (active or pending)

✋ **PAUSE — reply: "TEST 13.1 — Alex visible? yes/no"**

### 13.2 — Active client count matches filtered list
3. ☐ Note the client count shown on the Trainer Dashboard
4. ☐ Compare to the number of clients in My Clients list

✋ **PAUSE — reply: "TEST 13.2 — dashboard count = X, list count = X"**
*Claude will run the SQL and verify both match the cleared-clients-only filter.*

### 13.3 — Assessment notes in Accept-Decline
5. ☐ Find any **pending client request** in the trainer app (or create one in TEST 1 above)
6. ☐ Open the Accept/Decline screen
7. ☐ **EXPECT:** above the buttons, the client's assessment summary is visible — clearance badge, fitness level, health notes
8. ☐ If no assessment exists → shows "No assessment on file" (not a crash)

✅ **Pass:** assessment context visible before trainer decides.

---

## TEST 14 — Weekly Reflection Persistence (P3.1)

**What's being tested:** Weekly reflection saves to `weekly_reflections` table, reloads when you come back.

**Account:** Test Client `9300000099`

1. ☐ Log in as Test Client → open **Weekly Report**
2. ☐ Note the header shows "Week N · Mon DD — Sun DD" with today in range
3. ☐ In the reflection textarea, type: **"IST timezone test reflection — [your name]"**
4. ☐ Save
5. ☐ Navigate away (go to Dashboard)
6. ☐ Come back to **Weekly Report**
7. ☐ **EXPECT:** the reflection text is pre-populated — not blank

✋ **PAUSE — reply: "TEST 14 done — reflection reloaded? yes/no"**
*Claude will verify: `weekly_reflections` row exists with correct `user_id`, `week_start` = Monday of this IST week, `note` = your text.*

---

## TEST 15 — Weight Trend removed (P3.1)

**What's being tested:** Weight Trend chart was removed from the client Progress screen (passive tracking deferred to post-MVP).

**Account:** any client

1. ☐ Log in as Test Client → open **Progress** screen
2. ☐ Scroll through the entire screen
3. ☐ **EXPECT:** NO weight chart, NO "kg" trend, NO "Weight Trend" heading anywhere
4. ☐ Readiness, Adherence, and other sections still visible and working

✅ **Pass:** no weight section anywhere on the screen.

---

## TEST 16 — IST Date Handling (M1)

**What's being tested:** All dates computed in IST (Asia/Kolkata), not UTC. Especially matters for users logging late at night.

**Account:** any client

1. ☐ Note the **current IST date and time** (e.g. "May 30, 2026, 11:45 PM IST")
2. ☐ Submit a Daily Check-in
3. ☐ Open **Weekly Report** → confirm today's date falls within the "Mon–Sun" week range shown

✋ **PAUSE — reply: "TEST 16 — submitted at [time] IST, week header shows [Mon date – Sun date]"**
*Claude will query `daily_metrics.log_date` for your row and confirm it matches the IST date, not the UTC date.*

---

## TEST 17 — T15 Client Progress View (new screen)

**What's being tested:** The T15 trainer screen showing a client's full progress overview — all 5 sections wired to real data.

**Account:** Vinoth Trainer `9200000011` viewing Arun Kumar

### 17.0 — Quick spot check (do this first, 30 seconds)
1. ☐ Log in as Vinoth Trainer
2. ☐ Navigate to: `https://wellness-connect-git-dev-vinothm13579-7150s-projects.vercel.app/trainer/client-progress/aaf9e9b9-6fae-4540-a4a8-2e1416fd5749`
3. ☐ Check these values (verified from DB):

| Field | Expected | Actual |
|-------|----------|--------|
| Client name | **Arun Kumar** | ______ |
| Avg Readiness (7D) | **62** | ______ |
| Adherence | **100%** (pre-TEST 11) or updated after TEST 11 | ______ |
| Total Check-ins | **3** | ______ |
| Sleep | **8.3 hrs** | ______ |
| Energy | **7/10** (DB 3.5 × 2 = 7) | ______ |
| Mood | **7/10 or 8/10** (DB 3.7 × 2 = 7.4 → rounds to 7) | ______ |
| Pain | **6.0/10 — lower is better** | ______ |
| Current Program | **1 active plan visible** | ______ |

✋ **PAUSE — reply: "TEST 17.0 — [fill the Actual column]"**
*If all match: T15 is wired correctly. If any mismatch: stop and report.*

### 17.1 — Five sections render correctly
4. ☐ **SUMMARY cards (2×2):** Avg Readiness (7D), Adherence, Total Check-ins, Current Streak — all show values or "—"
5. ☐ **READINESS TREND (14 days):** bar chart visible, bars color-coded (green/amber/red), legend below
6. ☐ **METRIC AVERAGES (30 days):** Sleep hrs, Energy /10, Mood /10, Pain /10 with "lower is better"
7. ☐ **RECENT CHECK-INS:** table with Date, Readiness (color-coded), Done (✓/✗)
8. ☐ **CURRENT PROGRAM:** program name, "Week N of M", sessions/week, status badge, **Edit Program** button

### 17.2 — Edit Program button
9. ☐ Tap **Edit Program**
10. ☐ **EXPECT:** navigates to the Program Builder for Arun Kumar — not a crash, not a blank screen

### 17.3 — View Full Progress link on Client Detail
11. ☐ From My Clients, tap **Arun Kumar** → opens Client Detail
12. ☐ **EXPECT:** a "View Full Progress" card or button visible → tapping it opens the T15 screen

### 17.4 — Empty state (no data client)
13. ☐ Navigate to: `https://wellness-connect-git-dev-vinothm13579-7150s-projects.vercel.app/trainer/client-progress/bec6135c-bcba-4073-a5a4-890369d191f9`
    *(This is Test Client — has some data but may have empty sections)*
14. ☐ Try also Michael Torres if he has no sessions logged: `33333333-3333-3333-3333-333333333333`
15. ☐ **EXPECT:** all 5 sections render gracefully — "—" for missing values, no crashes, no blank page

### 17.5 — Alex Johnson (edge case)
16. ☐ Navigate to: `https://wellness-connect-git-dev-vinothm13579-7150s-projects.vercel.app/trainer/client-progress/11111111-1111-1111-1111-111111111111`
17. ☐ **EXPECT:** either graceful empty state OR "not your client" message
18. ☐ **NOT acceptable:** crash, blank white page, or JavaScript error in console

✋ **PAUSE — reply: "TEST 17.5 — saw: [what you saw]"**
*Claude will advise on whether the observed behaviour is correct.*

---

# PART 3 — Backend Evidence (Claude verifies after all tests)

After all sections are reported back, Claude will run a full DB sweep and produce an evidence report covering:

- `daily_metrics` — no duplicates, upsert working, log_date in IST
- `workout_logs` — `adherence_score` in {20,40,60,80,100} (not raw 1–5), `session_status` correctly mapped
- `meal_logs` — no duplicates per (user, date, meal_type)
- `risk_alerts` — correctly scoped to trainer's clients
- `escalations` — new rows have `assessor_id` set (H1 routing fix working)
- `notifications` — `risk_escalation` type notifications sent to correct assessor
- `weekly_reflections` — correct `week_start` (Monday of IST week)
- Clearance filter — Alex Johnson absent from trainer views

---

## How to report results

For each test, use this format:

```
TEST 9.1 — PASS. Score = 87, green band. No alert.
TEST 9.2 — PASS. Score = 18, red band. Risk banner appeared.
TEST 11.1 — PASS. Toast appeared, returned to client detail.
TEST 13.1 — FAIL. Alex Johnson appeared in My Clients list.
TEST 17.0 — Avg Readiness = 62 ✅, Adherence = 33% (after TEST 11) ✅, Energy = 7/10 ✅ ...
```

**Rules for good reports:**
- Describe what you **actually saw**, not what you expected.
- For any FAIL: exact test + step number, expected vs actual, screenshot if visual.
- If a step was blocked, say so — don't skip silently.

---

## What's already known (don't report these as new bugs)

1. **Edit Profile form opens blank** — doesn't pre-fill. Fix is planned.
2. **Rejection banner overflows on narrow mobile** — cosmetic, logged.
3. **Asha Assessor doesn't receive routed messages** — use Test Assessor instead.
4. **Weight Trend is intentionally absent** from client Progress screen — passive tracking deferred to post-MVP.
5. **6 legacy `workout_logs` rows have `adherence_score = null`** — pre-P2.1 test data. Harmless, will be cleaned before production.

---

## After testing passes

Once all tests pass on the dev URL, merge `dev → main` on GitHub:
- Go to: `https://github.com/VinothMathaiyan/WellnessConnect`
- Open a Pull Request from `dev` → `main`
- Merge → Vercel auto-deploys to production within ~2 minutes

**Remaining pre-production items (separate sessions — not for this test pass):**
- RLS policies per table (trainer/client/assessor data isolation)
- Remove hardcoded admin credentials from client bundle
- Twilio for real SMS OTP
- T17/T18 Payment screens (post-MVP)
- Meal image scanning (needs Anthropic API credits)
- Drop `daily_logs` dead table + test-data cleanup
