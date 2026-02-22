import type { Difficulty, Language } from "./questions";

export interface Attempt {
  questionId: string;
  difficulty: Difficulty;
  language: Language;
  code: string;
  isCorrect: boolean;
  timestamp: number;
  timeSpent?: number; // in seconds
  attempts: number; // attempt number for this question
}

export interface PerformanceStats {
  totalAttempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  byDifficulty: {
    [key in Difficulty]: {
      attempted: number;
      correct: number;
      incorrect: number;
    };
  };
  byLanguage: {
    [key in Language]: {
      attempted: number;
      correct: number;
    };
  };
  recentAttempts: Attempt[];
  improvement: {
    questionId: string;
    firstAttempt: boolean;
    lastAttempt: boolean;
    attemptsCount: number;
  }[];
}

const STORAGE_KEY = "practice_performance";

export function getPerformanceStats(): PerformanceStats {
  if (typeof window === "undefined") {
    return getDefaultStats();
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return getDefaultStats();
  }
  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultStats();
  }
}

function getDefaultStats(): PerformanceStats {
  return {
    totalAttempts: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    byDifficulty: {
      easy: { attempted: 0, correct: 0, incorrect: 0 },
      moderate: { attempted: 0, correct: 0, incorrect: 0 },
      hard: { attempted: 0, correct: 0, incorrect: 0 },
    },
    byLanguage: {
      python: { attempted: 0, correct: 0 },
      javascript: { attempted: 0, correct: 0 },
      java: { attempted: 0, correct: 0 },
      cpp: { attempted: 0, correct: 0 },
    },
    recentAttempts: [],
    improvement: [],
  };
}

export function saveAttempt(attempt: Attempt): void {
  if (typeof window === "undefined") return;
  const stats = getPerformanceStats();
  
  stats.totalAttempts++;
  if (attempt.isCorrect) {
    stats.correctAnswers++;
  } else {
    stats.incorrectAnswers++;
  }
  
  stats.byDifficulty[attempt.difficulty].attempted++;
  if (attempt.isCorrect) {
    stats.byDifficulty[attempt.difficulty].correct++;
  } else {
    stats.byDifficulty[attempt.difficulty].incorrect++;
  }
  
  stats.byLanguage[attempt.language].attempted++;
  if (attempt.isCorrect) {
    stats.byLanguage[attempt.language].correct++;
  }
  
  stats.recentAttempts.unshift(attempt);
  if (stats.recentAttempts.length > 50) {
    stats.recentAttempts = stats.recentAttempts.slice(0, 50);
  }
  
  // Track improvement
  const existingImprovement = stats.improvement.find((i) => i.questionId === attempt.questionId);
  if (existingImprovement) {
    existingImprovement.attemptsCount++;
    existingImprovement.lastAttempt = attempt.isCorrect;
  } else {
    stats.improvement.push({
      questionId: attempt.questionId,
      firstAttempt: attempt.isCorrect,
      lastAttempt: attempt.isCorrect,
      attemptsCount: 1,
    });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function getQuestionAttempts(questionId: string): Attempt[] {
  const stats = getPerformanceStats();
  return stats.recentAttempts.filter((a) => a.questionId === questionId);
}

export function getNextAttemptNumber(questionId: string): number {
  const attempts = getQuestionAttempts(questionId);
  return attempts.length + 1;
}

export function clearPerformanceData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
