import { useState } from 'react';

export default function useFormProva(initialData = null) {
  const [formData, setFormData] = useState(initialData || {
    titulo: '',
    descricao: '',
    tipoProva: 'objetiva',
    formato: 'concurso',
    instituicao: '',
    banca: '',
    ano: new Date().getFullYear(),
    numQuestoes: 10,
    tempoLimite: 240,
    nacional: true,
    estadoId: null,
    estadoSigla: '',
    cidade: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setFormData({
      titulo: '',
      descricao: '',
      tipoProva: 'objetiva',
      formato: 'concurso',
      instituicao: '',
      banca: '',
      ano: new Date().getFullYear(),
      numQuestoes: 10,
      tempoLimite: 240,
      nacional: true,
      estadoId: null,
      estadoSigla: '',
      cidade: ''
    });
  };

  return { formData, setFormData, handleChange, reset };
