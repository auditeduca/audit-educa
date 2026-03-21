import React from 'react';

const SeletorMoedas = ({ currencies, fromCurrency, toCurrency, onFromChange, onToChange }) => {
  if (!currencies || Object.keys(currencies).length === 0) {
    return <div>Carregando moedas...</div>;
  }

  return (
    <div className="seletor-moedas grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <label htmlFor="fromCurrency" className="block text-xs font-bold text-audit-navy uppercase tracking-widest mb-3 flex items-center gap-2">
          Moeda de Origem <span className="text-red-500">*</span>
          <i className="fas fa-info-circle text-slate-300 text-[10px] cursor-help" title="Selecione a moeda que você possui."></i>
        </label>
        <select
          id="fromCurrency"
          name="fromCurrency"
          value={fromCurrency}
          onChange={(e) => onFromChange(e.target.value)}
          className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-audit-gold bg-white text-slate-700"
          aria-label="Moeda de origem"
        >
          {Object.keys(currencies).map((code) => (
            <option key={code} value={code}>
              {code} - {currencies[code]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="toCurrency" className="block text-xs font-bold text-audit-navy uppercase tracking-widest mb-3 flex items-center gap-2">
          Moeda de Destino <span className="text-red-500">*</span>
          <i className="fas fa-info-circle text-slate-300 text-[10px] cursor-help" title="Selecione a moeda para a qual deseja converter."></i>
        </label>
        <select
          id="toCurrency"
          name="toCurrency"
          value={toCurrency}
          onChange={(e) => onToChange(e.target.value)}
          className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-audit-gold bg-white text-slate-700"
          aria-label="Moeda de destino"
        >
          {Object.keys(currencies).map((code) => (
            <option key={code} value={code}>
              {code} - {currencies[code]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SeletorMoedas;