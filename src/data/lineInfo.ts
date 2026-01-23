import { LineCode } from "../types/LineCode";

export const lineInfo: Record<LineCode, { lineCode: string; lineName: string; lineColor: string, lineDirection: string }> = {
  LW: { lineCode: "LW", lineName: "Lakeshore West", lineColor: "#98002E", lineDirection: "W" },
  LE: { lineCode: "LE", lineName: "Lakeshore East", lineColor: "#FF0D00", lineDirection: "E" },
  GT: { lineCode: "GT", lineName: "Kitchener", lineColor: "#00853E", lineDirection: "W" },
  ST: { lineCode: "ST", lineName: "Stouffville", lineColor: "#794500", lineDirection: "N" },
  RH: { lineCode: "RH", lineName: "Richmond Hill", lineColor: "#0099C7", lineDirection: "N" },
  BR: { lineCode: "BR", lineName: "Barrie", lineColor: "#003767", lineDirection: "N" },
  MI: { lineCode: "MI", lineName: "Milton", lineColor: "#F57F25", lineDirection: "N" },
};