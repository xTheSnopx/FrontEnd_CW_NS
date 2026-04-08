import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKhanda, faArrowRight, faChartLine, faUsers, faArrowTrendUp, faLink, faCog, faEye, faQuestionCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Squares from '../components/Squares';
import SpotlightCard from '../components/SpotlightCard';
import ShinyText from '../components/ShinyText';
import LoginModal from '../components/LoginModal';

export default function Landing() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-red-500/30 overflow-x-hidden">
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
        <Squares 
          speed={0.4} 
          squareSize={50} 
          direction="diagonal" 
          borderColor="rgba(255, 255, 255, 0.05)"
          hoverFillColor="rgba(16, 185, 129, 0.1)"
        />
      </div>

      {/* Navbar (Sticky) */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faKhanda} className="w-6 h-6 text-red-500" />
            <span className="font-bold tracking-tight text-white text-lg">Clan War - Ranking</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-md hover:bg-white/5 border border-transparent transition-colors text-sm font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              Registrarse
            </button>
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white transition-all text-sm font-semibold shadow-lg shadow-red-600/20 cursor-pointer"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 flex flex-col items-center text-center max-w-7xl mx-auto">
        {/* Decorative Emerald Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 max-w-4xl leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Lleva tu clan al siguiente nivel con <ShinyText text="datos en tiempo real" className="text-red-400 inline-block" speed={4} />
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Optimiza tu estrategia, monitorea el progreso de tus miembros y domina el ranking de Ninja Saga.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <button onClick={() => setIsLoginModalOpen(true)} className="flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-md bg-red-600 text-white font-bold hover:bg-red-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all cursor-pointer">
            Iniciar sesión
          </button>
          <button onClick={() => setIsLoginModalOpen(true)} className="flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-md text-slate-300 font-semibold hover:text-white transition-colors group cursor-pointer">
            Registrarse <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Floating Mockup Graphics */}
        <motion.div 
          className="w-full max-w-5xl mx-auto relative perspective-1000"
          initial={{ opacity: 0, y: 60, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.6, duration: 1, type: "spring" }}
        >
          <div className="rounded-xl border border-white/10 bg-[#121212]/80 backdrop-blur-xl shadow-2xl shadow-red-900/20 overflow-hidden">
            <div className="h-8 border-b border-white/5 flex items-center px-4 gap-2 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
            </div>
            <div className="p-6">
              <div className="h-64 w-full bg-gradient-to-t from-red-500/10 to-transparent rounded-lg border border-red-500/20 flex items-end px-8 pb-8 gap-4 justify-between">
                {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1 + (i * 0.1), duration: 0.8 }}
                    className="w-full max-w-16 bg-red-500/80 rounded-t-sm shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid (4 Cards) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SpotlightCard className="p-8" spotlightColor="rgba(16, 185, 129, 0.1)">
            <FontAwesomeIcon icon={faChartLine} className="text-3xl text-red-400 mb-6 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <h3 className="text-xl font-bold text-white mb-3">Rankings en tiempo real</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Nuestra base de datos se actualiza instantáneamente para reflejar cada punto de reputación ganado.</p>
          </SpotlightCard>
          <SpotlightCard className="p-8" spotlightColor="rgba(16, 185, 129, 0.1)">
            <FontAwesomeIcon icon={faArrowTrendUp} className="text-3xl text-red-400 mb-6 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <h3 className="text-xl font-bold text-white mb-3">Actividad y ganancias</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Calcula automáticamente el incremento de rep (Deltas +X 🔥) para saber cuánto aporta cada integrante de verdad.</p>
          </SpotlightCard>
          <SpotlightCard className="p-8" spotlightColor="rgba(16, 185, 129, 0.1)">
            <FontAwesomeIcon icon={faUsers} className="text-3xl text-red-400 mb-6 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <h3 className="text-xl font-bold text-white mb-3">Top Performers</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Identifica rápidamente a los miembros más activos y comprometedores dentro de cualquier gremio global.</p>
          </SpotlightCard>
          <SpotlightCard className="p-8" spotlightColor="rgba(16, 185, 129, 0.1)">
            <FontAwesomeIcon icon={faChartLine} className="text-3xl text-red-400 mb-6 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <h3 className="text-xl font-bold text-white mb-3">Gráficas históricas</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Analiza el progreso a través del tiempo con curvas de crecimiento predictivas exclusivas para tu cuenta.</p>
          </SpotlightCard>
        </div>
      </section>

      {/* How it Works (3 Steps) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">¿Cómo funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center relative">
            <div className="w-16 h-16 rounded-full bg-[#121212] border border-red-500/30 flex items-center justify-center mb-6 z-10 shadow-lg shadow-red-900/20">
              <FontAwesomeIcon icon={faLink} className="text-2xl text-red-400" />
            </div>
            <div className="hidden md:block absolute top-8 left-1/2 w-full h-[1px] bg-gradient-to-r from-red-500/30 to-transparent" />
            <h3 className="text-lg font-bold text-white mb-2">1. Vincular Clan</h3>
            <p className="text-slate-400 text-sm">Registra o vincula el ID de tu clan para que nuestro sistema comience a sincronizar sus estadísticas.</p>
          </div>
          <div className="flex flex-col items-center text-center relative">
            <div className="w-16 h-16 rounded-full bg-[#121212] border border-red-500/30 flex items-center justify-center mb-6 z-10 shadow-lg shadow-red-900/20">
              <FontAwesomeIcon icon={faCog} className="text-2xl text-red-400" />
            </div>
            <div className="hidden md:block absolute top-8 left-1/2 w-full h-[1px] bg-gradient-to-r from-red-500/30 to-transparent" />
            <h3 className="text-lg font-bold text-white mb-2">2. Configuración</h3>
            <p className="text-slate-400 text-sm">Ajusta los parámetros y define qué usuarios o métricas requieres priorizar dentro del rastreo diario.</p>
          </div>
          <div className="flex flex-col items-center text-center relative">
            <div className="w-16 h-16 rounded-full bg-[#121212] border border-red-500/30 flex items-center justify-center mb-6 z-10 shadow-lg shadow-red-900/20">
              <FontAwesomeIcon icon={faEye} className="text-2xl text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">3. Monitorear</h3>
            <p className="text-slate-400 text-sm">Accede al Dashboard en tiempo real y visualiza cómo la puntuación sube en vivo durante la guerra.</p>
          </div>
        </div>
      </section>

      {/* Blurred Ranking Preview */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <div className="relative rounded-xl border border-white/10 bg-[#121212] overflow-hidden p-8 text-center min-h-[400px] flex flex-col justify-center items-center">
          <div className="absolute inset-0 blur-md opacity-30 select-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />
          
          <div className="relative z-20 flex flex-col items-center">
            <FontAwesomeIcon icon={faKhanda} className="text-5xl text-slate-500 mb-6 opacity-50 drop-shadow-md" />
            <h2 className="text-2xl font-bold text-white mb-2">Ranking Global Cifrado</h2>
            <p className="text-slate-400 mb-8 max-w-md">La lista completa de clanes y deltas de contribución está protegida.</p>
            <button onClick={() => setIsLoginModalOpen(true)} className="px-6 py-3 rounded-md bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors flex items-center gap-2 cursor-pointer">
              Inicia sesión para ver el ranking completo
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Placeholder */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 mb-20 border-t border-white/5">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          {[
            { q: "¿Cada cuánto se actualizan los datos?", a: "Nuestro cronjob centralizado obtiene respuestas oficiales (del servidor principal) recurrentemente para calcular las variaciones inmediatas de puntos." },
            { q: "¿Qué métricas puedo rastrear?", a: "Podrás ver la rep global (Gains Totales), el incremento individual diario (+X 🔥) comparado con el snapshot anterior, y la evolución en la tabla general." },
            { q: "¿Es un servicio gratuito?", a: "El registro inicial para Trackers básicos no tiene costo. Existen proyecciones avanzadas limitadas a cuentas verificadas." }
          ].map((faq, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-[#121212]/50 p-6">
              <div className="flex justify-between items-center text-white font-semibold cursor-pointer">
                <span>{faq.q}</span>
                <FontAwesomeIcon icon={faChevronRight} className="text-slate-500" />
              </div>
              <p className="mt-4 text-slate-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA & Footer */}
      <footer className="relative z-10 border-t border-white/5 pt-20 pb-10 px-6 text-center bg-[#0a0a0a]/50">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8">Empieza a rastrear tu clan hoy</h2>
        <button onClick={() => setIsLoginModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-8 py-4 mb-20 rounded-md bg-red-600 hover:bg-red-500 text-white font-bold transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] cursor-pointer">
          Crear cuenta gratis
        </button>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-10 text-slate-500 text-sm">
          <p>© 2026 Ninja Saga Clan Tracker. Replicado con React.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="hover:text-red-400 cursor-pointer transition-colors">Términos</span>
            <span className="hover:text-red-400 cursor-pointer transition-colors">Privacidad</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
