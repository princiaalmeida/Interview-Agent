# Autonomous Technical Interview Platform

A **hackathon MVP** multi-agent AI platform for technical interviews. Five distinct AI agents evaluate resumes, interview transcripts, and job descriptions—then debate and produce a final verdict with confidence, evidence, and reasoning trace.

**Features:** Landing page, auth, job platform (domains, jobs, applied), interview flow (camera + voice/text), 5-agent evaluation, debate loop, final analysis report.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), TailwindCSS, ShadCN UI, Recharts |
| Backend | Next.js API Routes |
| AI | OpenAI GPT-4o |
| Storage | In-memory JSON (MongoDB-ready) |

---

## Quick Start

### 1. Install

```bash
cd autonomous-interview-panel
npm install
```

> If `next` is not found after install, use `npx next dev` to run the dev server.

### 2. Environment

Create `.env.local`:

```bash
OPENAI_API_KEY=sk-your-key-here
```

Without the key, the system runs in **mock mode** and returns sample evaluations.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Architecture

### Five Agents

1. **Resume Verification Agent** – Extracts claims, flags vague achievements, scores credibility
2. **Technical Depth Evaluator** – Evaluates conceptual depth, detects memorized answers
3. **Contradiction Detection Agent** – Cross-checks resume vs transcript, flags inconsistencies
4. **Behavioral & Communication Agent** – Evaluates clarity, leadership signals, structured thinking
5. **Hiring Committee Moderator** – Aggregates reports, runs debate loop, produces final decision

### Debate Flow

- **Round 1**: All agents evaluate independently
- **Conflict detection**: Triggers debate if score variance > 3, or contradiction severity > medium
- **Round 2**: Agents see each other’s reports, can defend / revise / challenge
- **Moderator**: Produces final consensus, confidence, reasoning trace

---

## API

### POST /api/evaluate

Request:

```json
{
  "resumeText": "...",
  "transcriptText": "...",
  "jobDescription": "..."
}
```

Response:

```json
{
  "sessionId": "eval_xxx",
  "agentReports": { "resume": {...}, "technical": {...}, "contradiction": {...}, "behavioral": {...} },
  "debateTrace": [...],
  "finalDecision": "HIRE",
  "confidence": 72,
  "summary": "...",
  "disagreements": [...],
  "reasoningTrace": [...]
}
```

### GET /api/session/:id

Returns the full stored evaluation session.

---

## Project Structure

```
autonomous-interview-panel/
├── app/
│   ├── api/
│   │   ├── evaluate/route.ts     # Main evaluation endpoint
│   │   ├── parse-pdf/route.ts    # PDF resume parser
│   │   ├── session/[id]/route.ts
│   │   ├── jobs/route.ts         # Domains + jobs
│   │   └── applied/route.ts      # Applied jobs
│   ├── page.tsx                  # Landing (sign-in, Get Started)
│   ├── jobs/page.tsx             # Job platform
│   ├── interview/page.tsx        # Interview (camera + text)
│   ├── evaluate/[id]/page.tsx    # Results dashboard
│   ├── profile/
│   ├── contact/
│   └── about/
├── components/nav.tsx
├── components/ui/                # ShadCN-style components
├── lib/
│   ├── agents/                   # 5 agent prompts & runners
│   ├── auth-context.tsx
│   ├── jobs-data.ts
│   ├── orchestrator.ts
│   └── store.ts
├── data/sample-input.json
└── docs/
    ├── MVP_DOCS.md               # Folder structure, API, samples
    └── DEMO_SCRIPT.md            # Demo script for judges
```

---

## Sample Test

Use the sample input in `data/sample-input.json`:

```bash
curl -X POST http://localhost:3000/api/evaluate \
  -H "Content-Type: application/json" \
  -d @data/sample-input.json
```

---

## License

MIT.
# Interview-Agent
