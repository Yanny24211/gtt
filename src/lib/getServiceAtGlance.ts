export async function getServiceAtGlance() {
  return fetch("https://api.openmetrolinx.com/OpenDataAPI/api/V1/ServiceataGlance.json/Trains/All?key=30026203", {
    cache: "no-store",
  }).then(r => r.json());
}