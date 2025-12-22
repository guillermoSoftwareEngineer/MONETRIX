"use client";

import { motion } from "framer-motion";
import { Brain, Lightbulb, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Finance, FinanceType } from "../hooks/useFinances";

interface ExpertInsightsProps {
    finances: Finance[];
}

export default function ExpertInsights({ finances }: ExpertInsightsProps) {
    const analyzeData = () => {
        const insights = [];
        const totalIncome = finances
            .filter(f => f.type === FinanceType.INCOME)
            .reduce((acc, f) => acc + Number(f.amount), 0);
        const totalExpenses = finances
            .filter(f => f.type === FinanceType.EXPENSE)
            .reduce((acc, f) => acc + Number(f.amount), 0);
        const totalInvestments = finances
            .filter(f => f.type === FinanceType.INVESTMENT)
            .reduce((acc, f) => acc + Number(f.amount), 0);

        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

        // Insight 1: Savings Rate
        if (savingsRate < 10 && totalIncome > 0) {
            insights.push({
                title: "Optimización de Ahorro",
                description: "Tu tasa de ahorro es baja (menos del 10%). El análisis de datos sugiere revisar tus 'gastos hormiga' para liberar capital.",
                type: "warning",
                icon: <AlertCircle size={20} color="#f87171" />,
                bg: "rgba(248, 113, 113, 0.05)"
            });
        } else if (savingsRate >= 20) {
            insights.push({
                title: "Excelente Salud Financiera",
                description: "Estás ahorrando más del 20% de tus ingresos. ¡Eres un maestro de los datos financieros!",
                type: "success",
                icon: <CheckCircle2 size={20} color="#10b981" />,
                bg: "rgba(16, 185, 129, 0.05)"
            });
        }

        // Insight 2: Investment Diversification
        if (totalInvestments === 0 && totalIncome > 0) {
            insights.push({
                title: "Capital Ocioso Detectado",
                description: "No tienes inversiones registradas. Según las tasas actuales, estás perdiendo un rendimiento aproximado del 11% E.A. por inflación.",
                type: "info",
                icon: <Lightbulb size={20} color="#3b82f6" />,
                bg: "rgba(59, 130, 246, 0.05)"
            });
        }

        // Insight 3: Category Analysis
        const expenseByCategory: any = {};
        finances.filter(f => f.type === FinanceType.EXPENSE).forEach(f => {
            expenseByCategory[f.category || 'General'] = (expenseByCategory[f.category || 'General'] || 0) + Number(f.amount);
        });

        const topCategory = Object.keys(expenseByCategory).reduce((a, b) => expenseByCategory[a] > expenseByCategory[b] ? a : b, "");
        if (topCategory && expenseByCategory[topCategory] > totalIncome * 0.4) {
            insights.push({
                title: `Alerta en ${topCategory}`,
                description: `Tus gastos en '${topCategory}' representan más del 40% de tus ingresos. El modelo sugiere diversificar tus gastos o buscar alternativas más económicas.`,
                type: "warning",
                icon: <Brain size={20} color="#f59e0b" />,
                bg: "rgba(245, 158, 11, 0.05)"
            });
        }

        // Insight 4: Investment Opportunity
        if (totalIncome - totalExpenses > 500000 && totalInvestments < (totalIncome * 0.2)) {
            insights.push({
                title: "Oportunidad de Inversión",
                description: "Tienes un excedente de liquidez. El Data Scientist recomienda mover al menos $200,000 COP a un CDT para maximizar el interés compuesto.",
                type: "pro",
                icon: <Sparkles size={20} color="#a855f7" />,
                bg: "rgba(168, 85, 247, 0.05)"
            });
        }

        return insights;
    };

    const insights = analyzeData();

    if (insights.length === 0) return null;

    return (
        <section style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Brain size={24} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Análisis del Científico de Datos</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {insights.map((insight, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            background: insight.bg,
                            padding: '1.5rem',
                            borderRadius: '20px',
                            border: `1px solid rgba(255, 255, 255, 0.05)`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {insight.icon}
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>{insight.title}</h4>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                            {insight.description}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div style={{
                marginTop: '1.5rem',
                padding: '1.25rem',
                background: 'rgba(113, 113, 122, 0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(113, 113, 122, 0.1)',
                fontSize: '0.75rem',
                color: '#71717a',
                lineHeight: 1.5
            }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={14} />
                    <strong>Aviso de Responsabilidad y Calidad de Datos</strong>
                </div>
                <p style={{ margin: 0 }}>
                    Este análisis es <strong>automático y basado exclusivamente</strong> en la información que tú ingresas. Si los datos ingresados son erróneos, los resultados y consejos serán erróneos (GIGO).
                    Los resultados son ilustrativos y <strong>deben ser verificados directamente con las entidades financieras</strong> correspondientes antes de tomar cualquier decisión.
                    Los desarrolladores de Monedix no asumen ninguna responsabilidad por decisiones financieras tomadas basadas en estos modelos.
                </p>
            </div>
        </section>
    );
}
