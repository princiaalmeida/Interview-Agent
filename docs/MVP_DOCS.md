# Autonomous Technical Interview Platform — MVP Documentation

## Folder Structure

```
autonomous-interview-panel/
├── app/
│   ├── api/
│   │   ├── evaluate/route.ts       # Main evaluation endpoint
│   │   ├── parse-pdf/route.ts      # PDF resume parser
│   │   ├── session/[id]/route.ts   # Get stored session
│   │   ├── jobs/route.ts           # Domains + jobs list
│   │   └── applied/route.ts        # Applied jobs (POST/GET)
│   ├── evaluate/[id]/page.tsx      # Results dashboard
│   ├── interview/page.tsx          # Interview flow (camera + text)
│   ├── jobs/page.tsx               # Job platform
│   ├── profile/page.tsx
│   ├── contact/page.tsx
│   ├── about/page.tsx
│   ├── page.tsx                    # Landing (sign-in, Get Started)
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── nav.tsx
│   └── ui/                         # ShadCN-style components
├── lib/
│   ├── agents/
│   │   ├── prompts.ts              # Agent system prompts
│   │   ├── resume-agent.ts
│   │   ├── technical-agent.ts
│   │   ├── contradiction-agent.ts
│   │   ├── behavioral-agent.ts
│   │   └── moderator-agent.ts
│   ├── auth-context.tsx
│   ├── jobs-data.ts
│   ├── mock-evaluation.ts
│   ├── openai.ts
│   ├── orchestrator.ts
│   ├── store.ts
│   ├── types.ts
│   └── utils.ts
├── data/
│   ├── sample-input.json
│   └── sample-output.json
└── docs/
    ├── MVP_DOCS.md
    └── DEMO_SCRIPT.md
```

---

## API Endpoints

### POST /api/evaluate

**Request:**
```json
{
  "resumeText": "...",
  "transcriptText": "...",
  "jobDescription": "..."
}
```

**Response:**
```json
{
  "sessionId": "eval_1234567890_abc123",
  "agentReports": {
    "resume": { "agentName": "Resume Verification Agent", "credibilityScore": 7, "verdict": "HIRE", ... },
    "technical": { "agentName": "Technical Depth Evaluator", "conceptualDepthScore": 6, ... },
    "contradiction": { "agentName": "Contradiction Detection Agent", ... },
    "behavioral": { "agentName": "Behavioral & Communication Agent", ... }
  },
  "debateTrace": [ { "round": 1, "agentName": "...", "action": "initial", "content": "..." } ],
  "finalDecision": "HIRE",
  "confidence": 72,
  "summary": "...",
  "disagreements": ["..."],
  "reasoningTrace": ["..."]
}
```

### GET /api/session/:id

Returns full stored evaluation session.

### GET /api/jobs

**Response:**
```json
{
  "domains": [ { "id": "fe", "name": "Frontend", "description": "...", "icon": "🎨" } ],
  "jobs": [ { "id": "j1", "domainId": "fullstack", "title": "Senior Full Stack Engineer", ... } ]
}
```

### GET /api/applied

**Response:**
```json
{ "applied": ["j1", "j3"] }
```

### POST /api/applied

**Request:**
```json
{ "jobId": "j1" }
```

### POST /api/parse-pdf

**Request:** `FormData` with `file` (PDF)

**Response:**
```json
{ "text": "Extracted resume text..." }
```

---

## Sample Agent Prompts (Summary)

### Resume Verification Agent
- Extract claims, flag vague achievements
- Credibility score 0–10
- Output: claims[], vagueAchievements[], credibilityScore, verdict, confidence

### Technical Depth Evaluator
- Conceptual depth, memorized answers, system design clarity
- Output: conceptualDepthScore, memorizedAnswerSignals[], shallowReasoningFlags[], verdict

### Contradiction Detection Agent
- Cross-check resume vs transcript
- Output: contradictions[], contradictionSeverityScore, overclaimingFlags[], verdict

### Behavioral & Communication Agent
- Clarity, leadership signals, structured thinking
- Output: clarityScore, communicationScore, leadershipSignals[], verdict

### Moderator Agent
- Reads all reports, detects disagreements
- Triggers debate if needed
- Produces final verdict, confidence, summary, reasoningTrace

---

## Sample Debate Trace

```json
[
  { "round": 1, "agentName": "Resume Verification Agent", "action": "initial", "content": "Credibility: 7/10. Verdict: HIRE." },
  { "round": 1, "agentName": "Technical Depth Evaluator", "action": "initial", "content": "Technical depth: 6/10. Verdict: HIRE." },
  { "round": 1, "agentName": "Contradiction Detection Agent", "action": "initial", "content": "Contradiction severity: 3/10. Verdict: HIRE." },
  { "round": 2, "agentName": "Contradiction Detection Agent", "action": "challenge", "content": "Resume Verification: Please clarify leadership claim.", "targetAgent": "Resume Verification Agent" },
  { "round": 2, "agentName": "Resume Verification Agent", "action": "defend", "content": "Leadership scope may include informal influence." }
]
```

---

## Sample Final Analysis Report

Skills & Claims (from Resume Verification):
- 5 years React experience (verified)
- Led team of 8 (unverified — transcript says "worked with team")

Behavioral Signals (from Behavioral Agent):
- Used STAR format
- Took ownership of failures

---

## Implementation Plan (Hackathon MVP)

1. **Day 1 AM:** Auth, layout, landing, profile, contact, about
2. **Day 1 PM:** Jobs API, domains, job list, applied jobs
3. **Day 2 AM:** Interview flow (resume upload, camera, text input)
4. **Day 2 PM:** Wire to /api/evaluate, results dashboard, final report
5. **Day 3:** Demo script, polish, testing
