"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckSquare } from "lucide-react";

export default function TermsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        const hasAccepted = localStorage.getItem("monedix_terms_accepted");
        if (!hasAccepted) {
            setIsOpen(true);
        }

        // Log compliance messages to developer console as requested
        console.log("%c MONEDIX LEGAL COMPLIANCE ", "background: #3b82f6; color: white; font-weight: bold; padding: 4px; border-radius: 4px;");
        console.log("%c[ADVERTENCIA]%c Los consejos están basados exclusivamente en la información ingresada por el usuario. Datos erróneos resultarán en consejos erróneos.", "color: #ef4444; font-weight: bold;", "color: inherit;");
        console.log("%c[RESPONSABILIDAD]%c Los datos deben ser verificados por el usuario con las entidades financieras. Los desarrolladores no asumen responsabilidad por decisiones financieras.", "color: #ef4444; font-weight: bold;", "color: inherit;");
    }, []);

    const handleAccept = () => {
        if (accepted) {
            localStorage.setItem("monedix_terms_accepted", "true");
            setIsOpen(false);
        } else {
            alert("Por favor, marca la casilla para aceptar los términos.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        style={{
                            background: '#18181b',
                            maxWidth: '500px',
                            width: '100%',
                            padding: '2rem',
                            borderRadius: '24px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                <ShieldAlert size={32} color="#3b82f6" />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Acuerdo de Responsabilidad</h2>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginTop: '0.5rem' }}>Antes de comenzar a usar Monedix</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <p style={{ fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                                    ✅ <strong>Calidad de Datos:</strong> Los consejos dados están basados exclusivamente en la información que ingresas. Si ingresas información errónea, obtendrás resultados y consejos erróneos.
                                </p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <p style={{ fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                                    ✅ <strong>Verificación:</strong> Los datos del asesor deben ser verificados por el usuario con las respectivas entidades financieras.
                                </p>
                            </div>
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <p style={{ fontSize: '0.85rem', lineHeight: 1.5, margin: 0, color: '#f87171' }}>
                                    ⚠️ <strong>No Responsabilidad:</strong> Nosotros como desarrolladores de la app no tenemos responsabilidad sobre decisiones financieras o pérdidas derivadas del uso de la herramienta.
                                </p>
                            </div>
                        </div>

                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            marginBottom: '2rem',
                            userSelect: 'none'
                        }}>
                            <input
                                type="checkbox"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    accentColor: '#3b82f6'
                                }}
                            />
                            Comprendo y acepto los términos de responsabilidad.
                        </label>

                        <button
                            onClick={handleAccept}
                            disabled={!accepted}
                            className="btn-primary"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                opacity: accepted ? 1 : 0.5,
                                cursor: accepted ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Comenzar ahora
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
