import { useState, useEffect, useRef, useCallback } from 'react';
import { buscarInstituicoes } from '../services/instituicaoApi';

export default function useInstituicaoSearch(delay = 500) {
  const [query, setQuery] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const timeoutRef = useRef();

  const buscar = useCallback(async (termo) => {
    if (termo.length < 3) {
      setSugestoes([]);
      return;
    }
    setLoading(true);
    try {
      const results = await buscarInstituicoes(termo);
      setSugestoes(results);
    } catch (error) {
      console.error('Erro na busca:', error);
      setSugestoes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (query.length >= 3) {
      timeoutRef.current = setTimeout(() => { buscar(query); }, delay);
    } else {
      setSugestoes([]);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [query, delay, buscar]);

  const selectInstituicao = useCallback((instituicao) => {
    setSelected(instituicao);
    setQuery('');
    setSugestoes([]);
  }, []);

  const reset = useCallback(() => {
    setQuery('');
    setSelected(null);
    setSugestoes([]);
  }, []);

  return { query, setQuery, sugestoes, loading, selected, selectInstituicao, reset };
