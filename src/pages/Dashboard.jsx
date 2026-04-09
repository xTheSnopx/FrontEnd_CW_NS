import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faKhanda, faArrowTrendUp, faClock } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import DecayCard from '../components/DecayCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/data/my-profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  // --- ALGORITHM: Rep/Minute Calculation & Projection ---
  const activeHistory = profile && profile.history && profile.history.length > 0 
    ? profile.history 
    : [];

  let currentRep = 0;
  let repPerMinute = 0;
  let repPerHour = 0;
  
  let chartLabels = ['Sin Datos'];
  let actualData = [0];
  let projectedData = [];

  if (activeHistory.length > 0) {
    currentRep = activeHistory[0].points;
    
    // Sort ascending for the chart graph (Left to Right = Oldest to Newest)
    const sortedHistory = [...activeHistory].reverse();
    
    chartLabels = sortedHistory.map(h => new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    actualData = sortedHistory.map(h => h.points);

    // Mathematical projection logic
    if (sortedHistory.length >= 2) {
      const latest = sortedHistory[sortedHistory.length - 1]; // Newest data point
      const oldest = sortedHistory[0]; // Oldest available sample

      const diffPoints = latest.points - oldest.points;
      const diffMs = new Date(latest.timestamp) - new Date(oldest.timestamp);
      const diffMinutes = diffMs / (1000 * 60);

      repPerMinute = diffMinutes > 0 ? (diffPoints / diffMinutes) : 0;
      repPerHour = repPerMinute * 60;

      // To draw the secondary line continuously, pad it with nulls until the present moment
      projectedData = new Array(actualData.length - 1).fill(null);
      projectedData.push(latest.points); // Anchor point connecting Actual to Projected
      
      // Calculate future trajectory nodes at +1H, +3H, +6H, +12H
      const futureHours = [1, 3, 6, 12];
      const latestTime = new Date(latest.timestamp);
      
      futureHours.forEach(h => {
        const futureTime = new Date(latestTime.getTime() + h * 60 * 60 * 1000);
        chartLabels.push(`+${h}H Proy.`);
        
        const predictedRep = latest.points + (repPerHour * h);
        projectedData.push(Math.round(predictedRep));
      });
    }
  }

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Reputación Histórica',
        data: actualData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: '#dc2626',
        pointBorderColor: '#fff',
        pointRadius: 4,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Proyección Predictiva',
        data: projectedData,
        borderColor: '#06b6d4', // Cyan Neon Forecast
        borderDash: [6, 4],
        backgroundColor: 'rgba(6, 182, 212, 0.05)',
        borderWidth: 2,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointStyle: 'rectRot',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: '#cbd5e1', font: { family: 'monospace' } } },
      tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.95)', titleColor: '#fff', bodyColor: '#cbd5e1', borderColor: 'rgba(6,182,212,0.3)', borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: '#64748b', font: { family: 'monospace', size: 10 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: '#64748b', font: { family: 'monospace' } } },
    },
  };

  const StatCard = ({ title, value, icon, colorClass, delay, subtitle }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`glass-panel p-6 rounded-2xl border-l-4 ${colorClass} relative overflow-hidden group hover:bg-slate-800/60 transition-colors`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-[10px] text-slate-500 font-mono mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-slate-900/50 transform group-hover:scale-110 transition-transform ${colorClass.replace('border-', 'text-')}`}>
          <FontAwesomeIcon icon={icon} className="w-6 h-6 drop-shadow-md" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Base de Operaciones: <span className="text-red-500">{profile?.clanName || 'Analizando...'}</span></h1>
          <p className="text-slate-400 font-medium">Estadísticas de crecimiento personal y proyección algorítmica.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Jugador" value={profile?.username || user?.username || 'Analizando...'} subtitle="ACTIVO" icon={faShieldAlt} colorClass="border-sky-500" delay={0.1} />
        <StatCard title="Reputación" value={currentRep.toLocaleString()} subtitle="CANTIDAD ALMACENADA" icon={faKhanda} colorClass="border-violet-500 text-gradient" delay={0.2} />
        <StatCard title="Ganancia / Minuto" value={`${repPerMinute > 0 ? '+' : ''}${repPerMinute.toFixed(1)}`} subtitle="TASA REAL" icon={faArrowTrendUp} colorClass="border-emerald-500 text-emerald-400" delay={0.3} />
        <StatCard title="Proyección / Hora" value={`${repPerHour > 0 ? '+' : ''}${Math.round(repPerHour).toLocaleString()}`} subtitle="ALGORITMO ACTUAL" icon={faClock} colorClass="border-cyan-500 text-cyan-400" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Left Column: Player Profile with DecayCard */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-1 glass-panel p-6 rounded-2xl flex flex-col items-center shadow-[0_0_30px_rgba(239,68,68,0.1)] border border-red-500/20"
        >
          <DecayCard 
            width={240} 
            height={300} 
            image="https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop" 
            className="mb-8 shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
          />
          <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-1">{profile?.username || user?.username || 'Ninja'}</h3>
          <p className="text-red-400 font-mono text-[10px] tracking-widest mb-6 border border-red-500/30 bg-red-500/10 px-3 py-1 rounded-sm uppercase">Afiliación: {profile?.clanName || 'Analizando...'}</p>
          
          <div className="w-full bg-[#0a0a0a] rounded-lg p-4 border border-white/5">
             <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
               <span>Poder Activo</span>
               <span className="text-red-400 font-bold">85%</span>
             </div>
             <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" style={{ width: '85%' }}></div>
             </div>
          </div>
        </motion.div>

        {/* Right Column: Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="col-span-1 lg:col-span-2 glass-panel p-6 rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.1)] border border-red-500/20 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Evolución de Reputación</h3>
            <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-700/50">
               <button className="px-3 py-1 text-xs font-semibold rounded-md bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]">Hoy</button>
               <button className="px-3 py-1 text-xs font-semibold rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer">7 Días</button>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] w-full relative">
            <Line data={chartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Top Quemadores Table (Medical/Cyberpunk Data Style) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="glass-panel p-6 rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.05)] border border-white/5 relative overflow-hidden mt-8"
      >
        {/* Decorative SCANline */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-red-500/50 animate-[scan_3s_ease-in-out_infinite_alternate] shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-2 w-2 rounded-sm bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          <h3 className="text-lg font-bold text-slate-200 tracking-widest uppercase font-mono">Top Quemadores</h3>
          <div className="flex-1 border-t border-dashed border-white/10 ml-4"></div>
          <span className="text-[10px] text-red-500 font-mono bg-red-500/10 px-2 py-1 rounded border border-red-500/20">LIVE_DATA</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-white/10 text-xs">
                <th className="py-3 px-4 font-normal uppercase tracking-widest">ID</th>
                <th className="py-3 px-4 font-normal uppercase tracking-widest">Sujeto</th>
                <th className="py-3 px-4 font-normal uppercase tracking-widest text-right">Reputación Base</th>
                <th className="py-3 px-4 font-normal uppercase tracking-widest text-right">Delta Hoy (Δ)</th>
                <th className="py-3 px-4 font-normal uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {[
                { id: "NS-992", name: "Destra", base: 1250000, delta: 15420, status: "CRITICAL" },
                { id: "NS-104", name: "Kage", base: 980500, delta: 12100, status: "ACTIVE" },
                { id: "NS-455", name: "Rogue", base: 750000, delta: 8900, status: "ACTIVE" },
                { id: "NS-881", name: "Shadow", base: 642000, delta: 3200, status: "STABLE" }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-red-500/5 transition-colors group">
                  <td className="py-3 px-4 text-slate-500">[{row.id}]</td>
                  <td className="py-3 px-4 font-bold text-slate-200 group-hover:text-red-400 transition-colors">{row.name}</td>
                  <td className="py-3 px-4 text-right">{row.base.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">+ {row.delta.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${row.status === 'CRITICAL' ? 'border-red-500/50 text-red-400 bg-red-500/10 animate-pulse' : row.status === 'ACTIVE' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' : 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
