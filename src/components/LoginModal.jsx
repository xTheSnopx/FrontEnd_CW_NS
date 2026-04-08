import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserNinja, faEnvelope, faLock, faArrowRight, faUserPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import LetterGlitch from './LetterGlitch';

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      // If server is not running, we could use a mock URL or let the proxy handle it
      const res = await axios.post(endpoint, formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      onSuccess?.(res.data.user);
      onClose(); // Close modal on success
      
      window.location.href = '/panel/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Error en la conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/90 shadow-2xl shadow-red-900/40"
        >
          {/* Top Hacker Effect */}
          <div className="relative h-24 w-full border-b border-red-500/20 bg-black">
            <LetterGlitch 
                glitchSpeed={40} 
                smooth={true} 
                className="opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#0a0a0a] to-transparent">
              <div className="flex items-center gap-3 text-red-400">
                <FontAwesomeIcon icon={faUserNinja} className="text-2xl drop-shadow-[0_0_10px_rgba(239, 68, 68,0.8)]" />
                <span className="text-xl font-bold tracking-widest text-white drop-shadow-md">
                   SYS.ACCESS
                </span>
              </div>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
            >
               <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>
          </div>

          <div className="p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'Bienvenido de vuelta' : 'Crear nueva cuenta'}
              </h2>
              <p className="text-slate-400 text-sm">
                {isLogin 
                  ? 'Ingresa tus credenciales para acceder al panel.' 
                  : 'Regístrate para obtener acceso al ranking mundial.'}
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400 text-center flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faTimes} /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUserNinja} className="text-slate-500 group-focus-within:text-red-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Usuario (ej. Destra)"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#121212] border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-medium"
                />
              </div>

              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  className="relative group overflow-hidden"
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faEnvelope} className="text-slate-500 group-focus-within:text-red-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    required={!isLogin}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#121212] border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-medium"
                  />
                </motion.div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <FontAwesomeIcon icon={faLock} className="text-slate-500 group-focus-within:text-red-400 transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="Contraseña"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#121212] border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-medium"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(239, 68, 68,0.3)] mt-2"
              >
                {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : isLogin ? (
                    <><FontAwesomeIcon icon={faSignInAlt} /> Conectar</>
                ) : (
                    <><FontAwesomeIcon icon={faUserPlus} /> Registrar</>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-sm text-slate-400 hover:text-red-400 transition-colors group"
              >
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 
