import { NextResponse } from "next/server";
import { generateQuestion } from "@/lib/agents/practice/question-generation-agent";
import type { Difficulty, Language } from "@/lib/practice/questions";

export async function POST(request: Request) {
  let body: any = {};
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const { difficulty, language, excludeTopics } = body;

  if (!difficulty || !language) {
    return NextResponse.json(
      { error: "Missing difficulty or language" },
      { status: 400 }
    );
  }

  try {
    // Always try to generate a question, even if API fails (will use fallback)
    const question = await generateQuestion(
      difficulty as Difficulty,
      language as Language,
      excludeTopics
    );

    // Validate question structure - if invalid, it should have already fallen back
    if (!question || !question.title || !question.description) {
      console.error("Invalid question structure:", question);
      // Return the question anyway (it's a fallback), but log the issue
      return NextResponse.json({ 
        question,
        warning: "Using fallback question due to validation issue"
      });
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Error in generate-question API:", error);
    // Try to get fallback question even on API error
    try {
      const { generateQuestion } = await import("@/lib/agents/practice/question-generation-agent");
      const fallbackQuestion = await generateQuestion(
        (difficulty || "easy") as Difficulty,
        (language || "python") as Language
      );
      return NextResponse.json({ 
        question: fallbackQuestion,
        warning: "Using fallback question due to API error"
      });
    } catch (fallbackError) {
      console.error("Even fallback failed:", fallbackError);
      return NextResponse.json(
        { 
          error: "Failed to generate question",
          details: error instanceof Error ? error.message : "Unknown error",
          fallbackError: fallbackError instanceof Error ? fallbackError.message : "Unknown"
        },
        { status: 500 }
      );
    }
  }
}
