"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Finance, FinanceType } from '../hooks/useFinances';
import { TrendingUp, TrendingDown, Briefcase } from 'lucide-react';

interface ChartsProps {
    finances: Finance[];
}

export default function FinancialCharts({ finances }: ChartsProps) {
    // Data for Pie Chart (Expenses by Category + Investments)
    const categoryData: any = {};
    finances.forEach(f => {
        if (f.type === FinanceType.EXPENSE || f.type === FinanceType.INVESTMENT) {
            const label = f.type === FinanceType.INVESTMENT ? 'Inversiones' : (f.category || 'General');
            categoryData[label] = (categoryData[label] || 0) + Number(f.amount);
        }
    });

    const pieData = Object.keys(categoryData).map(key => ({
        name: key,
        value: categoryData[key]
    }));

    // Data for Bar Chart (Income vs Expense vs Investment)
    const totals = {
        Ingresos: 0,
        Gastos: 0,
        Inversiones: 0
    };

    finances.forEach(f => {
        if (f.type === FinanceType.INCOME) totals.Ingresos += Number(f.amount);
        if (f.type === FinanceType.EXPENSE) totals.Gastos += Number(f.amount);
        if (f.type === FinanceType.INVESTMENT) totals.Inversiones += Number(f.amount);
    });

    const barData = [
        { name: 'Ingresos', value: totals.Ingresos, color: '#10b981' },
        { name: 'Gastos', value: totals.Gastos, color: '#ef4444' },
        { name: 'Inversiones', value: totals.Inversiones, color: '#3b82f6' }
    ];

    const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

    // Investment summary
    const investments = finances.filter(f => f.type === FinanceType.INVESTMENT);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1.5rem',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)'
            }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={20} color="#3b82f6" /> Distribución de Gastos e Inversiones
                </h3>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1.5rem',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)'
            }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={20} color="#10b981" /> Resumen General
                </h3>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
                            <YAxis stroke="#a1a1aa" fontSize={12} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {investments.length > 0 && (
                <div style={{
                    gridColumn: '1 / -1',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
                    padding: '1.5rem',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Rendimiento de Inversiones</h3>
                    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        {investments.map((inv) => {
                            const rate = Number(inv.interestRate) || 0;
                            const gainAnual = Number(inv.amount) * (rate / 100);
                            return (
                                <div key={inv.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '0.9rem' }}>{inv.description}</div>
                                    <div style={{ fontSize: '1.25rem', margin: '0.5rem 0' }}>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(inv.amount))}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#a1a1aa' }}>
                                        <span>Tasa: {rate}% E.A.</span>
                                        <span style={{ color: '#10b981' }}>+ {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(gainAnual)} /año</span>
                                    </div>
                                    {inv.endDate && (
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#71717a' }}>
                                            Vence: {new Date(inv.endDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
