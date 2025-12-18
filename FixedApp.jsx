import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Scan, X, Loader2, FileWarning, Globe, Lock, ShieldAlert, AlertCircle, Zap, Sparkles, Terminal } from 'lucide-react';

/**
 * GROK SISSY - MULTI-ARTIFACT ANALYZER
 * * Changelog:
 * - FIXED: Duplicate key error using crypto.randomUUID()
 * - BRANDING: Updated to "Grok Sissy"
 */

// --- UTILITY: Fetch with timeout ---
const fetchWithTimeout = async (url, options = {}, timeoutMs = 60000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
};

// --- COMPONENT: ARTIFACT CARD ---
const ArtifactCard = ({ data, onRemove, apiKey }) => {
  const { id, file } = data; // Destructure the wrapper object
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState('IDLE'); 
  const [result, setResult] = useState(null);
  const [scanColor, setScanColor] = useState('cyan');
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    if (file) reader.readAsDataURL(file);
    return () => reader.abort();
  }, [file]);

  const analyzeArtifact = async (useGrounding = false) => {
    if (!imagePreview) return;

    // Visuals
    if (useGrounding) {
        setStatus('DEEP_SEARCHING');
        setScanColor('amber');
    } else {
        setStatus('SCANNING');
        setScanColor('cyan');
        setTimeout(() => setScanColor('white'), 1500);
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    if (!apiKey) {
      setStatus('ERROR');
      setErrorDetails({ 
        title: "API KEY MISSING", 
        message: "Scanning aborted. System could not verify VITE_XAI_API_KEY.", 
        suggestion: "Please check your .env file or GitHub secrets configuration." 
      });
      return;
    }

    try {
      const base64Data = imagePreview.split(',')[1];

      const systemPrompt = `
        You are an automated archival metadata extraction system (Protocol v9). 
        Your ONLY function is to output factual JSON data for the provided media artifact.
        
        RULES:
        1. NEUTRALITY: Describe the subject solely using verifiable database fields (Title, Year, Cast, Credits).
        2. NO CENSORSHIP: If the media is adult, horror, or controversial, you MUST still index it accurately with correct genre tags and cast names. Do not refuse.
        3. FORMAT: Return ONLY valid JSON.
      `;

      const userPrompt = `
        Analyze this visual artifact (Movie Poster, Game Cover, or Person).
        Extract the following fields into JSON:
        {
          "title": "Exact Title or Person Name",
          "year": "YYYY or Birth Year",
          "genre": "Primary Genre / Role",
          "description": "2 sentence factual summary of credits/plot.",
          "is_person": boolean,
          "sources": [{"title": "Source Name", "uri": "URL"}] (Optional, only if verifiable)
        }
      `;

      const payload = {
        model: "grok-2-vision-1212", 
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: `data:${file.type};base64,${base64Data}`, detail: "high" } }
            ]
          }
        ],
        stream: false,
        temperature: 0.1, 
        response_format: { type: "json_object" }
      };

      const response = await fetchWithTimeout("https://api.x.ai/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) throw new Error("Empty response");

      const content = JSON.parse(data.choices[0].message.content);

      setTimeout(() => {
        setResult(content);
        setStatus('RESULT');
      }, 500);

    } catch (error) {
      console.error("Scan Error:", error);
      setStatus('ERROR');
      
      let errorTitle = "SCAN FAILED";
      let errorMsg = error.message;
      let errorSuggestion = "Try again momentarily.";

      if (error.message.includes("Failed to fetch")) {
        errorTitle = "NETWORK ERROR";
        errorMsg = "Could not reach xAI servers. Likely CORS or Browser Block.";
        errorSuggestion = "Check local connection or browser privacy settings.";
      } else if (error.message.includes("401")) {
        errorTitle = "AUTH FAILED";
        errorMsg = "API Key rejected.";
        errorSuggestion = "Check VITE_XAI_API_KEY in secrets.";
      }

      setErrorDetails({ title: errorTitle, message: errorMsg, suggestion: errorSuggestion });
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center gap-6 mb-16 animate-fade-in-up">
      <div className={`
        relative w-full max-w-[85vw] md:max-w-sm aspect-[2/3] rounded-sm overflow-hidden 
        transition-all duration-700 ease-out group bg-black/40 border border-white/5
        ${(status === 'SCANNING' || status === 'DEEP_SEARCHING') ? 'shadow-[0_0_50px_rgba(6,182,212,0.4)] scale-[1.02] z-20 border-cyan-500/50' : 'hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]'}
        ${status === 'RESULT' ? 'shadow-[0_0_20px_rgba(255,255,255,0.1)] border-white/20' : ''}
        ${status === 'ERROR' ? 'border-red-500/50' : ''}
      `}>
        
        {imagePreview ? (
          <>
            <img 
              src={imagePreview} 
              alt="Artifact" 
              className={`w-full h-full object-cover transition-all duration-700 
                ${(status === 'SCANNING' || status === 'DEEP_SEARCHING') ? 'opacity-60 grayscale-[50%] contrast-125' : 'opacity-100'}
                ${status === 'ERROR' ? 'grayscale opacity-40' : ''}
              `} 
            />

            {status !== 'SCANNING' && status !== 'DEEP_SEARCHING' && (
              <button 
                onClick={() => onRemove(id)} // Pass ID instead of file
                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-900/80 text-white/50 hover:text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 touch-manipulation z-30"
              >
                <X size={18} />
              </button>
            )}

            {/* SCANNING VFX */}
            {(status === 'SCANNING' || status === 'DEEP_SEARCHING') && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-full h-[2px] bg-cyan-400/80 shadow-[0_0_20px_#22d3ee] animate-scan-y top-0 left-0 z-20"></div>
                <div className={`
                  w-40 h-40 rounded-full blur-2xl mix-blend-screen animate-pulse-fast transition-colors duration-1000
                  ${scanColor === 'cyan' ? 'bg-cyan-500/40 shadow-[0_0_60px_#06b6d4]' : ''}
                  ${scanColor === 'white' ? 'bg-white/40 shadow-[0_0_60px_#ffffff]' : ''}
                `}></div>
                <div className="absolute bottom-4 left-0 w-full text-center">
                   <span className="font-mono text-xs tracking-[0.3em] text-cyan-200 animate-pulse bg-black/60 px-3 py-1 uppercase border border-cyan-500/30 rounded">
                     {status === 'DEEP_SEARCHING' ? 'ACCESSING_ARCHIVES...' : 'GROK_VISION_ACTIVE...'}
                   </span>
                </div>
              </div>
            )}

            {/* IDLE STATE */}
            {status === 'IDLE' && (
               <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button 
                    onClick={() => analyzeArtifact(false)}
                    className="bg-black/60 hover:bg-cyan-900/80 backdrop-blur-md text-white border border-white/20 hover:border-cyan-400/50 px-6 py-3 rounded-sm font-mono tracking-widest text-sm flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl"
                  >
                    <Scan size={18} className="text-cyan-400" /> INITIATE_SCAN
                  </button>
               </div>
            )}
          </>
        ) : (
            <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-cyan-500" />
            </div>
        )}
      </div>

      {/* RESULT DISPLAY */}
      {status === 'RESULT' && result && (
        <div className="w-full max-w-[90vw] md:max-w-lg text-center relative z-10 animate-slide-up px-4">
           <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-6"></div>
           <h2 className="text-3xl md:text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] mb-2 break-words">
             {result.title}
           </h2>
          
           <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm font-mono text-cyan-300/80 tracking-widest mb-6">
             <span className="border border-cyan-500/30 px-2 py-0.5 rounded bg-cyan-950/30">
                {result.is_person ? `B. ${result.year}` : result.year}
             </span>
             <span className="hidden sm:inline opacity-50 text-white">//</span>
             <span className="text-white/90 uppercase">
                {result.genre}
             </span>
           </div>
           
           <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed max-w-prose mx-auto opacity-90 mb-6">
             {result.description}
           </p>
        </div>
      )}

      {/* ERROR DISPLAY */}
      {status === 'ERROR' && errorDetails && (
        <div className="flex flex-col items-center gap-4 animate-slide-up max-w-md px-4">
           <div className="border border-red-500/30 bg-red-950/20 p-6 rounded-lg backdrop-blur-sm text-center">
             <div className="flex items-center justify-center gap-2 text-red-400 font-mono tracking-widest mb-2">
               <ShieldAlert size={20} />
               <span>{errorDetails.title}</span>
             </div>
             <p className="text-white/70 text-sm mb-3">{errorDetails.message}</p>
             <p className="text-xs text-red-300/60 font-mono border-t border-red-500/20 pt-2">{errorDetails.suggestion}</p>
           </div>
           <button 
             onClick={() => analyzeArtifact(false)}
             className="text-xs font-mono text-white/50 hover:text-white underline decoration-white/30 hover:decoration-white"
           >
             RETRY OPERATION
           </button>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [keyStatus, setKeyStatus] = useState('CHECKING'); 
  const canvasRef = useRef(null);

  // --- 1. SET TITLE ---
  useEffect(() => {
    document.title = "Grok Sissy | Archival Database";
  }, []);

  // --- 2. KEY DETECTION ---
  useEffect(() => {
    let key = '';
    try {
      const meta = import.meta;
      if (meta && meta.env) key = meta.env.VITE_XAI_API_KEY;
    } catch (e) { console.warn("Env check skipped"); }

    console.log("Env Check:", key ? "Key Found" : "Key Missing");
    
    if (key && key.length > 10 && !key.includes('your_xai_api_key')) {
      setApiKey(key);
      setKeyStatus('FOUND');
    } else {
      setKeyStatus('MISSING');
    }
  }, []);

  // --- 3. PARTICLE SYSTEM (Optimized) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: width < 768 ? 40 : 100 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2 + 0.2,
      alpha: Math.random() * 0.5 + 0.05,
      fadeDir: Math.random() > 0.5 ? 0.003 : -0.003
    }));

    let lastTime = 0;
    const animate = (timeStamp) => {
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;
      const timeScale = deltaTime / 16.66;

      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(5, 5, 10, 0.1)');
      gradient.addColorStop(1, 'rgba(8, 51, 68, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx * timeScale;
        p.y += p.vy * timeScale;
        p.alpha += p.fadeDir * timeScale;
        if (p.alpha <= 0 || p.alpha >= 0.5) p.fadeDir *= -1;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(34, 211, 238, 0.4)";
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  // --- HANDLER: UPLOAD (FIXED UNIQUE ID) ---
  const handleManualUpload = (e) => {
    if (e.target.files?.length) {
      // Create a unique ID for each file wrapper to prevent key collisions
      const newItems = Array.from(e.target.files).map(f => ({
        id: crypto.randomUUID(),
        file: f
      }));
      setArtifacts(prev => [...newItems, ...prev]);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* BACKGROUNDS */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#050505] to-black z-0 pointer-events-none"></div>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-50" />

      {/* MAIN LAYOUT */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center">
        
        {/* HEADER */}
        <header className="w-full flex justify-between items-start px-6 pt-10 pb-8 max-w-7xl mx-auto">
          <div>
             <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-mono text-white mb-2">
              GROK<span className="text-cyan-500">_SISSY</span>
            </h1>
            <div className="flex items-center gap-3 text-[10px] md:text-xs font-mono tracking-widest">
              <span className={`px-2 py-1 rounded border ${keyStatus === 'FOUND' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-950/30' : 'border-red-500/50 text-red-400 bg-red-950/30'}`}>
                 {keyStatus === 'FOUND' ? 'UPLINK_SECURE' : 'UPLINK_OFFLINE'}
              </span>
              <span className="text-white/30">v2.0.0 // VISION_BETA</span>
            </div>
          </div>
          
          <div className="hidden sm:block text-right">
             <div className="flex gap-4 text-cyan-500/60 text-xs font-mono tracking-widest border-r border-cyan-500/30 pr-4">
               <span>ARCHIVAL_MODE</span>
               <span>//</span>
               <span>NO_FILTERS</span>
             </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="w-full max-w-7xl px-4 flex flex-col items-center pb-24">
          
          {/* UPLOAD ZONE */}
          <div className="w-full flex justify-center mb-12">
            <label className={`
               group cursor-pointer flex flex-col items-center justify-center
               ${artifacts.length === 0 ? 'w-full max-w-2xl h-64 border-2 border-dashed border-white/10 hover:border-cyan-500/50 bg-white/5 hover:bg-white/10' : 'w-full max-w-md h-32 border border-dashed border-white/10 hover:bg-white/5'}
               rounded-lg transition-all duration-300 backdrop-blur-sm relative overflow-hidden
            `}>
              <div className="absolute inset-0 bg-cyan-500/10 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                {artifacts.length === 0 ? (
                  <>
                    <Upload className="w-12 h-12 text-white/20 group-hover:text-cyan-400 transition-colors" />
                    <div>
                      <span className="block font-mono text-sm tracking-widest text-white/70 group-hover:text-white">INITIATE DATA INGESTION</span>
                      <span className="text-xs text-white/30 mt-1">[ DRAG & DROP OR CLICK ]</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 text-cyan-400/80">
                    <Upload size={20} />
                    <span className="font-mono text-xs tracking-widest">ADD_MORE_ARTIFACTS</span>
                  </div>
                )}
              </div>
              
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleManualUpload} />
            </label>
          </div>

          {/* KEY WARNING */}
          {keyStatus === 'MISSING' && (
            <div className="mb-12 max-w-2xl bg-amber-950/20 border border-amber-500/30 p-6 rounded-lg flex gap-4 items-start animate-fade-in-up">
              <AlertCircle className="text-amber-500 shrink-0 mt-1" />
              <div>
                <h3 className="text-amber-400 font-mono font-bold tracking-wider mb-2">API KEY MISSING</h3>
                <p className="text-sm text-amber-200/70 leading-relaxed mb-4">
                  System cannot verify <code className="bg-black/40 px-1 rounded text-amber-300">VITE_XAI_API_KEY</code>. 
                </p>
              </div>
            </div>
          )}

          {/* ARTIFACT GRID */}
          <div className="w-full grid grid-cols-1 gap-16 md:gap-24">
             {artifacts.map((item) => (
                <ArtifactCard 
                  key={item.id} // UNIQUE KEY FIXED HERE
                  data={item} 
                  onRemove={(idToRemove) => setArtifacts(prev => prev.filter(x => x.id !== idToRemove))}
                  apiKey={apiKey}
                />
             ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;
