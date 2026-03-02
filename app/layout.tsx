// app/layout.tsx  -> Server Component
export const metadata = {
  title: "fest.io",
};

import ClientHeader from "./clientHeader"; // importamos el header que es client component

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{
        margin: 0,
        fontFamily: "Arial",
        background: "#0f172a",
        color: "white"
      }}>
        <ClientHeader /> {/* el header que necesita useState/useEffect */}
        <main style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}