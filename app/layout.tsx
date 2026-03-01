export const metadata = {
  title: "fest.io",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{
        margin: 0,
        fontFamily: "Arial",
        background: "#0f172a",
        color: "white"
      }}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          background: "#020617"
        }}>
          <h2>fest.io 🎵</h2>
          <nav style={{ display: "flex", gap: "15px" }}>
            <a href="/" style={{ color: "white" }}>Inicio</a>
            <a href="/login" style={{ color: "white" }}>Login</a>
            <a href="/dashboard" style={{ color: "white" }}>Dashboard</a>
          </nav>
        </header>

        <main style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}