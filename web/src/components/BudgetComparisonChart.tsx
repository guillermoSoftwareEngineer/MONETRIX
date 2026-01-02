"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { fetchAPI } from '../lib/api';
import { LayoutDashboard, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function BudgetComparisonChart() {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const comparison = await fetchAPI('/budgets/analytics/comparison');
                setData(comparison);
            } catch (error) {
                console.error('Error fetching budget comparison:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '2rem',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            textAlign: 'center',
            color: '#a1a1aa'
        }}>
            Cargando comparativa de presupuestos...
        </div>
    );

    if (data.length === 0) return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '2rem',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            marginTop: '2rem',
            textAlign: 'center'
        }}>
            <LayoutDashboard size={40} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>No hay presupuestos configurados</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Configura tus presupuestos mensuales para ver la comparativa en tiempo real.</p>
        </div>
    );

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '1.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            marginTop: '2rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <LayoutDashboard size={24} color="#a3e635" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Presupuesto vs. Gasto Real</h3>
            </div>

            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 50, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                        <XAxis type="number" stroke="#a1a1aa" fontSize={12} tickFormatter={(val) => `$${val / 1000}k`} />
                        <YAxis dataKey="category" type="category" stroke="#a1a1aa" fontSize={12} width={100} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                            contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                        />
                        <Legend />
                        <Bar dataKey="limit" name="Límite" fill="rgba(255,255,255,0.1)" radius={[0, 4, 4, 0]} barSize={20} />
                        <Bar dataKey="spent" name="Gastado" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.spent > entry.limit ? '#ef4444' : '#a3e635'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                {data.map((item, idx) => (
                    <div key={idx} style={{
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '16px',
                        border: `1px solid ${item.spent > item.limit ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`
                    }}>
                        <div style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{item.category}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontWeight: 'bold', color: item.spent > item.limit ? '#f87171' : '#fff' }}>
                                {item.percentage.toFixed(0)}% ocupado
                            </div>
                            {item.spent > item.limit ? <AlertCircle size={16} color="#f87171" /> : <CheckCircle2 size={16} color="#a3e635" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
