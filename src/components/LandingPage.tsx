import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, Key, Lock, Sparkles, BookOpen, ShieldCheck, Laptop, HelpCircle } from 'lucide-react';
import { LevelType, UserRole, UserSession, StudentProfile, TeacherProfile } from '../types';
import { signSession } from '../utils/security';

interface LandingPageProps {
  onLogin: (session: UserSession) => void;
}

const DEFAULT_STUDENTS: StudentProfile[] = [
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

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [loginRole, setLoginRole] = useState<UserRole | null>(null);
  const [studentPass, setStudentPass] = useState('');
  const [teacherPass, setTeacherPass] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showHelper, setShowHelper] = useState(true);
  
  const [dbStudents, setDbStudents] = useState<StudentProfile[]>([]);
  const [dbTeachers, setDbTeachers] = useState<TeacherProfile[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-fetch live accounts from database on load
  useEffect(() => {
    fetch('/api/students')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDbStudents(data);
      })
      .catch((err) => console.error('Error pre-fetching students for login:', err));

    fetch('/api/teachers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDbTeachers(data);
      })
      .catch((err) => console.error('Error pre-fetching teachers for login:', err));
  }, []);

  // Auto-focus the input when a role is selected
  useEffect(() => {
    if (loginRole && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loginRole]);

  // Read registered students or seed them
  const getStudentsList = (): StudentProfile[] => {
    const saved = localStorage.getItem('pixelitos_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Seed in localStorage for consistency
    localStorage.setItem('pixelitos_students', JSON.stringify(DEFAULT_STUDENTS));
    return DEFAULT_STUDENTS;
  };

  const getTeachersList = (): TeacherProfile[] => {
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (loginRole === 'alumno') {
      const enteredPass = studentPass.trim();
      if (!enteredPass) {
        setErrorMsg('Por favor ingresá tu contraseña.');
        return;
      }

      const allStudents = dbStudents.length > 0 ? dbStudents : getStudentsList();
      // Match passcode case-insensitively for student convenience
      const profile = allStudents.find(
        (s) => s.password?.trim().toLowerCase() === enteredPass.toLowerCase()
      );

      if (!profile) {
        setErrorMsg('La contraseña ingresada no coincide con ningún alumno registrado. ¡Verificá con tu profe!');
        return;
      }

      onLogin(signSession({
        role: 'alumno',
        studentLevel: profile.level,
        studentName: profile.name
      }));
    } else if (loginRole === 'profesor') {
      const enteredPass = teacherPass.trim().toLowerCase();
      if (!enteredPass) {
        setErrorMsg('Por favor ingresá tu contraseña.');
        return;
      }

      const allTeachers = dbTeachers.length > 0 ? dbTeachers : getTeachersList();
      const match = allTeachers.find(
        (t) => t.password?.trim().toLowerCase() === enteredPass
      );

      if (match || enteredPass === 'profe2026' || enteredPass === 'profe') {
        onLogin(signSession({ role: 'profesor' }));
      } else {
        setErrorMsg('Contraseña de profesor incorrecta.');
      }
    } else if (loginRole === 'admin') {
      const enteredPass = adminPass.trim().toLowerCase();
      if (enteredPass === 'admin2026' || enteredPass === 'admin') {
        onLogin(signSession({ role: 'admin' }));
      } else {
        setErrorMsg('Contraseña de administrador incorrecta. Probá con "admin2026".');
      }
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setLoginRole(role);
    setErrorMsg('');
    setStudentPass('');
    setTeacherPass('');
    setAdminPass('');
  };

  const handleBack = () => {
    setLoginRole(null);
    setErrorMsg('');
  };

  const allStudents = getStudentsList();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="pixelitos-landing">
      {/* Decorative Brand Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white text-lg tracking-wider border-2 border-[#f0da4c] shadow-xs">
            P
          </div>
          <div>
            <h1 className="font-sans font-black text-base text-slate-900 tracking-tight leading-none uppercase">Pixelitos</h1>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Portal de Aprendizaje</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 font-sans font-medium hidden sm:inline">
            ✨ Programando el futuro, un píxel a la vez
          </span>
        </div>
      </header>

      {/* Main Container - Centered Content Only */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
          
          {/* Top Info Header */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-slate-950 bg-[#f0da4c] border border-amber-400/40 shadow-2xs">
              <Sparkles className="w-3 h-3 shrink-0" /> Taller de Tecnología y Programación
            </span>
            <h2 className="font-sans font-black text-2xl md:text-3xl text-slate-900 tracking-tight leading-tight pt-1">
              Ingreso a la Plataforma 🔐
            </h2>
            <p className="font-sans text-xs text-slate-500">
              {loginRole 
                ? `Ingresá las credenciales para acceder a tu perfil de ${loginRole}` 
                : '¡Hola! Para comenzar, seleccioná cómo vas a ingresar hoy:'}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center gap-2.5 animate-pulse">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Form and Selection Handler */}
          {!loginRole ? (
            /* 2.1 Role Selector Options */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => handleRoleSelect('alumno')}
                className="group flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-emerald-100 hover:border-emerald-400 bg-emerald-50/30 hover:bg-emerald-50/80 transition-all cursor-pointer text-center space-y-3 shadow-3xs hover:-translate-y-1 active:scale-95"
              >
                <div className="w-12 h-12 bg-emerald-100 group-hover:bg-emerald-200 rounded-full flex items-center justify-center text-xl transition-all">
                  🎒
                </div>
                <div>
                  <h4 className="font-sans font-black text-sm text-slate-900">Alumno</h4>
                  <p className="font-sans text-[10px] text-slate-500 mt-1">Con tu contraseña secreta</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('profesor')}
                className="group flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-amber-100 hover:border-amber-400 bg-amber-50/20 hover:bg-amber-50/70 transition-all cursor-pointer text-center space-y-3 shadow-3xs hover:-translate-y-1 active:scale-95"
              >
                <div className="w-12 h-12 bg-amber-100 group-hover:bg-amber-200 rounded-full flex items-center justify-center text-xl transition-all">
                  🍎
                </div>
                <div>
                  <h4 className="font-sans font-black text-sm text-slate-900">Profesor</h4>
                  <p className="font-sans text-[10px] text-slate-500 mt-1">Planificar y ver recursos</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('admin')}
                className="group flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-indigo-100 hover:border-indigo-400 bg-indigo-50/20 hover:bg-indigo-50/75 transition-all cursor-pointer text-center space-y-3 shadow-3xs hover:-translate-y-1 active:scale-95"
              >
                <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-200 rounded-full flex items-center justify-center text-xl transition-all">
                  💻
                </div>
                <div>
                  <h4 className="font-sans font-black text-sm text-slate-900">Admin</h4>
                  <p className="font-sans text-[10px] text-slate-500 mt-1">Controlar base de datos</p>
                </div>
              </button>
            </div>
          ) : (
            /* Login forms based on role */
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cambiar de Rol</span>
                </button>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200/60">
                  {loginRole === 'alumno' ? '🎒 Perfil Alumno' : loginRole === 'profesor' ? '🍎 Personal' : '💻 Soporte'}
                </span>
              </div>

              {loginRole === 'alumno' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Contraseña Única de Alumno:</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      ref={inputRef}
                      type="password"
                      placeholder="Ingresá tu contraseña secreta asignada"
                      value={studentPass}
                      onChange={(e) => setStudentPass(e.target.value)}
                      required
                      className="w-full text-sm rounded-xl border border-slate-300 pl-10 pr-4 py-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    💡 ¡No necesitas buscar tu nombre! Al ingresar tu contraseña, el sistema detecta automáticamente quién eres.
                  </p>
                </div>
              )}

              {loginRole === 'profesor' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Contraseña de Profesor:</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      ref={inputRef}
                      type="password"
                      placeholder="Ingresá la contraseña docente"
                      value={teacherPass}
                      onChange={(e) => setTeacherPass(e.target.value)}
                      required
                      className="w-full text-sm rounded-xl border border-slate-300 pl-10 pr-4 py-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all font-mono"
                    />
                  </div>
                </div>
              )}

              {loginRole === 'admin' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Contraseña de Administrador:</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      ref={inputRef}
                      type="password"
                      placeholder="Ingresá la contraseña de administrador"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      required
                      className="w-full text-sm rounded-xl border border-slate-300 pl-10 pr-4 py-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all font-mono"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer pt-3 active:scale-[0.98]"
              >
                <span>Ingresar al Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Clean Interactive Helper Panel */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
            <button 
              type="button"
              onClick={() => setShowHelper(!showHelper)}
              className="w-full flex items-center justify-between text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                Guía de demostración (Test)
              </span>
              <span className="text-[10px] font-bold text-slate-400 underline uppercase tracking-tight">
                {showHelper ? 'Ocultar' : 'Mostrar'}
              </span>
            </button>

            {showHelper && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-slate-500 font-sans leading-normal pt-1 border-t border-slate-200/60 animate-fade-in">
                <div className="space-y-1.5">
                  <p className="font-bold text-slate-700">🎒 Contraseñas Alumnos:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {allStudents.map((st) => (
                      <li key={st.id}>
                        <span className="font-semibold text-slate-600">{st.name}</span>: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold text-slate-800">{st.password}</code> <span className="text-[9px] text-slate-400">({st.level})</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1.5 md:pl-2 md:border-l border-slate-200/60">
                  <p className="font-bold text-slate-700">🔑 Personal / Staff:</p>
                  <ul className="space-y-1">
                    <li>
                      🍎 Profesor: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold text-slate-800">profe2026</code>
                    </li>
                    <li>
                      💻 Administrador: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold text-slate-800">admin2026</code>
                    </li>
                  </ul>
                  <p className="text-[9px] text-slate-400 mt-1">
                    * Podés dar de alta, modificar o borrar alumnos en el panel de administrador/profesor.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-500 text-center py-5 text-[10px] md:text-xs border-t border-slate-800 shrink-0">
        <p>© {new Date().getFullYear()} Academia Pixelitos S.A. Todos los derechos reservados. Portal pedagógico interactivo de programación escolar.</p>
      </footer>
    </div>
  );
};
