import React, { useState, useEffect, useRef } from 'react';
import { Upload, X } from 'lucide-react';

const App = () => {
  const [artifacts, setArtifacts] = useState([]);
  const canvasElementRef = useRef(null);

  useEffect(() => {
    const canvas = canvasElementRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const particleCount = width < 768 ? 40 : 100;
    const particles = [];
    
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 2 + 0.2;
        this.alpha = Math.random() * 0.5 + 0.05;
        this.fadeDir = Math.random() > 0.5 ? 0.003 : -0.003;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha += this.fadeDir;
        if (this.alpha <= 0 || this.alpha >= 0.5) this.fadeDir *= -1;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${this.alpha})`;
        ctx.fill();
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleFileUpload = (e) => {
    if (e.target.files?.length) {
      setArtifacts(prev => [...Array.from(e.target.files), ...prev]);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-x-hidden">
      <canvas ref={canvasElementRef} className="fixed inset-0 z-0 pointer-events-none opacity-30" />
      
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center">
        <header className="w-full px-6 pt-16 pb-12 text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4">
            <span className="text-white">ARCHIVE</span>
            <span className="text-purple-500">_</span>
          </h1>
          <div className="text-sm md:text-base font-mono tracking-widest text-purple-400">
            <span className="text-green-400">●</span> SYSTEM ONLINE // {artifacts.length} ARTIFACT{artifacts.length !== 1 ? 'S' : ''}
          </div>
        </header>
        
        <main className="w-full max-w-6xl px-4 pb-24">
          <label className="group cursor-pointer flex flex-col items-center justify-center w-full max-w-2xl mx-auto h-64 mb-16 border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-lg transition-all duration-300 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 text-center">
              <Upload className="w-12 h-12 text-purple-400/60 group-hover:text-purple-400" />
              <div>
                <span className="block font-mono text-sm tracking-widest text-white/70">UPLOAD MORE</span>
                <span className="text-xs text-white/30 mt-1">[ DRAG & DROP OR CLICK ]</span>
              </div>
            </div>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
          
          {artifacts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artifacts.map((file, idx) => (
                <div key={`${file.name}-${idx}`} className="group relative">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 bg-black/40">
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <button onClick={() => setArtifacts(prev => prev.filter((_, i) => i !== idx))} className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-red-900/80 text-white rounded-full opacity-0 group-hover:opacity-100">
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-center text-xs text-white/50 mt-2 truncate font-mono">{file.name}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
