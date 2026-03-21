// src/pages/templates/components/VariableManager.jsx
import React, { useState } from 'react';

export default function VariableManager({ variables = [], values, onChange }) {
  const [activeTab, setActiveTab] = useState('simple');
  const [jsonInput, setJsonInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSimpleChange = (variable, value) => {
    onChange({ ...values, [variable]: value });
  };

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      // Validar se todas as variáveis necessárias estão presentes
      const missing = variables.filter(v => !parsed.hasOwnProperty(v));
      if (missing.length > 0) {
        setValidationError(`Variáveis ausentes: ${missing.join(', ')}`);
        return;
      }
      onChange(parsed);
      setValidationError('');
      setJsonInput('');
    } catch (e) {
      setValidationError('JSON inválido: ' + e.message);
    }
  };

  const exportJson = () => {
    const json = JSON.stringify(values, null, 2);
    navigator.clipboard.writeText(json);
    // Mostrar toast
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-audit-navy flex items-center gap-2">
          <i className="fas fa-code-branch text-audit-gold"></i>
          Variáveis
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('simple')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'simple'
                ? 'bg-audit-navy text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <i className="fas fa-edit mr-1"></i> Simples
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'advanced'
                ? 'bg-audit-navy text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <i className="fas fa-code mr-1"></i> Avançado
          </button>
        </div>
      </div>

      {activeTab === 'simple' ? (
        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scroll pr-2">
          {variables.map((variable) => (
            <div key={variable} className="grid grid-cols-3 gap-4 items-center">
              <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <i className="fas fa-tag text-audit-gold text-xs"></i>
                {variable}
              </label>
              <div className="col-span-2">
                <input
                  type="text"
                  value={values[variable] || ''}
                  onChange={(e) => handleSimpleChange(variable, e.target.value)}
                  placeholder={`Digite ${variable}`}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-audit-gold focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 mb-2">
              Cole um JSON com os valores das variáveis:
            </p>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"nome": "João", "email": "joao@email.com"}'
              rows="6"
              className="w-full p-3 font-mono text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-audit-gold"
            />
            {validationError && (
              <p className="text-red-500 text-xs mt-2">{validationError}</p>
            )}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleJsonImport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
              >
                <i className="fas fa-upload mr-2"></i> Importar
              </button>
              <button
                onClick={exportJson}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300 transition"
              >
                <i className="fas fa-copy mr-2"></i> Exportar JSON
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-bold text-blue-700 mb-2 flex items-center gap-2">
              <i className="fas fa-info-circle"></i>
              Variáveis esperadas:
            </h4>
            <div className="flex flex-wrap gap-2">
              {variables.map(v => (
                <span key={v} className="px-2 py-1 bg-white text-blue-600 rounded text-xs font-mono">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}