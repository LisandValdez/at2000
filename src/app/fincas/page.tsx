// app/fincas/page.tsx
import FincasList from "../components/FincasList";

export default function FincasPage() {
  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Fincas guardadas</h2>
      <FincasList />
    </div>
  );
}
