// src/pages/circularizacao/components/Step4Produtos.jsx
import React from "react";
import { BANK_PRODS } from "../../../libs/letterTemplates.js";
import FixedButtons from "./FixedButtons";

export default function Step4Produtos({ bP, setBP, onNext, onBack, showToast }) {
  const totalSel = Object.values(bP).filter(Boolean).length;

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-audit-navy dark:text-white">Produtos Bancários a Confirmar</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Marque os produtos que a instituição deve confirmar. Listados automaticamente no corpo da carta.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-sm text-blue-700 dark:text-blue-300">
        ℹ️ Aplicado exclusivamente às cartas de Bancos.
      </div>

      {totalSel === 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-sm text-amber-700 dark:text-amber-300">
          ⚠ Nenhum produto selecionado. Recomenda-se marcar ao menos um para a carta bancária.
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(BANK_PRODS).map(([cat, produtos]) => {
          const allSelected = produtos.every((p) => bP[p.id]);
          return (
            <div key={cat} className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm bg-white dark:bg-gray-800/50">
              <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                <h3 className="font-semibold text-audit-navy dark:text-white">{cat}</h3>
                <button
                  className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => {
                    const updated = { ...bP };
                    produtos.forEach((p) => (updated[p.id] = !allSelected));
                    setBP(updated);
                  }}
                >
                  {allSelected ? "Desmarcar" : "Selecionar todos"}
                </button>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {produtos.map((p) => (
                  <label key={p.id} className="flex items-start gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <input
                      type="checkbox"
                      checked={!!bP[p.id]}
                      onChange={(e) => setBP((prev) => ({ ...prev, [p.id]: e.target.checked }))}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="font-medium text-sm text-audit-navy dark:text-white">{p.l}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{p.f}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <strong>{totalSel}</strong> produto(s) selecionado(s)
      </div>

      <FixedButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}