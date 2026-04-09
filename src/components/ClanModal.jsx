import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { X, TrendingUp, Shield } from 'lucide-react';

export default function ClanModal({ clan, onClose }) {
  const [gains, setGains] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGains = async () => {
      try {
        const res = await axios.get(`/api/data/clan-gains?clanId=${clan.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const map = {};
        // Note: the backend uses PascalCase serialization by default in recent .NET unless configured
        // so we check both memberName and MemberName patterns
        res.data.forEach(g => { 
            const memberName = g.memberName || g.MemberName;
            map[memberName] = {
                prevPoints: g.prevPoints || g.PrevPoints,
                delta6h: g.delta6h || g.Delta6h
            }; 
        });
        setGains(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGains();
  }, [clan.id]);

  const sortedMembers = [...(clan.member_list || [])].sort((a,b) => b.reputation - a.reputation);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="glass-panel w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl overflow-hidden relative z-10 border border-violet-500/30 shadow-[0_0_50px_rgba(139,92,246,0.3)]"
      >
        <div className="px-8 py-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield className="w-7 h-7 text-sky-400" />
              {clan.name}
            </h2>
            <p className="text-sm text-slate-400 font-medium">Radiografía de miembros y ganancias</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading ? (
             <div className="flex items-center justify-center h-40">
                <span className="relative flex h-6 w-6 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-violet-500"></span>
                </span>
                <span className="text-slate-400 font-bold tracking-widest uppercase">Escaneando...</span>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedMembers.map((m, idx) => {
                const gainData = gains[m.name];
                let deltaHtml = null;
                
                if (gainData && gainData.prevPoints !== null) {
                   const delta = gainData.delta6h || 0;
                   
                   let flames = 0;
                   if (delta >= 5000) flames = 1;
                   if (delta >= 10000) flames = 2;
                   if (delta >= 15000) flames = 3;
                   if (delta >= 18000) flames = 4;
                   
                   if (delta > 0) {
                      deltaHtml = (
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1 text-red-400 font-bold text-[13px] bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                            <TrendingUp className="w-3 h-3" /> +{delta.toLocaleString()}
                          </div>
                          {flames > 0 && (
                            <div className="flex gap-0.5">
                                {[...Array(flames)].map((_, i) => (
                                    <span key={i} className="text-[13px] drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]">🔥</span>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                   } else if (delta < 0) {
                      deltaHtml = (
                        <div className="text-red-400 font-bold text-[13px] bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                          {delta.toLocaleString()} ❄️
                        </div>
                      );
                   }
                }

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-700/40 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:text-violet-400 border border-slate-700">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-white font-bold leading-none mb-1">{m.name}</h4>
                        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-700/50">Lvl {m.level}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sky-400 font-bold text-[15px] tracking-wide">{m.reputation?.toLocaleString()}</span>
                      {deltaHtml}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
