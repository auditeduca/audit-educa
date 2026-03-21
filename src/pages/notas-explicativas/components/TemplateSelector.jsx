import React from 'react';
import { TEMPLATES } from '../templates';

export default function TemplateSelector({ selectedTemplate, onSelect }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-audit-navy uppercase tracking-widest mb-3">Selecione o Tipo de Nota</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelect(tpl)}
            className={`p-5 rounded-2xl border-2 text-left transition-all ${
              selectedTemplate?.id === tpl.id
                ? 'border-audit-gold bg-audit-gold/10 shadow-lg'
                : 'border-slate-200 hover:border-audit-navy bg-white'
            }`}
          >
            <h4 className="font-bold text-audit-navy text-sm mb-1">{tpl.titulo}</h4>
            <p className="text-[10px] text-slate-500 mb-2">{tpl.norma}</p>
            <p className="text-xs text-slate-600 line-clamp-2">{tpl.descricao}</p>
          </button>
        ))}
      </div>
    </div>
  );
}