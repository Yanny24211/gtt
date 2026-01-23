// app/api/stopDetails/route.ts
import { getStopDetails } from "@/lib/getStopDetails";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await getStopDetails());
}
