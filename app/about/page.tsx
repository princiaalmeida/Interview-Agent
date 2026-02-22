"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About
          </CardTitle>
          <CardDescription>Autonomous Technical Interview Platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            This platform uses a multi-agent AI system to evaluate technical interviews. Five distinct agents analyze your resume, interview transcript, and job description, then debate to produce a final verdict with confidence scores and evidence.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3 rounded-lg border bg-slate-50/50 p-4">
              <Users className="h-6 w-6 shrink-0 text-violet-600" />
              <div>
                <p className="font-medium">5 Agents</p>
                <p className="text-sm text-muted-foreground">
                  Resume Verification, Technical Depth, Contradiction Detection, Behavioral, Moderator
                </p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border bg-slate-50/50 p-4">
              <Zap className="h-6 w-6 shrink-0 text-violet-600" />
              <div>
                <p className="font-medium">Debate Loop</p>
                <p className="text-sm text-muted-foreground">
                  Agents debate when they disagree. Moderator resolves and produces final consensus.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
