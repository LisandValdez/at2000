"use client";
import dynamic from "next/dynamic";

// Carga dinámica solo en cliente
const MapComponent = dynamic(() => import("./components/MapComponent"), { ssr: false });

export default function Page() {
  return <MapComponent />;
}
