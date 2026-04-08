import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // auth bypass for preview
  // if (!localStorage.getItem('token')) {
  //   return <Navigate to="/" replace />;
  // }

  const navItems = [
    { label: 'Ranking', path: '/panel/rankings', icon: faUsers },
    { label: 'Proyección', path: '/panel/dashboard', icon: faChartPie },
  ];

  return (
    <div className="flex h-screen overflow-hidden selection:bg-red-500/30">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-64 glass-panel border-r border-red-900/50 flex flex-col relative z-20"
      >
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-500/30">
               <span className="font-bold text-white text-lg">NS</span>
            </div>
            <div>
              <h2 className="font-bold text-white tracking-wide">{user?.username || 'Cargando...'}</h2>
              <p className="text-xs text-red-400">Espíritu Latino</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 mt-2 flex-grow">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-2">Menú Principal</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              const iconProp = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-red-500/20 text-white border border-red-500/30 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:border hover:border-white/5'
                  }`}
                >
                  <FontAwesomeIcon icon={iconProp} className={`w-5 h-5 ${isActive ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : ''}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 mt-auto border-t border-red-900/50">
           <button 
             onClick={handleLogout}
             className="flex items-center w-full gap-3 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm cursor-pointer"
           >
             <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
             Salir del Panel
           </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Animated Glow Top */}
        <div className="absolute top-0 left-10 w-3/4 h-32 bg-red-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>

        {/* Topbar */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-red-900/50 glass-panel z-10 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md">
          <div className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <span>Usuario</span>
            <span className="text-red-600">/</span>
            <span className="text-white bg-[#121212] px-2 py-0.5 rounded-md border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]">{user?.username}</span>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-lg text-xs font-semibold text-red-300 flex items-center gap-2 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Temporada 2 Activa
             </div>
             
             {user?.plan_expires_at && (
                <div className="text-xs text-rose-400 border border-rose-500/30 bg-rose-500/10 px-3 py-1 rounded-lg">
                   Plan: {Math.max(0, Math.floor((new Date(user.plan_expires_at) - new Date()) / (1000 * 60 * 60 * 24)))}d restantes
                </div>
             )}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8 z-10 relative">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto h-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
