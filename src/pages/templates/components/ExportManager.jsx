// src/pages/templates/components/ExportManager.jsx
import React, { useState } from 'react';

export default function ExportManager({ isOpen, onClose, template, variables, processedHTML, onExport, onCopy }) {
  const [selectedFormat, setSelectedFormat] = useState('html');
  const [exportOptions, setExportOptions] = useState({
    includeMetadata: true,
    minify: false,
    embedStyles: true
  });

  const formats = [
    { id: 'html', name: 'HTML', icon: 'fa-code', color: 'blue' },
    { id: 'json', name: 'JSON', icon: 'fa-file-code', color: 'green' },
    { id: 'word', name: 'Word', icon: 'fa-file-word', color: 'blue' },
    { id: 'ppt', name: 'PowerPoint', icon: 'fa-file-powerpoint', color: 'orange' },
    // { id: 'excel', name: 'Excel', icon: 'fa-file-excel', color: 'green' },
    // { id: 'markdown', name: 'Markdown', icon: 'fa-markdown', color: 'purple' },
    // { id: 'txt', name: 'Texto', icon: 'fa-file-alt', color: 'gray' }
  ];

  if (!isOpen) return null;

  const generateMetadata = () => {
    return `<!-- 
  Template: ${template.name}
  Data: ${new Date().toLocaleString('pt-BR')}
  Gerado por: ASC Templates Pro
  Versão: 1.0
  Variáveis: ${Object.keys(variables).length}
-->\n`;
  };

  const getExportContent = () => {
    let content = processedHTML;
    
    if (exportOptions.includeMetadata) {
      content = generateMetadata() + content;
    }
    
    if (exportOptions.minify) {
      content = content.replace(/\s+/g, ' ').replace(/> </g, '><');
    }

    return content;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100000] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-audit-navy">Exportar Template</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-1">Selecione o formato e opções de exportação</p>
        </div>

        <div className="p-6">
          {/* Grid de formatos */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {formats.map(format => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedFormat === format.id
                    ? `border-${format.color}-600 bg-${format.color}-50`
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <i className={`fas ${format.icon} text-2xl text-${format.color}-600 mb-2`}></i>
                <div className="text-xs font-bold">{format.name}</div>
              </button>
            ))}
          </div>

          {/* Opções avançadas */}
          <div className="bg-slate-50 p-4 rounded-xl mb-6">
            <h3 className="text-sm font-bold text-audit-navy mb-3 flex items-center gap-2">
              <i className="fas fa-cog"></i>
              Opções avançadas
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportOptions.includeMetadata}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    includeMetadata: e.target.checked
                  })}
                  className="rounded text-audit-gold focus:ring-audit-gold"
                />
                <span className="text-sm text-slate-600">Incluir metadados no arquivo</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportOptions.minify}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    minify: e.target.checked
                  })}
                  className="rounded text-audit-gold focus:ring-audit-gold"
                />
                <span className="text-sm text-slate-600">Minificar código (remover espaços)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportOptions.embedStyles}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    embedStyles: e.target.checked
                  })}
                  className="rounded text-audit-gold focus:ring-audit-gold"
                />
                <span className="text-sm text-slate-600">Incorporar estilos inline</span>
              </label>
            </div>
          </div>

          {/* Preview do conteúdo (apenas para HTML) */}
          {selectedFormat === 'html' && (
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-700 mb-2 block">Visualização do HTML:</label>
              <textarea
                readOnly
                value={getExportContent()}
                rows="8"
                className="w-full p-3 font-mono text-sm border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
          )}

          {/* Botões de ação */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onExport(selectedFormat)}
              className="py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <i className="fas fa-download"></i>
              Exportar {formats.find(f => f.id === selectedFormat)?.name}
            </button>
            <button
              onClick={() => onCopy(getExportContent())}
              className="py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <i className="fas fa-copy"></i>
              Copiar
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}