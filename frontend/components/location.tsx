"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Load map only on client
const MapContainer = dynamic(() => import("./MapContainer"), { ssr: false });

type Coords = { lat: number; lon: number } | null;

export default function Location() {
  const [coords, setCoords] = useState<Coords>(null);
  const [address, setAddress] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported.");
      return;
    }
    setStatus("Fetching location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords({ lat, lon });
        setStatus(Latitude: ${lat}, Longitude: ${lon});

        try {
          const res = await fetch("http://localhost:4000/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lon }),
          });
          const data = await res.json();
          setAddress(data.address || "No address found");
        } catch (err) {
          setAddress("Backend fetch failed");
        }
      },
      (err) => {
        setStatus("Error: " + err.message);
      }
    );
  };

  return (
    <div>
      <h2>User Location</h2>
      <button onClick={getLocation}>Get My Location</button>
      <p>{status}</p>
      {coords && <p>Coords: {coords.lat}, {coords.lon}</p>}
      {address && <p>Address: {address}</p>}
      {coords && <MapContainer coords={coords} />}
    </div>
  );
}