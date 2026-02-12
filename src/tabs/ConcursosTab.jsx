import { useAdmin } from '../contexts/AdminContext';
import { Trophy, Edit, Trash2 } from 'lucide-react';

export default function ConcursosTab({ onNew }) {
  const { concursos, excluirConcurso } = useAdmin();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">Lista de Concursos</h2>
        <button onClick={onNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Trophy size={16} /> Novo Concurso
        </button>
      </div>
      {concursos.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Nenhum concurso cadastrado.</p>
      ) : (
        <div className="space-y-3">
          {concursos.map((c) => (
            <div key={c.id} className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between hover:shadow-sm transition-shadow">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{c.nome}</span>
                  <span className="text-sm text-slate-500">{c.ano}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span>{c.instituicao || '—'}</span>
                  <span>•</span>
                  <span>{c.vagas ? c.vagas + ' vagas' : 'CR'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  c.status === 'aberto' ? 'bg-emerald-100 text-emerald-700' :
                  c.status === 'em_andamento' ? 'bg-blue-100 text-blue-700' :
                  c.status === 'finalizado' ? 'bg-slate-100 text-slate-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {c.status === 'nao_iniciado' ? 'Não iniciado' :
                   c.status === 'aberto' ? 'Aberto' :
                   c.status === 'em_andamento' ? 'Em andamento' :
                   c.status === 'finalizado' ? 'Finalizado' : 'Rascunho'}
                </span>
                <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg">
                  <Edit size={16} />
                </button>
                <button onClick={() => excluirConcurso(c.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg">
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