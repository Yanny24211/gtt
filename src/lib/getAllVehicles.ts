export async function getAllVehicles() {
  return fetch("https://api.openmetrolinx.com/OpenDataAPI/api/V1/Gtfs.json/Feed/VehiclePosition?key=30026203", {
    cache: "no-store",
  }).then(r => r.json());
}