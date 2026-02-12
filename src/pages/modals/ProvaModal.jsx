import { FileText, Save } from 'lucide-react';
import { useState } from 'react';
import Modal from '../../components/common/Modal';
import ProvaForm from '../../components/forms/ProvaForm';
import { useAdmin } from '../../contexts/AdminContext';

export default function ProvaModal({ isOpen, onClose, initialData = null }) {
  const { adicionarProva, atualizarProva } = useAdmin();
  const [formData, setFormData] = useState(initialData || {
    nacional: true,
    tipoProva: 'objetiva',
    formato: 'concurso',
    numQuestoes: 10,
    tempoLimite: 240,
    ano: new Date().getFullYear()
  });
  const isEditing = !!initialData;

  const handleSubmit = async () => {
    try {
      if (isEditing) await atualizarProva(initialData.id, formData);
      else await adicionarProva(formData);
      onClose();
    } catch (error) {
      alert('Erro ao salvar prova: ' + error.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Prova' : 'Nova Prova'}
      subtitle="Preencha os dados estruturais do exame"
      icon={FileText}
      footer={
        <>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
            <Save size={18} /> {isEditing ? 'Salvar Alterações' : 'Criar Prova'}
          </button>
        </>
      }
    >
      <ProvaForm data={formData} onChange={setFormData} />
    </Modal>
  );
}