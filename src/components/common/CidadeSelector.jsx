import { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';

export default function CidadeSelector({
  municipios = [],
  selectedCity,
  onSelect,
  disabled = false,
  loading = false
}) {
  const [query, setQuery] = useState('');
  const [sugestoes, setSugestoes] = useState([]);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = municipios
        .filter(m => m.nome.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8);
      setSugestoes(filtered);
    } else {
      setSugestoes([]);
    }
  }, [query, municipios]);

  const handleSelect = (cidade) => {
    onSelect(cidade.nome);
    setQuery('');
    setSugestoes([]);
  };

  const handleClear = () => {
    onSelect('');
    setQuery('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">Cidade (Município)</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          disabled={disabled}
          value={selectedCity || query}
          onChange={(e) => {
            if (selectedCity) onSelect('');
            setQuery(e.target.value);
          }}
          placeholder={disabled ? "Selecione um estado primeiro" : "Digite para buscar a cidade..."}
          className={`w-full pl-10 pr-10 py-3 rounded-xl border focus:ring-2 focus:ring-blue-600 outline-none transition-all ${disabled ? 'bg-slate-50 text-slate-500' : 'bg-white'}`}
        />
        {selectedCity && (
          <button onClick={handleClear} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        )}
        {loading && !selectedCity && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        )}
      </div>
      {!selectedCity && sugestoes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {sugestoes.map((municipio) => (
            <button
              key={municipio.id}
              type="button"
              onClick={() => handleSelect(municipio)}
              className="bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 py-1.5 px-3 rounded-full text-sm transition-colors shadow-sm flex items-center gap-1"
            >
              <MapPin size={14} className="text-slate-400" />
              {municipio.nome}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}