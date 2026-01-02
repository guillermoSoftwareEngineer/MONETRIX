import { useState, useEffect } from "react";
import { useFinances, FinanceType } from "../hooks/useFinances";
import { fetchAPI } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

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

        const amountNum = parseFloat(formData.amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            alert("Por favor ingrese un monto válido");
            setIsSubmitting(false);
            return;
        }

        const submissionData: any = {
            amount: amountNum,
            description: formData.description,
            type: formData.type,
            category: formData.category,
            currency: formData.currency,
        };

        if (formData.interestRate) submissionData.interestRate = parseFloat(formData.interestRate as string);
        if (formData.startDate) submissionData.startDate = new Date(formData.startDate);
        if (formData.endDate) submissionData.endDate = new Date(formData.endDate);

        const response = await addFinance(submissionData);

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
            gap: '1.25rem',
            background: 'var(--card-bg)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid var(--card-border)',
            backdropFilter: 'var(--glass-effect)',
            maxWidth: '1000px',
            margin: '0 auto',
            width: '100%'
        }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                Nuevo Registro
            </h3>

            {/* Row 1: Tipo, Monto y Divisa */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Tipo</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as FinanceType })}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '1px solid var(--card-border)',
                            background: 'rgba(0,0,0,0.4)',
                            color: 'var(--foreground)',
                            outline: 'none'
                        }}
                    >
                        <option value={FinanceType.EXPENSE}>Gasto</option>
                        <option value={FinanceType.INCOME}>Ingreso</option>
                        <option value={FinanceType.INVESTMENT}>Inversión</option>
                    </select>
                </div>

                <div style={{ flex: '2 1 300px', display: 'flex', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Monto</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={formData.amount}
                            onChange={(e) => {
                                const val = e.target.value.replace(',', '.');
                                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                    setFormData({ ...formData, amount: val });
                                }
                            }}
                            placeholder="0.00"
                            autoComplete="off"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '10px',
                                border: '1px solid var(--card-border)',
                                background: 'rgba(0,0,0,0.4)',
                                color: 'var(--foreground)',
                                outline: 'none',
                                transition: 'all 0.2s',
                                fontSize: '1.1rem',
                                fontWeight: '500'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                        />
                    </div>
                    <div style={{ width: '90px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Divisa</label>
                        <select
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '10px',
                                border: '1px solid var(--card-border)',
                                background: 'rgba(0,0,0,0.4)',
                                color: 'var(--foreground)',
                                outline: 'none'
                            }}
                        >
                            <option value="COP">COP</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Inversion Section (Conditional) */}
            <AnimatePresence>
                {formData.type === FinanceType.INVESTMENT && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', padding: '1.25rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '12px', border: '1px dashed rgba(212, 175, 55, 0.3)' }}
                    >
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Tasa Efectiva Anual (%)</label>
                            <input
                                type="text"
                                inputMode="decimal"
                                value={formData.interestRate}
                                onChange={(e) => {
                                    const val = e.target.value.replace(',', '.');
                                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                        setFormData({ ...formData, interestRate: val });
                                    }
                                }}
                                placeholder="Ej: 11.0"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--card-border)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: 'var(--foreground)',
                                    outline: 'none'
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
                                    colorScheme: 'dark'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Vencimiento</label>
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
                                    colorScheme: 'dark'
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Row 2: Categoría y Descripción */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Categoría</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '1px solid var(--card-border)',
                            background: 'rgba(0,0,0,0.4)',
                            color: 'var(--foreground)',
                            outline: 'none'
                        }}
                    >
                        <option value="General">General</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: 2, minWidth: '250px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Descripción</label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Ej: Netflix, Cena familiar..."
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '1px solid var(--card-border)',
                            background: 'rgba(0,0,0,0.4)',
                            color: 'var(--foreground)',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                    marginTop: '0.5rem',
                    padding: '1rem',
                    fontSize: '1.1rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                }}
            >
                {isSubmitting ? 'Procesando...' : 'Guardar Registro'}
            </button>
        </form>
    );
}
