// app/api/nextStopInfo/route.ts
import { getNextStopInfo } from "@/lib/getNextStopInfo";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await getNextStopInfo());
}
