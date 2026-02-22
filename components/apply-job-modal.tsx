"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Job } from "@/lib/jobs-data";
import { Calendar, Clock } from "lucide-react";

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
];

function getNextAvailableSlot(): { date: string; time: string } {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const y = tomorrow.getFullYear();
  const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const d = String(tomorrow.getDate()).padStart(2, "0");
  return { date: `${y}-${m}-${d}`, time: "10:00" };
}

function formatScheduledAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export interface ApplyJobModalProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (jobId: string, scheduledAt: string) => void;
  initialStep?: 1 | 2;
}

export function ApplyJobModal({
  job,
  open,
  onOpenChange,
  onConfirm,
  initialStep = 1,
}: ApplyJobModalProps) {
  const [step, setStep] = useState<1 | 2>(initialStep);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");

  const nextSlot = useMemo(getNextAvailableSlot, []);

  const timezone = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";

  useEffect(() => {
    if (open) setStep(initialStep);
  }, [open, initialStep]);

  const handleClose = (open: boolean) => {
    if (!open) setStep(initialStep);
    onOpenChange(open);
  };

  const handleScheduleForMe = () => {
    setDate(nextSlot.date);
    setTime(nextSlot.time);
  };

  const handleConfirm = () => {
    if (!job) return;
    const scheduledAt = date && time ? new Date(`${date}T${time}:00`).toISOString() : new Date().toISOString();
    onConfirm(job.id, scheduledAt);
    handleClose(false);
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" showClose={true}>
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>{job.title}</DialogTitle>
              <DialogDescription>{job.company}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <p className="text-sm font-medium text-slate-700">Description</p>
                <p className="mt-1 text-sm text-muted-foreground">{job.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Requirements</p>
                <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                  {job.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
              {job.techStack && job.techStack.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700">Tech stack</p>
                  <p className="mt-1 text-sm text-muted-foreground">{job.techStack.join(", ")}</p>
                </div>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button onClick={() => setStep(2)}>Continue</Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Schedule interview</DialogTitle>
              <DialogDescription>
                {job.title} at {job.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <p className="text-xs text-muted-foreground">Timezone: {timezone}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="date" className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Time
                  </Label>
                  <select
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-2 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button variant="outline" className="w-full gap-2" onClick={handleScheduleForMe}>
                <Clock className="h-4 w-4" />
                Schedule For Me
              </Button>
              {nextSlot && (
                <p className="text-xs text-muted-foreground">
                  Suggests: {nextSlot.date} at {nextSlot.time}
                </p>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!date || !time}
              >
                Confirm & Apply
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { formatScheduledAt };
