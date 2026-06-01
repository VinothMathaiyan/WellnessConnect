# WellnessConnect — E2E Testing Guide v4 (updated May 31 2026)

**Dev URL:** `https://wellness-connect-git-dev-vinothm13579-7150s-projects.vercel.app`
**Always test in incognito + hard refresh** (Ctrl+Shift+R) on first load.
**Latest dev commit:** `bab74af` (risk-alert RLS + CHECK fix) — Vercel READY

This supersedes v3. Results filled in through TEST 12. Remaining: 13–18.

---

## Progress at a glance

| Part | Tests | Status |
|------|-------|--------|
| 1 — Onboarding gates | 1, 2, 3 | Not re-run this pass (built earlier in week, known working) |
| 2 — Recommendation engine | 4, 5, 6, 7, 8 | ✅ All pass |
| 3 — Check-in & readiness | 9.1, 9.2, 9.4 | ✅ Pass (9.3 optional) · formula reworked |
| 4 — Workouts & adherence | 10.1 ✅ · 10.2/10.3 | 🟡 Blocked (status picker not visible) |
| 5 — Risk monitor & escalation | 11.1–11.4 | ✅ Full chain works (1 finding: assessor_id null) |
| 6 — Clearance filter | 12 | ✅ Pass |
| 7 — Nutrition | 14 | ☐ To do |
| 8 — Weekly reflection | 15 | ☐ To do |
| 9 — Client progress (trainer) | 16 | ☐ To do |
| 10 — Visual consistency | 17 | ✅ Mostly done (separate Visual QA pass) |
| 11 — Hard refresh | 18 | ☐ To do |
| (Cross) — Accept/decline notes | 13 | ☐ To do (needs pending link) |

**TOMORROW START HERE → TEST 14 (Nutrition), then 15, 16, 18. TEST 13 needs a pending link first.**

---

## What is WellnessConnect? (2-min orientation)

A platform connecting **clients** with **trainers**, with an **assessment team** as the quality gate.
1. Client signs up + fills health profile
2. Assessment team clears them (cleared / conditional) or holds
3. Recommendation engine matches cleared clients to trainers
4. Trainer must also be assessment-approved
5. Cleared client + approved trainer connect — sessions, check-ins, risk monitoring

The assessment team is the trust layer — the product's core differentiator.

---

## How the recommendation engine works (plain English)

Like matchmaking for trainers. The engine reads the **client's** assessment + profile (goals, fitness level, injuries, coaching-style preference, intensity, gender preference, language) and each **approved trainer's** profile (specialties, focus areas, coaching styles, certifications, experience, languages). It scores every trainer per-client, saves the top 5, and shows the score as a match %. Runs automatically when an assessor clears a client, manually via the dev backfill button, and (in theory) when a client updates their profile.

---

## Test accounts (live DB — verified May 31, 2026, post-dedup)

> ⚠️ Michael's + Alex's UUIDs CHANGED during the May 31 dedup migration. Old seed UUIDs (`1111…`, `3333…`) are DELETED. Canonical UUIDs below.

### Clients

| # | Name | Phone | Assessment | Trainer link | Canonical UUID |
|---|------|-------|------------|--------------|----------------|
| C1 | Test Client | `9300000099` | ✅ cleared | active (VinothTest) | bec6135c-bcba-4073-a5a4-890369d191f9 |
| C2 | Arun Kumar | `9100000011` | ✅ cleared | active (Vinoth Trainer) | aaf9e9b9-6fae-4540-a4a8-2e1416fd5749 |
| C3 | TestClient One | `9200000001` | ✅ cleared | active (VinothTest) | 1f2052c9-747f-4a47-9b91-996cdd3da3db |
| C4 | Priya Sharma | `9100000012` | ✅ cleared | active (Vinoth Trainer) | b3d8a17d-53cc-4f81-a226-97d5df49bfca |
| C5 | ClientVinothAsses | `9800000001` | ✅ cleared | none | 1196caf4-9e14-40c9-99c9-04c086bc25b2 |
| C6 | Michael Torres | `9100000003` | 🟡 conditional | active (VinothTest) | fd4f6548-ebdf-44fc-bf1a-b3505f0ed3ca |
| C7 | Alex Johnson | `9100000001` | ❌ none | declined (VinothTest only) | 77e89d06-0b90-48d3-b9f0-76eaaff3ae45 |

### Trainers

| Name | Phone | State | Canonical UUID |
|------|-------|-------|----------------|
| Vinoth Trainer | `9200000011` | Approved · clients: Arun, Priya | d1607314-57fe-4f26-84ed-810b07dff265 |
| VinothTest | `9200000002` | Approved · clients: Test Client, TestClient One, Michael | — |
| Nalinitesta | `9000000103` | Approved | — |

### Assessors

| Name | Phone | Notes |
|------|-------|-------|
| Test Assessor | `9600000001` | **Use this one** |
| Asha Assessor | `9600000011` | Cleared Arun originally · avoid for messaging tests |

### Fresh unused signup numbers
Clients: `9100000070, 9100000071, 9100000072` · Trainers: `9200000070, 9200000071`

### Login (dev bypass)
Phone (any 10 digits above) + OTP `123456`. Admin: app URL + `/admin` → `admin@wellnessconnect.in` / `WellnessAdmin@2026`.
Entry is now **phone-only** — returning users go straight to dashboard, no name/email re-entry.

---

# PART 1 — Onboarding Gates  (not re-run this pass)

TESTS 1–3 cover client signup gate, trainer approval gate, and trainer rejection/resubmit. Built earlier in the week and known working. Re-run only if regression suspected. (Full steps preserved in v3 if needed.)

---

# PART 2 — Recommendation Engine  ✅ COMPLETE

## TEST 4 — Recommended section for cleared clients ✅ PASS
**Account:** Arun Kumar `9100000011`
Recommended section visible, 2 trainers (Nalinitesta 21%, VinothTest 21%), All Trainers below, no assessment banner. DB-verified.

## TEST 5 — Different clients get different recs ✅ PASS
Test Client (Nalinitesta 28%, VinothTest 28%), TestClient One (21% each), ClientVinothAsses (3 recs incl. Vinoth Trainer 18%). Scores differ per client — engine personalises. **Surfaced + fixed 2 bugs on My Trainer tab:** removed hardcoded mock trainers (Dr. Priya Nair / Arjun Mehta), and "Recommended For You" now reads the real engine instead of a city filter that was hiding results.

## TEST 6 — Uncleared client sees no recs ✅ PASS
Alex Johnson `9100000001` — recommendations not visible (clearance filter holds).

## TEST 7 — Backfill button ✅ PASS
Test Assessor `9600000001` → dashboard bottom → `[Dev] Backfill Recommendations`. Toast "Backfilled 2" on the second run (only 2 clients still had 0 recs at that point — accurate). 4 clients populated total.
> 🐛 Finding: toast counts clients *processed*, not *newly populated*. Cosmetic.

## TEST 8 — Priya recs gap (regression check) ✅ AS EXPECTED
Priya `9100000012` — still 0 recs despite full profile. Known engine-tuning gap; will resolve when engine scoring is loosened or trainer pool grows.

---

# PART 3 — Daily Check-ins & Readiness  ✅ (9.3 optional)

> **Readiness formula was reworked May 31.** Now uses all 7 inputs, pain INVERTED:
> sleep 20 / sleep-quality 10 / mood 15 / energy 15 / pain 20 (inverted: 0 pain = full) / mobility 10 / water 10 = 100.
> Old pre-May-31 scores were NOT retroactively recalculated.

## TEST 9 — Check-in saves + readiness
**Account:** Michael Torres `9100000003`

### 9.1 — High baseline ✅ PASS — readiness 90, green, no alert (old formula; this row predates the rework)
### 9.2 — Low score ✅ PASS — readiness 30 → later 11/16/18 under new formula, red band, "trainer notified" banner
### 9.3 — Medium score ☐ OPTIONAL — skipped; formula already validated at both ends
### 9.4 — Pain not hardcoded ✅ PASS — Progress shows entered pain value (not 0/—)

> Note: water now stored as **litres** (was mis-scaled "glasses"); trainer note now persists + shows on trainer's Check-in Review and T15.

---

# PART 4 — Workouts & Adherence  🟡 PARTIAL

## TEST 10 — Trainer logs sessions
**Account:** Vinoth Trainer `9200000011` logging for Arun Kumar

### 10.1 — Completed session ✅ PASS (scheduled + marked completed; success toast)
### 10.2 — No-show 🟡 BLOCKED — No "No-show" status option visible in the session-logging UI. DB `workout_logs.session_status` only ever shows `completed`.
### 10.3 — Cancelled 🟡 BLOCKED — same; no status picker exposed.

> 🐛 **Finding (TEST 10):** Session status picker (No-show / Cancelled) not visible in trainer UI. Needs investigation — either the picker isn't wired into the logging screen, or it's on a different screen than expected.

---

# PART 5 — Risk Monitor & Escalation  ✅ COMPLETE (1 finding)

> Required fixing a real bug first: low check-ins showed an "alerted" banner but never wrote a `risk_alerts` row. Root cause was DB-layer (missing client INSERT RLS policy + stale alert_type CHECK constraint), not JS. Fixed via migration `20260531_risk_alerts_client_insert_policy.sql`. Rule now live: **readiness < 30 OR pain >= 8** creates a real alert for the client's active trainer.

## TEST 11 — Risk Monitor scoping & escalation
**Account:** Vinoth Trainer `9200000011`

### 11.1 — Risk Monitor shows correct clients ✅ PASS
After Arun's low check-in (readiness 16, pain 10), Risk Monitor shows "1 Critical — Arun Kumar, Low readiness reported". Correctly scoped to Vinoth's clients only.

### 11.2 — Acknowledge ✅ PASS
Tapped alert → Acknowledge → status "Acknowledged". DB confirmed `is_read = true`.

### 11.3 — Escalate ✅ PASS (with finding)
Escalated to assessment team. DB: escalation row created (`raised_by=trainer`, `source_alert_id` links the alert, status `open`).
> 🐛 **Finding (TEST 11.3):** `escalations.assessor_id` is NULL — escalation lands in the shared "Open" queue rather than routing to the assessor who cleared Arun (Asha). Decide: shared-queue (defensible) vs auto-assign to clearing assessor.

### 11.4 — Assessor receives ✅ PASS
Escalation visible in Test Assessor's Escalations tab (Open) with full context + Mark Reviewing / Resolve actions.

---

# PART 6 — Clearance Filter  ✅ COMPLETE

## TEST 12 — Trainer clearance filter ✅ PASS
**Account:** Vinoth Trainer `9200000011`
Alex Johnson does NOT appear in My Clients. Active client count = **2** (Arun + Priya, both cleared). DB-verified: Alex only ever had a `declined` link to VinothTest, never to Vinoth Trainer.

---

# ════════ TESTS BELOW STILL TO RUN ════════

---

# PART 7 — Nutrition

## TEST 14 — Meal log upsert (no duplicates)  ☐ START HERE TOMORROW
**Account:** Priya Sharma `9100000012`

1. ☐ Nutrition → Add Meal: **Breakfast** · "Test Breakfast A" · 300 cal · Save
   ✋ Verify: exactly 1 breakfast row today.
2. ☐ Add **Breakfast** again: "Test Breakfast B" · 500 cal · Save
3. ☐ EXPECT: list shows Test Breakfast B (500) — NOT both A and B
   ✋ Verify: still 1 row, updated to B/500.
4. ☐ Add **Lunch**: "Lunch C" · 600 cal
5. ☐ EXPECT: 2 rows today (Breakfast B + Lunch C)

---

# PART 8 — Weekly Reflection

## TEST 15 — Weekly reflection persists  ☐
**Account:** Test Client `9300000099`

1. ☐ Open Weekly Report
2. ☐ Header shows "Week N · Mon DD — Sun DD" with today in range
3. ☐ Type reflection: **"IST timezone test"** → Save
4. ☐ Go to Dashboard, return to Weekly Report
5. ☐ EXPECT: reflection text pre-populated, not blank
   ✋ Verify: row in `weekly_reflections` with correct `week_start` (Monday IST).

---

# PART 9 — Client Progress View (Trainer)

## TEST 16 — T15 Client Progress View  ☐
**Account:** Vinoth Trainer `9200000011` viewing Arun Kumar
Navigate: `/trainer/client-progress/aaf9e9b9-6fae-4540-a4a8-2e1416fd5749`

### 16.0 — Spot check
| Field | Expected | Actual |
|-------|----------|--------|
| Client name | Arun Kumar | ___ |
| Avg Readiness (7D) | low (recent 11–18 check-ins) | 16 |
| Adherence | ~71% | 71 |
| Pain | high (recent 10/10) — lower is better | 10 |
| Current Program visible | Yes | Yes |
Refer image P9_16.png

### 16.1 — Five sections render [Screenshot attached - P9_16.1.png]
☐ Summary cards (2×2) · ☐ Readiness trend (14d bar chart) · ☐ Metric averages (30d) · ☐ Recent check-ins (incl. trainer note now) · ☐ Current program + Edit Program

### 16.2 — Edit Program → opens Program Builder for Arun ☐ [Yes, Screenshot attached - P9_16.1.png]
### 16.3 — Empty state (Michael `fd4f6548-...`) → "—" for missing, no crash ☐ [No Michael]
### 16.4 — Edge case (Alex `77e89d06-...`) → graceful empty / "not your client", no crash ☐  [No Michael]

> Note: use the NEW canonical UUIDs above — old `1111…`/`3333…` are deleted. [Thanks]

---

# PART 10 — Visual Consistency  ✅ (covered in separate Visual QA pass)

## TEST 17 — Avatars & headers [Avatars & headers - Already verified. All good]
Mostly verified already. Spot-check: Vinoth shows "V" (photo on dashboard OK), Test Assessor "T", Test Client "T" — consistent across screens. Tab destinations (Alerts/Messages/Progress/Trainers) correctly have NO back arrow. Client home calm (no gradient); Trainer/Assessor dashboards gradient hero. Alerts header standardized.

---

# PART 11 — Hard refresh

## TEST 18 — Hard refresh doesn't break  [Hard refresh doesn't break All good]
1. ☐ Log in (any role) · ☐ F5 anywhere · ☐ EXPECT brief spinner → reloads correctly · ☐ NOT acceptable: login flash, null userId, blank page

---

# TEST 13 — Assessment notes in Accept-Decline  ☐ (needs setup)  [Check all images with prefix P11_*]
**Needs a pending trainer-client link** (TEST 1 creates one as a side effect, or set one up manually). [created a new client - 9300000100]
**Account:** Vinoth Trainer `9200000011`
1. ☐ Open the pending client request
2. ☐ EXPECT above accept/decline: clearance badge, fitness level, health notes [I dont see these batches - P11_T13_Trainer3.png. Proably because i cleared in assessment login before i open this trainer login]
3. ☐ If no assessment → "No assessment on file" (defense-in-depth)

---

# Issues found during this test pass

| # | Test | Description | Severity | Status |
|---|------|-------------|----------|--------|
| 1 | TEST 1.4 | Dashboard flashes ~1–2s before bouncing to "under review" | Medium | Open |
| 2 | TEST 7 | Backfill toast counts processed, not newly-populated | Low | Open |
| 3 | TEST 8 | Priya + VClientOne: cleared, full profile, 0 recs (engine too strict) | Medium | Open |
| 4 | TEST 9 | Water/pain slider values could mismatch input (verify on screen) — water now litres | Low | Watch |
| 5 | TEST 10 | Session status picker (No-show / Cancelled) not visible in trainer UI | Medium | Open |
| 6 | TEST 11.3 | Escalation `assessor_id` NULL — shared queue vs auto-assign to clearing assessor (decide) | Medium | Open |
| 7 | TEST 11 / Client Detail | Client Detail header shows "No active alerts" even when a critical alert exists in Risk Monitor | Low | Open |
| 8 | Cross | Duplicate profiles recur if signup path regresses — UNIQUE(phone) now guards; watch | Low | Watch |

---

# Already known (don't re-report)
1. Backfill button is dev-only (hidden in production by hostname check)
2. Weight Trend chart removed — passive tracking deferred post-MVP
3. Asha Assessor message routing — use Test Assessor instead
4. Edit Profile fields: client can edit name/email; trainer cannot yet (deferred)
5. `daily_logs` dead table — drop pre-deploy
6. RLS is enabled on at least `risk_alerts` (enforcing) — broader RLS posture to be finalised pre-prod
7. Consent: `consent_at` stamped by DB default on profile creation; existing 19 rows honestly NULL (not backfilled)
8. Temporary `[riskAlert] …` console.log still in code — to be stripped now risk flow is confirmed

---

# After all testing passes — Production cut-over
1. **Merge dev → main** (PR on GitHub) → Vercel auto-deploys prod (~2 min)
2. **Smoke test prod** (`wellness-connect-sigma.vercel.app`): TEST 4, 9.1, 12, 17
3. **Pre-launch housekeeping** (see FEATURE_STATUS.md): remove backfill button + service fn, re-enable full RLS per role, remove hardcoded admin creds, wire Twilio, drop `daily_logs`, strip `[riskAlert]` log, delete unused `VITE_GIT_BRANCH` Vercel env var, test-data cleanup, T17/T18 Payment (post-MVP)

---

# How to report results
```
TEST 14 — PASS. 1 breakfast row, updated to B/500, then lunch added = 2 rows
TEST 16 — Arun progress: readiness 18, adherence 71%, all 5 sections render
```
Describe what you actually saw. For FAILs: test + step, expected vs actual, screenshot. Say if a step was blocked — don't skip silently.
