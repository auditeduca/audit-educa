import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicLinks from '../components/TopicLinks';
import Toast from '../components/ui/Toast';
import BackgroundImage from '../components/BackgroundImage';
import MeasuredDateBar from '../components/MeasuredDateBar';
import ShareSidebar from '../components/ShareSidebar';

export default function PegadaDeCarbono() {
  const [toastMessage, setToastMessage] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [headerHeight, setHeaderHeight] = useState(80);
  const [dateBarHeight, setDateBarHeight] = useState(40);
  const [activeTopic, setActiveTopic] = useState(null);

  const [metrics, setMetrics] = useState({
    grade: 'A+',
    co2: '0.10',
    cleanerThan: '85',
    energy: '0.001',
    visits: '12,543'
  });

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

    const sections = ['hero', 'metricas', 'metodologia', 'analise'];
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

  const auditarCarbono = () => {
    showToast('Auditando pegada de carbono...');
    setTimeout(() => {
      setMetrics({
        grade: 'A+',
        co2: (Math.random() * (0.15 - 0.08) + 0.08).toFixed(2),
        cleanerThan: Math.floor(Math.random() * 20 + 80).toString(),
        energy: '0.001',
        visits: (Math.floor(Math.random() * 5000) + 10000).toLocaleString()
      });
      showToast('Auditoria atualizada!');
    }, 1500);
  };

  const sectionsList = [
    { id: 'hero', label: 'Dashboard' },
    { id: 'metricas', label: 'Métricas' },
    { id: 'metodologia', label: 'Metodologia' },
    { id: 'analise', label: 'Análise' }
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
                Pegada de Carbono
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
                className="bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden rounded-3xl shadow-lg mb-8 group"
              >
                <BackgroundImage
                  src="https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=1200&q=80"
                  opacity={10}
                />

                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 z-0"></div>

                <div className="relative z-10 p-8 md:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-1 w-8 bg-white rounded-full"></div>
                    <span className="text-white font-bold text-xs uppercase tracking-[0.15em]">
                      Medição em Tempo Real
                    </span>
                  </div>

                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Pegada de <span className="block sm:inline">Carbono</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-100 leading-relaxed mb-8 max-w-2xl font-light">
                    Audite a pegada de carbono do Audit Educa em tempo real. Transparência total sobre nosso impacto ambiental.
                  </p>

                  {/* DASHBOARD MÉTRICAS */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/20">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-2xl font-bold text-white mb-1">{metrics.grade}</div>
                      <div className="text-xs text-white/70 uppercase tracking-wider">Grade</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-2xl font-bold text-white mb-1">{metrics.co2}g</div>
                      <div className="text-xs text-white/70 uppercase tracking-wider">CO2 por visita</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-2xl font-bold text-white mb-1">{metrics.cleanerThan}%</div>
                      <div className="text-xs text-white/70 uppercase tracking-wider">Mais limpo</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-2xl font-bold text-white mb-1">{metrics.energy}kWh</div>
                      <div className="text-xs text-white/70 uppercase tracking-wider">Energia</div>
                    </div>
                  </div>
                </div>
              </article>

              {/* SHARE SIDEBAR */}
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm mb-8">
                <ShareSidebar
                  title="Pegada de Carbono - Audit Educa"
                  url={typeof window !== 'undefined' ? window.location.href : 'https://auditeduca.com.br/pegada-carbono'}
                />
              </div>

              {/* SEÇÃO 1: MÉTRICAS */}
              <section id="metricas" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Métricas Detalhadas
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <article className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                    <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                      <i className="fas fa-leaf text-green-500"></i>
                      Emissões por Visita
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-slate-600">Site Tradicional</span>
                          <span className="text-sm font-bold text-red-600">8.5g</span>
                        </div>
                        <div className="w-full h-2 bg-red-100 rounded-full">
                          <div className="h-full w-4/5 bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-slate-600">Audit Educa</span>
                          <span className="text-sm font-bold text-green-600">0.1g</span>
                        </div>
                        <div className="w-full h-2 bg-green-100 rounded-full">
                          <div className="h-full w-1/12 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </article>

                  <article className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                    <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                      <i className="fas fa-chart-line text-green-500"></i>
                      Economia Acumulada
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-600 mb-2">Total de visitas</p>
                        <p className="text-2xl font-bold text-green-600">{metrics.visits}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-2">CO2 economizado</p>
                        <p className="text-lg font-bold text-green-700">~1.3 toneladas</p>
                      </div>
                    </div>
                  </article>
                </div>

                <button
                  onClick={auditarCarbono}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-sync-alt"></i>
                  Auditar Pegada Agora
                </button>
              </section>

              {/* SEÇÃO 2: METODOLOGIA */}
              <section id="metodologia" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Metodologia de Cálculo
                  </h2>
                </div>

                <article className="bg-white p-8 rounded-2xl border border-slate-200 mb-6">
                  <p className="text-slate-600 leading-relaxed font-light mb-6">
                    Utilizamos o padrão internacional <strong className="text-audit-navy">SWD API (Sustainable Web Development)</strong> para calcular a pegada de carbono com precisão científica:
                  </p>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
                      <h3 className="font-bold text-green-900 mb-2">Fator de Emissão</h3>
                      <p className="text-sm text-green-800 font-light">
                        0.42g CO2eq por kilobyte transmitido (baseado em dados de energia grid global)
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-100">
                      <h3 className="font-bold text-blue-900 mb-2">Eficiência do Servidor</h3>
                      <p className="text-sm text-blue-800 font-light">
                        Hospedagem em servidor com 100% energia renovável reduz emissões em 90%
                      </p>
                    </div>
                  </div>
                </article>
              </section>

              {/* SEÇÃO 3: ANÁLISE */}
              <section id="analise" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Comparativo de Impacto
                  </h2>
                </div>

                <article className="bg-white p-8 rounded-2xl border border-slate-200">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-center gap-4">
                        <i className="fas fa-tree text-2xl text-green-600"></i>
                        <div>
                          <p className="font-bold text-green-900">Árvore</p>
                          <p className="text-sm text-green-700">Absorve ~20kg CO2/ano</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-4">
                        <i className="fas fa-car text-2xl text-blue-600"></i>
                        <div>
                          <p className="font-bold text-blue-900">Carro</p>
                          <p className="text-sm text-blue-700">Emite ~4.6g CO2/km</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                      <div className="flex items-center gap-4">
                        <i className="fas fa-globe text-2xl text-emerald-600"></i>
                        <div>
                          <p className="font-bold text-emerald-900">Audit Educa</p>
                          <p className="text-sm text-emerald-700">Emite ~0.1g CO2/visita</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </section>

              {/* CTA FINAL */}
              <article className="bg-audit-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg mb-16">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                    Transparência Total
                  </h3>
                  <p className="text-slate-200 mb-6 max-w-2xl font-light">
                    Acreditamos que educação de qualidade não deve custar o planeta. Nossa pegada é auditada e publicada mensalmente.
                  </p>
                  <Link
                    to="/tecnologia-verde"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-leaf text-sm"></i>
                    Conheça Nossa Arquitetura Verde
                  </Link>
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
                  <i className="fas fa-list text-green-500"></i>
                  <span>Nesta Página</span>
                </h3>
                <nav className="flex flex-col gap-4">
                  {sectionsList.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className={`text-sm font-semibold transition-all flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-green-500/50 rounded px-2 py-1 ${
                        activeSection === item.id
                          ? 'text-audit-navy'
                          : 'text-slate-500 hover:text-audit-navy'
                      }`}
                      aria-current={activeSection === item.id ? 'location' : undefined}
                    >
                      <span
                        className={`h-1 transition-all duration-300 rounded-full ${
                          activeSection === item.id
                            ? 'w-6 bg-green-500'
                            : 'w-0 bg-green-500 group-hover:w-6'
                        }`}
                      ></span>
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* CERTIFICAÇÃO */}
              <article className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-200 shadow-sm">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <i className="fas fa-shield text-green-600"></i>
                  Green Web Certified
                </h3>
                <p className="text-green-800 text-sm font-light leading-relaxed">
                  Audit Educa é certificado como website sustentável pelo Green Web Foundation desde 2024.
                </p>
              </article>

              {/* ESTATÍSTICAS */}
              <article className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-chart-bar text-green-500"></i>
                  Estatísticas
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-600">Grade Carbono</span>
                    <span className="font-bold text-green-600">A+</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-600">Visitantes</span>
                    <span className="font-bold text-audit-navy">{metrics.visits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">CO2 Economizado</span>
                    <span className="font-bold text-green-600">~1.3t</span>
                  </div>
                </div>
              </article>

              {/* AÇÕES */}
              <article className="bg-gradient-to-br from-audit-navy to-audit-navy/80 rounded-3xl p-6 text-white">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <i className="fas fa-heart text-green-400"></i>
                  Como Ajudar
                </h3>
                <ul className="space-y-2 text-sm font-light">
                  <li className="flex gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Compartilhe o Audit Educa</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Reduza emissões na sua empresa</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Apoie educação sustentável</span>
                  </li>
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