import { Calendar, Building, Briefcase, DollarSign, Globe, Link as LinkIcon } from 'lucide-react';
import RadioCards from '../common/RadioCards';
import EstadoSelector from '../common/EstadoSelector';
import CidadeSelector from '../common/CidadeSelector';
import InstituicaoSearch from '../common/InstituicaoSearch';
import useIBGE from '../../hooks/useIBGE';
import useInstituicaoSearch from '../../hooks/useInstituicaoSearch';

export default function ConcursoForm({ data, onChange }) {
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
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">Identificação</h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Concurso *</label>
          <input type="text" value={data.nome || ''} onChange={(e) => handleChange('nome', e.target.value)}
            placeholder="Ex: Concurso Nacional Unificado - Bloco 8"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Instituição/Órgão *</label>
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
              <Briefcase size={16} /> Vagas
            </label>
            <input type="number" value={data.vagas || ''} onChange={(e) => handleChange('vagas', e.target.value)}
              placeholder="Ex: 50 (deixe em branco para CR)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <DollarSign size={16} /> Salário
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">R$</span>
              <input type="number" step="0.01" value={data.salario || ''} onChange={(e) => handleChange('salario', e.target.value)}
                placeholder="0,00"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
          <Calendar size={16} /> Datas e Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Início das Inscrições</label>
            <input type="date" value={data.inicioInscricoes || ''} onChange={(e) => handleChange('inicioInscricoes', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fim das Inscrições</label>
            <input type="date" value={data.fimInscricoes || ''} onChange={(e) => handleChange('fimInscricoes', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data da Prova</label>
            <input type="date" value={data.dataProva || ''} onChange={(e) => handleChange('dataProva', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Status do Concurso</label>
          <RadioCards columns={4} options={[
            { label: 'Não Iniciado', value: 'nao_iniciado' },
            { label: 'Aberto', value: 'aberto' },
            { label: 'Em Andamento', value: 'em_andamento' },
            { label: 'Finalizado', value: 'finalizado' }
          ]} value={data.status || 'nao_iniciado'} onChange={(val) => handleChange('status', val)} />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
          <Globe size={16} /> Localização
        </h3>
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div>
            <p className="font-medium text-slate-800">Abrangência Nacional?</p>
            <p className="text-sm text-slate-500">Desative para especificar um estado específico</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={data.nacional !== false} onChange={(e) => handleChange('nacional', e.target.checked)} className="sr-only peer" />
            <div className="w-14 h-7 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
        {!data.nacional && (
          <div className="space-y-6">
            <EstadoSelector estados={estados} selectedId={data.estadoId} onSelect={handleEstadoSelect} loading={loadingIBGE} />
            <CidadeSelector municipios={municipios} selectedCity={data.cidade} onSelect={(cidade) => handleChange('cidade', cidade)}
              disabled={!data.estadoId} loading={loadingIBGE} />
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
          <LinkIcon size={16} /> Links
        </h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Site Oficial</label>
          <input type="url" value={data.siteOficial || ''} onChange={(e) => handleChange('siteOficial', e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL do Edital</label>
            <input type="url" value={data.urlEdital || ''} onChange={(e) => handleChange('urlEdital', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Conteúdo Programático</label>
            <input type="url" value={data.urlConteudo || ''} onChange={(e) => handleChange('urlConteudo', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
        </div>
      </section>
    </div>
  );
