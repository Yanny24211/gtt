

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "./leafletIcons";

type LiveMapProps = {
  lat: number;
  lng: number;
  zoom?: number;
};

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), {
      duration: 0.75,
    });
  }, [lat, lng, map]);

  return null;
}

export default function LiveMap({
  lat,
  lng,
  zoom = 15
}: LiveMapProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      style={{ margin: "10px 5px 10px 10px", height: "300px", width: "90%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap lat={lat} lng={lng} />

      <Marker position={[lat, lng]}>
        <Popup>
          Lat: {lat}, Lng: {lng}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
