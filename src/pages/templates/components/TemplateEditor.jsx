// src/pages/templates/components/TemplateEditor.jsx
import React from 'react';

export default function TemplateEditor({
  currentTemplate,
  templateData,
  variables,
  onUpdateVariable,
  onReset,
  onSave,
  onExport,
  previewHTML
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-audit-navy mb-2">{templateData.name}</h2>
      <p className="text-sm text-slate-500 mb-6">{templateData.description}</p>

      {/* Lista de variáveis */}
      <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
        <h4 className="text-sm font-bold text-audit-navy mb-4 flex items-center gap-2">
          <i className="fas fa-code-branch text-audit-gold"></i> Variáveis do Template
        </h4>
        <div className="space-y-4">
          {templateData.variables.map((variable) => (
            <div key={variable} className="grid grid-cols-3 gap-4 items-center">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {variable}
              </label>
              <input
                type="text"
                value={variables[variable] || ''}
                onChange={(e) => onUpdateVariable(variable, e.target.value)}
                placeholder={`Digite ${variable}`}
                className="col-span-2 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-audit-gold focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pré-visualização */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-audit-navy mb-4 flex items-center gap-2">
          <i className="fas fa-eye text-audit-gold"></i> Pré-visualização
        </h3>
        <div className="bg-white border border-slate-200 rounded-xl p-6 max-h-[500px] overflow-y-auto shadow-inner">
          <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
        </div>
      </div>

      {/* Botões de ação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={onExport}
          className="py-3 px-4 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <i className="fas fa-download"></i>
          <span>Exportar</span>
        </button>
        <button
          onClick={onSave}
          className="py-3 px-4 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <i className="fas fa-save"></i>
          <span>Salvar</span>
        </button>
        <button
          onClick={onReset}
          className="py-3 px-4 bg-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-300 transition flex items-center justify-center gap-2"
        >
          <i className="fas fa-undo-alt"></i>
          <span>Limpar</span>
        </button>
      </div>
    </div>
  );
}