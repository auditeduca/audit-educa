import React from 'react';

const SeriesHistorica = ({ fromCurrency, toCurrency, fetchHistorical }) => {
  return (
    <div className="series-historica p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <h3 className="text-[10px] font-bold text-audit-navy uppercase tracking-widest mb-4 flex items-center gap-2">
        <i className="fas fa-chart-line text-audit-gold"></i> Série Histórica
      </h3>
      <p className="text-sm text-slate-600">
        Dados históricos: <strong>{fromCurrency}</strong> → <strong>{toCurrency}</strong>
      </p>
      <p className="text-xs text-slate-400 mt-2">
        <em>(Implemente com chamada a API e exibição em tabela/gráfico)</em>
      </p>
    </div>
  );
};

export default SeriesHistorica;