import { useState, useEffect, useRef } from 'react';
import { Search, Building } from 'lucide-react';
import { buscarInstituicoes } from '../../services/instituicaoApi';

export default function InstituicaoSearch({ value, onChange, onSelect }) {
  const [query, setQuery] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    if (query.length < 3) {
      setSugestoes([]);
      return;
    }
    setLoading(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      const results = await buscarInstituicoes(query);
      setSugestoes(results);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  const handleSelect = (inst) => {
    onSelect(inst);
    setQuery('');
    setSugestoes([]);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        value={value || query}
        onChange={(e) => { onChange(''); setQuery(e.target.value); }}
        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
        placeholder="Buscar instituição..."
      />
      {loading && <div className="absolute right-3 top-3 animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />}
      {sugestoes.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-xl shadow-lg p-2">
          {sugestoes.map((inst, i) => (
            <button key={i} onClick={() => handleSelect(inst)} className="flex w-full items-center gap-2 p-2 hover:bg-blue-50 rounded-lg">
              <Building size={16} className="text-slate-400" /> {inst}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}