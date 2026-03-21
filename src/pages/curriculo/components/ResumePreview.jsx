import React from 'react';
import { Layout } from 'lucide-react';

export default function ResumePreview({ template, color, formData }) {
  return (
    <div className="sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Layout className="w-4 h-4" /> Pré-visualização
        </h3>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">Formato A4</span>
      </div>
      <div 
        className="bg-white shadow-2xl rounded-sm w-full aspect-[1/1.41] p-8 overflow-hidden origin-top scale-95"
        style={{ 
          fontFamily: template.font === 'serif' ? 'Georgia, serif' : 'Inter, sans-serif',
          borderTop: `6px solid ${color}`
        }}
      >
        <div className="mb-6">
          <div className="h-6 w-3/4 mb-2" style={{ backgroundColor: `${color}10` }}>
            <div className="h-full bg-slate-900 opacity-80" style={{ width: formData.personal?.full_name ? '100%' : '60%' }} />
          </div>
          <div className="h-3 w-1/2 bg-slate-100" />
        </div>
        
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-2 w-24 rounded" style={{ backgroundColor: `${color}30` }} />
              <div className="h-1.5 w-full bg-slate-50 rounded" />
              <div className="h-1.5 w-5/6 bg-slate-50 rounded" />
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-slate-100 pt-4 opacity-30 italic text-[8px] text-slate-400">
          Gerado por Audit Educa — Plataforma Técnica de Auditoria
        </div>
      </div>
    </div>
  );
}