// src/pages/circularizacao/components/Step1Setup.jsx
import React from "react";
import BackgroundImage from "../../../components/BackgroundImage";
import FixedButtons from "./FixedButtons";
import { ShieldCheck, BookOpen, Library, ChevronRight } from "lucide-react";

export default function Step1Setup({ onNext, showToast }) {
  // Audit resources data
  const resources = [
    {
      title: "Procedimentos de Auditoria de Bibliotecas",
      icon: Library,
      description: "Guia prático para validação de saldos e transações com terceiros.",
      link: "#",
    },
    {
      title: "Guia de Bolso – Circularização",
      icon: BookOpen,
      description: "Resumo rápido dos procedimentos conforme NBC TA 505 / ISA 505.",
      link: "#",
    },
  ];

  return (
    <>
      <div className="grid lg:grid-cols-12 gap-8 pb-32 animate-in fade-in duration-500">
        {/* Left hero section */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-[2rem] bg-audit-navy text-white p-10 md:p-16 shadow-2xl h-full flex flex-col justify-center min-h-[400px]">
            <BackgroundImage
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"
              opacity={10}
            />
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm font-medium">
                <ShieldCheck size={16} className="text-audit-gold" />
                <span>Normas NBC TA 505 / ISA 505</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Assistente de <span className="text-audit-gold">Circularização</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
                Automatize o processo de confirmação externa com precisão técnica, 
                geração de documentos em lote e controle de evidências.
              </p>
            </div>
          </div>
        </div>

        {/* Right CTA section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-audit-navy/50 backdrop-blur-sm rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 p-8">
            <h3 className="text-lg font-bold text-audit-navy dark:text-white mb-4 flex items-center gap-3">
              <div className="p-2 bg-audit-gold/10 rounded-lg">
                <BookOpen size={20} className="text-audit-gold" />
              </div>
              Recursos de Auditoria
            </h3>
            <div className="space-y-4">
              {resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.link}
                  className="block group rounded-xl border border-gray-200 dark:border-gray-700 hover:border-audit-gold transition-all duration-200 bg-white dark:bg-gray-800/50 hover:shadow-md"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-audit-gold/10 transition-colors">
                        <resource.icon size={22} className="text-audit-navy dark:text-gray-300 group-hover:text-audit-gold" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {resource.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          {resource.description}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-audit-gold transition-colors" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
              Conteúdo alinhado às normas internacionais de auditoria.
            </p>
          </div>
        </div>
      </div>

      <FixedButtons onNext={onNext} />
    </>
  );
}