'use client';

import { useState } from 'react';

export default function AIInterviewPage() {
  const [resume, setResume] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<Array<{question: string, answer: string}>>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [finalReport, setFinalReport] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const jobRoles = [
    'Frontend Developer',
    'Backend Developer', 
    'Full Stack Developer',
    'DevOps Engineer',
    'Mobile Developer',
    'Data Engineer'
  ];

  const startInterview = async () => {
    if (!resume.trim() || !jobRole) {
      setError('Please provide both resume and job role');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      
      const response = await fetch('/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          sessionId: `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          resume: resume.trim(),
          jobRole
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start interview');
      }

      setCurrentQuestion(data.firstQuestion);
      setIsStarted(true);
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start interview');
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      setError('Please provide an answer');
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      const response = await fetch('/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'answer',
          sessionId: `interview_${Date.now()}`,
          answer: currentAnswer.trim()
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit answer');
      }

      if (data.complete) {
        setFinalReport(data.report);
        setIsComplete(true);
      } else {
        setAnswers([...answers, { question: currentQuestion, answer: currentAnswer }]);
        setCurrentQuestion(data.nextQuestion);
        setCurrentAnswer('');
      }
      
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit answer');
      setIsLoading(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50/30 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Live Interview System</h1>
            <p className="text-gray-600">Experience a comprehensive interview with 5 AI evaluation agents</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Interview Setup</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Role
                </label>
                <select
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Select a job role</option>
                  {jobRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume Text
                </label>
                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your resume text here..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Copy and paste your resume content for AI analysis
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={startInterview}
                disabled={!resume.trim() || !jobRole || isLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Analyzing Resume...' : 'Start Interview'}
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-2">🤖 AI Agents</h3>
              <ul className="text-sm space-y-1">
                <li>• Resume Verification Agent</li>
                <li>• Technical Depth Evaluator</li>
                <li>• Contradiction Detection Agent</li>
                <li>• Behavioral & Communication Agent</li>
                <li>• Hiring Committee Moderator Agent</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-2">📋 Interview Process</h3>
              <ul className="text-sm space-y-1">
                <li>• Resume analysis</li>
                <li>• 5-7 technical questions</li>
                <li>• 2 behavioral questions</li>
                <li>• Real-time evaluation</li>
                <li>• Comprehensive final report</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50/30 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete</h1>
            <p className="text-gray-600">Here's your comprehensive evaluation report</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">📊 Final Candidate Report</h2>
            <div className="whitespace-pre-wrap text-sm">
              {finalReport?.humanReadable || 'Report generation failed'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📈 Structured Evaluation</h2>
            <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto">
              {JSON.stringify(finalReport?.structured, null, 2)}
            </pre>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50/30 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">AI Live Interview</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Technical</span>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{jobRole}</span>
            </div>
            <div className="text-sm text-gray-600">
              Question {answers.length + 1} of ~7
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Technical Question</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-900 font-medium">{currentQuestion}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Answer
                  </label>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    disabled={isLoading}
                  />
                </div>

                <button
                  onClick={submitAnswer}
                  disabled={!currentAnswer.trim() || isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Analyzing...' : 'Submit Answer'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-3">🤖 AI Agents</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Resume Verification</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
                <div className="flex justify-between">
                  <span>Technical Evaluator</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
                <div className="flex justify-between">
                  <span>Contradiction Detector</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
                <div className="flex justify-between">
                  <span>Behavioral Agent</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
                <div className="flex justify-between">
                  <span>Moderator Agent</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-3">💡 Tips</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Be specific and provide examples</li>
                <li>• Explain your reasoning process</li>
                <li>• Include metrics when possible</li>
                <li>• Be honest about challenges</li>
                <li>• Show ownership and learning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
