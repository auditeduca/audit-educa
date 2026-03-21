// src/pages/templates/components/TemplateSidebar.jsx
import React from 'react';

export default function TemplateSidebar({
  templates,
  activeTemplate,
  favorites,
  recentTemplates,
  onSelectTemplate,
  onToggleFavorite
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
      <div className="space-y-6">
        {/* Favoritos */}
        {favorites.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <i className="fas fa-star text-yellow-500"></i>
              Favoritos
            </h3>
            <div className="space-y-1">
              {favorites.map(key => {
                const template = templates.find(([k]) => k === key)?.[1];
                if (!template) return null;
                return (
                  <button
                    key={key}
                    onClick={() => onSelectTemplate(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      activeTemplate === key
                        ? 'bg-audit-navy text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <i className="fas fa-star text-yellow-500 mr-2 text-xs"></i>
                    {template.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Recentes */}
        {recentTemplates.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <i className="fas fa-history"></i>
              Recentes
            </h3>
            <div className="space-y-1">
              {recentTemplates.map(({ key, name }) => (
                <button
                  key={key}
                  onClick={() => onSelectTemplate(key)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Todas categorias */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Todos Templates
          </h3>
          <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scroll pr-2">
            {templates.map(([key, template]) => (
              <button
                key={key}
                onClick={() => onSelectTemplate(key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition group ${
                  activeTemplate === key
                    ? 'bg-audit-navy text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{template.name}</span>
                  <span className="text-xs opacity-60">{template.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}