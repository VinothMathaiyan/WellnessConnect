# WellnessConnect — End-to-End Testing Plan

**Run this after Claude Code completes T15.**

This plan covers everything we shipped today:
- Phase 3C (SessionLog, RiskMonitor, RiskAlert)
- Phase 3C.1 (adherence scaling, session_status)
- Phase 4 (Client App wiring)
- P3.1 (Weight Trend removal, weekly reflections)
- P4 (escalation routing, assessment notes, isAuthLoading, pain_score)
- Pre-T15 cleanup (escalation ownership routing, IST dates, meal upsert, trainer clearance filter)
- T15 (Client Progress View)

**How to use this doc:**
- Run each section top-to-bottom in one sitting.
- After each scenario, paste the result back into chat ("Scenario 1.3 passed" / "Failed — screen shows X").
- I'll run live SQL queries against your DB to **verify backend state and confirm the math**.

---

## Test Users (your live DB, as of today)

### Clients

| # | Name | Phone (login) | UUID prefix | Assessment | Trainer link | Existing data |
|---|------|---------------|-------------|------------|---------------|---------------|
| C1 | **Test Client** | `9300000099` | `bec61...` | ✅ cleared | active | 4 check-ins, avg readiness 65 |
| C2 | **Arun Kumar** | `9100000011` | `aaf9e...` | ✅ cleared | active | 3 check-ins, avg readiness 62 |
| C3 | **TestClient One** | `9200000001` | `1f205...` | ✅ cleared | active | 2 check-ins, avg readiness 58 |
| C4 | **Priya Sharma** | `9100000012` | `b3d8a...` | ✅ cleared | active | 1 check-in + meal logs |
| C5 | **ClientVinothAsses** | `9800000001` | `1196c...` | ✅ cleared | none | 0 check-ins |
| C6 | **Michael Torres** | `9100000003` | `33333...` | ✅ cleared | active | 0 check-ins (clean slate) |
| C7 | **Alex Johnson** | `9100000001` | `11111...` | ❌ **none** | none | 0 check-ins (clearance-filter test) |

### Trainers

| # | Name | Phone (login) | UUID prefix |
|---|------|---------------|-------------|
| T1 | **Vinoth Trainer** | `9200000011` | `d1607...` |
| T2 | **VinothTest** | `9200000002` | `467b6...` |
| T3 | **Nalinitesta** | `9000000103` | `75edf...` |

### Assessors

| # | Name | Phone (login) | UUID prefix |
|---|------|---------------|-------------|
| A1 | **Asha Assessor** | `9600000011` | `d2b57...` |
| A2 | **Test Assessor** | `9600000001` | `197db...` |

### Login (dev bypass)
Phone: 10 digits from above table · OTP: `123456`

---

## Section 1 — Smoke tests (do these first, 5 minutes)

Verify nothing is broken end-to-end before deep testing.

### 1.1 Login as each role
- [ ] Login as **C1 (Test Client / 9300000099)** → lands on `/client/dashboard`. Should see name and readiness card.
- [ ] Login as **T1 (Vinoth Trainer / 9200000011)** → lands on `/trainer/dashboard`. Should see client count and risk alerts.
- [ ] Login as **A1 (Asha Assessor / 9600000011)** → lands on `/assessment/dashboard`.

### 1.2 Hard refresh during loading
- [ ] As any logged-in user, hit F5. Should briefly show a centered loading spinner, then the screen — NOT a flash of unauthed content. (This verifies `isAuthLoading` guard.)

### 1.3 Each app's main bottom-nav tabs
- [ ] **Client app**: Dashboard, Progress, Trainers, Messages, Alerts — each loads, no console errors.
- [ ] **Trainer app**: Home, Clients, Risk, Messages, Alerts — each loads.
- [ ] **Assessor app**: Dashboard, Clients, Escalations, Messages, Alerts — each loads.

✋ **STOP. Tell me when 1.1–1.3 pass.** I'll then verify the auth/session state in the DB.

---

## Section 2 — Daily Check-in & Readiness Score (discover the formula)

This is the heart of your data model. We're going to **input known values** then **inspect the score** the app calculates, then I'll verify what landed in the DB.

> **Login as C6 (Michael Torres / 9100000003)** — picked deliberately because he has zero check-ins, giving us a clean slate.

### 2.1 BASELINE — high score
Submit a Daily Check-in with these inputs:
- Sleep: **8 hours**
- Mood: **5/5** (highest)
- Energy: **5/5** (highest)
- Water: **8 glasses**
- Pain: **0** (no pain)

After submit, screenshot or note:
- **The readiness score the app displays** = ______ /100
- **Which color band** (green/amber/red)
- **Any alert/banner shown**

✋ **Pause. Reply: "C6 baseline submitted, score = XX".** I'll query the DB to confirm what was actually saved and how the score was computed.

### 2.2 LOW — should trigger risk
- [ ] Log out, log back in as C6.
- [ ] Tap "Daily Check-in" again. **Important**: same day re-submit should **update**, not create a duplicate (this verifies the `(user_id, log_date)` upsert).
- [ ] Submit with:
  - Sleep: **3 hours**
  - Mood: **1/5**
  - Energy: **1/5**
  - Water: **1 glass**
  - Pain: **9** (high)

Note:
- **New readiness score** = ______ /100
- **Color band**
- **Any risk alert created/shown**

✋ **Pause. Reply: "C6 low submitted, score = XX, alert shown = yes/no".** I'll verify:
- Whether the row was upserted (still 1 row, not 2) for C6 today
- Whether a `risk_alerts` row was auto-created
- Whether the formula correlates inputs → output

### 2.3 MEDIUM — boundary check
Submit a third time today (still as C6) — confirm again it upserts to the same row:
- Sleep: **6 hours**
- Mood: **3/5**
- Energy: **3/5**
- Water: **5 glasses**
- Pain: **3**

Note score = ______ /100

✋ **Pause. Reply with score.** I'll verify upsert (still 1 row), and whether any earlier risk alert auto-cleared.

### 2.4 Pain handling (sanity)
The Progress screen should now show pain_score = 3 (not 0, not "—"). Verify:
- [ ] As C6, open Progress screen. Pain reads `3` or similar, not `0`. (Earlier P4 fix.)

✋ **Pause.** I'll cross-check the DB pain_score value.

---

## Section 3 — Adherence Score (workout logging)

Adherence formula (we confirmed in P2.1):
**`adherence_score = effortScore × 20`** (1→20, 2→40, 3→60, 4→80, 5→100)
And the trainer's session_status (`completed` / `no_show` / `cancelled_*`) is recorded separately.

> **Login as T1 (Vinoth Trainer / 9200000011)**.

### 3.1 Log a "completed" session for C2 (Arun Kumar)
- [ ] Open Clients tab. Tap **Arun Kumar**.
- [ ] Tap "Log Session" or navigate to T09 SessionLogScreen.
- [ ] Pick today's date.
- [ ] Status: **Completed**
- [ ] Effort: **4/5**
- [ ] Pick 2-3 exercises (any).
- [ ] Notes: leave blank.
- [ ] Save.

Expected: toast success → navigates back.

✋ **Pause. Reply "C2 session logged effort=4".** I'll verify:
- `workout_logs` row inserted with `adherence_score = 80` (not 4)
- `session_status = 'completed'`
- `exercise_sets` rows for each exercise
- `client_notes` is **null or empty**, NOT prefixed with anything

### 3.2 Log a "no-show" session for C2
- [ ] As T1, log another session for **Arun Kumar**, today again.
- [ ] Status: **No-show**
- [ ] Effort: leave at default (or whatever the form does for no-show)
- [ ] Notes: **"Did not show up, called twice"**
- [ ] Save.

✋ **Pause. Reply done.** I'll verify:
- `workout_logs` row with `session_status = 'no_show'`
- `client_notes` contains the trainer's note WITHOUT a `[No-show]` prefix (the prefix logic was removed)
- `exercise_sets` rows were **NOT** inserted for this no-show

### 3.3 Log a "cancelled by client"
- [ ] Status: **Cancelled** (the form's term for client-cancelled)
- [ ] Notes: **"Cancelled 2hr before, rescheduling"**

✋ **Pause.** I'll verify `session_status = 'cancelled_client'` (mapped correctly per the SESSION_STATUS_MAP).

### 3.4 Adherence on Client Progress View (T15)
Now check that T15's Adherence card correctly counts these 3 sessions:
- 1 completed
- 1 no-show
- 1 cancelled-client

> While still logged in as T1, navigate to **Client Progress View** for **Arun Kumar** (`/trainer/client-progress/aaf9e9b9-6fae-4540-a4a8-2e1416fd5749`).

Expected adherence = 1 completed / 3 total = **33%**.

- [ ] Note the displayed value: ______%

✋ **Pause. Reply with the number.** I'll run the SQL to confirm the formula matches.

---

## Section 4 — Risk Triggers

We need to discover what conditions trigger a `risk_alerts` row. Possible triggers (hypothesis):
- Low readiness score (< some threshold)
- Sustained low mood/sleep over multiple days
- Missed workouts
- Manually created by trainer

### 4.1 Confirm Section 2 created an alert
- Earlier, C6's low check-in (score ~20 or so) may have auto-created an alert.
- [ ] Login as **T1 (Vinoth Trainer / 9200000011)**.
- [ ] Go to **Risk Monitor** tab.
- [ ] Is **Michael Torres** in the list?
  - If yes: ✅ low-readiness trigger works. Note severity (low/medium/high).
  - If no: 🟡 either Michael isn't linked to Vinoth, OR low-readiness doesn't auto-trigger.

✋ **Pause. Reply yes/no and severity.** I'll check the DB and tell you if (a) the alert exists but Vinoth isn't his trainer, or (b) the trigger doesn't fire automatically.

### 4.2 Multiple low check-ins (sustained trigger)
> If 4.1 showed nothing, try this. Login as **C2 (Arun Kumar / 9100000011)**.
- [ ] Submit a low check-in today: sleep 3h, mood 1, energy 1, pain 8.
- [ ] (Tomorrow's check-in can't be tested in one session — note this as a "come back the next day" item.)

✋ **Pause.** I'll check if Arun's risk alert appears in T1's RiskMonitor.

### 4.3 Manual escalation flow (H1 — assessment routing)
This tests our biggest fix: the trainer-escalates flow should route to the **correct assessor** (the one who cleared the client), not just any assessor.

> Login as **T1 (Vinoth Trainer)**. Open **Risk Monitor**. Tap any alert.
- [ ] On the Risk Alert detail screen, tap **"Escalate to Assessment Team"**.
- [ ] Confirm any prompt.

Expected: toast success.

✋ **Pause. Reply "escalated alert for [client name]".** I'll verify:
- `escalations` row inserted with `assessor_id` **set** (not null)
- The assessor_id matches the one in `assessments.assessor_id` for that client
- A `notifications` row of type `risk_escalation` was sent to that same assessor

### 4.4 Assessor receives escalation
> Logout. Log in as the assessor identified in 4.3 (probably **A1 Asha** or **A2 Test Assessor** — I'll tell you who in my verification reply).
- [ ] Open **Notifications** tab → should see the new `risk_escalation` notification at top.
- [ ] Open **Escalations** tab → new open escalation visible, assigned to me.

---

## Section 5 — Trainer Clearance Filter (H2)

Tests that **Alex Johnson** (no assessment) is correctly invisible to trainers.

> Login as **T1 (Vinoth Trainer / 9200000011)**.

### 5.1 Active clients list — Alex should NOT appear
- [ ] Go to **Clients** tab.
- [ ] Verify the list shows only clients with completed assessments.
- [ ] **Alex Johnson should NOT be in the list.** ❌

### 5.2 Active client count — should match the filter
- [ ] Note the count shown on the Dashboard (active clients badge).
- [ ] It should equal the number of clients with `clearance_status IN ('cleared','conditional')` who have an active link to T1.

✋ **Pause. Reply with the count.** I'll verify it matches the SQL.

### 5.3 Pending requests — same filter
- [ ] Open the pending requests / Accept-Decline area.
- [ ] No unassessed clients should appear here either.

---

## Section 6 — Meal Log Upsert (H4)

Tests that re-saving the same meal type same day **updates** rather than duplicates.

> Login as **C4 (Priya Sharma / 9100000012)** — she already has some meal data.

### 6.1 Add a breakfast
- [ ] Open Nutrition. Tap **Add Meal**.
- [ ] Type: **Breakfast**
- [ ] Name: **Test Breakfast A**
- [ ] Calories: **300**
- [ ] Save.

✋ **Pause.** I'll confirm exactly 1 breakfast row for Priya today.

### 6.2 Re-add breakfast (should update, not duplicate)
- [ ] Add another **Breakfast**:
- [ ] Name: **Test Breakfast B**
- [ ] Calories: **500**
- [ ] Save.

Expected: still **1 breakfast row** in DB, now with name "Test Breakfast B" and 500 calories.

✋ **Pause. Reply done.** I'll run the duplicate-check SQL.

### 6.3 Different meal type — should add (not replace)
- [ ] Add **Lunch**, name "Lunch C", 600 cal.

Expected: 2 rows for Priya today (1 breakfast + 1 lunch), no overwrite.

✋ **Pause.** I'll confirm.

---

## Section 7 — IST Date Handling (M1)

Hardest to test manually because it depends on what time you run the test. Best approach: just confirm dates look right.

### 7.1 Today's check-in is dated today (IST)
- [ ] Note the **current IST date** (e.g., May 30, 2026).
- [ ] As any client, submit a check-in.

✋ **Pause. Reply "submitted at [time] IST".** I'll query `daily_metrics.log_date` for that row and confirm it matches the IST date, not the UTC date (which could be off by 1 if you submit late evening).

### 7.2 Weekly report Monday boundary
- [ ] As any client, open Weekly Report.
- [ ] Header says "Week N · Mon DD — Sun DD".
- [ ] Today should fall within that range.
- [ ] Save a reflection note: **"IST timezone test reflection"**.

✋ **Pause.** I'll verify `weekly_reflections.week_start` is the Monday of the current IST week.

---

## Section 8 — T15 Client Progress View (final regression)

> Login as **T1 (Vinoth Trainer)**. Open **Arun Kumar's** Client Progress View.

### 8.1 Summary cards
- [ ] **Avg Readiness (7D)** — number or "—". (Arun has 3 check-ins; if all in last 7 days, will show.)
- [ ] **Adherence** — should be **33%** (from Section 3) or whatever the SQL says.
- [ ] **Total Check-ins** — should be **at least 3** (his 3 baseline + any new ones).
- [ ] **Current Streak** — counts consecutive days ending today.

✋ **Pause. Reply with all 4 values.** I'll run the SQL and verify each one.

### 8.2 Readiness Trend (14 days)
- [ ] Bar chart shows 14 days, Mon–Sun labels.
- [ ] Bars are color-coded: green ≥70, amber 40–69, red <40.
- [ ] Days with no check-in show empty/light bars.
- [ ] Legend visible below.

### 8.3 Metric Averages (30 days)
- [ ] Sleep (hrs) — average from `daily_metrics.sleep_hours`
- [ ] Energy (/10) — should display `energy_score × 2` (DB stores 1–5)
- [ ] Mood (/10) — same doubling rule
- [ ] Pain — raw average with "lower is better" subtitle

✋ **Pause. Reply with the 4 values shown.** I'll cross-check the math.

### 8.4 Recent Check-ins table
- [ ] Up to 10 rows, newest first.
- [ ] Date format like "Sat, May 23".
- [ ] Readiness number color-coded.
- [ ] Done column shows ✓ or ✗.

### 8.5 Current Program card
- [ ] If Arun has an active workout_plan, shows program name, "Week N of M", "X× per week · M weeks total".
- [ ] Status badge (Active/Pending Review/Cancelled).
- [ ] **Edit Program** button → navigates to `/trainer/program-builder/aaf9e9b9-...`.
- [ ] If no plan → empty state "No active program. Assign one →".

### 8.6 Empty-state behavior — Michael Torres
> Open Client Progress View for **Michael Torres** (`/trainer/client-progress/33333333-3333-3333-3333-333333333333`).

Before your Section 2 testing, he had zero data. After Section 2 he has check-ins.
- [ ] All sections render (no crashes).
- [ ] Sections with data show data. Sections without (e.g., no workouts) show "—" or empty state.

### 8.7 Truly empty client — Alex Johnson
> Try **Alex Johnson** (`/trainer/client-progress/11111111-1111-1111-1111-111111111111`).

This is the edge case: a client who shouldn't even appear in trainer queries (Section 5). What happens?
- Expected: either (a) "Access denied / not your client" message, or (b) screen renders with all "—" empty states.
- **NOT acceptable**: crash, blank page, or error.

✋ **Pause. Reply what you saw.** This is a security/UX question for me.

---

## Section 9 — Backend Evidence Pack

After all sections, I'll run a final sweep of the database and produce a single report:

- Counts: `daily_metrics`, `workout_logs`, `risk_alerts`, `escalations`, `meal_logs`, `weekly_reflections`
- Any orphaned data (e.g. workout_logs with no plan)
- Any RLS-disabled tables still showing data (expected: 9, by design)
- IST timezone sanity (any row whose `log_date` looks suspicious vs `created_at`)
- Adherence sample: prove `adherence_score` is in {20,40,60,80,100} for new sessions (vs raw 1–5 corruption pre-P2.1)
- Escalation routing sample: prove `assessor_id` is set on new rows
- Notification fan-out: confirm `risk_escalation` notifications went to the right assessor

---

## How to report results

For each scenario, paste back something like:

```
2.1 — DONE. Inputs as specified. Readiness shown = 87, green band, no alert.
2.2 — DONE. Score dropped to 18. Red banner appeared: "Low readiness detected".
3.1 — DONE. Toast "Session logged" appeared. Returned to client detail.
3.4 — DONE. Adherence card shows 33%.
5.1 — FAIL. Alex Johnson still appears in client list.
```

I'll then query the DB and reply with:
- ✅ confirmed (DB state matches expected)
- ❌ mismatch (here's what DB actually has, here's the likely cause)
- 🟡 surprising but not broken (here's what we learned about the formula)

---

## Known stuff that's NOT being tested here

- **RLS** — intentionally off for testing.
- **T17/T18 Payment** — post-MVP, not built.
- **Twilio SMS** — using dev OTP `123456` instead.
- **Meal image scanning** — needs API credits.
- **Mobile-specific gestures** — test on real mobile when ready.
