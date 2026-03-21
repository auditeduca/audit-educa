import React from 'react';
import { useAuditUI } from './context/AuditUIContext';

const Drawers = () => {
  const { activeDrawer, closeDrawer } = useAuditUI();

  const getDrawerContent = (id) => {
    switch (id) {
      case 'teoria':
        return (
          <>
            <h3 className="font-bold text-audit-navy flex items-center gap-2 uppercase text-xs tracking-widest">
              <i className="fas fa-book-open text-audit-gold"></i> Fundamentação Teórica
            </h3>
            <div className="overflow-y-auto flex-grow space-y-6 text-sm text-slate-600 leading-relaxed mt-6">
              <p>O regime de <strong>câmbio</strong> é baseado na oferta e demanda de moedas estrangeiras. O valor de uma moeda em relação a outra flutua constantemente no mercado financeiro.</p>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                <p className="font-serif text-2xl text-audit-blue font-bold tracking-widest">Cotação × Montante</p>
              </div>
            </div>
          </>
        );
      case 'referencias':
        return (
          <>
            <h3 className="font-bold text-audit-navy flex items-center gap-2 uppercase text-xs tracking-widest">
              <i className="fas fa-link text-audit-gold"></i> Referências Técnicas
            </h3>
            <div className="space-y-4 mt-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <p className="font-bold text-audit-navy uppercase mb-1">NBC TA 500</p>
                <p className="text-slate-500">Procedimentos de recálculo em evidência de auditoria independente.</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <p className="font-bold text-audit-navy uppercase mb-1">CPC 02</p>
                <p className="text-slate-500">Efeitos das mudanças nas taxas de câmbio e conversão de demonstrações contábeis.</p>
              </div>
            </div>
          </>
        );
      case 'sobre':
        return (
          <>
            <h3 className="font-bold text-audit-navy flex items-center gap-2 uppercase text-xs tracking-widest">
              <i className="fas fa-info-circle text-audit-gold"></i> Sobre o Hub
            </h3>
            <div className="text-sm text-slate-600 space-y-4 mt-6">
              <p>Calculadora profissional para fins de auditoria financeira e compliance. Ferramenta desenvolvida pelo Audit Educa para conferência de câmbio e provisões em moeda estrangeira.</p>
              <p>Versão 2.0 – atualizada em março de 2026.</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={`drawer-overlay ${activeDrawer ? 'active' : ''}`}
        onClick={closeDrawer}
      ></div>
      {['teoria', 'referencias', 'sobre'].map(id => (
        <aside key={id} id={`drawer-${id}`} className={`drawer no-print ${activeDrawer === id ? 'active' : ''}`}>
          <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              {getDrawerContent(id)}
              <button onClick={closeDrawer}>
                <i className="fas fa-times text-slate-400"></i>
              </button>
            </div>
          </div>
        </aside>
      ))}
    </>
  );
};

export default Drawers;