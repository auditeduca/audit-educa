import React from 'react';
import { formatCurrency } from '../../../utils/formatadores';

const ConversorMoedas = ({ amount, onAmountChange, fromCurrency, toCurrency, result, onConvert }) => {
  return (
    <div className="space-y-8">
      <div className="group" id="tour-step-2">
        <label htmlFor="amount" className="block text-xs font-bold text-audit-navy uppercase tracking-widest mb-3 flex items-center gap-2">
          Valor a Converter <span className="text-red-500">*</span>
          <i className="fas fa-info-circle text-slate-300 text-[10px] cursor-help" title="Digite o valor que deseja converter."></i>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-400 font-bold">{fromCurrency}</span>
          </div>
          <input
            id="amount"
            name="amount"
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
            className="form-input pl-20 text-xl font-semibold text-slate-700 w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-audit-gold"
            placeholder="0,00"
            step="any"
            aria-label={`Valor em ${fromCurrency}`}
          />
        </div>
      </div>

      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onConvert}
          className="bg-audit-navy text-white px-8 py-5 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-slate-800 transition-all active:scale-95 group"
        >
          <i className="fas fa-calculator text-audit-gold group-hover:scale-110 transition-transform"></i> CONVERTER
        </button>
        <button
          onClick={() => onAmountChange(1)}
          className="px-8 py-5 rounded-xl font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 transition flex items-center justify-center gap-2"
        >
          <i className="fas fa-rotate-left"></i> LIMPAR
        </button>
      </div>

      {result !== null && (
        <div className="mt-6 text-center">
          <div className="inline-block bg-slate-50 px-6 py-3 rounded-full">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resultado</span>
            <span className="block text-2xl font-bold text-audit-navy mt-1">{formatCurrency(result, toCurrency)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversorMoedas;