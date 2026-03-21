import React from 'react';

export default function Preview({ text }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[400px] overflow-auto">
      <h3 className="text-xs font-bold text-audit-navy uppercase tracking-widest mb-4">Pré-visualização</h3>
      <div className="whitespace-pre-wrap font-mono text-xs text-slate-700 border-t pt-4">
        {text || 'Selecione um template e preencha os dados para visualizar a nota.'}
      </div>
    </div>
  );
}