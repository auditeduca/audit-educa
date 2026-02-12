import { BookOpen, FileText, Image, Link as LinkIcon, Tag } from 'lucide-react';
import { useState } from 'react';
import RadioCards from '../common/RadioCards';
import ChipInput from '../common/ChipInput';
import useTags from '../../hooks/useTags';

export default function ConteudoForm({ data, onChange }) {
  const [tipo, setTipo] = useState(data.tipo || 'conteudo');
  const tagManager = useTags(data.tags || []);

  const handleChange = (field, value) => onChange({ ...data, [field]: value });

  const handleTipoChange = (val) => {
    setTipo(val);
    handleChange('tipo', val);
  };

  const handleTagsChange = (tags) => handleChange('tags', tags);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">Informações Básicas</h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Título do Conteúdo *</label>
          <input
            type="text"
            value={data.titulo || ''}
            onChange={(e) => handleChange('titulo', e.target.value)}
            placeholder="Ex: Mapa Mental - Sistema Cardiovascular"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
          <textarea
            value={data.descricao || ''}
            onChange={(e) => handleChange('descricao', e.target.value)}
            rows={3}
            placeholder="Breve descrição do conteúdo..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600 outline-none resize-none"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">Tipo e Categoria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Conteúdo</label>
            <RadioCards columns={2} options={[
              { label: 'Conteúdo', value: 'conteudo', icon: <FileText size={16} /> },
              { label: 'Quiz', value: 'quiz', icon: <BookOpen size={16} /> },
              { label: 'Biblioteca', value: 'biblioteca', icon: <Image size={16} /> }
            ]} value={tipo} onChange={handleTipoChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Categoria</label>
            <select
              value={data.categoria || ''}
              onChange={(e) => handleChange('categoria', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600 outline-none bg-white"
            >
              <option value="">Selecione...</option>
              <option value="anatomia">Anatomia</option>
              <option value="farmacologia">Farmacologia</option>
              <option value="semiologia">Semiologia</option>
              <option value="urgencia">Urgência e Emergência</option>
              <option value="saude_publica">Saúde Pública</option>
              <option value="clinica">Clínica</option>
              <option value="cirurgica">Cirúrgica</option>
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
          <LinkIcon size={16} /> Conteúdo e Mídia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL do Conteúdo</label>
            <input
              type="url"
              value={data.url || ''}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail (capa)</label>
            <input
              type="url"
              value={data.thumbnail || ''}
              onChange={(e) => handleChange('thumbnail', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>
        </div>
        {tipo === 'conteudo' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Conteúdo (texto/markdown)</label>
            <textarea
              value={data.conteudo || ''}
              onChange={(e) => handleChange('conteudo', e.target.value)}
              rows={8}
              placeholder="Digite o conteúdo aqui... (suporte a markdown)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600 outline-none resize-none font-mono text-sm"
            />
          </div>
        )}
        {tipo === 'quiz' && (
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <p className="text-sm text-amber-700">
              Para criar um quiz, utilize o formulário específico de Questões e vincule a esta prova.
            </p>
          </div>
        )}
      </section>

      <section>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
          <Tag size={16} /> Classificação por Tags
        </h3>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
          <ChipInput
            tags={tagManager.tags}
            inputValue={tagManager.inputValue}
            onInputChange={tagManager.setInputValue}
            onAddTag={(tag) => { tagManager.addTag(tag); handleTagsChange([...tagManager.tags, tag]); }}
            onRemoveTag={(tag) => { tagManager.removeTag(tag); handleTagsChange(tagManager.tags.filter(t => t !== tag)); }}
            onKeyDown={tagManager.handleKeyDown}
            placeholder="Digite uma tag e pressione Enter"
            label="Tags"
          />
        </div>
      </section>
    </div>
  );
