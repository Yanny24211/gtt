export async function getAllStops() {
  return fetch("https://api.openmetrolinx.com/OpenDataAPI/api/V1/Stop.json/All?key=30026203", {
    cache: "no-store",
  }).then(r => r.json());
}