// src/pages/templates/components/TemplateLibrary.jsx
import React from 'react';

export default function TemplateLibrary({ isOpen, onClose, templates, onLoad, onDelete, showToast }) {
  if (!isOpen) return null;

  const handleLoad = (template) => {
    onLoad(template.id);
    onClose();
    showToast('Template carregado com sucesso!', 'success');
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Deseja realmente excluir o template "${name}"?`)) {
      onDelete(id);
      showToast('Template excluído!', 'info');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100000] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-audit-navy">📚 Biblioteca de Templates</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {templates.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <i className="fas fa-folder-open text-4xl mb-4 opacity-50"></i>
              <p>Nenhum template salvo ainda.</p>
              <p className="text-sm">Use o botão "Salvar" para guardar seus templates.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-audit-navy">{template.customName || template.templateName}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Salvo em: {new Date(template.timestamp).toLocaleString('pt-BR')}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.keys(template.variables).slice(0, 3).map(key => (
                          <span key={key} className="text-[10px] bg-white px-2 py-1 rounded border border-slate-200">
                            {key}: {template.variables[key] || '—'}
                          </span>
                        ))}
                        {Object.keys(template.variables).length > 3 && (
                          <span className="text-[10px] text-slate-400">+{Object.keys(template.variables).length - 3}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleLoad(template)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                        title="Carregar"
                      >
                        <i className="fas fa-upload"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(template.id, template.customName || template.templateName)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Excluir"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200">
          <button onClick={onClose} className="w-full py-3 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}