export async function getStopDetails() {
  return fetch("https://api.openmetrolinx.com/OpenDataAPI/api/V1/Stop.json/Details/HORE/?key=30026203", {
    cache: "no-store",
  }).then(r => r.json());
}