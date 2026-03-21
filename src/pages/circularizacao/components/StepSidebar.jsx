// src/pages/circularizacao/components/StepSidebar.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';

const futureSteps = [
  { num: 3, label: 'Textos' },
  { num: 4, label: 'Produtos' },
  { num: 5, label: 'Dados' },
  { num: 6, label: 'Design' },
  { num: 7, label: 'Destinatários' },
  { num: 8, label: 'Exportar' },
];

export default function StepSidebar({ show, onToggle, currentStep }) {
  if (!show) {
    return (
      <button
        onClick={onToggle}
        className="fixed left-4 top-24 z-20 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        title="Mostrar etapas"
      >
        <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
      </button>
    );
  }

  return (
    <div className="w-64 shrink-0 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative h-fit sticky top-24">
      <button
        onClick={onToggle}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        <List size={16} /> Próximas etapas
      </h3>
      <div className="space-y-2">
        {futureSteps.map(step => (
          <div
            key={step.num}
            className={`p-3 rounded-xl text-sm transition-all ${
              step.num === currentStep
                ? 'bg-audit-gold/10 border border-audit-gold text-audit-navy dark:text-audit-gold font-semibold'
                : step.num < currentStep
                ? 'text-green-600 dark:text-green-400 line-through opacity-70'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <span className="font-mono mr-2">{step.num}</span> {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}