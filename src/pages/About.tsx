import { Music, Github, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VERSION = 'v0.3.0'; 

export const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 animate-in fade-in zoom-in duration-500 select-none relative">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors z-50"
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="w-24 h-24 bg-gradient-to-br from-accent to-red-700 rounded-3xl shadow-[0_20px_50px_rgba(220,38,38,0.3)] flex items-center justify-center mb-8 transform hover:scale-105 transition-transform duration-500">
        <Music size={48} className="text-white drop-shadow-md" />
      </div>
      
      <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">OpusDeck</h1>
      <div className="px-4 py-1.5 rounded-full bg-white/5 text-neutral-400 text-xs font-mono mb-10 border border-white/10 backdrop-blur-sm">
        {VERSION}
      </div>

      <p className="text-neutral-400 text-lg text-center max-w-lg mb-12 leading-relaxed font-light">
        A high-fidelity, Apple Music-inspired web client for <span className="text-white font-medium">Navidrome</span> and Subsonic servers.
        <br/>
        Designed for audiophiles who value aesthetics and bit-perfect playback.
      </p>

      <div className="flex gap-4 mb-16">
        <a 
          href="https://github.com/xiaoran007/OpusDeck" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          <Github size={20} />
          GitHub
        </a>
      </div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-8 text-center text-sm border-t border-white/5 pt-12">
        <div>
          <h3 className="font-semibold text-neutral-300 mb-1">Stack</h3>
          <p className="text-neutral-500">React • Vite • Tailwind</p>
        </div>
        <div>
          <h3 className="font-semibold text-neutral-300 mb-1">License</h3>
          <p className="text-neutral-500">GPLv3 Open Source</p>
        </div>
      </div>
      
      <footer className="mt-auto pt-12 text-xs text-neutral-700">
        © {new Date().getFullYear()} OpusDeck Project. Licensed under GPLv3.
      </footer>
    </div>
  );
};
