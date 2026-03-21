import React, { useState, useEffect } from 'react';
import { TEMPLATES } from '../../templates/data/templates/index.js'; // extensão .js explícita
import VariableManager from '../../templates/components/VariableManager.jsx';
import TemplatePreview from '../../templates/components/TemplatePreview.jsx';
import ExportManager from '../../templates/components/ExportManager.jsx';
import { useExport } from '../../templates/hooks/useExport.js';
import { useHistory } from '../../templates/hooks/useHistory.js';

export default function TemplateEditorStep({ templateKey, onBack, showToast }) {
  const template = TEMPLATES?.[templateKey];
  const [variables, setVariables] = useState({});
  const [processedHTML, setProcessedHTML] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const { exportToFormats, copyToClipboard } = useExport();
  const { addVersion } = useHistory();

  useEffect(() => {
    if (template) {
      const initial = {};
      template.variables.forEach(v => { initial[v] = ''; });
      setVariables(initial);
    }
  }, [templateKey, template]);

  useEffect(() => {
    if (template) updatePreview();
  }, [variables, templateKey, template]);

  const updatePreview = () => {
    if (!template) return;
    let html = template.html;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, value || `<span class="text-red-400">[${key}]</span>`);
    });
    html = html.replace(/\{\{#if (.*?)\}\}(.*?)\{\{\/if\}\}/gs, (match, condition, content) => {
      return variables[condition] ? content : '';
    });
    setProcessedHTML(html);
  };

  const handleSave = () => {
    const recent = JSON.parse(localStorage.getItem('template_recent') || '[]');
    const updatedRecent = [
      { key: templateKey, name: template.name, timestamp: new Date().toISOString() },
      ...recent.filter(t => t.key !== templateKey)
    ].slice(0, 5);
    localStorage.setItem('template_recent', JSON.stringify(updatedRecent));
    addVersion(templateKey, variables);
    showToast('Template salvo nos recentes!', 'success');
  };

  const handleExport = async (format) => {
    const result = await exportToFormats(format, { template, variables, processedHTML });
    if (result.success) showToast(`Exportado como ${format.toUpperCase()}`, 'success');
    else showToast(`Erro: ${result.error}`, 'error');
  };

  const downloadJSON = () => {
    const data = { templateKey, templateName: template.name, variables, timestamp: new Date().toISOString() };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}.json`;
    a.click();
    showToast('JSON baixado!', 'success');
  };

  if (!template) return <div className="p-8 text-center text-red-500">Template não encontrado</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-audit-navy transition">
          <i className="fas fa-arrow-left"></i> Voltar
        </button>
        <h1 className="text-2xl font-bold text-audit-navy">{template.name}</h1>
        <button onClick={downloadJSON} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-2">
          <i className="fas fa-download"></i> JSON
        </button>
      </div>

      <p className="text-slate-500">{template.description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <VariableManager variables={template.variables} values={variables} onChange={setVariables} />
          <div className="flex gap-4 mt-6">
            <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
              <i className="fas fa-save mr-2"></i> Salvar
            </button>
            <button onClick={() => setShowExportModal(true)} className="flex-1 py-3 bg-audit-gold text-audit-navy rounded-lg font-bold hover:bg-yellow-500 transition">
              <i className="fas fa-download mr-2"></i> Exportar
            </button>
          </div>
        </div>
        <div>
          <TemplatePreview html={processedHTML} onRefresh={updatePreview} />
        </div>
      </div>

      <ExportManager
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        template={template}
        variables={variables}
        processedHTML={processedHTML}
        onExport={handleExport}
        onCopy={copyToClipboard}
      />
    </div>
  );
}