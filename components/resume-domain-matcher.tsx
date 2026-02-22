"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, FileText, Target } from "lucide-react";

interface ResumeDomainMatchResult {
  isMatch: boolean;
  message: string;
  confidence?: number;
  reasons?: string[];
}

const DOMAINS = [
  "Frontend",
  "Backend", 
  "Full Stack",
  "ML/AI",
  "DevOps",
  "Data Science",
  "Mobile",
  "Cloud",
  "Security",
  "QA/Testing"
];

export function ResumeDomainMatcher() {
  const [resumeText, setResumeText] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResumeDomainMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckMatch = async () => {
    if (!resumeText.trim() || !selectedDomain) {
      setError("Please provide both resume text and select a domain.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/resume-domain-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          selectedDomain,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check domain match");
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return "text-muted-foreground";
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBadgeVariant = (confidence?: number) => {
    if (!confidence) return "secondary";
    if (confidence >= 80) return "default";
    if (confidence >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Resume Domain Matcher
          </CardTitle>
          <CardDescription>
            Verify if your resume matches the selected job domain before starting an interview.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="domain">Job Domain</Label>
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a job domain" />
                </SelectTrigger>
                <SelectContent>
                  {DOMAINS.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resume">Resume Content</Label>
              <div className="text-sm text-muted-foreground">
                Paste your resume text or key experience sections
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Resume Text</Label>
            <Textarea
              id="resume"
              placeholder="Paste your resume content here... Include your skills, experience, projects, and technologies."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={8}
              className="resize-none"
            />
            <div className="text-xs text-muted-foreground">
              {resumeText.length} characters
            </div>
          </div>

          <Button 
            onClick={handleCheckMatch} 
            disabled={isLoading || !resumeText.trim() || !selectedDomain}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Check Domain Match
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              <Alert className={result.isMatch ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <div className="flex items-start gap-3">
                  {result.isMatch ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <AlertDescription className={result.isMatch ? "text-green-800" : "text-red-800"}>
                      {result.message}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>

              {result.confidence && (
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Match Confidence</span>
                  <Badge variant={getConfidenceBadgeVariant(result.confidence)}>
                    {result.confidence}%
                  </Badge>
                </div>
              )}

              {result.reasons && result.reasons.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Analysis Details:</h4>
                  <div className="space-y-1">
                    {result.reasons.map((reason, index) => (
                      <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.isMatch && (
                <div className="text-center">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Proceed to Interview
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
