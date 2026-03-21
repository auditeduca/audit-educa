// src/pages/circularizacao/components/Step8Exportar.jsx
import React, { useEffect, useRef } from "react";
import { CTYPES } from "../../../libs/letterTemplates.js";
import FixedButtons from "./FixedButtons";
import { 
  FileText, 
  FileCode, 
  Download, 
  Printer, 
  Table, 
  RefreshCw, 
  ChevronRight,
  ChevronLeft,
  LayoutGrid
} from "lucide-react";

export default function Step8Exportar({
  ltrs, ed, setEd, ai, setAi,
  filterTipo, setFilterTipo,
  sTypes, xWordLote, xWordSingle,
  xExcelLote, xPrintAll, xControl,
  eRef, onBack,
  currentSection, setCurrentSection,
}) {
  const filtered = filterTipo ? ltrs.filter((l) => l.tipo === filterTipo) : ltrs;
  const current = filtered[ai];
  const globalIndex = ltrs.findIndex((l) => l === current);
  const previewRef = useRef(null);

  useEffect(() => {
    if (current && eRef.current) {
      eRef.current.innerHTML = ed[globalIndex] || current.html;
    }
  }, [current, ed, globalIndex, eRef]);

  // Máscara de leitura
  useEffect(() => {
    if (!previewRef.current) return;
    const sections = previewRef.current.querySelectorAll("[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.getAttribute("data-section"));
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" }
    );
    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [current, setCurrentSection]);

  if (!ltrs.length) {
    return (
      <div className="text-center py-20 animate-pulse">
        <LayoutGrid size={64} className="mx-auto text-gray-200 mb-6" />
        <p className="text-xl text-gray-500 font-medium">Processando cartas...</p>
      </div>
    );
  }

  const btnSecondary = "flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all";
  const btnAction = "flex items-center gap-2 px-4 py-2 bg-audit-navy dark:bg-audit-gold text-white dark:text-audit-navy rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-all";

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500">
      
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-audit-navy/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-audit-navy dark:text-white">Exportação e Controle</h2>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">{ltrs.length} cartas geradas</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button onClick={xWordLote} className={btnAction}>
            <Download size={16} /> Word (Lote)
          </button>
          <button onClick={xExcelLote} className={btnSecondary}>
            <Table size={16} /> Planilha Controle
          </button>
          <button onClick={xPrintAll} className={btnSecondary}>
            <Printer size={16} /> Imprimir Todas
          </button>
          <button onClick={xControl} className={btnSecondary}>
            <FileCode size={16} /> JSON Export
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-audit-navy/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-lg">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">Filtrar por Tipo</h3>
            <select 
              className="w-full bg-gray-50 dark:bg-audit-navy border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-audit-gold mb-6"
              onChange={e => { setFilterTipo(e.target.value); setAi(0); }}
            >
              <option value="">Todas as Cartas</option>
              {sTypes.map(t => <option key={t} value={t}>{CTYPES[t]?.label || t}</option>)}
            </select>

            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">Lista de Cartas</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filtered.map((l, i) => (
                <button
                  key={i}
                  onClick={() => setAi(i)}
                  className={`w-full text-left p-3 rounded-xl transition-all text-xs font-medium border ${
                    ai === i 
                      ? "bg-audit-gold/10 border-audit-gold text-audit-navy dark:text-audit-gold" 
                      : "bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                  }`}
                >
                  <div className="truncate font-bold">{l.nome}</div>
                  <div className="text-[10px] opacity-70 truncate">{l.empresa}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col h-[800px] bg-gray-100 dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-200 dark:border-gray-800 shadow-inner">
          <div className="bg-white dark:bg-audit-navy p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAi(Math.max(0, ai - 1))} 
                disabled={ai === 0}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                {ai + 1} de {filtered.length}
              </span>
              <button 
                onClick={() => setAi(Math.min(filtered.length - 1, ai + 1))}
                disabled={ai === filtered.length - 1}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-30"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex gap-2">
               <button onClick={() => xWordSingle(ed[globalIndex] || current.html, current.nome)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors" title="Exportar esta carta">
                  <FileText size={18} />
               </button>
               <button 
                  onClick={() => {
                    if (eRef.current) {
                      eRef.current.innerHTML = current.html;
                      setEd(prev => ({ ...prev, [globalIndex]: undefined }));
                    }
                  }} 
                  className="p-2 bg-gray-500/10 text-gray-500 rounded-lg hover:bg-gray-500/20 transition-colors"
                  title="Resetar edições"
               >
                  <RefreshCw size={18} />
               </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-200 dark:bg-gray-800/50">
            <div
              ref={eRef}
              contentEditable
              suppressContentEditableWarning
              onInput={() => {
                if (eRef.current) setEd(prev => ({ ...prev, [globalIndex]: eRef.current.innerHTML }));
              }}
              className="w-[210mm] min-h-[297mm] h-fit bg-white text-black shadow-2xl p-[20mm] origin-top focus:outline-none focus:ring-2 focus:ring-audit-gold"
            />
          </div>
        </div>
      </div>

      {currentSection && (
        <div className="fixed bottom-6 right-6 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-mono z-50 shadow-lg backdrop-blur-sm">
          {currentSection}
        </div>
      )}

      <FixedButtons onBack={onBack} />
    </div>
  );
}