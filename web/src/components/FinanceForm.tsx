import { useState, useEffect } from "react";
import { useFinances, FinanceType } from "../hooks/useFinances";
import { fetchAPI } from "../lib/api";
import { motion } from "framer-motion";

export default function FinanceForm({ onSuccess }: { onSuccess: (leveledUp: boolean, budgetExceeded: boolean) => void }) {
    const { addFinance } = useFinances();
    const [categories, setCategories] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        amount: "",
        description: "",
        type: FinanceType.EXPENSE,
        category: "General",
        interestRate: "",
        startDate: "",
        endDate: "",
        currency: "COP",
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const budgets = await fetchAPI("/budgets");
                const names = budgets.map((b: any) => b.category);
                setCategories(names);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validar monto
        const amountNum = parseFloat(formData.amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            alert("Por favor ingrese un monto válido");
            setIsSubmitting(false);
            return;
        }

        const response = await addFinance({
            ...formData,
            amount: amountNum,
            interestRate: formData.interestRate ? parseFloat(formData.interestRate as string) : undefined,
        });

        if (response.success) {
            setFormData({
                amount: "",
                description: "",
                type: FinanceType.EXPENSE,
                category: "General",
                interestRate: "",
                startDate: "",
                endDate: "",
                currency: "COP",
            });
            onSuccess(response.leveledUp, response.budgetExceeded);
        } else {
            alert("Error al guardar");
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'var(--card-bg)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--card-border)',
            backdropFilter: 'var(--glass-effect)'
        }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Nuevo Registro</h3>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Tipo</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as FinanceType })}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--card-border)',
                            background: 'rgba(0,0,0,0.3)',
                            color: 'var(--foreground)'
                        }}
                    >
                        <option value={FinanceType.EXPENSE}>Gasto</option>
                        <option value={FinanceType.INCOME}>Ingreso</option>
                        <option value={FinanceType.INVESTMENT}>Inversión</option>
                    </select>
                </div>

                <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Monto</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--card-border)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'var(--foreground)'
                            }}
                        />
                    </div>
                    <div style={{ width: '80px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Divisa</label>
                        <select
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--card-border)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'var(--foreground)'
                            }}
                        >
                            <option value="COP">COP</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>
            </div>


            {formData.type === FinanceType.INVESTMENT && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}
                >
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Tasa Efectiva Anual (%)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.interestRate}
                            onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                            placeholder="Ej: 11.0"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--card-border)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'var(--foreground)'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Fecha Inicio</label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--card-border)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'var(--foreground)'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Fecha Vencimiento</label>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--card-border)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'var(--foreground)'
                            }}
                        />
                    </div>
                </motion.div>
            )
            }

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Categoría</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--card-border)',
                            background: 'rgba(0,0,0,0.3)',
                            color: 'var(--foreground)'
                        }}
                    >
                        <option value="General">General</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                        {formData.type === FinanceType.INVESTMENT && !categories.includes('Inversión') && (
                            <option value="Inversión">Inversión 📈</option>
                        )}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Descripción</label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Ej: Netflix, Almuerzo..."
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--card-border)',
                            background: 'rgba(0,0,0,0.3)',
                            color: 'var(--foreground)'
                        }}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ marginTop: '0.5rem', width: '100%' }}
            >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
        </form >
    );
}
