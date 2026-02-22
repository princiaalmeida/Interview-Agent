# Agent Specification Implementation

This document describes the updated agent system matching the new specification.

## Agent Structure

### 1. Resume Verification Agent

**Output Structure:**
```json
{
  "agentName": "Resume Verification Agent",
  "resume_consistency_score": 0-100,
  "skill_alignment_score": 0-10,
  "experience_alignment_score": 0-10,
  "tool_authenticity_score": 0-10,
  "project_authenticity_score": 0-10,
  "flags": ["string"],
  "summary": "string"
}
```

**Scoring:**
- Skill Alignment: How well interview answers match resume skill claims
- Experience Depth Alignment: Whether claimed experience depth matches demonstrated knowledge
- Tool Authenticity: Whether tools mentioned in resume are actually used/understood
- Project Authenticity: Whether project descriptions match interview details

---

### 2. Technical Depth Evaluator

**Output Structure:**
```json
{
  "agentName": "Technical Depth Evaluator",
  "technical_score": 0-100,
  "correctness": 0-10,
  "depth": 0-10,
  "practical_experience": 0-10,
  "problem_solving": 0-10,
  "clarity": 0-10,
  "difficulty_level_detected": "easy|medium|hard",
  "improvement_areas": ["string"],
  "summary": "string"
}
```

**Score Guide:**
- 8-10 → Strong and deep
- 4-7 → Partial
- 0-3 → Weak or incorrect

---

### 3. Contradiction Detection Agent

**Output Structure:**
```json
{
  "agentName": "Contradiction Detection Agent",
  "contradiction_score": 0-100,  // Lower is better
  "contradictions_found": [
    {
      "type": "timeline|technology|experience|logic",
      "description": "string",
      "severity": "low|medium|high"
    }
  ],
  "overall_consistency": "high|moderate|low",
  "summary": "string"
}
```

**Note:** Contradiction score is inverted in UI (100 - score) for display purposes.

---

### 4. Behavioral & Communication Agent

**Output Structure:**
```json
{
  "agentName": "Behavioral & Communication Agent",
  "behavioral_score": 0-100,
  "confidence": 0-10,
  "clarity": 0-10,
  "engagement": 0-10,
  "professionalism": 0-10,
  "integrity": 0-10,
  "malpractice_detected": boolean,
  "malpractice_confidence": 0-1,
  "behavioral_flags": ["string"],
  "summary": "string"
}
```

**Malpractice Detection:**
- If `malpractice_detected` is true with `malpractice_confidence > 0.75`, moderator applies strong penalty
- Supports audio/video feature analysis (if provided in request)

---

### 5. Hiring Committee Moderator Agent

**Output Structure:**
```json
{
  "agentName": "Hiring Committee Moderator Agent",
  "final_score": 0-100,
  "technical_weighted": number,      // 40% of technical_score
  "resume_weighted": number,          // 15% of resume_consistency_score
  "behavioral_weighted": number,      // 20% of behavioral_score
  "integrity_adjustment": number,     // Penalty for contradictions/malpractice
  "final_recommendation": "Strong Hire|Hire|Borderline|No Hire|Strong No Hire",
  "key_strengths": ["string"],
  "key_risks": ["string"],
  "executive_summary": "string"
}
```

**Weighting:**
- Technical Score: 40%
- Resume Consistency: 15%
- Behavioral Score: 20%
- Communication (clarity): 10%
- Integrity & Contradictions: 15%

**Recommendation Levels:**
- Strong Hire
- Hire
- Borderline
- No Hire
- Strong No Hire

---

## API Changes

### POST /api/evaluate

**Request (enhanced):**
```json
{
  "resumeText": "string",
  "transcriptText": "string",
  "jobDescription": "string",
  "currentQuestion": "string (optional)",
  "candidateAnswer": "string (optional)",
  "audioFeatures": {} (optional),
  "videoFeatures": {} (optional),
  "timeMetadata": {} (optional)
}
```

**Response:**
```json
{
  "sessionId": "string",
  "agentReports": {
    "resume": ResumeVerificationReport,
    "technical": TechnicalDepthReport,
    "contradiction": ContradictionReport,
    "behavioral": BehavioralReport,
    "moderator": ModeratorReport
  },
  "finalDecision": "HIRE|NO_HIRE",
  "finalRecommendation": "Strong Hire|Hire|Borderline|No Hire|Strong No Hire",
  "confidence": 0-100,
  "summary": "string",
  "disagreements": ["string"],
  "reasoningTrace": ["string"],
  "feedback": InterviewFeedback
}
```

---

## Frontend Updates

The evaluation dashboard now displays:
1. **Final Verdict Card** - Shows `finalRecommendation` (e.g., "Hire") and confidence
2. **Moderator Report** - Weighted scoring breakdown
3. **Agent Reports** - Each agent shows new scoring structure:
   - Resume: 4 sub-scores (skill, experience, tool, project alignment)
   - Technical: 5 sub-scores (correctness, depth, practical, problem-solving, clarity)
   - Contradiction: Score (lower is better) + contradictions_found array
   - Behavioral: 5 sub-scores + malpractice detection
4. **Contradictions Section** - Shows contradictions_found with type and severity
5. **Post-Interview Feedback** - Mistakes, improvement areas, better solutions

---

## Backward Compatibility

The frontend handles both old and new structures:
- Old: `credibilityScore`, `conceptualDepthScore`, `contradictionSeverityScore`
- New: `resume_consistency_score`, `technical_score`, `contradiction_score`

The system automatically detects and displays the appropriate fields.
