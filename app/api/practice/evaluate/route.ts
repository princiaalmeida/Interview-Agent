import { NextResponse } from "next/server";
import { evaluateSolution } from "@/lib/agents/practice/solution-evaluation-agent";
import { generateFeedback } from "@/lib/agents/practice/feedback-agent";
import { generateModeratorSummary } from "@/lib/agents/practice/moderator-agent";
import { getPerformanceStats } from "@/lib/practice/storage";
import type { GeneratedQuestion } from "@/lib/agents/practice/question-generation-agent";

export async function POST(request: Request) {
  try {
    const { question, userCode, language } = await request.json();

    if (!question || !userCode || !language) {
      return NextResponse.json(
        { error: "Missing question, userCode, or language" },
        { status: 400 }
      );
    }

    // Run all agents in parallel
    const [evaluation, performanceStats] = await Promise.all([
      evaluateSolution(question as GeneratedQuestion, userCode, language),
      Promise.resolve(getPerformanceStats()),
    ]);

    const feedback = await generateFeedback(
      question as GeneratedQuestion,
      userCode,
      evaluation,
      language
    );

    const moderatorSummary = await generateModeratorSummary(
      question as GeneratedQuestion,
      evaluation,
      feedback,
      performanceStats
    );

    return NextResponse.json({
      evaluation,
      feedback,
      moderatorSummary,
    });
  } catch (error) {
    console.error("Error evaluating solution:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to evaluate solution" },
      { status: 500 }
    );
  }
}
