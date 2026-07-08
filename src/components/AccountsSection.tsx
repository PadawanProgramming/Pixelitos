import React, { useState } from 'react';
import { Key, Search, UserCheck, Plus, Trash2, Copy, Check, Filter } from 'lucide-react';

interface Account {
  id: string;
  name: string; // Account description, e.g., "Profe Coordinación", "Grupo Pequeños Aula 2"
  type: 'Profe' | 'Alumno';
  platform: 'Scratch' | 'Roblox' | 'Micro:bit' | 'Kahoot' | 'Gmail / General';
  username: string;
  password?: string;
  notes?: string;
}

export const AccountsSection: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('pixelitos_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default initial seed data for immediate usability
    return [
      {
        id: 'acc-1',
        name: 'Cuenta Profe Principal Scratch',
        type: 'Profe',
        platform: 'Scratch',
        username: 'pixelitos_profes_2026',
        password: 'PixelitosScratchPass!',
        notes: 'Uso general para guardar plantillas de clase. ¡Cuidado de no modificar los proyectos base!',
      },
      {
        id: 'acc-2',
        name: 'Licencias Estudiantes Roblox Studio Grupo A',
        type: 'Alumno',
        platform: 'Roblox',
        username: 'pixelitos_estudiante_A1',
        password: 'RobloxStudent9921',
        notes: 'Compartido para los chicos de Roblox del grupo de las 18hs.',
      },
      {
        id: 'acc-3',
        name: 'Cuenta Coordinadora Pixelitos',
        type: 'Profe',
        platform: 'Gmail / General',
        username: 'contacto@pixelitos.edu',
        password: 'PixelitosAdminSecure#1',
        notes: 'Gmail de contacto y coordinación pedagógica general.',
      },
      {
        id: 'acc-4',
        name: 'Kahoot PREMIUM Academia',
        type: 'Profe',
        platform: 'Kahoot',
        username: 'kahoots_pixelitos',
        password: 'KahootPlay2026!',
        notes: 'Cuenta de acceso a los cuestionarios premium de la academia.',
      }
    ];
  });

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'Profe' | 'Alumno'>('Todos');
  const [platformFilter, setPlatformFilter] = useState<string>('Todos');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'Profe' | 'Alumno'>('Profe');
  const [platform, setPlatform] = useState<'Scratch' | 'Roblox' | 'Micro:bit' | 'Kahoot' | 'Gmail / General'>('Scratch');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<'user' | 'pass' | null>(null);

  const saveAccounts = (newAccounts: Account[]) => {
    setAccounts(newAccounts);
    localStorage.setItem('pixelitos_accounts', JSON.stringify(newAccounts));
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;

    const newAcc: Account = {
      id: `acc-${Date.now()}`,
      name: name.trim(),
      type,
      platform,
      username: username.trim(),
      password: password.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    const updated = [newAcc, ...accounts];
    saveAccounts(updated);

    // Reset Form
    setName('');
    setUsername('');
    setPassword('');
    setNotes('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que querés eliminar esta cuenta?')) {
      const updated = accounts.filter(a => a.id !== id);
      saveAccounts(updated);
    }
  };

  const handleCopy = (id: string, text: string, field: 'user' | 'pass') => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedId(null);
      setCopiedField(null);
    }, 1500);
  };

  // Filter accounts
  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = 
      acc.name.toLowerCase().includes(search.toLowerCase()) ||
      acc.username.toLowerCase().includes(search.toLowerCase()) ||
      (acc.notes || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === 'Todos' || acc.type === typeFilter;
    const matchesPlatform = platformFilter === 'Todos' || acc.platform === platformFilter;

    return matchesSearch && matchesType && matchesPlatform;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs" id="accounts-management-section">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-sans text-xl font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-slate-800" />
            Gestión de Cuentas y Accesos 🔐
          </h2>
          <p className="font-sans text-xs text-slate-500 mt-1">
            Visualicen y organicen las credenciales compartidas para profesores y alumnos en Scratch, Roblox, Kahoots y más.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer"
        >
          {showForm ? 'Cerrar' : <><Plus className="w-4 h-4" /> Agregar Cuenta</>}
        </button>
      </div>

      {/* Add Account Form */}
      {showForm && (
        <form onSubmit={handleCreateAccount} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 animate-fade-in space-y-4">
          <h3 className="font-sans text-sm font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            Registrar Nuevas Credenciales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción / Nombre:</label>
              <input
                type="text"
                required
                placeholder="Ej. Scratch Aula 2 Chicos"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Destinado a:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
              >
                <option value="Profe">Profe 🍎</option>
                <option value="Alumno">Alumno 🎒</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Plataforma:</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
              >
                <option value="Scratch">Scratch</option>
                <option value="Roblox">Roblox</option>
                <option value="Micro:bit">Micro:bit</option>
                <option value="Kahoot">Kahoot</option>
                <option value="Gmail / General">Gmail / General</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Usuario / Email:</label>
              <input
                type="text"
                required
                placeholder="Ej. pixelitos_alumnos_2026"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña:</label>
              <input
                type="text"
                placeholder="Contraseña del login"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notas Internas o Advertencias de Uso (Opcional):</label>
            <textarea
              placeholder="Ej. No cambiar la foto de perfil ni vincular tarjetas bancarias."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              Guardar Cuenta
            </button>
          </div>
        </form>
      )}

      {/* Filters and Search controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, usuario, notas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="md:col-span-3 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="Todos">Todos los roles</option>
            <option value="Profe">Profesores</option>
            <option value="Alumno">Alumnos</option>
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
            <option value="Roblox">Roblox</option>
            <option value="Micro:bit">Micro:bit</option>
            <option value="Kahoot">Kahoot</option>
            <option value="Gmail / General">Gmail / General</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <UserCheck className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-sans text-xs font-semibold">No se encontraron cuentas que coincidan con la búsqueda.</p>
          </div>
        ) : (
          filteredAccounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-white border border-slate-200 hover:border-slate-300 transition-all rounded-xl p-4 shadow-3xs flex flex-col justify-between"
              id={`account-card-${acc.id}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    acc.type === 'Profe' ? 'bg-amber-100 text-amber-900' : 'bg-indigo-100 text-indigo-900'
                  }`}>
                    {acc.type === 'Profe' ? '🍎 Profe' : '🎒 Alumno'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/50">
                    {acc.platform}
                  </span>
                </div>

                <h4 className="font-sans text-xs font-extrabold text-slate-900 line-clamp-1 mb-2">
                  {acc.name}
                </h4>

                {/* Account Credentials block */}
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 space-y-2 mb-3">
                  <div className="flex items-center justify-between text-2xs gap-1.5">
                    <span className="text-slate-400 font-semibold select-none">Usuario:</span>
                    <div className="flex items-center gap-1 overflow-hidden">
                      <span className="font-mono text-slate-800 select-all truncate max-w-[120px] font-semibold">{acc.username}</span>
                      <button
                        onClick={() => handleCopy(acc.id, acc.username, 'user')}
                        className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                        title="Copiar usuario"
                      >
                        {copiedId === acc.id && copiedField === 'user' ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {acc.password && (
                    <div className="flex items-center justify-between text-2xs gap-1.5">
                      <span className="text-slate-400 font-semibold select-none">Contraseña:</span>
                      <div className="flex items-center gap-1 overflow-hidden">
                        <span className="font-mono text-slate-800 select-all truncate max-w-[120px] font-semibold">{acc.password}</span>
                        <button
                          onClick={() => handleCopy(acc.id, acc.password!, 'pass')}
                          className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                          title="Copiar contraseña"
                        >
                          {copiedId === acc.id && copiedField === 'pass' ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {acc.notes && (
                  <p className="font-sans text-[10px] text-slate-500 italic leading-relaxed mb-3">
                    <strong className="text-slate-600 not-italic">Nota: </strong>
                    {acc.notes}
                  </p>
                )}
              </div>

              {/* Delete Button */}
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleDelete(acc.id)}
                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                  title="Eliminar estas credenciales"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
