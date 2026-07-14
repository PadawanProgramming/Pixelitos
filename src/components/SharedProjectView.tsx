import React, { useState } from 'react';
import { EducationalMaterial, enrichMaterial, UserRole } from '../types';
import { ExternalLink, Sparkles, Copy, Check, Share2, Play, Music, Award, ArrowLeft, Gamepad2, Info } from 'lucide-react';

interface SharedProjectViewProps {
  materialId: string;
  materials: EducationalMaterial[];
  onBackToPortal: () => void;
  userRole?: UserRole;
}

export const SharedProjectView: React.FC<SharedProjectViewProps> = ({
  materialId,
  materials,
  onBackToPortal,
  userRole,
}) => {
  const [copied, setCopied] = useState(false);

  // Find the requested material
  const rawMaterial = materials.find((m) => m.id === materialId);
  if (!rawMaterial) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-950/40 text-red-500 rounded-2xl flex items-center justify-center border border-red-900/50 text-2xl mb-4 animate-bounce">
          ⚠️
        </div>
        <h2 className="font-sans text-xl font-bold tracking-tight">Proyecto No Encontrado</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">
          El enlace que ingresaste podría ser incorrecto o el proyecto fue eliminado.
        </p>
        <button
          onClick={onBackToPortal}
          className="mt-6 px-5 py-2.5 bg-white text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
        >
          Ir al Portal Principal
        </button>
      </div>
    );
  }

  const material = enrichMaterial(rawMaterial);

  // Styling options depending on the tool (just like Spotify album vibe matches the artist)
  const getVibeStyles = (tool: string) => {
    switch (tool) {
      case 'Scratch':
        return {
          fromColor: 'from-orange-600/35',
          toColor: 'to-orange-950',
          accentColor: 'bg-orange-500',
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500/30',
          hoverBorderColor: 'group-hover:border-orange-400',
          glowColor: 'shadow-orange-500/20',
          bannerGradient: 'bg-gradient-to-br from-orange-400 to-amber-600',
          consoleLabel: 'SCRATCH CAT-8',
          icon: '🐱',
        };
      case 'Kahoot':
        return {
          fromColor: 'from-indigo-600/35',
          toColor: 'to-indigo-950',
          accentColor: 'bg-indigo-600',
          textColor: 'text-indigo-400',
          borderColor: 'border-indigo-500/30',
          hoverBorderColor: 'group-hover:border-indigo-400',
          glowColor: 'shadow-indigo-500/20',
          bannerGradient: 'bg-gradient-to-br from-indigo-500 to-violet-700',
          consoleLabel: 'KAHOOT PLATINUM',
          icon: '💜',
        };
      case 'Roblox Studio':
        return {
          fromColor: 'from-slate-600/35',
          toColor: 'to-slate-950',
          accentColor: 'bg-red-600',
          textColor: 'text-slate-400',
          borderColor: 'border-slate-500/30',
          hoverBorderColor: 'group-hover:border-slate-400',
          glowColor: 'shadow-slate-500/20',
          bannerGradient: 'bg-gradient-to-br from-slate-700 to-slate-900',
          consoleLabel: 'ROBLOX STUDIO LUA',
          icon: '🧱',
        };
      case 'Micro:bit':
        return {
          fromColor: 'from-teal-600/35',
          toColor: 'to-teal-950',
          accentColor: 'bg-teal-500',
          textColor: 'text-teal-400',
          borderColor: 'border-teal-500/30',
          hoverBorderColor: 'group-hover:border-teal-400',
          glowColor: 'shadow-teal-500/20',
          bannerGradient: 'bg-gradient-to-br from-teal-400 to-cyan-600',
          consoleLabel: 'MICRO:BIT ANALOG',
          icon: '📟',
        };
      case 'Code.org':
        return {
          fromColor: 'from-cyan-600/35',
          toColor: 'to-cyan-950',
          accentColor: 'bg-cyan-500',
          textColor: 'text-cyan-400',
          borderColor: 'border-cyan-500/30',
          hoverBorderColor: 'group-hover:border-cyan-400',
          glowColor: 'shadow-cyan-500/20',
          bannerGradient: 'bg-gradient-to-br from-cyan-400 to-blue-600',
          consoleLabel: 'CODE ORG EXPRESS',
          icon: '🐝',
        };
      case 'Pilas Bloques':
        return {
          fromColor: 'from-blue-600/35',
          toColor: 'to-blue-950',
          accentColor: 'bg-blue-600',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/30',
          hoverBorderColor: 'group-hover:border-blue-400',
          glowColor: 'shadow-blue-500/20',
          bannerGradient: 'bg-gradient-to-br from-blue-400 to-indigo-600',
          consoleLabel: 'PILAS BLOQUES v2',
          icon: '👾',
        };
      default:
        return {
          fromColor: 'from-purple-600/35',
          toColor: 'to-purple-950',
          accentColor: 'bg-purple-600',
          textColor: 'text-purple-400',
          borderColor: 'border-purple-500/30',
          hoverBorderColor: 'group-hover:border-purple-400',
          glowColor: 'shadow-purple-500/20',
          bannerGradient: 'bg-gradient-to-br from-purple-500 to-pink-600',
          consoleLabel: 'PIXELITOS EMULATOR',
          icon: '🎮',
        };
    }
  };

  const vibe = getVibeStyles(material.tool);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${material.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${vibe.fromColor} ${vibe.toColor} text-white flex flex-col justify-between font-sans selection:bg-[#f0da4c] selection:text-slate-950`} id="shared-project-page">
      
      {/* Dynamic Glassmorphism Nav Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={onBackToPortal}
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-pixelitos-yellow" />
          <span>Volver al Portal</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full text-slate-300 font-bold uppercase tracking-widest border border-white/5">
            🎵 Ficha Pixelitos Compartida
          </span>
        </div>
      </header>

      {/* Main Container - Spotify Album Layout */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-10 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: The "Album / Console" Cover */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="group relative w-full aspect-square max-w-[320px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.03]">
            {/* Gloss Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />

            {/* Micro details like an retro cartridge */}
            <div className="flex justify-between items-center text-[8px] font-mono tracking-widest text-white/40">
              <span>{vibe.consoleLabel}</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> REC
              </span>
            </div>

            {/* Core Artwork / Dynamic Visualizer */}
            <div className={`w-full h-40 rounded-2xl ${vibe.bannerGradient} flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-inner`}>
              {/* Retro scanlines effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
              
              <span className="text-6xl filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
                {vibe.icon}
              </span>
              
              <span className="absolute bottom-2 text-[9px] font-mono tracking-widest text-white/70 bg-black/40 px-2 py-0.5 rounded-full uppercase">
                {material.tool}
              </span>
            </div>

            {/* Audio Wave / Graphic EQ Animation Simulator */}
            <div className="flex items-end justify-center gap-0.5 h-6">
              <span className="w-1 bg-white/20 rounded-full h-2 animate-[pulse_1s_infinite]" />
              <span className="w-1 bg-white/40 rounded-full h-4 animate-[pulse_0.7s_infinite_0.1s]" />
              <span className="w-1 bg-white/70 rounded-full h-5 animate-[pulse_0.9s_infinite_0.2s]" />
              <span className="w-1 bg-[#f0da4c] rounded-full h-6 animate-[pulse_0.5s_infinite_0.3s]" />
              <span className="w-1 bg-white/70 rounded-full h-5 animate-[pulse_0.8s_infinite_0.4s]" />
              <span className="w-1 bg-white/40 rounded-full h-3 animate-[pulse_0.6s_infinite_0.5s]" />
              <span className="w-1 bg-white/20 rounded-full h-1 animate-[pulse_1.1s_infinite_0.6s]" />
            </div>

            {/* Bottom Vinyl/Cartridge label */}
            <div className="border-t border-white/5 pt-3 flex justify-between items-center">
              <div>
                <h4 className="font-sans font-black text-xs text-white truncate max-w-[180px]">{material.title}</h4>
                <p className="font-sans text-[9px] text-slate-400">Pixelitos Academy • 2026</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-xs border border-white/10">
                ⭐
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Metadata, Lyrics (Notes), and Player action button */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/15 transition-all text-[10px] font-black uppercase tracking-wider rounded-full border border-white/5">
              🎓 Nivel {material.level}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/15 transition-all text-[10px] font-black uppercase tracking-wider rounded-full border border-white/5">
              👶 {material.ageRange}
            </span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border border-white/5 bg-slate-900`}>
              🔥 Dificultad: {material.difficulty}
            </span>
          </div>

          {/* Core Info */}
          <div className="space-y-2">
            <span className={`text-xs font-black uppercase tracking-widest ${vibe.textColor}`}>
              PROYECTO INDIVIDUAL
            </span>
            <h1 className="text-3xl md:text-5xl font-sans font-black tracking-tight text-white leading-tight">
              {material.title}
            </h1>
            <p className="text-slate-400 font-sans text-sm md:text-base leading-relaxed">
              {material.description || 'Ficha de proyecto interactivo para el taller de tecnología de la Academia Pixelitos.'}
            </p>
          </div>

          {/* SPOTIFY STYLE "LYRICS" SECTION: Teacher notes */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pixelitos-yellow">
              <Award className="w-4 h-4 shrink-0 text-pixelitos-yellow" />
              <span>Sugerencias para el Taller 📝</span>
            </div>
            <p className="font-sans text-xs md:text-sm text-slate-200 italic leading-relaxed">
              {material.notes || 'No hay notas adicionales de clase para este juego. ¡Lanzalo directamente para jugar y aprender de su código!'}
            </p>
          </div>

          {/* SPOTIFY-STYLE CONTROLLER ROW (Play / Share / Back) */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* HUGE PLAY / LAUNCH BUTTON */}
            <a
              href={material.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3.5 bg-[#f0da4c] hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-full font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-xl hover:shadow-2xl active:scale-95 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 fill-slate-950 stroke-slate-950" />
              <span>LANZAR JUEGO 🎮</span>
            </a>

            {/* SHARE ACTION */}
            {userRole !== 'alumno' && (
              <button
                onClick={handleCopyLink}
                className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-full border text-xs font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? '¡ENLACE COPIADO!' : 'COMPARTIR FICHA'}</span>
              </button>
            )}
          </div>

          {/* Quick Info Bar */}
          {userRole !== 'alumno' && (
            <div className="flex items-center gap-2 text-[11px] text-slate-400 animate-fade-in">
              <Info className="w-3.5 h-3.5 animate-pulse text-pixelitos-yellow" />
              <span>Compartí este enlace con padres para mostrar de forma personalizada los proyectos creados.</span>
            </div>
          )}

        </div>
      </main>

      {/* Brand Footer */}
      <footer className="py-8 border-t border-white/5 bg-black/40 text-center space-y-2 shrink-0">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-[#f0da4c] text-slate-950 rounded-md flex items-center justify-center font-black text-xs">P</div>
          <span className="font-sans font-black text-xs text-white uppercase tracking-wider">Pixelitos Academy</span>
        </div>
        <p className="text-[10px] text-slate-500 max-w-md mx-auto px-4">
          Un taller enfocado en enseñar a los más chicos conceptos de pensamiento lógico, diseño de videojuegos y robótica educativa.
        </p>
      </footer>

    </div>
  );
};
