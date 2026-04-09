import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCrosshairs, faShieldHalved, faTrophy, faSkullCrossbones, faBolt } from "@fortawesome/free-solid-svg-icons";

// Refactored to a sleek horizontal scrolling marquee to avoid 3D clipping issues
const TiltedScroll = ({ className = "w-full overflow-hidden", dynamicItems = null }) => {
  const defaultItems = [
    { id: "1", text: "Alpha Squad - Dominando la Temporada", icon: faTrophy, color: "text-amber-400" },
    { id: "2", text: "Nueva habilidad desbloqueada: Raikiri", icon: faBolt, color: "text-sky-400" },
    { id: "3", text: "Defensa impenetrable: +50k Rep", icon: faShieldHalved, color: "text-red-400" },
    { id: "4", text: "Objetivo fijado: Shadow Clan", icon: faCrosshairs, color: "text-rose-500" },
    { id: "5", text: "Misión Completada Rango S", icon: faCheckCircle, color: "text-red-500" },
    { id: "6", text: "PvP: 10 Victorias Consecutivas", icon: faSkullCrossbones, color: "text-violet-500" },
  ];

  const items = dynamicItems && dynamicItems.length > 0 ? dynamicItems : defaultItems;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Sleek fade edges, removed heavy 3D skew to stop the cut-off look */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused] py-4">
          {/* Tripled the items for seamless wide screens */}
          {[...items, ...items, ...items].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="group flex h-20 w-64 shrink-0 items-center gap-4 rounded-xl border border-red-500/20 bg-black/60 p-4 shadow-[0_0_15px_rgba(220,38,38,0.05)] transition-all hover:bg-black hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-950/30 border border-red-500/20 group-hover:border-red-500/50 transition-colors">
                <FontAwesomeIcon icon={item.icon} className={`${item.color} w-4 h-4 drop-shadow-md`} />
              </div>
              <div className="flex flex-col flex-1 overflow-hidden relative">
                <p className="text-white font-bold text-xs truncate drop-shadow-md group-hover:text-red-100 transition-colors">{item.text}</p>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(220,38,38,1)] animate-pulse" />
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
