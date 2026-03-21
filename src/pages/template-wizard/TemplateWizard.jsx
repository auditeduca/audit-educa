import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Toast from '../../components/ui/Toast';
import AccessibilityWidget from '../../components/AccessibilityWidget';
import TemplateSelector from './components/TemplateSelector';
import TemplateEditorStep from './components/TemplateEditorStep';

export default function TemplateWizard() {
  const [step, setStep] = useState(1);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectTemplate = (key) => {
    setSelectedTemplateKey(key);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedTemplateKey(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-grow pb-12 px-4 sm:px-6 pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Indicador de etapas */}
          <div className="mb-8 flex items-center justify-center">
            <div className={`flex items-center ${step >= 1 ? 'text-audit-navy' : 'text-slate-300'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-audit-gold text-audit-navy' : 'bg-slate-200 text-slate-500'
              }`}>1</span>
              <span className="ml-2 text-sm font-medium">Escolher Template</span>
            </div>
            <div className="w-16 h-0.5 mx-4 bg-slate-300"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-audit-navy' : 'text-slate-300'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? 'bg-audit-gold text-audit-navy' : 'bg-slate-200 text-slate-500'
              }`}>2</span>
              <span className="ml-2 text-sm font-medium">Editar & Exportar</span>
            </div>
          </div>

          {step === 1 && (
            <TemplateSelector onSelectTemplate={handleSelectTemplate} showToast={showToast} />
          )}

          {step === 2 && selectedTemplateKey && (
            <TemplateEditorStep
              templateKey={selectedTemplateKey}
              onBack={handleBack}
              showToast={showToast}
            />
          )}
        </div>
      </main>

      <Footer />
      <AccessibilityWidget />
      <Toast message={toastMessage?.text} type={toastMessage?.type} />
    </div>
  );
}