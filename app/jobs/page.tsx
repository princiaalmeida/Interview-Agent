"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApplyJobModal, formatScheduledAt } from "@/components/apply-job-modal";
import { Briefcase, CheckCircle, ArrowRight, Calendar, CalendarClock } from "lucide-react";
import type { Job, Domain } from "@/lib/jobs-data";

export default function JobsPage() {
  const { isSignedIn } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applied, setApplied] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<Record<string, string>>({});
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalInitialStep, setModalInitialStep] = useState<1 | 2>(1);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then(({ domains: d, jobs: j }) => {
        setDomains(d);
        setJobs(j);
      });
    fetch("/api/applied")
      .then((r) => r.json())
      .then((data) => {
        setApplied(data.applied || []);
        setSchedules(data.schedules || {});
      });
  }, []);

  const openApplyModal = (job: Job, step: 1 | 2 = 1) => {
    setSelectedJob(job);
    setModalInitialStep(step);
    setModalOpen(true);
  };

  const handleConfirmSchedule = async (jobId: string, scheduledAt: string) => {
    const res = await fetch("/api/applied", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, scheduledAt }),
    });
    const data = await res.json();
    setApplied(data.applied || []);
    setSchedules(data.schedules || {});
    setModalOpen(false);
    setSelectedJob(null);
  };

  const filteredJobs = selectedDomain
    ? jobs.filter((j) => j.domainId === selectedDomain)
    : jobs;

  if (!isSignedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Jobs</CardTitle>
            <CardDescription>Sign in to browse jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Domains</h1>
        <p className="mt-1 text-muted-foreground">Select a domain to filter jobs</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant={selectedDomain === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDomain(null)}
          >
            All
          </Button>
          {domains.map((d) => (
            <Button
              key={d.id}
              variant={selectedDomain === d.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDomain(d.id)}
            >
              {d.icon} {d.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Jobs</h2>
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isApplied={applied.includes(job.id)}
            scheduledAt={schedules[job.id]}
            onApply={() => openApplyModal(job, 1)}
            onScheduleInterview={() => openApplyModal(job, 2)}
          />
        ))}
      </div>

      <ApplyJobModal
        job={selectedJob}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleConfirmSchedule}
        initialStep={modalInitialStep}
      />
    </div>
  );
}

interface JobCardProps {
  job: Job;
  isApplied: boolean;
  scheduledAt?: string;
  onApply: () => void;
  onScheduleInterview: () => void;
}

function JobCard({ job, isApplied, scheduledAt, onApply, onScheduleInterview }: JobCardProps) {
  const hasSchedule = !!scheduledAt;

  return (
    <Card className={isApplied ? "border-emerald-200 bg-emerald-50/30" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              {job.title}
              {isApplied && !hasSchedule && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  Applied
                </span>
              )}
              {isApplied && hasSchedule && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                  <CheckCircle className="h-3 w-3" />
                  Interview Scheduled
                </span>
              )}
            </CardTitle>
            <CardDescription>{job.company}</CardDescription>
            {hasSchedule && scheduledAt && (
              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-700">
                <Calendar className="h-3 w-3" />
                {formatScheduledAt(scheduledAt)}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
            {!isApplied && (
              <Button size="sm" onClick={onApply}>
                Apply
              </Button>
            )}
            {isApplied && !hasSchedule && (
              <Button size="sm" variant="outline" onClick={onScheduleInterview} className="gap-1">
                <CalendarClock className="h-4 w-4" />
                Schedule Interview
              </Button>
            )}
            {isApplied && hasSchedule && (
              <>
                <Button size="sm" variant="outline" onClick={onScheduleInterview}>
                  Reschedule
                </Button>
                <Link
                  href={`/interview?jobId=${job.id}&title=${encodeURIComponent(job.title)}&desc=${encodeURIComponent(job.description)}`}
                >
                  <Button size="sm" className="gap-1">
                    <Briefcase className="h-4 w-4" />
                    Start Interview
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </>
            )}
            {!isApplied && (
              <Link
                href={`/interview?jobId=${job.id}&title=${encodeURIComponent(job.title)}&desc=${encodeURIComponent(job.description)}`}
              >
                <Button size="sm" variant="outline" className="gap-1">
                  <Briefcase className="h-4 w-4" />
                  Interview
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{job.description}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Requirements: {job.requirements.join(", ")}
        </p>
      </CardContent>
    </Card>
  );
}
