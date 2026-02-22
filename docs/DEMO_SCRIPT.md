# Demo Script for Judges — Full End-to-End Workflow

**Duration:** 5–7 minutes

---

## 1. Landing Page & Sign-In (30 sec)

1. Open `http://localhost:3000`
2. Point out: "Get Started" is hidden until signed in
3. Sign in with: `demo@example.com` / `Demo User`
4. Show "Get Started" button appears

---

## 2. Job Platform (1 min)

1. Click **Get Started** → Jobs page
2. **Domains:** Frontend, Backend, Full Stack, ML/AI, DevOps
3. Filter by domain (e.g. Full Stack)
4. **Job list:** Show jobs with Apply / Interview
5. Click **Apply** on one job → badge "Applied"
6. Click **Interview** on another → Interview flow

---

## 3. Interview Flow (1–2 min)

1. **Resume Upload:** Upload PDF or paste text
2. Click **Continue to Interview**
3. **AI agents panel:** The **five AI agents** appear **only on this page** (not on Home/Jobs/Profile). They show “Listening…” while the candidate responds.
4. **Camera:** Click **Start Camera** (optional; can skip)
5. **Text input:** Type simulated answers:
   - "I led the team on the dashboard project. We improved performance with caching."
   - "For system design, I'd use a hash map for O(1) lookup and Redis for cache."
   - "I used the STAR format for that situation. I took ownership of the miscommunication."
6. Click **Finish & Run Evaluation**, then **Run Evaluation**

---

## 4. Evaluation Dashboard (2 min)

1. **Final Verdict:** HIRE / NO_HIRE + confidence meter
2. **Agent Score Distribution:** Bar chart
3. **Agent Reports:** Expand reasoning and evidence
4. **Final Analysis Report:** Skills & claims, behavioral signals
5. **Post-Interview Feedback:** Mistakes, areas for improvement (technical/behavioral/communication), and better solutions for next time
6. **Contradictions:** Resume vs transcript mismatches
7. **Committee Disagreements:** Logged conflicts
8. **Debate Trace:** Round 1 initial, Round 2 debate
9. **Reasoning Trace:** Moderator decision evolution

---

## 5. Wrap-Up (30 sec)

- "Five distinct AI agents simulate a hiring committee — **agents only visible during the interview**"
- "Debate loop triggers when agents disagree"
- "**Post-interview feedback** with mistakes and improvement suggestions"
- "Evidence, confidence, reasoning trace logged"
- "Hackathon MVP — production-style multi-agent system"
