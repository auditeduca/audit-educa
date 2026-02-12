import { HelpCircle, Save } from 'lucide-react';
import { useState } from 'react';
import Modal from '../../components/common/Modal';
import QuestaoForm from '../../components/forms/QuestaoForm';
import { useAdmin } from '../../contexts/AdminContext';

export default function QuestaoModal({ isOpen, onClose, initialData = null }) {
  const { adicionarQuestao, atualizarQuestao } = useAdmin();
  const [formData, setFormData] = useState(initialData || {
    dificuldade: 'medio',
    publica: false,
    alternativas: [
      { id: 'A', texto: '', correta: false },
      { id: 'B', texto: '', correta: false },
      { id: 'C', texto: '', correta: false },
      { id: 'D', texto: '', correta: false }
    ]
  });
  const isEditing = !!initialData;

  const handleSubmit = async () => {
    try {
      if (isEditing) await atualizarQuestao(initialData.id, formData);
      else await adicionarQuestao(formData);
      onClose();
    } catch (error) {
      alert('Erro ao salvar questão: ' + error.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Questão' : 'Nova Questão'}
      subtitle="Crie uma nova questão para seus estudos"
      icon={HelpCircle}
      size="3xl"
      footer={
        <>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
            <Save size={18} /> {isEditing ? 'Salvar Alterações' : 'Criar Questão'}
          </button>
        </>
      }
    >
      <QuestaoForm data={formData} onChange={setFormData} />
    </Modal>
  );
}