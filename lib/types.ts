// Core evaluation types for the multi-agent system

export type HireDecision = "HIRE" | "NO_HIRE";
export type FinalRecommendation = "Strong Hire" | "Hire" | "Borderline" | "No Hire" | "Strong No Hire";
export type ContradictionType = "timeline" | "technology" | "experience" | "logic";
export type ContradictionSeverity = "low" | "medium" | "high" | "critical";
export type DifficultyLevel = "easy" | "medium" | "hard";
export type ConsistencyLevel = "high" | "moderate" | "low";

export interface EvidenceReference {
  quote: string;
  source: "resume" | "transcript" | "job_description";
  relevance: string;
}

// Resume Verification Agent - NEW STRUCTURE
export interface ResumeVerificationReport {
  agentName: "Resume Verification Agent";
  resume_consistency_score: number; // 0-100
  skill_alignment_score: number; // 0-10
  experience_alignment_score: number; // 0-10
  tool_authenticity_score: number; // 0-10
  project_authenticity_score: number; // 0-10
  flags: string[];
  summary: string;
  timestamp: string;
}

// Technical Depth Evaluator - NEW STRUCTURE
export interface TechnicalDepthReport {
  agentName: "Technical Depth Evaluator";
  technical_score: number; // 0-100
  correctness: number; // 0-10
  depth: number; // 0-10
  practical_experience: number; // 0-10
  problem_solving: number; // 0-10
  clarity: number; // 0-10
  difficulty_level_detected: DifficultyLevel;
  improvement_areas: string[];
  summary: string;
  timestamp: string;
}

// Contradiction Detection Agent - NEW STRUCTURE
export interface ContradictionReport {
  agentName: "Contradiction Detection Agent";
  contradiction_score: number; // 0-100 (lower is better - 0 = no contradictions)
  contradictions_found: {
    type: ContradictionType;
    description: string;
    severity: ContradictionSeverity;
  }[];
  overall_consistency: ConsistencyLevel;
  summary: string;
  timestamp: string;
}

// Behavioral & Communication Agent - NEW STRUCTURE
export interface BehavioralReport {
  agentName: "Behavioral & Communication Agent";
  behavioral_score: number; // 0-100
  confidence: number; // 0-10
  clarity: number; // 0-10
  engagement: number; // 0-10
  professionalism: number; // 0-10
  integrity: number; // 0-10
  malpractice_detected: boolean;
  malpractice_confidence: number; // 0-1
  behavioral_flags: string[];
  summary: string;
  timestamp: string;
}

// Hiring Committee Moderator Agent - NEW STRUCTURE
export interface ModeratorReport {
  agentName: "Hiring Committee Moderator Agent";
  final_score: number; // 0-100
  technical_weighted: number;
  resume_weighted: number;
  behavioral_weighted: number;
  integrity_adjustment: number;
  final_recommendation: FinalRecommendation;
  key_strengths: string[];
  key_risks: string[];
  executive_summary: string;
  timestamp: string;
}

// Debate round (kept for backward compatibility)
export interface DebateEntry {
  round: number;
  agentName: string;
  action: "initial" | "defend" | "revise" | "challenge";
  content: string;
  scoreChange?: number;
  targetAgent?: string;
  timestamp: string;
}

// Post-interview feedback (mistakes, improvements)
export interface InterviewFeedback {
  mistakes: string[];
  improvementAreas: {
    area: "technical" | "behavioral" | "communication" | "resume";
    suggestions: string[];
  }[];
  betterSolutions?: string[];
}

// Session storage structure
export interface EvaluationSession {
  sessionId: string;
  resumeText: string;
  transcriptText: string;
  jobDescription: string;
  resumeAnalysis?: ResumeVerificationReport;
  technicalAnalysis?: TechnicalDepthReport;
  contradictionReport?: ContradictionReport;
  behavioralReport?: BehavioralReport;
  moderatorReport?: ModeratorReport;
  debateRounds: DebateEntry[];
  finalDecision?: {
    verdict: HireDecision;
    recommendation: FinalRecommendation;
    confidence: number;
    summary: string;
    reasoningTrace: string[];
    disagreements: string[];
  };
  feedback?: InterviewFeedback;
  createdAt: string;
  completedAt?: string;
  liveSessionData?: LiveInterviewState; // Add live session data for persistence
}

// ========== Live Video Interview ==========

export type QuestionCategory = "resume" | "technical" | "behavioral" | "company";

export interface InterviewerQuestion {
  spoken_text: string;
  display_text: string;
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  expected_topics: string[];
  wait_for_response: boolean;
}

export interface LiveInterviewState {
  sessionId: string;
  resumeText: string;
  jobDescription: string;
  transcript: { role: "interviewer" | "candidate"; text: string }[];
  questionsAsked: number;
  startedAt: string;
  endedAt?: string;
}

// Real-time (condensed) agent outputs for per-response evaluation
export interface ResumeVerificationSnapshot {
  resume_consistency_score: number;
  flags: string[];
  summary: string;
}

export interface TechnicalSnapshot {
  technical_score: number;
  summary: string;
}

export interface ContradictionSnapshot {
  contradiction_score: number;
  contradictions_found: { type: string; description: string; severity: string }[];
  summary: string;
}

export interface BehavioralSnapshot {
  behavioral_score: number;
  malpractice_detected: boolean;
  malpractice_confidence: number;
  behavioral_flags: string[];
  summary: string;
}

// API request/response types
export interface EvaluateRequest {
  resumeText: string;
  transcriptText: string;
  jobDescription: string;
  currentQuestion?: string;
  candidateAnswer?: string;
  audioFeatures?: Record<string, unknown>;
  videoFeatures?: Record<string, unknown>;
  timeMetadata?: Record<string, unknown>;
}

export interface EvaluateResponse {
  sessionId: string;
  agentReports: {
    resume: ResumeVerificationReport;
    technical: TechnicalDepthReport;
    contradiction: ContradictionReport;
    behavioral: BehavioralReport;
    moderator: ModeratorReport;
  };
  debateTrace: DebateEntry[];
  finalDecision: HireDecision;
  finalRecommendation: FinalRecommendation;
  confidence: number;
  summary: string;
  disagreements: string[];
  reasoningTrace: string[];
  feedback?: InterviewFeedback;
}
