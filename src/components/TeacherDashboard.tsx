import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Key, Edit, Save, X, Search, Sparkles, ShieldCheck } from 'lucide-react';
import { LevelType, StudentProfile, TeacherProfile } from '../types';

interface TeacherDashboardProps {
  onStudentsChanged?: () => void;
  userRole?: string;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onStudentsChanged, userRole }) => {
  if (userRole === 'alumno') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-6 rounded-2xl flex items-start gap-4 max-w-xl mx-auto my-12 shadow-xs animate-fade-in">
        <ShieldCheck className="w-8 h-8 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-sans font-black uppercase tracking-wider text-red-800 text-sm">Acceso Denegado 🔐</h4>
          <p className="font-sans text-red-600 leading-relaxed font-semibold">
            No tenés permisos para visualizar o administrar la sección de Alumnos/Dashboard. 
            Esta área está reservada exclusivamente para el personal docente y administrativo de Pixelitos.
          </p>
        </div>
      </div>
    );
  }

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('pixelitos_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Seed initial students if empty for a highly professional feel
    return [
      {
        id: 'std-1',
        name: 'Mateo González',
        level: '1°1°',
        username: 'mateo_gonzalez_px',
        password: 'mateo123',
        notes: 'Asiste los lunes 18hs. Le encantan los proyectos de Scratch de laberintos.'
      },
      {
        id: 'std-2',
        name: 'Sofía Martínez',
        level: '1°2°',
        username: 'sofia_martinez_px',
        password: 'sofia123',
        notes: 'Tiene buen manejo del mouse, pasa rápido a desafíos intermedios.'
      },
      {
        id: 'std-3',
        name: 'Thiago Benítez',
        level: '2°1°',
        username: 'thiago_benitez_px',
        password: 'thiago123',
        notes: 'Interesado en robótica analógica con Micro:bit.'
      },
      {
        id: 'std-4',
        name: 'Valentina Rodríguez',
        level: '2°2°',
        username: 'valentina_rodriguez_px',
        password: 'valen123',
        notes: 'Nivel avanzado Roblox Studio. Gran capacidad de abstracción.'
      }
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New Student form states
  const [newName, setNewName] = useState('');
  const [newLevel, setNewLevel] = useState<LevelType>('1°1°');
  const [newPassword, setNewPassword] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLevel, setEditLevel] = useState<LevelType>('1°1°');
  const [editPassword, setEditPassword] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Active sub-tab for Admin (students vs teachers)
  const [activeSubTab, setActiveSubTab] = useState<'students' | 'teachers'>('students');

  // Teachers State
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => {
    const saved = localStorage.getItem('pixelitos_teachers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 't-1', name: 'Profesor Principal', password: 'profe', notes: 'Profesor titular del taller de robótica.' },
      { id: 't-2', name: 'Profe Auxiliar', password: 'profe2026', notes: 'Asistente de Scratch y Pilas Bloques.' }
    ];
  });

  const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherPassword, setNewTeacherPassword] = useState('');
  const [newTeacherNotes, setNewTeacherNotes] = useState('');

  // Editing teacher state
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editTeacherPassword, setEditTeacherPassword] = useState('');
  const [editTeacherNotes, setEditTeacherNotes] = useState('');

  // Fetch students and teachers from Neon DB on mount
  useEffect(() => {
    fetch('/api/students')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStudents(data);
        }
      })
      .catch((err) => console.error('Error fetching students from DB:', err));

    fetch('/api/teachers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTeachers(data);
        }
      })
      .catch((err) => console.error('Error fetching teachers from DB:', err));
  }, []);

  const saveTeachers = (updatedList: TeacherProfile[], teacherToUpsert?: TeacherProfile, teacherIdToDelete?: string) => {
    setTeachers(updatedList);
    localStorage.setItem('pixelitos_teachers', JSON.stringify(updatedList));

    if (teacherToUpsert) {
      fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherToUpsert),
      }).catch((err) => console.error('Error saving teacher to DB:', err));
    }

    if (teacherIdToDelete) {
      fetch(`/api/teachers/${teacherIdToDelete}`, {
        method: 'DELETE',
      }).catch((err) => console.error('Error deleting teacher from DB:', err));
    }
  };

  const saveStudents = (updatedList: StudentProfile[], studentToUpsert?: StudentProfile, studentIdToDelete?: string) => {
    setStudents(updatedList);
    localStorage.setItem('pixelitos_students', JSON.stringify(updatedList));
    if (onStudentsChanged) onStudentsChanged();

    if (studentToUpsert) {
      fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentToUpsert),
      }).catch((err) => console.error('Error saving student to DB:', err));
    }

    if (studentIdToDelete) {
      fetch(`/api/students/${studentIdToDelete}`, {
        method: 'DELETE',
      }).catch((err) => console.error('Error deleting student from DB:', err));
    }
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Auto-generate username from name: e.g. "mateo_gonzalez_px"
    const cleanName = newName.trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9\s]/g, "") // remove special chars
      .replace(/\s+/g, '_'); // spaces to underscore
    const autoUsername = `${cleanName}_px`;

    const newStudent: StudentProfile = {
      id: `std-${Date.now()}`,
      name: newName.trim(),
      level: newLevel,
      username: autoUsername,
      password: newPassword.trim() || 'pixelitos123',
      notes: newNotes.trim() || undefined
    };

    const updated = [newStudent, ...students];
    saveStudents(updated, newStudent);

    // Reset Form
    setNewName('');
    setNewLevel('1°1°');
    setNewPassword('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    let shouldDelete = false;
    try {
      shouldDelete = confirm(`¿Estás seguro de que deseas dar de baja el perfil del alumno "${name}"?`);
    } catch (e) {
      shouldDelete = true; // Fallback if browser blocks confirm inside sandbox
    }
    if (shouldDelete) {
      const updated = students.filter(s => s.id !== id);
      saveStudents(updated, undefined, id);
    }
  };

  const handleStartEditing = (student: StudentProfile) => {
    setEditingId(student.id);
    setEditLevel(student.level);
    setEditPassword(student.password || '');
    setEditNotes(student.notes || '');
  };

  const handleSaveEdit = (id: string) => {
    let targetStudent: StudentProfile | undefined;
    const updated = students.map(s => {
      if (s.id === id) {
        targetStudent = {
          ...s,
          level: editLevel,
          password: editPassword.trim() || 'pixelitos123',
          notes: editNotes.trim() || undefined
        };
        return targetStudent;
      }
      return s;
    });
    saveStudents(updated, targetStudent);
    setEditingId(null);
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;

    const newTeacher: TeacherProfile = {
      id: `t-${Date.now()}`,
      name: newTeacherName.trim(),
      password: newTeacherPassword.trim() || 'profe123',
      notes: newTeacherNotes.trim() || undefined
    };

    const updated = [newTeacher, ...teachers];
    saveTeachers(updated, newTeacher);

    // Reset Form
    setNewTeacherName('');
    setNewTeacherPassword('');
    setNewTeacherNotes('');
    setShowAddTeacherForm(false);
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    let shouldDelete = false;
    try {
      shouldDelete = confirm(`¿Estás seguro de que deseas eliminar el perfil del profesor "${name}"?`);
    } catch (e) {
      shouldDelete = true;
    }
    if (shouldDelete) {
      const updated = teachers.filter(t => t.id !== id);
      saveTeachers(updated, undefined, id);
    }
  };

  const handleStartEditingTeacher = (teacher: TeacherProfile) => {
    setEditingTeacherId(teacher.id);
    setEditTeacherName(teacher.name);
    setEditTeacherPassword(teacher.password || '');
    setEditTeacherNotes(teacher.notes || '');
  };

  const handleSaveEditTeacher = (id: string) => {
    let targetTeacher: TeacherProfile | undefined;
    const updated = teachers.map(t => {
      if (t.id === id) {
        targetTeacher = {
          ...t,
          name: editTeacherName.trim(),
          password: editTeacherPassword.trim() || 'profe123',
          notes: editTeacherNotes.trim() || undefined
        };
        return targetTeacher;
      }
      return t;
    });
    saveTeachers(updated, targetTeacher);
    setEditingTeacherId(null);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.notes || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.notes || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute distribution
  const levelDistribution = {
    '1°1°': students.filter(s => s.level === '1°1°').length,
    '1°2°': students.filter(s => s.level === '1°2°').length,
    '2°1°': students.filter(s => s.level === '2°1°').length,
    '2°2°': students.filter(s => s.level === '2°2°').length,
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs animate-fade-in" id="teacher-dashboard">
      
      {/* 1. Admin Switcher Tabs */}
      {userRole === 'admin' && (
        <div className="flex border-b border-slate-100 mb-6 gap-2">
          <button
            onClick={() => {
              setActiveSubTab('students');
              setSearchQuery('');
            }}
            className={`pb-3 px-4 font-sans text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 cursor-pointer ${
              activeSubTab === 'students'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Alumnos 👥 ({students.length})
          </button>
          <button
            onClick={() => {
              setActiveSubTab('teachers');
              setSearchQuery('');
            }}
            className={`pb-3 px-4 font-sans text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 cursor-pointer ${
              activeSubTab === 'teachers'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Profesores 🍎 ({teachers.length})
          </button>
        </div>
      )}

      {activeSubTab === 'students' ? (
        <>
          {/* Header section with Stats */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-sans text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-800" />
                Control de Alumnos y Niveles 👥
              </h2>
              <p className="font-sans text-xs text-slate-500 mt-1">
                Administren los accesos individuales de sus alumnos, cambien su nivel de taller para filtrar proyectos, y actualicen sus contraseñas.
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              {showAddForm ? 'Cerrar' : <><Plus className="w-4 h-4" /> Registrar Alumno</>}
            </button>
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Alumnos</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{students.length}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Nivel 1°1°</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{levelDistribution['1°1°']}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">Nivel 1°2°</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{levelDistribution['1°2°']}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">Nivel 2°1°</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{levelDistribution['2°1°']}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider block">Nivel 2°2°</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{levelDistribution['2°2°']}</span>
            </div>
          </div>

          {/* Add Student Form */}
          {showAddForm && (
            <form onSubmit={handleCreateStudent} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 animate-fade-in space-y-4">
              <h3 className="font-sans text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Crear Nuevo Perfil de Alumno
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Santiago Gómez"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nivel del Alumno:</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as LevelType)}
                    className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
                  >
                    <option value="1°1°">1°1° (7-8 años)</option>
                    <option value="1°2°">1°2° (8-9 años)</option>
                    <option value="2°1°">2°1° (10-11 años)</option>
                    <option value="2°2°">2°2° (11-12 años)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña de Ingreso:</label>
                  <input
                    type="text"
                    placeholder="Contraseña para el alumno"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notas Pedagógicas u Observaciones (Opcional):</label>
                <input
                  type="text"
                  placeholder="Ej. Interesado en diseño de videojuegos en Scratch..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Registrar Alumno
                </button>
              </div>
            </form>
          )}

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Buscar alumnos por nombre, usuario, notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none"
            />
          </div>

          {/* Table List */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-sans text-xs font-bold text-slate-700">
                  <th className="p-4">Nombre Alumno</th>
                  <th className="p-4">Usuario Asignado</th>
                  <th className="p-4">Nivel Actual</th>
                  <th className="p-4">Contraseña</th>
                  <th className="p-4">Notas / Notas Pedagógicas</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-sans font-medium">
                      No se encontraron perfiles de alumnos registrados.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => {
                    const isEditing = editingId === student.id;
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/55 transition-colors">
                        <td className="p-4 font-bold text-slate-900">
                          {student.name}
                        </td>
                        <td className="p-4 font-mono text-slate-500 font-semibold select-all">
                          {student.username}
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <select
                              value={editLevel}
                              onChange={(e) => setEditLevel(e.target.value as LevelType)}
                              className="text-2xs rounded-md border border-slate-300 p-1 bg-white text-slate-800 focus:outline-none"
                            >
                              <option value="1°1°">1°1°</option>
                              <option value="1°2°">1°2°</option>
                              <option value="2°1°">2°1°</option>
                              <option value="2°2°">2°2°</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-0.5 rounded-md font-bold ${
                              student.level === '1°1°' ? 'bg-amber-100 text-amber-900' :
                              student.level === '1°2°' ? 'bg-emerald-100 text-emerald-900' :
                              student.level === '2°1°' ? 'bg-indigo-100 text-indigo-900' :
                              'bg-pink-100 text-pink-900'
                            }`}>
                              Nivel {student.level}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editPassword}
                              onChange={(e) => setEditPassword(e.target.value)}
                              className="text-2xs rounded-md border border-slate-300 p-1 w-24 bg-white text-slate-800"
                            />
                          ) : (
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-semibold text-slate-700">
                              {student.password || 'pixelitos123'}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              className="text-2xs rounded-md border border-slate-300 p-1 w-full bg-white text-slate-800"
                            />
                          ) : (
                            <p className="line-clamp-2 italic text-slate-500 font-sans leading-relaxed max-w-xs">
                              {student.notes || '-'}
                            </p>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(student.id)}
                                  className="p-1 rounded hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                                  title="Guardar cambios"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                                  title="Cancelar edición"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleStartEditing(student)}
                                  className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
                                  title="Editar nivel o contraseña"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(student.id, student.name)}
                                  className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 cursor-pointer"
                                  title="Dar de baja perfil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Teacher management sub-tab */
        <>
          {/* Header section with Stats */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-sans text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-800" />
                Control de Personal Docente 🍎
              </h2>
              <p className="font-sans text-xs text-slate-500 mt-1">
                Gestioná el acceso de los profesores del taller. Cada uno cuenta con una contraseña única para entrar a su perfil.
              </p>
            </div>

            <button
              onClick={() => setShowAddTeacherForm(!showAddTeacherForm)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              {showAddTeacherForm ? 'Cerrar' : <><Plus className="w-4 h-4" /> Registrar Profesor</>}
            </button>
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Profesores Registrados</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{teachers.length}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center col-span-2">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Rol Administrativo Activo</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">Full Control ⚙️</span>
            </div>
          </div>

          {/* Add Teacher Form */}
          {showAddTeacherForm && (
            <form onSubmit={handleCreateTeacher} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 animate-fade-in space-y-4">
              <h3 className="font-sans text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Crear Nuevo Perfil de Profesor
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo del Profesor:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. María Luz Castro"
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña de Acceso:</label>
                  <input
                    type="text"
                    placeholder="Ej. profe2026"
                    value={newTeacherPassword}
                    onChange={(e) => setNewTeacherPassword(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rol / Especialidad / Observación (Opcional):</label>
                <input
                  type="text"
                  placeholder="Ej. Encargada de Scratch intermedio, turno mañana..."
                  value={newTeacherNotes}
                  onChange={(e) => setNewTeacherNotes(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Registrar Profesor
                </button>
              </div>
            </form>
          )}

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Buscar profesores por nombre, observaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none"
            />
          </div>

          {/* Teacher Table List */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-sans text-xs font-bold text-slate-700">
                  <th className="p-4">Nombre del Profesor</th>
                  <th className="p-4">Contraseña de Ingreso</th>
                  <th className="p-4">Especialidad / Observación</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 font-sans font-medium">
                      No se encontraron perfiles de profesores registrados.
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map(teacher => {
                    const isEditing = editingTeacherId === teacher.id;
                    return (
                      <tr key={teacher.id} className="hover:bg-slate-50/55 transition-colors">
                        <td className="p-4 font-bold text-slate-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editTeacherName}
                              onChange={(e) => setEditTeacherName(e.target.value)}
                              className="text-2xs rounded-md border border-slate-300 p-1 w-full bg-white text-slate-800"
                            />
                          ) : (
                            teacher.name
                          )}
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editTeacherPassword}
                              onChange={(e) => setEditTeacherPassword(e.target.value)}
                              className="text-2xs rounded-md border border-slate-300 p-1 w-36 bg-white text-slate-800"
                            />
                          ) : (
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-semibold text-slate-700">
                              {teacher.password || 'profe2026'}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editTeacherNotes}
                              onChange={(e) => setEditTeacherNotes(e.target.value)}
                              className="text-2xs rounded-md border border-slate-300 p-1 w-full bg-white text-slate-800"
                            />
                          ) : (
                            <p className="line-clamp-2 italic text-slate-500 font-sans leading-relaxed max-w-xs">
                              {teacher.notes || '-'}
                            </p>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveEditTeacher(teacher.id)}
                                  className="p-1 rounded hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                                  title="Guardar cambios"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingTeacherId(null)}
                                  className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                                  title="Cancelar edición"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleStartEditingTeacher(teacher)}
                                  className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
                                  title="Editar nombre o contraseña"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                                  className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 cursor-pointer"
                                  title="Eliminar profesor"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
