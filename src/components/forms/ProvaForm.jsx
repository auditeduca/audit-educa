import { Clock, List, Globe } from 'lucide-react';
import RadioCards from '../common/RadioCards';
import EstadoSelector from '../common/EstadoSelector';
import CidadeSelector from '../common/CidadeSelector';
import InstituicaoSearch from '../common/InstituicaoSearch';
import useIBGE from '../../hooks/useIBGE';
import useInstituicaoSearch from '../../hooks/useInstituicaoSearch';

export default function ProvaForm({ data, onChange }) {
  const { estados, municipios, loading: loadingIBGE, setEstadoId } = useIBGE();
  const instituicaoSearch = useInstituicaoSearch();

  const handleChange = (field, value) => onChange({ ...data, [field]: value });

  const handleEstadoSelect = (estado) => {
    setEstadoId(estado.id);
    handleChange('estadoId', estado.id);
    handleChange('estadoSigla', estado.sigla);
    handleChange('cidade', '');
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">Informações Básicas</h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Título da Prova *</label>
          <input type="text" value={data.titulo || ''} onChange={(e) => handleChange('titulo', e.target.value)}
            placeholder="Ex: Concurso Nacional Unificado - Bloco 8"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
          <textarea value={data.descricao || ''} onChange={(e) => handleChange('descricao', e.target.value)}
            rows={3} placeholder="Informações adicionais sobre a prova..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none resize-none" />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">Tipo e Classificação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Prova</label>
            <RadioCards options={[
              { label: 'Objetiva', value: 'objetiva' },
              { label: 'Discursiva', value: 'discursiva' },
              { label: 'Prática', value: 'pratica' },
              { label: 'Mista', value: 'mista' }
            ]} value={data.tipoProva || 'objetiva'} onChange={(val) => handleChange('tipoProva', val)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Formato</label>
            <RadioCards options={[
              { label: 'Concurso', value: 'concurso' },
              { label: 'Vestibular', value: 'vestibular' },
              { label: 'Certificação', value: 'certificacao' }
            ]} value={data.formato || 'concurso'} onChange={(val) => handleChange('formato', val)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Instituição/Órgão</label>
            <InstituicaoSearch value={data.instituicao} onChange={(val) => handleChange('instituicao', val)}
              onSelect={(inst) => { handleChange('instituicao', inst); instituicaoSearch.selectInstituicao(inst); }} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Banca Examinadora</label>
            <input type="text" value={data.banca || ''} onChange={(e) => handleChange('banca', e.target.value)}
              placeholder="Ex: Cebraspe, FGV, Vunesp..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ano *</label>
            <input type="number" value={data.ano || new Date().getFullYear()} onChange={(e) => handleChange('ano', e.target.value)}
              min="2000" max="2100" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <List size={16} /> Nº de Questões
            </label>
            <input type="number" value={data.numQuestoes || 10} onChange={(e) => handleChange('numQuestoes', e.target.value)}
              min="1" max="200" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <Clock size={16} /> Tempo (min)
            </label>
            <input type="number" value={data.tempoLimite || 240} onChange={(e) => handleChange('tempoLimite', e.target.value)}
              min="1" step="1" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
          <Globe size={16} /> Localização
        </h3>
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div>
            <p className="font-medium text-slate-800">Abrangência Nacional</p>
            <p className="text-sm text-slate-500">Desmarque para especificar um estado específico</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={data.nacional !== false} onChange={(e) => handleChange('nacional', e.target.checked)} className="sr-only peer" />
            <div className="w-14 h-7 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        {!data.nacional && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
            <EstadoSelector estados={estados} selectedId={data.estadoId} onSelect={handleEstadoSelect} loading={loadingIBGE} />
            <CidadeSelector municipios={municipios} selectedCity={data.cidade} onSelect={(cidade) => handleChange('cidade', cidade)}
              disabled={!data.estadoId} loading={loadingIBGE} />
          </div>
        )}
      </section>
    </div>
  );
