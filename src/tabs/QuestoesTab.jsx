import { useAdmin } from '../contexts/AdminContext';
import { HelpCircle, Edit, Trash2 } from 'lucide-react';

export default function QuestoesTab({ onNew }) {
  const { questoes, excluirQuestao } = useAdmin();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">Banco de Questões</h2>
        <button onClick={onNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <HelpCircle size={16} /> Nova Questão
        </button>
      </div>
      {questoes.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Nenhuma questão cadastrada.</p>
      ) : (
        <div className="space-y-3">
          {questoes.map((q) => (
            <div key={q.id} className="bg-white border border-slate-100 p-4 rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-slate-800 line-clamp-2">{q.pergunta}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>{q.topico}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      q.dificuldade === 'facil' ? 'bg-emerald-100 text-emerald-700' :
                      q.dificuldade === 'medio' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {q.dificuldade === 'facil' ? 'Fácil' : q.dificuldade === 'medio' ? 'Médio' : 'Difícil'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => excluirQuestao(q.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg">
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