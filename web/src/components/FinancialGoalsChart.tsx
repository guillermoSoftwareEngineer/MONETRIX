"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { fetchAPI } from '../lib/api';
import { Settings as SettingsIcon, Target, ShieldCheck, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinancialGoalsChart() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({ savingsGoal: 0, emergencyFundGoal: 0 });

    const fetchData = async () => {
        try {
            const goals = await fetchAPI('/finances/analytics/goals');
            setData(goals);
            setEditValues({
                savingsGoal: goals.savings.goal,
                emergencyFundGoal: goals.emergencyFund.goal
            });
        } catch (error) {
            console.error('Error fetching goals analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveGoals = async () => {
        try {
            await fetchAPI('/users/settings', {
                method: 'PATCH',
                body: JSON.stringify({
                    savingsGoal: editValues.savingsGoal,
                    emergencyFundGoal: editValues.emergencyFundGoal
                })
            });
            setIsEditing(false);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error saving goals:', error);
        }
    };

    if (isLoading) return <div style={{ color: '#a1a1aa', textAlign: 'center', padding: '1rem' }}>Cargando metas financieras...</div>;
    if (!data) return null;

    const chartData = [
        {
            name: 'Ahorro Programado',
            meta: data.savings.goal,
            real: data.savings.actual,
            esteMes: data.savings.thisMonth,
            color: '#3b82f6'
        },
        {
            name: 'Fondo de Emergencia',
            meta: data.emergencyFund.goal,
            real: data.emergencyFund.actual,
            esteMes: data.emergencyFund.thisMonth,
            color: '#10b981'
        }
    ];

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '1.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            marginTop: '2rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Target size={24} color="#fACC15" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Progreso de Metas Financieras</h3>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    style={{
                        fontSize: '0.8rem',
                        color: '#a1a1aa',
                        background: 'rgba(255,255,255,0.05)',
                        padding: '0.5rem',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: '0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                    <SettingsIcon size={16} />
                    Configurar
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Gráfica Comparativa */}
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 30 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={11} width={120} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                                formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, '']}
                            />
                            <Bar dataKey="real" name="Real Acumulado" radius={[0, 4, 4, 0]} barSize={25}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                            <Bar dataKey="meta" name="Meta Final" fill="rgba(255,255,255,0.05)" radius={[0, 4, 4, 0]} barSize={25} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Tarjetas de Detalle */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {chartData.map((item, idx) => {
                        const percent = item.meta > 0 ? (item.real / item.meta) * 100 : 0;
                        return (
                            <div key={idx} style={{
                                padding: '1.25rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{item.name}</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: item.color }}>
                                            ${item.real.toLocaleString()}
                                            <span style={{ fontSize: '0.9rem', color: '#71717a', fontWeight: 'normal', marginLeft: '0.5rem' }}>
                                                / ${item.meta.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '8px',
                                        background: `${item.color}20`,
                                        color: item.color,
                                        fontSize: '0.8rem',
                                        fontWeight: '700'
                                    }}>
                                        {percent.toFixed(1)}%
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4ade80' }}>
                                    <TrendingUp size={14} />
                                    <span>+${item.esteMes.toLocaleString()} este mes</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.05)',
                borderRadius: '12px',
                border: '1px dashed rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
            }}>
                <ShieldCheck size={20} color="#3b82f6" />
                <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: 0 }}>
                    <strong>Nota de Salud:</strong> Gastón ha detectado que tus aportes de este mes representan el
                    <span style={{ color: '#fff' }}> {(((data.savings.thisMonth + data.emergencyFund.thisMonth) / (data.savings.goal || 1)) * 100).toFixed(1)}% </span>
                    de tu meta mensual sugerida.
                </p>
            </div>

            <AnimatePresence>
                {isEditing && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{
                                background: '#18181b',
                                width: '100%',
                                maxWidth: '400px',
                                padding: '2rem',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <SettingsIcon size={22} color="#fACC15" />
                                Configurar Metas
                            </h3>

                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Meta de Ahorro</label>
                                    <input
                                        type="number"
                                        value={editValues.savingsGoal}
                                        onChange={(e) => setEditValues({ ...editValues, savingsGoal: Number(e.target.value) })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Meta Fondo de Emergencia</label>
                                    <input
                                        type="number"
                                        value={editValues.emergencyFundGoal}
                                        onChange={(e) => setEditValues({ ...editValues, emergencyFundGoal: Number(e.target.value) })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveGoals}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: '#3b82f6', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    Guardar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
