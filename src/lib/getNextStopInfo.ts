export async function getNextStopInfo() {
  return fetch("https://api.openmetrolinx.com/OpenDataAPI/api/V1/Stop.json/NextService/UN/?key=30026203", {
    cache: "no-store",
  }).then(r => r.json());
}