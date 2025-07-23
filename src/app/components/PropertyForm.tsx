// components/FincaForm.tsx
"use client";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function FincaForm() {
  const [formData, setFormData] = useState({
    Id_Usuario: "",
    Id_registro: "",
    Temporada: "",
    propiedadConCultivo: false,
    RazonSocial: "",
    NombreFinca: "",
    Localidad: "",
    Departamento: "",
    Provincia: "",
    Productor: "",
    Telefono: "",
    RegimenTenencia: "",
    Herramientas: "",
    Maquinaria: "",
    FechaPlantines: "",
    TemporadaPlantines: "",
    ModoConservacion: "",
    TexturaSuelo: "",
    OrigenAgua: "",
    TemporadaPreparacion: "",
    ArmadoCama: "",
    ValoracionCama: "",
    EmpresaCama: "",
    TemporadaTransplante: "",
    TipoTransplante: "",
    EmpresaTransplante: "",
    DefectosTransplante: "",
    PorcentajeTransplante: 0,
    AgentesTransmision: "",
    FechaCosecha: "",
    TemporadaCosecha: "",
    TipoCosecha: "",
    EmpresaCosecha: "",
    CondicionantesCosecha: "",
    PorcentajeCosecha: 0,
    ObjetivoInspecciones: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "fincas"), formData);
      alert("Finca guardada exitosamente!");
      setFormData({ ...formData, NombreFinca: "" }); // limpia un campo como ejemplo
    } catch (error) {
      console.error("Error al guardar la finca:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white shadow">
      <h2 className="font-bold text-lg">Datos del Registro</h2>
      <input name="Id_Usuario" placeholder="ID Usuario" onChange={handleChange} />
      <input name="Id_registro" placeholder="ID Registro" onChange={handleChange} />
      <select name="Temporada" onChange={handleChange}>
        <option value="">Seleccionar temporada</option>
        <option value="2025">2025</option>
        <option value="2026">2026</option>
      </select>
      <label>
        <input type="checkbox" name="propiedadConCultivo" onChange={handleChange} />
        Propiedad con cultivo
      </label>

      <h2 className="font-bold text-lg">Datos de Propiedad</h2>
      <select name="RazonSocial" onChange={handleChange}>
        <option value="">Seleccionar razón social</option>
        <option value="SA">SA</option>
        <option value="SRL">SRL</option>
      </select>
      <input name="NombreFinca" placeholder="Nombre de la Finca" onChange={handleChange} />
      <select name="Localidad" onChange={handleChange}>
        <option value="">Seleccionar localidad</option>
        <option value="Córdoba">Córdoba</option>
        <option value="Salta">Salta</option>
      </select>
      <input name="Departamento" placeholder="Departamento (GPS)" onChange={handleChange} />
      <input name="Provincia" placeholder="Provincia (GPS)" onChange={handleChange} />

      <h2 className="font-bold text-lg">Contacto de Finca</h2>
      <input name="Productor" placeholder="Productor / Apoderado" onChange={handleChange} />
      <input name="Telefono" type="number" placeholder="Teléfono" onChange={handleChange} />

      {/* ...Agrega aquí el resto de secciones de igual forma... */}

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Guardar Finca
      </button>
    </form>
  );
}
