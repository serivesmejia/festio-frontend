"use client";
import { useEffect, useState } from "react";

export default function AdminPanel() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [concerts, setConcerts] = useState([]);
  const [artista, setArtista] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [fecha, setFecha] = useState("");
  const [precio, setPrecio] = useState("");
  const [error, setError] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function loadConcerts() {
    try {
      const res = await fetch(`${API}/admin/concerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("No autorizado");
      const data = await res.json();
      setConcerts(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function createConcert(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/admin/concerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ artista, ciudad, fecha, precio })
      });
      if (!res.ok) throw new Error("Error creando concierto");
      setArtista(""); setCiudad(""); setFecha(""); setPrecio("");
      loadConcerts();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (token) loadConcerts();
  }, [token]);

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <h1>Panel Admin</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={createConcert} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        <input placeholder="Artista" value={artista} onChange={e => setArtista(e.target.value)} />
        <input placeholder="Ciudad" value={ciudad} onChange={e => setCiudad(e.target.value)} />
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        <input type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} />
        <button type="submit">Crear Concierto</button>
      </form>

      {concerts.map(c => (
        <div key={c.id} style={{ background: "#1e293b", padding: "15px", marginBottom: "10px", borderRadius: "8px", color: "white" }}>
          <p>{c.artista} — {c.ciudad} — {c.fecha} — ${c.precio}</p>
        </div>
      ))}
    </div>
  );
}