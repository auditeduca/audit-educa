import { useAdmin } from '../contexts/AdminContext';
import { BookOpen, Edit, Trash2 } from 'lucide-react';

export default function ConteudosTab({ onNew }) {
  const { conteudos } = useAdmin();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">Conteúdos de Estudo</h2>
        <button onClick={onNew} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center gap-2">
          <BookOpen size={16} /> Novo Conteúdo
        </button>
      </div>
      {conteudos.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Nenhum conteúdo cadastrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conteudos.map((c) => (
            <div key={c.id} className="bg-white border border-slate-100 p-4 rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-slate-800">{c.titulo}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.descricao}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">
                      {c.categoria}
                    </span>
                    <span className="text-xs text-slate-400">
                      {c.tipo}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}