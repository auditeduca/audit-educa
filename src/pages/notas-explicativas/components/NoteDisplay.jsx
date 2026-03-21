import React from 'react';

export default function NoteDisplay({ text }) {
  if (!text) return null;

  // Converte quebras de linha e marcação simples para HTML (opcional)
  const formatText = (txt) => {
    return txt
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('##')) {
          return <h2 key={i} className="text-xl font-serif font-bold text-audit-navy mt-6 mb-3">{line.replace(/^##\s*/, '')}</h2>;
        }
        if (line.startsWith('|')) {
          // simplificação: retorna linha como está
          return <p key={i} className="font-mono text-xs whitespace-pre-wrap border-b border-slate-200 py-1">{line}</p>;
        }
        if (line.trim() === '') {
          return <br key={i} />;
        }
        return <p key={i} className="text-sm text-slate-700 leading-relaxed">{line}</p>;
      });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm font-sans">
      <div className="prose prose-sm max-w-none">
        {formatText(text)}
      </div>
      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={() => navigator.clipboard.writeText(text)}
          className="text-xs font-bold text-audit-blue hover:text-audit-gold flex items-center gap-1"
        >
          <i className="fas fa-copy"></i> Copiar texto
        </button>
        <button
          onClick={() => window.print()}
          className="text-xs font-bold text-audit-blue hover:text-audit-gold flex items-center gap-1"
        >
          <i className="fas fa-print"></i> Imprimir
        </button>
      </div>
    </div>
  );
}