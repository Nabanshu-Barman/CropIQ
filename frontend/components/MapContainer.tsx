"use client"

import React, { useEffect } from "react"
import { MapContainer as RLMap, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix default marker icon paths so the pin is visible in Next.js builds
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

L.Icon.Default.mergeOptions({
  iconRetinaUrl: (markerIcon2x as any).src || (markerIcon2x as any),
  iconUrl: (markerIcon as any).src || (markerIcon as any),
  shadowUrl: (markerShadow as any).src || (markerShadow as any),
})

type Props = {
  coords: { lat: number; lon: number }
  scrollWheelZoom?: boolean
}

function Recenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lon], map.getZoom() || 8, { animate: true })
  }, [lat, lon, map])
  return null
}

export default function Map({ coords, scrollWheelZoom = false }: Props) {
  const { lat, lon } = coords
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <RLMap
        center={[lat, lon]}
        zoom={8}
        scrollWheelZoom={scrollWheelZoom}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>
            {lat.toFixed(4)}, {lon.toFixed(4)}
          </Popup>
        </Marker>
        <Recenter lat={lat} lon={lon} />
      </RLMap>
    </div>
  )
}