"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const { isSignedIn, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    signIn(email.trim(), name.trim() || undefined);
    window.location.reload();
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gradient-to-br from-background via-background to-primary/20">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Job Platform
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Job Application Platform
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Browse and apply for jobs. Upload your resume and get matched with perfect opportunities.
          </p>
        </div>

        {!isSignedIn ? (
          <div className="mx-auto max-w-md">
            <Card className="border-border/80 shadow-lg">
              <CardHeader>
                <CardTitle>Sign In to Get Started</CardTitle>
                <CardDescription>Enter your details to access jobs and applications.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Name (optional)</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/jobs">
                <Button size="lg" className="gap-2">
                  <Zap className="h-5 w-5" />
                  Browse Jobs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/ai-interview">
                <Button size="lg" variant="outline" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Interview
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/practice">
                <Button size="lg" variant="outline" className="gap-2">
                  <Zap className="h-5 w-5" />
                  Practice Platform
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Browse jobs, try AI interview, and practice coding challenges.
            </p>
          </div>
        )}

        <div className="mt-24 grid gap-8 sm:grid-cols-3">
          <FeatureCard
            title="Job Matching"
            desc="AI-powered resume matching with job requirements and skill assessment."
          />
          <FeatureCard
            title="Easy Applications"
            desc="One-click apply with resume upload and automatic profile completion."
          />
          <FeatureCard
            title="Skill Practice"
            desc="Practice coding challenges and improve your technical skills."
          />
        </div>
      </div>
    </div>
  );
}


function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border bg-card/80 p-6 shadow-sm">
      <h3 className="font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
