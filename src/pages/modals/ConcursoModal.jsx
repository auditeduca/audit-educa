import { Trophy, Save } from 'lucide-react';
import { useState } from 'react';
import Modal from '../../components/common/Modal';
import ConcursoForm from '../../components/forms/ConcursoForm';
import { useAdmin } from '../../contexts/AdminContext';

export default function ConcursoModal({ isOpen, onClose, initialData = null }) {
  const { adicionarConcurso, atualizarConcurso } = useAdmin();
  const [formData, setFormData] = useState(initialData || {
    nacional: true,
    status: 'nao_iniciado',
    ano: new Date().getFullYear()
  });
  const isEditing = !!initialData;

  const handleSubmit = async () => {
    try {
      if (isEditing) await atualizarConcurso(initialData.id, formData);
      else await adicionarConcurso(formData);
      onClose();
    } catch (error) {
      alert('Erro ao salvar concurso: ' + error.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Concurso' : 'Novo Concurso'}
      subtitle="Cadastre as informações gerais do certame"
      icon={Trophy}
      footer={
        <>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
            <Save size={18} /> {isEditing ? 'Salvar Alterações' : 'Criar Concurso'}
          </button>
        </>
      }
    >
      <ConcursoForm data={formData} onChange={setFormData} />
    </Modal>
  );
}