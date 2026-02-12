import { BookOpen, Save } from 'lucide-react';
import { useState } from 'react';
import Modal from '../../components/common/Modal';
import ConteudoForm from '../../components/forms/ConteudoForm';
import { useAdmin } from '../../contexts/AdminContext';

export default function ConteudoModal({ isOpen, onClose, initialData = null }) {
  const { adicionarConteudo, atualizarConteudo } = useAdmin();
  const [formData, setFormData] = useState(initialData || {
    tipo: 'conteudo',
    publica: false
  });
  const isEditing = !!initialData;

  // Adicionar funções ao contexto se necessário, por enquanto mock
  const adicionarConteudoMock = async (data) => {
    console.log('Adicionar conteúdo:', data);
    return { id: Date.now(), ...data };
  };
  const atualizarConteudoMock = async (id, data) => {
    console.log('Atualizar conteúdo:', id, data);
    return data;
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) await (atualizarConteudo || atualizarConteudoMock)(initialData.id, formData);
      else await (adicionarConteudo || adicionarConteudoMock)(formData);
      onClose();
    } catch (error) {
      alert('Erro ao salvar conteúdo: ' + error.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Conteúdo' : 'Novo Conteúdo'}
      subtitle="Crie um novo material de estudo"
      icon={BookOpen}
      size="3xl"
      footer={
        <>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all active:scale-95">
            <Save size={18} /> {isEditing ? 'Salvar Alterações' : 'Criar Conteúdo'}
          </button>
        </>
      }
    >
      <ConteudoForm data={formData} onChange={setFormData} />
    </Modal>
  );
}