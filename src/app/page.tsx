import "./globals.css";
import Page from "./main/page";
import { Trip } from "@/types/Trip";
import { getServiceAtGlance } from "@/lib/getServiceAtGlance";
export default async function Home() {
  const serviceAtGlance = await getServiceAtGlance();
  const trips: Record<string, Trip> = serviceAtGlance?.Trips?.Trip || {};
  return (
    <Page currentTrips={trips} />
  );
}
