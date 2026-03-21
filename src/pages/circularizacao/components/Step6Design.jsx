// src/pages/circularizacao/components/Step6Design.jsx
import React, { useState, useEffect } from "react";
import { DES_PRESETS } from "../../../libs/designPresets.js";
import FixedButtons from "./FixedButtons";
import A4PreviewWithThumbnail from "./A4PreviewWithThumbnail";
import { 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  Sparkles
} from "lucide-react";

export default function Step6Design({
  bP,
  setBP,
  sTypes,
  buildL,
  onNext,
  onBack,
  showToast,
  currentSection,
  setCurrentSection,
}) {
  const [designPreset, setDesignPreset] = useState("big4");
  const [accent, setAcc] = useState("#0C1B33");
  const [font, setFont] = useState("DM Sans");
  const [fs, setFs] = useState(12);
  const [lh, setLh] = useState(1.6);
  const [hs, setHs] = useState("solid");
  const [lpos, setLpos] = useState("left");
  const [lsz, setLsz] = useState(60);
  const [sTbl, setSTbl] = useState(true);
  const [conf, setConf] = useState(true);
  const [sNBC, setSNBC] = useState(true);
  const [logo, setLogo] = useState(null);
  const [previewType, setPreviewType] = useState(sTypes[0] || "bancos");
  const [showPreview, setShowPreview] = useState(true);

  // Gerar HTML do preview (exemplo simplificado)
  const previewHtml = buildL(previewType, {
    nome: "Entidade Exemplo",
    empresa: "Minha Empresa S.A.",
    cnpj: "12.345.678/0001-90",
    saldo: "R$ 4.500.230,00",
    accentColor: accent,
    fontSize: fs,
    lineHeight: lh,
    // outros dados necessários...
  });

  return (
    <div className="flex flex-col space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-audit-navy dark:text-white flex items-center gap-2">
            <Palette className="text-audit-gold" /> Identidade Visual
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Ajuste o aspeto gráfico da carta para alinhar com a marca da sua firma.
          </p>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium shadow-sm"
        >
          {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
          <span>{showPreview ? "Focar Design" : "Ver Resultado"}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Painel de Controlo */}
        <div className={`${showPreview ? "lg:col-span-4" : "lg:col-span-12"} space-y-6`}>
          <div className="bg-white dark:bg-audit-navy rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
              <Sparkles className="text-audit-gold" size={16} />
              <span className="text-xs font-bold uppercase tracking-widest text-audit-navy dark:text-white">Estilos Predefinidos</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {Object.keys(DES_PRESETS).map((p) => (
                <button
                  key={p}
                  onClick={() => setDesignPreset(p)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                    designPreset === p
                      ? "bg-audit-navy text-white border-audit-navy"
                      : "bg-white dark:bg-gray-800 text-gray-600 border-gray-200 dark:border-gray-700 hover:border-audit-gold"
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-audit-navy rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
             <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-3 block flex items-center gap-2">
                  <Type size={14} /> Tipografia e Cor
                </label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input 
                      type="color" 
                      value={accent} 
                      onChange={(e) => setAcc(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cor de Destaque</span>
                  </div>
                </div>
             </div>

             <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <label className="text-xs font-bold text-gray-400 uppercase mb-3 block flex items-center gap-2">
                  <ImageIcon size={14} /> Logótipo da Firma
                </label>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-audit-gold transition-colors cursor-pointer">
                  <ImageIcon className="mx-auto text-gray-300 mb-2" size={32} />
                  <p className="text-[10px] text-gray-500">Clique para carregar (PNG ou JPG)</p>
                </div>
             </div>
          </div>
        </div>

        {/* Preview com Thumbnail */}
        {showPreview && (
          <div className="lg:col-span-8 bg-gray-200 dark:bg-gray-950 rounded-3xl overflow-hidden border border-gray-300 dark:border-gray-800 p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pré-visualização (clique para expandir)</span>
              <div className="flex gap-2">
                {sTypes.map(t => (
                  <button 
                    key={t}
                    onClick={() => setPreviewType(t)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-lg transition-all ${
                      previewType === t ? "bg-audit-gold text-audit-navy scale-110" : "bg-white text-gray-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <A4PreviewWithThumbnail
                html={previewHtml}
                previewType={previewType}
                setCurrentSection={setCurrentSection}
              />
            </div>
          </div>
        )}
      </div>

      {/* Badge flutuante da seção atual */}
      {currentSection && (
        <div className="fixed bottom-6 right-6 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-mono z-50 shadow-lg backdrop-blur-sm">
          {currentSection}
        </div>
      )}

      <FixedButtons onBack={onBack} onNext={onNext} nextLabel="Finalizar e Gerar PDFs" />
    </div>
  );
}