import { NextResponse } from "next/server";
import { generateSystemDesignQuestion } from "@/lib/agents/practice/system-design-question-agent";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { difficulty, topic } = body;
    
    if (!difficulty) {
      return NextResponse.json(
        { error: "Missing difficulty parameter" },
        { status: 400 }
      );
    }

    const question = await generateSystemDesignQuestion(difficulty, topic);
    
    return NextResponse.json({ question });
  } catch (error) {
    console.error("Error generating system design question:", error);
    
    // Get the request body again for fallback
    const body = await request.clone().json().catch(() => ({}));
    const requestDifficulty = body.difficulty || "medium";
    
    // Fallback question if AI fails
    const fallbackQuestion = {
      id: `fallback_${Date.now()}`,
      title: "Design a URL Shortening Service",
      difficulty: requestDifficulty,
      description: "Design a URL shortening service like bit.ly that handles millions of URLs per day",
      prompt: `Design a URL shortening service like bit.ly.\n\nPlease explain:\n- What components would you use (servers, databases, caching, etc.)?\n- How would you handle scalability?\n- How would you handle failures and ensure reliability?\n- What trade-offs would you consider?`,
      topics: ["system-design", "scalability", "databases", "web-services"],
      estimatedTime: requestDifficulty === "easy" ? "15-20 min" : requestDifficulty === "moderate" ? "20-30 min" : "30-45 min",
      hints: [
        "Consider the redirect path and how to make it fast",
        "Think about how to generate unique short codes",
        "Consider analytics and tracking requirements"
      ]
    };
    
    return NextResponse.json({ 
      question: fallbackQuestion,
      warning: "Using fallback question due to AI generation issues"
    });
  }
}
