import React from 'react';
import { ChevronRight } from 'lucide-react';

const colorMap = {
  indigo: "border-indigo-600 text-indigo-600",
  purple: "border-purple-600 text-purple-600",
  green: "border-emerald-600 text-emerald-600",
  gold: "border-amber-500 text-amber-500",
  navy: "border-audit-navy text-audit-navy"
};

export default function SectionHeader({ 
  icon: Icon, 
  title, 
  badge, 
  color = "indigo",
  showHelp = true,
  onHelp
}) {
  return (
    <div className={`flex items-center justify-between border-b-2 mb-8 pb-4 ${colorMap[color] || colorMap.indigo}`}>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Icon className="w-4 h-4" /> {badge}
        </span>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>
      {showHelp && (
        <button 
          onClick={onHelp}
          className="text-xs font-bold text-slate-400 cursor-pointer hover:text-indigo-600 flex items-center gap-1"
        >
          Ajuda <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}