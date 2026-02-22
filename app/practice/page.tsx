"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Clock,
  CheckCircle,
  XCircle,
  Lightbulb,
  TrendingUp,
  RotateCcw,
  Play,
  Pause,
  BarChart3,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { type Difficulty, type Language } from "@/lib/practice/questions";
import { getPerformanceStats, saveAttempt, getNextAttemptNumber, type Attempt } from "@/lib/practice/storage";
import { CodeEditor } from "@/components/practice/code-editor";
import { FeedbackPanel } from "@/components/practice/feedback-panel";
import { PerformanceDashboard } from "@/components/practice/performance-dashboard";
import { SystemDesignQA } from "@/components/system-design-qa";
import { Loader2, Sparkles } from "lucide-react";
import type { GeneratedQuestion } from "@/lib/agents/practice/question-generation-agent";
import type { EvaluationResult } from "@/lib/agents/practice/solution-evaluation-agent";
import type { Feedback } from "@/lib/agents/practice/feedback-agent";
import type { ModeratorSummary } from "@/lib/agents/practice/moderator-agent";

export default function PracticePage() {
  const [practiceMode, setPracticeMode] = useState<"coding" | "system-design">("coding");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy");
  const [selectedQuestion, setSelectedQuestion] = useState<GeneratedQuestion | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("python");
  const [code, setCode] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [moderatorSummary, setModeratorSummary] = useState<ModeratorSummary | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [stats, setStats] = useState(getPerformanceStats());
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<GeneratedQuestion[]>([]);

  useEffect(() => {
    if (selectedQuestion) {
      setCode("");
      setShowFeedback(false);
      setEvaluation(null);
      setFeedback(null);
      setModeratorSummary(null);
      setTimeRemaining(null);
      setTimerRunning(false);
    }
  }, [selectedQuestion, selectedLanguage]);

  const generateNewQuestion = async () => {
    setLoadingQuestion(true);
    try {
      console.log("Generating question:", { difficulty: selectedDifficulty, language: selectedLanguage });
      
      const response = await fetch("/api/practice/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          difficulty: selectedDifficulty,
          language: selectedLanguage,
        }),
      });
      
      const data = await response.json();
      console.log("API response:", { ok: response.ok, hasQuestion: !!data.question, warning: data.warning, error: data.error });
      
      // Always use question if available, even if response is not ok (fallback scenario)
      if (data.question) {
        setSelectedQuestion(data.question);
        setQuestionHistory((prev) => [...prev, data.question]);
        setCode("");
        if (data.warning) {
          console.warn("Warning:", data.warning);
        }
        if (data.error && !data.warning) {
          console.warn("Error occurred but fallback question used:", data.error);
        }
        return;
      }
      
      // Only throw error if no question was returned
      const errorMsg = data.error || data.details || `Failed to generate question: ${response.statusText}`;
      throw new Error(errorMsg);
    } catch (error) {
      console.error("Error generating question:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate question";
      alert(`Error: ${errorMessage}\n\nPlease check:\n1. Server is running (npm run dev)\n2. Check browser console for details\n3. If OpenAI API key is not set, fallback questions should still work`);
    } finally {
      setLoadingQuestion(false);
    }
  };

  const startTimer = useCallback((minutes: number) => {
    setTimeRemaining(minutes * 60);
    setTimerRunning(true);
    setTimerEnabled(true);
  }, []);

  const toggleTimer = useCallback(() => {
    if (timeRemaining === null) {
      startTimer(30); // Default 30 minutes
    } else {
      setTimerRunning((prev) => !prev);
    }
  }, [timeRemaining, startTimer]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (!selectedQuestion) return;
    
    setLoadingEvaluation(true);
    setTimerRunning(false);

    try {
      const response = await fetch("/api/practice/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedQuestion,
          userCode: code,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) throw new Error("Failed to evaluate solution");

      const { evaluation: evalResult, feedback: feedbackResult, moderatorSummary: moderatorResult } = await response.json();
      
      setEvaluation(evalResult);
      setFeedback(feedbackResult);
      setModeratorSummary(moderatorResult);
      setShowFeedback(true);

      const attempt: Attempt = {
        questionId: selectedQuestion.title, // Use title as ID for AI-generated questions
        difficulty: selectedQuestion.difficulty,
        language: selectedLanguage,
        code,
        isCorrect: evalResult.isCorrect,
        timestamp: Date.now(),
        timeSpent: timeRemaining !== null ? (selectedQuestion.difficulty === "easy" ? 600 : selectedQuestion.difficulty === "moderate" ? 1200 : 1800) - timeRemaining : undefined,
        attempts: getNextAttemptNumber(selectedQuestion.title),
      };

      saveAttempt(attempt);
      setStats(getPerformanceStats());
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to evaluate solution");
    } finally {
      setLoadingEvaluation(false);
    }
  }, [selectedQuestion, code, selectedLanguage, timeRemaining]);

  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            setTimerRunning(false);
            if (prev === 1) {
              handleSubmitRef.current(true); // Auto-submit when timer ends
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeRemaining]);

  const handleReattempt = () => {
    if (!selectedQuestion) return;
    setCode("");
    setShowFeedback(false);
    setEvaluation(null);
    setFeedback(null);
    setModeratorSummary(null);
    setTimeRemaining(null);
    setTimerRunning(false);
    setTimerEnabled(false);
  };

  const handleGenerateQuestion = async (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    await generateNewQuestion();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50/30">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Practice Platform</h1>
            <p className="mt-1 text-muted-foreground">Sharpen your skills with interactive challenges</p>
          </div>
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              <Button
                variant={practiceMode === "coding" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPracticeMode("coding")}
                className="gap-2"
              >
                <Code2 className="h-4 w-4" />
                Coding
              </Button>
              <Button
                variant={practiceMode === "system-design" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPracticeMode("system-design")}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                System Design
              </Button>
            </div>
            {practiceMode === "coding" && (
              <Button variant="outline" onClick={() => setShowDashboard(!showDashboard)} className="gap-2">
                <BarChart3 className="h-4 w-4" />
                {showDashboard ? "Hide" : "Show"} Dashboard
              </Button>
            )}
          </div>
        </div>

        {practiceMode === "system-design" ? (
          <SystemDesignQA />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
            {/* Sidebar - Question List */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Question Bank
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedDifficulty} onValueChange={(v) => setSelectedDifficulty(v as Difficulty)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="easy">Easy</TabsTrigger>
                      <TabsTrigger value="moderate">Moderate</TabsTrigger>
                      <TabsTrigger value="hard">Hard</TabsTrigger>
                    </TabsList>
                    <TabsContent value="easy" className="mt-4">
                      <Button
                        onClick={() => handleGenerateQuestion("easy")}
                        disabled={loadingQuestion}
                        className="w-full gap-2"
                      >
                        {loadingQuestion ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Generate Easy Question
                          </>
                        )}
                      </Button>
                      {questionHistory.filter((q) => q.difficulty === "easy").length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Recent Questions:</p>
                          {questionHistory
                            .filter((q) => q.difficulty === "easy")
                            .slice(-5)
                            .map((q, i) => (
                              <button
                                key={i}
                                onClick={() => setSelectedQuestion(q)}
                                className={`w-full rounded-lg border p-2 text-left text-xs transition-colors ${
                                  selectedQuestion?.title === q.title
                                    ? "border-violet-500 bg-violet-50"
                                    : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                                }`}
                              >
                                {q.title}
                              </button>
                            ))}
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="moderate" className="mt-4">
                      <Button
                        onClick={() => handleGenerateQuestion("moderate")}
                        disabled={loadingQuestion}
                        className="w-full gap-2"
                      >
                        {loadingQuestion ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Generate Moderate Question
                          </>
                        )}
                      </Button>
                      {questionHistory.filter((q) => q.difficulty === "moderate").length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Recent Questions:</p>
                          {questionHistory
                            .filter((q) => q.difficulty === "moderate")
                            .slice(-5)
                            .map((q, i) => (
                              <button
                                key={i}
                                onClick={() => setSelectedQuestion(q)}
                                className={`w-full rounded-lg border p-2 text-left text-xs transition-colors ${
                                  selectedQuestion?.title === q.title
                                    ? "border-violet-500 bg-violet-50"
                                    : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                                }`}
                              >
                                {q.title}
                              </button>
                            ))}
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="hard" className="mt-4">
                      <Button
                        onClick={() => handleGenerateQuestion("hard")}
                        disabled={loadingQuestion}
                        className="w-full gap-2"
                      >
                        {loadingQuestion ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Generate Hard Question
                          </>
                        )}
                      </Button>
                      {questionHistory.filter((q) => q.difficulty === "hard").length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Recent Questions:</p>
                          {questionHistory
                            .filter((q) => q.difficulty === "hard")
                            .slice(-5)
                            .map((q, i) => (
                              <button
                                key={i}
                                onClick={() => setSelectedQuestion(q)}
                                className={`w-full rounded-lg border p-2 text-left text-xs transition-colors ${
                                  selectedQuestion?.title === q.title
                                    ? "border-violet-500 bg-violet-50"
                                    : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                                }`}
                              >
                                {q.title}
                              </button>
                            ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {showDashboard && <PerformanceDashboard stats={stats} />}
            </div>

            {/* Main Content */}
            <div className="space-y-4">
              {selectedQuestion ? (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Code2 className="h-5 w-5" />
                            {selectedQuestion.title}
                          </CardTitle>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant={selectedQuestion.difficulty === "easy" ? "default" : selectedQuestion.difficulty === "moderate" ? "secondary" : "destructive"}>
                              {selectedQuestion.difficulty}
                            </Badge>
                            {selectedQuestion.topics && selectedQuestion.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {selectedQuestion.topics.map((topic, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {timerEnabled && timeRemaining !== null && (
                            <div className="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5">
                              <Clock className={`h-4 w-4 ${timeRemaining < 60 ? "text-red-600" : ""}`} />
                              <span className={`font-mono text-sm ${timeRemaining < 60 ? "text-red-600 font-bold" : ""}`}>
                                {formatTime(timeRemaining)}
                              </span>
                            </div>
                          )}
                          <Button variant="outline" size="sm" onClick={toggleTimer} className="gap-2">
                            {timerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            Timer
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleReattempt} className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Re-attempt
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="mb-2 font-semibold">Description</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedQuestion.description}</p>
                      </div>

                      {selectedQuestion.examples && selectedQuestion.examples.length > 0 && (
                        <div>
                          <h3 className="mb-2 font-semibold">Examples</h3>
                          <div className="space-y-2">
                            {selectedQuestion.examples.map((ex, i) => (
                              <div key={i} className="rounded-lg border bg-slate-50 p-3 text-sm">
                                <p><strong>Input:</strong> {ex.input}</p>
                                <p><strong>Output:</strong> {ex.output}</p>
                                {ex.explanation && <p className="mt-1 text-muted-foreground">{ex.explanation}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedQuestion.constraints && selectedQuestion.constraints.length > 0 && (
                        <div>
                          <h3 className="mb-2 font-semibold">Constraints</h3>
                          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                            {selectedQuestion.constraints.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Code Editor</CardTitle>
                        <div className="flex gap-2">
                          {(["python", "javascript", "java", "cpp"] as Language[]).map((lang) => (
                            <Button
                              key={lang}
                              variant={selectedLanguage === lang ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedLanguage(lang)}
                            >
                              {lang === "cpp" ? "C++" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CodeEditor
                        language={selectedLanguage}
                        value={code}
                        onChange={setCode}
                        readOnly={timerEnabled && timeRemaining === 0}
                      />
                      <div className="mt-4 flex gap-2">
                          <Button onClick={() => handleSubmit(false)} disabled={timerEnabled && timeRemaining === 0 || loadingEvaluation} className="gap-2">
                            {loadingEvaluation ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Evaluating...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                Submit Solution
                              </>
                            )}
                          </Button>
                        {selectedQuestion.hints && selectedQuestion.hints.length > 0 && (
                          <Button variant="outline" onClick={() => setShowFeedback(!showFeedback)} className="gap-2">
                            <Lightbulb className="h-4 w-4" />
                            {showFeedback ? "Hide" : "Show"} Hints
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {showFeedback && evaluation && feedback && (
                    <FeedbackPanel
                      question={selectedQuestion}
                      language={selectedLanguage}
                      userCode={code}
                      evaluation={evaluation}
                      feedback={feedback}
                      moderatorSummary={moderatorSummary}
                      onClose={() => setShowFeedback(false)}
                    />
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="flex min-h-[400px] items-center justify-center">
                    <div className="text-center">
                      <Code2 className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-lg font-medium">Select a question to start practicing</p>
                      <p className="mt-2 text-sm text-muted-foreground">Choose from Easy, Moderate, or Hard difficulty levels</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
