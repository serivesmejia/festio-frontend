"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("login"));
      router.push("/");

    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}