import { NextResponse } from "next/server";

// In-memory store for demo; use MongoDB in production
const applied = new Set<string>();
const schedules: Record<string, string> = {}; // jobId -> ISO date string

export async function GET() {
  return NextResponse.json({
    applied: Array.from(applied),
    schedules: { ...schedules },
  });
}

export async function POST(request: Request) {
  const { jobId, scheduledAt } = await request.json();
  if (jobId) {
    applied.add(jobId);
    if (scheduledAt) schedules[jobId] = scheduledAt;
  }
  return NextResponse.json({
    applied: Array.from(applied),
    schedules: { ...schedules },
  });
}
