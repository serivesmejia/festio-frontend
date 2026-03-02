"use client";
import { useEffect, useState } from "react";

interface Concert {
  id: number;
  artista: string;
  ciudad: string;
  fecha: string;
  precio: number;
}

export default function Home() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  async function loadConcerts(p = 1) {
    try {
      setError(null);
      const res = await fetch(`${API}/concerts?page=${p}&limit=5`);
      const data = await res.json();
      
      // fallback por si la API no devuelve data
      setConcerts(data.data || []);
      setPage(data.page || 1);
    } catch (err) {
      console.error(err);
      setError("Error cargando conciertos");
      setConcerts([]);
    }
  }

  async function buyTickets(concertId: number) {
    const qty = quantities[concertId];
    if (!qty || qty <= 0) return alert("Ingresa cantidad válida");

    const token = localStorage.getItem("token");
    if (!token) return alert("Debes estar logueado para comprar boletos");

    try {
      const res = await fetch(`${API}/tickets/buy`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ concertId, quantity: Number(qty) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Boletos comprados 🎉");
      loadConcerts(page);

    } catch (err: any) {
      alert(err.message || "Error al comprar boletos");
    }
  }

  useEffect(() => {
    loadConcerts();
  }, []);

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <h1>Conciertos</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {(concerts || []).map(c => (
        <div key={c.id} style={{
          background: "#1e293b",
          padding: "20px",
          marginBottom: "15px",
          borderRadius: "10px",
          color: "white"
        }}>
          <h3>{c.artista}</h3>
          <p>{c.fecha} — {c.ciudad}</p>
          <p>${c.precio}</p>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <input 
              type="number"
              min="1"
              placeholder="Cantidad"
              value={quantities[c.id] || ""}
              onChange={e => setQuantities({ ...quantities, [c.id]: Number(e.target.value) })}
              style={{ width: "80px", borderRadius: "6px", padding: "5px" }}
            />
            <button onClick={() => buyTickets(c.id)}>Comprar</button>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button onClick={() => loadConcerts(page - 1)} disabled={page <= 1}>
          Anterior
        </button>
        <button onClick={() => loadConcerts(page + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
}