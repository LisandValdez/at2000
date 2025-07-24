// app/layout.tsx o app/layout.jsx

import './globals.css'; // tu CSS global si lo tenés

export const metadata = {
  title: 'Gestión de Fincas',
  description: 'Visualización y administración de fincas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ height: "100vh", margin: 0 }}>
        <header style={{ padding: '1rem', background: '#222', color: 'white' }}>
          <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1><a href="/" style={{ color: 'white', textDecoration: 'none' }}>🌿 Mi App de Fincas</a></h1>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem' }}>
              <li><a href="/fincas" style={{ color: 'white', textDecoration: 'none' }}>Ver fincas guardadas</a></li>
            </ul>
          </nav>
        </header>
        <main style={{ height: "calc(100vh - 64px)", margin: 0 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
