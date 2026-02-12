import { FileText, Trophy, HelpCircle, BookOpen, Database, X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose, activeTab, onTabChange }) {
  const tabs = [
    { id: 'provas', label: 'Provas', icon: FileText },
    { id: 'concursos', label: 'Concursos', icon: Trophy },
    { id: 'questoes', label: 'Questões', icon: HelpCircle },
    { id: 'conteudos', label: 'Conteúdos', icon: BookOpen },
    { id: 'mestres', label: 'Dados Mestres', icon: Database },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Menu</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 lg:hidden">
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { onTabChange(tab.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}