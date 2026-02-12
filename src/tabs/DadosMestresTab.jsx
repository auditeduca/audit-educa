import { Database, Tag, Building, Gavel, Briefcase, MapPin, Calendar, Clock, List } from 'lucide-react';

export default function DadosMestresTab() {
  const categories = [
    { icon: Tag, title: 'Categorias', count: 8 },
    { icon: Building, title: 'Instituições', count: 24 },
    { icon: Gavel, title: 'Bancas', count: 12 },
    { icon: Briefcase, title: 'Cargos', count: 15 },
    { icon: MapPin, title: 'Estados', count: 27 },
    { icon: Calendar, title: 'Anos', count: 5 },
    { icon: Clock, title: 'Tempos Limite', count: 4 },
    { icon: List, title: 'Estilos de Numeração', count: 3 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">Dados Mestres</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Database size={16} /> Novo Item
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-4 rounded-xl hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <cat.icon size={20} />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">{cat.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{cat.count} itens</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}