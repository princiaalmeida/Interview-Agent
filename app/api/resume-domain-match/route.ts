import { NextResponse } from "next/server";
import { checkResumeDomainMatchWithAI, checkResumeDomainMatch } from "@/lib/agents/resume-domain-matcher";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeText, selectedDomain } = body;

    if (!resumeText || !selectedDomain) {
      return NextResponse.json(
        { error: "Missing resumeText or selectedDomain" },
        { status: 400 }
      );
    }

    // Try AI-powered matching first, fallback to keyword-based
    const result = await checkResumeDomainMatchWithAI(resumeText, selectedDomain);

    return NextResponse.json({ 
      success: true,
      result 
    });

  } catch (error) {
    console.error("Error checking resume domain match:", error);
    
    // Fallback to keyword-based matching
    try {
      const body = await request.clone().json();
      const { resumeText, selectedDomain } = body;
      const result = await checkResumeDomainMatch(resumeText, selectedDomain);
      
      return NextResponse.json({ 
        success: true,
        result,
        warning: "Using keyword-based matching due to AI processing issues"
      });
    } catch (fallbackError) {
      return NextResponse.json(
        { error: "Failed to process resume domain matching" },
        { status: 500 }
      );
    }
  }
}
