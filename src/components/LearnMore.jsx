import React from 'react';
import { Link } from 'react-router-dom';

export default function LearnMore() {
  return (
    <div>
      <h3 className="text-sm font-bold text-audit-navy mb-6 flex items-center gap-2 uppercase tracking-wider">
        <i className="fas fa-bookmark text-audit-gold"></i> Saiba Mais
      </h3>
      <div className="space-y-4">
        <Link to="/biblioteca" className="card-link-item flex items-center gap-4 p-5 rounded-2xl bg-slate-50">
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-audit-blue shadow-sm">
            <i className="fas fa-book text-lg"></i>
          </div>
          <div>
            <span className="text-sm font-bold text-audit-navy block mb-1">Biblioteca</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acervo Técnico</span>
          </div>
          <i className="fas fa-chevron-right ml-auto text-slate-300"></i>
        </Link>
        <Link to="/simulados" className="card-link-item flex items-center gap-4 p-5 rounded-2xl bg-slate-50">
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-audit-blue shadow-sm">
            <i className="fas fa-check-square text-lg"></i>
          </div>
          <div>
            <span className="text-sm font-bold text-audit-navy block mb-1">Simulados</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qualificação Técnica</span>
          </div>
          <i className="fas fa-chevron-right ml-auto text-slate-300"></i>
        </Link>
      </div>
    </div>
  );
}