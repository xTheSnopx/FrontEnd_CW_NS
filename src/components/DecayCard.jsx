import React, { useEffect, useRef } from 'react';

const DecayCard = ({ width = 300, height = 400, image = '', className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let img = new Image();
    img.src = image;

    let animationFrameId;

    img.onload = () => {
      const render = () => {
        ctx.clearRect(0, 0, width, height);
        
        // Draw the base image
        ctx.globalAlpha = 1.0;
        ctx.filter = `brightness(1) contrast(1.2)`;
        ctx.drawImage(img, 0, 0, width, height);

        // Simulate a simple RGB split/glitch effect randomly
        if (Math.random() > 0.95) {
          const shiftValue = Math.random() * 10 - 5;
          
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
          ctx.fillRect(shiftValue, 0, width, height);
          
          ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
          ctx.fillRect(-shiftValue, 0, width, height);
          ctx.globalCompositeOperation = 'source-over';
        }

        // Simulate static lines
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        for(let i=0; i<height; i+=4) {
             if(Math.random() > 0.5) {
                 ctx.fillRect(0, i, width, 1);
             }
        }

        animationFrameId = requestAnimationFrame(render);
      };

      render();
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height, image]);

  return (
    <div 
      className={`relative overflow-hidden rounded-xl border border-white/10 ${className}`}
      style={{ width, height }}
    >
      {/* Black fallback background */}
      <div className="absolute inset-0 bg-black -z-10" />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full object-cover opacity-80 mix-blend-screen"
        style={{ filter: 'grayscale(100%) contrast(150%)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      
      {/* Glowing vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,1)] pointer-events-none" />
    </div>
  );
};

export default DecayCard;
