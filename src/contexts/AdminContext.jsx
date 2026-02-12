import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';

const AdminContext = createContext({});

export function AdminProvider({ children }) {
  const [provas, setProvas] = useState([]);
  const [concursos, setConcursos] = useState([]);
  const [questoes, setQuestoes] = useState([]);
  const [conteudos, setConteudos] = useState([]);
  const [dadosMestres, setDadosMestres] = useState({});
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProvas: 0, totalConcursos: 0, totalQuestoes: 0, totalConteudos: 0, totalEnviados: 0
  });

  useEffect(() => { carregarTodosDados(); }, []);

  const carregarTodosDados = async () => {
    setLoading(true);
    try {
      const [p, c, q, ct] = await Promise.all([
        api.get('/provas'), api.get('/concursos'), api.get('/questoes'), api.get('/conteudos')
      ]);
      setProvas(p); setConcursos(c); setQuestoes(q); setConteudos(ct);
      setStats({ totalProvas: p.length, totalConcursos: c.length, totalQuestoes: q.length, totalConteudos: ct.length, totalEnviados: 0 });
    } catch (error) { console.error('Erro ao carregar dados:', error); } finally { setLoading(false); }
  };

  const adicionarProva = useCallback(async (prova) => {
    const nova = await api.post('/provas', prova);
    setProvas(prev => [...prev, nova]);
    setStats(s => ({ ...s, totalProvas: s.totalProvas + 1 }));
    return nova;
  }, []);
  const atualizarProva = useCallback(async (id, prova) => {
    const atualizada = await api.put(`/provas/${id}`, prova);
    setProvas(prev => prev.map(p => p.id === id ? atualizada : p));
    return atualizada;
  }, []);
  const excluirProva = useCallback(async (id) => {
    await api.delete(`/provas/${id}`);
    setProvas(prev => prev.filter(p => p.id !== id));
    setStats(s => ({ ...s, totalProvas: s.totalProvas - 1 }));
  }, []);

  const adicionarConcurso = useCallback(async (concurso) => {
    const novo = await api.post('/concursos', concurso);
    setConcursos(prev => [...prev, novo]);
    setStats(s => ({ ...s, totalConcursos: s.totalConcursos + 1 }));
    return novo;
  }, []);
  const atualizarConcurso = useCallback(async (id, concurso) => {
    const atualizado = await api.put(`/concursos/${id}`, concurso);
    setConcursos(prev => prev.map(c => c.id === id ? atualizado : c));
    return atualizado;
  }, []);
  const excluirConcurso = useCallback(async (id) => {
    await api.delete(`/concursos/${id}`);
    setConcursos(prev => prev.filter(c => c.id !== id));
    setStats(s => ({ ...s, totalConcursos: s.totalConcursos - 1 }));
  }, []);

  const adicionarQuestao = useCallback(async (questao) => {
    const nova = await api.post('/questoes', questao);
    setQuestoes(prev => [...prev, nova]);
    setStats(s => ({ ...s, totalQuestoes: s.totalQuestoes + 1 }));
    return nova;
  }, []);
  const atualizarQuestao = useCallback(async (id, questao) => {
    const atualizada = await api.put(`/questoes/${id}`, questao);
    setQuestoes(prev => prev.map(q => q.id === id ? atualizada : q));
    return atualizada;
  }, []);
  const excluirQuestao = useCallback(async (id) => {
    await api.delete(`/questoes/${id}`);
    setQuestoes(prev => prev.filter(q => q.id !== id));
    setStats(s => ({ ...s, totalQuestoes: s.totalQuestoes - 1 }));
  }, []);

  const vincularQuestaoProva = useCallback(async (provaId, questaoId, ordem) => {
    await api.post('/provas-questoes', { provaId, questaoId, ordem });
  }, []);

  const value = {
    provas, concursos, questoes, conteudos, dadosMestres, stats, loading,
    adicionarProva, atualizarProva, excluirProva,
    adicionarConcurso, atualizarConcurso, excluirConcurso,
    adicionarQuestao, atualizarQuestao, excluirQuestao,
    vincularQuestaoProva, carregarTodosDados
  };
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin deve ser usado dentro de AdminProvider');
  return context;
}