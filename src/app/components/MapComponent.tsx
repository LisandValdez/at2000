// components/MapComponent.tsx
"use client";
import { useEffect, useRef } from "react";
import useMapLogic from "../hooks/useMapLogic";

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);

  useMapLogic(mapRef);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div ref={mapRef} id="map" style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
