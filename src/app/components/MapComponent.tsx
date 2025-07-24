// components/MapComponent.tsx
"use client";
import { useState, useRef } from "react";
import useMapLogic from "../hooks/useMapLogic";
import FincaForm from "./PropertyForm";

export default function MapComponent() {
  const [showForm, setShowForm] = useState(false);
  const [polygonData, setPolygonData] = useState(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useMapLogic(mapRef, {
    onPolygonCreated: (data) => {
      setPolygonData(data);
      setShowForm(true);
    },
  });

  return (
    <div style={{ height: "calc(100vh - 56px)", width: "100vw", position: "relative" }}>
  {/* asumiendo header tiene 56px de alto */}
  <div ref={mapRef} id="map" style={{ height: "100%", width: "100%", position: "relative", zIndex: 1 }} />
  
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-h-[80vh] overflow-auto w-full max-w-lg">
            <FincaForm
              polygonData={polygonData}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
