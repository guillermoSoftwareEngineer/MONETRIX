
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Dashboard from "../components/Dashboard";
import Settings from "../components/Settings";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  if (isLoading) {
    return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Cargando...</div>;
  }

  if (user) {
    return (
      <main style={{ minHeight: '100vh', padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
            >
              Hola, {user.fullName.split(' ')[0]}
            </motion.h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Settings />
              <button
                onClick={logout}
                style={{ background: 'transparent', border: '1px solid var(--card-border)', padding: '0.5rem 1rem', borderRadius: '8px', color: '#a1a1aa', cursor: 'pointer' }}
              >
                Cerrar Sesión
              </button>
            </div>
          </header>

          <div style={{ display: 'grid', gap: '2rem' }}>
            <Dashboard triggerRefresh={triggerRefresh} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--card-border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
            MONEDIX
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn-primary"
              style={{ background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--foreground)' }}
              onClick={() => router.push('/login')}
            >
              Iniciar Sesión
            </button>
            <button className="btn-primary" onClick={() => router.push('/register')}>
              Comenzar Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '6rem 0' }}>
        {/* Background Glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'rgba(0,0,0,0.6)'
        }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="video-bg"
            style={{ opacity: 0.6 }}
          >
            <source src="/assets/HeroSection.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '1rem',
              display: 'block'
            }}>
            Finanzas Personales Inteligentes
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: '3.5rem',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              background: 'linear-gradient(180deg, #fff 0%, #ccc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
            Domina tu dinero sin ser un experto.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              fontSize: '1.25rem',
              color: '#a1a1aa',
              marginBottom: '2.5rem',
              lineHeight: 1.6
            }}>
            La primera app diseñada con psicología financiera para ayudarte a ahorrar de verdad. Sin hojas de cálculo aburridas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
          >
            <button className="btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }} onClick={() => router.push('/register')}>
              Crear Cuenta Gratis
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '5rem 0', background: 'var(--secondary)' }}>
        <div className="container">
          <div className="features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <motion.div
              whileHover={{ y: -5 }}
              className="card"
            >
              <div className="card-image-container">
                <Image
                  src="/assets/IconoIlustraciónGamificación.jpg"
                  alt="Gamificación"
                  fill
                  className="card-image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Gamificación</h3>
              <p style={{ color: '#a1a1aa' }}>Convierte el ahorro en un juego. Sube de nivel mientras mejoras tus finanzas.</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="card"
            >
              <div className="card-image-container">
                <Image
                  src="/assets/SinCustodia.jpg"
                  alt="Sin Custodia"
                  fill
                  className="card-image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Sin Custodia</h3>
              <p style={{ color: '#a1a1aa' }}>Tu dinero siempre está en tus bancos. Nosotros solo te ayudamos a organizarlo.</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="card"
            >
              <div className="card-image-container">
                <Image
                  src="/assets/IlustraciónSeguridad.jpg"
                  alt="Seguridad"
                  fill
                  className="card-image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Privacidad Total</h3>
              <p style={{ color: '#a1a1aa' }}>Tus datos son tuyos. Cumplimos estrictamente con la Ley de Habeas Data.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
