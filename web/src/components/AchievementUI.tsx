"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Shield } from "lucide-react";

interface AchievementUIProps {
    level: number;
    xp: number;
    medals: string[]; // Decoded JSON
}

export default function AchievementUI({ level, xp, medals }: AchievementUIProps) {
    const progress = (xp / 1000) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                background: 'rgba(24, 24, 27, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                minWidth: '240px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #fACC15, #eab308)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(234, 179, 8, 0.3)'
                    }}>
                        <Shield size={24} color="#000" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 'bold', textTransform: 'uppercase' }}>Rango</div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#fff' }}>Nivel {level} / 1000</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>XP</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#fACC15' }}>{xp} / 1000</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{
                height: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #fACC15, #f59e0b)',
                        boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
                    }}
                />
            </div>

            {/* Medals Preview */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {medals.length > 0 ? medals.slice(0, 4).map((m, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -2 }}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                        title={m}
                    >
                        <Star size={16} color="#fACC15" />
                    </motion.div>
                )) : (
                    <div style={{ fontSize: '0.75rem', color: '#71717a', fontStyle: 'italic' }}>Gana XP para obtener medallas</div>
                )}
            </div>
        </motion.div>
    );
}
