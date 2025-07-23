"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function FincasList() {
  const [fincas, setFincas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFincas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "fincas"));
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFincas(docs);
    } catch (error) {
      console.error("Error al obtener fincas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFincas();
  }, []);

  if (loading) return <p>Cargando fincas...</p>;

  if (fincas.length === 0) return <p>No hay fincas aún.</p>;

  return (
    <ul>
      {fincas.map((finca) => (
        <li key={finca.id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
          <strong>🌾 {finca.nombre}</strong><br />
          Tipo: {finca.tipo}<br />
          Coordenadas: {finca.coordenadas?.length} puntos<br />
          Fecha: {new Date(finca.fecha?.seconds * 1000).toLocaleString()}
        </li>
      ))}
    </ul>
  );
}
