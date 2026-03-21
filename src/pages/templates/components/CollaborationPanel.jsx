// src/pages/templates/components/CollaborationPanel.jsx
import React, { useState } from 'react';

export default function CollaborationPanel({ isOpen, onClose, templateId }) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [sharedWith, setSharedWith] = useState([]);

  if (!isOpen) return null;

  const handleShare = () => {
    if (!email) return;
    // Simula compartilhamento (em produção, enviaria para backend)
    const newShare = { email, permission, id: Date.now() };
    setSharedWith([...sharedWith, newShare]);
    setEmail('');
    // Aqui você poderia chamar uma API ou mostrar um toast
  };

  const handleRemove = (id) => {
    setSharedWith(sharedWith.filter(item => item.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100000] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-audit-navy">👥 Compartilhar Template</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600 mb-4">
            Compartilhe este template com outros usuários para edição colaborativa.
          </p>

          <div className="flex gap-2 mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail do colaborador"
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-audit-gold"
            />
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg bg-white"
            >
              <option value="view">Visualizar</option>
              <option value="edit">Editar</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-audit-navy text-white rounded-lg hover:bg-opacity-90 transition"
            >
              <i className="fas fa-share-alt"></i>
            </button>
          </div>

          {sharedWith.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-audit-navy">Compartilhado com:</h3>
              {sharedWith.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{item.email}</p>
                    <p className="text-xs text-slate-500">Permissão: {item.permission}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remover"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {sharedWith.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <i className="fas fa-users text-4xl mb-2 opacity-50"></i>
              <p className="text-sm">Nenhum compartilhamento ativo</p>
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