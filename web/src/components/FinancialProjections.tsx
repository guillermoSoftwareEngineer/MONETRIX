"use client";

import { useEffect, useState } from 'react';
import { fetchAPI } from '../lib/api';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, AlertCircle, CheckCircle2, ShieldCheck, Wallet } from 'lucide-react';

export default function FinancialProjections() {
    const [projections, setProjections] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjections = async () => {
            try {
                const data = await fetchAPI('/finances/analytics/projections');
                setProjections(data);
            } catch (error) {
                console.error("Error fetching projections:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjections();
    }, []);

    if (isLoading) return null;
    if (!projections) return null;

    const { savings, emergency, annual, annualEmergency } = projections;

    // Helper to format date nicely
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Pendiente calcular';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    };

    const GoalCard = ({ title, data, color }: { title: string, data: any, color: string }) => {
        const isOnTrack = data.monthlyAverage > 0;
        const reached = data.current >= data.goal;
        const progress = data.goal > 0 ? (data.current / data.goal) * 100 : 0;

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${reached ? '#10b981' : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: '16px',
                    padding: '1.25rem',
                    flex: 1,
                    minWidth: '280px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {reached && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: '#10b981',
                        color: 'black',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        padding: '0.2rem 0.8rem',
                        borderBottomLeftRadius: '12px'
                    }}>
                        ¡COMPLETADO!
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                        background: `${color}20`,
                        padding: '0.5rem',
                        borderRadius: '10px',
                        color: color
                    }}>
                        <TrendingUp size={20} />
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{title}</h4>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#a1a1aa' }}>Acumulado Total</span>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>${Number(data.current).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#a1a1aa' }}>Meta Total (Anual)</span>
                        <span style={{ color: color, fontWeight: 'bold' }}>${Number(data.goal).toLocaleString()}</span>
                    </div>

                    {/* Barra de Progreso */}
                    <div style={{
                        height: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginTop: '0.5rem'
                    }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            style={{
                                height: '100%',
                                background: reached ? '#10b981' : color,
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: reached ? '#10b981' : color, marginTop: '0.25rem' }}>
                        {progress.toFixed(1)}% Completado
                    </div>
                </div>

                {reached ? (
                    <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                        <p style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>¡Has alcanzado tu objetivo!</p>
                    </div>
                ) : isOnTrack ? (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#a1a1aa', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                            <Calendar size={14} />
                            Estimado: <span style={{ color: '#fff', fontWeight: 'bold' }}>{formatDate(data.projectedDate)}</span>
                            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>({data.monthsToGoal} meses)</span>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                        <p style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Ahorra más para proyectar fecha.</p>
                    </div>
                )}
            </motion.div>
        );
    };

    const AnnualCard = ({ data, color, titleOverride }: { data: any, color: string, titleOverride?: string }) => {
        if (!data) return null;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    flex: 1,
                    minWidth: '280px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                        background: `${color}20`,
                        padding: '0.5rem',
                        borderRadius: '10px',
                        color: color
                    }}>
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{titleOverride || `Visión Anual ${data.year}`}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Basado en meta mensual de ${data.monthlyGoal.toLocaleString()}</span>
                            <div title="YTD (Year-to-Date): Es la cantidad acumulada desde el 1 de Enero del año actual hasta hoy." style={{ cursor: 'help' }}>
                                <AlertCircle size={12} color="#71717a" />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#a1a1aa' }}>Acumulado YTD</span>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>${data.currentYTD.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#a1a1aa' }}>Meta Anual</span>
                        <span style={{ color: color, fontWeight: 'bold' }}>${data.annualGoal.toLocaleString()}</span>
                    </div>

                    {/* Barra de Progreso Anual */}
                    <div style={{
                        height: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginTop: '0.5rem'
                    }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(data.progress, 100)}%` }}
                            style={{
                                height: '100%',
                                background: color,
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: color, marginTop: '0.25rem' }}>
                        {data.progress.toFixed(1)}% Completado
                    </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#71717a', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                    Proyección cierre año: <span style={{ color: '#fff' }}>${Number(data.projectedEndYear).toLocaleString()}</span>
                </div>
            </motion.div>
        );
    };

    return (
        <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Sección Ahorros */}
            <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa' }}>
                    <Wallet size={20} />
                    Fondo de Ahorro
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <AnnualCard data={annual} color="#8b5cf6" titleOverride={`Visión Anual Ahorro ${annual?.year}`} />
                    <GoalCard title="Tiempo para Meta Total" data={savings} color="#3b82f6" />
                </div>
            </div>

            {/* Sección Emergencia */}
            <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399' }}>
                    <ShieldCheck size={20} />
                    Fondo de Emergencia
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <AnnualCard data={annualEmergency} color="#10b981" titleOverride={`Visión Anual Emergencia ${annual?.year}`} />
                    <GoalCard title="Tiempo para Fondo Completo" data={emergency} color="#10b981" />
                </div>
            </div>
        </div>
    );
}
