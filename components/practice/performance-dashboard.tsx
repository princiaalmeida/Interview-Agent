"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Target, CheckCircle, XCircle, Code2 } from "lucide-react";
import type { PerformanceStats } from "@/lib/practice/storage";
import { Badge } from "@/components/ui/badge";

interface PerformanceDashboardProps {
  stats: PerformanceStats;
}

export function PerformanceDashboard({ stats }: PerformanceDashboardProps) {
  const accuracy = stats.totalAttempts > 0 ? (stats.correctAnswers / stats.totalAttempts) * 100 : 0;

  const difficultyData = [
    { name: "Easy", attempted: stats.byDifficulty.easy.attempted, correct: stats.byDifficulty.easy.correct },
    { name: "Moderate", attempted: stats.byDifficulty.moderate.attempted, correct: stats.byDifficulty.moderate.correct },
    { name: "Hard", attempted: stats.byDifficulty.hard.attempted, correct: stats.byDifficulty.hard.correct },
  ];

  const languageData = [
    { name: "Python", correct: stats.byLanguage.python.correct, attempted: stats.byLanguage.python.attempted },
    { name: "JavaScript", correct: stats.byLanguage.javascript.correct, attempted: stats.byLanguage.javascript.attempted },
    { name: "Java", correct: stats.byLanguage.java.correct, attempted: stats.byLanguage.java.attempted },
    { name: "C++", correct: stats.byLanguage.cpp.correct, attempted: stats.byLanguage.cpp.attempted },
  ];

  const improvedQuestions = stats.improvement.filter((i) => !i.firstAttempt && i.lastAttempt);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Dashboard
        </CardTitle>
        <CardDescription>Track your progress and improvement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Total Attempts
            </div>
            <div className="mt-1 text-2xl font-bold">{stats.totalAttempts}</div>
          </div>
          <div className="rounded-lg border bg-emerald-50 p-3">
            <div className="flex items-center gap-2 text-sm text-emerald-700">
              <CheckCircle className="h-4 w-4" />
              Correct
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-900">{stats.correctAnswers}</div>
          </div>
          <div className="rounded-lg border bg-red-50 p-3">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <XCircle className="h-4 w-4" />
              Incorrect
            </div>
            <div className="mt-1 text-2xl font-bold text-red-900">{stats.incorrectAnswers}</div>
          </div>
        </div>

        {/* Accuracy */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Overall Accuracy</span>
            <span className="font-bold">{accuracy.toFixed(1)}%</span>
          </div>
          <Progress value={accuracy} className="h-3" />
        </div>

        {/* Performance by Difficulty */}
        <div>
          <h3 className="mb-3 text-sm font-semibold">Performance by Difficulty</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={difficultyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="correct" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance by Language */}
        <div>
          <h3 className="mb-3 text-sm font-semibold">Performance by Language</h3>
          <div className="space-y-2">
            {languageData.map((lang) => {
              const langAccuracy = lang.attempted > 0 ? (lang.correct / lang.attempted) * 100 : 0;
              return (
                <div key={lang.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span>{lang.name}</span>
                    <span className="font-medium">{lang.correct}/{lang.attempted} ({langAccuracy.toFixed(0)}%)</span>
                  </div>
                  <Progress value={langAccuracy} className="h-2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Improvement Tracking */}
        {improvedQuestions.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">Questions You've Improved On</h3>
            <div className="space-y-1">
              {improvedQuestions.slice(0, 5).map((improvement) => (
                <div key={improvement.questionId} className="flex items-center justify-between rounded border bg-emerald-50 p-2 text-xs">
                  <span className="font-medium">Question {improvement.questionId}</span>
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
                    {improvement.attemptsCount} attempts
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {stats.recentAttempts.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">Recent Activity</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {stats.recentAttempts.slice(0, 5).map((attempt, i) => (
                <div key={i} className="flex items-center justify-between rounded border bg-slate-50 p-2 text-xs">
                  <div className="flex items-center gap-2">
                    {attempt.isCorrect ? (
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-600" />
                    )}
                    <span>Q{attempt.questionId}</span>
                    <Badge variant="outline" className="text-xs">
                      {attempt.difficulty}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground">{new Date(attempt.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
