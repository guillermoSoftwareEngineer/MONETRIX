"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings as SettingsIcon, Bell, Calendar, Clock, ShieldCheck, X, Bot, Key, ExternalLink, Info, Eye, EyeOff, Target } from "lucide-react";
import { fetchAPI } from "../lib/api";

export default function Settings() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showApiKey, setShowApiKey] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    const [settings, setSettings] = useState({
        reminderFrequency: 'monthly',
        reminderDay: 1,
        reminderTime: '09:00',
        investmentsReminder: true,
        hfToken: '',
        emergencyFundGoal: 0,
        savingsGoal: 0,
        savingsFrequency: 'monthly'
    });

    useEffect(() => {
        if (isOpen) {
            fetchSettings();
        }
    }, [isOpen]);

    const fetchSettings = async () => {
        try {
            const data = await fetchAPI('/users/profile');
            setSettings({
                reminderFrequency: data.reminderFrequency || 'monthly',
                reminderDay: data.reminderDay || 1,
                reminderTime: data.reminderTime || '09:00',
                investmentsReminder: data.investmentsReminder !== undefined ? data.investmentsReminder : true,
                hfToken: data.hfToken ? '********' : '',
                emergencyFundGoal: Number(data.emergencyFundGoal) || 0,
                savingsGoal: Number(data.savingsGoal) || 0,
                savingsFrequency: data.savingsFrequency || 'monthly'
            });
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);

        // No enviar el Token si es la máscara de asteriscos
        const payload: any = { ...settings };
        if (payload.hfToken === '********') {
            delete payload.hfToken;
        }

        try {
            await fetchAPI('/users/settings', {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            setMessage({ type: 'success', text: 'Preferencias guardadas correctamente ✅' });
            setTimeout(() => setIsOpen(false), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al guardar las preferencias ❌' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    color: '#a1a1aa',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
                <SettingsIcon size={18} />
                <span>Configuración</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            style={{
                                background: '#18181b',
                                maxWidth: '500px',
                                width: '95%',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                padding: '2rem',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative',
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(255,255,255,0.1) transparent'
                            }}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>

                            <div style={{ marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Bell size={24} color="var(--primary)" />
                                    Notificaciones y Salud
                                </h2>
                                <p style={{ color: '#71717a', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                    Configura tus recordatorios para mantener una salud financiera óptima.
                                </p>
                            </div>

                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {/* Frequency */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        Frecuencia de Recordatorio
                                    </label>
                                    <select
                                        value={settings.reminderFrequency}
                                        onChange={(e) => setSettings({ ...settings, reminderFrequency: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                    >
                                        <option value="monthly">Mensual</option>
                                        <option value="quincenal">Quincenal</option>
                                        <option value="none">Desactivado</option>
                                    </select>
                                </div>

                                {/* Day and Time Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                            Día del Mes
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="31"
                                            value={settings.reminderDay}
                                            onChange={(e) => setSettings({ ...settings, reminderDay: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                            Hora Fija
                                        </label>
                                        <input
                                            type="time"
                                            value={settings.reminderTime}
                                            onChange={(e) => setSettings({ ...settings, reminderTime: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                        />
                                    </div>
                                </div>

                                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0.5rem 0' }} />

                                {/* Financial Goals Section */}
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981' }}>
                                        <Target size={20} />
                                        Metas Financieras
                                    </h3>
                                </div>

                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                            Fondo de Emergencia (Meta)
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.emergencyFundGoal}
                                            onChange={(e) => setSettings({ ...settings, emergencyFundGoal: parseFloat(e.target.value) || 0 })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                            placeholder="Ej: 5000000"
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                                Ahorro Programado
                                            </label>
                                            <input
                                                type="number"
                                                value={settings.savingsGoal}
                                                onChange={(e) => setSettings({ ...settings, savingsGoal: parseFloat(e.target.value) || 0 })}
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                                placeholder="Ej: 200000"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                                Frecuencia Ahorro
                                            </label>
                                            <select
                                                value={settings.savingsFrequency}
                                                onChange={(e) => setSettings({ ...settings, savingsFrequency: e.target.value })}
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                            >
                                                <option value="monthly">Mensual</option>
                                                <option value="quincenal">Quincenal</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Investment Alerts */}
                                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Alertas de Inversión (CDTs)</div>
                                        <div style={{ fontSize: '0.8rem', color: '#71717a' }}>Te avisamos el día antes del vencimiento.</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.investmentsReminder}
                                        onChange={(e) => setSettings({ ...settings, investmentsReminder: e.target.checked })}
                                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                                    />
                                </label>

                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', color: '#71717a', fontSize: '0.75rem', lineHeight: 1.4 }}>
                                <ShieldCheck size={26} style={{ flexShrink: 0 }} />
                                <p>Por qué esto es salud: Registrar tus datos con constancia mensual o quincenal permite al algoritmo de Monedix darte consejos 100% precisos sobre tu liquidez e inversiones.</p>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '2rem 0' }} />

                            {/* AI Configuration Section */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#3b82f6' }}>
                                    <Bot size={22} />
                                    Asesor Inteligente (IA - Hugging Face)
                                </h3>
                                <p style={{ color: '#71717a', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    Configura tu Token de acceso gratuito para activar el chat de asesoría financiera sin límites de tarjeta.
                                </p>
                            </div>

                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    Hugging Face Access Token
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showApiKey ? "text" : "password"}
                                        value={settings.hfToken || ''}
                                        onChange={(e) => setSettings({ ...settings, hfToken: e.target.value })}
                                        placeholder="hf_..."
                                        style={{ width: '100%', padding: '0.75rem 3rem 0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9rem' }}
                                    />
                                    <button
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer' }}
                                    >
                                        {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {/* Instructions Button */}
                                <button
                                    onClick={() => setShowInstructions(!showInstructions)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem',
                                        borderRadius: '12px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        border: '1px solid rgba(59, 130, 246, 0.2)',
                                        color: '#3b82f6',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    <Info size={16} />
                                    {showInstructions ? "Ocultar Instrucciones" : "¿Cómo obtener mi Access Token?"}
                                </button>

                                <AnimatePresence>
                                    {showInstructions && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            style={{ overflow: 'hidden', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}
                                        >
                                            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#a1a1aa', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <li>Crea una cuenta en <a href="https://huggingface.co/join" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Hugging Face <ExternalLink size={12} style={{ display: 'inline' }} /></a>.</li>
                                                <li>Ve a <strong>Settings &gt; Access Tokens</strong>.</li>
                                                <li>Crea un nuevo token: <strong>"Read"</strong> o de <strong>"Grano Fino"</strong> (con permiso de Inferencia).</li>
                                                <li>Copia el token (hf_...) y pégalo arriba.</li>
                                                <li>¡Listo! El asesor Gastón ahora usará Qwen-2.5 de forma gratuita.</li>
                                            </ol>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            padding: '0.75rem',
                                            marginTop: '1.5rem',
                                            borderRadius: '12px',
                                            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: message.type === 'success' ? '#4ade80' : '#f87171',
                                            fontSize: '0.9rem',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {message.text}
                                    </motion.div>
                                )}

                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="btn-primary"
                                    style={{ padding: '1rem', marginTop: '1.5rem', width: '100%', opacity: loading ? 0.7 : 1 }}
                                >
                                    {loading ? 'Guardando...' : 'Guardar Preferencias'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
