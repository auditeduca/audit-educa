import { HelpCircle, BookOpen, MessageSquare, Tag, Globe, Lock } from 'lucide-react';
import { useState } from 'react';
import useTags from '../../hooks/useTags';
import ChipInput from '../common/ChipInput';

export default function QuestaoForm({ data, onChange }) {
  const [alternativas, setAlternativas] = useState(data.alternativas || [
    { id: 'A', texto: '', correta: false },
    { id: 'B', texto: '', correta: false },
    { id: 'C', texto: '', correta: false },
    { id: 'D', texto: '', correta: false }
  ]);

  const tagManager = useTags(data.tags || []);

  const handlePerguntaChange = (e) => onChange({ ...data, pergunta: e.target.value });
  const handleTopicoChange = (e) => onChange({ ...data, topico: e.target.value });
  const handleExplicacaoChange = (e) => onChange({ ...data, explicacao: e.target.value });
  const handlePublicaChange = (e) => onChange({ ...data, publica: e.target.checked });

  const handleDificuldadeChange = (dificuldade) => onChange({ ...data, dificuldade });

  const handleAlternativaTextoChange = (id, texto) => {
    const novas = alternativas.map(alt => alt.id === id ? { ...alt, texto } : alt);
    setAlternativas(novas);
    onChange({ ...data, alternativas: novas });
  };

  const handleAlternativaCorreta = (id) => {
    const novas = alternativas.map(alt => ({ ...alt, correta: alt.id === id }));
    setAlternativas(novas);
    onChange({ ...data, alternativas: novas });
  };

  const handleAddAlternativa = () => {
    if (alternativas.length >= 6) return;
    const novaId = String.fromCharCode(65 + alternativas.length);
    const novas = [...alternativas, { id: novaId, texto: '', correta: false }];
    setAlternativas(novas);
    onChange({ ...data, alternativas: novas });
  };

  const handleRemoveAlternativa = (id) => {
    if (alternativas.length <= 2) return;
    const novas = alternativas.filter(alt => alt.id !== id);
    // Se removeu a correta, marca a primeira como correta
    if (!novas.some(a => a.correta) && novas.length > 0) novas[0].correta = true;
    setAlternativas(novas);
    onChange({ ...data, alternativas: novas });
  };

  // Sincroniza tags
  const handleTagsChange = (tags) => onChange({ ...data, tags });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">Pergunta</h3>
        <textarea
          value={data.pergunta || ''}
          onChange={handlePerguntaChange}
          rows={4}
          placeholder="Digite o enunciado da questão..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <BookOpen size={16} /> Tópico / Matéria *
            </label>
            <input
              type="text"
              value={data.topico || ''}
              onChange={handleTopicoChange}
              placeholder="Ex: Direito Constitucional"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dificuldade</label>
            <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100 w-fit">
              {['facil', 'medio', 'dificil'].map((nivel) => {
                const isActive = (data.dificuldade || 'medio') === nivel;
                const colors = {
                  facil: 'text-emerald-700 bg-emerald-100',
                  medio: 'text-amber-700 bg-amber-100',
                  dificil: 'text-rose-700 bg-rose-100'
                };
                return (
                  <button
                    key={nivel}
                    type="button"
                    onClick={() => handleDificuldadeChange(nivel)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? colors[nivel] + ' shadow-sm ring-1 ring-inset ring-black/5' : 'text-slate-500 hover:bg-white'
                    }`}
                  >
                    {nivel === 'facil' ? 'Fácil' : nivel === 'medio' ? 'Médio' : 'Difícil'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Alternativas *</h3>
          {alternativas.length < 6 && (
            <button
              type="button"
              onClick={handleAddAlternativa}
              className="text-sm text-indigo-600 font-medium hover:text-indigo-800"
            >
              + Adicionar alternativa
            </button>
          )}
        </div>
        <div className="space-y-3">
          {alternativas.map((alt, idx) => {
            const letra = alt.id;
            const isCorreta = alt.correta;
            return (
              <div key={alt.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                isCorreta ? 'border-emerald-400 bg-emerald-50/30 ring-1 ring-emerald-400/20' : 'border-slate-200 bg-white'
              }`}>
                <button
                  type="button"
                  onClick={() => handleAlternativaCorreta(alt.id)}
                  className={`mt-2 flex-shrink-0 transition-colors ${
                    isCorreta ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-400'
                  }`}
                  title="Marcar como correta"
                >
                  <span className={`block w-5 h-5 rounded-full border-2 ${
                    isCorreta ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                  }`} />
                </button>
                <span className="mt-2 text-sm font-bold text-slate-400 w-5">{letra})</span>
                <textarea
                  value={alt.texto}
                  onChange={(e) => handleAlternativaTextoChange(alt.id, e.target.value)}
                  placeholder={`Digite a alternativa ${letra}...`}
                  rows={2}
                  className={`flex-1 bg-transparent outline-none resize-none py-1.5 text-slate-700 ${
                    isCorreta ? 'placeholder-emerald-300' : 'placeholder-slate-400'
                  }`}
                  required
                />
                {alternativas.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAlternativa(alt.id)}
                    className="mt-1 p-2 text-slate-400 hover:text-red-500 rounded-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
          <MessageSquare size={16} className="text-slate-400" /> Explicação
          <span className="text-xs font-normal text-slate-400">(opcional)</span>
        </label>
        <textarea
          value={data.explicacao || ''}
          onChange={handleExplicacaoChange}
          rows={3}
          placeholder="Por que essa é a resposta correta? Ajude a entender o raciocínio..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Tag size={16} /> Tags
          </h3>
          <ChipInput
            tags={tagManager.tags}
            inputValue={tagManager.inputValue}
            onInputChange={tagManager.setInputValue}
            onAddTag={(tag) => { tagManager.addTag(tag); handleTagsChange([...tagManager.tags, tag]); }}
            onRemoveTag={(tag) => { tagManager.removeTag(tag); handleTagsChange(tagManager.tags.filter(t => t !== tag)); }}
            onKeyDown={tagManager.handleKeyDown}
            placeholder="Digite uma tag e pressione Enter"
          />
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${data.publica ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
              {data.publica ? <Globe size={20} /> : <Lock size={20} />}
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800">Tornar Pública</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {data.publica ? 'Outros usuários poderão ver esta questão.' : 'Apenas você tem acesso.'}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={data.publica || false} onChange={handlePublicaChange} className="sr-only peer" />
            <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
          </label>
        </div>
      </section>
    </div>
  );
