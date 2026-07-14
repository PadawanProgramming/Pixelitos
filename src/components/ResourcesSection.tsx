import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Trash2, ExternalLink, Copy, Check, FileText, Video, Link, Image, Sparkles, ShieldCheck } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'Video' | 'Link' | 'Imagen';
  platform: 'Scratch' | 'Roblox' | 'Micro:bit' | 'Kahoot' | 'General';
  url: string;
  description?: string;
}

interface ResourcesSectionProps {
  userRole?: string;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ userRole }) => {
  if (userRole === 'alumno') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-6 rounded-2xl flex items-start gap-4 max-w-xl mx-auto my-12 shadow-xs animate-fade-in">
        <ShieldCheck className="w-8 h-8 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-sans font-black uppercase tracking-wider text-red-800 text-sm">Acceso Denegado 🔐</h4>
          <p className="font-sans text-red-600 leading-relaxed font-semibold">
            No tenés permisos para visualizar la sección de Recursos Pedagógicos del Staff. Esta sección está reservada exclusivamente para profesores y coordinadores de Pixelitos.
          </p>
        </div>
      </div>
    );
  }

  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem('pixelitos_resources');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default high-value seed resources for Pixelitos Academy
    return [
      {
        id: 'res-1',
        title: 'Reglas de Oro Pixelitos (Imprimible)',
        type: 'PDF',
        platform: 'General',
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200', // representative premium content
        description: 'Afiche pedagógico con las reglas de clase para colgar en el aula y recordar el uso de copias de archivos.',
      },
      {
        id: 'res-2',
        title: 'Videotutorial: Primer Script en Roblox Studio (Variables Lua)',
        type: 'Video',
        platform: 'Roblox',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // representation link
        description: 'Explicación paso a paso de cómo insertar un Script en Roblox, definir variables locales y alterar propiedades físicas.',
      },
      {
        id: 'res-3',
        title: 'Kit de Assets y Sonidos recomendados para Scratch',
        type: 'Link',
        platform: 'Scratch',
        url: 'https://scratch.mit.edu/starter-projects',
        description: 'Banco de sonidos libres de copyright y sprites transparentes recomendados para que los chicos decoren sus juegos.',
      },
      {
        id: 'res-4',
        title: 'Hoja de Referencia (Cheat-sheet) Bloques Micro:bit',
        type: 'PDF',
        platform: 'Micro:bit',
        url: 'https://microbit.org/get-started/user-guide/overview/',
        description: 'Guía rápida visual para mapear los pines y sensores analógicos de la placa Microbit.',
      },
    ];
  });

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('Todos');
  const [platformFilter, setPlatformFilter] = useState<string>('Todos');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'PDF' | 'Video' | 'Link' | 'Imagen'>('PDF');
  const [platform, setPlatform] = useState<'Scratch' | 'Roblox' | 'Micro:bit' | 'Kahoot' | 'General'>('Scratch');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch resources from Neon DB on mount
  useEffect(() => {
    fetch('/api/resources')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setResources(data);
        }
      })
      .catch((err) => console.error('Error fetching resources from DB:', err));
  }, []);

  const saveResources = (newResources: Resource[], resourceToUpsert?: Resource, resourceIdToDelete?: string) => {
    setResources(newResources);
    localStorage.setItem('pixelitos_resources', JSON.stringify(newResources));

    if (resourceToUpsert) {
      fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceToUpsert),
      }).catch((err) => console.error('Error saving resource to DB:', err));
    }

    if (resourceIdToDelete) {
      fetch(`/api/resources/${resourceIdToDelete}`, {
        method: 'DELETE',
      }).catch((err) => console.error('Error deleting resource from DB:', err));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const newRes: Resource = {
      id: `res-${Date.now()}`,
      title: title.trim(),
      type,
      platform,
      url: url.trim(),
      description: description.trim() || undefined,
    };

    const updated = [newRes, ...resources];
    saveResources(updated, newRes);

    // Reset Form
    setTitle('');
    setUrl('');
    setDescription('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que querés eliminar este recurso pedagógico?')) {
      const updated = resources.filter(r => r.id !== id);
      saveResources(updated, undefined, id);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'Video':
        return <Video className="w-5 h-5 text-indigo-500" />;
      case 'Link':
        return <Link className="w-5 h-5 text-cyan-600" />;
      case 'Imagen':
        return <Image className="w-5 h-5 text-emerald-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-slate-500" />;
    }
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === 'Todos' || r.type === typeFilter;
    const matchesPlatform = platformFilter === 'Todos' || r.platform === platformFilter;

    return matchesSearch && matchesType && matchesPlatform;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs" id="resources-section">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-sans text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-800" />
            Recursos y Materiales de Apoyo 📚
          </h2>
          <p className="font-sans text-xs text-slate-500 mt-1">
            Archivos, guías imprimibles, videos tutoriales y enlaces complementarios cargados por los profesores.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer"
        >
          {showForm ? 'Cerrar' : <><Plus className="w-4 h-4" /> Registrar Recurso</>}
        </button>
      </div>

      {/* Add Resource Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 animate-fade-in space-y-4">
          <h3 className="font-sans text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Vincular Recurso Educativo Complementario
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Recurso:</label>
              <input
                type="text"
                required
                placeholder="Ej. Guía de Atajos de Teclado Scratch"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Recurso:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
              >
                <option value="PDF">Documento PDF 📄</option>
                <option value="Video">Video Tutorial 🎬</option>
                <option value="Link">Enlace Web 🔗</option>
                <option value="Imagen">Imagen / Assets 🖼️</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Materia / Plataforma:</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
              >
                <option value="Scratch">Scratch</option>
                <option value="Roblox">Roblox</option>
                <option value="Micro:bit">Micro:bit</option>
                <option value="Kahoot">Kahoot</option>
                <option value="General">General / Pixelitos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección URL (Enlace del archivo o video):</label>
            <input
              type="url"
              required
              placeholder="https://drive.google.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción pedagógica del recurso:</label>
            <textarea
              placeholder="Ej. Útil para que los alumnos lo peguen en su carpeta o repasen en casa."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Guardar Recurso
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Buscar recursos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="Todos">Todos los formatos</option>
            <option value="PDF">Documentos PDF</option>
            <option value="Video">Videos Tutoriales</option>
            <option value="Link">Enlaces Externos</option>
            <option value="Imagen">Imágenes y Assets</option>
          </select>
        </div>

        <div className="md:col-span-4">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="Todos">Todas las plataformas</option>
            <option value="Scratch">Scratch</option>
            <option value="Roblox">Roblox Studio</option>
            <option value="Micro:bit">Micro:bit</option>
            <option value="Kahoot">Kahoot</option>
            <option value="General">General / Pixelitos</option>
          </select>
        </div>
      </div>

      {/* Grid of resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-sans text-xs font-semibold">No se encontraron recursos complementarios.</p>
          </div>
        ) : (
          filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white border border-slate-200 hover:border-slate-300 transition-all rounded-xl p-4 shadow-3xs flex items-start gap-3.5 relative"
              id={`resource-item-${res.id}`}
            >
              <div className="bg-slate-100 rounded-lg p-2.5 shrink-0 mt-0.5">
                {getIcon(res.type)}
              </div>

              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {res.type}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-md">
                    {res.platform}
                  </span>
                </div>

                <h4 className="font-sans text-sm font-extrabold text-slate-900 leading-snug truncate">
                  {res.title}
                </h4>

                {res.description && (
                  <p className="font-sans text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                    {res.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleCopy(res.id, res.url)}
                    className="inline-flex items-center gap-1.5 text-2xs font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-all cursor-pointer"
                    title="Copiar link"
                  >
                    {copiedId === res.id ? (
                      <><Check className="w-3 h-3 text-emerald-600" /> ¡Copiado!</>
                    ) : (
                      <><Copy className="w-3 h-3 text-slate-500" /> Copiar Enlace</>
                    )}
                  </button>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-2xs font-extrabold px-2.5 py-1 bg-pixelitos-yellow hover:bg-pixelitos-yellow-dark text-slate-950 rounded transition-all shadow-3xs border border-pixelitos-yellow-dark/25"
                  >
                    Abrir <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Trash */}
              <button
                onClick={() => handleDelete(res.id)}
                className="absolute right-3 top-3 p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                title="Eliminar este recurso"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
