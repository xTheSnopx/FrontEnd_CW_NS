import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faSearch, faFireFlameCurved, faFire, faShieldHalved, faKhanda, faSortDown, faSortUp, faMinus, faCrosshairs, faSkullCrossbones, faBell, faLineChart } from '@fortawesome/free-solid-svg-icons';
import ClanModal from '../components/ClanModal';
import TiltedScroll from '../components/TiltedScroll';

export default function Rankings() {
  const [rankings, setRankings] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClan, setSelectedClan] = useState(null);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('clan_favorites') || '[]'));
  
  // Track previous ranks to show Up/Down chart arrows
  const prevRanksRef = useRef({});

  useEffect(() => {
    fetchRankings();
    const interval = setInterval(fetchRankings, 30000); // Polling real-time every 30s
    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = (e, clanName) => {
    e.stopPropagation();
    let newFavs = [...favorites];
    if (newFavs.includes(clanName)) {
      newFavs = newFavs.filter(n => n !== clanName);
    } else {
      newFavs.push(clanName);
    }
    setFavorites(newFavs);
    localStorage.setItem('clan_favorites', JSON.stringify(newFavs));
  };

  const fetchRankings = async () => {
    try {
      const res = await axios.get('/api/data/rankings', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const apiClans = Array.isArray(res?.data?.clans) ? res.data.clans : (Array.isArray(res?.data) ? res.data : []);
      
      const enrichedData = apiClans.map(clan => {
        const clanName = clan?.name || clan?.clanName;
        const currentRank = clan.rank;
        const previousRank = prevRanksRef.current[clanName];
        
        let rankTrend = 'flat';
        if (previousRank) {
           if (currentRank < previousRank) rankTrend = 'up';   // Top 1 is < Top 2
           if (currentRank > previousRank) rankTrend = 'down';
        }
        
        // Update Ref for next poll
        prevRanksRef.current[clanName] = currentRank;

        // REAL Backend mathematical data processing
        const sixHourDelta = clan.sixHourDelta || 0;
        const twentyFourHourDelta = clan.twentyFourHourDelta || 0;
        
        let flames = 0;
        if (sixHourDelta >= 5000) flames = 1;
        if (sixHourDelta >= 10000) flames = 2;
        if (sixHourDelta >= 15000) flames = 3;
        if (sixHourDelta >= 18000) flames = 4;

        // Setting empty placeholders to 0 until API backend provides them
        return {
          ...clan,
          atk2: 0,
          atk1: 0,
          activeMembers: clan.activeMembers || 0,
          sixHourDelta: sixHourDelta,
          twentyFourHourDelta: twentyFourHourDelta,
          streak: flames, 
          trend: rankTrend,
          isBleeding: sixHourDelta === 0 && currentRank <= 20
        };
      });
      // Also fetch smart notifications in parallel
      const notifRes = await axios.get('/api/data/notifications');
      setNotifications(notifRes.data);
      
      setRankings({ ...res.data, clans: enrichedData });
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

  const clans = rankings?.clans || [];
  const filteredClans = clans.filter(c => (c?.name || c?.clanName || '').toLowerCase().includes((searchTerm || '').trim().toLowerCase()));

  // Map API notifications directly to the Hoverboard Feed format
  const hoverboardEvents = notifications.map(n => ({
      id: `alert-${Math.random()}`,
      text: n.msg,
      icon: n.type === 'warning' ? faSkullCrossbones : (n.type === 'success' ? faFire : faShieldHalved),
      color: n.type === 'warning' ? 'text-rose-500' : (n.type === 'success' ? 'text-emerald-400' : 'text-amber-500')
  }));

  const getRankStyle = (rank) => {
    if (rank === 1) return { color: 'text-amber-400', icon: faTrophy };
    if (rank === 2) return { color: 'text-slate-300', icon: faTrophy };
    if (rank === 3) return { color: 'text-amber-700', icon: faTrophy };
    if (rank <= 10) return { color: 'text-slate-400', icon: faShieldHalved };
    return { color: 'text-slate-600', icon: null };
  };

  const formatDelta = (value) => {
    if (value > 0) return <span className="text-red-400 font-medium">+{value.toLocaleString()}</span>;
    if (value < 0) return <span className="text-rose-500 font-medium">{value.toLocaleString()}</span>;
    return <span className="text-slate-500">{value}</span>;
  };

  const TrendIcon = ({ trend }) => {
     if (trend === 'up') return <FontAwesomeIcon icon={faSortUp} className="text-red-400 ml-1 text-[10px] align-middle" />;
     if (trend === 'down') return <FontAwesomeIcon icon={faSortDown} className="text-rose-500 ml-1 text-[10px] align-middle" />;
     return <FontAwesomeIcon icon={faMinus} className="text-slate-600 ml-1 text-[8px] align-middle" />;
  };

  return (
    <div className="relative">
      <div className="flex flex-col xl:flex-row items-center justify-between mb-8 gap-8 w-full">
        {/* Title and Search */}
        <div className="w-full xl:w-1/3 min-w-0 z-10 shrink-0">
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight flex items-center gap-3 whitespace-nowrap">
             Ranking Global
          </h1>
          <div className="relative group w-full max-w-sm mb-6 xl:mb-0">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-slate-500 group-focus-within:text-red-400 transition-colors" />
             </div>
             <input
               type="text"
               placeholder="Buscar clan..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="block w-full pl-9 pr-3 py-2 bg-[#121212]/80 border border-white/5 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all shadow-inner"
             />
          </div>
        </div>
        
        {/* Tactical Hoverboard Feed */}
        <div className="w-full xl:w-2/3 flex justify-end min-w-0 overflow-hidden">
           <TiltedScroll 
              className="w-full" 
              dynamicItems={hoverboardEvents} 
           />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-panel border border-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl bg-[#0d0d0d]/90 font-mono text-[13px]"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-[#151515] text-[11px] text-slate-400 uppercase tracking-widest border-b border-[#2a2a2a] sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 font-semibold text-center w-12">Top</th>
                <th className="px-4 py-3 font-semibold w-80">Clan</th>
                <th className="px-4 py-3 font-semibold text-right">Atk -2</th>
                <th className="px-4 py-3 font-semibold text-right">Atk -1</th>
                <th className="px-4 py-3 font-semibold text-center">Activos</th>
                <th className="px-4 py-3 font-semibold text-right">Reputación</th>
                <th className="px-4 py-3 font-semibold text-center w-16"><FontAwesomeIcon icon={faKhanda} className="text-slate-500" /></th>
                <th className="px-4 py-3 font-semibold text-right">6h</th>
                <th className="px-4 py-3 font-semibold text-right">24h</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {loading && (
                <tr><td colSpan="9" className="px-4 py-8 text-center text-slate-500">Recopilando datos de la red...</td></tr>
              )}
              {!loading && filteredClans.map((clan, idx) => {
                const rank = clan.rank || idx + 1;
                const rankStyle = getRankStyle(rank);
                const clanName = clan?.name || clan?.clanName || 'Desconocido';
                const isFav = favorites.includes(clanName);
                
                // Add conditional row highlights for Top 3
                let rowBg = "hover:bg-white/5";
                let rowBorder = "border-b border-[#1e1e1e]";
                if (rank === 1) rowBg = "bg-amber-500/5 hover:bg-amber-500/10 border-l-2 border-l-amber-500";
                if (rank === 2) rowBg = "bg-slate-300/5 hover:bg-slate-300/10 border-l-2 border-l-slate-400";
                if (rank === 3) rowBg = "bg-amber-700/5 hover:bg-amber-700/10 border-l-2 border-l-amber-700";

                return (
                  <motion.tr 
                    key={clan.id || idx}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                    className={`${rowBg} ${rowBorder} transition-colors group cursor-pointer`}
                    onClick={() => setSelectedClan(clan)}
                  >
                    {/* Rank */}
                    <td className="px-4 py-3 text-center font-bold text-slate-300 relative">
                      <div className="flex items-center justify-center gap-1">
                        {rank}
                        {clan.trend === 'up' && <FontAwesomeIcon icon={faLineChart} className="text-emerald-500 ml-1 text-[11px]" title="Subió de puesto" />}
                        {clan.trend === 'down' && <FontAwesomeIcon icon={faLineChart} className="text-rose-500 ml-1 text-[11px] scale-y-[-1]" title="Bajó de puesto" />}
                      </div>
                    </td>

                    {/* Clan Name & Badges */}
                    <td className="px-4 py-3">
                       <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => toggleFavorite(e, clanName)}
                            className="p-1 mr-1 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Marcar como objetivo"
                          >
                            <FontAwesomeIcon icon={faBell} className={`text-[12px] ${isFav ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]' : 'text-slate-600'}`} />
                          </button>
                          {rankStyle.icon && (
                            <FontAwesomeIcon icon={rankStyle.icon} className={`${rankStyle.color} text-[14px]`} />
                          )}
                          <span className={`${isFav ? 'text-violet-100 font-bold' : 'text-white font-bold'} group-hover:text-emerald-400 transition-colors`}>
                            {clanName} <span className="text-slate-500 font-normal ml-1">[{clan?.members || 40}]</span>
                          </span>
                          {/* Fire Streaks */}
                          {clan.streak > 0 && (
                            <div className="flex gap-0.5 ml-1">
                                {[...Array(clan.streak)].map((_, i) => (
                                    <FontAwesomeIcon key={i} icon={faFire} className="text-orange-500 text-[10px] drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
                                ))}
                            </div>
                          )}
                       </div>
                    </td>

                    {/* Atk -2 */}
                    <td className="px-4 py-3 text-right">
                       {formatDelta(clan.atk2)}
                    </td>

                    {/* Atk -1 */}
                    <td className="px-4 py-3 text-right">
                       <span className="text-amber-500">{clan.atk1 > 0 ? `+${clan.atk1.toLocaleString()}` : 0}</span>
                    </td>

                    {/* Activos (Circles) */}
                    <td className="px-4 py-3">
                       <div className="flex items-center justify-center">
                          <div className="relative flex items-center justify-center w-6 h-6 rounded-full border border-slate-700 bg-[#151515]">
                             <span className="text-[10px] text-slate-400">{clan.activeMembers}</span>
                          </div>
                       </div>
                    </td>

                    {/* Total Reputation */}
                    <td className="px-4 py-3 text-right font-bold text-slate-200 tracking-wide text-[14px]">
                      {clan.reputation?.toLocaleString()}
                    </td>

                    {/* Status Icon */}
                    <td className="px-4 py-3 text-center">
                       <div className="text-slate-600 text-[10px]">0</div>
                    </td>

                    {/* 6h Delta */}
                    <td className="px-4 py-3 text-right">
                       {formatDelta(clan.sixHourDelta)}
                    </td>

                    {/* 24h Delta */}
                    <td className="px-4 py-3 text-right">
                       <span className="text-amber-400 font-medium">+{clan.twentyFourHourDelta?.toLocaleString()}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* AnimatePresence for Modal */}
      <AnimatePresence>
        {selectedClan && (
          <ClanModal clan={selectedClan} onClose={() => setSelectedClan(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
