// app/api/serviceAtGlance/route.ts
import { getServiceAtGlance } from "@/lib/getServiceAtGlance";
import { Trip } from "@/types/Trip";
import { NextResponse } from "next/server";

export async function GET() {
  const serviceAtGlance = await getServiceAtGlance();
  const trips: Record<string, Trip> = serviceAtGlance?.Trips?.Trip || {};
  return NextResponse.json(trips);
}
