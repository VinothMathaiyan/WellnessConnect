# WellnessConnect — Comprehensive End-to-End Test Cases (v1)

**Created:** Jun 01 2026
**Dev URL:** `https://wellness-connect-git-dev-vinothm13579-7150s-projects.vercel.app`
**Always test in incognito + hard refresh** (Ctrl+Shift+R) on first load.

---

## How to read this document

This is a **fresh, start-from-zero** test plan. It walks the whole product the way a brand-new customer would experience it — a new client signs up, gets assessed, gets matched to a trainer, trains, checks in daily, and the system reacts. It is written so **someone with no prior context** can run it.

Each Part is a stage in the journey. **Parts are sequential** — Part 2 depends on Part 1 being done, and so on. Inside each Part, steps are numbered Point 1, Point 2, Point 3…

Each test case has three things:
- **Business rule** — what *should* happen, in plain English and *why* it matters.
- **Steps** — exactly what to click, with login details.
- **Verify** — what proves it worked (on screen, and what the data should say).

**Dependency callouts** look like this:
> 🔗 **Depends on:** Only after X is done can you do Y.

**Login (dev bypass):** any phone number below + OTP `123456`. Admin portal: app URL + `/admin` → `admin@wellnessconnect.in` / `WellnessAdmin@2026`.

---

## Fresh test accounts for this run (all verified unused as of Jun 01 2026)

Create these as you go — they do **not** exist yet.

| Role | Phone | Use |
|------|-------|-----|
| New Client A | `9100000070` | Main client journey (signup → training → check-ins) |
| New Client B | `9100000071` | Second client (recommendation differences, messaging) |
| New Client C | `9100000072` | Uncleared/hold client (negative gate test) |
| New Trainer A | `9200000070` | Main trainer (approval → takes Client A) |
| New Trainer B | `9200000071` | Second trainer (recurrence, messaging) |

**Existing assessor to use:** Test Assessor `9600000001` (OTP `123456`). Avoid "Asha Assessor" `9600000011` for messaging (known routing quirk). Do **not** use the phone-less "Assessment Team" internal account.

> ⚠️ If a number turns out to be taken, pick the next free one in the `91000000xx` / `92000000xx` range and note the substitution in your report.

---

## The 7 core areas this plan validates (your requested coverage)

1. **Readiness score** — the daily check-in 0–100 calculation (Part 4).
2. **Adherence score** — completed vs scheduled sessions, instructor-led (Part 6).
3. **Message visibility across roles** — who can see what, client ↔ trainer ↔ assessor (Part 8).
4. **Time / session-schedule accuracy** — IST handling, dates, "last active" (Part 5 + Part 9).
5. **Session recurrence** — repeating sessions created correctly (Part 5).
6. **Risk routing** — the right alert reaches the right team at the right moment (Part 7).
7. **Backend score alignment** — on-screen numbers match what the database actually holds (verification baked into every Part).

---

# PART 1 — Client signs up and hits the assessment gate

**Why this matters:** The assessment gate is the product's core promise — no client reaches a trainer without being reviewed. If the gate leaks, the trust model breaks.

## TEST 1.1 — New client signup → "under review", NOT the full app

**Business rule:** A brand-new client who finishes signup must land on an "assessment pending" screen. They must **not** be able to reach the dashboard, trainers, or any client feature until an assessor clears them.

**Steps:**
1. Incognito → dev URL → sign up as **New Client A `9100000070`** → OTP `123456`
2. Choose **Client** role; enter name (e.g. "Test ClientA") + optional email
3. Fill the health profile (age, goals, any conditions)
4. Submit

**Verify:**
- Lands on an "assessment pending / under review" screen — **not** the dashboard.
- Try typing a dashboard URL directly → should bounce back to the pending screen.
- (Data) `profiles` has one row for `9100000070`, role `client`. No `assessments` row yet, or one with status not `completed`.

> 🐛 Known: the dashboard may flash for ~1–2s before bouncing. Auto-corrects. Note if you see it.

## TEST 1.2 — Consent is recorded at signup

**Business rule:** Because this is a health app, the client's agreement to the Privacy Policy + Medical Disclaimer must be captured at signup and **never silently changed later**.

**Verify (data):** the new `9100000070` profile row has a `consent_at` timestamp set at creation (it should be stamped automatically). Re-logging in later must **not** change that timestamp.

---

# PART 2 — Trainer signs up and gets approved

> 🔗 **Depends on:** Nothing — can run alongside Part 1. But a trainer must exist and be **approved** before Part 3 (matching) and Part 5 (sessions) can happen.

## TEST 2.1 — Trainer signup → "under review", NOT the dashboard

**Business rule:** An unapproved trainer must never be visible to clients or reach the trainer dashboard.

**Steps:**
1. Incognito → sign up as **New Trainer A `9200000070`** → OTP `123456`
2. Choose **Trainer** role
3. Complete onboarding: photo, certification, specialisations, languages, session types, experience, bio
4. Submit

**Verify:**
- Lands on "application under review" — **not** the dashboard.
- Type `/trainer/dashboard` directly → bounced to the pending screen.
- (Data) `profiles` row for `9200000070`, role `trainer`; a `trainer_approvals` row with status `pending`.

## TEST 2.2 — Assessor approves the trainer

> 🔗 **Depends on:** TEST 2.1 (a pending trainer must exist).

**Business rule:** Only the assessment team can approve a trainer. Approval flips them to active and makes them discoverable.

**Steps:**
1. Incognito → log in as **Test Assessor `9600000001`** → OTP `123456`
2. Open **Trainer Approval Queue** → find New Trainer A
3. Confirm the full profile is visible (certifications, languages, focus areas, session types, intensity, max clients, experience, bio, phone, city)
4. Tap **Approve**
5. Log in as **New Trainer A `9200000070`** → should now reach the trainer dashboard

**Verify (data):** `trainer_approvals` row for the trainer now `approved`.

## TEST 2.3 — Rejection + resubmit (optional but recommended)

**Business rule:** A rejected trainer must see a clear reason and be able to fix and resubmit.

**Steps:** As assessor, reject with an empty reason → should be blocked ("provide a reason"). Reject New Trainer B `9200000071` (sign them up first) with reason "Please re-upload a clearer certification" → as the trainer, see the rejection banner + reason → "Update profile and resubmit" → fields pre-filled → resubmit → assessor approves.

---

# PART 3 — Assessment clears the client, engine matches trainers

> 🔗 **Depends on:** Part 1 (client signed up) **and** Part 2 (at least one approved trainer).

## TEST 3.1 — Assessor clears New Client A

**Business rule:** A client becomes "cleared" (or "conditional") only when an assessor completes their assessment. Clearing is what unlocks the app and triggers trainer matching.

**Steps:**
1. Log in as **Test Assessor `9600000001`**
2. Open **Client Queue** → find New Client A `9100000070`
3. Complete the assessment questionnaire → set fitness level + health notes → **Clear for Training** (clearance = cleared)

**Verify (data):** `assessments` row for the client: status `completed`, clearance_status `cleared`, fitness_level + health_notes populated.

## TEST 3.2 — Cleared client now sees the full app + recommendations

> 🔗 **Depends on:** TEST 3.1.

**Business rule:** Once cleared, the client gets full access, and the recommendation engine shows matched trainers (top matches with a match %). Matching reads the client's profile/goals/city against each approved trainer.

**Steps:**
1. Log in as **New Client A `9100000070`** → tap "Check status" if still on the pending screen → full app should unlock
2. Go to **Trainers → Discover**

**Verify:**
- A **"Recommended For You"** section with 1–5 trainers, each showing name, location, experience, match %.
- An **"All Trainers"** section below.
- **No** "complete your assessment" banner.
- (Data) `trainer_recommendations` rows exist for this client.

## TEST 3.3 — Uncleared client sees NO recommendations (negative test)

**Business rule:** A client who is **not** cleared must never see trainer recommendations — the gate must hold.

**Steps:** Sign up **New Client C `9100000072`**, complete profile, but do **not** have the assessor clear them. Try Trainers → Discover.

**Verify:** Either a yellow "complete your assessment" banner or redirect to the pending screen. **Recommendations must not appear.**

## TEST 3.4 — Different clients get different recommendations

**Business rule:** The engine personalises per client — it is not one global list.

**Steps:** Clear New Client B `9100000071` too (different goals/city if possible). Compare the recommended trainers + match scores for Client A vs Client B.

**Verify:** The rankings/scores differ between the two clients. If identical in identical order, flag it.

---

# PART 4 — Daily check-ins and the Readiness score

> 🔗 **Depends on:** Part 3 (client is cleared and in the app).

**Readiness formula (business rule — the authoritative definition):**
The readiness score is 0–100, built from 7 daily inputs:
- Sleep hours → 20 points
- Sleep quality → 10 points
- Mood → 15 points
- Energy → 15 points
- Pain → 20 points, **inverted** (0 pain = full 20; max pain = 0)
- Mobility → 10 points
- Water → 10 points

A perfect day = 100. A terrible day ≈ low teens. High pain alone costs the full 20 points.

## TEST 4.1 — High-readiness check-in

**Steps:** As **New Client A `9100000070`** → Daily Check-in:
- Sleep 8.5 hrs · Sleep Quality 5/5 · Mood 5/5 · Energy 5/5 · Pain 0 · Mobility max · Water 2.5 L → Submit

**Verify:**
- Readiness ≈ **100**, green band, no risk alert.
- (Data) one `daily_metrics` row for today with these values; `readiness_score` ≈ 100.

## TEST 4.2 — Low-readiness check-in (re-submit same day = upsert, not duplicate)

**Business rule:** Submitting again on the same day **updates** today's row, never creates a second one.

**Steps:** Same client, same day, submit again:
- Sleep 3 · Quality 2 · Mood 1 · Energy 1 · Pain 9 · Mobility 1 · Water 0.5 → Submit

**Verify:**
- Readiness drops to a low value, red band.
- A risk alert is triggered (see Part 7 for the routing rule — pain ≥ 8 OR readiness < 30 fires an alert).
- (Data) **still one row** for today for this client (upsert), updated to the new values.

## TEST 4.3 — Pain shows the entered value (not hardcoded)

**Steps:** Open the **Progress** screen.
**Verify:** Pain shows the value you entered, not 0 or "—".

> Note: water is stored in **litres**. The readiness formula uses all 7 inputs; double-check the on-screen slider values match what you intended before submitting.

---

# PART 5 — Sessions: scheduling, time accuracy, and recurrence

> 🔗 **Depends on:** Part 3 (an active trainer↔client link). To get one: from Client A's Discover/My Trainer, request New Trainer A; as the trainer, accept the request (Part 8 covers the request/accept messaging too).

## TEST 5.1 — Schedule a single session (time accuracy)

**Business rule:** A trainer schedules a session for a client; the date/time must display correctly in **IST** for both parties, and the client must be notified.

**Steps:**
1. Log in as **New Trainer A `9200000070`** → My Clients → New Client A → **Schedule Session**
2. Pick a date/time a few days out, session type (e.g. Video), duration 45 min, add a note → Save

**Verify:**
- (Data) one `sessions` row: correct `scheduled_at`, `session_type`, `duration_minutes`, status `scheduled`, `is_recurring=false`.
- The time shown to the trainer and later to the client matches the IST time you picked (no off-by-hours shift).
- (Data) a `notifications` row of type `session_scheduled` addressed to the client.

## TEST 5.2 — Client sees the session at the right time

**Steps:** Log in as **New Client A `9100000070`** → Home / upcoming sessions.
**Verify:** The session appears with the same IST date/time. Open it → details correct.

## TEST 5.3 — Recurring sessions create the right number on the right dates

**Business rule:** A recurring session creates one row per occurrence on the correct cadence:
- **Daily** → consecutive days
- **Weekly** → same weekday, +7 days each
- **Twice a week** → alternating +2 / +5 day pattern

**Steps:**
1. As **New Trainer A** → Schedule Session for New Client A → toggle **Recurring** on
2. Choose **Weekly**, count **4**, starting date X → Save

**Verify:**
- (Data) **4** `sessions` rows, all `is_recurring=true`, `recurrence_frequency='weekly'`, `scheduled_at` exactly 7 days apart starting at X.
- Repeat once with **Daily / count 3** → 3 rows on consecutive days.
- Repeat once with **Twice a week / count 4** → dates follow the +2/+5 alternating pattern from the start date.
- Client receives a notification mentioning the recurring count.

## TEST 5.4 — Mark session outcomes (Completed / No-show / Cancelled)

**Business rule:** A trainer records the outcome of a scheduled session. Allowed outcomes: **Completed**, **No-show**, **Cancelled (by client)**, **Cancelled (by trainer)**. These feed the adherence score (Part 6).

**Steps:** As **New Trainer A** → New Client A → expand the SESSIONS list → on a past/scheduled session, confirm all four actions appear → mark one **Completed**, one **No-show**, one **Cancelled (client)**, one **Cancelled (trainer)** (use the recurring rows you created).

**Verify (data):** the `sessions` rows show `completed`, `no_show`, `cancelled_client`, `cancelled_trainer` respectively.

> Note: marking outcomes drives Part 6. A "complete" action is time-gated to on/after the session date; no-show/cancel are available for scheduled sessions.

---

# PART 6 — Adherence score (instructor-led)

> 🔗 **Depends on:** Part 5 (sessions with mixed outcomes exist).

**Adherence formula (business rule — the authoritative definition):**
Adherence measures how many scheduled sessions the client actually completed.
- **Completed** counts toward the score (a session is complete if either trainer or client marks it complete).
- **No-show** counts **against** (it was scheduled and missed).
- **Cancellations** (by either trainer or client) are **excluded entirely** — they don't help or hurt.
- Formula: `completed ÷ (completed + no_show) × 100`. If there are zero such sessions, adherence is "not enough data" (not 0%).
- Window: the last 30 days; sessions still in the future aren't counted.

> ℹ️ **Scope note / open item:** This is the **instructor-led** (trainer-scheduled) adherence shown on the trainer's Client Detail screen. A **second, different** "adherence" appears on the Client Progress view, derived from self-reported check-in workout-days — that one is **pending a business decision** on how self-practice sessions should count. Until that's resolved, expect the two screens to show different numbers. Do not treat that mismatch as a bug for now.

## TEST 6.1 — Adherence math is correct

**Steps:** Using New Client A's sessions (from Part 5), set a known mix, e.g. **5 completed + 1 no-show + 2 cancelled (any mix of client/trainer)**.

**Verify:**
- (Data + screen) adherence = completed ÷ (completed + no_show) = 5 ÷ 6 = **83%**.
- The two cancellations are **excluded** (if counted you'd wrongly get 5÷8 = 63%).
- The no-show is **counted against** (if ignored you'd wrongly get 5÷5 = 100%).

## TEST 6.2 — Empty state

**Steps:** For a client with no past completed/no-show sessions, open their adherence card.
**Verify:** Shows "Not enough data yet" / "Need at least 1 session in the last 30 days" — **not** "0%".

---

# PART 7 — Risk flagging to the right team at the right time

> 🔗 **Depends on:** Part 4 (check-ins) + an active trainer link + (for escalation) an assessor.

**Risk rules (business rules):**
- A check-in with **readiness < 30 OR pain ≥ 8** creates a **risk alert** for the client's **active trainer**.
- Severity is **high** when readiness < 20 or pain = 10; otherwise **medium**.
- **One alert per client per day** — no duplicate spam; it won't re-alarm an alert the trainer already acknowledged.
- The trainer can **acknowledge** the alert, then **escalate** it to the **assessment team**.

## TEST 7.1 — Low check-in creates an alert for the right trainer

> 🔗 **Depends on:** New Client A is linked to New Trainer A.

**Steps:** As **New Client A `9100000070`**, submit a low check-in (e.g. readiness ~16, pain 10) — you may reuse TEST 4.2.

**Verify (data):** a `risk_alerts` row for this client with `trainer_id` = New Trainer A (the client's active trainer), severity `high`. **Not** assigned to any other trainer.

## TEST 7.2 — Alert appears only in the right trainer's Risk Monitor

**Business rule:** A trainer sees risk alerts **only** for their own clients — never another trainer's.

**Steps:** Log in as **New Trainer A `9200000070`** → **Risk** tab.
**Verify:** New Client A appears with the correct severity. Log in as a **different** trainer (e.g. New Trainer B) → New Client A must **not** appear.

## TEST 7.3 — Acknowledge

**Steps:** As New Trainer A → tap the alert → **Acknowledge**.
**Verify (data):** `risk_alerts.is_read = true` for that alert.

## TEST 7.4 — Escalate to the assessment team

**Business rule:** Escalating routes the case to the assessment team's queue.

**Steps:** On the alert detail → **Escalate to Assessment Team** → confirm.
**Verify (data):** an `escalations` row: `raised_by='trainer'`, `source_alert_id` links the alert, status `open`.

> 🐛 **Open finding / business decision:** `escalations.assessor_id` is currently **NULL** — escalations land in a **shared "Open" queue** for all assessors rather than auto-routing to the specific assessor who cleared the client. Decide: shared queue (current) vs auto-assign. The test passes if it reaches the shared queue; flag the routing decision as pending.

## TEST 7.5 — Assessor receives the escalation

**Steps:** Log in as **Test Assessor `9600000001`** → Escalations tab.
**Verify:** The escalation is visible (Open) with full context + Mark Reviewing / Resolve actions.

## TEST 7.6 — No duplicate alert same day

**Steps:** As New Client A, submit another low check-in the **same day**.
**Verify (data):** still **one** alert for the client today (no second row); an already-acknowledged alert is not re-raised.

---

# PART 8 — Message visibility across roles

> 🔗 **Depends on:** Parts 1–3 (client, trainer, assessor all exist).

**Visibility rules (business rules):**
- **Client → Trainer:** a client can message/request a trainer; that creates a notification + a pending link the trainer sees.
- **Trainer → Client:** a trainer can message their linked client.
- **Assessor ↔ Trainer / Assessor ↔ Client:** assessment-team messages are a separate channel (`assessment_messages`) and should only be visible to the two parties in that thread.
- A user must **never** see a message thread they are not part of.

## TEST 8.1 — Client requests a trainer → trainer sees the request

**Steps:**
1. As **New Client A `9100000070`** → Trainers → open New Trainer A's profile → send a message / request to connect (or request callback)
2. Log in as **New Trainer A `9200000070`** → My Clients

**Verify:**
- New Client A appears under **Requests (pending)** with Accept/Decline.
- (Data) a `trainer_client_links` row, status `pending`; a `notifications` row to the trainer; if a message was sent, a `messages` row.
- Tap the pending card → the Accept-Decline detail screen shows the client's **assessment notes** (clearance, fitness level, health notes).

## TEST 8.2 — Trainer accepts → link becomes active

**Steps:** Accept the request (from the card or the detail screen).
**Verify (data):** the link flips `pending → active`; client moves to Active Clients.

## TEST 8.3 — Trainer ↔ client messaging visibility

**Steps:** As New Trainer A → Message New Client A. As New Client A → check messages.
**Verify:** Both see the same thread. A **different** client must not see it.

## TEST 8.4 — Assessment-team message isolation

**Steps:** As **Test Assessor `9600000001`** → Messages → start/continue a thread with New Trainer A. Then log in as **New Trainer B** (not part of the thread).
**Verify:** New Trainer B cannot see the assessor↔Trainer A thread. (Data) `assessment_messages` rows are scoped to the two participant IDs.

> Known: use Test Assessor for messaging, not Asha Assessor (known routing quirk).

---

# PART 9 — Time, dates, and refresh integrity

**Business rules:** All dates/times display in **IST**. "Week" boundaries use Monday (IST). The app must survive a hard refresh on any screen.

## TEST 9.1 — Weekly reflection lands in the correct IST week

> 🔗 **Depends on:** Client has enough daily check-ins to unlock the Weekly Report (the report is gated until the client has logged enough days — currently ~3 in the week).

**Business rule:** A weekly reflection saves against the **Monday of the current IST week** and persists across navigation.

**Steps:**
1. As a client with the Weekly Report unlocked → open Weekly Report
2. Header shows "Week N · Mon DD — Sun DD" with today in range
3. Type a reflection → Save → go to Dashboard → return
4. Reflection should be pre-filled, not blank

**Verify (data):** a `weekly_reflections` row with `note` = your text and `week_start` = the **Monday** of the current IST week. (On Jun 01 2026, week_start should be **2026-06-01**.) If it saves as the prior Sunday, that's a timezone bug.

## TEST 9.2 — "Last active" and check-in dates are correct

**Steps:** After a client checks in today, view them in the trainer's My Clients / Client Detail.
**Verify:** "Last active" reads "Today" (not yesterday/tomorrow); recent check-in dates match the IST calendar dates.

## TEST 9.3 — Hard refresh doesn't break

**Steps:** Logged in as each role, press F5 on several screens (dashboard, a detail screen, a list).
**Verify:** Brief spinner → screen reloads correctly. **Not** acceptable: a flash of the login screen, a blank page, or an error about a missing user.

---

# PART 10 — Backend score alignment (cross-cutting)

**Business rule:** Every number a user sees must match what the database actually stores — no display-only fakes.

This isn't a separate stage; it's a habit applied throughout:
- **Readiness** (Part 4): on-screen score == `daily_metrics.readiness_score`.
- **Adherence** (Part 6): on-screen % == recomputed from `sessions` rows by the Part 6 formula.
- **Risk** (Part 7): the banner/alert == an actual `risk_alerts` row (not just a client-side message).
- **Sessions** (Part 5): what the calendar shows == `sessions` rows (count, dates, recurrence flags).
- **Counts** (clients, pending, escalations): dashboard numbers == row counts in the matching tables.

For each, after the UI shows a value, confirm the underlying row(s). Any divergence is a finding.

---

# Reporting format

For each test, reply like:
```
TEST 5.3 — PASS. Weekly recurrence created 4 sessions 7 days apart (Jun 8/15/22/29), all is_recurring=true.
TEST 7.1 — PASS. risk_alert row for Client A, trainer_id = Trainer A, severity high.
TEST 9.1 — FAIL. week_start saved as 2026-05-31 (Sunday) instead of 2026-06-01 (Monday IST).
```
Describe what you actually saw. For FAILs: test + step, expected vs actual, screenshot if visual. If a step is blocked, say so — don't skip silently.

---

# Open items / pending business decisions (carry into this run)

1. **Two adherence definitions** — instructor-led (sessions) vs self-reported (check-in workout-days). Pending business-team alignment on how self-practice counts. Until then the trainer and client screens may show different adherence numbers — expected, not a bug.
2. **Escalation routing** — `escalations.assessor_id` is NULL → shared queue vs auto-assign to clearing assessor. Decision pending (TEST 7.4).
3. **Self-practice sessions** — not yet represented as schedulable rows; needed before self-practice adherence can be computed the same way as instructor-led.

---

# Post-testing cleanup (run LAST, after sign-off)

Do not run these until the test pass is signed off — they mutate live data.

1. **Test accounts created in this run** — the `91000000xx` / `92000000xx` clients and trainers, plus any sessions/alerts/links they generated. Decide whether to keep them as a permanent fixture set or remove.
2. **Phone-less "Assessment Team" assessor** (`f2884d3d-…`, NULL phone) — it can't be logged into (no phone for OTP) yet it has 3 assessments + 1 escalation attributed to it. If removing, its FK references (assessments.assessor_id, escalations.assessor_id) must be re-pointed to a real assessor (e.g. Test Assessor) **first**, or the delete will fail / orphan rows. Recommend: re-point, then delete — handled as a careful migration, never an ad-hoc delete.
3. **Temporary debug** — strip the `[riskAlert] …` console.log now that the risk flow is confirmed.
4. **Dev-only artifacts** — backfill button + `backfillTrainerRecommendations()`, hardcoded admin creds, `daily_logs` dead table, unused `VITE_GIT_BRANCH` env var — all part of pre-production hardening.

> Cleanup principle (unchanged): Claude writes the SQL, **you** run it in the Supabase SQL editor. Never auto-execute destructive SQL.
