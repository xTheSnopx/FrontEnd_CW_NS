import { useRef, useEffect, useState } from 'react';

const LetterGlitch = ({
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  className = '',
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [glitchText, setGlitchText] = useState('');

  // The character set to use for the glitch effect
  const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const rows = Math.floor(height / fontSize);
    
    // Initialize grid
    const grid = Array.from({ length: rows }, () => 
      Array.from({ length: columns }, () => ({
        char: charSet[Math.floor(Math.random() * charSet.length)],
        color: `rgba(239, 68, 68, ${Math.random() * 0.5 + 0.1})`, // Emerald theme
        updatedAt: Date.now()
      }))
    );

    const draw = () => {
      // Clear with slight opacity for trail effect if smooth is true
      ctx.fillStyle = smooth ? 'rgba(10, 10, 10, 0.1)' : 'rgba(10, 10, 10, 1)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const now = Date.now();

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          const cell = grid[r][c];

          // Randomly update characters
          if (now - cell.updatedAt > Math.random() * glitchSpeed * 10) {
            cell.char = charSet[Math.floor(Math.random() * charSet.length)];
            // Occasional bright white or bright emerald flashes
            const isHighlight = Math.random() > 0.95;
            cell.color = isHighlight 
              ? `rgba(255, 255, 255, 0.9)` 
              : `rgba(239, 68, 68, ${Math.random() * 0.6 + 0.2})`;
            cell.updatedAt = now;
          }

          ctx.fillStyle = cell.color;
          ctx.fillText(cell.char, c * fontSize + fontSize/2, r * fontSize + fontSize/2);
        }
      }

      // Vignette effects (Cyberpunk style)
      if (outerVignette) {
        const gradient = ctx.createRadialGradient(width/2, height/2, width/4, width/2, height/2, width);
        gradient.addColorStop(0, 'rgba(10, 10, 10, 0)');
        gradient.addColorStop(1, 'rgba(10, 10, 10, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [glitchSpeed, centerVignette, outerVignette, smooth]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full"
      />
    </div>
  );
};

export default LetterGlitch; 
