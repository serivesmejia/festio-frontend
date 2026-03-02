"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Concert {
  id: number;
  artista: string;
  ciudad: string;
  fecha: string;
  precio: number;
}

interface Ticket {
  id: number;
  artista: string;
  user_id: number;
  quantity: number;
}

interface DashboardData {
  concerts: Concert[];
  tickets: Ticket[];
}

interface ConcertForm {
  artista: string;
  ciudad: string;
  fecha: string;
  precio: string;
}

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export default function Dashboard() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [data, setData] = useState<DashboardData>({
    concerts: [],
    tickets: [],
  });

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ConcertForm>({
    artista: "",
    ciudad: "",
    fecha: "",
    precio: "",
  });

  const [editId, setEditId] = useState<number | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchData = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API}/admin/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        router.push("/login");
        return;
      }

      const json: DashboardData = await res.json();
      setData(json);
      setLoading(false);
    } catch (err) {
      console.error(getErrorMessage(err));
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const url = editId
        ? `${API}/admin/concerts/${editId}`
        : `${API}/admin/concerts`;

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error en la operación");

      setForm({ artista: "", ciudad: "", fecha: "", precio: "" });
      setEditId(null);
      setShowModal(false);

      fetchData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleEdit = (concert: Concert) => {
    setForm({
      artista: concert.artista,
      ciudad: concert.ciudad,
      fecha: concert.fecha.slice(0, 10),
      precio: String(concert.precio),
    });

    setEditId(concert.id);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro quieres eliminar este concierto?")) return;

    try {
      const res = await fetch(`${API}/admin/concerts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error eliminando");

      fetchData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Admin</h1>

      <button
        onClick={() => {
          setForm({ artista: "", ciudad: "", fecha: "", precio: "" });
          setEditId(null);
          setShowModal(true);
        }}
        style={{ margin: "20px 0", padding: "10px 20px", cursor: "pointer" }}
      >
        Crear Concierto
      </button>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "10px",
              minWidth: "300px",
              color: "#fff",
            }}
          >
            <h2>{editId ? "Editar Concierto" : "Crear Concierto"}</h2>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Artista"
                value={form.artista}
                onChange={(e) =>
                  setForm({ ...form, artista: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Ciudad"
                value={form.ciudad}
                onChange={(e) =>
                  setForm({ ...form, ciudad: e.target.value })
                }
                required
              />
              <input
                type="date"
                value={form.fecha}
                onChange={(e) =>
                  setForm({ ...form, fecha: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Precio"
                value={form.precio}
                onChange={(e) =>
                  setForm({ ...form, precio: e.target.value })
                }
                required
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button type="submit" style={{ padding: "5px 15px" }}>
                  {editId ? "Guardar" : "Crear"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                    setForm({
                      artista: "",
                      ciudad: "",
                      fecha: "",
                      precio: "",
                    });
                  }}
                  style={{ padding: "5px 15px" }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section>
        <h2>Conciertos</h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {data.concerts.map((concert) => (
            <div
              key={concert.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                width: "250px",
              }}
            >
              <h3>{concert.artista}</h3>
              <p>Ciudad: {concert.ciudad}</p>
              <p>
                Fecha:{" "}
                {new Date(concert.fecha).toLocaleDateString()}
              </p>
              <p>Precio: ${concert.precio}</p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <button
                  onClick={() => handleEdit(concert)}
                  style={{ flex: 1 }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(concert.id)}
                  style={{ flex: 1 }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>Boletos vendidos</h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {data.tickets.map((ticket) => (
            <div
              key={ticket.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                width: "250px",
                background: "rgba(0,0,0,0.1)",
              }}
            >
              <p>Concierto: {ticket.artista}</p>
              <p>Usuario ID: {ticket.user_id}</p>
              <p>Cantidad: {ticket.quantity}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}