import React, { useEffect, useRef } from 'react';
import { useAuditUI } from '../components/context/AuditUIContext';

const tourSteps = [
  { id: 'hero', text: 'Bem-vindo à Calculadora de Moedas! Converta valores entre diferentes moedas com taxas atualizadas.' },
  { id: 'seletor', text: 'Escolha a moeda de origem e a moeda de destino para a conversão.' },
  { id: 'conversor', text: 'Informe o valor e clique em "Converter" para ver o resultado.' },
  { id: 'grafico', text: 'Veja o histórico das taxas de câmbio em um gráfico interativo.' },
  { id: 'tabela', text: 'Confira as taxas de câmbio atuais para diversas moedas.' }
];

const Tour = () => {
  const { tourStep, nextTourStep, closeTour } = useAuditUI();
  const popoverRef = useRef(null);

  useEffect(() => {
    if (tourStep === null) return;

    const step = tourSteps[tourStep];
    if (!step) return;

    const target = document.getElementById(step.id);
    if (!target) {
      // Target not found, skip to next step
      nextTourStep();
      return;
    }

    // Scroll to target
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Add highlight class
    target.classList.add('tour-highlight');

    // Calculate popover position
    const rect = target.getBoundingClientRect();
    const popoverHeight = 200;
    const spaceBelow = window.innerHeight - rect.bottom;
    let topPos = rect.bottom + 15;
    if (spaceBelow < popoverHeight) {
      topPos = rect.top - popoverHeight - 15;
    }
    topPos = Math.max(20, topPos);
    const leftPos = Math.max(10, rect.left);

    // Update popover position
    if (popoverRef.current) {
      popoverRef.current.style.top = `${topPos}px`;
      popoverRef.current.style.left = `${leftPos}px`;
    }

    return () => {
      target.classList.remove('tour-highlight');
    };
  }, [tourStep, nextTourStep]);

  if (tourStep === null) return null;

  const current = tourSteps[tourStep];
  if (!current) return null;

  const isLast = tourStep === tourSteps.length - 1;

  return (
    <div
      ref={popoverRef}
      className="tour-popover"
      style={{ position: 'fixed', top: 0, left: 0 }}
    >
      <p className="text-xs font-bold text-audit-navy mb-3 uppercase tracking-widest">
        Guia Audit ({tourStep + 1}/{tourSteps.length})
      </p>
      <p className="text-xs text-slate-600 mb-4 leading-relaxed">{current.text}</p>
      <div className="flex justify-between items-center">
        <button
          onClick={closeTour}
          className="text-[10px] font-bold text-slate-400 uppercase hover:text-red-500 transition"
        >
          Sair
        </button>
        <button
          onClick={isLast ? closeTour : nextTourStep}
          className="bg-audit-gold text-audit-navy px-4 py-2 rounded-lg text-[10px] font-bold uppercase shadow-sm hover:scale-105 transition"
        >
          {isLast ? 'Finalizar' : 'Próximo'}
        </button>
      </div>
    </div>
  );
};

export default Tour;