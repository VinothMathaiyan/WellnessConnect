# WellnessConnect — Tester 6 Guide (Harbor)

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
> the names that start with **Harbor** (your names). Leave everyone else's alone.
> It's fine if another tester is using the Assessment Team account at the same time as you.

### Your accounts

| Role | Name to type at signup | Phone number to enter | One-time code (OTP) |
|------|------------------------|------------------------|----------------------|
| **Client** | `Harbor Client` | `9100000155` | `123456` |
| **Trainer** | `Harbor Trainer` | `9200000155` | `123456` |
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
1. Open the website in incognito. Sign up with phone **`9100000155`**, code `123456`.
2. When asked to choose a role, pick **Client**. Enter the name **`Harbor Client`**.
3. Fill in the short profile it asks for (age, goals, health details, etc.) and submit.
4. Open a **new incognito window**. Sign up with phone **`9200000155`**, code `123456`.
5. Choose **Trainer**. Enter the name **`Harbor Trainer`**. Complete the trainer details
   (certification, specialities, etc.) and submit.

**You should see:**
- The **Client** lands on an **"assessment pending / under review"** screen — *not* the main app.
- The **Trainer** lands on an **"application under review"** screen — *not* the trainer dashboard.

> This is correct! New users are held until the Assessment Team reviews them. The next tests
> open things up.

> **Please tell us exactly where each account landed after you signed up:**
> - The **Client** — did it show an "under review / pending" screen, or did it go straight
>   into the app?
> - The **Trainer** — did it show an "under review" screen, or did it go straight to the
>   trainer dashboard?
>
> (Either answer is useful — just tell us what you actually saw.)

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 2 — The Assessment Team approves your Trainer

**Log in as:** Assessment Team (`9600000001`, code `123456`)

**Do this:**
1. Find the **Trainer Approval** area.
2. In the list, find **`Harbor Trainer`** (your trainer — ignore all other names).
3. Open it, review the details, and tap **Approve**.
4. Now switch to your **Trainer** account (`9200000155`).

**You should see:**
- After approving, your **Trainer** account can now reach the **trainer dashboard** (no more
  "under review" screen).

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 3 — The Assessment Team clears your Client

**Log in as:** Assessment Team (`9600000001`)

**Do this:**
1. Find the **Client Queue** (clients waiting for assessment).
2. Find **`Harbor Client`** (ignore other names).
3. Open it. You should be able to **see the client's health details** (age, goals,
   conditions, etc.). Fill in the short assessment, set a fitness level, and choose
   **Clear for Training**.
4. Now switch to your **Client** account (`9100000155`). If it still shows the pending
   screen, tap **Check status** (or refresh).

**You should see:**
- As Assessment Team: the client's health profile is **visible** to you.
- Your **Client** account now opens the **full app**.
- In **Trainers → Discover**, there's a **"Recommended For You"** list of trainers.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 4 — Client connects with the Trainer

**Log in as:** Client → then Trainer

**Do this:**
1. As **Client** (`9100000155`) → **Trainers** → find and open **`Harbor Trainer`**
   (your own trainer — not just any trainer in the list).
2. On the trainer's profile, tap **Request Call Back**. (This sends a connection request to
   that trainer.)
3. Switch to your **Trainer** (`9200000155`) → go to **My Clients**.
4. Under **Requests**, you'll see **`Harbor Client`** marked **PENDING** → tap it to open the
   request.

**You should see:**
- The trainer's **My Clients** header shows a **pending** request (e.g. "0 active · 1 pending").
- Opening the request shows a **review screen** with the client's summary — name, phone, their
  level (e.g. "Beginner"), and the **Assessment Team notes** ("✓ Cleared"). This is the
  trainer's "review before accepting" view.
- Tap **Accept Client** → **`Harbor Client`** moves into the trainer's **active clients**.

> **Please tell us:** when you opened the pending request (before accepting), did the client's
> summary and the "✓ Cleared" assessment note show up, or was that area blank? Either answer
> helps us.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 5 — Trainer creates a program, Client sees it

**Log in as:** Trainer → then Client

**Do this:**
1. As **Trainer** → open **`Harbor Client`** → scroll down to the **Current Program** section →
   tap **Create Program** → build/assign a simple program → save it.
2. Switch to your **Client** account (`9100000155`) → open **Alerts** → tap the
   **new-program notification** → your program opens.

**You should see:**
- The program your trainer created is now **visible to the client** — no approval step needed.
- (If you don't see the notification right away, refresh with Ctrl/Cmd + Shift + R and check
  **Alerts** again.)

> The client does **not** need to approve the program. As soon as the trainer creates it,
> it's active for the client.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 6 — Trainer schedules a session, Client sees it

**Log in as:** Trainer → then Client

**Do this:**
1. As **Trainer** → open **`Harbor Client`** → **Schedule Session**.
2. Pick **today's date** and a **time that is later than right now** (e.g. if it's 4 PM, pick
   6 PM). Choose session type **Video**, duration **45 min**.
3. *(Optional)* If there's a field for a meeting link, you can paste a real-looking one like
   `https://meet.google.com/abc-defg-hij`. It's not required — you can leave it empty.
4. Tap **Schedule Session** to save it.
5. Switch to **Client** (`9100000155`) → look at **Home / upcoming sessions** → open the session.

**You should see:**
- The session appears for the Client at the **same date and time** you picked.
- If you added a meeting link, the Client sees a **Join** button.

> **Please also try this:** as the Trainer, attempt to schedule a session for **today at a
> time that has already passed** (e.g. it's 4 PM and you pick 9 AM today). The app should
> **stop you** with a message asking for a future time. Tell us whether it blocked you or
> let it through.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 7 — Trainer marks the session complete

**Log in as:** Trainer

**Do this:**
1. As **Trainer** → open **`Harbor Client`** → find the session you scheduled **today** →
   tap **Complete**.

**You should see:**
- The session shows as **Completed**.

> If **Complete** looks greyed out: the button only works for sessions dated **today or
> earlier**, and only once the Client has a **program** (Test 5). Make sure both are done.
> If it still won't tap, that's useful feedback — note it.

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
> (more pain = fewer points), mobility **10**, water **10**. A perfect day is about 100; a rough
> day drops into the teens. High pain alone removes a big chunk.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 9 — The risk alert reaches the Trainer and the Assessment Team

**Log in as:** Trainer → then Assessment Team

**Do this:**
1. As **Trainer** (`9200000155`) → open the **Risk** area.
2. Find **`Harbor Client`** (from the bad-day check-in in Test 8) → open the alert →
   tap **Acknowledge** → then tap **Escalate to Assessment Team** → confirm.
3. Switch to **Assessment Team** (`9600000001`) → open the **Escalations** area.

**You should see:**
- As Trainer: your Client's alert appears, marked **high** importance.
- After escalating: as Assessment Team, the escalation for **`Harbor Client`** appears in the
  **Escalations** list (Open).

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 10 — Messaging (the new unified inbox)

Messaging now works from **one place** for everyone: open **Messages**, tap **New**, and
**pick who you want to message**. You'll test several directions.

**Log in as:** Client → Trainer → Assessment Team

**Do this:**

**A) Client → Trainer**
1. As **Client** (`9100000155`) → **Messages** → tap **New**.
2. In the picker you should see your trainer (**Harbor Trainer**) under "My Trainer(s)" and
   **Assessment Team** as another option. Pick **Harbor Trainer**.
3. Send a message like "Hello from Harbor Client".

**B) Client → Assessment Team**
4. Back in **Messages** → **New** → pick **Assessment Team** → send "Question for the team".

**C) Trainer → Client (and reply check)**
5. Switch to **Trainer** (`9200000155`) → **Messages**. You should see the message from
   **Harbor Client**. Open it and **reply** ("Got it, thanks").
6. The trainer can also start a new one: **New** → pick **Harbor Client** or **Assessment
   Team** → send a message.

**D) Assessment Team → anyone (with search)**
7. Switch to **Assessment Team** (`9600000001`) → **Messages** → **New**. There's a
   **search box** — type "Harbor" → you should see **Harbor Trainer** and **Harbor Client** in the
   results. Pick one and send a message.

**You should see:**
- Each time you pick someone and send, a conversation opens with **their name at the top**
  (not the word "Conversation").
- Messages you send appear for **both** people in the same conversation, in order.
- The Client only sees their **own trainer + Assessment Team** as options (not other random
  trainers). The Assessment Team search finds **any** trainer or client.

> **Please confirm:** when you tapped "New", did the right people show up for each role?
> And did your messages show up correctly on the other side?

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 11 — "Contact Support" on WhatsApp

**Log in as:** any of your accounts

**Do this:**
1. Open the **profile menu** (the menu that also has **Log out** — usually the avatar/initials
   in the top corner).
2. Tap **Contact Support** (it has a green WhatsApp icon).

**You should see:**
- It opens **WhatsApp** (app or web) with a chat **already addressed to a support number**
  and a **pre-filled message** like "Hi WellnessConnect support, I need help...".
- You should NOT have to type the number yourself — just the message is ready to send.

> You don't need to actually send the WhatsApp message — just confirm it opened correctly
> and was pre-addressed. Try it from a couple of different roles (Client, Trainer) if you can.

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 12 — Adherence score (completed vs missed sessions)

**Log in as:** Trainer

**Do this:**
1. As **Trainer** → open **`Harbor Client`** → **Schedule Session** and create **a few sessions
   dated today** (e.g. 4 of them, each at a time later than now). Save each.
2. On those sessions, set different outcomes:
   - Mark **2 as Complete**.
   - Mark **1 as No-show**.
   - Mark **1 as Cancelled** (client or trainer — either is fine).
3. On the **Trainer's** view of **`Harbor Client`**, look at the **Adherence score**.

**You should see:**
- On the **Trainer's** client view, an **Adherence score** that reflects sessions kept vs
  missed. With the example above (2 completed + 1 no-show, 1 cancelled ignored) it should be
  around **67%**. (A different mix gives a different number — that's fine.)

> **How the Adherence score works (just so you understand it):**
> Adherence = **Completed divided by (Completed + No-show)**. Cancelled sessions are **ignored**
> (they don't count for or against). So 2 completed + 1 no-show = 2 / 3 = about **67%**.
> If there are no completed/missed sessions yet, it shows **"not enough data"**, not 0%.
>
> **Important — two different "adherence" numbers (this is expected, not a bug):**
> The number above is on the **Trainer's** client view. The **Client's own Progress screen**
> shows a *different* adherence based on how many days the client logged a workout in their
> check-ins — so the Client's Progress screen may show **0%** even when the Trainer's view
> shows 67%. **Don't report that difference as a problem — it's by design.**

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

### TEST 13 — Weekly reflection saves to the right week

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

### TEST 14 — Refresh doesn't break anything

**Log in as:** any of your accounts

**Do this:**
1. While logged in, press **F5** (or refresh) on several different screens — the home screen,
   Messages, a details screen, a list screen.

**You should see:**
- A brief loading spinner, then the screen **reloads normally**.
- Lists (Messages, clients, sessions) **still show their content** after refresh — nothing
  goes blank.
- You should **not** get bounced to the login screen, see a blank page, or get an error.

> **Please note specifically:** after refreshing, did **Messages** and any **profile/health
> details** screens still load their content, or did anything come up empty? (This helps us
> confirm a recent behind-the-scenes change.)

*You don't need to check anything yourself — just tell us what you saw. We'll confirm on our end.*

---

## ✅ When you're done — send us your feedback

For each test, please tell us:

1. **Test number** (e.g. "Test 10")
2. **What you saw** — did it match the "You should see" part? (Yes / No / Not sure)
3. **If something was wrong or confusing** — describe it in a sentence, and **attach a
   screenshot** if you can.
4. **Anything that was hard to follow** in this guide.

A simple format works great:

```
Test 1 — Client showed "under review", Trainer went straight to the dashboard
Test 2 — OK
Test 3 — Could see client's health details, cleared fine
Test 4 — Saw health details on the pending request before accepting; accepted OK
Test 5 — Found the program under Alerts, opened fine
Test 6 — Future session worked; it correctly blocked a past time
Test 10 — New message picker showed the right people; messages appeared on both sides
Test 11 — Contact Support opened WhatsApp pre-addressed
...
```

**Reminder:** you don't need to check any numbers or data — just tell us what appeared on
screen. We'll verify all the details on our side.

**Thank you, Tester 6 (Harbor)!**
