"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Target,
  Award,
  Activity,
  Eye,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { getAllSessions } from "@/lib/store";

interface InterviewSession {
  sessionId: string;
  resumeText: string;
  transcriptText: string;
  jobDescription: string;
  resumeAnalysis?: any;
  technicalAnalysis?: any;
  contradictionReport?: any;
  behavioralReport?: any;
  moderatorReport?: any;
  debateRounds?: any[];
  finalDecision?: {
    verdict: string;
    recommendation?: string;
    confidence: number;
    summary: string;
    reasoningTrace?: string[];
    disagreements?: string[];
  };
  feedback?: any;
  createdAt: string;
  completedAt: string;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "hire" | "reject">("all");

  useEffect(() => {
    const loadSessions = () => {
      try {
        const allSessions = getAllSessions();
        setSessions(allSessions.sort((a, b) => 
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        ));
      } catch (error) {
        console.error("Error loading sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.resumeText.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || 
      (filterStatus === "hire" && session.finalDecision?.verdict === "HIRE") ||
      (filterStatus === "reject" && session.finalDecision?.verdict !== "HIRE");
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: sessions.length,
    hired: sessions.filter(s => s.finalDecision?.verdict === "HIRE").length,
    rejected: sessions.filter(s => s.finalDecision?.verdict !== "HIRE").length,
    avgConfidence: sessions.length > 0 
      ? sessions.reduce((acc, s) => acc + (s.finalDecision?.confidence || 0), 0) / sessions.length 
      : 0,
  };

  const statusData = [
    { name: "Hired", value: stats.hired, color: "#10b981" },
    { name: "Rejected", value: stats.rejected, color: "#ef4444" },
  ];

  const scoreDistribution = sessions.map(session => ({
    sessionId: session.sessionId.slice(0, 8),
    technical: session.technicalAnalysis?.technical_score || 0,
    resume: session.resumeAnalysis?.resume_consistency_score || 0,
    behavioral: session.behavioralAnalysis?.behavioral_score || 0,
    confidence: session.finalDecision?.confidence || 0,
  }));

  const recentSessions = filteredSessions.slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Activity className="mx-auto h-8 w-8 animate-spin text-violet-600" />
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Interview Dashboard</h1>
            <p className="text-muted-foreground">Manage and analyze interview sessions</p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                New Interview
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Job Listings
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All completed sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hired Candidates</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.hired}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? `${((stats.hired / stats.total) * 100).toFixed(1)}%` : '0%'} success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected Candidates</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? `${((stats.rejected / stats.total) * 100).toFixed(1)}%` : '0%'} rejection rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgConfidence.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Evaluation confidence</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Status Distribution</CardTitle>
              <CardDescription>Overview of interview outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>Technical, Resume, and Confidence scores across sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={scoreDistribution.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sessionId" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="technical" fill="#8b5cf6" />
                  <Bar dataKey="resume" fill="#3b82f6" />
                  <Bar dataKey="confidence" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Interview Sessions</CardTitle>
            <CardDescription>Search and filter interview results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by session ID, job description, or resume..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                >
                  All ({stats.total})
                </Button>
                <Button
                  variant={filterStatus === "hire" ? "default" : "outline"}
                  onClick={() => setFilterStatus("hire")}
                >
                  Hired ({stats.hired})
                </Button>
                <Button
                  variant={filterStatus === "reject" ? "default" : "outline"}
                  onClick={() => setFilterStatus("reject")}
                >
                  Rejected ({stats.rejected})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Interview Sessions</CardTitle>
            <CardDescription>Latest completed interviews and their results</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No interview sessions found</p>
                <Link href="/" className="mt-4 inline-block">
                  <Button>Start First Interview</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <div
                    key={session.sessionId}
                    className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm text-muted-foreground">
                          {session.sessionId}
                        </span>
                        <Badge
                          variant={session.finalDecision?.verdict === "HIRE" ? "default" : "destructive"}
                        >
                          {session.finalDecision?.verdict || "PENDING"}
                        </Badge>
                        <Badge variant="outline">
                          {session.finalDecision?.confidence || 0}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                        {session.jobDescription || "No job description"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(session.completedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(session.completedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/evaluate/${session.sessionId}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Results
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
