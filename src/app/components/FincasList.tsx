//component to display a list of properties (fincas) and allow users to complete a form for each property
// This component fetches properties from Firestore and displays them in a list

"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import FincaForm from "./PropertyForm";

export default function FincasList() {
  const [fincas, setFincas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFinca, setSelectedFinca] = useState<any | null>(null);

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

  const handleCloseForm = () => {
    setSelectedFinca(null);
    fetchFincas(); // Refresca la lista después de guardar
  };

  const handleUpdateFinca = async (id: string, updatedFormulario: any) => {
    try {
      const fincaRef = doc(db, "fincas", id);
      await updateDoc(fincaRef, {
        formulario: updatedFormulario,
      });
      alert("Finca actualizada exitosamente!");
      handleCloseForm();
    } catch (error) {
      console.error("Error al actualizar finca:", error);
      alert("Error al actualizar la finca.");
    }
  };

  if (loading) return <p>Cargando fincas...</p>;

  if (fincas.length === 0) return <p>No hay fincas aún.</p>;

  return (
    <>
      <ul>
        {fincas.map((finca) => (
          <li
            key={finca.id}
            style={{
              marginBottom: "1rem",
              borderBottom: "1px solid #ccc",
              paddingBottom: "0.5rem",
            }}
          >
            <strong>🌾 {finca.nombre}</strong>
            <br />
            Fecha: {new Date(finca.fecha).toLocaleString()}
            <br />
            <button
              onClick={() => setSelectedFinca(finca)}
              style={{
                marginTop: "0.5rem",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "6px 12px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Completar Formulario
            </button>
          </li>
        ))}
      </ul>

      {selectedFinca && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={handleCloseForm}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded shadow-lg max-h-[80vh] overflow-y-auto w-[90vw] max-w-[600px]"
          >
            <FincaForm
              polygonData={selectedFinca}
              initialFormData={selectedFinca.formulario}
              onClose={handleCloseForm}
              onSave={(updatedFormulario) =>
                handleUpdateFinca(selectedFinca.id, updatedFormulario)
              }
            />
          </div>
        </div>
      )}
    </>
  );
}
