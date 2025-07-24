// This file contains the form for adding or editing a property (finca) in the application

"use client";
import React, { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface FincaFormProps {
  polygonData: any;
  onClose: () => void;
  initialFormData?: any;  // opcional para edición
  onSave?: (updatedFormulario: any) => Promise<void>; // para guardar edición
}
export default function FincaForm({  polygonData,
  onClose,
  initialFormData,
  onSave,
}: FincaFormProps) {
  const [formData, setFormData] = useState({
  NombreFinca: initialFormData?.NombreFinca || "",
  Id_Usuario: initialFormData?.Id_Usuario || "",
  Id_registro: initialFormData?.Id_registro || "",
  Temporada: initialFormData?.Temporada || "",
  propiedadConCultivo: initialFormData?.propiedadConCultivo || false,
  RazonSocial: initialFormData?.RazonSocial || "",
  Localidad: initialFormData?.Localidad || "",
  Departamento: initialFormData?.Departamento || "",
  Provincia: initialFormData?.Provincia || "",
  Productor: initialFormData?.Productor || "",
  Telefono: initialFormData?.Telefono || "",
  RegimenTenencia: initialFormData?.RegimenTenencia || "",
  Herramientas: initialFormData?.Herramientas || "",
  Maquinaria: initialFormData?.Maquinaria || "",
  FechaPlantines: initialFormData?.FechaPlantines || "",
  TemporadaPlantines: initialFormData?.TemporadaPlantines || "",
  ModoConservacion: initialFormData?.ModoConservacion || "",
  TexturaSuelo: initialFormData?.TexturaSuelo || "",
  OrigenAgua: initialFormData?.OrigenAgua || "",
  TemporadaPreparacion: initialFormData?.TemporadaPreparacion || "",
  ArmadoCama: initialFormData?.ArmadoCama || "",
  ValoracionCama: initialFormData?.ValoracionCama || "",
  EmpresaCama: initialFormData?.EmpresaCama || "",
  TemporadaTransplante: initialFormData?.TemporadaTransplante || "",
  TipoTransplante: initialFormData?.TipoTransplante || "",
  EmpresaTransplante: initialFormData?.EmpresaTransplante || "",
  DefectosTransplante: initialFormData?.DefectosTransplante || "",
  PorcentajeTransplante: initialFormData?.PorcentajeTransplante || 0,
  AgentesTransmision: initialFormData?.AgentesTransmision || "",
  FechaCosecha: initialFormData?.FechaCosecha || "",
  TemporadaCosecha: initialFormData?.TemporadaCosecha || "",
  TipoCosecha: initialFormData?.TipoCosecha || "",
  EmpresaCosecha: initialFormData?.EmpresaCosecha || "",
  CondicionantesCosecha: initialFormData?.CondicionantesCosecha || "",
  PorcentajeCosecha: initialFormData?.PorcentajeCosecha || 0,
  ObjetivoInspecciones: initialFormData?.ObjetivoInspecciones || 0,
});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.NombreFinca.trim()) {
      alert("El campo Nombre de la Finca es obligatorio");
      return;
    }

    if (onSave) {
      // Editar finca existente
      try {
        await onSave(formData);
      } catch (error) {
        console.error("Error al guardar finca:", error);
      }
      onClose();
      return;
    }

    // Extraer coords de polygonData para usar en fincaDoc
    const coordsNested = polygonData?.geometry?.coordinates ?? [];
    const coords = coordsNested[0]?.map((p: number[]) => ({
      lat: p[1],
      lng: p[0],
    })) ?? [];

    const fincaDoc = {
      coordenadas: coords,
      tipo: polygonData?.geometry?.type ?? "Polygon",
      fecha: new Date().toISOString(),
      nombre: formData.NombreFinca,
      formulario: { ...formData },
    };

    try {
      await addDoc(collection(db, "fincas"), fincaDoc);
      alert("Finca guardada exitosamente!");
      onClose();
    } catch (error) {
      console.error("Error al guardar la finca:", error);
      alert("Error al guardar la finca, revisa la consola");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border border-gray-300 rounded bg-white shadow max-h-[80vh] overflow-y-auto"
    >
      <h2 className="font-bold text-lg text-green-700">Datos del Registro</h2>

      <input
        name="NombreFinca"
        placeholder="Nombre de la Finca"
        value={formData.NombreFinca}
        onChange={handleChange}
        required
        className="border p-2 w-full text-gray-800 placeholder-gray-600"
      />

      <input
        name="Id_Usuario"
        placeholder="ID Usuario"
        onChange={handleChange}
        className="border p-2 w-full text-gray-800 placeholder-gray-600"
      />
      <input
        name="Id_registro"
        placeholder="ID Registro"
        onChange={handleChange}
        className="border p-2 w-full text-gray-800 placeholder-gray-600"
      />
      <select
        name="Temporada"
        onChange={handleChange}
        value={formData.Temporada}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar temporada</option>
        <option className="text-green-900 bg-green-50" value="2025">2025</option>
        <option className="text-green-900 bg-green-50" value="2026">2026</option>
      </select>
      <label className="flex items-center space-x-2 text-gray-800">
        <input
          type="checkbox"
          name="propiedadConCultivo"
          checked={formData.propiedadConCultivo}
          onChange={handleChange}
        />
        <span>Propiedad con cultivo</span>
      </label>

      <h2 className="font-bold text-lg mt-4 text-green-700">Datos de Propiedad</h2>
      <select
        name="RazonSocial"
        onChange={handleChange}
        value={formData.RazonSocial}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar razón social</option>
        <option className="text-green-900 bg-green-50" value="SA">SA</option>
        <option className="text-green-900 bg-green-50" value="SRL">SRL</option>
      </select>
      <input
        name="Localidad"
        placeholder="Localidad"
        onChange={handleChange}
        className="border p-2 w-full text-gray-800 placeholder-gray-600"
      />
      <input
        name="Departamento"
        placeholder="Departamento (GPS)"
        onChange={handleChange}
        className="border p-2 w-full text-gray-800 placeholder-gray-600"
      />
      <input
        name="Provincia"
        placeholder="Provincia (GPS)"
        onChange={handleChange}
        className="border p-2 w-full text-gray-800 placeholder-gray-600"
      />

      <h2 className="font-bold text-lg mt-4 text-green-700">Contacto de Finca</h2>
      <input
        name="Productor"
        placeholder="Productor / Apoderado"
        onChange={handleChange}
        className="border p-2 w-full text-gray-800 placeholder-gray-600"
      />
      <input
        name="Telefono"
        type="number"
        placeholder="Teléfono"
        onChange={handleChange}
        className="border p-2 w-full text-gray-800 placeholder-gray-600"
      />

      <h2 className="font-bold text-lg mt-4 text-green-700">Perfil de Finca</h2>
      <select
        name="RegimenTenencia"
        onChange={handleChange}
        value={formData.RegimenTenencia}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar régimen de tenencia</option>
        <option className="text-green-900 bg-green-50" value="Propia">Propia</option>
        <option className="text-green-900 bg-green-50" value="Alquilada">Alquilada</option>
      </select>

      <h2 className="font-bold text-lg mt-4 text-green-700">Maquinaria y Herramientas</h2>
      <select
        name="Herramientas"
        onChange={handleChange}
        value={formData.Herramientas}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar herramientas</option>
        <option className="text-green-900 bg-green-50" value="Herramienta1">Herramienta1</option>
        <option className="text-green-900 bg-green-50" value="Herramienta2">Herramienta2</option>
      </select>
      <select
        name="Maquinaria"
        onChange={handleChange}
        value={formData.Maquinaria}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar maquinaria</option>
        <option className="text-green-900 bg-green-50" value="Maquinaria1">Maquinaria1</option>
        <option className="text-green-900 bg-green-50" value="Maquinaria2">Maquinaria2</option>
      </select>

      <h2 className="font-bold text-lg mt-4 text-green-700">Infraestructura conservación de plantines</h2>
      <input
        type="date"
        name="FechaPlantines"
        onChange={handleChange}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      />
      <select
        name="TemporadaPlantines"
        onChange={handleChange}
        value={formData.TemporadaPlantines}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar temporada</option>
        <option className="text-green-900 bg-green-50" value="2025">2025</option>
        <option className="text-green-900 bg-green-50" value="2026">2026</option>
      </select>
      <select
        name="ModoConservacion"
        onChange={handleChange}
        value={formData.ModoConservacion}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar modo de conservación</option>
        <option className="text-green-900 bg-green-50" value="Modo1">Modo1</option>
        <option className="text-green-900 bg-green-50" value="Modo2">Modo2</option>
      </select>

      <h2 className="font-bold text-lg mt-4 text-green-700">Suelo</h2>
      <select
        name="TexturaSuelo"
        onChange={handleChange}
        value={formData.TexturaSuelo}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar textura</option>
        <option className="text-green-900 bg-green-50" value="Arenoso">Arenoso</option>
        <option className="text-green-900 bg-green-50" value="Arcilloso">Arcilloso</option>
        <option className="text-green-900 bg-green-50" value="Franco">Franco</option>
      </select>

      <h2 className="font-bold text-lg mt-4 text-green-700">Agua</h2>
      <select
        name="OrigenAgua"
        onChange={handleChange}
        value={formData.OrigenAgua}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar origen de agua</option>
        <option className="text-green-900 bg-green-50" value="Pozo">Pozo</option>
        <option className="text-green-900 bg-green-50" value="Rio">Río</option>
        <option className="text-green-900 bg-green-50" value="Lluvia">Lluvia</option>
      </select>

      <h2 className="font-bold text-lg mt-4 text-green-700">Preparación de la cama</h2>
      <select
        name="TemporadaPreparacion"
        onChange={handleChange}
        value={formData.TemporadaPreparacion}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar temporada</option>
        <option className="text-green-900 bg-green-50" value="2025">2025</option>
        <option className="text-green-900 bg-green-50" value="2026">2026</option>
      </select>
      <select
        name="ArmadoCama"
        onChange={handleChange}
        value={formData.ArmadoCama}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar armado de cama</option>
        <option className="text-green-900 bg-green-50" value="Tipo1">Tipo1</option>
        <option className="text-green-900 bg-green-50" value="Tipo2">Tipo2</option>
      </select>
      <select
        name="ValoracionCama"
        onChange={handleChange}
        value={formData.ValoracionCama}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar valoración de cama</option>
        <option className="text-green-900 bg-green-50" value="Buena">Buena</option>
        <option className="text-green-900 bg-green-50" value="Regular">Regular</option>
        <option className="text-green-900 bg-green-50" value="Mala">Mala</option>
      </select>
      <select
        name="EmpresaCama"
        onChange={handleChange}
        value={formData.EmpresaCama}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar empresa de servicio</option>
        <option className="text-green-900 bg-green-50" value="Empresa1">Empresa1</option>
        <option className="text-green-900 bg-green-50" value="Empresa2">Empresa2</option>
      </select>

      <h2 className="font-bold text-lg mt-4 text-green-700">Transplante</h2>
      <select
        name="TemporadaTransplante"
        onChange={handleChange}
        value={formData.TemporadaTransplante}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar temporada</option>
        <option className="text-green-900 bg-green-50" value="2025">2025</option>
        <option className="text-green-900 bg-green-50" value="2026">2026</option>
      </select>
      <select
        name="TipoTransplante"
        onChange={handleChange}
        value={formData.TipoTransplante}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar tipo de transplante</option>
        <option className="text-green-900 bg-green-50" value="Tipo1">Tipo1</option>
        <option className="text-green-900 bg-green-50" value="Tipo2">Tipo2</option>
      </select>
      <select
        name="EmpresaTransplante"
        onChange={handleChange}
        value={formData.EmpresaTransplante}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar empresa de servicio</option>
        <option className="text-green-900 bg-green-50" value="Empresa1">Empresa1</option>
        <option className="text-green-900 bg-green-50" value="Empresa2">Empresa2</option>
      </select>
      <input
        name="DefectosTransplante"
        placeholder="Defectos del transplante"
        onChange={handleChange}
        className="border p-2 w-full text-gray-800 placeholder-gray-600"
      />
      <input
        name="PorcentajeTransplante"
        type="number"
        placeholder="Porcentaje transplante"
        onChange={handleChange}
        className="border p-2 w-full text-gray-800 placeholder-gray-600"
        min={0}
        max={100}
      />
      <input
        name="AgentesTransmision"
        placeholder="Agentes de transmisión"
        onChange={handleChange}
        className="border p-2 w-full text-gray-800 placeholder-gray-600"
      />

      <h2 className="font-bold text-lg mt-4 text-green-700">Cosecha</h2>
      <input
        type="date"
        name="FechaCosecha"
        onChange={handleChange}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      />
      <select
        name="TemporadaCosecha"
        onChange={handleChange}
        value={formData.TemporadaCosecha}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar temporada</option>
        <option className="text-green-900 bg-green-50" value="2025">2025</option>
        <option className="text-green-900 bg-green-50" value="2026">2026</option>
      </select>
      <select
        name="TipoCosecha"
        onChange={handleChange}
        value={formData.TipoCosecha}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar tipo de cosecha</option>
        <option className="text-green-900 bg-green-50" value="Manual">Manual</option>
        <option className="text-green-900 bg-green-50" value="Mecanizada">Mecanizada</option>
      </select>
      <select
        name="EmpresaCosecha"
        onChange={handleChange}
        value={formData.EmpresaCosecha}
        className="border p-2 w-full text-green-900 bg-green-100 placeholder-green-700"
      >
        <option className="text-green-900 bg-green-50" value="">Seleccionar empresa de servicio</option>
        <option className="text-green-900 bg-green-50" value="Empresa1">Empresa1</option>
        <option className="text-green-900 bg-green-50" value="Empresa2">Empresa2</option>
      </select>
      <input
        name="CondicionantesCosecha"
        placeholder="Condicionantes de cosecha"
        onChange={handleChange}
        className="border p-2 w-full text-gray-800 placeholder-gray-600"
      />
      <input
        name="PorcentajeCosecha"
        type="number"
        placeholder="Porcentaje cosecha"
        onChange={handleChange}
        className="border p-2 w-full text-gray-800 placeholder-gray-600"
        min={0}
        max={100}
      />

      <h2 className="font-bold text-lg mt-4 text-green-700">Objetivo de Inspecciones</h2>
      <input
        name="ObjetivoInspecciones"
        type="number"
        placeholder="Cantidad objetivo de inspecciones"
        onChange={handleChange}
        className="border p-2 w-full text-gray-800 placeholder-gray-600"
        min={0}
      />

      <button
        type="submit"
        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded mt-4"
      >
        Guardar Finca
      </button>
    </form>
  );
}
