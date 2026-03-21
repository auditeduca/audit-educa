import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicLinks from '../components/TopicLinks';
import Toast from '../components/ui/Toast';
import BackgroundImage from '../components/BackgroundImage';
import MeasuredDateBar from '../components/MeasuredDateBar';
import ShareSidebar from '../components/ShareSidebar';

export default function PoliticaAcessibilidade() {
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

    const sections = ['hero', 'diretrizes', 'implementacao', 'melhoria'];
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
    { id: 'hero', label: 'Declaração' },
    { id: 'diretrizes', label: 'Diretrizes WCAG' },
    { id: 'implementacao', label: 'Implementação' },
    { id: 'melhoria', label: 'Melhoria Contínua' }
  ];

  const principiosWCAG = [
    {
      id: 'perceptivel',
      titulo: 'Perceptível',
      icone: 'fa-eye',
      cor: 'green',
      desc: 'Conteúdo deve ser apresentado de forma que usuários consigam perceber'
    },
    {
      id: 'operavel',
      titulo: 'Operável',
      icone: 'fa-hand-pointer',
      cor: 'blue',
      desc: 'Funcionalidades deve ser operáveis via teclado e outros dispositivos'
    },
    {
      id: 'compreensivel',
      titulo: 'Compreensível',
      icone: 'fa-brain',
      cor: 'purple',
      desc: 'Informação e operação devem ser facilmente compreendidas'
    },
    {
      id: 'robusto',
      titulo: 'Robusto',
      icone: 'fa-cog',
      cor: 'red',
      desc: 'Conteúdo deve ser compatível com tecnologias assistivas'
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
                Política de Acessibilidade
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
                className="bg-gradient-to-br from-green-600 to-audit-navy relative overflow-hidden rounded-3xl shadow-lg mb-8 group"
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
                      WCAG 2.1 AAA
                    </span>
                  </div>

                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Política de <span className="text-white block sm:inline">Acessibilidade Digital</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-100 leading-relaxed mb-8 max-w-2xl font-light">
                    Comprometimento total em garantir que o conhecimento em auditoria e contabilidade seja acessível a todos, independentemente de capacidade.
                  </p>

                  {/* METADATA */}
                  <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-universal-access text-white text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-white/70 uppercase tracking-wider font-bold">
                          Conformidade
                        </span>
                        <span className="text-white font-semibold">AAA Máximo</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-check-circle text-white text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-white/70 uppercase tracking-wider font-bold">
                          Padrão W3C
                        </span>
                        <span className="text-white font-semibold">Implementado</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-calendar-days text-white text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-white/70 uppercase tracking-wider font-bold">
                          Atualizado em
                        </span>
                        <time dateTime="2026-03-19" className="text-white font-semibold">
                          19 de Março, 2026
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* SHARE SIDEBAR */}
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm mb-8">
                <ShareSidebar
                  title="Política de Acessibilidade - Audit Educa"
                  url={typeof window !== 'undefined' ? window.location.href : 'https://auditeduca.com.br/politica-acessibilidade'}
                />
              </div>

              {/* SEÇÃO 1: DIRETRIZES */}
              <section id="diretrizes" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Diretrizes WCAG 2.1
                  </h2>
                </div>

                <p className="text-slate-600 mb-8 font-light text-lg leading-relaxed">
                  Nossas diretrizes seguem rigorosamente as normas estabelecidas pelo World Wide Web Consortium (W3C), com foco no nível AAA - o mais rigoroso.
                </p>

                <div className="grid sm:grid-cols-2 gap-5">
                  {principiosWCAG.map((p, i) => (
                    <article
                      key={i}
                      className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-green-500/40 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br from-green-500 to-audit-navy rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                        <i className={`fas ${p.icone} text-lg`}></i>
                      </div>
                      <h3 className="font-bold text-audit-navy text-lg mb-2">{p.titulo}</h3>
                      <p className="text-slate-600 text-sm font-light">{p.desc}</p>
                    </article>
                  ))}
                </div>
              </section>

              {/* SEÇÃO 2: IMPLEMENTAÇÃO */}
              <section id="implementacao" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Ações de Implementação
                  </h2>
                </div>

                <div className="space-y-6">
                  <article className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                    <h3 className="text-lg font-bold text-audit-navy mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                      Semântica HTML5
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-light mb-3">
                      Uso rigoroso de tags semânticas apropriadas para que tecnologias assistivas (leitores de tela, navegadores de voz) identifiquem corretamente a hierarquia e significado do conteúdo.
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 font-mono font-light">
                      &lt;header&gt;, &lt;nav&gt;, &lt;main&gt;, &lt;article&gt;, &lt;aside&gt;, &lt;footer&gt;
                    </div>
                  </article>

                  <article className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                    <h3 className="text-lg font-bold text-audit-navy mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                      Contraste Máximo
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-light mb-3">
                      Garantia de contraste superior a <strong>7:1 para textos</strong> e <strong>4.5:1 para elementos de interface</strong>, permitindo leitura por usuários com baixa visão ou daltonismo.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-audit-navy text-white p-3 rounded text-sm">Contraste 7:1</div>
                      <div className="bg-slate-700 text-white p-3 rounded text-sm">Teste em WCAG</div>
                    </div>
                  </article>

                  <article className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                    <h3 className="text-lg font-bold text-audit-navy mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                      Navegação por Teclado
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-light">
                      Foco visível em todos os elementos interativos. Navegação <strong>100% via teclado</strong> habilitada, permitindo que usuários que não conseguem usar mouse naveguem perfeitamente.
                    </p>
                  </article>
                </div>
              </section>

              {/* SEÇÃO 3: MELHORIA CONTÍNUA */}
              <section
                id="melhoria"
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-green-200 shadow-sm mb-16 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500"></div>
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-green-200/10 rounded-full"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      <i className="fas fa-sync-alt text-lg"></i>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-green-900">
                      Melhoria Contínua
                    </h2>
                  </div>

                  <p className="text-green-800 leading-relaxed font-light mb-6">
                    A acessibilidade em nível AAA é uma jornada incessante de aprendizado e refinamento. Se você encontrar qualquer barreira de acesso ou tiver sugestões para melhorar nossa conformidade, nossa equipe técnica está à sua disposição e comprometida em resolver em até 48 horas.
                  </p>

                  <button
                    onClick={() => showToast('Abrindo canal de feedback em acessibilidade')}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  >
                    <i className="fas fa-envelope text-sm"></i>
                    Enviar Sugestão
                  </button>
                </div>
              </section>

              {/* CTA FINAL */}
              <article className="bg-audit-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg mb-16">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                    Conhecimento Sem Barreiras
                  </h3>
                  <p className="text-slate-200 mb-6 max-w-2xl font-light">
                    Garantir o acesso igualitário ao conhecimento técnico é nossa maior responsabilidade social. Junte-se a nós na construção de uma plataforma verdadeiramente inclusiva.
                  </p>
                  <Link
                    to="/recursos-assistivos"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-assistive-listening-systems text-sm"></i>
                    Ver Guia de Recursos Assistivos
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

              {/* CERTIFICAÇÃO AAA */}
              <article className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-certificate text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900">WCAG 2.1 AAA</h3>
                    <p className="text-xs text-green-700">Nível Máximo de Conformidade</p>
                  </div>
                </div>
                <p className="text-green-800 text-sm font-light leading-relaxed">
                  Audit Educa segue o padrão AAA do World Wide Web Consortium, o nível mais rigoroso de acessibilidade web disponível.
                </p>
              </article>

              {/* RECURSOS ASSISTIVOS */}
              <article className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-green-500/40 transition-all duration-300 group">
                <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-assistive-listening-systems text-green-500"></i>
                  Recursos Assistivos
                </h3>
                <p className="text-slate-600 text-sm font-light mb-5">
                  Guia prático sobre ferramentas recomendadas para usuários de leitores de tela e comandos de voz.
                </p>
                <Link
                  to="/recursos-assistivos"
                  className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-center transition-all"
                >
                  Ver Guia Completo
                </Link>
              </article>

              {/* PADRÕES RELACIONADOS */}
              <article className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-link text-green-500"></i>
                  Políticas Relacionadas
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/de-olho-na-acessibilidade"
                    className="block p-3 bg-white rounded-lg hover:bg-green-50 transition border border-transparent hover:border-green-200"
                  >
                    <p className="font-semibold text-sm text-audit-navy">De Olho na Acessibilidade</p>
                    <p className="text-xs text-slate-500">Guia de boas práticas</p>
                  </Link>
                  <Link
                    to="/tecnologia-verde"
                    className="block p-3 bg-white rounded-lg hover:bg-green-50 transition border border-transparent hover:border-green-200"
                  >
                    <p className="font-semibold text-sm text-audit-navy">Tecnologia Verde</p>
                    <p className="text-xs text-slate-500">Sustentabilidade digital</p>
                  </Link>
                </div>
              </article>

              {/* CONTATO PARA DÚVIDAS */}
              <article className="bg-green-100/30 rounded-3xl p-6 border border-green-200/50">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <i className="fas fa-question-circle text-green-600"></i>
                  Dúvidas?
                </h3>
                <p className="text-green-800 text-sm font-light mb-4">
                  Encontrou uma barreira de acessibilidade? Conte-nos para melhorarmos.
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