import { FileText, Trophy, HelpCircle, BookOpen, Mail } from 'lucide-react';

export default function StatsCards({ stats, loading }) {
  const cards = [
    { icon: FileText, label: 'Provas', value: stats.totalProvas, color: 'blue' },
    { icon: Trophy, label: 'Concursos', value: stats.totalConcursos, color: 'amber' },
    { icon: HelpCircle, label: 'Questões', value: stats.totalQuestoes, color: 'emerald' },
    { icon: BookOpen, label: 'Conteúdos', value: stats.totalConteudos, color: 'purple' },
    { icon: Mail, label: 'Enviados', value: stats.totalEnviados, color: 'slate' },
  ];

  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    slate: 'bg-slate-50 text-slate-600'
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${colorMap[card.color]}`}>
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-800">
                {loading ? '...' : card.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}