import React, { useState } from 'react';
import { EducationalMaterial, enrichMaterial, UserRole } from '../types';
import { ExternalLink, Star, Copy, Check, Edit2, BookOpen, AlertCircle, ShieldAlert, Share2 } from 'lucide-react';

interface MaterialCardProps {
  material: EducationalMaterial;
  onToggleFavorite: (id: string) => void;
  onEdit?: (material: EducationalMaterial) => void;
  onDelete?: (id: string) => void;
  userRole?: UserRole;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onToggleFavorite,
  onEdit,
  onDelete,
  userRole,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [showRuleWarning, setShowRuleWarning] = useState(false);
  const [showShareNotice, setShowShareNotice] = useState(false);

  const enriched = enrichMaterial(material);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${enriched.id}`;
    navigator.clipboard.writeText(shareUrl);
    setShared(true);
    setShowShareNotice(true);
    setTimeout(() => setShared(false), 2000);
    setTimeout(() => setShowShareNotice(false), 4000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(material.url);
    setCopied(true);
    setShowRuleWarning(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setShowRuleWarning(false), 4000);
  };

  // Helper to get platform-specific styles and badges
  const getToolStyles = (tool: string) => {
    switch (tool) {
      case 'Scratch':
        return {
          bg: 'bg-orange-50/50 hover:bg-orange-50',
          border: 'border-orange-200/85',
          accent: 'bg-orange-500',
          text: 'text-orange-700',
          badgeBg: 'bg-orange-100 text-orange-800 border border-orange-200/50',
          icon: '🐱',
        };
      case 'Kahoot':
        return {
          bg: 'bg-indigo-50/50 hover:bg-indigo-50',
          border: 'border-indigo-200/85',
          accent: 'bg-indigo-600',
          text: 'text-indigo-700',
          badgeBg: 'bg-indigo-100 text-indigo-800 border border-indigo-200/50',
          icon: '💜',
        };
      case 'Roblox Studio':
        return {
          bg: 'bg-slate-50/50 hover:bg-slate-50',
          border: 'border-slate-300/85',
          accent: 'bg-slate-800',
          text: 'text-slate-800',
          badgeBg: 'bg-slate-200 text-slate-800 border border-slate-300/50',
          icon: '🧱',
        };
      case 'Micro:bit':
        return {
          bg: 'bg-teal-50/50 hover:bg-teal-50',
          border: 'border-teal-200/85',
          accent: 'bg-teal-600',
          text: 'text-teal-700',
          badgeBg: 'bg-teal-100 text-teal-800 border border-teal-200/50',
          icon: '📟',
        };
      case 'Tynker':
        return {
          bg: 'bg-rose-50/50 hover:bg-rose-50',
          border: 'border-rose-200/85',
          accent: 'bg-rose-500',
          text: 'text-rose-700',
          badgeBg: 'bg-rose-100 text-rose-800 border border-rose-200/50',
          icon: '✨',
        };
      case 'Code.org':
        return {
          bg: 'bg-cyan-50/50 hover:bg-cyan-50',
          border: 'border-cyan-200/85',
          accent: 'bg-cyan-500',
          text: 'text-cyan-700',
          badgeBg: 'bg-cyan-100 text-cyan-800 border border-cyan-200/50',
          icon: '🐝',
        };
      case 'Pilas Bloques':
        return {
          bg: 'bg-blue-50/50 hover:bg-blue-50',
          border: 'border-blue-200/85',
          accent: 'bg-blue-600',
          text: 'text-blue-700',
          badgeBg: 'bg-blue-100 text-blue-800 border border-blue-200/50',
          icon: '👾',
        };
      case 'Minecraft Education':
        return {
          bg: 'bg-emerald-50/50 hover:bg-emerald-50',
          border: 'border-emerald-200/85',
          accent: 'bg-emerald-600',
          text: 'text-emerald-700',
          badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200/50',
          icon: '⛏️',
        };
      default:
        return {
          bg: 'bg-slate-50/50 hover:bg-slate-50',
          border: 'border-slate-200/85',
          accent: 'bg-slate-500',
          text: 'text-slate-700',
          badgeBg: 'bg-slate-150 text-slate-800 border border-slate-200/50',
          icon: '📁',
        };
    }
  };

  const style = getToolStyles(enriched.tool);

  // Difficulty badge coloring helper
  const getDifficultyStyles = (diff: string) => {
    switch (diff) {
      case 'bajo':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200/60';
      case 'intermedio':
        return 'bg-amber-50 text-amber-900 border border-amber-200/60';
      case 'alto':
        return 'bg-rose-50 text-rose-800 border border-rose-200/60';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200/60';
    }
  };

  return (
    <div
      className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-all duration-300 hover:shadow-md hover:border-slate-300"
      id={`material-card-${enriched.id}`}
    >
      {/* Top section: Badges & Favorite button */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1.5">
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg ${style.badgeBg}`}>
            <span className="text-sm">{style.icon}</span>
            {enriched.tool}
          </span>
          <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-pixelitos-yellow border border-slate-950 shadow-3xs">
            Nivel {enriched.level}
          </span>
          <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200/60">
            {enriched.ageRange}
          </span>
          <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${getDifficultyStyles(enriched.difficulty || '')}`}>
            Dificultad: {enriched.difficulty}
          </span>
          {enriched.isNew && (
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500 text-white animate-pulse">
              Nuevo
            </span>
          )}
        </div>

        <button
          onClick={() => onToggleFavorite(enriched.id)}
          className={`p-1.5 rounded-full hover:bg-slate-50 transition-all cursor-pointer ${
            enriched.isFavorite ? 'text-amber-500 fill-amber-400' : 'text-slate-400 hover:text-amber-500'
          }`}
          title={enriched.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          id={`fav-btn-${enriched.id}`}
        >
          <Star className="w-5 h-5" />
        </button>
      </div>

      {/* Title & Description */}
      <div className="mb-4">
        <h3 className="font-sans text-base font-bold text-slate-900 tracking-tight leading-snug mb-1.5 hover:text-slate-800 transition-colors">
          {enriched.title}
        </h3>
        {enriched.description && (
          <p className="font-sans text-xs text-slate-500 leading-relaxed line-clamp-3">
            {enriched.description}
          </p>
        )}
      </div>

      {/* Teacher's internal notes, if any exist */}
      {enriched.notes && (
        <div className="mb-4 p-3 rounded-xl bg-pixelitos-yellow-light/35 border border-pixelitos-yellow-dark/25 text-xs text-slate-800">
          <div className="flex items-center gap-1 font-bold text-slate-800 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-700" />
            <span>Tips de Clase:</span>
          </div>
          <p className="italic font-sans text-slate-600">{enriched.notes}</p>
        </div>
      )}

      {/* Copied Golden Rule Warning Notice */}
      {showRuleWarning && (
        <div className="absolute inset-x-4 top-16 bg-slate-950 text-white rounded-xl p-4 shadow-xl border border-slate-900 flex items-start gap-3.5 text-xs z-10 animate-fade-in">
          <ShieldAlert className="w-5 h-5 shrink-0 text-pixelitos-yellow animate-bounce" />
          <div>
            <strong className="block font-sans text-pixelitos-yellow font-extrabold text-sm mb-0.5">¡Regla de Oro Pixelitos! 👾</strong>
            <span className="text-slate-300">¡Recordá usar copias de los archivos en clase! No edites el original para que sirva a todo el equipo.</span>
          </div>
        </div>
      )}

      {/* Copied Share Notice */}
      {showShareNotice && (
        <div className="absolute inset-x-4 top-16 bg-slate-950 text-white rounded-xl p-4 shadow-xl border border-slate-900 flex items-start gap-3.5 text-xs z-10 animate-fade-in">
          <Share2 className="w-5 h-5 shrink-0 text-purple-400 animate-bounce" />
          <div>
            <strong className="block font-sans text-purple-400 font-extrabold text-sm mb-0.5">¡Enlace Copiado! 🔗</strong>
            <span className="text-slate-300">Enlace copiado en el portapapeles que esperas para compartir tu juego</span>
          </div>
        </div>
      )}

      {/* Bottom section: Action Links */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex flex-wrap gap-2 items-center justify-between">
        {/* Secondary controls (Edit, Delete) */}
        {onEdit && onDelete && userRole !== 'alumno' ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(enriched)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Editar material / Añadir notas"
              id={`edit-btn-${enriched.id}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(enriched.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              title="Eliminar material"
              id={`del-btn-${enriched.id}`}
            >
              <span className="text-sm font-bold leading-none">×</span>
            </button>
          </div>
        ) : (
          <div />
        )}

        {/* Action Buttons */}
        <div className="flex gap-1.5 items-center flex-wrap">
          {userRole !== 'alumno' && (
            <>
              <button
                onClick={handleShare}
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  shared
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-2xs'
                }`}
                title="Compartir juego con ficha de Spotify-style"
                id={`share-btn-${enriched.id}`}
              >
                {shared ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5 text-purple-500" />}
                <span>{shared ? '¡Compartido!' : 'Compartir'}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-2xs'
                }`}
                title="Copiar URL para los alumnos"
                id={`copy-btn-${enriched.id}`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar URL'}</span>
              </button>
            </>
          )}

          {enriched.editorUrl && userRole !== 'alumno' && (
            <a
              href={enriched.editorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-100 hover:bg-orange-100/50 transition-all"
              title="Abrir directamente en el editor de Scratch/Roblox"
              id={`editor-link-${enriched.id}`}
            >
              <span>Editor</span>
              <BookOpen className="w-3 h-3" />
            </a>
          )}

          <a
            href={enriched.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-pixelitos-yellow hover:bg-pixelitos-yellow-dark text-slate-950 border border-pixelitos-yellow-dark/50 transition-all shadow-xs"
            id={`open-link-${enriched.id}`}
          >
            <span>{userRole === 'alumno' ? 'Abrir Juego 🎮' : 'Abrir'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
