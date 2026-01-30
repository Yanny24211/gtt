// app/api/nextStopInfo/route.ts
import { getNextStopInfo } from "@/lib/getNextStopInfo";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const line = searchParams.get('line') || "UN";
  return NextResponse.json(await getNextStopInfo(line));
}
