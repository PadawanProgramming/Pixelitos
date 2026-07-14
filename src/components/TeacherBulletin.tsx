import React, { useState, useEffect } from 'react';
import { MessageSquare, Pin, Plus, Trash2, ShieldCheck } from 'lucide-react';

interface BulletinMessage {
  id: string;
  author: string;
  text: string;
  color: 'yellow' | 'cyan' | 'green' | 'pink';
  date: string;
}

interface TeacherBulletinProps {
  userRole?: string;
}

export const TeacherBulletin: React.FC<TeacherBulletinProps> = ({ userRole }) => {
  if (userRole === 'alumno') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-6 rounded-2xl flex items-start gap-4 max-w-xl mx-auto my-12 shadow-xs animate-fade-in">
        <ShieldCheck className="w-8 h-8 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-sans font-black uppercase tracking-wider text-red-800 text-sm">Acceso Denegado 🔐</h4>
          <p className="font-sans text-red-600 leading-relaxed font-semibold">
            No tenés permisos para visualizar la Pizarra del Staff. Esta sección está reservada exclusivamente para profesores y coordinadores de Pixelitos.
          </p>
        </div>
      </div>
    );
  }

  const [messages, setMessages] = useState<BulletinMessage[]>(() => {
    const saved = localStorage.getItem('pixelitos_bulletins');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'msg-1',
        author: 'Guille (Coordinación)',
        text: '¡Hola profes! Recuerden que la cuenta compartida de Scratch es "profespixelitos" con contraseña "pixelitos123". ¡No la cambien así todos pueden entrar!',
        color: 'yellow',
        date: '08/07/2026',
      },
      {
        id: 'msg-2',
        author: 'Antu (Profe)',
        text: 'El proyecto "Esquivar Autos" lo probé con chicos de 10 años y les encantó. Tip: explíquenles primero cómo funciona el bloque de sumar a X/Y antes de arrancar.',
        color: 'cyan',
        date: '07/07/2026',
      },
      {
        id: 'msg-3',
        author: 'Fio (Coordinación)',
        text: '¡Jefas! Ya organicé las carpetas de Drive para el material de soporte no presencial. Cualquier cosa me avisan si falta algún PDF.',
        color: 'pink',
        date: '05/07/2026',
      },
      {
        id: 'msg-4',
        author: 'Guille (Coordinación)',
        text: 'Regla de Oro: En clase trabajemos siempre con copias de los proyectos originales. Así los preservamos limpios para las siguientes comisiones.',
        color: 'green',
        date: '04/07/2026',
      },
    ];
  });

  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [color, setColor] = useState<'yellow' | 'cyan' | 'green' | 'pink'>('yellow');
  const [showForm, setShowForm] = useState(false);

  // Fetch bulletins from Neon DB on mount
  useEffect(() => {
    fetch('/api/bulletins')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMessages(data);
        }
      })
      .catch((err) => console.error('Error fetching bulletins from DB:', err));
  }, []);

  const saveMessages = (newMsgs: BulletinMessage[], msgToUpsert?: BulletinMessage, msgIdToDelete?: string) => {
    setMessages(newMsgs);
    localStorage.setItem('pixelitos_bulletins', JSON.stringify(newMsgs));

    if (msgToUpsert) {
      fetch('/api/bulletins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgToUpsert),
      }).catch((err) => console.error('Error saving bulletin to DB:', err));
    }

    if (msgIdToDelete) {
      fetch(`/api/bulletins/${msgIdToDelete}`, {
        method: 'DELETE',
      }).catch((err) => console.error('Error deleting bulletin from DB:', err));
    }
  };

  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    const newMsg: BulletinMessage = {
      id: `msg-${Date.now()}`,
      author: author.trim(),
      text: text.trim(),
      color,
      date: new Date().toLocaleDateString('es-AR'),
    };

    const updated = [newMsg, ...messages];
    saveMessages(updated, newMsg);

    setAuthor('');
    setText('');
    setShowForm(false);
  };

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    saveMessages(updated, undefined, id);
  };

  const getColorClasses = (c: 'yellow' | 'cyan' | 'green' | 'pink') => {
    switch (c) {
      case 'yellow':
        return 'bg-amber-50 border-amber-200/80 text-amber-950 shadow-xs shadow-amber-100/50';
      case 'cyan':
        return 'bg-sky-50 border-sky-200/80 text-sky-950 shadow-xs shadow-sky-100/50';
      case 'green':
        return 'bg-emerald-50 border-emerald-200/80 text-emerald-950 shadow-xs shadow-emerald-100/50';
      case 'pink':
        return 'bg-rose-50 border-rose-200/80 text-rose-950 shadow-xs shadow-rose-100/50';
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm relative" id="teacher-bulletin-section">
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <h2 className="font-sans text-xl font-bold text-slate-900 flex items-center gap-2">
            <Pin className="w-5 h-5 text-indigo-600 rotate-12" />
            La Pizarra del Staff 📌
          </h2>
          <p className="font-sans text-xs text-slate-500 mt-1">
            Espacio de notas rápidas, tips de aula y avisos compartidos entre los profes y las jefas.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cerrar' : 'Pegar Nota'}
        </button>
      </div>

      {/* Message addition Form */}
      {showForm && (
        <form onSubmit={handleAddMessage} className="bg-white border border-slate-200 rounded-xl p-5 mb-6 relative z-10 shadow-sm animate-fade-in">
          <h3 className="font-sans text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Escribir Nota Adhesiva
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Tu Nombre/Cargo:</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ej. Guille (Coord) o Antu (Profe)"
                required
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Color de la nota:</label>
              <div className="flex gap-2.5 mt-1">
                {(['yellow', 'cyan', 'green', 'pink'] as const).map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setColor(col)}
                    className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                      col === 'yellow' ? 'bg-amber-200' : col === 'cyan' ? 'bg-sky-200' : col === 'green' ? 'bg-emerald-200' : 'bg-rose-200'
                    } ${color === col ? 'border-slate-800 scale-110 shadow-sm' : 'border-transparent hover:scale-105'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Mensaje:</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe un consejo para una clase, contraseña o aviso importante..."
              rows={3}
              required
              maxLength={250}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Fijar Nota 📌
            </button>
          </div>
        </form>
      )}

      {/* Cork Board Sticky Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-5 rounded-xl border shadow-xs transition-all hover:rotate-1 hover:scale-[1.02] flex flex-col justify-between ${getColorClasses(
              msg.color
            )}`}
            style={{ transform: `rotate(${(parseInt(msg.id.slice(-3)) || 0) % 4 - 2}deg)` }}
          >
            {/* Red pin detail */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs border border-rose-600 flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-white/75" />
            </div>

            <div className="pt-2">
              <span className="font-sans font-bold text-xs block mb-1 underline decoration-dotted">
                {msg.author}
              </span>
              <p className="font-sans text-xs leading-relaxed whitespace-pre-wrap break-words italic">
                "{msg.text}"
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-black/5 flex items-center justify-between text-[10px] font-medium opacity-80">
              <span>{msg.date}</span>
              <button
                onClick={() => handleDeleteMessage(msg.id)}
                className="text-slate-500 hover:text-red-600 p-1 rounded hover:bg-black/5 transition-colors cursor-pointer"
                title="Quitar nota"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
