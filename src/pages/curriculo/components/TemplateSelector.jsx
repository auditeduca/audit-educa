import React from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import { Palette } from 'lucide-react';

const TEMPLATES = [
  { id: 'modern', name: 'Moderno Auditor', color: '#1D4ED8', font: 'sans', desc: 'Layout limpo e dinâmico' },
  { id: 'tech', name: 'Digital & IA', color: '#7C3AED', font: 'sans', desc: 'Destaque para competências digitais' },
  { id: 'classic', name: 'Executivo Formal', color: '#0F172A', font: 'serif', desc: 'Sóbrio e tradicional' }
];

export default function TemplateSelector({ selectedTemplate, onSelect }) {
  return (
    <div className="animate-in fade-in duration-500">
      <SectionHeader icon={Palette} title="Escolha o seu Estilo" badge="Estilo" color="gold" showHelp={false} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className={`p-6 rounded-2xl text-left border-2 transition-all group ${selectedTemplate?.id === t.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <h4 className="font-bold text-slate-900 mb-1">{t.name}</h4>
            <p className="text-xs text-slate-500 mb-4">{t.desc}</p>
            <div className="h-1.5 w-12 rounded-full" style={{ backgroundColor: t.color }} />
          </button>
        ))}
      </div>
    </div>
  );
}