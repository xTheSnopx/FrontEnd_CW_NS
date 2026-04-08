import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCrosshairs, faShieldHalved, faTrophy, faSkullCrossbones, faBolt } from "@fortawesome/free-solid-svg-icons";

const TiltedScroll = ({ className = "w-full overflow-hidden" }) => {
  const items = [
    { id: "1", text: "Alpha Squad - Dominando la Temporada", icon: faTrophy, color: "text-amber-400" },
    { id: "2", text: "Nueva habilidad desbloqueada: Raikiri", icon: faBolt, color: "text-sky-400" },
    { id: "3", text: "Defensa impenetrable: +50k Rep", icon: faShieldHalved, color: "text-red-400" },
    { id: "4", text: "Objetivo fijado: Shadow Clan", icon: faCrosshairs, color: "text-rose-500" },
    { id: "5", text: "Misión Completada Rango S", icon: faCheckCircle, color: "text-red-500" },
    { id: "6", text: "PvP: 10 Victorias Consecutivas", icon: faSkullCrossbones, color: "text-violet-500" },
  ];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <div
          className="flex animate-skew-scroll gap-6 sm:gap-8 hover:[animation-play-state:paused]"
        >
          {/* Duplicate the items for seamless looping */}
          {[...items, ...items].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="group flex h-24 w-72 shrink-0 items-center justify-between rounded-2xl border border-white/5 bg-[#121212] p-6 shadow-xl transition-all hover:bg-white/5 hover:border-white/10"
            >
              <div className="flex flex-col gap-1 w-full relative">
                <FontAwesomeIcon icon={item.icon} className={`${item.color} w-6 h-6 mb-2 drop-shadow-md`} />
                <p className="text-white font-semibold text-sm truncate">{item.text}</p>
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TiltedScroll;
