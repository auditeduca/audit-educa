// src/pages/circularizacao/components/Step3Textos.jsx
import React, { useState, useEffect } from "react";
import { TPLS, CTYPES } from "../../../libs/letterTemplates.js";
import FixedButtons from "./FixedButtons";
import A4PreviewWithThumbnail from "./A4PreviewWithThumbnail";
import { Eye, EyeOff, FileText, Info } from "lucide-react";

export default function Step3Textos({
  sTypes,
  selTpl,
  setSelTpl,
  customBody,
  setCustomBody,
  lang,
  buildL,
  onNext,
  onBack,
  showToast,
  currentSection,
  setCurrentSection,
}) {
  const [previewType, setPreviewType] = useState(sTypes[0] || "bancos");
  const [showPreview, setShowPreview] = useState(true);

  // Gerar HTML para o preview atual
  const previewHtml = buildL(previewType, {
    nome: "Exemplo de Entidade",
    empresa: "[Nome da Empresa Auditada]",
    cnpj: "00.000.000/0001-00",
    end: "Rua Exemplo, 123 - Cidade/UF",
    saldo: "1.250.000,00",
    data_base: "31/12/2023",
  });

  return (
    <div className="flex flex-col h-full space-y-6 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-audit-navy dark:text-white flex items-center gap-2">
            <FileText className="text-audit-gold" /> Configuração de Textos
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Personalize o conteúdo das cartas. O sistema gera automaticamente os parágrafos padrão da ISA 505.
          </p>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
          {showPreview ? "Ocultar Preview" : "Ver Preview"}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Painel esquerdo */}
        <div className={`${showPreview ? "lg:col-span-5" : "lg:col-span-12"} space-y-6`}>
          <div className="bg-white dark:bg-audit-navy border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Modelo Base</h3>
            <div className="grid grid-cols-1 gap-3">
              {Object.keys(TPLS).map((k) => (
                <button
                  key={k}
                  onClick={() => setSelTpl(k)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selTpl === k
                      ? "border-audit-gold bg-audit-gold/5 ring-1 ring-audit-gold"
                      : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="font-bold text-audit-navy dark:text-white capitalize">{k}</div>
                  <div className="text-xs text-gray-500 mt-1">Formato padrão recomendado pela firma.</div>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex gap-3">
            <Info className="text-amber-600 shrink-0" size={20} />
            <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
              Campos como {"{data_base}"}, {"{empresa}"} e {"{saldo}"} serão preenchidos automaticamente com os dados da etapa seguinte.
            </p>
          </div>
        </div>

        {/* Preview (thumbnail) */}
        {showPreview && (
          <div className="lg:col-span-7 flex flex-col items-center justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pré-visualização (clique para expandir)</span>
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                  {sTypes.map((t) => (
                    <button
                      key={t}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                        previewType === t
                          ? "bg-white dark:bg-audit-navy text-audit-navy dark:text-white shadow-sm"
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      }`}
                      onClick={() => setPreviewType(t)}
                    >
                      {t.slice(0, 8)}
                    </button>
                  ))}
                </div>
              </div>
              <A4PreviewWithThumbnail
                html={previewHtml}
                previewType={previewType}
                setCurrentSection={setCurrentSection}
              />
              <p className="text-[10px] text-gray-400 text-center mt-3 italic">
                A simulação acima utiliza dados fictícios para validação de layout.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Badge flutuante (usado também pelo modal) */}
      {currentSection && (
        <div className="fixed bottom-6 right-6 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-mono z-50 shadow-lg backdrop-blur-sm">
          {currentSection}
        </div>
      )}

      <FixedButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}