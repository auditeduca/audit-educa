import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicLinks from '../components/TopicLinks';
import Toast from '../components/ui/Toast';
import BackgroundImage from '../components/BackgroundImage';
import MeasuredDateBar from '../components/MeasuredDateBar';
import ShareSidebar from '../components/ShareSidebar';

export default function RelatorioImpacto() {
  const [toastMessage, setToastMessage] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [headerHeight, setHeaderHeight] = useState(80);
  const [dateBarHeight, setDateBarHeight] = useState(40);
  const [activeTopic, setActiveTopic] = useState(null);

  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight || 80);
      }
    };
    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) resizeObserver.observe(headerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const paddingExtraDateBar = 0;
  const totalTopOffset = headerHeight + dateBarHeight + paddingExtraDateBar;
  const contentPaddingTop = headerHeight;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${totalTopOffset + 24}px 0px -60% 0px`,
      }
    );

    const sections = ['hero', 'esg', 'metricas', 'impacto'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [totalTopOffset]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetPosition =
        element.getBoundingClientRect().top + window.pageYOffset - totalTopOffset - 24;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const sectionsList = [
    { id: 'hero', label: 'Transparência' },
    { id: 'esg', label: 'Pilares ESG' },
    { id: 'metricas', label: 'Métricas' },
    { id: 'impacto', label: 'Impacto Social' }
  ];

  const pilares = [
    {
      titulo: 'Environmental',
      icone: 'fa-leaf',
      desc: 'Pegada de carbono reduzida, energia renovável, otimização de recursos'
    },
    {
      titulo: 'Social',
      icone: 'fa-users',
      desc: 'Educação inclusiva, acessibilidade AAA, comunidade global'
    },
    {
      titulo: 'Governance',
      icone: 'fa-gavel',
      desc: 'Transparência total, conformidade LGPD, auditoria independente'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* HEADER */}
      <div ref={headerRef} className="z-50 relative bg-white">
        <Header />
      </div>

      {/* DATEBAR */}
      <div 
        className="sticky w-full z-40 py-4 bg-white border-b border-slate-200 transition-all duration-300"
        style={{ top: headerHeight }}
      >
        <MeasuredDateBar
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
          onHeightChange={setDateBarHeight}
        />
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main
        className="flex-grow pb-10 px-4 sm:px-6 transition-all duration-300"
        style={{ paddingTop: contentPaddingTop }}
      >
        <div className="max-w-7xl mx-auto content-wrapper">
          
          {/* BREADCRUMB */}
          <nav
            className="pt-6 mb-0 no-print flex text-xs sm:text-sm font-semibold text-slate-500 tracking-normal"
            aria-label="Navegação de localização"
          >
            <ol className="flex items-center gap-3 flex-wrap">
              <li>
                <Link
                  to="/"
                  className="hover:text-audit-gold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-audit-gold/50 rounded px-1"
                >
                  Home
                </Link>
              </li>
              <li className="text-slate-300" aria-hidden="true">
                <i className="fas fa-chevron-right text-xs"></i>
              </li>
              <li>
                <span className="text-slate-600">Institucional</span>
              </li>
              <li className="text-slate-300" aria-hidden="true">
                <i className="fas fa-chevron-right text-xs"></i>
              </li>
              <li className="text-audit-gold font-bold" aria-current="page">
                Relatório de Impacto
              </li>
            </ol>
          </nav>

          {/* GRID DE CONTEÚDO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* COLUNA ESQUERDA - CONTEÚDO PRINCIPAL */}
            <div className="lg:col-span-8 xl:col-span-8">
              
              {/* HERO SECTION */}
              <article
                id="hero"
                className="bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden rounded-3xl shadow-lg mb-8 group"
              >
                <BackgroundImage
                  src="https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80"
                  opacity={10}
                />

                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 z-0"></div>

                <div className="relative z-10 p-8 md:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-1 w-8 bg-white rounded-full"></div>
                    <span className="text-white font-bold text-xs uppercase tracking-[0.15em]">
                      Transparência ESG Digital
                    </span>
                  </div>

                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Relatório de <span className="block sm:inline">Impacto</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-100 leading-relaxed mb-8 max-w-2xl font-light">
                    Transparência arquitetônica baseada em frameworks reconhecidos. Nosso compromisso com sustentabilidade, inclusão e integridade.
                  </p>

                  {/* METADATA */}
                  <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-file-pdf text-white text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-white/70 uppercase tracking-wider font-bold">
                          Formato
                        </span>
                        <span className="text-white font-semibold">Anual (2024-2025)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-check-circle text-white text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-white/70 uppercase tracking-wider font-bold">
                          Auditado
                        </span>
                        <span className="text-white font-semibold">Independentemente</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-globe text-white text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-white/70 uppercase tracking-wider font-bold">
                          Padrão
                        </span>
                        <span className="text-white font-semibold">GRI Standards</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* SHARE SIDEBAR */}
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm mb-8">
                <ShareSidebar
                  title="Relatório de Impacto - Audit Educa"
                  url={typeof window !== 'undefined' ? window.location.href : 'https://auditeduca.com.br/relatorio-impacto'}
                />
              </div>

              {/* SEÇÃO 1: PILARES ESG */}
              <section id="esg" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Pilares ESG
                  </h2>
                </div>

                <div className="space-y-6">
                  {pilares.map((pilar, i) => (
                    <article
                      key={i}
                      className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-emerald-500/40 hover:shadow-md transition-all"
                    >
                      <div className="flex gap-6 items-start mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                          <i className={`fas ${pilar.icone} text-xl`}></i>
                        </div>
                        <h3 className="text-2xl font-bold text-audit-navy flex-1">{pilar.titulo}</h3>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-light">{pilar.desc}</p>
                    </article>
                  ))}
                </div>
              </section>

              {/* SEÇÃO 2: MÉTRICAS */}
              <section id="metricas" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Métricas 2024-2025
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <article className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-200">
                    <h3 className="font-bold text-emerald-900 mb-4 text-lg flex items-center gap-2">
                      <i className="fas fa-leaf text-emerald-600"></i>
                      Environmental
                    </h3>
                    <ul className="space-y-2 text-sm text-emerald-800 font-light">
                      <li>• Pegada de carbono: 0.1g CO2/visita</li>
                      <li>• Energia renovável: 100%</li>
                      <li>• Redução de emissões: 80%</li>
                      <li>• Certificação Green Web</li>
                    </ul>
                  </article>

                  <article className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-4 text-lg flex items-center gap-2">
                      <i className="fas fa-users text-blue-600"></i>
                      Social
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800 font-light">
                      <li>• Alunos capacitados: 50.000+</li>
                      <li>• Acessibilidade: WCAG 2.1 AAA</li>
                      <li>• Parcerias: 8 instituições</li>
                      <li>• Satisfação: 4.8/5.0</li>
                    </ul>
                  </article>

                  <article className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-200">
                    <h3 className="font-bold text-purple-900 mb-4 text-lg flex items-center gap-2">
                      <i className="fas fa-gavel text-purple-600"></i>
                      Governance
                    </h3>
                    <ul className="space-y-2 text-sm text-purple-800 font-light">
                      <li>• LGPD: 100% conformidade</li>
                      <li>• Auditoria: Anual independente</li>
                      <li>• Transparência: 24/7</li>
                      <li>• Compliance: Zero incidentes</li>
                    </ul>
                  </article>

                  <article className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-200">
                    <h3 className="font-bold text-amber-900 mb-4 text-lg flex items-center gap-2">
                      <i className="fas fa-chart-line text-amber-600"></i>
                      Crescimento
                    </h3>
                    <ul className="space-y-2 text-sm text-amber-800 font-light">
                      <li>• Crescimento anual: +65%</li>
                      <li>• Retenção: 92%</li>
                      <li>• NPS: 68 (Excelente)</li>
                      <li>• Alcance: 15 países</li>
                    </ul>
                  </article>
                </div>
              </section>

              {/* SEÇÃO 3: IMPACTO SOCIAL */}
              <section id="impacto" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Impacto Social
                  </h2>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 mb-6">
                  <h3 className="font-bold text-audit-navy mb-6 text-lg">Histórias de Sucesso</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                      <div>
                        <p className="font-semibold text-audit-navy">Maria Silva - Certificação CFC</p>
                        <p className="text-sm text-slate-600 font-light">Passou no exame de suficiência após 3 meses estudando no Audit Educa. Hoje é auditora independente.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                      <div>
                        <p className="font-semibold text-audit-navy">João Costa - Transição de Carreira</p>
                        <p className="text-sm text-slate-600 font-light">Saiu da área fiscal e conseguiu vaga como auditor após aprender contabilidade avançada conosco.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                      <div>
                        <p className="font-semibold text-audit-navy">Universidade XYZ - Parceria</p>
                        <p className="text-sm text-slate-600 font-light">Integrou nossa plataforma no currículo, alcançando 500+ alunos por semestre.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <article className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
                  <h3 className="font-bold text-emerald-900 mb-4">Nossa Visão 2030</h3>
                  <p className="text-emerald-800 leading-relaxed font-light">
                    Capacitar 1 milhão de profissionais contábeis em todo o mundo. Eliminar barreiras de acesso à educação técnica de qualidade. Tornar a auditoria e contabilidade uma profissão inclusiva, sustentável e altamente valorizada.
                  </p>
                </article>
              </section>

              {/* CTA FINAL */}
              <article className="bg-audit-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg mb-16">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                    Baixe o Relatório Completo
                  </h3>
                  <p className="text-slate-200 mb-6 max-w-2xl font-light">
                    Acesse o documento PDF com todas as métricas, análises e certificações auditadas.
                  </p>
                  <button
                    onClick={() => showToast('Download iniciado')}
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-download text-sm"></i>
                    Download PDF 2024-2025
                  </button>
                </div>
              </article>
            </div>

            {/* COLUNA DIREITA - SIDEBAR */}
            <aside className="lg:col-span-4 xl:col-span-4 space-y-8">
              
              {/* ÍNDICE NESTA PÁGINA */}
              <div
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky z-20 transition-all duration-300"
                style={{ top: totalTopOffset + 24 }}
                role="navigation"
                aria-label="Índice da página"
              >
                <h3 className="text-xs font-black text-audit-navy uppercase tracking-[0.2em] mb-5 pb-4 border-b-2 border-slate-100 flex items-center gap-2">
                  <i className="fas fa-list text-emerald-500"></i>
                  <span>Nesta Página</span>
                </h3>
                <nav className="flex flex-col gap-4">
                  {sectionsList.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className={`text-sm font-semibold transition-all flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded px-2 py-1 ${
                        activeSection === item.id
                          ? 'text-audit-navy'
                          : 'text-slate-500 hover:text-audit-navy'
                      }`}
                      aria-current={activeSection === item.id ? 'location' : undefined}
                    >
                      <span
                        className={`h-1 transition-all duration-300 rounded-full ${
                          activeSection === item.id
                            ? 'w-6 bg-emerald-500'
                            : 'w-0 bg-emerald-500 group-hover:w-6'
                        }`}
                      ></span>
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* CERTIFICAÇÕES */}
              <article className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-200">
                <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-award text-emerald-600"></i>
                  Certificações
                </h3>
                <div className="space-y-3 text-sm text-emerald-800 font-light">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-emerald-600"></i>
                    <span>GRI Standards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-emerald-600"></i>
                    <span>Green Web Badge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-emerald-600"></i>
                    <span>WCAG 2.1 AAA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-emerald-600"></i>
                    <span>LGPD Compliant</span>
                  </div>
                </div>
              </article>

              {/* CONTATO SUSTENTABILIDADE */}
              <article className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-envelope text-emerald-500"></i>
                  Sustentabilidade
                </h3>
                <p className="text-sm text-slate-600 font-light mb-4">
                  Tem sugestões sobre nosso impacto ambiental ou social?
                </p>
                <a
                  href="mailto:sustentabilidade@auditeduca.com.br"
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition flex items-center gap-2"
                >
                  <i className="fas fa-arrow-right text-xs"></i>
                  sustentabilidade@auditeduca.com.br
                </a>
              </article>

              {/* PRÓXIMOS PASSOS */}
              <article className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-roadmap text-emerald-500"></i>
                  Próximos Passos
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 font-light">
                  <li>• Relatório 2026 em desenvolvimento</li>
                  <li>• Auditoria independente em progresso</li>
                  <li>• Novos indicadores sociais</li>
                  <li>• Expansão para 20 países</li>
                </ul>
              </article>
            </aside>
          </div>

          {/* TÓPICOS RELACIONADOS */}
          <section
            className="mt-16 w-full bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm"
            aria-labelledby="related-topics"
          >
            <h2 id="related-topics" className="sr-only">
              Tópicos Relacionados
            </h2>
            <TopicLinks />
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
      
      {/* Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}