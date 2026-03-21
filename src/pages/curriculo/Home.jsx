import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Download } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function CurriculoHome() {
  const navigate = useNavigate();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      const elements = mainRef.current.querySelectorAll('.animate-up');
      elements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.6s ease ${i * 0.1}s`;
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 50);
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main ref={mainRef} className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center relative z-10">
            <div className="animate-up mb-6">
              <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-100">
                Plataforma Aberta & Gratuita
              </span>
            </div>
            <h1 className="animate-up text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Gerador de Currículo <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">Profissional de Auditoria</span>
            </h1>
            <p className="animate-up text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed">
              Destaque-se no mercado de auditoria e contabilidade com currículos alinhados aos padrões internacionais e foco em competências técnicas (NBC/IFRS).
            </p>
            <div className="animate-up flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/curriculo/wizard')}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold px-10 py-4 rounded-xl shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2"
              >
                Começar Agora <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white border border-slate-200 text-slate-700 font-bold px-10 py-4 rounded-xl hover:bg-slate-50 transition-all">
                Ver Modelos
              </button>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-up bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Normas Técnicas</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Secções pré-configuradas para registos em ordens profissionais e competências em IFRS/NBC.</p>
            </div>
            <div className="animate-up bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Assistente IA</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Sugestões de competências em IA Agêntica e Data Analytics para o auditor moderno.</p>
            </div>
            <div className="animate-up bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Exportação Rápida</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Gere ficheiros PDF profissionais prontos para submissão em poucos minutos.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}