import Tile from "./tile/tile";
import "../globals.css";
import fs from "fs";

//Types and data structures
type LineCode = "LW" | "LE" | "GT" | "ST" | "RH" | "BR" | "MI";

type StopCode = string; 

type Trip = {
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
};

type StopData = {
  ActualPlatform: string;
  ComputedDepartureTime: string;
  DepartureStatus: string;
  DirectionCode: string;
  DirectionName: string;
  Latitude: number;
  LineCode: string;
  LineName: string;
  Longitude: number;
  ScheduledDepartureTime: string;
  ScheduledPlatform: string;
  ServiceType: string;
  Status: string;
  StopCode: string;
  TripNumber: string;
  TripOrder: number;
  UpdateTime: string;
}

type StopAttrbutes = {
  isWaypoint: boolean,
  stopCode: string, 
  stopName: string,
}

const lineInfo: Record<LineCode, { lineCode: string; lineName: string; lineColor: string, lineDirection: string }> = {
  LW: { lineCode: "LW", lineName: "Lakeshore West", lineColor: "#98002E", lineDirection: "W" },
  LE: { lineCode: "LE", lineName: "Lakeshore East", lineColor: "#FF0D00", lineDirection: "E" },
  GT: { lineCode: "GT", lineName: "Kitchener", lineColor: "#00853E", lineDirection: "W" },
  ST: { lineCode: "ST", lineName: "Stouffville", lineColor: "#794500", lineDirection: "N" },
  RH: { lineCode: "RH", lineName: "Richmond Hill", lineColor: "#0099C7", lineDirection: "N" },
  BR: { lineCode: "BR", lineName: "Barrie", lineColor: "#003767", lineDirection: "N" },
  MI: { lineCode: "MI", lineName: "Milton", lineColor: "#F57F25", lineDirection: "N" },
};

const stopNames: Record<LineCode, Record<StopCode, StopAttrbutes>> = {
  LW: {
    UN: { isWaypoint: false, stopCode: "UN", stopName: "Union Station GO" },
    JOHN: { isWaypoint: true, stopCode: "JOHN", stopName: "John Street" },
    BLUE: { isWaypoint: true, stopCode: "BLUE", stopName: "Blue Jays Way" },
    PORT: { isWaypoint: true, stopCode: "PORT", stopName: "Portland Ave." },
    BATH: { isWaypoint: true, stopCode: "BATH", stopName: "Bathurst St" },
    FORT: { isWaypoint: true, stopCode: "FORT", stopName: "Fort York" },
    EX: { isWaypoint: false, stopCode: "EX", stopName: "Exhibition GO" },
    DUFF: { isWaypoint: true, stopCode: "DUFF", stopName: "Dufferin" },
    GARD: { isWaypoint: true, stopCode: "GARD", stopName: "Gardiner" },
    MIME: { isWaypoint: true, stopCode: "MIME", stopName: "Mimico East" },
    MI: { isWaypoint: false, stopCode: "MI", stopName: "Mimico GO" },
    WB: { isWaypoint: true, stopCode: "WB", stopName: "Willowbrook" },
    CANP: { isWaypoint: true, stopCode: "CANP", stopName: "Canpa" },
    LO: { isWaypoint: false, stopCode: "LO", stopName: "Long Branch GO" },
    REVU: { isWaypoint: true, stopCode: "REVU", stopName: "Revus" },
    PO: { isWaypoint: false, stopCode: "PO", stopName: "Port Credit GO" },
    POCL: { isWaypoint: true, stopCode: "POCL", stopName: "Port Credit Controlled Loc" },
    HBPO: { isWaypoint: true, stopCode: "HBPO", stopName: "Hot Box MP 14.07" },
    CL: { isWaypoint: false, stopCode: "CL", stopName: "Clarkson GO" },
    PARK: { isWaypoint: true, stopCode: "PARK", stopName: "Park Royal" },
    "9THL": { isWaypoint: true, stopCode: "9THL", stopName: "9th Line" },
    OA: { isWaypoint: false, stopCode: "OA", stopName: "Oakville GO" },
    OAKY: { isWaypoint: true, stopCode: "OAKY", stopName: "Oakville Yard" },
    KERR: { isWaypoint: true, stopCode: "KERR", stopName: "Kerr St" },
    BO: { isWaypoint: false, stopCode: "BO", stopName: "Bronte GO" },
    BURL: { isWaypoint: true, stopCode: "BURL", stopName: "Burloak" },
    AP: { isWaypoint: false, stopCode: "AP", stopName: "Appleby GO" },
    BURE: { isWaypoint: true, stopCode: "BURE", stopName: "Burlington East" },
    BU: { isWaypoint: false, stopCode: "BU", stopName: "Burlington GO" },
    OSBO: { isWaypoint: true, stopCode: "OSBO", stopName: "CN/MX Oakville Border" },
    BURW: { isWaypoint: true, stopCode: "BURW", stopName: "Burlington West" },
    HBAL: { isWaypoint: true, stopCode: "HBAL", stopName: "Hot Box MP 33.00" },
    ALDE: { isWaypoint: true, stopCode: "ALDE", stopName: "Aldershot East" },
    WATE: { isWaypoint: true, stopCode: "WATE", stopName: "Waterdown" },
    AL: { isWaypoint: false, stopCode: "AL", stopName: "Aldershot GO" },
    WATW: { isWaypoint: true, stopCode: "WATW", stopName: "Waterdown West" },
    SNAK: { isWaypoint: true, stopCode: "SNAK", stopName: "Snake" },
    BAYV: { isWaypoint: true, stopCode: "BAYV", stopName: "Bayview" },
    HAMJ: { isWaypoint: true, stopCode: "HAMJ", stopName: "Hamilton Junction" },
    DDRN: { isWaypoint: true, stopCode: "DDRN", stopName: "Dundurn" },
    STUA: { isWaypoint: true, stopCode: "STUA", stopName: "Stuart" },
    WR: { isWaypoint: false, stopCode: "WR", stopName: "West Harbour GO" },
    CNHA: { isWaypoint: true, stopCode: "CNHA", stopName: "CN Hamilton" },
    HBBI: { isWaypoint: true, stopCode: "HBBI", stopName: "Hot Box MP 42.50" },
    REDHILLPKW: { isWaypoint: true, stopCode: "REDHILLPKW", stopName: "Red Hill Valley Parkway" },
    CF: { isWaypoint: false, stopCode: "CF", stopName: "Confederation GO" },
    "MILLEN RD": { isWaypoint: true, stopCode: "MILLEN", stopName: "Millen RD" },
    MCNE: { isWaypoint: true, stopCode: "MCNE", stopName: "McNeilly" },
    LRST: { isWaypoint: true, stopCode: "LRST", stopName: "Lewis Layover" },
    HBWI: { isWaypoint: true, stopCode: "HBWI", stopName: "Hot Box MP 28.60" },
    VGRI: { isWaypoint: true, stopCode: "VGRI", stopName: "VIA Grimsby Station" },
    "NELLES RD": { isWaypoint: true, stopCode: "NELLESRD", stopName: "Nelles Rd." },
    HBJO: { isWaypoint: true, stopCode: "HBJO", stopName: "Hot Box MP 18.90" },
    JR: { isWaypoint: true, stopCode: "JR", stopName: "Jordan" },
    SCTH: { isWaypoint: false, stopCode: "SCTH", stopName: "St. Catharines GO" },
    GLENRIDGE: { isWaypoint: true, stopCode: "GLENRIDGE", stopName: "Glenridge" },
    SEAWAY: { isWaypoint: true, stopCode: "SEAWAY", stopName: "Seaway Bridge 6" },
    CLIFTON: { isWaypoint: true, stopCode: "CLIFTON", stopName: "Clifton" },
    CLIE: { isWaypoint: true, stopCode: "CLIE", stopName: "Clifton East" },
    NF: { isWaypoint: false, stopCode: "NF", stopName: "Niagara Falls GO" }
  },
  MI: {
    UN: { isWaypoint: false, stopCode: "UN", stopName: "Union Station GO" },
    JOHN: { isWaypoint: true, stopCode: "JOHN", stopName: "John Street" },
    BLUE: { isWaypoint: true, stopCode: "BLUE", stopName: "Blue Jays Way" },
    PORT: { isWaypoint: true, stopCode: "PORT", stopName: "Portland Ave." },
    BATH: { isWaypoint: true, stopCode: "BATH", stopName: "Bathurst St" },
    STWE: { isWaypoint: true, stopCode: "STWE", stopName: "Strachan" },
    DUND: { isWaypoint: true, stopCode: "DUND", stopName: "Dundas" },
    DUPO: { isWaypoint: true, stopCode: "DUPO", stopName: "Dupont" },
    WES: { isWaypoint: true, stopCode: "WES", stopName: "West Toronto" },
    LAMB: { isWaypoint: true, stopCode: "LAMB", stopName: "Lambton" },
    SCAR: { isWaypoint: true, stopCode: "SCAR", stopName: "Scarlett Road" },
    HUMB: { isWaypoint: true, stopCode: "HUMB", stopName: "Humber" },
    ROYA: { isWaypoint: true, stopCode: "ROYA", stopName: "Royal York" },
    HBMC: { isWaypoint: true, stopCode: "HBMC", stopName: "Hot Box MP 8.60" },
    BLOO: { isWaypoint: true, stopCode: "BLOO", stopName: "CP Bloor" },
    OBIC: { isWaypoint: true, stopCode: "OBIC", stopName: "Obico" },
    KP: { isWaypoint: false, stopCode: "KP", stopName: "Kipling GO" },
    CPDI: { isWaypoint: true, stopCode: "CPDI", stopName: "CP Dixie" },
    DI: { isWaypoint: false, stopCode: "DI", stopName: "Dixie GO" },
    COC: { isWaypoint: true, stopCode: "COC", stopName: "Cooksville Creek" },
    CO: { isWaypoint: false, stopCode: "CO", stopName: "Cooksville GO" },
    MISS: { isWaypoint: true, stopCode: "MISS", stopName: "Mississauga" },
    ER: { isWaypoint: false, stopCode: "ER", stopName: "Erindale GO" },
    H403: { isWaypoint: true, stopCode: "H403", stopName: "Hwy 403" },
    SR: { isWaypoint: false, stopCode: "SR", stopName: "Streetsville GO" },
    ONT: { isWaypoint: true, stopCode: "ONT", stopName: "Ontario St W" },
    CPME: { isWaypoint: true, stopCode: "CPME", stopName: "CP Meadowvale" },
    ME: { isWaypoint: false, stopCode: "ME", stopName: "Meadowvale GO" },
    HBLI: { isWaypoint: true, stopCode: "HBLI", stopName: "Hot Box MP 24.90" },
    LS: { isWaypoint: false, stopCode: "LS", stopName: "Lisgar GO" },
    HORE: { isWaypoint: true, stopCode: "HORE", stopName: "Hornby East" },
    HORN: { isWaypoint: true, stopCode: "HORN", stopName: "Hornby" },
    MILE: { isWaypoint: true, stopCode: "MILE", stopName: "Milton East" },
    MIST: { isWaypoint: true, stopCode: "MIST", stopName: "Milton Layover" },
    MSTB: { isWaypoint: true, stopCode: "MSTB", stopName: "Milton Stub Track" },
    ML: { isWaypoint: false, stopCode: "ML", stopName: "Milton GO" }
  },
  GT: {
    UN: { isWaypoint: false, stopCode: "UN", stopName: "Union Station GO" },
    JOHN: { isWaypoint: true, stopCode: "JOHN", stopName: "John Street" },
    BLUE: { isWaypoint: true, stopCode: "BLUE", stopName: "Blue Jays Way" },
    PORT: { isWaypoint: true, stopCode: "PORT", stopName: "Portland Ave." },
    BATH: { isWaypoint: true, stopCode: "BATH", stopName: "Bathurst St" },
    STWE: { isWaypoint: true, stopCode: "STWE", stopName: "Strachan" },
    PAWE: { isWaypoint: true, stopCode: "PAWE", stopName: "Parkdale" },
    BL: { isWaypoint: false, stopCode: "BL", stopName: "Bloor GO" },
    MD: { isWaypoint: false, stopCode: "MD", stopName: "Mount Dennis GO" },
    NI: { isWaypoint: true, stopCode: "NI", stopName: "Nickle" },
    WE: { isWaypoint: false, stopCode: "WE", stopName: "Weston GO" },
    HUMV: { isWaypoint: true, stopCode: "HUMV", stopName: "Humberview" },
    ET: { isWaypoint: false, stopCode: "ET", stopName: "Etobicoke North GO" },
    WICE: { isWaypoint: true, stopCode: "WICE", stopName: "Wice" },
    MA: { isWaypoint: false, stopCode: "MA", stopName: "Malton GO" },
    AI: { isWaypoint: true, stopCode: "AI", stopName: "Airway" },
    HALW: { isWaypoint: true, stopCode: "HALW", stopName: "Halwest-Halton" },
    BE: { isWaypoint: false, stopCode: "BE", stopName: "Bramalea GO" },
    HBPE: { isWaypoint: true, stopCode: "HBPE", stopName: "Hot Box Mile 13.00" },
    PEEL: { isWaypoint: true, stopCode: "PEEL", stopName: "Peel" },
    BR: { isWaypoint: false, stopCode: "BR", stopName: "Brampton Innovation District GO" },
    BRDI: { isWaypoint: true, stopCode: "BRDI", stopName: "Brampton Diamond" },
    BOVA: { isWaypoint: true, stopCode: "BOVA", stopName: "Bovaird" },
    MO: { isWaypoint: false, stopCode: "MO", stopName: "Mount Pleasant GO" },
    NORV: { isWaypoint: true, stopCode: "NORV", stopName: "Norval" },
    HBCR: { isWaypoint: true, stopCode: "HBCR", stopName: "Hot Box MP 22.90" },
    CNGE: { isWaypoint: true, stopCode: "CNGE", stopName: "CN Georgetown" },
    GETE: { isWaypoint: true, stopCode: "GETE", stopName: "Georgetown East" },
    GE: { isWaypoint: false, stopCode: "GE", stopName: "Georgetown GO" },
    GETW: { isWaypoint: true, stopCode: "GETW", stopName: "Georgetown West" },
    SILV: { isWaypoint: true, stopCode: "SILV", stopName: "Silver" },
    AC: { isWaypoint: false, stopCode: "AC", stopName: "Acton GO" },
    HBAC: { isWaypoint: true, stopCode: "HBAC", stopName: "Hot Box MP 37.20" },
    ERAM: { isWaypoint: true, stopCode: "ERAM", stopName: "Eramosa" },
    CONTI: { isWaypoint: true, stopCode: "CONTI", stopName: "Conti" },
    GL: { isWaypoint: false, stopCode: "GL", stopName: "Guelph Central GO" },
    SCPK: { isWaypoint: true, stopCode: "SCPK", stopName: "Hanlon" },
    SHAZ: { isWaypoint: true, stopCode: "SHAZ", stopName: "Shantz" },
    WOOL: { isWaypoint: true, stopCode: "WOOL", stopName: "Woolwich" },
    SHST: { isWaypoint: true, stopCode: "SHST", stopName: "Shirley Ave Layover" },
    SHRE: { isWaypoint: true, stopCode: "SHRE", stopName: "Shirley East Lead" },
    KICL: { isWaypoint: false, stopCode: "KICL", stopName: "Kitchener Controlled Loc" },
    KI: { isWaypoint: true, stopCode: "KI", stopName: "Kitchener GO" },
    KIW: { isWaypoint: true, stopCode: "KIW", stopName: "Kitchener West" },
    GUBO: { isWaypoint: true, stopCode: "GUBO", stopName: "MX/CN Guelph Boundary" },
    KLTB: { isWaypoint: true, stopCode: "KLTB", stopName: "Kitchener Layover Turnback" },
    KISL: { isWaypoint: true, stopCode: "KISL", stopName: "Kitchener Layover Lead" },
    KIST: { isWaypoint: true, stopCode: "KIST", stopName: "Kitchener Layover" },  
  },
  RH: {
    UN: { isWaypoint: false, stopCode: "UN", stopName: "Union Station GO" },
    SCOT: { isWaypoint: true, stopCode: "SCOT", stopName: "Scott St" },
    JARV: { isWaypoint: true, stopCode: "JARV", stopName: "Jarvis St." },
    SHER: { isWaypoint: true, stopCode: "SHER", stopName: "Sherbourne St." },
    PARL: { isWaypoint: true, stopCode: "PARL", stopName: "Parliament St." },
    CHER: { isWaypoint: true, stopCode: "CHER", stopName: "Cherry St" },
    DON: { isWaypoint: true, stopCode: "DON", stopName: "Don" },
    ROSS: { isWaypoint: true, stopCode: "ROSS", stopName: "Rosedale South" },
    ROSE: { isWaypoint: true, stopCode: "ROSE", stopName: "Rosedale" },
    ROSN: { isWaypoint: true, stopCode: "ROSN", stopName: "Rosedale North" },
    HBRO: { isWaypoint: true, stopCode: "HBRO", stopName: "Hot Box 4.90" },
    ORIS: { isWaypoint: true, stopCode: "ORIS", stopName: "Oriole South" },
    ORIN: { isWaypoint: true, stopCode: "ORIN", stopName: "Oriole North" },
    OR: { isWaypoint: false, stopCode: "OR", stopName: "Oriole GO" },
    OL: { isWaypoint: false, stopCode: "OL", stopName: "Old Cummer GO" },
    DONS: { isWaypoint: true, stopCode: "DONS", stopName: "Doncaster South" },
    GLNC: { isWaypoint: true, stopCode: "GLNC", stopName: "Glencrest" },
    DONC: { isWaypoint: true, stopCode: "DONC", stopName: "Doncaster Diamond" },
    LACL: { isWaypoint: true, stopCode: "LACL", stopName: "Langstaff Controlled Loc" },
    HBLA: { isWaypoint: true, stopCode: "HBLA", stopName: "Hot Box MP 18.10" },
    LA: { isWaypoint: false, stopCode: "LA", stopName: "Langstaff GO" },
    RIHS: { isWaypoint: true, stopCode: "RIHS", stopName: "Richmond Hill South" },
    RI: { isWaypoint: false, stopCode: "RI", stopName: "Richmond Hill GO" },
    RIHN: { isWaypoint: true, stopCode: "RIHN", stopName: "Richmond Hill North" },
    EN: { isWaypoint: true, stopCode: "EN", stopName: "Elgin" },
    GO: { isWaypoint: false, stopCode: "GO", stopName: "Gormley GO" },
    RIST: { isWaypoint: true, stopCode: "RIST", stopName: "Richmond Hill Layover" },
    QUAS: { isWaypoint: true, stopCode: "QUAS", stopName: "Quaker South" },
    QUAN: { isWaypoint: true, stopCode: "QUAN", stopName: "Quaker North" },
    BM: { isWaypoint: false, stopCode: "BM", stopName: "Bloomington GO" }
  },
  BR: {
    UN: { isWaypoint: false, stopCode: "UN", stopName: "Union Station GO" },
    JOHN: { isWaypoint: true, stopCode: "JOHN", stopName: "John Street" },
    BLUE: { isWaypoint: true, stopCode: "BLUE", stopName: "Blue Jays Way" },
    PORT: { isWaypoint: true, stopCode: "PORT", stopName: "Portland Ave." },
    BATH: { isWaypoint: true, stopCode: "BATH", stopName: "Bathurst St" },
    STWE: { isWaypoint: true, stopCode: "STWE", stopName: "Strachan" },
    PAWE: { isWaypoint: true, stopCode: "PAWE", stopName: "Parkdale" },
    DAVE: { isWaypoint: true, stopCode: "DAVE", stopName: "Davenport" },
    SPIC: { isWaypoint: true, stopCode: "SPIC", stopName: "Spicer" },
    DW: { isWaypoint: false, stopCode: "DW", stopName: "Downsview Park GO" },
    SNIS: { isWaypoint: true, stopCode: "SNIS", stopName: "Snider South" },
    SNID: { isWaypoint: true, stopCode: "SNID", stopName: "Snider" },
    SNIN: { isWaypoint: true, stopCode: "SNIN", stopName: "Snider North" },
    CONC: { isWaypoint: true, stopCode: "CONC", stopName: "Concord" },
    RU: { isWaypoint: false, stopCode: "RU", stopName: "Rutherford GO" },
    MP: { isWaypoint: false, stopCode: "MP", stopName: "Maple GO" },
    TEST: { isWaypoint: true, stopCode: "TEST", stopName: "Teston" },
    KITB: { isWaypoint: true, stopCode: "KITB", stopName: "Kirby Turnback" },
    KIRB: { isWaypoint: true, stopCode: "KIRB", stopName: "Kirby" },
    KC: { isWaypoint: true, stopCode: "KC", stopName: "King City GO" },
    CHAS: { isWaypoint: true, stopCode: "CHAS", stopName: "Chase" },
    AU: { isWaypoint: false, stopCode: "AU", stopName: "Aurora GO" },
    MACH: { isWaypoint: true, stopCode: "MACH", stopName: "Machell" },
    HBAU: { isWaypoint: true, stopCode: "HBAU", stopName: "Hot Box Aurora" },
    NE: { isWaypoint: false, stopCode: "NE", stopName: "Newmarket GO" },
    EA: { isWaypoint: false, stopCode: "EA", stopName: "East Gwillimbury GO" },
    HOLL: { isWaypoint: true, stopCode: "HOLL", stopName: "Holland" },
    BD: { isWaypoint: false, stopCode: "BD", stopName: "Bradford GO" },
    BRTB: { isWaypoint: true, stopCode: "BRTB", stopName: "Bradford Turnback" },
    BRST: { isWaypoint: true, stopCode: "BRST", stopName: "Bradford Layover" },
    LEFR: { isWaypoint: true, stopCode: "LEFR", stopName: "Lefroy" },
    BA: { isWaypoint: false, stopCode: "BA", stopName: "Barrie South GO" },
    ALNS: { isWaypoint: true, stopCode: "ALNS", stopName: "Allandale Layover South Lead" },
    ALLD: { isWaypoint: true, stopCode: "ALLD", stopName: "Allandale Layover T1 Lead" },
    ALST: { isWaypoint: true, stopCode: "ALST", stopName: "Allandale Layover" },
    ALLA: { isWaypoint: true, stopCode: "ALLA", stopName: "Allandale" },
    AD: { isWaypoint: false, stopCode: "AD", stopName: "Allandale Waterfront GO" }
  },
  ST: {
    UN: { isWaypoint: false, stopCode: "UN", stopName: "Union Station GO" },
    SCOT: { isWaypoint: true, stopCode: "SCOT", stopName: "Scott St" },
    JARV: { isWaypoint: true, stopCode: "JARV", stopName: "Jarvis St." },
    SHER: { isWaypoint: true, stopCode: "SHER", stopName: "Sherbourne St." },
    PARL: { isWaypoint: true, stopCode: "PARL", stopName: "Parliament St." },
    CHER: { isWaypoint: true, stopCode: "CHER", stopName: "Cherry St" },
    KING: { isWaypoint: true, stopCode: "KING", stopName: "USRC/Kingston Boundary" },
    NBCH: { isWaypoint: true, stopCode: "NBCH", stopName: "Hot Box MP 330.30 Cherry St" },
    CNDA: { isWaypoint: true, stopCode: "CNDA", stopName: "CN Danforth" },
    DA: { isWaypoint: true, stopCode: "DA", stopName: "Danforth GO" },
    SCAJ: { isWaypoint: true, stopCode: "SCAJ", stopName: "Scarborough Junction" },
    SC: { isWaypoint: true, stopCode: "SC", stopName: "Scarborough GO" },
    KE: { isWaypoint: false, stopCode: "KE", stopName: "Kennedy GO" },
    OAKW: { isWaypoint: true, stopCode: "OAKW", stopName: "Oakworth" },
    HLND: { isWaypoint: true, stopCode: "HLND", stopName: "Highland" },
    AG: { isWaypoint: false, stopCode: "AG", stopName: "Agincourt GO" },
    MK: { isWaypoint: false, stopCode: "MK", stopName: "Milliken GO" },
    UNDE: { isWaypoint: true, stopCode: "UNDE", stopName: "Underwood" },
    UI: { isWaypoint: false, stopCode: "UI", stopName: "Unionville GO" },
    FULT: { isWaypoint: true, stopCode: "FULT", stopName: "Fulton" },
    CE: { isWaypoint: false, stopCode: "CE", stopName: "Centennial GO" },
    MR: { isWaypoint: false, stopCode: "MR", stopName: "Markham GO" },
    LAID: { isWaypoint: true, stopCode: "LAID", stopName: "Laidlaw" },
    MJ: { isWaypoint: false, stopCode: "MJ", stopName: "Mount Joy GO" },
    GINT: { isWaypoint: true, stopCode: "GINT", stopName: "Ginty" },
    ST: { isWaypoint: false, stopCode: "ST", stopName: "Stouffville GO" },
    LI: { isWaypoint: false, stopCode: "LI", stopName: "Old Elm GO" },
    LICL: { isWaypoint: true, stopCode: "LICL", stopName: "Lincolnville Controlled Loc" },
    LIYD: { isWaypoint: true, stopCode: "LIYD", stopName: "Lincolnville Yard" }
  },
  LE: {
    UN: { isWaypoint: false, stopCode: "UN", stopName: "Union Station GO" },
    SCOT: { isWaypoint: true, stopCode: "SCOT", stopName: "Scott St" },
    JARV: { isWaypoint: true, stopCode: "JARV", stopName: "Jarvis St." },
    SHER: { isWaypoint: true, stopCode: "SHER", stopName: "Sherbourne St." },
    PARL: { isWaypoint: true, stopCode: "PARL", stopName: "Parliament St." },
    CHER: { isWaypoint: true, stopCode: "CHER", stopName: "Cherry St" },
    KING: { isWaypoint: true, stopCode: "KING", stopName: "USRC/Kingston Boundary" },
    NBCH: { isWaypoint: true, stopCode: "NBCH", stopName: "Hot Box MP 330.30 Cherry St" },
    CNDA: { isWaypoint: true, stopCode: "CNDA", stopName: "CN Danforth" },
    DA: { isWaypoint: false, stopCode: "DA", stopName: "Danforth GO" },
    SCAJ: { isWaypoint: true, stopCode: "SCAJ", stopName: "Scarborough Junction" },
    SC: { isWaypoint: false, stopCode: "SC", stopName: "Scarborough GO" },
    EG: { isWaypoint: false, stopCode: "EG", stopName: "Eglinton GO" },
    GU: { isWaypoint: false, stopCode: "GU", stopName: "Guildwood GO" },
    GUCL: { isWaypoint: true, stopCode: "GUCL", stopName: "Guildwood Controlled Loc" },
    HBGU: { isWaypoint: true, stopCode: "HBGU", stopName: "Hot Box MP 320.40" },
    RO: { isWaypoint: false, stopCode: "RO", stopName: "Rouge Hill GO" },
    DURJ: { isWaypoint: true, stopCode: "DURJ", stopName: "Durham Jct" },
    BAYL: { isWaypoint: true, stopCode: "BAYL", stopName: "Bayly" },
    PIN: { isWaypoint: false, stopCode: "PIN", stopName: "Pickering GO" },
    PIS: { isWaypoint: true, stopCode: "PIS", stopName: "Pickering South" },
    AJ: { isWaypoint: false, stopCode: "AJ", stopName: "Ajax GO" },
    HARW: { isWaypoint: true, stopCode: "HARW", stopName: "Harwood" },
    HENR: { isWaypoint: true, stopCode: "HENR", stopName: "Henry St Layover" },
    HENRCP: { isWaypoint: true, stopCode: "HENRCP", stopName: "Henry" },
    WH: { isWaypoint: false, stopCode: "WH", stopName: "Whitby GO" },
    VICT: { isWaypoint: true, stopCode: "VICT", stopName: "Victoria" },
    WRMF: { isWaypoint: true, stopCode: "WRMF", stopName: "Whitby Rail Maintenance Facility" },
    THIW: { isWaypoint: true, stopCode: "THIW", stopName: "Thickson West" },
    THIE: { isWaypoint: true, stopCode: "THIE", stopName: "Thickson East" },
    OS: { isWaypoint: false, stopCode: "OS", stopName: "Durham College Oshawa GO"}
  }
}

//Helper Functions 
function getNextNonWaypoint(
  line?: LineCode,
  currentStopCode?: StopCode,
  direction?: string, 
) {
  if(!currentStopCode || !line || !direction){
    return undefined;
  }
  else{
    if(!stopNames[line][currentStopCode]?.isWaypoint){
      return stopNames[line][currentStopCode]?.stopName;
    }
    const stops = Object.values(stopNames[line]);

    const lineDirection = lineInfo[line].lineDirection;
    const currentIndex = stops.findIndex(
      stop => stop.stopCode === currentStopCode
      );

    if (currentIndex === -1) return undefined;
    if(direction == lineDirection){
      for (let i = currentIndex + 1; i < stops.length; i++) {
        if (!stops[i].isWaypoint) {
          return stops[i].stopName;
        }
      }
    }
    else{
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (!stops[i].isWaypoint) {
          return stops[i].stopName;
        }
      }
    }

  }  
  return undefined; // no next non-waypoint
}

const getTodayYYYYMMDD = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
};

function to12Hour(time24: string) {
  let [hour, minute] = time24.split(":").map(Number);

  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
}

export default async function Page() {
  // API URLs
  const serviceAtGlance = `https://api.openmetrolinx.com/OpenDataAPI/api/V1/ServiceataGlance.json/Trains/All?key=30026203`;
  const allVehicle = `https://api.openmetrolinx.com/OpenDataAPI/api/V1/Gtfs.json/Feed/VehiclePosition?key=30026203`;
  const allStops = `https://api.openmetrolinx.com/OpenDataAPI/api/V1/Stop.json/All?key=30026203`;
  const nextStopInfo = `https://api.openmetrolinx.com/OpenDataAPI/api/V1/Stop.json/NextService/UN/?key=30026203`;
  const stopDetails = `https://api.openmetrolinx.com/OpenDataAPI/api/V1/Stop.json/Details/HORE/?key=30026203`;
  const todaySchedule = `https://api.openmetrolinx.com/OpenDataAPI/api/V1/Schedule.json/Line/All/${getTodayYYYYMMDD()}?key=30026203`;
  // Fetch all APIs server-side
  const [resServiceGlance, resVehicles, resAllStops, resNextStopInfo, resStopDetails, resTodaySchedule] = await Promise.all([
    fetch(serviceAtGlance, { cache: "no-store" }).then(r => r.json()),
    fetch(allVehicle, { cache: "no-store" }).then(r => r.json()),
    fetch(allStops, { cache: "no-store" }).then(r => r.json()),
    fetch(nextStopInfo, { cache: "no-store"}).then(r => r.json()),
    fetch(stopDetails, { cache: "no-store"}).then(r => r.json()),
    fetch(todaySchedule, { cache: "no-store"}).then(r => r.json()),
  ]);

  // Extract trips safely
  const trips: Record<string, Trip> = resServiceGlance?.Trips?.Trip || {};
  const stops = Object.entries(trips).map(([key, trip]) => {
    return [trip.NextStopCode, trip.TripNumber];
  })

  //log all api data into seperate files for QA
  fs.writeFileSync('trips.json', JSON.stringify(trips, null, 2))
  fs.writeFileSync('vehicles.json', JSON.stringify(resVehicles, null, 2))
  fs.writeFileSync('stops.json', JSON.stringify(stops, null, 2))
  fs.writeFileSync('nextStopInfo.json', JSON.stringify(resNextStopInfo, null, 2))
  fs.writeFileSync('stopDetails.json', JSON.stringify(resStopDetails, null, 2))
  fs.writeFileSync('todaySchedule.json', JSON.stringify(resTodaySchedule, null, 2)) 


  //TO DO: IF train at union, fetch platform # => look into which stations have platform #s
  console.log(stops)
  const platforms = stops.forEach(async (stop) => {
    const currentStop = `https://api.openmetrolinx.com/OpenDataAPI/api/V1/Stop.json/NextService/${stop[0]}/?key=30026203`;
    const resCurrentStop = await fetch(currentStop, { cache: "no-store"}).then(r => r.json());
    const currentStopTrips: [StopData] = resCurrentStop?.NextService?.Lines || {};
    // if(currentStopTrips){
    //     currentStopTrips.filter((trip) => {
    //     console.log(trip)
    //     return trip.TripNumber == stop[1]
    //   })
    // }
  })
 
  return (
    <div style={{"display":"flex", "width": "100vw", "flexWrap": "wrap", "justifyContent":"space-evenly", "alignItems": "center"}}>
      {Object.entries(trips).map(([key, trip]) => {
        const lineCode = trip.LineCode?.trim().toUpperCase() as LineCode;
        const nextStopName = getNextNonWaypoint(lineCode, trip.NextStopCode?.trim().toUpperCase(), trip.VariantDir.trim().toUpperCase());//stopNames[lineCode][trip.NextStopCode?.trim().toUpperCase()]; 
        const prevStopName = getNextNonWaypoint(lineCode, trip.PrevStopCode?.trim().toUpperCase(), trip.VariantDir.trim().toUpperCase());//stopNames[lineCode][trip.PrevStopCode?.trim().toUpperCase()];
        const currStopName = getNextNonWaypoint(lineCode, trip.AtStationCode?.trim().toUpperCase(), trip.VariantDir.trim().toUpperCase());//stopNames[lineCode][trip.AtStationCode?.trim().toUpperCase()];
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
          />
        );
      })}
    </div>
  );
}
