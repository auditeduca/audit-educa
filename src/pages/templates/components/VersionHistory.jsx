// src/pages/templates/components/VersionHistory.jsx
import React from 'react';

export default function VersionHistory({ isOpen, onClose, versions, onRestore }) {
  if (!isOpen) return null;

  const handleRestore = (version) => {
    if (window.confirm(`Restaurar versão de ${new Date(version.timestamp).toLocaleString('pt-BR')}?`)) {
      onRestore(version.id, version.variables);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100000] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-audit-navy">📜 Histórico de Versões</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {versions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <i className="fas fa-history text-4xl mb-4 opacity-50"></i>
              <p>Nenhuma versão salva ainda.</p>
              <p className="text-sm">Cada vez que você salvar o template, uma nova versão será criada.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version, index) => (
                <div key={version.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-audit-navy">Versão {versions.length - index}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(version.timestamp).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(version.variables).slice(0, 5).map(([key, value]) => (
                          <div key={key} className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                            <span className="font-medium">{key}:</span> {value || '—'}
                          </div>
                        ))}
                        {Object.keys(version.variables).length > 5 && (
                          <span className="text-xs text-slate-400">+{Object.keys(version.variables).length - 5}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestore(version)}
                      className="p-2 bg-audit-gold text-audit-navy rounded-lg hover:bg-yellow-500 transition ml-4"
                      title="Restaurar esta versão"
                    >
                      <i className="fas fa-undo-alt"></i>
                    </button>
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