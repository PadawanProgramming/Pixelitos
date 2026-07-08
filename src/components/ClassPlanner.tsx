import React, { useState } from 'react';
import { EducationalMaterial } from '../types';
import { Calendar, Trash2, Plus, Sparkles, AlertCircle, Bookmark, Minus, ExternalLink } from 'lucide-react';

interface ClassPlan {
  id: string;
  month: string;
  targetGroup: string;
  objectives: string;
  classIds?: string[]; // New list of classes, flexible up to 12!
  // Legacy fields to guarantee compatibility:
  class1Id?: string;
  class2Id?: string;
  class3Id?: string;
  class4Id?: string;
}

interface ClassPlannerProps {
  materials: EducationalMaterial[];
}

export const ClassPlanner: React.FC<ClassPlannerProps> = ({ materials }) => {
  const [plans, setPlans] = useState<ClassPlan[]>(() => {
    const saved = localStorage.getItem('pixelitos_class_plans');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all plans have the classIds array
        return parsed.map((p: any) => {
          if (!p.classIds) {
            const classIds = [p.class1Id, p.class2Id, p.class3Id, p.class4Id].filter(Boolean);
            return { ...p, classIds };
          }
          return p;
        });
      } catch (e) {
        console.error(e);
      }
    }
    // Default initial plan
    return [
      {
        id: 'plan-default-1',
        month: 'Marzo - Introducción al Taller 🎮',
        targetGroup: 'Pequeños (1° 1 / 7-8 años)',
        objectives: 'Familiarizar a los chicos con la interfaz de Scratch y realizar diagnósticos de pensamiento computacional.',
        classIds: ['sc-nombre-interactivo', 'kh-pensamiento-computacional', 'sc-laberinto-1'],
      },
      {
        id: 'plan-default-2',
        month: 'Abril - Clones y Concurrentes 👥',
        targetGroup: 'Medianos (8-12 años)',
        objectives: 'Explicar la diferencia entre un objeto único y el comportamiento de copias concurrentes (Clones).',
        classIds: ['sc-clones-salchi', 'kh-clones-murcielago', 'sc-condicionales-murcielago', 'sc-arkanoid'],
      },
    ];
  });

  const [month, setMonth] = useState('');
  const [targetGroup, setTargetGroup] = useState('Medianos (8-12 años)');
  const [objectives, setObjectives] = useState('');
  
  // Dynamic list of class IDs (start with 4 empty classes)
  const [classIds, setClassIds] = useState<string[]>(['', '', '', '']);
  const [showForm, setShowForm] = useState(false);

  const savePlans = (newPlans: ClassPlan[]) => {
    setPlans(newPlans);
    localStorage.setItem('pixelitos_class_plans', JSON.stringify(newPlans));
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!month.trim()) return;

    // Filter out any unselected classes to keep database clean
    const activeClassIds = classIds.filter(id => id !== '');

    const newPlan: ClassPlan = {
      id: `plan-${Date.now()}`,
      month: month.trim(),
      targetGroup,
      objectives: objectives.trim(),
      classIds: activeClassIds,
    };

    const updated = [newPlan, ...plans];
    savePlans(updated);

    // Reset form
    setMonth('');
    setObjectives('');
    setClassIds(['', '', '', '']);
    setShowForm(false);
  };

  const handleDeletePlan = (id: string) => {
    const updated = plans.filter((p) => p.id !== id);
    savePlans(updated);
  };

  const handleClassChange = (index: number, val: string) => {
    const updated = [...classIds];
    updated[index] = val;
    setClassIds(updated);
  };

  const addClassField = () => {
    if (classIds.length < 12) {
      setClassIds([...classIds, '']);
    }
  };

  const removeClassField = (index: number) => {
    if (classIds.length > 1) {
      const updated = classIds.filter((_, i) => i !== index);
      setClassIds(updated);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs" id="class-planner-section">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-sans text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-800" />
            Planificación de Clases 📅
          </h2>
          <p className="font-sans text-xs text-slate-500 mt-1">
            Armen el recorrido pedagógico seleccionando los desafíos correspondientes. ¡Admite desde 1 hasta 12 clases por plan!
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer"
        >
          {showForm ? 'Cerrar' : <><Plus className="w-4 h-4" /> Crear Planificación</>}
        </button>
      </div>

      {/* Rules Banner for coordination */}
      <div className="mb-6 bg-pixelitos-yellow-light/20 rounded-xl p-4 border border-pixelitos-yellow-dark/30 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="font-sans font-extrabold text-slate-900 block mb-0.5">Indicación del Equipo:</strong>
          <span>El taller varía de duración según el mes o la escuela. Podés agregar clases dinámicamente según lo requiera el curso (por ejemplo, talleres intensivos con hasta 12 proyectos semanales o quincenales).</span>
        </div>
      </div>

      {/* Add Plan Form */}
      {showForm && (
        <form onSubmit={handleAddPlan} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 animate-fade-in">
          <h3 className="font-sans text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Configurar Planificación Flexible
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de la Planificación (ej: Julio - Robótica Avanzada):</label>
              <input
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="Ej. Mayo - Laberintos de Scratch"
                required
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Destinatarios:</label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Pequeños (1° 1 / 7-8 años)">Pequeños (1° 1 / 7-8 años)</option>
                <option value="Medianos (8-12 años)">Medianos (8-12 años)</option>
                <option value="Todos / General">Todos / General</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Objetivos Pedagógicos y Temas Clave:</label>
            <textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="¿Qué conceptos o mecánicas de código van a ejercitar? Ej: Clones de Scratch, Scripts de Roblox o Variables analógicas en Micro:bit."
              rows={2}
              className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Dynamic list of Class Selectors */}
          <div className="mb-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Listado de Proyectos del Plan ({classIds.length}):
              </label>
              {classIds.length < 12 && (
                <button
                  type="button"
                  onClick={addClassField}
                  className="text-xs font-bold text-slate-900 hover:text-slate-800 flex items-center gap-1 cursor-pointer bg-pixelitos-yellow px-2 py-1 rounded"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar más clases (Máx 12)
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classIds.map((classId, index) => (
                <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white font-mono font-bold text-2xs shrink-0">
                    {index + 1}
                  </span>
                  <select
                    value={classId}
                    onChange={(e) => handleClassChange(index, e.target.value)}
                    className="w-full text-xs rounded-md border border-slate-200 p-1.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="">-- Seleccionar juego / recurso --</option>
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        [{m.tool}] {m.title}
                      </option>
                    ))}
                  </select>
                  {classIds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeClassField(index)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 cursor-pointer"
                      title="Quitar esta clase"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
              Guardar Planificación
            </button>
          </div>
        </form>
      )}

      {/* Grid of existing plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-sans text-sm">No hay planificaciones creadas aún. ¡Crea el primer plan arriba!</p>
          </div>
        ) : (
          plans.map((plan) => {
            const listIds = plan.classIds || [];
            return (
              <div
                key={plan.id}
                className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs relative overflow-hidden hover:shadow-sm transition-shadow"
                id={`class-plan-card-${plan.id}`}
              >
                {/* Decorative side accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-pixelitos-yellow-dark" />

                <div>
                  {/* Plan Header */}
                  <div className="flex items-start justify-between gap-2 mb-3 pl-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-pixelitos-yellow/45 border border-pixelitos-yellow-dark/30 px-2.5 py-0.5 rounded">
                        {plan.targetGroup}
                      </span>
                      <h4 className="font-sans text-base font-bold text-slate-900 mt-1.5 leading-snug">
                        {plan.month}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Eliminar este plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Plan Objectives */}
                  {plan.objectives && (
                    <p className="font-sans text-xs text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-100 leading-relaxed mb-4 pl-3">
                      <span className="font-bold text-slate-700 block mb-0.5">Objetivo Pedagógico:</span>
                      {plan.objectives}
                    </p>
                  )}

                  {/* Graphical Path/Route Flow */}
                  <div className="mb-4 pl-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                      Ruta del Aprendizaje ({listIds.length} Estaciones):
                    </span>

                    {listIds.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No hay clases asignadas en este plan.</span>
                    ) : (
                      <div className="relative pl-1 pr-1 py-1 space-y-4">
                        {listIds.map((classId, idx) => {
                          const material = materials.find((m) => m.id === classId);
                          const isLast = idx === listIds.length - 1;

                          // Theme settings per tool
                          let nodeBg = 'bg-slate-100 border-slate-300 text-slate-700';
                          let pillBg = 'bg-slate-100 text-slate-800 border-slate-200';
                          let emoji = '💻';

                          if (material) {
                            if (material.tool === 'Scratch') {
                              nodeBg = 'bg-orange-500 border-orange-600 text-white shadow-sm';
                              pillBg = 'bg-orange-50 text-orange-800 border-orange-200';
                              emoji = '🐱';
                            } else if (material.tool === 'Kahoot') {
                              nodeBg = 'bg-violet-600 border-violet-700 text-white shadow-sm';
                              pillBg = 'bg-violet-50 text-violet-800 border-violet-200';
                              emoji = '💜';
                            } else if (material.tool === 'Roblox Studio') {
                              nodeBg = 'bg-sky-600 border-sky-700 text-white shadow-sm';
                              pillBg = 'bg-sky-50 text-sky-800 border-sky-200';
                              emoji = '🕹️';
                            } else if (material.tool === 'Micro:bit') {
                              nodeBg = 'bg-teal-600 border-teal-700 text-white shadow-sm';
                              pillBg = 'bg-teal-50 text-teal-800 border-teal-200';
                              emoji = '🔌';
                            } else if (material.tool === 'Code.org' || material.tool === 'Pilas Bloques') {
                              nodeBg = 'bg-emerald-500 border-emerald-600 text-white shadow-sm';
                              pillBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                              emoji = '🧱';
                            } else {
                              nodeBg = 'bg-slate-800 border-slate-950 text-white shadow-sm';
                              pillBg = 'bg-slate-100 text-slate-800 border-slate-200';
                              emoji = '📂';
                            }
                          }

                          const materialTitle = material ? material.title : 'Recurso no encontrado';
                          const materialLevel = material ? material.level : '';
                          const materialDiff = material ? material.difficulty : '';
                          const materialUrl = material ? material.url : '';

                          return (
                            <div key={idx} className="relative flex items-stretch gap-3 pb-2 last:pb-0">
                              {/* Route Line Connector */}
                              {!isLast && (
                                <div className="absolute left-[14px] top-[26px] bottom-[-22px] w-[3px] bg-slate-200 border-l border-dashed border-slate-300 z-0"></div>
                              )}

                              {/* Station Node Number */}
                              <div className={`w-[30px] h-[30px] rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-transform hover:scale-110 ${nodeBg}`}>
                                {idx + 1}
                              </div>

                              {/* Station Mini-Card */}
                              <div className="flex-1 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-3xs">
                                <div className="flex items-start gap-2 truncate">
                                  <span className="text-base shrink-0 mt-0.5">{emoji}</span>
                                  <div className="truncate">
                                    <h5 className="font-sans font-bold text-[11px] text-slate-800 leading-snug truncate" title={materialTitle}>
                                      {materialTitle}
                                    </h5>
                                    
                                    <div className="flex flex-wrap items-center gap-1 mt-1">
                                      {material && (
                                        <span className={`text-[8px] font-extrabold uppercase px-1 py-0.2 rounded border ${pillBg}`}>
                                          {material.tool}
                                        </span>
                                      )}
                                      {materialLevel && (
                                        <span className="text-[8px] font-bold text-slate-500 bg-slate-200/50 px-1 py-0.2 rounded border border-slate-200/20">
                                          Nivel {materialLevel}
                                        </span>
                                      )}
                                      {materialDiff && (
                                        <span className={`text-[8px] font-bold px-1 py-0.2 rounded uppercase ${
                                          materialDiff === 'bajo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' :
                                          materialDiff === 'intermedio' ? 'bg-amber-50 text-amber-700 border border-amber-100/50' :
                                          'bg-rose-50 text-rose-700 border border-rose-100/50'
                                        }`}>
                                          {materialDiff}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {materialUrl && (
                                  <a
                                    href={materialUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-slate-900 hover:text-amber-600 self-start md:self-center transition-colors shrink-0 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-3xs"
                                  >
                                    <span>Ver</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pin notice */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end text-[10px] text-slate-400 gap-1 pl-2">
                  <Bookmark className="w-3 h-3 text-slate-400" />
                  <span>Guardado localmente</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

