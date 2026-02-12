import { useState, useEffect, useCallback } from 'react';
import { getEstados, getMunicipios } from '../services/ibge';

export default function useIBGE() {
  const [estados, setEstados] = useState([]);
  const [municipiosCache, setMunicipiosCache] = useState({});
  const [loading, setLoading] = useState({ estados: false, municipios: false });

  useEffect(() => {
    const loadEstados = async () => {
      setLoading(prev => ({ ...prev, estados: true }));
      try {
        const data = await getEstados();
        const sorted = data.sort((a, b) => a.sigla.localeCompare(b.sigla));
        setEstados(sorted);
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
      } finally {
        setLoading(prev => ({ ...prev, estados: false }));
      }
    };
    loadEstados();
  }, []);

  const carregarMunicipios = useCallback(async (estadoId) => {
    if (!estadoId) return [];
    if (municipiosCache[estadoId]) return municipiosCache[estadoId];
    setLoading(prev => ({ ...prev, municipios: true }));
    try {
      const data = await getMunicipios(estadoId);
      setMunicipiosCache(prev => ({ ...prev, [estadoId]: data }));
      return data;
    } catch (error) {
      console.error('Erro ao carregar municípios:', error);
      return [];
    } finally {
      setLoading(prev => ({ ...prev, municipios: false }));
    }
  }, [municipiosCache]);

  const [municipios, setMunicipios] = useState([]);
  const [estadoId, setEstadoId] = useState(null);
  
  useEffect(() => {
    if (estadoId) {
      carregarMunicipios(estadoId).then(setMunicipios);
    } else {
      setMunicipios([]);
    }
  }, [estadoId, carregarMunicipios]);

  return { estados, municipios, loading: loading.estados || loading.municipios, carregarMunicipios, estadoId, setEstadoId };
