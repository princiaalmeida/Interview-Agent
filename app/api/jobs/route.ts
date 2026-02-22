import { NextResponse } from "next/server";
import { DOMAINS, JOBS } from "@/lib/jobs-data";

export async function GET() {
  return NextResponse.json({ domains: DOMAINS, jobs: JOBS });
}
