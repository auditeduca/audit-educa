// src/pages/circularizacao/components/Step2Tipo.jsx
import React from "react";
import { CTYPES } from "../../../libs/letterTemplates.js";
import FixedButtons from "./FixedButtons";
import { 
  Building2, 
  Users2, 
  Truck, 
  Package, 
  CreditCard, 
  FileCheck,
  CheckCircle2,
  Info
} from "lucide-react";

const ICON_MAP = {
  bancos: Building2,
  clientes: Users2,
  fornecedores: Truck,
  estoques: Package,
  advogados: FileCheck,
  "partes-relacionadas": Users2,
  custom: CreditCard
};

export default function Step2Tipo({ sTypes, setST, onNext, onBack }) {
  const toggleType = (key) => {
    if (sTypes.includes(key)) {
      setST(sTypes.filter((t) => t !== key));
    } else {
      setST([...sTypes, key]);
    }
  };

  return (
    <div className="space-y-8 pb-32 animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-extrabold text-audit-navy dark:text-white">
          O que vamos confirmar hoje?
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          Selecione os tipos de destinatários. Você pode gerar múltiplos tipos de cartas simultaneamente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(CTYPES).map(([key, tp]) => {
          const isSelected = sTypes.includes(key);
          const Icon = ICON_MAP[key] || FileCheck;
          
          return (
            <button
              key={key}
              onClick={() => toggleType(key)}
              className={`relative group text-left p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                isSelected
                  ? "border-audit-navy dark:border-audit-gold bg-audit-navy/5 dark:bg-audit-gold/5 shadow-xl scale-[1.02]"
                  : "border-gray-100 dark:border-gray-800 bg-white dark:bg-audit-navy/40 hover:border-gray-200 dark:hover:border-gray-700 shadow-sm"
              }`}
            >
              <div className={`inline-flex p-4 rounded-2xl mb-6 transition-colors ${
                isSelected ? "bg-audit-navy dark:bg-audit-gold text-white dark:text-audit-navy" : "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-audit-navy dark:group-hover:text-audit-gold"
              }`}>
                <Icon size={28} />
              </div>

              {isSelected && (
                <div className="absolute top-6 right-6 text-audit-navy dark:text-audit-gold animate-in zoom-in duration-300">
                  <CheckCircle2 size={24} fill="currentColor" className="text-white dark:text-audit-navy rounded-full" />
                </div>
              )}

              <h3 className={`text-xl font-bold mb-2 ${isSelected ? "text-audit-navy dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                {tp.label}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {tp.desc || `Confirmação de saldos e transações com ${tp.label?.toLowerCase()}.`}
              </p>
            </button>
          );
        })}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-6 flex gap-4">
        <div className="p-2 bg-blue-500/20 rounded-lg h-fit">
          <Info size={20} className="text-blue-500" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm">Dica de Auditoria</h4>
          <p className="text-sm text-blue-700/80 dark:text-blue-400/80 leading-relaxed">
            A seleção de múltiplos tipos criará grupos de edição distintos na etapa de revisão. 
            Recomendamos separar tipos bancários de comerciais devido à natureza dos anexos.
          </p>
        </div>
      </div>

      <FixedButtons onBack={onBack} onNext={onNext} disabledNext={sTypes.length === 0} />
    </div>
  );
}