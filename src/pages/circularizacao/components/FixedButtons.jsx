// src/pages/circularizacao/components/FixedButtons.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FixedButtons({
  onBack,
  onNext,
  backLabel = "Voltar",
  nextLabel = "Próximo",
  disabledNext = false,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-audit-navy/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-lg py-4 px-4 md:px-8 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition-all active:scale-95"
          >
            <ChevronLeft size={18} />
            {backLabel}
          </button>
        ) : (
          <div />
        )}
        
        {onNext && (
          <button
            onClick={onNext}
            disabled={disabledNext}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-md ${
              disabledNext
                ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-audit-navy text-white hover:bg-audit-navy/90 dark:bg-audit-gold dark:text-audit-navy dark:hover:bg-audit-gold/90"
            }`}
          >
            {nextLabel}
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}