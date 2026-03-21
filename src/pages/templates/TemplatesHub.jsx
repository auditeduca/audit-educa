// src/pages/templates/TemplatesHub.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Toast from '../../components/ui/Toast';
import AccessibilityWidget from '../../components/AccessibilityWidget';

import TemplateSidebar from './components/TemplateSidebar';
import VariableManager from './components/VariableManager';
import TemplatePreview from './components/TemplatePreview';
import ExportManager from './components/ExportManager';
import TemplateLibrary from './components/TemplateLibrary';
import VersionHistory from './components/VersionHistory';
import CollaborationPanel from './components/CollaborationPanel';

import { TEMPLATES } from './data/templates';
import { CATEGORIES } from './data/categories';
import { useTemplate } from './hooks/useTemplate';
import { useExport } from './hooks/useExport';
import { useHistory } from './hooks/useHistory';

export default function TemplatesHub() {
  const [toastMessage, setToastMessage] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [variables, setVariables] = useState({});
  const [processedHTML, setProcessedHTML] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [recentTemplates, setRecentTemplates] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);

  const { saveTemplate, loadTemplate, deleteTemplate, getTemplateList } = useTemplate();
  const { exportToFormats, copyToClipboard } = useExport();
  const { addVersion, getVersions, restoreVersion } = useHistory();

  const showToast = (msg, type = 'info') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Carregar favoritos e recentes
  useEffect(() => {
    const savedFavs = localStorage.getItem('template_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    const savedRecent = localStorage.getItem('template_recent');
    if (savedRecent) setRecentTemplates(JSON.parse(savedRecent));
  }, []);

  // Selecionar template inicial
  useEffect(() => {
    if (!activeTemplate && Object.keys(TEMPLATES).length > 0) {
      handleSelectTemplate(Object.keys(TEMPLATES)[0]);
    }
  }, []);

  // Atualizar preview quando variáveis mudam
  useEffect(() => {
    if (activeTemplate) updatePreview();
  }, [variables, activeTemplate]);

  const handleSelectTemplate = (templateKey) => {
    setActiveTemplate(templateKey);
    const template = TEMPLATES[templateKey];
    const initialVars = {};
    template.variables.forEach(v => { initialVars[v] = ''; });
    setVariables(initialVars);

    const updatedRecent = [
      { key: templateKey, name: template.name, timestamp: new Date().toISOString() },
      ...recentTemplates.filter(t => t.key !== templateKey)
    ].slice(0, 5);
    setRecentTemplates(updatedRecent);
    localStorage.setItem('template_recent', JSON.stringify(updatedRecent));
  };

  const updatePreview = () => {
    if (!activeTemplate) return;
    const template = TEMPLATES[activeTemplate];
    let html = template.html;

    // Substituir variáveis simples
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, value || `<span class="text-red-400">[${key}]</span>`);
    });

    // Processar condicionais
    html = html.replace(/\{\{#if (.*?)\}\}(.*?)\{\{\/if\}\}/gs, (match, condition, content) => {
      return variables[condition] ? content : '';
    });

    // Processar loops
    html = html.replace(/\{\{#each (.*?)\}\}(.*?)\{\{\/each\}\}/gs, (match, listName, templateHtml) => {
      try {
        const items = variables[listName] ? JSON.parse(variables[listName]) : [];
        if (!Array.isArray(items)) return '';
        return items.map(item => {
          let itemHtml = templateHtml;
          Object.entries(item).forEach(([key, value]) => {
            itemHtml = itemHtml.replace(new RegExp(`{{this.${key}}}`, 'g'), value);
          });
          return itemHtml;
        }).join('');
      } catch (e) {
        return '';
      }
    });

    setProcessedHTML(html);
  };

  const handleSaveTemplate = async () => {
    const template = TEMPLATES[activeTemplate];
    const saved = await saveTemplate({
      templateKey: activeTemplate,
      name: template.name,
      variables,
      timestamp: new Date().toISOString()
    });
    if (saved) {
      showToast('Template salvo com sucesso!', 'success');
      addVersion(activeTemplate, variables);
    }
  };

  const handleExport = async (format) => {
    const result = await exportToFormats(format, {
      template: TEMPLATES[activeTemplate],
      variables,
      processedHTML
    });
    if (result.success) showToast(`Exportado como ${format.toUpperCase()}`, 'success');
    else showToast(`Erro: ${result.error}`, 'error');
  };

  const handleToggleFavorite = () => {
    let updated;
    if (favorites.includes(activeTemplate)) {
      updated = favorites.filter(f => f !== activeTemplate);
    } else {
      updated = [...favorites, activeTemplate];
    }
    setFavorites(updated);
    localStorage.setItem('template_favorites', JSON.stringify(updated));
    showToast(updated.includes(activeTemplate) ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
  };

  const filteredTemplates = Object.entries(TEMPLATES).filter(([key, template]) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!activeTemplate) return null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-grow pb-12 px-4 sm:px-6 pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho com busca e categoria */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
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
              <button
                onClick={() => setShowLibraryModal(true)}
                className="px-4 py-3 bg-audit-navy text-white rounded-xl hover:bg-opacity-90 transition"
              >
                <i className="fas fa-folder-open mr-2"></i> Biblioteca
              </button>
            </div>
          </div>

          {/* Grid principal responsivo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Sidebar esquerda - lista de templates */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <TemplateSidebar
                templates={filteredTemplates}
                activeTemplate={activeTemplate}
                favorites={favorites}
                recentTemplates={recentTemplates}
                onSelectTemplate={handleSelectTemplate}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>

            {/* Área central - editor e variáveis */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6" id="editor">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-audit-navy">{TEMPLATES[activeTemplate]?.name}</h1>
                    <p className="text-sm text-slate-500 mt-1">{TEMPLATES[activeTemplate]?.description}</p>
                  </div>
                  <button
                    onClick={handleToggleFavorite}
                    className={`text-2xl transition ${
                      favorites.includes(activeTemplate) ? 'text-yellow-500' : 'text-slate-300 hover:text-yellow-500'
                    }`}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                </div>
                <div className="flex gap-2 border-t pt-4">
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition"
                  >
                    <i className="fas fa-history mr-2"></i> Histórico
                  </button>
                  <button
                    onClick={() => setShowCollaborationModal(true)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition"
                  >
                    <i className="fas fa-users mr-2"></i> Colaborar
                  </button>
                </div>
              </div>

              <VariableManager
                variables={TEMPLATES[activeTemplate]?.variables}
                values={variables}
                onChange={setVariables}
              />

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleSaveTemplate}
                  className="py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-save"></i> Salvar
                </button>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-download"></i> Exportar
                </button>
              </div>
            </div>

            {/* Sidebar direita - preview retrátil */}
            <div className="lg:col-span-3 order-3">
              <div className="sticky top-24">
                <button
                  onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                  className="lg:hidden w-full mb-2 py-2 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center gap-2"
                >
                  <i className={`fas fa-chevron-${isPreviewOpen ? 'down' : 'up'}`}></i>
                  {isPreviewOpen ? 'Ocultar preview' : 'Mostrar preview'}
                </button>

                <div className={`transition-all duration-300 overflow-hidden ${
                  isPreviewOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-[800px] lg:opacity-100'
                }`}>
                  <TemplatePreview
                    html={processedHTML}
                    onRefresh={updatePreview}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modais */}
      <ExportManager
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        template={TEMPLATES[activeTemplate]}
        variables={variables}
        processedHTML={processedHTML}
        onExport={handleExport}
        onCopy={copyToClipboard}
      />

      <TemplateLibrary
        isOpen={showLibraryModal}
        onClose={() => setShowLibraryModal(false)}
        templates={getTemplateList()}
        onLoad={loadTemplate}
        onDelete={deleteTemplate}
        showToast={showToast}
      />

      <VersionHistory
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        versions={getVersions(activeTemplate)}
        onRestore={(id, vars) => {
          setVariables(vars);
          showToast('Versão restaurada!', 'success');
        }}
      />

      <CollaborationPanel
        isOpen={showCollaborationModal}
        onClose={() => setShowCollaborationModal(false)}
        templateId={activeTemplate}
      />

      <Footer />
      <AccessibilityWidget />
      <Toast message={toastMessage?.text} type={toastMessage?.type} />
    </div>
  );
}