"use client";
import Image from "next/image";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Cargar Leaflet y Leaflet Draw dinámicamente
    const leafletScript = document.createElement("script");
    leafletScript.src = "https://unpkg.com/leaflet/dist/leaflet.js";
    leafletScript.async = true;
    document.body.appendChild(leafletScript);

    const leafletDrawScript = document.createElement("script");
    leafletDrawScript.src = "https://unpkg.com/leaflet-draw/dist/leaflet.draw.js";
    leafletDrawScript.async = true;
    document.body.appendChild(leafletDrawScript);

    const leafletCSS = document.createElement("link");
    leafletCSS.rel = "stylesheet";
    leafletCSS.href = "https://unpkg.com/leaflet/dist/leaflet.css";
    document.head.appendChild(leafletCSS);

    const leafletDrawCSS = document.createElement("link");
    leafletDrawCSS.rel = "stylesheet";
    leafletDrawCSS.href = "https://unpkg.com/leaflet-draw/dist/leaflet.draw.css";
    document.head.appendChild(leafletDrawCSS);

    // Esperar a que los scripts se carguen
    leafletDrawScript.onload = async () => {
    const L = (window as any).L;
    if (!L) return;

    // Import firebase funciones
    const { initializeApp } = await import("firebase/app");
    const { getFirestore, collection, addDoc } = await import("firebase/firestore");

    // Definir config aquí, ya cargaron las variables de entorno
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
    };

    console.log("Firebase config:", firebaseConfig);

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

      const map = L.map("map").setView([-33.5, -65], 5);

      const baseMaps = {
        "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors"
        }),
        "Relieve": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}", {
          attribution: "Tiles © Esri"
        }),
        "Satélite": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
          attribution: "Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, etc."
        })
      };

      baseMaps["OpenStreetMap"].addTo(map);
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
          polygon: { allowIntersection: false, showArea: true }
        }
      });
      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, async function (event: any) {
        const layer = event.layer;
        drawnItems.addLayer(layer);

        const geojson = drawnItems.toGeoJSON().features[0];

console.log("Coordenadas crudas:", JSON.stringify(geojson.geometry.coordinates, null, 2));

await addDoc(collection(db, "fincas"), {
  nombre: window.prompt("Nombre de la finca:"),
  tipo: geojson.geometry.type,
  coordenadas: geojson.geometry.coordinates[0].map((punto: number[]) => ({
    lat: punto[1],
    lng: punto[0]
  })),
  fecha: new Date()
});

        window.alert("Finca guardada en Firebase!");
      });
    };

    // Limpieza
    return () => {
      document.body.removeChild(leafletScript);
      document.body.removeChild(leafletDrawScript);
      document.head.removeChild(leafletCSS);
      document.head.removeChild(leafletDrawCSS);
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div id="map" style={{ height: "100vh", width: "100vw" }} />
    </div>
  );
}
