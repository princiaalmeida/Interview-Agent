import { NextRequest, NextResponse } from 'next/server';

interface ResumeAnalysis {
  skills: string[];
  tools: string[];
  projects: string[];
  claimedOwnership: string[];
  yearsExperience: number;
  strongClaims: string[];
  vagueStatements: string[];
  exaggerations: string[];
  mismatches: string[];
}

interface InterviewState {
  resume: string;
  jobRole: string;
  phase: 'analysis' | 'technical' | 'behavioral' | 'complete';
  currentQuestionIndex: number;
  answers: { question: string; answer: string; type: string }[];
  resumeAnalysis: ResumeAnalysis | null;
  technicalQuestions: string[];
  behavioralQuestions: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert';
}

// In-memory store for interview sessions
const interviewSessions = new Map<string, InterviewState>();

class ResumeVerificationAgent {
  static analyze(resume: string, jobRole: string): ResumeAnalysis {
    const skills = this.extractSkills(resume);
    const tools = this.extractTools(resume);
    const projects = this.extractProjects(resume);
    const claimedOwnership = this.extractOwnership(resume);
    const yearsExperience = this.extractExperience(resume);
    
    return {
      skills,
      tools,
      projects,
      claimedOwnership,
      yearsExperience,
      strongClaims: this.identifyStrongClaims(resume),
      vagueStatements: this.identifyVagueStatements(resume),
      exaggerations: this.identifyExaggerations(resume),
      mismatches: this.identifySkillMismatches(skills, jobRole)
    };
  }

  private static extractSkills(resume: string): string[] {
    const skillPatterns = [
      /React|Vue|Angular|Node\.js|Express|MongoDB|PostgreSQL|MySQL/gi,
      /JavaScript|TypeScript|Python|Java|C\+\+|Go|Rust/gi,
      /AWS|Azure|GCP|Docker|Kubernetes|CI\/CD|Git/gi,
      /REST API|GraphQL|Microservices|Serverless/gi
    ];
    
    const skills = new Set<string>();
    skillPatterns.forEach(pattern => {
      const matches = resume.match(pattern);
      if (matches) matches.forEach(match => skills.add(match));
    });
    
    return Array.from(skills);
  }

  private static extractTools(resume: string): string[] {
    const toolPatterns = [
      /VS Code|IntelliJ|Eclipse|Xcode/gi,
      /Jira|Trello|Asana|Slack|Teams/gi,
      /Webpack|Vite|Babel|ESLint|Prettier/gi,
      /Jest|Mocha|Cypress|Selenium/gi
    ];
    
    const tools = new Set<string>();
    toolPatterns.forEach(pattern => {
      const matches = resume.match(pattern);
      if (matches) matches.forEach(match => tools.add(match));
    });
    
    return Array.from(tools);
  }

  private static extractProjects(resume: string): string[] {
    const projectPattern = /(?:project|built|developed|created|designed|implemented)[^.!?]*[.!?]/gi;
    return resume.match(projectPattern) || [];
  }

  private static extractOwnership(resume: string): string[] {
    const ownershipPattern = /(?:I|my|we|our|led|owned|responsible for|managed)[^.!?]*[.!?]/gi;
    return resume.match(ownershipPattern) || [];
  }

  private static extractExperience(resume: string): number {
    const experiencePattern = /(\d+)\+?\s*(?:years?|yrs?)/gi;
    const matches = resume.match(experiencePattern);
    if (!matches) return 0;
    
    const years = matches.map(match => parseInt(match.match(/\d+/)![0]));
    return Math.max(...years);
  }

  private static identifyStrongClaims(resume: string): string[] {
    const strongPatterns = [
      /expert|master|senior|lead|architect/gi,
      /scaled|optimized|improved|increased|reduced/gi,
      /built|created|designed|implemented|developed/gi
    ];
    
    const claims: string[] = [];
    strongPatterns.forEach(pattern => {
      const matches = resume.match(new RegExp(`[^.]*${pattern.source}[^.]*[.!?]`, 'gi'));
      if (matches) claims.push(...matches);
    });
    
    return claims;
  }

  private static identifyVagueStatements(resume: string): string[] {
    const vaguePatterns = [
      /various|multiple|several|many|some/gi,
      /familiar with|knowledge of|experience with/gi,
      /etc\.|and more|including but not limited to/gi
    ];
    
    const vague: string[] = [];
    vaguePatterns.forEach(pattern => {
      const matches = resume.match(new RegExp(`[^.]*${pattern.source}[^.]*[.!?]`, 'gi'));
      if (matches) vague.push(...matches);
    });
    
    return vague;
  }

  private static identifyExaggerations(resume: string): string[] {
    const exaggerationPatterns = [
      /world-class|best|top|number one|revolutionary/gi,
      /perfect|flawless|guaranteed|100%/gi,
      /mastered|guru|ninja|rockstar/gi
    ];
    
    const exaggerations: string[] = [];
    exaggerationPatterns.forEach(pattern => {
      const matches = resume.match(new RegExp(`[^.]*${pattern.source}[^.]*[.!?]`, 'gi'));
      if (matches) exaggerations.push(...matches);
    });
    
    return exaggerations;
  }

  private static identifySkillMismatches(skills: string[], jobRole: string): string[] {
    const roleRequirements: Record<string, string[]> = {
      'frontend': ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'CSS', 'HTML'],
      'backend': ['Node.js', 'Express', 'Python', 'Java', 'Databases', 'APIs'],
      'fullstack': ['React', 'Node.js', 'Databases', 'APIs', 'JavaScript'],
      'devops': ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'GCP'],
      'mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile'],
      'data': ['Python', 'SQL', 'Machine Learning', 'Analytics', 'Statistics']
    };

    const required = roleRequirements[jobRole.toLowerCase()] || [];
    return required.filter(req => !skills.some(skill => skill.toLowerCase().includes(req.toLowerCase())));
  }
}

class TechnicalDepthEvaluator {
  static generateQuestions(analysis: ResumeAnalysis, jobRole: string): string[] {
    const questions = [
      this.generateSkillQuestion(analysis.skills, jobRole),
      this.generateProjectQuestion(analysis.projects),
      this.generateToolQuestion(analysis.tools),
      this.generateExperienceQuestion(analysis.yearsExperience),
      this.generateProblemSolvingQuestion(jobRole)
    ];

    return questions.filter(q => q !== null) as string[];
  }

  private static generateSkillQuestion(skills: string[], jobRole: string): string {
    const primarySkills = skills.slice(0, 3);
    if (primarySkills.length === 0) {
      return `What technical skills do you consider most important for a ${jobRole} role?`;
    }
    return `Can you explain how you've used ${primarySkills.join(', ')} in your previous projects?`;
  }

  private static generateProjectQuestion(projects: string[]): string {
    if (projects.length === 0) {
      return "Tell me about a challenging project you've worked on recently.";
    }
    return `Choose one project from your resume and walk me through the technical challenges you faced and how you solved them.`;
  }

  private static generateToolQuestion(tools: string[]): string {
    const primaryTools = tools.slice(0, 2);
    if (primaryTools.length === 0) {
      return "What development tools and environments do you prefer and why?";
    }
    return `How do you use ${primaryTools.join(' and ')} in your development workflow?`;
  }

  private static generateExperienceQuestion(years: number): string {
    if (years < 2) {
      return "How do you stay updated with the latest technologies and best practices?";
    } else if (years < 5) {
      return "What's the most complex technical problem you've solved in your career so far?";
    } else {
      return "How have you mentored junior developers or contributed to technical decision-making in your team?";
    }
  }

  private static generateProblemSolvingQuestion(jobRole: string): string {
    const roleQuestions: Record<string, string> = {
      'frontend': 'How would you optimize the performance of a React application that\'s loading slowly?',
      'backend': 'How would you design a scalable API that handles millions of requests?',
      'fullstack': 'How would you architect a full-stack application from scratch?',
      'devops': 'How would you set up CI/CD pipeline for a microservices application?',
      'mobile': 'How would you handle offline data synchronization in a mobile app?',
      'data': 'How would you design a data pipeline for real-time analytics?'
    };

    return roleQuestions[jobRole.toLowerCase()] || "Describe your approach to solving complex technical problems.";
  }

  static evaluateAnswer(question: string, answer: string, difficulty: string): number {
    let score = 5; // Base score

    // Length and detail analysis
    const wordCount = answer.split(' ').length;
    if (wordCount < 20) score -= 2;
    else if (wordCount > 100) score += 2;

    // Technical keywords
    const technicalTerms = ['algorithm', 'architecture', 'optimization', 'scalability', 'performance', 'security'];
    const techCount = technicalTerms.filter(term => answer.toLowerCase().includes(term)).length;
    score += Math.min(techCount, 2);

    // Specific examples
    if (/\d+/.test(answer)) score += 1; // Contains numbers (specific metrics)
    if (answer.toLowerCase().includes('example') || answer.toLowerCase().includes('project')) score += 1;

    // Problem-solving indicators
    const problemWords = ['challenge', 'problem', 'solution', 'fixed', 'improved', 'optimized'];
    const problemCount = problemWords.filter(word => answer.toLowerCase().includes(word)).length;
    score += Math.min(problemCount, 1);

    return Math.max(0, Math.min(10, score));
  }
}

class BehavioralCommunicationAgent {
  static generateBehavioralQuestions(): string[] {
    return [
      "Tell me about a time when you faced a significant challenge or conflict in a project. How did you handle it?",
      "Describe a situation where you had to work with a difficult team member. How did you manage the relationship?",
      "Give an example of a time when you had to learn a new technology quickly. What was your approach?",
      "Describe a project where you took leadership. What was your role and what was the outcome?",
      "Tell me about a time when you made a mistake. How did you handle it and what did you learn?"
    ];
  }

  static evaluateCommunication(answer: string): { clarity: number; confidence: number; honesty: number } {
    const clarity = this.evaluateClarity(answer);
    const confidence = this.evaluateConfidence(answer);
    const honesty = this.evaluateHonesty(answer);

    return { clarity, confidence, honesty };
  }

  private static evaluateClarity(answer: string): number {
    let score = 5;
    
    // Structure indicators
    if (answer.includes('First') || answer.includes('Then') || answer.includes('Finally')) score += 1;
    if (answer.split('.').length > 3) score += 1; // Multiple sentences
    
    // Clarity indicators
    if (answer.toLowerCase().includes('specifically') || answer.toLowerCase().includes('for example')) score += 1;
    if (answer.toLowerCase().includes('because') || answer.toLowerCase().includes('therefore')) score += 1;

    // Penalty for vagueness
    if (answer.toLowerCase().includes('something') || answer.toLowerCase().includes('anything')) score -= 1;
    if (answer.toLowerCase().includes('stuff') || answer.toLowerCase().includes('things')) score -= 1;

    return Math.max(0, Math.min(10, score));
  }

  private static evaluateConfidence(answer: string): number {
    let score = 5;
    
    // Confidence indicators
    if (answer.toLowerCase().includes('I believe') || answer.toLowerCase().includes('I think')) score += 1;
    if (answer.toLowerCase().includes('I know') || answer.toLowerCase().includes('I\'m confident')) score += 2;
    
    // Ownership language
    if (answer.toLowerCase().includes('I did') || answer.toLowerCase().includes('I created')) score += 1;
    if (answer.toLowerCase().includes('my responsibility') || answer.toLowerCase().includes('I led')) score += 1;

    // Uncertainty indicators
    if (answer.toLowerCase().includes('maybe') || answer.toLowerCase().includes('perhaps')) score -= 1;
    if (answer.toLowerCase().includes('not sure') || answer.toLowerCase().includes('I guess')) score -= 2;

    return Math.max(0, Math.min(10, score));
  }

  private static evaluateHonesty(answer: string): number {
    let score = 5;
    
    // Honesty indicators
    if (answer.toLowerCase().includes('mistake') || answer.toLowerCase().includes('error')) score += 2;
    if (answer.toLowerCase().includes('learned') || answer.toLowerCase().includes('improved')) score += 1;
    if (answer.toLowerCase().includes('admit') || answer.toLowerCase().includes('realize')) score += 1;

    // Exaggeration indicators
    if (answer.toLowerCase().includes('perfect') || answer.toLowerCase().includes('always')) score -= 1;
    if (answer.toLowerCase().includes('never') || answer.toLowerCase().includes('best')) score -= 1;

    return Math.max(0, Math.min(10, score));
  }
}

class ContradictionDetectionAgent {
  static detectContradictions(resume: string, answers: { question: string; answer: string }[]): string[] {
    const contradictions: string[] = [];
    
    answers.forEach(({ question, answer }) => {
      // Check for experience contradictions
      if (question.toLowerCase().includes('experience') || question.toLowerCase().includes('years')) {
        const resumeYears = this.extractYearsFromResume(resume);
        const answerYears = this.extractYearsFromAnswer(answer);
        if (Math.abs(resumeYears - answerYears) > 2) {
          contradictions.push(`Experience mismatch: Resume claims ${resumeYears} years, answer suggests ${answerYears} years`);
        }
      }

      // Check for skill contradictions
      const resumeSkills = this.extractSkillsFromResume(resume);
      const answerSkills = this.extractSkillsFromAnswer(answer);
      const missingSkills = resumeSkills.filter(skill => 
        question.toLowerCase().includes(skill.toLowerCase()) && 
        !answerSkills.some(ansSkill => ansSkill.toLowerCase().includes(skill.toLowerCase()))
      );
      
      if (missingSkills.length > 0) {
        contradictions.push(`Skill contradiction: Resume mentions ${missingSkills.join(', ')} but answer lacks detail`);
      }
    });

    return contradictions;
  }

  private static extractYearsFromResume(resume: string): number {
    const match = resume.match(/(\d+)\s*(?:years?|yrs?)/i);
    return match ? parseInt(match[1]) : 0;
  }

  private static extractYearsFromAnswer(answer: string): number {
    const match = answer.match(/(\d+)\s*(?:years?|yrs?)/i);
    return match ? parseInt(match[1]) : 0;
  }

  private static extractSkillsFromResume(resume: string): string[] {
    const skills = ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 'Docker'];
    return skills.filter(skill => resume.toLowerCase().includes(skill.toLowerCase()));
  }

  private static extractSkillsFromAnswer(answer: string): string[] {
    const skills = ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 'Docker'];
    return skills.filter(skill => answer.toLowerCase().includes(skill.toLowerCase()));
  }
}

class HiringCommitteeModeratorAgent {
  static generateFinalReport(
    technicalScore: number,
    behavioralScore: number,
    resumeAnalysis: ResumeAnalysis,
    contradictions: string[],
    answers: { question: string; answer: string }[]
  ): {
    humanReadable: string;
    structured: {
      technical_score: number;
      behavioral_score: number;
      resume_authenticity: string;
      strengths: string[];
      weaknesses: string[];
      red_flags: string[];
      improvement_plan: string[];
      hiring_recommendation: string;
      confidence_level: string;
    };
  } {
    const resumeAuthenticity = this.assessResumeAuthenticity(resumeAnalysis, contradictions);
    const strengths = this.identifyStrengths(technicalScore, behavioralScore, answers);
    const weaknesses = this.identifyWeaknesses(technicalScore, behavioralScore, answers);
    const redFlags = this.identifyRedFlags(contradictions, resumeAnalysis);
    const improvementPlan = this.generateImprovementPlan(weaknesses);
    const recommendation = this.makeHiringRecommendation(technicalScore, behavioralScore, resumeAuthenticity, redFlags);
    const confidence = this.calculateConfidence(technicalScore, behavioralScore, contradictions.length);

    return {
      humanReadable: this.generateHumanReadableReport(
        technicalScore,
        behavioralScore,
        resumeAuthenticity,
        strengths,
        weaknesses,
        redFlags,
        improvementPlan,
        recommendation,
        confidence
      ),
      structured: {
        technical_score: technicalScore,
        behavioral_score: behavioralScore,
        resume_authenticity: resumeAuthenticity,
        strengths,
        weaknesses,
        red_flags,
        improvement_plan: improvementPlan,
        hiring_recommendation: recommendation,
        confidence_level: confidence
      }
    };
  }

  private static assessResumeAuthenticity(analysis: ResumeAnalysis, contradictions: string[]): string {
    if (contradictions.length > 2 || analysis.exaggerations.length > 3) {
      return "Questionable";
    } else if (contradictions.length > 0 || analysis.exaggerations.length > 1) {
      return "Moderate";
    } else {
      return "Strong";
    }
  }

  private static identifyStrengths(techScore: number, behScore: number, answers: any[]): string[] {
    const strengths: string[] = [];
    
    if (techScore >= 7) strengths.push("Strong technical knowledge and problem-solving skills");
    if (behScore >= 7) strengths.push("Excellent communication and behavioral responses");
    if (answers.some(a => a.answer.toLowerCase().includes('lead') || a.answer.toLowerCase().includes('managed'))) {
      strengths.push("Leadership experience and ownership");
    }
    if (answers.some(a => a.answer.toLowerCase().includes('learn') || a.answer.toLowerCase().includes('improved'))) {
      strengths.push("Growth mindset and continuous learning");
    }

    return strengths;
  }

  private static identifyWeaknesses(techScore: number, behScore: number, answers: any[]): string[] {
    const weaknesses: string[] = [];
    
    if (techScore < 5) weaknesses.push("Technical depth needs improvement");
    if (behScore < 5) weaknesses.push("Communication clarity could be enhanced");
    if (answers.some(a => a.answer.split(' ').length < 30)) {
      weaknesses.push("Answers lack sufficient detail and examples");
    }
    if (answers.some(a => !a.answer.toLowerCase().includes('because') && !a.answer.toLowerCase().includes('therefore'))) {
      weaknesses.push("Need to provide more reasoning for decisions");
    }

    return weaknesses;
  }

  private static identifyRedFlags(contradictions: string[], analysis: ResumeAnalysis): string[] {
    const redFlags: string[] = [];
    
    redFlags.push(...contradictions);
    if (analysis.exaggerations.length > 2) {
      redFlags.push("Multiple exaggerated claims in resume");
    }
    if (analysis.vagueStatements.length > 3) {
      redFlags.push("Excessive vague statements in resume");
    }

    return redFlags;
  }

  private static generateImprovementPlan(weaknesses: string[]): string[] {
    return weaknesses.map(weakness => {
      if (weakness.includes('technical')) {
        return "Focus on deepening technical knowledge through hands-on projects and courses";
      } else if (weakness.includes('communication')) {
        return "Practice explaining technical concepts clearly and with specific examples";
      } else if (weakness.includes('detail')) {
        return "Provide more specific examples and metrics in responses";
      } else {
        return "Work on providing structured reasoning for technical decisions";
      }
    });
  }

  private static makeHiringRecommendation(
    techScore: number,
    behScore: number,
    authenticity: string,
    redFlags: string[]
  ): string {
    const overallScore = (techScore + behScore) / 2;
    
    if (authenticity === "Questionable" || redFlags.length > 2) {
      return "No Hire";
    } else if (overallScore >= 8 && authenticity === "Strong") {
      return "Strong Hire";
    } else if (overallScore >= 6 && authenticity !== "Questionable") {
      return "Hire";
    } else {
      return "Borderline";
    }
  }

  private static calculateConfidence(techScore: number, behScore: number, contradictions: number): string {
    const consistency = 10 - (contradictions * 2);
    const avgScore = (techScore + behScore + consistency) / 3;
    
    if (avgScore >= 8) return "High";
    if (avgScore >= 6) return "Medium";
    return "Low";
  }

  private static generateHumanReadableReport(
    techScore: number,
    behScore: number,
    authenticity: string,
    strengths: string[],
    weaknesses: string[],
    redFlags: string[],
    improvementPlan: string[],
    recommendation: string,
    confidence: string
  ): string {
    return `
📊 FINAL CANDIDATE REPORT

Technical Performance: ${techScore}/10
${techScore >= 7 ? 'Strong technical foundation with good problem-solving abilities.' : 
  techScore >= 5 ? 'Decent technical knowledge but room for improvement.' : 
  'Technical skills need significant development.'}

Behavioral & Communication: ${behScore}/10
${behScore >= 7 ? 'Excellent communication skills and professional demeanor.' : 
  behScore >= 5 ? 'Good communication but could be more articulate.' : 
  'Communication skills need substantial improvement.'}

Resume Authenticity Assessment: ${authenticity}
${authenticity === 'Strong' ? 'Resume claims appear consistent and believable.' :
  authenticity === 'Moderate' ? 'Some claims may be exaggerated or need verification.' :
  'Multiple inconsistencies found in resume claims.'}

Strengths:
${strengths.map(s => `• ${s}`).join('\n')}

Areas for Improvement:
${weaknesses.map(w => `• ${w}`).join('\n')}

${redFlags.length > 0 ? `Red Flags:\n${redFlags.map(r => `• ${r}`).join('\n')}\n` : ''}

Improvement Plan:
${improvementPlan.map(p => `• ${p}`).join('\n')}

Final Hiring Recommendation: ${recommendation}
${recommendation === 'Strong Hire' ? 'Candidate exceeds requirements and would be a valuable addition.' :
  recommendation === 'Hire' ? 'Candidate meets requirements and would perform well in the role.' :
  recommendation === 'Borderline' ? 'Candidate has potential but needs development in key areas.' :
  'Candidate does not meet current requirements.'}

Confidence Level: ${confidence}
    `.trim();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, sessionId, resume, jobRole, answer } = await request.json();

    switch (action) {
      case 'start': {
        // Phase 1: Resume Analysis
        const resumeAnalysis = ResumeVerificationAgent.analyze(resume, jobRole);
        const technicalQuestions = TechnicalDepthEvaluator.generateQuestions(resumeAnalysis, jobRole);
        const behavioralQuestions = BehavioralCommunicationAgent.generateBehavioralQuestions();

        const interviewState: InterviewState = {
          resume,
          jobRole,
          phase: 'technical',
          currentQuestionIndex: 0,
          answers: [],
          resumeAnalysis,
          technicalQuestions,
          behavioralQuestions,
          difficulty: 'basic'
        };

        interviewSessions.set(sessionId, interviewState);

        return NextResponse.json({
          message: `Hello, thank you for joining. I'll be conducting your interview today for the role of ${jobRole}. Let's begin.`,
          firstQuestion: technicalQuestions[0],
          questionType: 'technical'
        });
      }

      case 'answer': {
        const state = interviewSessions.get(sessionId);
        if (!state) {
          return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // Store answer
        const currentQuestion = state.phase === 'technical' 
          ? state.technicalQuestions[state.currentQuestionIndex]
          : state.behavioralQuestions[state.currentQuestionIndex - state.technicalQuestions.length];

        state.answers.push({ question: currentQuestion, answer, type: state.phase });

        // Move to next question or phase
        state.currentQuestionIndex++;

        if (state.phase === 'technical' && state.currentQuestionIndex >= state.technicalQuestions.length) {
          state.phase = 'behavioral';
          state.currentQuestionIndex = 0;
          
          if (state.behavioralQuestions.length === 0) {
            return generateFinalReport(state, sessionId);
          }
          
          return NextResponse.json({
            nextQuestion: state.behavioralQuestions[0],
            questionType: 'behavioral'
          });
        } else if (state.phase === 'behavioral' && state.currentQuestionIndex >= state.behavioralQuestions.length) {
          return generateFinalReport(state, sessionId);
        }

        const nextQuestion = state.phase === 'technical'
          ? state.technicalQuestions[state.currentQuestionIndex]
          : state.behavioralQuestions[state.currentQuestionIndex];

        return NextResponse.json({
          nextQuestion,
          questionType: state.phase
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Interview API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateFinalReport(state: InterviewState, sessionId: string) {
  // Calculate technical scores
  const technicalAnswers = state.answers.filter(a => a.type === 'technical');
  const technicalScores = technicalAnswers.map(a => 
    TechnicalDepthEvaluator.evaluateAnswer(a.question, a.answer, state.difficulty)
  );
  const technicalScore = technicalScores.reduce((sum, score) => sum + score, 0) / technicalScores.length;

  // Calculate behavioral scores
  const behavioralAnswers = state.answers.filter(a => a.type === 'behavioral');
  const behavioralScores = behavioralAnswers.map(a => {
    const evals = BehavioralCommunicationAgent.evaluateCommunication(a.answer);
    return (evals.clarity + evals.confidence + evals.honesty) / 3;
  });
  const behavioralScore = behavioralScores.reduce((sum, score) => sum + score, 0) / behavioralScores.length;

  // Detect contradictions
  const contradictions = ContradictionDetectionAgent.detectContradictions(state.resume, state.answers);

  // Generate final report
  const report = HiringCommitteeModeratorAgent.generateFinalReport(
    technicalScore,
    behavioralScore,
    state.resumeAnalysis!,
    contradictions,
    state.answers
  );

  // Clean up session
  interviewSessions.delete(sessionId);

  return NextResponse.json({
    complete: true,
    report
  });
}
