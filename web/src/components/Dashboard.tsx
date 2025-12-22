"use client";

import { useEffect } from "react";
import { useFinances, FinanceType } from "../hooks/useFinances";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Advisor from "./Advisor";
import InvestmentAdvisory from "./InvestmentAdvisory";
import FinancialCharts from "./FinancialCharts";
import ExpertInsights from "./ExpertInsights";
import FinanceForm from "./FinanceForm";
import TermsModal from "./TermsModal";
import AchievementUI from "./AchievementUI";
import BudgetManager from "./BudgetManager";
import BudgetAnalytics from "./BudgetAnalytics";
import { ChevronDown, History, X, PartyPopper, AlertTriangle, FileText, Download } from "lucide-react";
import { useState } from "react";

export default function Dashboard({ triggerRefresh }: { triggerRefresh: boolean }) {
    const { finances, loading, error, refresh, removeFinance } = useFinances();
    const { user, refreshProfile } = useAuth();
    const [showHistory, setShowHistory] = useState(false);
    const [levelUpData, setLevelUpData] = useState<{ show: boolean, level: number }>({ show: false, level: 1 });
    const [budgetAlert, setBudgetAlert] = useState<{ show: boolean, category: string }>({ show: false, category: "" });

    const deleteFinance = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este registro?')) {
            await removeFinance(id);
        }
    };

    const handleDownloadReport = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/reports/monthly`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al generar reporte');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte-monedix-${new Date().getMonth() + 1}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleSuccess = (leveledUp: boolean, budgetExceeded: boolean) => {
        refresh();
        refreshProfile();
        if (leveledUp) {
            setLevelUpData({ show: true, level: (user?.level || 0) + 1 });
        }
        if (budgetExceeded) {
            setBudgetAlert({ show: true, category: "Categoría" });
        }
    };

    useEffect(() => {
        if (triggerRefresh) {
            refresh();
        }
    }, [triggerRefresh, refresh]);

    // Persistent console disclaimers as requested
    useEffect(() => {
        const logDisclaimer = () => {
            console.log("%c MONEDIX SECURITY ", "background: #f87171; color: white; font-weight: bold; padding: 4px; border-radius: 4px;");
            console.log("%c[DATA]%c Los consejos están basados exclusivamente en la información ingresada por el usuario. Datos erróneos resultarán en consejos erróneos.", "color: #ef4444; font-weight: bold;", "color: inherit;");
            console.log("%c[LEGAL]%c Los datos del asesor deben ser verificados por el usuario con las entidades financieras. Los desarrolladores no asumen responsabilidad.", "color: #ef4444; font-weight: bold;", "color: inherit;");
        };
        logDisclaimer();
        // Log every 5 minutes to keep it "always" in view if they clear console
        const interval = setInterval(logDisclaimer, 300000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando finanzas...</div>;
    if (error) return <div style={{ color: 'var(--danger)', textAlign: 'center' }}>Error: {error}</div>;

    const totalBalance = finances.reduce((acc: number, curr: any) => {
        return curr.type === FinanceType.INCOME ? acc + Number(curr.amount) : acc - Number(curr.amount);
    }, 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
            {/* Background Video for Dashboard */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="video-bg"
                style={{ position: 'fixed', zIndex: -2, opacity: 0.15 }}
            >
                <source src="/assets/FondoDashboard.mp4" type="video/mp4" />
            </video>

            {/* Asesor Gráfico / Gamificación */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: '320px' }}>
                    <Advisor totalBalance={totalBalance} recentMovements={finances} />
                </div>
                {user && (
                    <AchievementUI level={user.level} xp={user.xp} medals={JSON.parse(user.medals || '[]')} />
                )}
            </div>

            {/* Resumen */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    background: 'linear-gradient(135deg, var(--secondary) 0%, rgba(0,0,0,0.8) 100%)',
                    padding: '2rem',
                    borderRadius: '16px',
                    border: '1px solid var(--card-border)',
                    textAlign: 'center'
                }}
            >
                <h2 style={{ fontSize: '1rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Balance Total</h2>
                <div style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: totalBalance >= 0 ? 'var(--success)' : 'var(--danger)',
                    margin: '0.5rem 0'
                }}>
                    ${totalBalance.toLocaleString()}
                </div>
            </motion.div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Gestión de Finanzas</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <BudgetManager />
                    <button
                        onClick={handleDownloadReport}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.25rem',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.4)',
                            borderRadius: '12px',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                    >
                        <Download size={18} />
                        Descargar Reporte PDF
                    </button>
                </div>
            </div>
            <FinanceForm onSuccess={handleSuccess} />

            {/* Modals de Gamificación / Alertas */}
            <AnimatePresence>
                {levelUpData.show && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1000,
                            padding: '2.5rem',
                            background: 'rgba(24, 24, 27, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '2px solid #fACC15',
                            borderRadius: '24px',
                            textAlign: 'center',
                            boxShadow: '0 0 50px rgba(250, 204, 21, 0.3)'
                        }}
                    >
                        <PartyPopper size={64} color="#fACC15" style={{ marginBottom: '1rem' }} />
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>¡Nivel Alcanzado!</h2>
                        <p style={{ fontSize: '1.25rem', color: '#fACC15', margin: '0.5rem 0' }}>Has subido al Nivel {levelUpData.level}</p>
                        <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>¡Gastón está impresionado con tu disciplina!</p>
                        <button
                            onClick={() => setLevelUpData({ ...levelUpData, show: false })}
                            style={{
                                background: '#fACC15',
                                color: '#000',
                                border: 'none',
                                padding: '0.75rem 2rem',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            ¡Excelente!
                        </button>
                    </motion.div>
                )}

                {budgetAlert.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        style={{
                            position: 'fixed',
                            bottom: '2rem',
                            right: '2rem',
                            zIndex: 1000,
                            padding: '1.5rem',
                            background: '#7f1d1d',
                            border: '1px solid #ef4444',
                            borderRadius: '16px',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                    >
                        <AlertTriangle size={32} />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>¡Presupuesto Excedido!</div>
                            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Has superado el límite en la categoría: {budgetAlert.category}</div>
                        </div>
                        <button
                            onClick={() => setBudgetAlert({ ...budgetAlert, show: false })}
                            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '1rem' }}
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lista Desplegable de Movimientos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 1.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '16px',
                        border: '1px solid var(--card-border)',
                        cursor: 'pointer',
                        width: '100%',
                        color: 'white',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <History size={20} color="var(--primary)" />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Movimientos Recientes</div>
                            <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
                                {showHistory ? 'Click para contraer el historial' : 'Haz click para desplegar tu historial de movimientos'}
                            </div>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: showHistory ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown size={20} color="#a1a1aa" />
                    </motion.div>
                </button>

                <motion.div
                    initial={false}
                    animate={{
                        height: showHistory ? 'auto' : 0,
                        opacity: showHistory ? 1 : 0,
                        marginTop: showHistory ? '0.5rem' : 0
                    }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {finances.length === 0 ? (
                        <p style={{ color: '#a1a1aa', textAlign: 'center', padding: '2rem' }}>No hay movimientos aún.</p>
                    ) : (
                        finances.map((finance: any, index: number) => (
                            <motion.div
                                key={finance.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: 'var(--card-bg)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--card-border)',
                                    backdropFilter: 'var(--glass-effect)'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{finance.description}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>{new Date(finance.date).toLocaleDateString()}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        fontWeight: 'bold',
                                        color: finance.type === FinanceType.INCOME ? 'var(--success)' : 'var(--foreground)'
                                    }}>
                                        {finance.type === FinanceType.INCOME ? '+' : '-'}${Number(finance.amount).toLocaleString()}
                                    </div>
                                    <button
                                        onClick={() => deleteFinance(finance.id)}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid var(--danger)',
                                            color: 'var(--danger)',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.8rem',
                                            padding: 0
                                        }}
                                        title="Eliminar registro"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </div>

            {/* Gráficos y Visualización */}
            <FinancialCharts finances={finances} />

            {/* Analítica de Presupuestos y Tendencias */}
            <BudgetAnalytics />

            {/* Análisis del Científico de Datos */}
            <ExpertInsights finances={finances} />

            {/* Recomendaciones Expertas */}
            <InvestmentAdvisory finances={finances} />

            {/* Persistent Legal Footer */}
            <footer style={{
                marginTop: '4rem',
                padding: '2rem 1rem',
                textAlign: 'center',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                color: '#71717a',
                fontSize: '0.8rem',
                lineHeight: 1.6
            }}>
                <p style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <strong>Aviso Permanente:</strong> Los consejos financieros de Monedix se generan automáticamente basados
                    exclusivamente en los datos ingresados por el usuario. Datos erróneos resultarán en consejos erróneos.
                    Toda recomendación debe ser verificada con la entidad financiera respectiva.
                    Al usar esta aplicación, aceptas que los desarrolladores no tienen responsabilidad alguna sobre decisiones financieras.
                </p>
                <div style={{ marginTop: '1rem', opacity: 0.5 }}>
                    © 2025 Monedix - Herramienta de Gamificación Financiera
                </div>
            </footer>

            <TermsModal />
        </div>
    );
}
