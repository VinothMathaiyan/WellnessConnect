# WellnessConnect — Tester 3 Guide

**Thank you for helping us test!** This guide walks you through the full journey of our
health & wellness app, step by step. You don't need any technical knowledge — just follow
each step in order and tell us what you see.

Please read the **Setup** section first. Then do the tests **in order, top to bottom** —
each step builds on the one before it.

---

## ⚙️ Setup — read this first

You will use **two accounts**: one **Client** and one **Trainer**. You'll switch between
them as the steps tell you. There is also a shared **Assessment Team** account that everyone
uses — you'll log into it at a few steps to approve things.

> **The golden rule:** always type the names **exactly** as shown below. When you're in the
> Assessment Team screens you will see **other testers' names too** — only ever tap/approve
> the names that start with **T3** (your tester number). Leave everyone else's alone.
> It's fine if another tester is using the Assessment Team account at the same time as you.

### Your accounts

| Role | Name to type at signup | Phone number to enter | One-time code (OTP) |
|------|------------------------|------------------------|----------------------|
| **Client** | `T3 Client` | `9100000103` | `123456` |
| **Trainer** | `T3 Trainer` | `9200000103` | `123456` |
| **Assessment Team** (shared) | *(already exists — don't rename)* | `9600000001` | `123456` |

### How to use the app

- **Website to open:** https://wellness-connect-git-dev-vinothm13579-7150s-projects.vercel.app
- **Always open it in a private/incognito window**, and on the very first screen press
  **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac) to fully refresh.
- **To switch accounts:** open a **new incognito window** (or log out), then sign in with the
  next phone number. Keep this guide open so you have all three numbers handy.
- **Logging in is simple:** type the phone number → you'll get asked for a code → type
  `123456`. There are no real text messages; the code is always `123456`.

### A note on what we're checking

You **don't** need to verify any numbers or data yourself. Just do each step and note **what
you saw on screen**. After you finish, **we will check everything on our side** to confirm it
worked. If something looks wrong or confusing, that's exactly the kind of feedback we want —
write it down (see the **Feedback** section at the end).

---

## 📋 The tests

Do these **in order**. Each test tells you **which account to log in as**, **what to do**,
and **what you should see**.

---

### TEST 1 — Create your two accounts

**Log in as:** (you'll create both)

**Do this:**
1. Open the website in incognito. Sign up with phone **`9100000103`**, code `123456`.
2. When asked to choose a role, pick **Client**. Enter the name **`T3 Client`**.
3. Fill in the short profile it asks for (age, goals, etc.) and submit.
4. Open a **new incognito window**. Sign up with phone **`9200000103`**, code `123456`.
5. Choose **Trainer**. Enter the name **`T3 Trainer`**. Complete the trainer details
   (certification, specialities, etc.) and submit.

**You should see:**
- The **Client** lands on an **"assessment pending / under review"** screen — *not* the main app.
- The **Trainer** lands on an **"application under review"** screen — *not* the trainer dashboard.

> This is correct! New users are held until the Assessment Team reviews them. The next tests
> fix that.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 2 — The Assessment Team approves your Trainer

**Log in as:** Assessment Team (`9600000001`, code `123456`)

**Do this:**
1. Find the **Trainer Approval** area.
2. In the list, find **`T3 Trainer`** (your trainer — ignore all other names).
3. Open it, review the details, and tap **Approve**.
4. Now switch to your **Trainer** account (`9200000103`).

**You should see:**
- After approving, your **Trainer** account can now reach the **trainer dashboard** (no more
  "under review" screen).

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 3 — The Assessment Team clears your Client

**Log in as:** Assessment Team (`9600000001`)

**Do this:**
1. Find the **Client Queue** (clients waiting for assessment).
2. Find **`T3 Client`** (ignore other names).
3. Open it, fill in the short assessment, set a fitness level, and choose **Clear for Training**.
4. Now switch to your **Client** account (`9100000103`). If it still shows the pending
   screen, tap **Check status** (or refresh).

**You should see:**
- Your **Client** account now opens the **full app**.
- In **Trainers → Discover**, there's a **"Recommended For You"** list of trainers.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 4 — Client connects with the Trainer

**Log in as:** Client → then Trainer

**Do this:**
1. As **Client** (`9100000103`) → **Trainers** → open any trainer's profile → send a
   **request to connect** (or "request callback").
2. Switch to your **Trainer** (`9200000103`) → go to **My Clients**.
3. Find the pending request from **`T3 Client`** → tap **Accept**.

**You should see:**
- As Trainer, **`T3 Client`** moves into your **active clients** list after you accept.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 5 — Trainer builds a program, Client approves it

**Log in as:** Trainer → then Client

**Do this:**
1. As **Trainer** → open **`T3 Client`** → **Program Builder** → create/assign a simple
   program → save.
2. Switch to **Client** → look for a notification or prompt to **review your program** →
   open it → tap **Approve Program**.
3. Go to the Client **Home** screen and refresh (Ctrl/Cmd + Shift + R).

**You should see:**
- Before approving: the Client Home may say **"No active plan yet."** That's expected.
- After approving + refresh: the Client Home now shows your **active program**.

> Why approve? A program only becomes active once the client agrees to it. Until then it's
> waiting — that's normal, not a bug.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 6 — Trainer schedules a session, Client sees it

**Log in as:** Trainer → then Client

**Do this:**
1. As **Trainer** → open **`T3 Client`** → **Schedule Session**.
2. Pick **today's date**, any time, session type **Video**, duration **45 min**, add a note,
   and **Save**.
3. *(Optional)* If it asks for a meeting link, paste a real-looking one like
   `https://meet.google.com/abc-defg-hij` (a made-up word like "landing" will be ignored on
   purpose).
4. Switch to **Client** → look at **Home / upcoming sessions** → open the session.

**You should see:**
- The session appears for the Client at the **same date and time** you picked.
- If you added a real-looking meeting link, the Client sees a **Join** button.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 7 — Trainer marks the session complete

**Log in as:** Trainer

**Do this:**
1. As **Trainer** → open **`T3 Client`** → find the session you scheduled **today** →
   tap **Complete**.

**You should see:**
- The session shows as **Completed**.

> If **Complete** looks greyed out: the button only works for sessions dated **today or
> earlier**, and only once the Client has an **active program** (Test 5). Make sure both are
> done. If it still won't tap, that's useful feedback — note it.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 8 — Client does a daily check-in (Readiness score)

**Log in as:** Client

**Do this:**
1. As **Client** → **Daily Check-in**.
2. **First, do a GOOD day:** sleep ~8 hrs, good mood, high energy, **no pain**, good mobility,
   plenty of water → submit. Note the **Readiness score**.
3. **Then submit again the SAME day as a BAD day:** very little sleep, low mood, low energy,
   **high pain (9–10)**, low mobility, little water → submit. Note the new **Readiness score**.

**You should see:**
- The good-day score is **high** (near the top of 0–100), shown in green.
- The bad-day score is **low**, shown in red, with a message that your **trainer has been
  notified**.
- Submitting twice on the same day **updates** the day — it does **not** create two entries.

> **How the Readiness score works (just so you understand the number — you don't calculate it):**
> It's a 0–100 score built from your 7 daily inputs, weighted like this —
> sleep hours **20**, sleep quality **10**, mood **15**, energy **15**, pain **20**
> (more pain = fewer points), mobility **10**, water **10**. A perfect day ≈ 100; a rough day
> drops into the teens. High pain alone removes a big chunk.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 9 — The risk alert reaches the Trainer and the Assessment Team

**Log in as:** Trainer → then Assessment Team

**Do this:**
1. As **Trainer** (`9200000103`) → open the **Risk** area.
2. Find **`T3 Client`** (from the bad-day check-in in Test 8) → open the alert →
   tap **Acknowledge** → then tap **Escalate to Assessment Team** → confirm.
3. Switch to **Assessment Team** (`9600000001`) → open the **Escalations** area.

**You should see:**
- As Trainer: your Client's alert appears, marked **high** importance.
- After escalating: as Assessment Team, the escalation for **`T3 Client`** appears in the
  **Escalations** list (Open).

> A different trainer should **not** see your client's alert — only the client's own trainer
> does. (You can't easily test that alone; we'll confirm it on our side.)

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 10 — Messaging works across roles

**Log in as:** Trainer → Client → Assessment Team → Trainer

**Do this:**
1. As **Trainer** → open **`T3 Client`** → send a message like "Hello from your trainer".
2. Switch to **Client** → open **Messages** → check the conversation with your trainer.
3. Now reply from the **Client** side: send "Hi coach, got it".
4. Switch back to **Trainer** → open the conversation again.
5. *(Assessment Team channel)* As **Assessment Team** (`9600000001`) → **Messages** → send a
   message to **`T3 Trainer`**. Then switch to your **Trainer** account and open Messages.

**You should see:**
- Both the Client and the Trainer see the **same conversation** with **both** messages, in order.
- The Trainer also sees the message from the **Assessment Team**.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 11 — Adherence score (completed vs missed sessions)

**Log in as:** Trainer

**Do this:**
1. As **Trainer** → open **`T3 Client`** → **Schedule Session** and create **a few sessions
   dated today** (e.g. 3 of them). Save each.
2. On those sessions, set different outcomes:
   - Mark **2 as Complete**.
   - Mark **1 as No-show**.
   - Schedule **1 more** and mark it **Cancelled** (client or trainer — either is fine).
3. Look at the Client's **Adherence score** on the Trainer's client view.

**You should see:**
- An **Adherence score** that reflects sessions kept vs missed. With the example above it
  should read about **67%**.

> **How the Adherence score works (just so you understand it):**
> Adherence = **Completed ÷ (Completed + No-show)**. Cancelled sessions are **ignored**
> (they don't count for or against). So 2 completed + 1 no-show = 2 ÷ 3 ≈ **67%**.
> If there are no completed/missed sessions yet, it shows **"not enough data"**, not 0%.
>
> **Heads-up (not a bug):** the **Client's** own Progress screen shows a *different* adherence
> number, based on how many days the client logged a workout in their check-ins. So the
> Trainer view and the Client view can show **different** adherence numbers — that's expected.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 12 — Weekly reflection saves to the right week

**Log in as:** Client

**Do this:**
1. As **Client** → do **2–3 daily check-ins** if you haven't already (this unlocks the
   Weekly Report).
2. Open the **Weekly Report** → confirm the header shows this week's dates (Monday–Sunday) with
   today inside that range.
3. Type a short reflection (e.g. "Good week overall") → **Save**.
4. Go to another screen (e.g. Home) → come back to the Weekly Report.

**You should see:**
- The header shows the **current week** (starting Monday).
- Your reflection is **still there** (pre-filled) when you come back — it didn't disappear.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 13 — Refresh doesn't break anything

**Log in as:** any of your accounts

**Do this:**
1. While logged in, press **F5** (or refresh) on several different screens — the home screen,
   a details screen, a list screen.

**You should see:**
- A brief loading spinner, then the screen **reloads normally**.
- You should **not** get bounced to the login screen, see a blank page, or get an error.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

## ✅ When you're done — send us your feedback

For each test, please tell us:

1. **Test number** (e.g. "Test 6")
2. **What you saw** — did it match the "You should see" part? (Yes / No / Not sure)
3. **If something was wrong or confusing** — describe it in a sentence, and **attach a
   screenshot** if you can.
4. **Anything that was hard to follow** in this guide.

A simple format works great:

```
Test 1 — OK
Test 2 — OK
Test 3 — Saw the recommended trainers, looked fine
Test 4 — OK
Test 5 — Confusing: I didn't know where to find "approve program"
Test 6 — Session showed but the time looked 1 hour off (screenshot attached)
...
```

**Reminder:** you don't need to check any numbers or data — just tell us what appeared on
screen. We'll verify all the details on our side.

**Thank you, Tester 3!** 🙏
