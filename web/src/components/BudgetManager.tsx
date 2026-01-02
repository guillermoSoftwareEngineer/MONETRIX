"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Save, X, Plus, Trash2 } from "lucide-react";

interface Budget {
    id?: string;
    category: string;
    limit: number;
}

export default function BudgetManager() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchBudgets();
        }
    }, [isOpen]);

    const fetchBudgets = async () => {
        try {
            const data = await fetchAPI("/budgets");
            setBudgets(data);
        } catch (error) {
            console.error("Error fetching budgets:", error);
        }
    };

    const handleSave = async (category: string, limit: number, id?: string) => {
        if (!category.trim()) return;
        setIsLoading(true);
        try {
            await fetchAPI("/budgets", {
                method: "POST",
                body: JSON.stringify({ category, limit, id }),
            });
            await fetchBudgets();
        } catch (error) {
            alert("Error al guardar presupuesto");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsLoading(true);
        try {
            await fetchAPI(`/budgets/${id}`, { method: "DELETE" });
            await fetchBudgets();
            setDeleteConfirmId(null);
        } catch (error) {
            alert("Error al eliminar");
        } finally {
            setIsLoading(false);
        }
    };

    const addBudget = () => {
        const newBudget: Budget = { category: "Nuevo Concepto", limit: 0 };
        setBudgets([...budgets, newBudget]);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.25rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '12px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                }}
            >
                <Target size={18} color="#3b82f6" />
                Configurar Presupuestos
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.8)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '24px',
                                width: '100%',
                                maxWidth: '500px',
                                padding: '2rem',
                                position: 'relative'
                            }}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>

                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                <Target size={28} color="#3b82f6" /> Presupuestos Mensuales
                            </h2>
                            <p style={{ color: '#a1a1aa', fontSize: '0.875rem', marginBottom: '2rem' }}>Establece límites para que Gastón te ayude a no gastar de más.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {budgets.length > 0 ? budgets.map((budget, index) => (
                                    <div key={budget.id || index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <input
                                            type="text"
                                            defaultValue={budget.category}
                                            placeholder="Nombre del concepto"
                                            onBlur={(e) => handleSave(e.target.value, budget.limit, budget.id)}
                                            style={{
                                                flex: 1,
                                                padding: '0.5rem',
                                                background: 'transparent',
                                                border: '1px solid transparent',
                                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                                color: '#fff',
                                                fontSize: '1rem'
                                            }}
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                defaultValue={budget.limit}
                                                placeholder="0.00"
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(',', '.');
                                                    if (val !== '' && !/^\d*\.?\d*$/.test(val)) {
                                                        e.target.value = val.slice(0, -1);
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    const val = parseFloat(e.target.value.replace(',', '.'));
                                                    handleSave(budget.category, isNaN(val) ? 0 : val, budget.id);
                                                }}
                                                style={{
                                                    width: '110px',
                                                    padding: '0.5rem',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid var(--card-border)',
                                                    borderRadius: '8px',
                                                    color: 'var(--foreground)',
                                                    textAlign: 'right',
                                                    outline: 'none'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                            />
                                            {budget.id && (
                                                <button
                                                    onClick={() => setDeleteConfirmId(budget.id!)}
                                                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}
                                                    title="Eliminar concepto"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <p style={{ color: '#71717a', textAlign: 'center', margin: '2rem 0' }}>No tienes presupuestos definidos.</p>
                                )}
                            </div>

                            <button
                                onClick={addBudget}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    width: '100%',
                                    marginTop: '1.5rem',
                                    padding: '0.75rem',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px dashed #3b82f6',
                                    borderRadius: '12px',
                                    color: '#3b82f6',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                <Plus size={18} /> Añadir Nuevo Concepto
                            </button>

                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    width: '100%',
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    background: 'var(--primary)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Finalizar Configuración
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirm Deletion Premium Modal */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(12px)',
                            zIndex: 3000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{
                                background: '#1a1d26',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '24px',
                                width: '100%',
                                maxWidth: '360px',
                                padding: '2rem',
                                textAlign: 'center',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'rgba(239, 68, 68, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                color: '#ef4444'
                            }}>
                                <Trash2 size={30} />
                            </div>

                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: '#fff' }}>
                                ¿Eliminar concepto?
                            </h3>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.5 }}>
                                Esta acción no se puede deshacer. Los gastos asociados a esta categoría ya no estarán vinculados a este presupuesto.
                            </p>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    style={{
                                        flex: 1,
                                        padding: '0.875rem',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirmId)}
                                    disabled={isLoading}
                                    style={{
                                        flex: 1,
                                        padding: '0.875rem',
                                        borderRadius: '12px',
                                        background: '#ef4444',
                                        border: 'none',
                                        color: '#fff',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        opacity: isLoading ? 0.6 : 1
                                    }}
                                >
                                    {isLoading ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
