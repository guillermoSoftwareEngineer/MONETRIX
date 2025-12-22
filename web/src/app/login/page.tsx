"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            // Redirect handled in context
        } catch (err: any) {
            setError("Credenciales inválidas. Intenta de nuevo.");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    background: "var(--card-bg)",
                    padding: "2rem",
                    borderRadius: "16px",
                    border: "1px solid var(--card-border)",
                    textAlign: "center"
                }}
            >
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Bienvenido</h1>
                <p style={{ color: "#a1a1aa", marginBottom: "2rem" }}>Inicia sesión para continuar</p>

                {error && <div style={{ color: "var(--danger)", marginBottom: "1rem" }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                            style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)", color: "white" }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                            style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)", color: "white" }}
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: "1rem", width: "100%" }}>
                        Ingresar
                    </button>
                </form>

                <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "#a1a1aa" }}>
                    ¿No tienes cuenta? <Link href="/register" style={{ color: "var(--primary)", fontWeight: "bold" }}>Regístrate gratis</Link>
                </p>
            </motion.div>
        </div>
    );
}
