
const getTodayYYYYMMDD = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
};

export async function getTodaySchedule() {
  return fetch(`https://api.openmetrolinx.com/OpenDataAPI/api/V1/Schedule.json/Line/All/${getTodayYYYYMMDD()}?key=30026203`, {
    cache: "no-store",
  }).then(r => r.json());
}