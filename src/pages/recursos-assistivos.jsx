import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicLinks from '../components/TopicLinks';
import Toast from '../components/ui/Toast';
import BackgroundImage from '../components/BackgroundImage';
import MeasuredDateBar from '../components/MeasuredDateBar';
import ShareSidebar from '../components/ShareSidebar';

export default function RecursosAssistivos() {
  const [toastMessage, setToastMessage] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [headerHeight, setHeaderHeight] = useState(80);
  const [dateBarHeight, setDateBarHeight] = useState(40);
  const [activeTopic, setActiveTopic] = useState(null);
  const [glossarioFiltro, setGlossarioFiltro] = useState('');

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

    const sections = ['hero', 'ferramentas', 'glossario', 'atalhos'];
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
    { id: 'ferramentas', label: 'Ferramentas' },
    { id: 'glossario', label: 'Glossário' },
    { id: 'atalhos', label: 'Atalhos' }
  ];

  const ferramentas = [
    {
      nome: 'NVDA',
      icone: 'fa-headphones',
      desc: 'Leitor de tela gratuito para Windows',
      link: 'https://www.nvaccess.org',
      tipo: 'tela'
    },
    {
      nome: 'JAWS',
      icone: 'fa-headphones',
      desc: 'Leitor de tela profissional (pago)',
      link: '#',
      tipo: 'tela'
    },
    {
      nome: 'Magnifier',
      icone: 'fa-magnifying-glass',
      desc: 'Ampliador de tela nativo do Windows',
      link: '#',
      tipo: 'visão'
    },
    {
      nome: 'Dragon NaturallySpeaking',
      icone: 'fa-microphone',
      desc: 'Comando por voz para PC',
      link: '#',
      tipo: 'voz'
    }
  ];

  const glossario = [
    { termo: 'AAA', definicao: 'Nível máximo de conformidade WCAG 2.1' },
    { termo: 'ARIA', definicao: 'Atributos para acessibilidade em HTML' },
    { termo: 'WCAG', definicao: 'Web Content Accessibility Guidelines' },
    { termo: 'Leitor de Tela', definicao: 'Software que lê conteúdo web em voz' },
    { termo: 'Navegação por Teclado', definicao: 'Interação sem uso de mouse' },
    { termo: 'Contraste', definicao: 'Diferença de cor entre texto e fundo' }
  ];

  const atalhos = [
    { tecla: 'Ctrl + Alt + Z', acao: 'Ativar leitor de tela' },
    { tecla: 'Tab', acao: 'Navegar para próximo elemento' },
    { tecla: 'Shift + Tab', acao: 'Navegar para elemento anterior' },
    { tecla: 'Enter', acao: 'Ativar link ou botão' },
    { tecla: 'Space', acao: 'Marcar checkbox' },
    { tecla: 'Escape', acao: 'Fechar modal ou menu' }
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
                Recursos Assistivos
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
                className="bg-gradient-to-br from-blue-600 to-cyan-700 relative overflow-hidden rounded-3xl shadow-lg mb-8 group"
              >
                <BackgroundImage
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
                  opacity={10}
                />

                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 z-0"></div>

                <div className="relative z-10 p-8 md:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-1 w-8 bg-white rounded-full"></div>
                    <span className="text-white font-bold text-xs uppercase tracking-[0.15em]">
                      Guia Prático
                    </span>
                  </div>

                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Recursos <span className="block sm:inline">Assistivos</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-100 leading-relaxed mb-8 max-w-2xl font-light">
                    Ferramentas e guias práticos para aproveitar ao máximo as tecnologias de acessibilidade.
                  </p>

                  {/* METADATA */}
                  <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-headphones text-white text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-white/70 uppercase tracking-wider font-bold">
                          Ferramentas
                        </span>
                        <span className="text-white font-semibold">10+ suportadas</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-keyboard text-white text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-white/70 uppercase tracking-wider font-bold">
                          Atalhos
                        </span>
                        <span className="text-white font-semibold">Teclado 100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* SHARE SIDEBAR */}
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm mb-8">
                <ShareSidebar
                  title="Recursos Assistivos - Audit Educa"
                  url={typeof window !== 'undefined' ? window.location.href : 'https://auditeduca.com.br/recursos-assistivos'}
                />
              </div>

              {/* SEÇÃO 1: FERRAMENTAS */}
              <section id="ferramentas" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Ferramentas Recomendadas
                  </h2>
                </div>

                <div className="space-y-4 mb-8">
                  {ferramentas.map((ferr, i) => (
                    <article
                      key={i}
                      className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500/40 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4 flex-1">
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                            <i className={`fas ${ferr.icone}`}></i>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-audit-navy text-lg mb-1">{ferr.nome}</h3>
                            <p className="text-slate-600 text-sm font-light">{ferr.desc}</p>
                          </div>
                        </div>
                        <a
                          href={ferr.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all text-sm whitespace-nowrap"
                        >
                          Acessar
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* SEÇÃO 2: GLOSSÁRIO */}
              <section id="glossario" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Glossário Técnico
                  </h2>
                </div>

                <div className="mb-6">
                  <input
                    type="search"
                    placeholder="Buscar termo..."
                    value={glossarioFiltro}
                    onChange={(e) => setGlossarioFiltro(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {glossario
                    .filter(g => g.termo.toLowerCase().includes(glossarioFiltro.toLowerCase()))
                    .map((item, i) => (
                      <article key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                        <h3 className="font-bold text-audit-navy text-lg mb-2">{item.termo}</h3>
                        <p className="text-slate-600 text-sm font-light">{item.definicao}</p>
                      </article>
                    ))}
                </div>
              </section>

              {/* SEÇÃO 3: ATALHOS */}
              <section id="atalhos" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Atalhos de Teclado
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-200 bg-slate-50">
                        <th className="text-left py-4 px-4 font-bold text-audit-navy">Tecla</th>
                        <th className="text-left py-4 px-4 font-bold text-audit-navy">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {atalhos.map((item, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <code className="bg-slate-100 px-3 py-1 rounded-lg font-mono font-semibold text-audit-navy text-xs">
                              {item.tecla}
                            </code>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-light">{item.acao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* CTA FINAL */}
              <article className="bg-audit-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg mb-16">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                    Tem Dúvidas?
                  </h3>
                  <p className="text-slate-200 mb-6 max-w-2xl font-light">
                    Nossa equipe está sempre disponível para ajudar com sugestões e melhorias de acessibilidade.
                  </p>
                  <a
                    href="mailto:acessibilidade@auditeduca.com.br"
                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-envelope text-sm"></i>
                    Enviar Email
                  </a>
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
                  <i className="fas fa-list text-blue-500"></i>
                  <span>Nesta Página</span>
                </h3>
                <nav className="flex flex-col gap-4">
                  {sectionsList.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className={`text-sm font-semibold transition-all flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-2 py-1 ${
                        activeSection === item.id
                          ? 'text-audit-navy'
                          : 'text-slate-500 hover:text-audit-navy'
                      }`}
                      aria-current={activeSection === item.id ? 'location' : undefined}
                    >
                      <span
                        className={`h-1 transition-all duration-300 rounded-full ${
                          activeSection === item.id
                            ? 'w-6 bg-blue-500'
                            : 'w-0 bg-blue-500 group-hover:w-6'
                        }`}
                      ></span>
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* BAIXAR GUIA */}
              <article className="bg-blue-50 rounded-3xl p-6 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-download text-blue-600"></i>
                  Recursos em PDF
                </h3>
                <button
                  onClick={() => showToast('Download iniciado')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm mb-2"
                >
                  Guia Completo
                </button>
                <button
                  onClick={() => showToast('Download iniciado')}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-audit-navy font-bold py-2 px-4 rounded-lg transition-all text-sm"
                >
                  Atalhos Printáveis
                </button>
              </article>

              {/* RELACIONADOS */}
              <article className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-link text-blue-500"></i>
                  Páginas Relacionadas
                </h3>
                <div className="space-y-3">
                  <Link to="/politica-de-acessibilidade" className="block p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition border border-transparent hover:border-blue-200">
                    <p className="font-semibold text-sm text-audit-navy">Política de Acessibilidade</p>
                    <p className="text-xs text-slate-600">WCAG 2.1 AAA</p>
                  </Link>
                  <Link to="/de-olho-na-acessibilidade" className="block p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition border border-transparent hover:border-blue-200">
                    <p className="font-semibold text-sm text-audit-navy">De Olho na Acessibilidade</p>
                    <p className="text-xs text-slate-600">Dicas e boas práticas</p>
                  </Link>
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