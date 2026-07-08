import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  RotateCcw,
  FileDown,
  FileUp,
  Copy,
  Check,
  Grid,
  Calendar,
  MessageSquare,
  Key,
  Sparkles,
  ShieldCheck,
  Users,
  Briefcase,
  AlertTriangle,
  FileText,
  BookOpen,
  Menu,
  X,
  Undo,
  HelpCircle,
} from 'lucide-react';
import { EducationalMaterial, ToolType, AgeGroupType, LevelType, AgeRangeType, DifficultyType, enrichMaterial } from './types';
import { INITIAL_MATERIALS } from './data/initialMaterials';
import { MaterialCard } from './components/MaterialCard';
import { ClassPlanner } from './components/ClassPlanner';
import { TeacherBulletin } from './components/TeacherBulletin';
import { AccountsSection } from './components/AccountsSection';
import { ResourcesSection } from './components/ResourcesSection';
import { MaterialModal } from './components/MaterialModal';
import { exportProjectsToPDF } from './utils/pdfExport';

const TUTORIAL_STEPS = [
  {
    title: "¡Bienvenidos a Pixelitos! 👾",
    content: "Este es el portal central de gestión y repositorio educativo de Pixelitos. Diseñado especialmente para profesores, coordinadoras y dirección, aquí centralizamos todas nuestras herramientas de forma ágil y divertida.",
    tab: "repository",
    tip: "Te acompañaremos en un recorrido de 7 pasos rápidos por las funcionalidades clave del sistema para que le saques el máximo provecho."
  },
  {
    title: "🎮 Catálogo y Buscador de Proyectos",
    content: "Explorá nuestro catálogo con más de 100 proyectos reales listos para dar en clase (Scratch, Pilas Bloques, Roblox, Minecraft, etc). Podés filtrar por herramienta, edad, nivel de los alumnos o dificultad, y buscar por palabras clave.",
    tab: "repository",
    tip: "Hacé clic en 'Lanzar' para abrir la actividad en clase, 'Copiar URL' para enviarla en un clic, o la estrella para guardarla en tus favoritos personales."
  },
  {
    title: "📝 Planificador Semanal Interactivo",
    content: "¡Se terminó planificar en borradores! En esta pestaña podés seleccionar los días de la semana, vincular directamente proyectos del catálogo, agregar notas pedagógicas y descargar tu planificación escolar completa con formato oficial en PDF.",
    tab: "planner",
    tip: "El documento PDF exportado tiene un diseño limpio, profesional e institucional, ideal para presentar a tus coordinadoras o directivas."
  },
  {
    title: "🔑 Cuentas y Credenciales Scratch",
    content: "Mantené el control de tus clases sin perder tiempo. Acá contás con un llavero digital centralizado con todas las cuentas oficiales de Scratch de Pixelitos, organizadas por niveles para tus alumnos.",
    tab: "accounts",
    tip: "Hacé clic en el botón de copiado rápido para copiar los accesos instantáneamente y pegarlos en el aula sin tipear nada manual."
  },
  {
    title: "📚 Biblioteca de Recursos Oficiales",
    content: "Acceso directo a las carpetas institucionales de Google Drive de Pixelitos. Encontrá material didáctico imprimible, manuales oficiales para profes, carpetas de gráficos y plantillas de diseño para personalizar tus clases.",
    tab: "resources",
    tip: "Los botones te dirigen de forma directa y segura a las carpetas compartidas del equipo en la nube."
  },
  {
    title: "📢 Pizarra de Novedades del Staff",
    content: "Nuestra cartelera digital compartida. Enterate de los comunicados de coordinación, eventos del calendario de la academia, recordatorios importantes o notas para los profesores.",
    tab: "bulletin",
    tip: "¡No olvides revisarla al iniciar tu jornada para estar al tanto de cualquier cambio o anuncio importante!"
  },
  {
    title: "💾 Gestión de Respaldos e Historial",
    content: "En el pie de la barra lateral izquierda tenés las opciones avanzadas para coordinadoras: Guardar tu base de datos de proyectos en un archivo JSON, cargar una copia externa, o restablecer todo el catálogo al estado original.",
    tab: "repository",
    tip: "¡Súper Seguro! Al restablecer o limpiar datos, el sistema guarda automáticamente una copia de seguridad de recuperación temporal por si querés deshacer el cambio."
  }
];

export default function App() {
  // State for educational materials
  const [materials, setMaterials] = useState<EducationalMaterial[]>(() => {
    const saved = localStorage.getItem('pixelitos_materials');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading materials from localStorage:', e);
      }
    }
    return INITIAL_MATERIALS;
  });

  // States for specific filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<ToolType | 'Todos'>('Todos');
  const [selectedLevel, setSelectedLevel] = useState<LevelType | 'Todos'>('Todos');
  const [selectedAgeRange, setSelectedAgeRange] = useState<AgeRangeType | 'Todos'>('Todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyType | 'Todos'>('Todos');
  const [sortBy, setSortBy] = useState<'title' | 'recent' | 'favorites'>('recent');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const scrollToTop = () => {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Interactive Tutorial State
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Synchronize tutorial steps with active tab
  useEffect(() => {
    if (isTutorialOpen) {
      const step = TUTORIAL_STEPS[tutorialStep];
      if (step && step.tab) {
        setActiveTab(step.tab as any);
      }
    }
  }, [tutorialStep, isTutorialOpen]);

  // Reset pagination to first page when any filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTool, selectedLevel, selectedAgeRange, selectedDifficulty, sortBy]);

  // UI States
  const [activeTab, setActiveTab] = useState<'repository' | 'planner' | 'accounts' | 'resources' | 'bulletin'>('repository');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materialToEdit, setMaterialToEdit] = useState<EducationalMaterial | null>(null);
  const [scratchUserCopied, setScratchUserCopied] = useState(false);
  const [scratchPasswordCopied, setScratchPasswordCopied] = useState(false);
  const [showResetNotice, setShowResetNotice] = useState(false);
  const [hasRecoveryBackup, setHasRecoveryBackup] = useState(() => {
    return !!localStorage.getItem('pixelitos_materials_recovery_backup');
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('pixelitos_materials', JSON.stringify(materials));
  }, [materials]);

  // Copy Scratch user helper
  const handleCopyUser = () => {
    navigator.clipboard.writeText('profespixelitos');
    setScratchUserCopied(true);
    setTimeout(() => setScratchUserCopied(false), 2000);
  };

  // Copy Scratch password helper
  const handleCopyPassword = () => {
    navigator.clipboard.writeText('pixelitos123');
    setScratchPasswordCopied(true);
    setTimeout(() => setScratchPasswordCopied(false), 2000);
  };

  // Reset to original data with automatic recovery copy
  const handleResetToDefaults = () => {
    if (window.confirm('⚠️ ¡CUIDADO! ¿Estás seguro de que deseas restablecer la base de datos completa de Pixelitos? Se perderán todas tus modificaciones personales (proyectos y planes) y la base de datos volverá a su estado original.\n\n(No te preocupes: guardaremos automáticamente una copia de seguridad temporal de tus datos actuales por si necesitas deshacer este cambio).')) {
      // Create emergency copies first
      localStorage.setItem('pixelitos_materials_recovery_backup', JSON.stringify(materials));
      const savedPlans = localStorage.getItem('pixelitos_class_plans');
      if (savedPlans) {
        localStorage.setItem('pixelitos_class_plans_recovery_backup', savedPlans);
      }
      
      setMaterials(INITIAL_MATERIALS);
      setHasRecoveryBackup(true);
      setShowResetNotice(true);
      // Let the notice linger a bit more to give them time to undo
      setTimeout(() => setShowResetNotice(false), 12000);
    }
  };

  // Undo the database reset and restore previous user work
  const handleRestoreEmergencyBackup = () => {
    const savedMaterials = localStorage.getItem('pixelitos_materials_recovery_backup');
    const savedPlans = localStorage.getItem('pixelitos_class_plans_recovery_backup');
    
    if (savedMaterials) {
      try {
        setMaterials(JSON.parse(savedMaterials));
        if (savedPlans) {
          localStorage.setItem('pixelitos_class_plans', savedPlans);
        }
        alert('¡Se han restaurado con éxito todos tus datos, proyectos y planificaciones anteriores!');
        setHasRecoveryBackup(false);
        setShowResetNotice(false);
        // Force state update across the application
        setTimeout(() => window.location.reload(), 300);
      } catch (e) {
        console.error('Error recovering backup:', e);
        alert('Hubo un error al intentar leer la copia de seguridad.');
      }
    } else {
      alert('No se encontró ninguna copia de seguridad de recuperación temporal.');
    }
  };

  // Export to JSON file
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(materials, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pixelitos_materials_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import from JSON file
  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target.files?.[0];
    if (!file) return;

    fileReader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && 'url' in parsed[0] && 'tool' in parsed[0]) {
          setMaterials(parsed);
          alert('¡Se importaron con éxito los materiales pedagógicos!');
        } else {
          alert('El archivo JSON no tiene un formato válido de materiales.');
        }
      } catch (err) {
        alert('Ocurrió un error al leer el archivo de copia de seguridad.');
        console.error(err);
      }
    };
    fileReader.readAsText(file);
  };

  // Save or Edit Material handler
  const handleSaveMaterial = (savedMaterial: EducationalMaterial) => {
    const exists = materials.some((m) => m.id === savedMaterial.id);
    if (exists) {
      setMaterials(materials.map((m) => (m.id === savedMaterial.id ? savedMaterial : m)));
    } else {
      setMaterials([savedMaterial, ...materials]);
    }
  };

  // Delete Material handler
  const handleDeleteMaterial = (id: string) => {
    const target = materials.find((m) => m.id === id);
    if (!target) return;
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${target.title}"?`)) {
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setMaterials(
      materials.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
    );
  };

  // Trigger Edit Modal
  const handleTriggerEdit = (material: EducationalMaterial) => {
    setMaterialToEdit(material);
    setIsModalOpen(true);
  };

  // Trigger Add Modal
  const handleTriggerAdd = () => {
    setMaterialToEdit(null);
    setIsModalOpen(true);
  };

  // PDF Export Trigger
  const handleDownloadPDF = () => {
    exportProjectsToPDF(materials, {
      level: selectedLevel,
      tool: selectedTool,
      difficulty: selectedDifficulty,
      ageRange: selectedAgeRange,
      searchQuery: searchQuery,
    });
  };

  // Compute stats for dashboard
  const stats = useMemo(() => {
    const counts = {
      total: materials.length,
      favorites: materials.filter((m) => m.isFavorite).length,
      scratch: materials.filter((m) => m.tool === 'Scratch').length,
      kahoot: materials.filter((m) => m.tool === 'Kahoot').length,
      roblox: materials.filter((m) => m.tool === 'Roblox Studio').length,
      microbit: materials.filter((m) => m.tool === 'Micro:bit').length,
    };
    return counts;
  }, [materials]);

  // Filtered and Sorted materials (enriched with levels/ageGroups dynamically first!)
  const filteredAndSortedMaterials = useMemo(() => {
    let result = materials.map((m) => enrichMaterial(m));

    // Search query matching
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          (m.description && m.description.toLowerCase().includes(query)) ||
          m.tool.toLowerCase().includes(query) ||
          (m.notes && m.notes.toLowerCase().includes(query)) ||
          (m.level && m.level.toLowerCase().includes(query))
      );
    }

    // Tool platform filter
    if (selectedTool !== 'Todos') {
      result = result.filter((m) => m.tool === selectedTool);
    }

    // Level filter
    if (selectedLevel !== 'Todos') {
      result = result.filter((m) => m.level === selectedLevel);
    }

    // Age Range filter
    if (selectedAgeRange !== 'Todos') {
      result = result.filter((m) => m.ageRange === selectedAgeRange);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'Todos') {
      result = result.filter((m) => m.difficulty === selectedDifficulty);
    }

    // Sorting logic
    if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'favorites') {
      result.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
    } else {
      // Recent / Date Added sorting
      result.sort((a, b) => {
        const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
        const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
        return dateB - dateA;
      });
    }

    return result;
  }, [materials, searchQuery, selectedTool, selectedLevel, selectedAgeRange, selectedDifficulty, sortBy]);

  const ITEMS_PER_PAGE = 25;
  const totalPages = Math.ceil(filteredAndSortedMaterials.length / ITEMS_PER_PAGE);
  const paginatedMaterials = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedMaterials.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedMaterials, currentPage]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col lg:flex-row" id="pixelitos-root">
      
      {/* 1. SIDEBAR - PERSISTENT ON DESKTOP, DRAWER ON MOBILE */}
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 text-white flex flex-col justify-between transition-all duration-300 overflow-y-auto ${
        (isSidebarOpen || (isTutorialOpen && tutorialStep !== 0)) ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 ${
        (isSidebarCollapsed && !isTutorialOpen) ? 'lg:-ml-72 lg:opacity-0 lg:pointer-events-none' : 'lg:ml-0 lg:opacity-100'
      }`}>
        
        {/* Top Branding Section */}
        <div className={`p-5 flex flex-col gap-6 transition-all duration-300 ${
          isTutorialOpen && tutorialStep === 0
            ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-[1.01] shadow-lg shadow-amber-400/20 rounded-xl bg-slate-900/50 z-50'
            : ''
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center shadow-md shrink-0 border border-slate-800">
                <svg viewBox="0 0 100 100" className="w-6 h-6">
                  <path
                    d="M 32 36 L 16 50 L 32 64"
                    fill="none"
                    stroke="#f0da4c"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 45 68 L 55 32"
                    fill="none"
                    stroke="#f0da4c"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 68 36 L 84 50 L 68 64"
                    fill="none"
                    stroke="#f0da4c"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col max-w-[170px]">
                <span className="font-pixel text-[13px] tracking-[0.12em] text-[#f0da4c] leading-none">PIXELITOS</span>
                <span className="text-[7.5px] font-sans font-bold text-slate-400 tracking-normal mt-1.5 uppercase leading-tight">Escuela de programación para mentes creativas</span>
              </div>
            </div>
          </div>

          {/* Quick Scratch Credentials vault */}
          <div className="bg-slate-900/55 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Cuenta Profes Scratch</span>
            </div>
            
            <div className="flex flex-col gap-2">
              {/* Username row */}
              <div className="bg-slate-950/80 rounded-lg p-2 flex items-center justify-between gap-2 border border-slate-800/40 font-mono text-[11px]">
                <div className="truncate text-slate-300">
                  <span className="text-slate-500 font-bold mr-1">U:</span> profespixelitos
                </div>
                <button
                  onClick={handleCopyUser}
                  className={`p-1.5 rounded-md shrink-0 transition-all cursor-pointer ${
                    scratchUserCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                  title="Copiar usuario (profespixelitos)"
                >
                  {scratchUserCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Password row */}
              <div className="bg-slate-950/80 rounded-lg p-2 flex items-center justify-between gap-2 border border-slate-800/40 font-mono text-[11px]">
                <div className="truncate text-slate-300">
                  <span className="text-slate-500 font-bold mr-1">C:</span> pixelitos123
                </div>
                <button
                  onClick={handleCopyPassword}
                  className={`p-1.5 rounded-md shrink-0 transition-all cursor-pointer ${
                    scratchPasswordCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                  title="Copiar contraseña (pixelitos123)"
                >
                  {scratchPasswordCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sidebar Tabs - Acts as Separate Pages */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">PÁGINAS Y SECCIONES</div>
          
          <button
            onClick={() => {
              setActiveTab('repository');
              setIsSidebarOpen(false);
            }}
            className={`w-full relative flex items-center justify-between text-xs font-bold px-3.5 py-3 rounded-lg transition-all cursor-pointer border-l-4 ${
              activeTab === 'repository'
                ? 'bg-[#f0da4c] text-slate-950 font-black shadow-md border-amber-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border-transparent hover:border-slate-800'
            } ${
              isTutorialOpen && tutorialStep === 1
                ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-[1.03] shadow-lg shadow-amber-400/30 z-50 bg-slate-900 text-white'
                : ''
            }`}
          >
            <span className="flex items-center gap-3">
              <Grid className="w-4 h-4 shrink-0" />
              <span>Proyectos</span>
              {isTutorialOpen && tutorialStep === 1 && (
                <span className="text-[9px] font-black tracking-wider text-slate-950 bg-[#f0da4c] px-1.5 py-0.5 rounded animate-pulse">
                  👈 AQUÍ
                </span>
              )}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
              activeTab === 'repository' ? 'bg-slate-950/10 text-slate-950' : 'bg-slate-900 text-slate-400'
            }`}>
              {stats.total}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('planner');
              setIsSidebarOpen(false);
            }}
            className={`w-full relative flex items-center justify-between text-xs font-bold px-3.5 py-3 rounded-lg transition-all cursor-pointer border-l-4 ${
              activeTab === 'planner'
                ? 'bg-[#f0da4c] text-slate-950 font-black shadow-md border-amber-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border-transparent hover:border-slate-800'
            } ${
              isTutorialOpen && tutorialStep === 2
                ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-[1.03] shadow-lg shadow-amber-400/30 z-50 bg-slate-900 text-white'
                : ''
            }`}
          >
            <span className="flex items-center gap-3">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Planificación</span>
              {isTutorialOpen && tutorialStep === 2 && (
                <span className="text-[9px] font-black tracking-wider text-slate-950 bg-[#f0da4c] px-1.5 py-0.5 rounded animate-pulse">
                  👈 AQUÍ
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('accounts');
              setIsSidebarOpen(false);
            }}
            className={`w-full relative flex items-center justify-between text-xs font-bold px-3.5 py-3 rounded-lg transition-all cursor-pointer border-l-4 ${
              activeTab === 'accounts'
                ? 'bg-[#f0da4c] text-slate-950 font-black shadow-md border-amber-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border-transparent hover:border-slate-800'
            } ${
              isTutorialOpen && tutorialStep === 3
                ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-[1.03] shadow-lg shadow-amber-400/30 z-50 bg-slate-900 text-white'
                : ''
            }`}
          >
            <span className="flex items-center gap-3">
              <Key className="w-4 h-4 shrink-0" />
              <span>Cuentas</span>
              {isTutorialOpen && tutorialStep === 3 && (
                <span className="text-[9px] font-black tracking-wider text-slate-950 bg-[#f0da4c] px-1.5 py-0.5 rounded animate-pulse">
                  👈 AQUÍ
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('resources');
              setIsSidebarOpen(false);
            }}
            className={`w-full relative flex items-center justify-between text-xs font-bold px-3.5 py-3 rounded-lg transition-all cursor-pointer border-l-4 ${
              activeTab === 'resources'
                ? 'bg-[#f0da4c] text-slate-950 font-black shadow-md border-amber-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border-transparent hover:border-slate-800'
            } ${
              isTutorialOpen && tutorialStep === 4
                ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-[1.03] shadow-lg shadow-amber-400/30 z-50 bg-slate-900 text-white'
                : ''
            }`}
          >
            <span className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Recursos</span>
              {isTutorialOpen && tutorialStep === 4 && (
                <span className="text-[9px] font-black tracking-wider text-slate-950 bg-[#f0da4c] px-1.5 py-0.5 rounded animate-pulse">
                  👈 AQUÍ
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bulletin');
              setIsSidebarOpen(false);
            }}
            className={`w-full relative flex items-center justify-between text-xs font-bold px-3.5 py-3 rounded-lg transition-all cursor-pointer border-l-4 ${
              activeTab === 'bulletin'
                ? 'bg-[#f0da4c] text-slate-950 font-black shadow-md border-amber-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border-transparent hover:border-slate-800'
            } ${
              isTutorialOpen && tutorialStep === 5
                ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-[1.03] shadow-lg shadow-amber-400/30 z-50 bg-slate-900 text-white'
                : ''
            }`}
          >
            <span className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Pizarra</span>
              {isTutorialOpen && tutorialStep === 5 && (
                <span className="text-[9px] font-black tracking-wider text-slate-950 bg-[#f0da4c] px-1.5 py-0.5 rounded animate-pulse">
                  👈 AQUÍ
                </span>
              )}
            </span>
          </button>

          {/* Divider and Help Section */}
          <div className="pt-2 pb-1 border-t border-slate-900 my-1 mx-2">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1.5">Guía de Ayuda</div>
          </div>

          <button
            onClick={() => {
              setTutorialStep(0);
              setIsTutorialOpen(true);
              setIsSidebarOpen(false);
            }}
            className={`w-full relative flex items-center justify-between text-xs font-bold px-3.5 py-2.5 rounded-lg transition-all cursor-pointer border border-amber-500/20 bg-amber-500/5 text-amber-400 hover:text-white hover:bg-amber-500/10 hover:border-amber-500/40 ${
              isTutorialOpen
                ? 'ring-2 ring-amber-400 scale-[0.98]'
                : ''
            }`}
          >
            <span className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
              <span>Tutorial de la App</span>
            </span>
            <span className="bg-[#f0da4c] text-slate-950 text-[8px] font-black tracking-normal px-1.5 py-0.5 rounded">
              GUÍA
            </span>
          </button>
        </nav>

        {/* Sidebar Footer with backups */}
        <div className={`p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3 shrink-0 transition-all duration-300 ${
          isTutorialOpen && tutorialStep === 6
            ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-[1.01] shadow-lg shadow-amber-400/30 rounded-xl bg-slate-900/90 z-50'
            : ''
        }`}>
          <div className="flex items-center justify-between gap-1">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">COORDINACIÓN / RESPALDOS</div>
            {isTutorialOpen && tutorialStep === 6 && (
              <span className="text-[9px] font-black tracking-wider text-slate-950 bg-[#f0da4c] px-1.5 py-0.5 rounded animate-pulse">
                👈 RESPALDOS
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <label className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800/80 py-2 rounded-lg cursor-pointer transition-all active:scale-95">
              <FileUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Cargar Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            <button
              onClick={handleExportBackup}
              className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800/80 py-2 rounded-lg transition-all active:scale-95 cursor-pointer"
              title="Descargar copia en JSON"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Guardar Backup</span>
            </button>

            <button
              onClick={handleResetToDefaults}
              className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-red-950/30 hover:bg-red-950/50 text-red-400 border border-red-900/40 py-2 rounded-lg transition-all active:scale-95 cursor-pointer"
              title="Restablecer base de datos"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>

            {hasRecoveryBackup && (
              <button
                onClick={handleRestoreEmergencyBackup}
                className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider bg-amber-950/40 hover:bg-amber-900/55 text-amber-400 border border-amber-900/40 py-2 rounded-lg transition-all active:scale-95 cursor-pointer animate-pulse"
                title="Restaurar base de datos a la versión anterior al reset"
              >
                <Undo className="w-3.5 h-3.5" />
                <span>Deshacer Reset</span>
              </button>
            )}
          </div>

          <div className="pt-2 text-center text-[9px] text-slate-500 font-medium">
            © 2026 Pixelitos Academy
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Top Header of the Content Area */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-3xs shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger button for mobile / desktop toggle */}
            <button
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                } else {
                  setIsSidebarOpen(true);
                }
              }}
              className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              title="Mostrar/Ocultar menú"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Current Page Title */}
            <h1 className="font-sans text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              {activeTab === 'repository' && (
                <>
                  <Grid className="w-4 h-4 text-slate-600" />
                  <span>Proyectos</span>
                </>
              )}
              {activeTab === 'planner' && (
                <>
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span>Planificación</span>
                </>
              )}
              {activeTab === 'accounts' && (
                <>
                  <Key className="w-4 h-4 text-slate-600" />
                  <span>Cuentas</span>
                </>
              )}
              {activeTab === 'resources' && (
                <>
                  <BookOpen className="w-4 h-4 text-slate-600" />
                  <span>Recursos</span>
                </>
              )}
              {activeTab === 'bulletin' && (
                <>
                  <MessageSquare className="w-4 h-4 text-slate-600" />
                  <span>Pizarra</span>
                </>
              )}
            </h1>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* The tutorial button is now placed cleanly inside the navigation sidebar below the bulletin board */}
          </div>
        </header>

        {/* Global Notices */}
        {showResetNotice && (
          <div className="mx-4 sm:mx-6 mt-4 p-4 bg-rose-50 text-rose-950 rounded-xl border border-rose-100 text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-3xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>La base de datos de Pixelitos se ha restaurado al listado original de propuestas. Se guardó una copia de seguridad temporal por si querés deshacer este cambio.</span>
            </div>
            <button
              onClick={handleRestoreEmergencyBackup}
              className="bg-rose-900 hover:bg-rose-800 text-white font-bold text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto shadow-3xs flex items-center gap-1"
            >
              <Undo className="w-3 h-3" />
              <span>Deshacer Restablecimiento</span>
            </button>
          </div>
        )}

        {/* Active Page View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto" id="main-content">
        
        {/* TAB 1: PROJECTS REPOSITORY */}
        {activeTab === 'repository' && (
          <div className="space-y-6">
            
            {/* Search & Custom Filter Dashboard */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              
              {/* Row 1: Search bar + PDF Export + ADD button */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por juego, característica, consigna o herramienta..."
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-800 font-medium"
                    id="search-input"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-2xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Beautiful PDF Export Catalog button */}
                  <button
                    onClick={handleDownloadPDF}
                    className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide bg-[#f0da4c] hover:bg-[#f0da4c]/95 text-slate-950 px-5 py-2.5 rounded-xl transition-all shadow-xs border border-amber-400/60 active:scale-95 cursor-pointer"
                    title="Exportar listado actual a un PDF con separaciones por Nivel"
                    id="export-pdf-btn"
                  >
                    <FileText className="w-4 h-4 text-slate-950" />
                    <span>Descargar PDF 📄</span>
                  </button>

                  <button
                    onClick={handleTriggerAdd}
                    className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide bg-slate-950 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                    id="add-material-btn"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Juego</span>
                  </button>
                </div>
              </div>

              {/* Row 2: PLATFORM FILTERS */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Plataforma / Herramienta:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(['Todos', 'Scratch', 'Kahoot', 'Roblox Studio', 'Micro:bit', 'Tynker', 'Code.org', 'Pilas Bloques', 'Recursos y Guías'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTool(t)}
                      className={`text-2xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer border ${
                        selectedTool === t
                          ? 'bg-[#f0da4c] text-slate-950 shadow-xs border-amber-400 font-extrabold'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/80'
                      }`}
                      id={`tool-filter-${t.replace(' ', '_')}`}
                    >
                      {t === 'Todos' ? '🎮 Todos' : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: ACADEMIC LEVEL + AGE RANGE + DIFFICULTY FILTERS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                
                {/* 1. Level filter */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Nivel de Academia:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['Todos', '1°1°', '1°2°', '2°1°', '2°2°'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setSelectedLevel(lvl)}
                        className={`text-2xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer border ${
                          selectedLevel === lvl
                            ? 'bg-[#f0da4c] text-slate-950 border-amber-400'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/80'
                        }`}
                      >
                        {lvl === 'Todos' ? '🎒 Todos' : `Nivel ${lvl}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Age Range filter */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Rango de Edad:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['Todos', '7-9 años', '10-12 años'] as const).map((age) => (
                      <button
                        key={age}
                        onClick={() => setSelectedAgeRange(age)}
                        className={`text-2xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer border ${
                          selectedAgeRange === age
                            ? 'bg-[#f0da4c] text-slate-950 border-amber-400'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/80'
                        }`}
                      >
                        {age === 'Todos' ? '🧒 Todos' : age}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Difficulty and Sorting */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Dificultad de la Propuesta:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['Todos', 'bajo', 'intermedio', 'alto'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`text-2xs font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border ${
                          selectedDifficulty === diff
                            ? 'bg-[#f0da4c] text-slate-950 border-amber-400'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/80'
                        }`}
                      >
                        {diff === 'Todos' ? '🛡️ Todos' : diff}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sorting Row */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-400 font-semibold italic">
                  Filtros activos reducen la búsqueda antes de descargar tu PDF
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Ordenar por:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs font-bold rounded-lg border border-slate-200 p-2 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    id="sort-select"
                  >
                    <option value="recent">Agregados recientes</option>
                    <option value="favorites">Favoritos primero ⭐</option>
                    <option value="title">Alfabético A-Z</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Results Grid / Render Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>
                  Mostrando{' '}
                  <strong className="text-slate-800">
                    {filteredAndSortedMaterials.length > 0
                      ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(
                          currentPage * ITEMS_PER_PAGE,
                          filteredAndSortedMaterials.length
                        )}`
                      : '0'}
                  </strong>{' '}
                  de <strong className="text-slate-800">{filteredAndSortedMaterials.length}</strong> proyectos filtrados (de{' '}
                  <strong className="text-slate-800">{materials.length}</strong> totales)
                </span>

                {(selectedTool !== 'Todos' || selectedLevel !== 'Todos' || selectedAgeRange !== 'Todos' || selectedDifficulty !== 'Todos' || searchQuery !== '') && (
                  <button
                    onClick={() => {
                      setSelectedTool('Todos');
                      setSelectedLevel('Todos');
                      setSelectedAgeRange('Todos');
                      setSelectedDifficulty('Todos');
                      setSearchQuery('');
                    }}
                    className="text-slate-900 font-extrabold hover:underline cursor-pointer"
                  >
                    Limpiar Todos los Filtros
                  </button>
                )}
              </div>

              {filteredAndSortedMaterials.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-3xs max-w-xl mx-auto animate-fade-in">
                  <div className="text-5xl mb-4 select-none">🔍</div>
                  <h3 className="font-sans text-lg font-bold text-slate-800">No encontramos coincidencias</h3>
                  <p className="font-sans text-sm text-slate-500 mt-2">
                    Prueba modificando los filtros de nivel, edad, dificultad o el recuadro de búsqueda.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedTool('Todos');
                      setSelectedLevel('Todos');
                      setSelectedAgeRange('Todos');
                      setSelectedDifficulty('Todos');
                      setSearchQuery('');
                    }}
                    className="mt-4 text-xs font-bold uppercase tracking-wider bg-slate-950 text-white px-4 py-2.5 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    Mostrar todos los proyectos
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {paginatedMaterials.map((material) => (
                      <MaterialCard
                        key={material.id}
                        material={material}
                        onToggleFavorite={handleToggleFavorite}
                        onEdit={handleTriggerEdit}
                        onDelete={handleDeleteMaterial}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-200 animate-fade-in">
                      <div className="text-xs text-slate-500 font-medium">
                        Página <span className="font-bold text-slate-800">{currentPage}</span> de <span className="font-bold text-slate-800">{totalPages}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        <button
                          onClick={() => {
                            setCurrentPage((prev) => Math.max(prev - 1, 1));
                            scrollToTop();
                          }}
                          disabled={currentPage === 1}
                          className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:hover:bg-white disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                          <span>←</span> <span>Anterior</span>
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => {
                          const pageNumber = index + 1;
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => {
                                setCurrentPage(pageNumber);
                                scrollToTop();
                              }}
                              className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                                currentPage === pageNumber
                                  ? 'bg-[#f0da4c] text-slate-950 border-amber-400 font-extrabold shadow-3xs'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => {
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                            scrollToTop();
                          }}
                          disabled={currentPage === totalPages}
                          className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:hover:bg-white disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                          <span>Siguiente</span> <span>→</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: CLASS PLANNER */}
        {activeTab === 'planner' && (
          <ClassPlanner materials={materials} />
        )}

        {/* TAB 3: ACCOUNTS SECTION */}
        {activeTab === 'accounts' && (
          <AccountsSection />
        )}

        {/* TAB 4: RESOURCES SECTION */}
        {activeTab === 'resources' && (
          <ResourcesSection />
        )}

        {/* TAB 5: TEACHER BULLETIN */}
        {activeTab === 'bulletin' && (
          <TeacherBulletin />
        )}
        </main>

        {/* 6. Professional Polish Footer - Inside Main Content Area */}
        <footer className="h-14 bg-white border-t border-slate-200 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs mt-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-semibold text-slate-500">Sistema Sincronizado</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">© 2026 Pixelitos Academy</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>v2.7.0 (Build 125)</span>
            <span className="font-bold text-slate-300">•</span>
            <span>Desarrollado para Coordinación y Profes</span>
          </div>
        </footer>
      </div>

      {/* 5. Create / Edit modal Overlay */}
      <MaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMaterial}
        materialToEdit={materialToEdit}
      />

       {/* Interactive App Tour / Tutorial Widget */}
      {isTutorialOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:justify-end p-4 sm:p-6 pointer-events-none">
          {/* Subtle clear overlay with no blur, ensuring the highlighted sidebar section stays perfectly clear, clean, and unblurred */}
          <div className="fixed inset-0 bg-slate-950/15 pointer-events-auto" onClick={() => setIsTutorialOpen(false)} />
          
          {/* Floating Tour Card */}
          <div className="relative w-full max-w-md bg-white border-2 border-[#f0da4c] rounded-2xl shadow-2xl p-5 pointer-events-auto animate-fade-in flex flex-col gap-4 z-10" id="pixelitos-tutorial-card">
            {/* Top decorative pixel bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#f0da4c] rounded-t-xl" />
            
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#f0da4c]/20 flex items-center justify-center text-slate-950">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-600">Guía Pixelitos Hub</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Paso {tutorialStep + 1} de {TUTORIAL_STEPS.length}</p>
                </div>
              </div>
              <button
                onClick={() => setIsTutorialOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Cerrar tutorial"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#f0da4c] h-full transition-all duration-300 rounded-full"
                style={{ width: `${((tutorialStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
              />
            </div>

            {/* Body Content */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {TUTORIAL_STEPS[tutorialStep].title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {TUTORIAL_STEPS[tutorialStep].content}
              </p>
              
              {/* Pro Tip Box */}
              {TUTORIAL_STEPS[tutorialStep].tip && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-2.5 rounded-r-lg">
                  <div className="flex gap-2">
                    <span className="text-xs">💡</span>
                    <p className="text-[11px] text-amber-900 font-semibold leading-normal">
                      <strong>Tip:</strong> {TUTORIAL_STEPS[tutorialStep].tip}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsTutorialOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 transition-colors cursor-pointer"
              >
                Omitir
              </button>
              
              <div className="flex items-center gap-2">
                {tutorialStep > 0 && (
                  <button
                    onClick={() => setTutorialStep((prev) => prev - 1)}
                    className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Anterior
                  </button>
                )}
                
                <button
                  onClick={() => {
                    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
                      setTutorialStep((prev) => prev + 1);
                    } else {
                      setIsTutorialOpen(false);
                      alert('🎉 ¡Completaste el tutorial interactivo de Pixelitos! Ahora ya conocés todas las secciones del portal.');
                    }
                  }}
                  className="text-xs font-extrabold text-slate-950 bg-[#f0da4c] hover:bg-amber-400 px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <span>{tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
