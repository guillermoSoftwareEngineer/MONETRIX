"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Cpu, AlertCircle, X, MessageSquare } from 'lucide-react';
import { fetchAPI } from '../lib/api';

interface Message {
    role: 'user' | 'ai';
    content: string;
}

interface AIChatAdvisorProps {
    finances: any[];
}

export default function AIChatAdvisor({ finances }: AIChatAdvisorProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);
        try {
            const response = await fetchAPI('/finances/ai/ask', {
                method: 'POST',
                body: JSON.stringify({ question: userMsg })
            });
            setMessages(prev => [...prev, { role: 'ai', content: response.response }]);
        } catch (error: any) {
            setMessages(prev => [...prev, { role: 'ai', content: "Lo siento, la app de Monedix tuvo problemas para contactarme. 🧠❌ Por favor, verifica tu conexión o tu Token de Hugging Face en configuración." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        style={{
                            width: 'calc(100vw - 2rem)',
                            maxWidth: '380px',
                            height: 'min(550px, 80vh)',
                            background: 'rgba(24, 24, 27, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            overflow: 'hidden',
                            marginBottom: '1rem'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(59, 130, 246, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ background: '#d4af37', padding: '0', borderRadius: '50%', width: '36px', height: '36px', overflow: 'hidden', border: '2px solid #d4af37' }}>
                                    <img src="/gaston.png" alt="Gastón" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                </div>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>Asesor IA Monedix</div>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messages.length === 0 && (
                                <div style={{ textAlign: 'center', marginTop: '2rem', color: '#71717a' }}>
                                    <Cpu size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p style={{ fontSize: '0.875rem' }}>¡Hola! Soy tu asistente financiero. Pregúntame sobre tus gastos o consejos de ahorro.</p>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                    <div style={{
                                        maxWidth: '85%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: msg.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                                        background: msg.role === 'user' ? '#d4af37' : 'rgba(255, 255, 255, 0.05)',
                                        color: msg.role === 'user' ? '#000' : 'inherit',
                                        fontSize: '0.875rem',
                                        lineHeight: 1.5
                                    }}>
                                        {msg.role === 'ai' ? (
                                            <div>
                                                <div style={{ color: '#d4af37', fontWeight: 'bold', marginBottom: '0.4rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    Respuesta de Gastón:
                                                </div>
                                                {msg.content.split('\n').map((line, index) => {
                                                    const isWarning = line.includes('⚠️ Aviso: Soy una IA');
                                                    return (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                color: isWarning ? '#f87171' : 'inherit',
                                                                fontWeight: isWarning ? '600' : 'normal',
                                                                marginBottom: line.trim() === '' ? '0.75rem' : '0.25rem'
                                                            }}
                                                        >
                                                            {line}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div style={{ color: '#71717a', fontSize: '0.75rem', marginLeft: '0.5rem' }}>Gastón IA está pensando...</div>
                            )}
                        </div>

                        {/* Legal Warning Footer */}
                        <div style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', fontSize: '0.65rem', color: '#71717a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.2rem' }}>
                                <AlertCircle size={10} />
                                <strong>Aviso legal</strong>
                            </div>
                            Las IA pueden cometer errores. El uso de esta información es responsabilidad exclusiva del usuario.
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Escribe tu duda aquí..."
                                    style={{
                                        flex: 1,
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        padding: '0.6rem 1rem',
                                        color: 'white',
                                        fontSize: '0.875rem'
                                    }}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    style={{
                                        background: '#d4af37',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '0.6rem',
                                        color: '#000',
                                        cursor: 'pointer',
                                        opacity: (!input.trim() || isTyping) ? 0.5 : 1
                                    }}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#d4af37',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    boxShadow: '0 10px 25px rgba(212, 175, 55, 0.4)',
                    cursor: 'pointer',
                    overflow: 'hidden'
                }}
            >
                {isOpen ? <X size={28} /> : <img src="/gaston.png" alt="Gastón" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />}
            </motion.button>
        </div>
    );
}
