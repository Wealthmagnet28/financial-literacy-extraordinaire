import { useRef, useEffect } from 'react';
import '../styles/global.css';
import '../styles/components.css';

export default function Starfield({ count = 160 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 6000,
      r: Math.random() * 1.8 + 0.3,
      pulse: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.pulse += 0.02;
        const o = s.opacity * (0.6 + 0.4 * Math.sin(s.pulse));
        ctx.beginPath();
        ctx.arc(s.x % canvas.width, s.y % canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,180,255,${o})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
