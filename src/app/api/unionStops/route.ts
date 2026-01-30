// app/api/stopDetails/route.ts
import { getUnionStops } from "@/lib/getUnionStops";
import { NextResponse } from "next/server";

//returns info shown at union station
export async function GET() {
  return NextResponse.json(await getUnionStops());
}
