"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FinanceType } from "../hooks/useFinances";

interface AdvisorProps {
    totalBalance: number;
    recentMovements: any[];
}

export default function Advisor({ totalBalance, recentMovements }: AdvisorProps) {
    const [message, setMessage] = useState("");
    const [mood, setMood] = useState<"happy" | "worried" | "neutral" | "analytical" | "grumpy" | "sleeping">("neutral");

    const getMoodVideo = () => {
        switch (mood) {
            case "happy": return "/assets/monstruo-feliz.mp4";
            case "worried": return "/assets/monstruo-preocupado.mp4";
            case "grumpy": return "/assets/monstruo-enojado.mp4";
            case "analytical": return "/assets/monstruo-analitico.mp4";
            case "sleeping": return "/assets/monstruo-soñando.mp4";
            default: return "/assets/monstruo-feliz.mp4"; // Final fallback
        }
    };

    useEffect(() => {
        // Calculate basic metrics for holistic view
        const totalIncome = recentMovements
            .filter(m => m.type === FinanceType.INCOME)
            .reduce((acc, m) => acc + Number(m.amount), 0);
        const totalExpenses = recentMovements
            .filter(m => m.type === FinanceType.EXPENSE)
            .reduce((acc, m) => acc + Number(m.amount), 0);

        // Savings rate logic (holistic)
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
        const hasInvestments = recentMovements.some(m => m.type === FinanceType.INVESTMENT);

        // First priority: Empty state
        if (recentMovements.length === 0 && totalBalance === 0) {
            setMessage("¡Zzz! Gastón está en un sueño profundo sobre monedas de oro. ¡Añade un movimiento para despertarlo! 😴");
            setMood("sleeping");
            return;
        }

        // 1. Critical Health (Deep Debt)
        if (totalBalance < -1000000) {
            setMessage("¡Gulp! Gastón está asustado. Ese balance negativo es preocupante... ¡Necesitamos un plan de rescate urgente! 🎈🆘");
            setMood("grumpy");
        }
        // 2. High Performance (Holistic Success)
        else if (totalBalance > 2000000 || (savingsRate > 30 && totalIncome > 500000)) {
            setMessage("¡Súper! Gastón está brillando de orgullo. Tienes una salud financiera envidiable. ¡Sigue así, maestro del ahorro! ✨🏆");
            setMood("happy");
        }
        // 3. Analytical Mode (Investments present & positive balance)
        else if (hasInvestments && totalBalance > 0) {
            setMessage("Gastón está analizando tu portafolio... 'Tu dinero está trabajando duro. Diversificar es de sabios'. 🧐🧪");
            setMood("analytical");
        }
        // 4. Minor Worry (Negative balance or very low savings rate)
        else if (totalBalance < 0 || (savingsRate < 5 && totalIncome > 0)) {
            setMessage("Gastón nota algo de tensión... 'Estamos gastando casi todo lo que entra. Tal vez debamos apretar un poco el cinturón'. 🤔💔");
            setMood("worried");
        }
        // 5. Success (Standard healthy state)
        else if (totalBalance > 500000) {
            setMessage("¡Bien hecho! Estamos en zona segura. Gastón está feliz de ver que tu balance crece paso a paso. 😊🚀");
            setMood("happy");
        }
        // 6. Neutral/Default
        else {
            const genericMessages = [
                "¡Hola! Soy Gastón. Hoy es un buen día para organizar nuestro tesoro. ¿Qué tenemos para hoy? 😊",
                "¡Cada peso cuenta! Gastón está listo para cuidar tu futuro. 💎",
                "Recuerda: la constancia es la base del éxito financiero. ¡Vamos por más! 📈✨",
                "Gastón se siente bien hoy. Ver que te interesas por tu dinero me pone de buen humor. 📣🧡"
            ];
            const randomMsg = genericMessages[Math.floor(Math.random() * genericMessages.length)];
            setMessage(randomMsg);
            setMood("happy");
        }
    }, [totalBalance, recentMovements]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1.5rem',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                marginBottom: '1rem',
                boxShadow: mood === 'grumpy' ? '0 0 20px rgba(255, 0, 0, 0.2)' : 'none'
            }}
        >
            <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0, overflow: 'hidden', borderRadius: '15px', border: '2px solid #a3e635' }}>
                <AnimatePresence mode="wait">
                    <motion.video
                        key={mood}
                        autoPlay
                        muted
                        loop
                        playsInline
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    >
                        <source src={getMoodVideo()} type="video/mp4" />
                    </motion.video>
                </AnimatePresence>

                <div style={{
                    position: 'absolute',
                    bottom: 5,
                    right: 5,
                    background: mood === 'happy' ? 'var(--success)' : (mood === 'worried' || mood === 'grumpy') ? 'var(--danger)' : mood === 'analytical' ? '#38bdf8' : '#71717a',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '1.5px solid white',
                    zIndex: 2
                }} />
            </div>

            <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.8rem', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Asesor de Gastos
                </h4>
                <AnimatePresence mode="wait">
                    <motion.p
                        key={message}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        style={{ fontSize: '0.95rem', lineHeight: 1.4, margin: 0 }}
                    >
                        "{message}"
                    </motion.p>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
