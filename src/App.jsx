import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const App = () => {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [time, setTime] = useState(0);
  const lastTimeRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Initialize particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      ax: 0,
      ay: 0,
    }));
    setParticles(newParticles);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || particles.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let frameCount = 0;
    
    const animate = (currentTime) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = currentTime;
      const deltaTime = Math.min((currentTime - lastTimeRef.current) / 1000, 0.016);
      lastTimeRef.current = currentTime;
      
      frameCount++;
      const targetFps = frameCount % 2 === 0 ? 60 : 144;
      
      // Physics
      let updatedParticles = particles.map(p => ({
        ...p,
        ay: 0.1,
        vy: p.vy + p.ay * deltaTime,
        y: p.y + p.vy * deltaTime,
        vx: p.vx * 0.99,
        x: p.x + p.vx * deltaTime,
      }));
      
      // Boundary collision
      updatedParticles = updatedParticles.map(p => {
        if (p.y > canvas.height) {
          return { ...p, y: canvas.height, vy: -p.vy * 0.8 };
        }
        if (p.y < 0) return { ...p, y: 0, vy: -p.vy * 0.8 };
        if (p.x > canvas.width) return { ...p, x: canvas.width, vx: -p.vx * 0.8 };
        if (p.x < 0) return { ...p, x: 0, vx: -p.vx * 0.8 };
        return p;
      });
      
      setParticles(updatedParticles);
      
      // Render
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'rgba(147, 51, 234, 0.8)';
      updatedParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [particles]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-80"
      />
      <div className="relative z-10 text-center backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">ARCHIVE_</h1>
        <p className="text-white/80 text-lg">Physics Engine Demo</p>
      </div>
    </div>
  );
};

export default App;
