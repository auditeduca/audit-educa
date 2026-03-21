import React, { useState, useEffect } from 'react';
import { TEMPLATES } from '../../templates/data/templates/index.js';
import { CATEGORIES } from '../../templates/data/categories.js';

export default function TemplateSelector({ onSelectTemplate, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [favorites, setFavorites] = useState([]);
  const [recentTemplates, setRecentTemplates] = useState([]);

  useEffect(() => {
    const savedFavs = localStorage.getItem('template_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    const savedRecent = localStorage.getItem('template_recent');
    if (savedRecent) setRecentTemplates(JSON.parse(savedRecent));
  }, []);

  const filteredTemplates = Object.entries(TEMPLATES)
    .filter(([key, template]) => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a[1].name.localeCompare(b[1].name);
      if (sortBy === 'recent') {
        const aRecent = recentTemplates.findIndex(t => t.key === a[0]);
        const bRecent = recentTemplates.findIndex(t => t.key === b[0]);
        if (aRecent === -1 && bRecent === -1) return 0;
        if (aRecent === -1) return 1;
        if (bRecent === -1) return -1;
        return aRecent - bRecent;
      }
      return a[1].name.localeCompare(b[1].name);
    });

  const handleToggleFavorite = (key, e) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(key)) {
      updated = favorites.filter(f => f !== key);
      showToast('Removido dos favoritos', 'info');
    } else {
      updated = [...favorites, key];
      showToast('Adicionado aos favoritos', 'success');
    }
    setFavorites(updated);
    localStorage.setItem('template_favorites', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-audit-navy">Escolha um Template</h1>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              type="text"
              placeholder="Buscar templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-audit-gold focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-audit-gold"
          >
            <option value="all">Todas categorias</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-audit-gold"
          >
            <option value="name">Ordenar por Nome</option>
            <option value="recent">Mais Recentes</option>
            <option value="popular">Mais Populares</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(([key, template]) => (
          <div
            key={key}
            onClick={() => onSelectTemplate(key)}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition cursor-pointer group relative"
          >
            <button
              onClick={(e) => handleToggleFavorite(key, e)}
              className={`absolute top-4 right-4 text-xl transition ${
                favorites.includes(key) ? 'text-yellow-500' : 'text-slate-300 hover:text-yellow-500'
              }`}
            >
              <i className="fas fa-star"></i>
            </button>
            <div className="text-4xl mb-4">{template.name.split(' ')[0]}</div>
            <h3 className="text-lg font-bold text-audit-navy mb-2">{template.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{template.description}</p>
            <div className="flex justify-between items-center text-xs">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                {template.category}
              </span>
              <span className="text-slate-400">{template.variables.length} variáveis</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}