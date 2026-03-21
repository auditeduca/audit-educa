// src/pages/circularizacao/components/ProgressBar.jsx
import React from 'react';

const stepLabels = {
  1: 'Setup',
  2: 'Tipos',
  3: 'Textos',
  4: 'Produtos',
  5: 'Dados',
  6: 'Design',
  7: 'Destinatários',
  8: 'Exportar',
};

export default function ProgressBar({ currentStep, totalSteps }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {steps.map(step => (
            <div key={step} className="flex-1 flex flex-col items-center">
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === currentStep
                    ? 'bg-audit-gold text-audit-navy ring-4 ring-audit-gold/30 scale-105'
                    : step < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {step < currentStep ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span className="text-xs mt-2 text-gray-600 dark:text-gray-400 hidden sm:block font-medium">
                {stepLabels[step]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}