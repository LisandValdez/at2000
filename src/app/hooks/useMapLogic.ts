// hooks/useMapLogic.ts
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // 👈 Importa useRouter de Next.js
import { db } from "../lib/firebase";
import { collection } from "firebase/firestore";

export default function useMapLogic(
  mapRef: React.RefObject<HTMLDivElement | null>,
  options?: { onPolygonCreated?: (data: any) => void }
) {
  const router = useRouter(); // 👈 Inicializa el router

  useEffect(() => {
    const leafletScript = document.createElement("script");
    leafletScript.src = "https://unpkg.com/leaflet/dist/leaflet.js";
    leafletScript.async = true;
    document.body.appendChild(leafletScript);

    const drawScript = document.createElement("script");
    drawScript.src = "https://unpkg.com/leaflet-draw/dist/leaflet.draw.js";
    drawScript.async = true;
    document.body.appendChild(drawScript);

    const leafletCSS = document.createElement("link");
    leafletCSS.rel = "stylesheet";
    leafletCSS.href = "https://unpkg.com/leaflet/dist/leaflet.css";
    document.head.appendChild(leafletCSS);

    const drawCSS = document.createElement("link");
    drawCSS.rel = "stylesheet";
    drawCSS.href = "https://unpkg.com/leaflet-draw/dist/leaflet.draw.css";
    document.head.appendChild(drawCSS);

    drawScript.onload = async () => {
      const L = (window as any).L;
      if (!L || !mapRef.current) return;

      const map = L.map(mapRef.current).setView([-33.5, -65], 5);

      const baseMaps = {
        OpenStreetMap: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }),
        Relieve: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}", {
          attribution: "Tiles © Esri",
        }),
        Satélite: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
          attribution: "Tiles © Esri, USDA, USGS",
        }),
      };

      baseMaps.OpenStreetMap.addTo(map);
      L.control.layers(baseMaps).addTo(map);

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems },
        draw: {
          polyline: false,
          circle: false,
          rectangle: false,
          marker: false,
          circlemarker: false,
          polygon: { allowIntersection: false, showArea: true },
        },
      });

      map.addControl(drawControl);

      // 🔽 Traer fincas guardadas y dibujarlas después de agregar control
      try {
        const { getDocs } = await import("firebase/firestore");
        const snapshot = await getDocs(collection(db, "fincas"));

        snapshot.forEach((doc: any) => {
          const data = doc.data();
          const polygonCoordsObjects = data.coordenadas;

          if (polygonCoordsObjects && Array.isArray(polygonCoordsObjects)) {
            const polygonCoords = polygonCoordsObjects.map((coord: { lat: number; lng: number }) => [
              coord.lat,
              coord.lng,
            ]);

            const polygon = L.polygon(polygonCoords, {
              color: "green",
              fillOpacity: 0.4,
            }).addTo(map);

            polygon.bindPopup(`<strong>${data.nombre || "Finca sin nombre"}</strong>`);

            polygon.on("click", () => {
              router.push("/fincas");
            });
          }
        });
      } catch (error) {
        console.error("Error cargando fincas desde Firestore:", error);
      }

      map.on(L.Draw.Event.CREATED, (event: any) => {
        const layer = event.layer;
        drawnItems.addLayer(layer);

        const geojson = drawnItems.toGeoJSON().features[0];

        // Solo dispara el callback sin hacer prompt ni guardar:
        if (options?.onPolygonCreated) {
          options.onPolygonCreated(geojson);
        }
      });
    };

    return () => {
      document.body.removeChild(leafletScript);
      document.body.removeChild(drawScript);
      document.head.removeChild(leafletCSS);
      document.head.removeChild(drawCSS);
    };
  }, [mapRef, options, router]);
}
