import { useAdmin } from '../contexts/AdminContext';
import { FileText, Edit, Trash2, Eye } from 'lucide-react';

export default function ProvasTab({ onNew }) {
  const { provas, excluirProva } = useAdmin();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">Lista de Provas</h2>
        <button onClick={onNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
          <FileText size={16} /> Nova Prova
        </button>
      </div>
      {provas.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Nenhuma prova cadastrada.</p>
      ) : (
        <div className="space-y-3">
          {provas.map((p) => (
            <div key={p.id} className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between hover:shadow-sm transition-shadow">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{p.titulo}</span>
                  <span className="text-sm text-slate-500">{p.ano}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span>{p.instituicao || '—'}</span>
                  <span>•</span>
                  <span>{p.numQuestoes || 0} questões</span>
                  <span>•</span>
                  <span>{p.tempoLimite} min</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  p.status === 'publicado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {p.status || 'Rascunho'}
                </span>
                <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg">
                  <Edit size={16} />
                </button>
                <button onClick={() => excluirProva(p.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}