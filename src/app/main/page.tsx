"use client";
import Tile from "./tile/tile";
import "../globals.css";
// import fs from "fs";
import { useEffect, useState } from "react";      
import { LineCode } from "../../types/LineCode";
import { StopCode } from "../../types/StopCode";
import { Trip } from "../../types/Trip";
import { stopNames } from "../../data/stopNames";
import { lineInfo } from "../../data/lineInfo";
import { StopData } from "../../types/StopData";
//data structures


//Helper Functions 
function getNextNonWaypoint(
  line?: LineCode,
  currentStopCode?: StopCode,
  direction?: string, 
  nextStop?: string, 
) {
  if(!currentStopCode || !line || !direction){
    return undefined;
  }
  else{
    //if alr a non-waypoint return it's name
    if(!stopNames[line][currentStopCode]?.isWaypoint){
      return stopNames[line][currentStopCode]?.stopName;
    }

    //get all stops for that line   
    const stops = Object.values(stopNames[line]);
    const lineDirection = lineInfo[line].lineDirection;

    //get index of current stop
    const currentIndex = stops.findIndex(
      stop => stop.stopCode === currentStopCode
    );
    if (currentIndex === -1) return undefined;

    //based on train travel direction and desired next stop, return next non-waypoint
    const traverseDir = direction === lineDirection 
    if(nextStop == 'prev'){
        if(traverseDir){
            for (let i = currentIndex - 1; i >= 0; i--) {
                if (!stops[i].isWaypoint) {
                    return stops[i].stopName;
                }
            }
        }else{
            for (let i = currentIndex + 1; i < stops.length; i++) {
                if (!stops[i].isWaypoint) {
                    return stops[i].stopName;
                }
            }
        }
    }
    if(nextStop == 'next'){
        if(traverseDir){
            for (let i = currentIndex + 1; i < stops.length; i++) {
                if (!stops[i].isWaypoint) {
                    return stops[i].stopName;
                }
            }
        }else{
            for (let i = currentIndex - 1; i >= 0; i--) {
                if (!stops[i].isWaypoint) {
                    return stops[i].stopName;
                }
            }
        }
    }
    if(nextStop == 'curr'){
        return stopNames[line][currentStopCode]?.stopName;
    }
  }  
  return undefined; // no next non-waypoint
}


function to12Hour(time24: string) {
  let [hour, minute] = time24.split(":").map(Number);

  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
}

interface PageProps {
    currentTrips: Record<string, Trip>
}


export default function Page( { currentTrips } : PageProps) {
    
    // State Vars
    const [trips, setTrips] = useState<Record<string, Trip>>(currentTrips  || {});
    const [stops, setStops] = useState<string[][]| null>(null);
    const [currentService, setCurrentService] = useState(null);
    const [allVehicles, setAllVehicles] = useState(null);
    const [allGoStops, setAllGoStops] = useState(null);
    const [nextGoStopInfo, setNextGoStopInfo] = useState(null);
    const [goStopDetails, setGoStopDetails] = useState(null);

    useEffect(() => {
        const poll = async () => {
            const resTrips = await fetch("/api/serviceAtGlance", { cache: "no-store" }).then(r => r.json() as Promise<Record<string, Trip>>);
            
            const resCurrentStop = await fetch("/api/nextStopInfo?line=UN", { cache: "no-store" }).then(r => r.json());
            const unionStops = await fetch("/api/unionStops", { cache: "no-store" }).then(r => r.json());
            
            const goStops = Object.entries(resTrips).map(([key, resTrip]) => {
            return [resTrip.NextStopCode, resTrip.TripNumber];
            }) 
            setStops(goStops);
            setTrips(resTrips);
            console.log(resTrips)
            console.log(resCurrentStop);
            console.log(unionStops)
        };
        
        //polls every 20 seconds
        const id = setInterval(poll, 20_000);
        return () => clearInterval(id);
    }, []);

    //TO DO: IF train at union, fetch platform # => look into which stations have platform #s
    // const platforms = stops.forEach(async (stop) => {
    // const currentStop = `https://api.openmetrolinx.com/OpenDataAPI/api/V1/Stop.json/NextService/${stop[0]}/?key=30026203`;
    // const resCurrentStop = await fetch(currentStop, { cache: "no-store"}).then(r => r.json());
    // const currentStopTrips: [StopData] = resCurrentStop?.NextService?.Lines || {};
    // // if(currentStopTrips){
    // //     currentStopTrips.filter((trip) => {
    // //     console.log(trip)
    // //     return trip.TripNumber == stop[1]
    // //   })
    // // }
    // })

    return (
    <div style={{"display":"flex", "width": "100vw", "flexWrap": "wrap", "justifyContent":"space-evenly", "alignItems": "center"}}>
        
        {Object.entries(trips).map(([key, trip]) => {
        const lineCode = trip.LineCode?.trim().toUpperCase() as LineCode;
        const nextStopName = getNextNonWaypoint(lineCode, trip.NextStopCode?.trim().toUpperCase(), trip.VariantDir.trim().toUpperCase(), "next");//stopNames[lineCode][trip.NextStopCode?.trim().toUpperCase()]; 
        const prevStopName = getNextNonWaypoint(lineCode, trip.PrevStopCode?.trim().toUpperCase(), trip.VariantDir.trim().toUpperCase(), "prev");//stopNames[lineCode][trip.PrevStopCode?.trim().toUpperCase()];
        const currStopName = getNextNonWaypoint(lineCode, trip.AtStationCode?.trim().toUpperCase(), trip.VariantDir.trim().toUpperCase(), "curr");//stopNames[lineCode][trip.AtStationCode?.trim().toUpperCase()];
        const firstStopName = getNextNonWaypoint(lineCode, trip.FirstStopCode?.trim().toUpperCase(), trip.VariantDir.trim().toUpperCase(), "curr");//stopNames[lineCode][trip.FirstStopCode?.trim().toUpperCase()];
        const lastStopName = getNextNonWaypoint(lineCode, trip.LastStopCode?.trim().toUpperCase(), trip.VariantDir.trim().toUpperCase(), "curr");//stopNames[lineCode][trip.LastStopCode?.trim().toUpperCase()];
        if(lineCode ==="ST"){console.log(trip.PrevStopCode?.trim().toUpperCase(), prevStopName,trip.AtStationCode?.trim().toUpperCase(), currStopName, lineCode, trip.NextStopCode?.trim().toUpperCase(), nextStopName)};
        const timeStart = to12Hour(trip.StartTime);
        const timeEnd = to12Hour(trip.EndTime);
        const line = lineInfo[lineCode];
        if (!line) return null;

        return (
            <Tile
            key={key}
            lineCode={line.lineCode}
            trainLine={line.lineName}
            prevStop={prevStopName ?? trip.PrevStopCode}
            currentStop={currStopName ?? trip.AtStationCode}
            nextStop={nextStopName ?? trip.NextStopCode}
            lat={trip.Latitude}
            long={trip.Longitude}
            platform="X"
            numCars={trip.Cars}
            direction={trip.VariantDir}
            tripStart={timeStart}
            tripEnd={timeEnd}
            currentlyMoving={trip.IsInMotion}
            lineColor={line.lineColor}
            tripID={trip.TripNumber}
            firstStopCode={firstStopName}
            lastStopCode={lastStopName}
            />
        );
        })}
    </div>
    );
}
