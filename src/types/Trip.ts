import { LineCode } from "./LineCode";

export type Trip = {
  RouteNumber: string;
  AtStationCode: string;
  LineCode: LineCode;
  NextStopCode: string;
  PrevStopCode: string;
  Latitude: string;
  Longitude: string;
  Cars: number;
  VariantDir: string;
  StartTime: string;
  EndTime: string;
  IsInMotion: boolean;
  TripNumber: string;
  FirstStopCode: string;
  LastStopCode: string;
};

