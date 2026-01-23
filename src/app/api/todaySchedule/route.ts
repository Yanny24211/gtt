// app/api/todaySchedule/route.ts
import { getTodaySchedule } from "@/lib/getTodaySchedule";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await getTodaySchedule());
}
