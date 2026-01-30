export async function getUnionStops() {
  return fetch(`https://api.openmetrolinx.com/OpenDataAPI/api/V1/ServiceUpdate.json/UnionDepartures/All?key=30026203`, {
    cache: "no-store",
  }).then(r => r.json());
}