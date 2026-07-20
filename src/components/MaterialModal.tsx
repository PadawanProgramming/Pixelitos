import React, { useState, useEffect } from 'react';
import { EducationalMaterial, ToolType, AgeGroupType, LevelType, AgeRangeType, DifficultyType, enrichMaterial } from '../types';
import { X, Sparkles, HelpCircle } from 'lucide-react';

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (material: EducationalMaterial) => void;
  materialToEdit?: EducationalMaterial | null;
}

const TOOLS: ToolType[] = [
  'Scratch',
  'Kahoot',
  'Roblox Studio',
  'Micro:bit',
  'Tynker',
  'Code.org',
  'Pilas Bloques',
  'Minecraft Education',
  'Recursos y Guías',
];

const AGE_GROUPS: AgeGroupType[] = [
  'Pequeños (1° 1 / 7-8 años)',
  'Medianos (8-12 años)',
  'Cierre y Diagnósticos',
  'Todos / General',
];

const LEVELS: LevelType[] = ['1°1°', '1°2°', '2°1°', '2°2°'];
const AGE_RANGES: AgeRangeType[] = ['7-9 años', '10-12 años'];
const DIFFICULTIES: DifficultyType[] = ['bajo', 'intermedio', 'alto'];

export const MaterialModal: React.FC<MaterialModalProps> = ({
  isOpen,
  onClose,
  onSave,
  materialToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [tool, setTool] = useState<ToolType>('Scratch');
  const [ageGroup, setAgeGroup] = useState<AgeGroupType>('Medianos (8-12 años)');
  const [description, setDescription] = useState('');
  const [editorUrl, setEditorUrl] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [notes, setNotes] = useState('');

  // New fields
  const [level, setLevel] = useState<LevelType>('1°1°');
  const [ageRange, setAgeRange] = useState<AgeRangeType>('7-9 años');
  const [difficulty, setDifficulty] = useState<DifficultyType>('bajo');

  useEffect(() => {
    if (materialToEdit) {
      setTitle(materialToEdit.title);
      setUrl(materialToEdit.url);
      setTool(materialToEdit.tool);
      setAgeGroup(materialToEdit.ageGroup);
      setDescription(materialToEdit.description || '');
      setEditorUrl(materialToEdit.editorUrl || '');
      setIsNew(!!materialToEdit.isNew);
      setNotes(materialToEdit.notes || '');

      const enriched = enrichMaterial(materialToEdit);
      setLevel(enriched.level || '1°1°');
      setAgeRange(enriched.ageRange || '7-9 años');
      setDifficulty(enriched.difficulty || 'bajo');
    } else {
      // Clear fields for new item
      setTitle('');
      setUrl('');
      setTool('Scratch');
      setAgeGroup('Medianos (8-12 años)');
      setDescription('');
      setEditorUrl('');
      setIsNew(false);
      setNotes('');
      setLevel('1°1°');
      setAgeRange('7-9 años');
      setDifficulty('bajo');
    }
  }, [materialToEdit, isOpen]);

  // Try to generate direct editor links for Scratch links automatically
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    if (tool === 'Scratch' && newUrl.includes('scratch.mit.edu/projects/')) {
      const parts = newUrl.split('/projects/');
      if (parts[1]) {
        const id = parts[1].split('/')[0];
        if (id && !editorUrl) {
          setEditorUrl(`https://scratch.mit.edu/projects/${id}/editor`);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const savedMaterial: EducationalMaterial = {
      id: materialToEdit ? materialToEdit.id : `mat-${Date.now()}`,
      title: title.trim(),
      url: url.trim(),
      tool,
      ageGroup,
      description: description.trim() || undefined,
      editorUrl: editorUrl.trim() || undefined,
      isNew,
      notes: notes.trim() || undefined,
      isFavorite: materialToEdit ? materialToEdit.isFavorite : false,
      dateAdded: materialToEdit ? materialToEdit.dateAdded : new Date().toISOString(),
      level,
      ageRange,
      difficulty,
    };

    onSave(savedMaterial);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-zoom-in"
        id="material-form-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-150">
          <h3 className="font-sans text-base font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            {materialToEdit ? 'Editar Material Pedagógico ✏️' : 'Añadir Nuevo Material ➕'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh] space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nombre del Juego / Proyecto:
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Súper Laberinto de Clones"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Plataforma:</label>
              <select
                value={tool}
                onChange={(e) => setTool(e.target.value as ToolType)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                {TOOLS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-bold text-indigo-600">Nivel de Academia:</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as LevelType)}
                className="w-full text-sm rounded-lg border border-indigo-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-semibold"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    Nivel {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Rango de Edad:</label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value as AgeRangeType)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                {AGE_RANGES.map((ar) => (
                  <option key={ar} value={ar}>
                    {ar}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Dificultad:</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyType)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Keep legacy ageGroup to prevent empty values or legacy breakages */}
          <div className="hidden">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Destinatarios (Legacy):</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value as AgeGroupType)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
            >
              {AGE_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Enlace de Ejecución (URL de Lanzamiento):
            </label>
            <input
              type="url"
              required
              placeholder="https://scratch.mit.edu/projects/..."
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Enlace del Editor directo (Opcional):
              </label>
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <HelpCircle className="w-3 h-3" />
                Se autogenera para Scratch
              </span>
            </div>
            <input
              type="url"
              placeholder="https://scratch.mit.edu/projects/.../editor"
              value={editorUrl}
              onChange={(e) => setEditorUrl(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Breve Descripción / Consigna pedagógica:
            </label>
            <textarea
              placeholder="Ej. Juego de naves con clones de meteoritos. Objetivo: programar variables de puntuación y vidas."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tips de Clase / Comentarios del Docente (Añadir notas):
            </label>
            <textarea
              placeholder="Ej. Cuidado: abrir con copia para los alumnos. Funciona muy bien con chicos de 10 años."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-amber-50/20"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isNew"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <label htmlFor="isNew" className="text-xs font-bold text-slate-700 uppercase tracking-wide cursor-pointer">
              Marcar como "Proyecto Nuevo" (Aparecerá un badge en la tarjeta)
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              {materialToEdit ? 'Guardar Cambios' : 'Crear Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
