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


## Architecture

### Five Agents

1. **Resume Verification Agent** – Extracts claims, flags vague achievements, scores credibility
2. **Technical Depth Evaluator** – Evaluates conceptual depth, detects memorized answers
3. **Contradiction Detection Agent** – Cross-checks resume vs transcript, flags inconsistencies
4. **Behavioral & Communication Agent** – Evaluates clarity, leadership signals, structured thinking
5. **Hiring Committee Moderator** – Aggregates reports, runs debate loop, produces final decision
