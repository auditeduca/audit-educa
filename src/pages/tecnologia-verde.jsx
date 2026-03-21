import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicLinks from '../components/TopicLinks';
import Toast from '../components/ui/Toast';
import BackgroundImage from '../components/BackgroundImage';
import MeasuredDateBar from '../components/MeasuredDateBar';
import ShareSidebar from '../components/ShareSidebar';

export default function TecnologiaVerde() {
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

    const sections = ['hero', 'pilares', 'implementacao', 'impacto'];
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
    { id: 'hero', label: 'Introdução' },
    { id: 'pilares', label: 'Três Pilares' },
    { id: 'implementacao', label: 'Implementação' },
    { id: 'impacto', label: 'Impacto' }
  ];

  const pilares = [
    {
      titulo: 'Pré-Renderização',
      icone: 'fa-flash',
      desc: 'HTML nasce pronto. Servidor apenas entrega arquivos.',
      beneficio: 'Zero processamento em tempo real'
    },
    {
      titulo: 'Clean Code',
      icone: 'fa-broom',
      desc: 'Código customizado, sem bibliotecas pesadas (bloatware).',
      beneficio: 'Processamento em milissegundos'
    },
    {
      titulo: 'Otimização de Ativos',
      icone: 'fa-compress',
      desc: 'WebP/AVIF + Lazy Loading de imagens.',
      beneficio: '80% menor tamanho, download sob demanda'
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
                Tecnologia Verde
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
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80"
                  opacity={10}
                />

                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 z-0"></div>

                <div className="relative z-10 p-8 md:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-1 w-8 bg-white rounded-full"></div>
                    <span className="text-white font-bold text-xs uppercase tracking-[0.15em]">
                      Sustentabilidade Digital
                    </span>
                  </div>

                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Tecnologia <span className="block sm:inline">Verde</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-100 leading-relaxed mb-8 max-w-2xl font-light">
                    Uma arquitetura de baixo carbono, construída com código limpo e otimização obrigatória em cada pixel.
                  </p>

                  {/* METADATA */}
                  <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-leaf text-white text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-white/70 uppercase tracking-wider font-bold">
                          Pegada
                        </span>
                        <span className="text-white font-semibold">Reduzida em 80%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-bolt text-white text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-white/70 uppercase tracking-wider font-bold">
                          Performance
                        </span>
                        <span className="text-white font-semibold">Maxima</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-globe text-white text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-white/70 uppercase tracking-wider font-bold">
                          Certificado
                        </span>
                        <span className="text-white font-semibold">Green Web</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* SHARE SIDEBAR */}
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm mb-8">
                <ShareSidebar
                  title="Tecnologia Verde - Audit Educa"
                  url={typeof window !== 'undefined' ? window.location.href : 'https://auditeduca.com.br/tecnologia-verde'}
                />
              </div>

              {/* SEÇÃO 1: PILARES */}
              <section id="pilares" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Três Pilares Fundamentais
                  </h2>
                </div>

                <div className="space-y-6">
                  {pilares.map((pilar, i) => (
                    <article
                      key={i}
                      className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-green-500/40 hover:shadow-md transition-all"
                    >
                      <div className="flex gap-6 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                          <i className={`fas ${pilar.icone} text-xl`}></i>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-audit-navy mb-2">{pilar.titulo}</h3>
                          <p className="text-slate-600 leading-relaxed font-light">{pilar.desc}</p>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                        <p className="text-sm text-green-900">
                          <strong>Benefício:</strong> {pilar.beneficio}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* SEÇÃO 2: IMPLEMENTAÇÃO */}
              <section id="implementacao" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Como Implementamos
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <article className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                    <h3 className="font-bold text-audit-navy mb-3 flex items-center gap-2">
                      <i className="fas fa-code text-green-500"></i>
                      WebP & AVIF
                    </h3>
                    <p className="text-slate-600 text-sm font-light">
                      Imagens 80% menores sem perda de qualidade visual, carregadas apenas quando necessárias.
                    </p>
                  </article>

                  <article className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                    <h3 className="font-bold text-audit-navy mb-3 flex items-center gap-2">
                      <i className="fas fa-hourglass text-green-500"></i>
                      Lazy Loading
                    </h3>
                    <p className="text-slate-600 text-sm font-light">
                      Imagens só são baixadas quando entram no seu campo de visão, economizando banda.
                    </p>
                  </article>

                  <article className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                    <h3 className="font-bold text-audit-navy mb-3 flex items-center gap-2">
                      <i className="fas fa-microchip text-green-500"></i>
                      Zero Processamento
                    </h3>
                    <p className="text-slate-600 text-sm font-light">
                      Pré-compilação em tempo de build. Servidor apenas entrega arquivos estáticos.
                    </p>
                  </article>

                  <article className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                    <h3 className="font-bold text-audit-navy mb-3 flex items-center gap-2">
                      <i className="fas fa-database text-green-500"></i>
                      Sem Banco de Dados
                    </h3>
                    <p className="text-slate-600 text-sm font-light">
                      Zero queries durante o acesso. Conteúdo fixo, entregue em microsegundos.
                    </p>
                  </article>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                  <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                    <i className="fas fa-leaf text-green-600"></i>
                    Resultado Final
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">80%</p>
                      <p className="text-sm text-green-800">Redução de Carbono</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">60ms</p>
                      <p className="text-sm text-green-800">Time to Interactive</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">A+</p>
                      <p className="text-sm text-green-800">Green Web Badge</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SEÇÃO 3: IMPACTO */}
              <section id="impacto" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Impacto Ambiental
                  </h2>
                </div>

                <article className="bg-white p-8 rounded-2xl border border-slate-200 mb-6">
                  <h3 className="text-lg font-bold text-audit-navy mb-4">Comparativo: Audit Educa vs Sites Tradicionais</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-slate-200">
                          <th className="text-left py-3 px-4 font-bold text-audit-navy">Métrica</th>
                          <th className="text-left py-3 px-4 font-bold text-red-600">Site Tradicional</th>
                          <th className="text-left py-3 px-4 font-bold text-green-600">Audit Educa</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="py-3 px-4 font-semibold">Processamento</td>
                          <td className="py-3 px-4">On-the-fly (CPU alta)</td>
                          <td className="py-3 px-4">Build Time (Zero CPU)</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-3 px-4 font-semibold">Banco de Dados</td>
                          <td className="py-3 px-4">Queries constantes</td>
                          <td className="py-3 px-4">Zero consultas</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-3 px-4 font-semibold">Tamanho JS/CSS</td>
                          <td className="py-3 px-4">500+ KB</td>
                          <td className="py-3 px-4">80 KB</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold">Pegada de Carbono</td>
                          <td className="py-3 px-4">8.5g CO2/visit</td>
                          <td className="py-3 px-4">0.2g CO2/visit</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </article>

                <div className="grid sm:grid-cols-2 gap-6">
                  <article className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <i className="fas fa-tree text-green-600"></i>
                      Para o Planeta
                    </h3>
                    <ul className="space-y-2 text-sm text-green-800 font-light">
                      <li>• Menos consumo de energia</li>
                      <li>• Redução de emissões</li>
                      <li>• Servidores mais eficientes</li>
                      <li>• Vida útil de dispositivos</li>
                    </ul>
                  </article>

                  <article className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <i className="fas fa-user text-blue-600"></i>
                      Para Você
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800 font-light">
                      <li>• Carregamento ultrarrápido</li>
                      <li>• Menos consumo de dados</li>
                      <li>• Compatível com conexões lentas</li>
                      <li>• Economia de bateria</li>
                    </ul>
                  </article>
                </div>
              </section>

              {/* CTA FINAL */}
              <article className="bg-audit-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg mb-16">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                    Juntos por um Planeta Melhor
                  </h3>
                  <p className="text-slate-200 mb-6 max-w-2xl font-light">
                    Cada acesso ao Audit Educa é um ato de sustentabilidade digital. Educação de qualidade sem custos ambientais.
                  </p>
                  <Link
                    to="/politica-acessibilidade"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-heart text-sm"></i>
                    Ver Nossa Política de Acessibilidade
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

              {/* CERTIFICAÇÃO GREEN WEB */}
              <article className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-certificate text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900">Green Web Badge</h3>
                    <p className="text-xs text-green-700">Certificado de sustentabilidade</p>
                  </div>
                </div>
                <p className="text-green-800 text-sm font-light leading-relaxed">
                  Audit Educa é hospedado em servidores com energia 100% renovável e certificado como website sustentável.
                </p>
              </article>

              {/* PEGADA DE CARBONO */}
              <article className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-chart-pie text-green-500"></i>
                  Pegada de Carbono
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-audit-navy">Site Tradicional</span>
                      <span className="text-xs font-bold text-red-600">8.5g CO2</span>
                    </div>
                    <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-red-500"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-audit-navy">Audit Educa</span>
                      <span className="text-xs font-bold text-green-600">0.2g CO2</span>
                    </div>
                    <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
                      <div className="h-full w-1/12 bg-green-500"></div>
                    </div>
                  </div>
                </div>
              </article>

              {/* RECURSOS */}
              <article className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-book text-green-500"></i>
                  Aprenda Mais
                </h3>
                <div className="space-y-3 text-sm">
                  <a href="#" onClick={() => showToast('Redirecionando...')} className="block p-3 bg-white rounded-lg hover:bg-green-50 transition border border-transparent hover:border-green-200">
                    <p className="font-semibold text-audit-navy">Green Web Hosting</p>
                    <p className="text-xs text-slate-600">Servidores sustentáveis</p>
                  </a>
                  <a href="#" onClick={() => showToast('Redirecionando...')} className="block p-3 bg-white rounded-lg hover:bg-green-50 transition border border-transparent hover:border-green-200">
                    <p className="font-semibold text-audit-navy">Pegada de Carbono</p>
                    <p className="text-xs text-slate-600">Medições em tempo real</p>
                  </a>
                </div>
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