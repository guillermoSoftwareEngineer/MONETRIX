"use client";

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchAPI } from '../lib/api';
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function BudgetAnalytics() {
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await fetchAPI('/finances/analytics/history');
                setHistoryData(data);
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Simple variation calculation for the last month
    const getVariation = () => {
        if (historyData.length < 2) return null;
        const current = historyData[historyData.length - 1];
        const previous = historyData[historyData.length - 2];

        // Sum all categories for the period
        const currentTotal = Object.keys(current).reduce((acc, key) => key === 'name' ? acc : acc + current[key], 0);
        const previousTotal = Object.keys(previous).reduce((acc, key) => key === 'name' ? acc : acc + previous[key], 0);

        if (previousTotal === 0) return 0;
        return ((currentTotal - previousTotal) / previousTotal) * 100;
    };

    const variation = getVariation();
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

    if (isLoading) return <div style={{ color: '#a1a1aa', textAlign: 'center', padding: '2rem' }}>Cargando analítica...</div>;

    return (
        <div style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <TrendingUp size={24} color="#3b82f6" /> Analítica de Gastos
                </h2>
                {variation !== null && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: variation > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: variation > 0 ? '#ef4444' : '#10b981'
                    }}>
                        {variation > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        {variation > 0 ? 'Aumento' : 'Reducción'} del {Math.abs(variation).toFixed(1)}% vs mes anterior
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {/* Monthly Trend per Category */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '1.5rem',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Tendencia Mensual por Concepto</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
                                <YAxis stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => `$${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                {historyData.length > 0 && Object.keys(historyData[0]).filter(k => k !== 'name').map((cat, idx) => (
                                    <Line
                                        key={cat}
                                        type="monotone"
                                        dataKey={cat}
                                        stroke={COLORS[idx % COLORS.length]}
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Comparative View */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '1.5rem',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Comparativa de Gastos Recientes</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={historyData.slice(-3)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
                                <YAxis stroke="#a1a1aa" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey={(data) => Object.keys(data).reduce((acc, k) => k === 'name' ? acc : acc + data[k], 0)} radius={[8, 8, 0, 0]} fill="#3b82f6" name="Gasto Total" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
