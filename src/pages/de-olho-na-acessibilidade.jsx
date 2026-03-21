import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicLinks from '../components/TopicLinks';
import Toast from '../components/ui/Toast';
import BackgroundImage from '../components/BackgroundImage';
import MeasuredDateBar from '../components/MeasuredDateBar';
import ShareSidebar from '../components/ShareSidebar';

export default function DeOlhoNaAcessibilidade() {
  const [toastMessage, setToastMessage] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [headerHeight, setHeaderHeight] = useState(80);
  const [dateBarHeight, setDateBarHeight] = useState(40);
  const [activeTopic, setActiveTopic] = useState(null);
  const [checklist, setChecklist] = useState({
    semantica: false,
    contraste: false,
    teclado: false,
    aria: false,
    imagens: false,
    formularios: false,
    video: false,
    cores: false
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

    const sections = ['hero', 'praticas', 'checklist', 'dicas'];
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

  const toggleChecklist = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sectionsList = [
    { id: 'hero', label: 'Introdução' },
    { id: 'praticas', label: 'Boas Práticas' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'dicas', label: 'Dicas Práticas' }
  ];

  const praticas = [
    {
      titulo: 'Semântica HTML5',
      desc: 'Use tags semânticas <header>, <nav>, <main>, <article> para estrutura clara',
      icone: 'fa-code'
    },
    {
      titulo: 'Contraste de Cores',
      desc: 'Mantenha contraste mínimo de 4.5:1 para textos e 3:1 para elementos',
      icone: 'fa-adjust'
    },
    {
      titulo: 'Navegação por Teclado',
      desc: 'Garanta que todos os elementos sejam acessíveis via teclado',
      icone: 'fa-keyboard'
    },
    {
      titulo: 'ARIA Labels',
      desc: 'Adicione aria-label, aria-describedby para contexto adicional',
      icone: 'fa-universal-access'
    },
    {
      titulo: 'Descrição de Imagens',
      desc: 'Sempre adicione alt text significativo em imagens',
      icone: 'fa-image'
    },
    {
      titulo: 'Formulários Acessíveis',
      desc: 'Use labels descritivos, agrupe campos logicamente',
      icone: 'fa-forms'
    }
  ];

  const dicas = [
    'Teste com leitores de tela (NVDA, JAWS)',
    'Navegue apenas com Tab e Shift+Tab',
    'Use ferramentas como Axe, Lighthouse, Wave',
    'Valide HTML com W3C Validator',
    'Mantenha ordem lógica de tabulação',
    'Garanta foco visível em todos os elementos',
    'Use apenas cores para diferenciar',
    'Forneça transcripts de áudios'
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
                De Olho na Acessibilidade
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
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
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
                    De Olho na <span className="block sm:inline">Acessibilidade</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-100 leading-relaxed mb-8 max-w-2xl font-light">
                    Boas práticas, dicas implementação e checklist completo para garantir acessibilidade em seus projetos.
                  </p>

                  {/* METADATA */}
                  <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-check-circle text-white text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-white/70 uppercase tracking-wider font-bold">
                          Conformidade
                        </span>
                        <span className="text-white font-semibold">WCAG 2.1 AA+</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-list-check text-white text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-white/70 uppercase tracking-wider font-bold">
                          Checklist
                        </span>
                        <span className="text-white font-semibold">8 Itens</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* SHARE SIDEBAR */}
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm mb-8">
                <ShareSidebar
                  title="De Olho na Acessibilidade - Audit Educa"
                  url={typeof window !== 'undefined' ? window.location.href : 'https://auditeduca.com.br/de-olho-na-acessibilidade'}
                />
              </div>

              {/* SEÇÃO 1: PRÁTICAS */}
              <section id="praticas" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    6 Boas Práticas Essenciais
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {praticas.map((pratica, i) => (
                    <article
                      key={i}
                      className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-green-500/40 hover:shadow-md transition-all"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-4">
                        <i className={`fas ${pratica.icone}`}></i>
                      </div>
                      <h3 className="font-bold text-audit-navy text-lg mb-2">{pratica.titulo}</h3>
                      <p className="text-slate-600 text-sm font-light">{pratica.desc}</p>
                    </article>
                  ))}
                </div>
              </section>

              {/* SEÇÃO 2: CHECKLIST */}
              <section id="checklist" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Checklist de Implementação
                  </h2>
                </div>

                <article className="bg-white p-8 rounded-2xl border border-slate-200">
                  <div className="space-y-4">
                    {Object.entries({
                      semantica: 'Semântica HTML5 implementada',
                      contraste: 'Contraste mínimo 4.5:1 verificado',
                      teclado: 'Navegação por teclado funcional',
                      aria: 'Labels ARIA adicionados',
                      imagens: 'Alt text em todas as imagens',
                      formularios: 'Formulários com labels claros',
                      video: 'Vídeos com legenda/transcrição',
                      cores: 'Não usa apenas cor para informar'
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-4 cursor-pointer p-4 rounded-lg hover:bg-slate-50 transition-colors group">
                        <input
                          type="checkbox"
                          checked={checklist[key]}
                          onChange={() => toggleChecklist(key)}
                          className="w-5 h-5 accent-green-500 cursor-pointer"
                        />
                        <span className={`flex-1 font-medium transition-all ${
                          checklist[key] 
                            ? 'text-green-700 line-through' 
                            : 'text-audit-navy group-hover:text-green-700'
                        }`}>
                          {label}
                        </span>
                        {checklist[key] && (
                          <i className="fas fa-check-circle text-green-500"></i>
                        )}
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-900 font-medium">
                      <i className="fas fa-lightbulb mr-2 text-green-600"></i>
                      Você completou <strong>{Object.values(checklist).filter(Boolean).length} de 8</strong> itens
                    </p>
                  </div>
                </article>
              </section>

              {/* SEÇÃO 3: DICAS PRÁTICAS */}
              <section id="dicas" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Dicas Práticas de Teste
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {dicas.map((dica, i) => (
                    <article
                      key={i}
                      className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all flex gap-4 items-start"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                        {i + 1}
                      </div>
                      <p className="text-slate-600 font-light text-sm">{dica}</p>
                    </article>
                  ))}
                </div>
              </section>

              {/* CTA FINAL */}
              <article className="bg-audit-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg mb-16">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                    Comece Agora
                  </h3>
                  <p className="text-slate-200 mb-6 max-w-2xl font-light">
                    Implemente essas práticas em seus próximos projetos. A acessibilidade é um direito, não um luxo.
                  </p>
                  <Link
                    to="/recursos-assistivos"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-book text-sm"></i>
                    Ferramentas & Recursos
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

              {/* PADRÃO WCAG */}
              <article className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-200">
                <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-certificate text-green-600"></i>
                  Padrão WCAG 2.1
                </h3>
                <div className="space-y-2 text-sm text-green-800 font-light">
                  <p><strong>A</strong> - Essencial (mínimo)</p>
                  <p><strong>AA</strong> - Recomendado</p>
                  <p><strong>AAA</strong> - Excelente (Audit Educa)</p>
                </div>
              </article>

              {/* FERRAMENTAS DE TESTE */}
              <article className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-tools text-green-500"></i>
                  Ferramentas de Teste
                </h3>
                <div className="space-y-3 text-sm">
                  <a href="#" onClick={() => showToast('Redirecionando...')} className="block p-3 bg-slate-50 rounded-lg hover:bg-green-50 transition border border-transparent hover:border-green-200">
                    <p className="font-semibold text-audit-navy">Axe DevTools</p>
                    <p className="text-xs text-slate-600">Teste automático na extensão</p>
                  </a>
                  <a href="#" onClick={() => showToast('Redirecionando...')} className="block p-3 bg-slate-50 rounded-lg hover:bg-green-50 transition border border-transparent hover:border-green-200">
                    <p className="font-semibold text-audit-navy">Lighthouse</p>
                    <p className="text-xs text-slate-600">Auditoria nativa do Chrome</p>
                  </a>
                  <a href="#" onClick={() => showToast('Redirecionando...')} className="block p-3 bg-slate-50 rounded-lg hover:bg-green-50 transition border border-transparent hover:border-green-200">
                    <p className="font-semibold text-audit-navy">WAVE</p>
                    <p className="text-xs text-slate-600">Análise visual de problemas</p>
                  </a>
                </div>
              </article>

              {/* SUPORTE */}
              <article className="bg-green-50 rounded-3xl p-6 border border-green-200">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <i className="fas fa-question-circle text-green-600"></i>
                  Precisa de Ajuda?
                </h3>
                <p className="text-sm text-green-800 font-light mb-4">
                  Consulte nossa equipe de acessibilidade para auditorias ou consultoria.
                </p>
                <a
                  href="mailto:acessibilidade@auditeduca.com.br"
                  className="text-sm font-semibold text-green-700 hover:text-green-900 transition flex items-center gap-2"
                >
                  <i className="fas fa-envelope text-xs"></i>
                  acessibilidade@auditeduca.com.br
                </a>
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