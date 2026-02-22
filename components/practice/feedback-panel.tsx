"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Lightbulb, Code2, BookOpen, TrendingUp, AlertTriangle } from "lucide-react";
import type { GeneratedQuestion } from "@/lib/agents/practice/question-generation-agent";
import type { EvaluationResult } from "@/lib/agents/practice/solution-evaluation-agent";
import type { Feedback } from "@/lib/agents/practice/feedback-agent";
import type { ModeratorSummary } from "@/lib/agents/practice/moderator-agent";
import { cn } from "@/lib/utils";

interface FeedbackPanelProps {
  question: GeneratedQuestion;
  language: string;
  userCode: string;
  evaluation: EvaluationResult | null;
  feedback: Feedback | null;
  moderatorSummary: ModeratorSummary | null;
  onClose: () => void;
}

export function FeedbackPanel({ question, evaluation, feedback, moderatorSummary }: FeedbackPanelProps) {
  const isCorrect = evaluation?.isCorrect ?? false;

  return (
    <div className="space-y-4">
      {/* Evaluation Result */}
      <Card className={cn("border-2", isCorrect ? "border-emerald-200 bg-emerald-50/30" : "border-red-200 bg-red-50/30")}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-emerald-900">Correct Solution!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-900">Solution Needs Improvement</span>
                </>
              )}
            </CardTitle>
            {evaluation && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-lg font-bold">
                  Score: {evaluation.score}/100
                </Badge>
              </div>
            )}
          </div>
          <CardDescription>
            {evaluation?.summary || (isCorrect ? "Great job! Your solution passed all test cases." : "Let's review what went wrong and how to improve.")}
          </CardDescription>
        </CardHeader>
        {evaluation && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border bg-white p-3">
                <p className="text-xs text-muted-foreground">Correctness</p>
                <p className="text-2xl font-bold">{evaluation.correctness}/10</p>
              </div>
              <div className="rounded-lg border bg-white p-3">
                <p className="text-xs text-muted-foreground">Efficiency</p>
                <p className="text-2xl font-bold">{evaluation.efficiency}/10</p>
              </div>
              <div className="rounded-lg border bg-white p-3">
                <p className="text-xs text-muted-foreground">Code Quality</p>
                <p className="text-2xl font-bold">{evaluation.codeQuality}/10</p>
              </div>
            </div>
            {evaluation.mistakes.length > 0 && (
              <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-red-900">
                  <AlertTriangle className="h-4 w-4" />
                  Mistakes Identified
                </h3>
                <ul className="space-y-1 text-sm text-red-800">
                  {evaluation.mistakes.map((mistake, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 text-red-600">•</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* AI Feedback */}
      {feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-600" />
              AI Feedback & Guidance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.explanation && (
              <div>
                <h3 className="mb-2 font-semibold">Explanation</h3>
                <p className="text-sm text-muted-foreground">{feedback.explanation}</p>
              </div>
            )}

            {feedback.whatWasWrong && feedback.whatWasWrong.length > 0 && (
              <div>
                <h3 className="mb-2 font-semibold">What Was Wrong</h3>
                <ul className="space-y-1 text-sm">
                  {feedback.whatWasWrong.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 text-red-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.stepByStepGuidance && feedback.stepByStepGuidance.length > 0 && (
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <TrendingUp className="h-4 w-4" />
                  Step-by-Step Guidance
                </h3>
                <ol className="space-y-2 text-sm">
                  {feedback.stepByStepGuidance.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 font-medium text-violet-600">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {feedback.alternativeApproaches && feedback.alternativeApproaches.length > 0 && (
              <Accordion type="single" collapsible>
                <AccordionItem value="alternatives">
                  <AccordionTrigger className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Alternative Approaches
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {feedback.alternativeApproaches.map((approach, i) => (
                      <div key={i} className="rounded-lg border bg-white p-4">
                        <h4 className="mb-2 font-semibold">{approach.approach}</h4>
                        {approach.code && (
                          <pre className="mb-3 overflow-x-auto rounded-lg border bg-slate-50 p-3 text-xs">
                            <code>{approach.code}</code>
                          </pre>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="mb-1 text-xs font-semibold text-emerald-700">Pros:</h5>
                            <ul className="list-inside list-disc text-xs text-emerald-600">
                              {approach.pros.map((pro, j) => (
                                <li key={j}>{pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="mb-1 text-xs font-semibold text-red-700">Cons:</h5>
                            <ul className="list-inside list-disc text-xs text-red-600">
                              {approach.cons.map((con, j) => (
                                <li key={j}>{con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {feedback.hints && feedback.hints.length > 0 && (
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <Lightbulb className="h-4 w-4 text-amber-600" />
                  Hints
                </h3>
                <ul className="space-y-1 text-sm">
                  {feedback.hints.map((hint, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 text-amber-600">💡</span>
                      <span>{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.improvementTips && feedback.improvementTips.length > 0 && (
              <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-4">
                <h3 className="mb-2 font-semibold text-emerald-900">Improvement Tips</h3>
                <ul className="space-y-1 text-sm text-emerald-800">
                  {feedback.improvementTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 text-emerald-600">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Moderator Summary */}
      {moderatorSummary && (
        <Card className="border-violet-200 bg-violet-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-white p-4">
              <p className="text-sm">{moderatorSummary.summary}</p>
            </div>
            {moderatorSummary.strengths.length > 0 && (
              <div>
                <h3 className="mb-2 font-semibold text-emerald-700">Strengths</h3>
                <ul className="space-y-1 text-sm text-emerald-800">
                  {moderatorSummary.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 text-emerald-600">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {moderatorSummary.weaknesses.length > 0 && (
              <div>
                <h3 className="mb-2 font-semibold text-red-700">Areas for Improvement</h3>
                <ul className="space-y-1 text-sm text-red-800">
                  {moderatorSummary.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 text-red-600">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {moderatorSummary.recommendations.length > 0 && (
              <div>
                <h3 className="mb-2 font-semibold">Recommendations</h3>
                <ul className="space-y-1 text-sm">
                  {moderatorSummary.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 text-violet-600">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {moderatorSummary.nextSteps.length > 0 && (
              <div className="rounded-lg border-2 border-violet-200 bg-white p-4">
                <h3 className="mb-2 font-semibold text-violet-900">Next Steps</h3>
                <ul className="space-y-1 text-sm text-violet-800">
                  {moderatorSummary.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 text-violet-600">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
