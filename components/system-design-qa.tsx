"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Lightbulb,
  Target,
  TrendingUp,
  Sparkles,
  Loader2
} from "lucide-react";

interface EvaluationResult {
  score: number;
  verdict: "HIRE" | "NEED IMPROVEMENT";
  strengths: string[];
  gaps: string[];
  suggestions: string[];
}

interface SystemDesignQuestion {
  id: string;
  title: string;
  difficulty: "easy" | "moderate" | "hard";
  description: string;
  prompt: string;
  topics: string[];
  estimatedTime: string;
  hints: string[];
  constraints?: string[];
  examples?: Array<{
    scenario: string;
    explanation: string;
  }>;
}

const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy", color: "bg-green-100 text-green-800" },
  { value: "moderate", label: "Moderate", color: "bg-yellow-100 text-yellow-800" },
  { value: "hard", label: "Hard", color: "bg-red-100 text-red-800" }
] as const;

const TOPICS = [
  "Web Services",
  "Databases", 
  "Scalability",
  "Real-time Systems",
  "Microservices",
  "Caching",
  "Distributed Systems"
];

export function SystemDesignQA() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "moderate" | "hard">("moderate");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedQuestion, setSelectedQuestion] = useState<SystemDesignQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<SystemDesignQuestion[]>([]);

  const generateQuestion = async () => {
    setIsGeneratingQuestion(true);
    try {
      const response = await fetch("/api/practice/generate-system-design-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          difficulty: selectedDifficulty,
          topic: selectedTopic || undefined
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate question");
      }

      const data = await response.json();
      setSelectedQuestion(data.question);
      setQuestionHistory(prev => [...prev, data.question]);
      setUserAnswer("");
      setEvaluation(null);
    } catch (error) {
      console.error("Error generating question:", error);
      alert("Failed to generate question. Please try again.");
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const evaluateAnswer = async (answer: string): Promise<EvaluationResult> => {
    // Simulate evaluation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simple evaluation logic (in real app, this would call an AI service)
    const hasComponents = answer.toLowerCase().includes("server") || 
                       answer.toLowerCase().includes("database") || 
                       answer.toLowerCase().includes("cache");
    
    const hasScalability = answer.toLowerCase().includes("scale") || 
                         answer.toLowerCase().includes("shard") || 
                         answer.toLowerCase().includes("replica");
    
    const hasFailureHandling = answer.toLowerCase().includes("fail") || 
                            answer.toLowerCase().includes("backup") || 
                            answer.toLowerCase().includes("monitor");
    
    const hasTradeoffs = answer.toLowerCase().includes("trade") || 
                       answer.toLowerCase().includes("vs") || 
                       answer.toLowerCase().includes("versus");

    let score = 0;
    if (hasComponents) score += 3;
    if (hasScalability) score += 3;
    if (hasFailureHandling) score += 2;
    if (hasTradeoffs) score += 2;

    const strengths = [];
    const gaps = [];
    const suggestions = [];

    if (hasComponents) {
      strengths.push("Identified key system components");
    } else {
      gaps.push("Missing core system components");
      suggestions.push("Include servers, databases, caching, and load balancers in your design");
    }

    if (hasScalability) {
      strengths.push("Considered scalability solutions");
    } else {
      gaps.push("No scalability discussion");
      suggestions.push("Discuss horizontal scaling, sharding, and replication strategies");
    }

    if (hasFailureHandling) {
      strengths.push("Addressed failure handling");
    } else {
      gaps.push("Missing failure handling");
      suggestions.push("Include fault tolerance, retries, and monitoring in your design");
    }

    if (hasTradeoffs) {
      strengths.push("Analyzed design trade-offs");
    } else {
      gaps.push("No trade-off analysis");
      suggestions.push("Discuss trade-offs between different design decisions");
    }

    if (answer.length > 500) {
      strengths.push("Provided detailed explanation");
    } else {
      gaps.push("Answer too brief");
      suggestions.push("Provide more detailed explanations with specific examples");
    }

    return {
      score: Math.min(score, 10),
      verdict: score >= 5 ? "HIRE" : "NEED IMPROVEMENT",
      strengths,
      gaps,
      suggestions
    };
  };

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;
    
    setIsEvaluating(true);
    const result = await evaluateAnswer(userAnswer);
    setEvaluation(result);
    setIsEvaluating(false);
  };

  const resetEvaluation = () => {
    setEvaluation(null);
    setUserAnswer("");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600";
    if (score >= 5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            System Design Q&A
          </CardTitle>
          <CardDescription>
            Practice system design with AI-generated questions and instant evaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Difficulty and Topic Selection */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <div className="mt-2 flex gap-2">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <Button
                      key={level.value}
                      variant={selectedDifficulty === level.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(level.value)}
                    >
                      {level.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Topic (Optional)</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="mt-2 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">Random Topic</option>
                  {TOPICS.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Question Button */}
            <Button
              onClick={generateQuestion}
              disabled={isGeneratingQuestion}
              className="w-full gap-2"
            >
              {isGeneratingQuestion ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Question...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Question
                </>
              )}
            </Button>

            {/* Question History */}
            {questionHistory.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Recent Questions:</h4>
                <div className="space-y-2">
                  {questionHistory.slice(-3).map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => {
                        setSelectedQuestion(question);
                        setUserAnswer("");
                        setEvaluation(null);
                      }}
                      className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                        selectedQuestion?.id === question.id
                          ? "border-violet-500 bg-violet-50"
                          : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{question.title}</span>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{question.estimatedTime}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Display */}
      {selectedQuestion && (
        <Card className="bg-slate-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{selectedQuestion.title}</CardTitle>
              <Badge className={getDifficultyColor(selectedQuestion.difficulty)}>
                {selectedQuestion.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">Topics:</span>
              <div className="flex flex-wrap gap-1">
                {selectedQuestion.topics.map((topic, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Problem Description</h4>
                <p className="text-sm text-muted-foreground">{selectedQuestion.description}</p>
              </div>

              {selectedQuestion.constraints && selectedQuestion.constraints.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Constraints</h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {selectedQuestion.constraints.map((constraint, i) => (
                      <li key={i}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedQuestion.examples && selectedQuestion.examples.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Examples</h4>
                  <div className="space-y-2">
                    {selectedQuestion.examples.map((example, i) => (
                      <div key={i} className="rounded-lg border bg-white p-3 text-sm">
                        <p><strong>Scenario:</strong> {example.scenario}</p>
                        <p className="mt-1 text-muted-foreground">{example.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Complete Question</h4>
                <pre className="whitespace-pre-wrap text-sm font-mono bg-white p-3 rounded border">
                  {selectedQuestion.prompt}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Answer Input */}
      {selectedQuestion && (
        <Card>
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your system design answer here..."
                className="min-h-[200px] font-mono"
                disabled={isEvaluating}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {userAnswer.length} characters
                </span>
                <Button
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim() || isEvaluating}
                  className="gap-2"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Answer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evaluation Results */}
      {evaluation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {evaluation.verdict === "HIRE" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Evaluation Result
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getScoreColor(evaluation.score)}`}>
                  {evaluation.score}/10
                </span>
                <Badge 
                  variant={evaluation.verdict === "HIRE" ? "default" : "destructive"}
                  className="text-sm"
                >
                  {evaluation.verdict}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h4 className="flex items-center gap-2 font-medium text-green-700 mb-2">
                    <CheckCircle className="h-4 w-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {evaluation.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-green-600 mt-0.5">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 font-medium text-amber-700 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    Gaps
                  </h4>
                  <ul className="space-y-1">
                    {evaluation.gaps.map((gap, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-amber-600 mt-0.5">•</span>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 font-medium text-blue-700 mb-2">
                  <Lightbulb className="h-4 w-4" />
                  Suggestions for Improvement
                </h4>
                <ul className="space-y-1">
                  {evaluation.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 mt-0.5">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <Button onClick={resetEvaluation} variant="outline" className="w-full">
                Try Another Question
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
