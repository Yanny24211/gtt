"use client";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("./map"), {
  ssr: false, // <-- THIS ensures it's only loaded on client
});

export default LiveMap;
