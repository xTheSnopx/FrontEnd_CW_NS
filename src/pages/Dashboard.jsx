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
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/data/history', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        window.location.href = '/';
      }
    }
  };

  const currentRep = history.length > 0 ? history[0].points : 0;
  
  const labels = history.map(h => new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })).reverse();
  const dataPoints = history.map(h => h.points).reverse();

  const chartData = {
    labels: labels.length ? labels : ['Sin Datos'],
    datasets: [
      {
        label: 'Reputación',
        data: dataPoints.length ? dataPoints : [0],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: '#dc2626',
        pointBorderColor: '#fff',
        pointRadius: 4,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#cbd5e1', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } },
    },
  };

  const StatCard = ({ title, value, icon, colorClass, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`glass-panel p-6 rounded-2xl border-l-4 ${colorClass} relative overflow-hidden group hover:bg-slate-800/60 transition-colors`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value.toLocaleString()}</h3>
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
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Proyección Personal</h1>
          <p className="text-slate-400 font-medium">Estadísticas de crecimiento en tiempo real.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Nivel Actual" value={80} icon={faShieldAlt} colorClass="border-sky-500" delay={0.1} />
        <StatCard title="Reputación" value={currentRep} icon={faKhanda} colorClass="border-violet-500 text-gradient" delay={0.2} />
        <StatCard title="Ganancia Últ. Hora" value={"+ " + (history.length > 1 ? (history[0].points - history[1].points) : 0)} icon={faArrowTrendUp} colorClass="border-red-500 text-red-400" delay={0.3} />
        <StatCard title="Puntos / Hora" value={"+ 150"} icon={faClock} colorClass="border-amber-500 text-amber-400" delay={0.4} />
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
          <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-1">{user?.username || 'Ninja'}</h3>
          <p className="text-red-400 font-mono text-xs tracking-widest mb-6 border border-red-500/30 bg-red-500/10 px-3 py-1 rounded-sm">RANGO: ELITE CHUNIN</p>
          
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
    </div>
  );
}
