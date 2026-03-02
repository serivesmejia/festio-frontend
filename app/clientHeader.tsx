"use client";
import { useEffect, useState } from "react";

export default function ClientHeader() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setLoggedIn(true);
            try {
                // decodificamos el token solo para saber el role
                const payload = JSON.parse(atob(token.split(".")[1]));
                if (payload.role === "admin") setIsAdmin(true);
            } catch {
                setIsAdmin(false);
            }
        } else {
            setLoggedIn(false);
            setIsAdmin(false);
        }

        const checkToken = () => {
            const token = localStorage.getItem("token");
            if (token) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setLoggedIn(true);
                setIsAdmin(payload.role === "admin");
            } else {
                setLoggedIn(false);
                setIsAdmin(false);
            }
        };

        checkToken();
        window.addEventListener("login", checkToken);
        return () => window.removeEventListener("login", checkToken);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setLoggedIn(false);
        setIsAdmin(false);
        window.location.href = "/";
    };

    const linkStyle = {
        color: "white",
        textDecoration: "none",
        marginLeft: "15px",
        fontWeight: 500
    };

    const buttonStyle = {
        background: "none",
        border: "none",
        color: "white",
        cursor: "pointer",
        marginLeft: "15px",
        fontSize: "1em",
        padding: 0
    };

    return (
        <header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            background: "#020617"
        }}>
            <h2 style={{ margin: 0 }}>fest.io 🎵</h2>
            <nav style={{ display: "flex", alignItems: "center" }}>
                <a href="/" style={linkStyle}>Inicio</a>
                {loggedIn && <a href="/my-tickets" style={linkStyle}>Mis Boletos</a>}
                {loggedIn && isAdmin && <a href="/dashboard" style={linkStyle}>Admin Dashboard</a>}
                {!loggedIn && <a href="/login" style={linkStyle}>Login</a>}
                {loggedIn && <button onClick={handleLogout} style={buttonStyle}>Log Out</button>}
            </nav>
        </header>
    );
}