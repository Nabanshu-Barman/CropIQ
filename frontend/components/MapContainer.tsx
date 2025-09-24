"use client";

import { useEffect } from "react";
import L from "leaflet";

type Props = {
  coords: { lat: number; lon: number };
};

export default function MapContainer({ coords }: Props) {
  useEffect(() => {
    const map = L.map("map").setView([coords.lat, coords.lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.marker([coords.lat, coords.lon]).addTo(map);

    return () => {
      map.remove();
    };
  }, [coords]);

  return (
    <div
      id="map"
      style={{ height: "400px", width: "100%", marginTop: "10px" }}
    />
  );
}