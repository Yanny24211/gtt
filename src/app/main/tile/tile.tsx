import LiveMap from "./liveMapWrapper"

type TileProps = {
    trainLine: string, 
    lineCode: string, 
    currentStop: string,
    prevStop: string, 
    nextStop: string, 
    lat: string, 
    long: string, 
    platform: string, 
    numCars: number, 
    direction: string, 
    tripStart: string, 
    tripEnd: string, 
    currentlyMoving: boolean,
    lineColor: string,
    tripID?: string
    firstStopCode?: string;
    lastStopCode?: string;
}



export default function Tile({ trainLine, lineCode, currentStop, prevStop, nextStop, lat, long, platform, numCars, direction, tripStart, tripEnd, currentlyMoving, lineColor, tripID, firstStopCode, lastStopCode }: TileProps){
    return(
        <div className="tile-box-0 text-m font-black text-eggshell" style ={{"display":"flex", "justifyContent":"space-evenly", "backgroundColor": lineColor, "margin": "20px", "width":"500px"}}>
            <div className="tile-box-1">                
                <LiveMap lat={Number(lat)} lng={Number(long)}/>  
            </div>
            <div className="tile-box-2" style={{"margin":"10px"}}>
                <div className="text-xl">{`${trainLine}  [ ${lineCode} ]`}</div>
                <div>Direction: {direction}</div>
                <div>Trip Start Time: {tripStart}</div>
                <div>Trip End Time: {tripEnd}</div>
                <div>Previous Stop: {prevStop}</div>
                <div>Next Stop: {nextStop}</div>
                <div>Current Stop: {currentStop ? currentStop : `En Route to ${nextStop}`}</div>
                <div># Of Coaches: {numCars}</div>
                <div>Moving?: {currentlyMoving ? 'Yes' : 'No'}</div>
                <div>Trip ID: {tripID}</div>
                <div>First Stop: {firstStopCode}</div>
                <div>Last Stop: {lastStopCode}</div>
            </div>
        </div>
    )
}