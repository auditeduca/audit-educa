import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TemplateSelector from './components/TemplateSelector';
import DataForm from './components/DataForm';
import NoteDisplay from './components/NoteDisplay';
import { TEMPLATES } from './templates';

export default function NotasExplicativas() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedText, setGeneratedText] = useState('');

  const handleTemplateSelect = (tpl) => {
    setSelectedTemplate(tpl);
    setFormData({});
    setGeneratedText('');
  };

  const handleDataChange = (newData) => {
    setFormData(newData);
    if (selectedTemplate) {
      setGeneratedText(selectedTemplate.gerarTexto(newData));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-grow p-6 md:p-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 rounded-full bg-audit-blue/10 text-audit-blue text-[10px] font-bold tracking-widest mb-4 border border-audit-blue/20">
            NOTAS EXPLICATIVAS
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-audit-navy mb-4">Gerador de Notas</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Selecione um template, preencha os dados e gere automaticamente o texto conforme as normas contábeis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelect={handleTemplateSelect}
            />
            {selectedTemplate && (
              <DataForm
                template={selectedTemplate}
                data={formData}
                onChange={handleDataChange}
              />
            )}
          </div>
          <div className="lg:col-span-8">
            {generatedText ? (
              <NoteDisplay text={generatedText} />
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center">
                <i className="fas fa-file-alt text-5xl text-slate-300 mb-4"></i>
                <h3 className="text-lg font-bold text-slate-400">Nenhuma nota gerada ainda</h3>
                <p className="text-sm text-slate-400 mt-2">Selecione um template e preencha os dados.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}