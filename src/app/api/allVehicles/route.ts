// app/api/allVehicles/route.ts
import { getAllVehicles } from "@/lib/getAllVehicles";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await getAllVehicles());
}
