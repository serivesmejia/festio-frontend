"use client";
import { useEffect, useState } from "react";

export default function MyTickets() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);

  async function loadTickets() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/tickets/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error cargando boletos");
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Mis Boletos</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {tickets.map(t => (
        <div key={t.id} style={{
          background: "#334155",
          color: "white",
          padding: "15px",
          marginBottom: "10px",
          borderRadius: "8px"
        }}>
          <p>{t.artista} — {t.ciudad}</p>
          <p>Fecha: {t.fecha}</p>
          <p>Cantidad: {t.quantity}</p>
        </div>
      ))}
    </div>
  );
}