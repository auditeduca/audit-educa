import { MapPin } from 'lucide-react';

export default function EstadoSelector({ estados = [], selectedId, onSelect, loading = false }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
        Carregando estados...
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">Estado (UF)</label>
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
        {estados.map((estado) => (
          <button
            key={estado.id}
            type="button"
            onClick={() => onSelect(estado)}
            className={`h-11 rounded-lg text-sm font-medium transition-all ${
              selectedId === estado.id 
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
            title={estado.nome}
          >
            {estado.sigla}
          </button>
        ))}
      </div>
    </div>
  );
}