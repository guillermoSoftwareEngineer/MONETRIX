"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, MousePointer2, ShieldCheck, Info, RefreshCcw, ExternalLink, X, AlertTriangle } from "lucide-react";
import { Finance, FinanceType } from "../hooks/useFinances";

interface InvestmentAdvisoryProps {
    finances: Finance[];
}

export default function InvestmentAdvisory({ finances }: InvestmentAdvisoryProps) {
    const [cdtBanks, setCdtBanks] = useState([
        { name: "Banco Popular", rate: 11.20, term: "360 días", color: "#3b82f6", url: "https://www.bancopopular.com.co" },
        { name: "Pibank", rate: 10.50, term: "180 días", color: "#8b5cf6", url: "https://www.pibank.co" },
        { name: "Nu (Nubank)", rate: 11.10, term: "120 días", color: "#9333ea", url: "https://nu.com.co" },
        { name: "Lulo Bank", rate: 10.00, term: "90 días", color: "#bef264", url: "https://www.lulobank.com" },
        { name: "Banco Falabella", rate: 10.57, term: "360 días", color: "#65a30d", url: "https://www.bancofalabella.com.co" },
        { name: "Bancolombia", rate: 10.15, term: "360 días", color: "#fACC15", url: "https://www.bancolombia.com" },
        { name: "Davivienda", rate: 9.02, term: "90 días", color: "#ef4444", url: "https://www.davivienda.com" },
        { name: "Banco de Occidente", rate: 10.80, term: "360 días", color: "#3b82f6", url: "https://www.bancodeoccidente.com.co" },
    ]);

    const [platforms, setPlatforms] = useState([
        { name: "tyba", type: "FICs / CDTs", min: "$50.000", advantage: "Proceso 100% digital", color: "#ec4899", url: "https://www.tyba.com.co" },
        { name: "trii", type: "Acciones / ETFs", min: "Variable", advantage: "BVC en vivo", color: "#3b82f6", url: "https://www.trii.co" },
        { name: "Global66", type: "Cuenta Global", min: "$1 USD", advantage: "Tasas al 11% EA", color: "#22c55e", url: "https://www.global66.com" },
        { name: "Hapi", type: "Bolsa USA", min: "$1 USD", advantage: "Sin comisiones", color: "#10b981", url: "https://hapi.trade" },
        { name: "Bold", type: "CDT / Datáfonos", min: "$100.000", advantage: "Tasas del 11% EA", color: "#6366f1", url: "https://bold.co" },
        { name: "Folionet", type: "Bolsa USA", min: "$10 USD", advantage: "Bajo costo", color: "#06b6d4", url: "https://folionet.com" },
    ]);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [warningModal, setWarningModal] = useState<{ isOpen: boolean, url: string, name: string }>({
        isOpen: false,
        url: "",
        name: ""
    });

    const [personalAdvice, setPersonalAdvice] = useState("");

    const generateAdvice = () => {
        const totalInvested = finances
            .filter(f => f.type === FinanceType.INVESTMENT)
            .reduce((acc, f) => acc + Number(f.amount), 0);

        const totalIncome = finances
            .filter(f => f.type === FinanceType.INCOME)
            .reduce((acc, f) => acc + Number(f.amount), 0);

        const liquidCash = finances.reduce((acc, f) =>
            f.type === FinanceType.INCOME ? acc + Number(f.amount) : acc - Number(f.amount), 0);

        const advicePool = [
            "No pongas todos los huevos en la misma canasta. Diversifica entre ahorros líquidos y CDTs.",
            "¡El interés compuesto es la octava maravilla! Empieza hoy con lo que tengas.",
            "Recuerda: la inflación se come tus ahorros. Invertir es proteger tu futuro.",
            "Antes de invertir en riesgo, asegúrate de tener tu fondo de emergencia listo.",
            "Las tasas de los CDTs están bajando. ¡Aprovecha a capturar las tasas altas ahora!",
            "¡Eres el dueño de tu destino financiero! Sigue analizando estas opciones con Gastón."
        ];

        // Preference based advice
        if (totalInvested === 0 && liquidCash > 1000000) {
            setPersonalAdvice(`¡Tienes $${liquidCash.toLocaleString()} líquidos! ¿Por qué no pones una parte en un CDT? El dinero quieto pierde valor. 📉`);
        } else if (totalInvested > 0 && liquidCash > 5000000) {
            setPersonalAdvice("Veo que ya inviertes, pero tienes mucha liquidez. ¿Has pensado en diversificar en acciones con trii o tyba? 🚀");
        } else if (totalInvested > liquidCash) {
            setPersonalAdvice("¡Wao! Tienes más invertido que en efectivo. Eres un crack, pero no olvides tener algo para emergencias inmediatas. 🆘");
        } else {
            setPersonalAdvice(advicePool[Math.floor(Math.random() * advicePool.length)]);
        }
    };

    useEffect(() => {
        generateAdvice();
    }, [finances]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate a small variation in rates (+/- 0.05%)
        setTimeout(() => {
            setCdtBanks(prev => prev.map(bank => ({
                ...bank,
                rate: Number((bank.rate + (Math.random() * 0.1 - 0.05)).toFixed(2))
            })));
            generateAdvice(); // Refresh advice too
            setIsRefreshing(false);
        }, 800);
    };

    const openLink = (name: string, url: string) => {
        setWarningModal({ isOpen: true, name, url });
    };

    return (
        <section style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '2rem',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginTop: '2rem',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '60px', height: '60px', position: 'relative' }}>
                        <motion.video
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px' }}
                        >
                            <source src="/assets/monstruo-analitico.mp4" type="video/mp4" />
                        </motion.video>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Comparativa de Inversión</h3>
                        <p style={{ fontSize: '0.9rem', color: '#a1a1aa', margin: 0 }}>Basado en el mercado colombiano ({new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })})</p>
                    </div>
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '12px',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s',
                        fontSize: '0.9rem'
                    }}
                >
                    <RefreshCcw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                    {isRefreshing ? 'Actualizando...' : 'Actualizar Tasas'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {/* Tabla de CDTs */}
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', marginBottom: '1rem', fontSize: '1rem', position: 'sticky', top: 0, background: 'rgba(24, 24, 27, 0.95)', padding: '0.5rem 0', zIndex: 10 }}>
                        <Building2 size={20} /> CDTs Digitales
                    </h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '0.75rem 0.5rem', color: '#71717a' }}>Banco</th>
                                <th style={{ padding: '0.75rem 0.5rem', color: '#71717a' }}>Tasa (E.A.)</th>
                                <th style={{ padding: '0.75rem 0.5rem', color: '#71717a' }}>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cdtBanks.map((bank, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem 0.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: bank.color }} />
                                        {bank.name}
                                    </td>
                                    <td style={{ padding: '1rem 0.5rem', color: '#10b981', fontWeight: 'bold' }}>{bank.rate.toFixed(2)}%</td>
                                    <td style={{ padding: '1rem 0.5rem' }}>
                                        <button
                                            onClick={() => openLink(bank.name, bank.url)}
                                            style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                        >
                                            <ExternalLink size={14} /> Visitar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tabla de Plataformas */}
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '1rem', fontSize: '1rem', position: 'sticky', top: 0, background: 'rgba(24, 24, 27, 0.95)', padding: '0.5rem 0', zIndex: 10 }}>
                        <MousePointer2 size={20} /> Plataformas Fintech
                    </h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '0.75rem 0.5rem', color: '#71717a' }}>App</th>
                                <th style={{ padding: '0.75rem 0.5rem', color: '#71717a' }}>Mínimo</th>
                                <th style={{ padding: '0.75rem 0.5rem', color: '#71717a' }}>Visitar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {platforms.map((app, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem 0.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: app.color }} />
                                        {app.name}
                                    </td>
                                    <td style={{ padding: '1rem 0.5rem' }}>{app.min}</td>
                                    <td style={{ padding: '1rem 0.5rem' }}>
                                        <button
                                            onClick={() => openLink(app.name, app.url)}
                                            style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                        >
                                            <ExternalLink size={14} /> Ir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{
                marginTop: '2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
            }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.05)', padding: '1.25rem', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.9rem' }}>
                        <ShieldCheck size={18} /> Seguridad y Vigilancia
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                        Todos los bancos listados están vigilados por la <strong>SFC</strong> y protegidos por el seguro <strong>FOGAFIN</strong>. Tu capital está respaldado legalmente.
                    </p>
                </div>
                <div style={{ background: 'rgba(52, 211, 153, 0.05)', padding: '1.25rem', borderRadius: '20px', border: '1px solid rgba(52, 211, 153, 0.1)' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.9rem' }}>
                        <Info size={18} /> Consejo Personalizado de Gastón
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, fontStyle: 'italic' }}>
                        "{personalAdvice}"
                    </p>
                </div>
            </div>

            {/* Warning Modal */}
            <AnimatePresence>
                {warningModal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 2000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            style={{
                                background: '#18181b',
                                maxWidth: '450px',
                                width: '100%',
                                padding: '2rem',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                textAlign: 'center'
                            }}
                        >
                            <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ margin: '0 0 1rem 0' }}>Estás saliendo de Monedix</h3>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                                Te dirigirás al portal oficial de <strong>{warningModal.name}</strong>.
                                Ten en cuenta que Monedix no tiene ninguna relación ni responsabilidad sobre el contenido, seguridad o transacciones realizadas en sitios de terceros.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button
                                    onClick={() => setWarningModal({ ...warningModal, isOpen: false })}
                                    style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                                >
                                    Cancelar
                                </button>
                                <a
                                    href={warningModal.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setWarningModal({ ...warningModal, isOpen: false })}
                                    className="btn-primary"
                                    style={{ textDecoration: 'none', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    Entendido, Ir
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
