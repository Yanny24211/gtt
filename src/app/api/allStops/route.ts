// app/api/allStops/route.ts
import { getAllStops } from "@/lib/getAllStops";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await getAllStops());
}
