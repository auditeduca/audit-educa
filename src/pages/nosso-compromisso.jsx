import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicLinks from '../components/TopicLinks';
import Toast from '../components/ui/Toast';
import BackgroundImage from '../components/BackgroundImage';
import MeasuredDateBar from '../components/MeasuredDateBar';
import ShareSidebar from '../components/ShareSidebar';

export default function NossoCompromisso() {
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

    const sections = ['hero', 'pilares', 'compromissos', 'roadmap'];
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
    { id: 'hero', label: 'Manifesto' },
    { id: 'pilares', label: 'Cinco Pilares' },
    { id: 'compromissos', label: 'Compromissos' },
    { id: 'roadmap', label: 'Roadmap' }
  ];

  const pilares = [
    { titulo: 'Excelência', icone: 'fa-star', cor: 'amber' },
    { titulo: 'Inclusão', icone: 'fa-users', cor: 'emerald' },
    { titulo: 'Inovação', icone: 'fa-lightbulb', cor: 'blue' },
    { titulo: 'Integridade', icone: 'fa-shield', cor: 'indigo' },
    { titulo: 'Impacto', icone: 'fa-heart', cor: 'rose' }
  ];

  const compromissos = [
    { meta: 'Alcançar 100 mil alunos treinados', periodo: '2026', status: 'em progresso' },
    { meta: 'Traduzir conteúdo para 5 idiomas', periodo: '2026-2027', status: 'planejado' },
    { meta: 'Parcerias com 10 universidades', periodo: '2027', status: 'planejado' },
    { meta: 'Zero pegada de carbono', periodo: '2026', status: 'em progresso' },
    { meta: 'Certificação AAA em acessibilidade', periodo: '2026', status: 'completo' }
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
                Nosso Compromisso
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
                className="bg-gradient-to-br from-audit-navy/95 to-audit-navy relative overflow-hidden rounded-3xl shadow-lg mb-8 group"
              >
                <BackgroundImage
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
                  opacity={10}
                />

                <div className="absolute top-0 right-0 w-96 h-96 bg-audit-gold/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 z-0"></div>

                <div className="relative z-10 p-8 md:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-1 w-8 bg-audit-gold rounded-full"></div>
                    <span className="text-audit-gold font-bold text-xs uppercase tracking-[0.15em]">
                      Manifesto
                    </span>
                  </div>

                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Nosso <span className="text-audit-gold block sm:inline">Compromisso</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-8 max-w-2xl font-light">
                    Uma declaração de intenções. Nosso compromisso com a excelência, inclusão e impacto social na educação profissional brasileira.
                  </p>

                  {/* METADATA */}
                  <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-audit-gold/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-handshake text-audit-gold text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">
                          Validade
                        </span>
                        <span className="text-white font-semibold">2024 - 2030</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-audit-gold/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-users text-audit-gold text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">
                          Alcance
                        </span>
                        <span className="text-white font-semibold">Comunidade Global</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* SHARE SIDEBAR */}
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm mb-8">
                <ShareSidebar
                  title="Nosso Compromisso - Audit Educa"
                  url={typeof window !== 'undefined' ? window.location.href : 'https://auditeduca.com.br/nosso-compromisso'}
                />
              </div>

              {/* SEÇÃO 1: MANIFESTO */}
              <section className="mb-16">
                <article className="bg-gradient-to-br from-audit-gold/5 to-audit-navy/5 rounded-2xl p-8 md:p-10 border border-audit-gold/20">
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-audit-navy mb-6 leading-relaxed">
                    "Educação de Qualidade é o Maior Ativo de uma Nação"
                  </h2>
                  <p className="text-slate-700 leading-relaxed font-light mb-4">
                    O Audit Educa existe para democratizar o acesso a conhecimento técnico de excelência em auditoria e contabilidade. Acreditamos que nenhuma barreira — geográfica, econômica ou educacional — deve impedir o crescimento profissional.
                  </p>
                  <p className="text-slate-700 leading-relaxed font-light">
                    Este compromisso é público. É transparente. É auditável. E nós nos responsabilizamos por cada meta aqui descrita.
                  </p>
                </article>
              </section>

              {/* SEÇÃO 2: PILARES */}
              <section id="pilares" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Cinco Pilares
                  </h2>
                </div>

                <div className="grid sm:grid-cols-5 gap-5 mb-8">
                  {pilares.map((pilar, i) => (
                    <article
                      key={i}
                      className="text-center p-6 bg-white rounded-2xl border border-slate-200 hover:border-audit-gold/40 hover:shadow-md transition-all group"
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br from-${pilar.cor}-400 to-${pilar.cor}-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <i className={`fas ${pilar.icone} text-2xl`}></i>
                      </div>
                      <h3 className="font-bold text-audit-navy">{pilar.titulo}</h3>
                    </article>
                  ))}
                </div>
              </section>

              {/* SEÇÃO 3: COMPROMISSOS */}
              <section id="compromissos" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Compromissos Mensuráveis
                  </h2>
                </div>

                <div className="space-y-4">
                  {compromissos.map((comp, i) => (
                    <article key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-bold text-audit-navy flex-1">{comp.meta}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          comp.status === 'completo' ? 'bg-green-100 text-green-700' :
                          comp.status === 'em progresso' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {comp.status}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        <i className="fas fa-calendar-alt text-audit-gold mr-2"></i>
                        {comp.periodo}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              {/* SEÇÃO 4: ROADMAP */}
              <section id="roadmap" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Roadmap 2024-2030
                  </h2>
                </div>

                <div className="relative">
                  {/* Timeline linha */}
                  <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-audit-gold to-audit-navy"></div>

                  <div className="space-y-8">
                    {[
                      { year: '2024', status: 'Lançamento Beta', complete: true },
                      { year: '2025', status: 'Expansão Nacional', complete: true },
                      { year: '2026', status: 'Internacionalização', complete: false },
                      { year: '2027', status: 'Certificações Avançadas', complete: false },
                      { year: '2028-2030', status: 'Impacto Global', complete: false }
                    ].map((item, i) => (
                      <div key={i} className="ml-24 relative">
                        <div className={`absolute -left-16 w-8 h-8 rounded-full border-4 border-white ${item.complete ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                        <article className={`p-6 rounded-2xl border ${item.complete ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                          <p className={`font-bold ${item.complete ? 'text-green-900' : 'text-audit-navy'}`}>
                            {item.year}
                          </p>
                          <p className={`text-sm ${item.complete ? 'text-green-800' : 'text-slate-600'} font-light`}>
                            {item.status}
                          </p>
                        </article>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* CTA FINAL */}
              <article className="bg-audit-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg mb-16">
                <div className="absolute top-0 right-0 w-96 h-96 bg-audit-gold/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                    Junte-se a Nós
                  </h3>
                  <p className="text-slate-200 mb-6 max-w-2xl font-light">
                    Este não é um compromisso isolado. É um convite para você, nossos alunos, parceiros e a comunidade contábil brasileira.
                  </p>
                  <button
                    onClick={() => showToast('Obrigado por se juntar a nós!')}
                    className="inline-flex items-center gap-2 bg-audit-gold hover:bg-yellow-500 text-audit-navy font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-heart text-sm"></i>
                    Quero Apoiar
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
                  <i className="fas fa-list text-audit-gold"></i>
                  <span>Nesta Página</span>
                </h3>
                <nav className="flex flex-col gap-4">
                  {sectionsList.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className={`text-sm font-semibold transition-all flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-audit-gold/50 rounded px-2 py-1 ${
                        activeSection === item.id
                          ? 'text-audit-navy'
                          : 'text-slate-500 hover:text-audit-navy'
                      }`}
                      aria-current={activeSection === item.id ? 'location' : undefined}
                    >
                      <span
                        className={`h-1 transition-all duration-300 rounded-full ${
                          activeSection === item.id
                            ? 'w-6 bg-audit-gold'
                            : 'w-0 bg-audit-gold group-hover:w-6'
                        }`}
                      ></span>
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* ASSINATURA */}
              <article className="bg-gradient-to-br from-audit-navy to-audit-navy/80 rounded-3xl p-8 text-white shadow-lg">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <i className="fas fa-signature text-audit-gold text-lg"></i>
                  Assinado por
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold">Leivis Lima</p>
                    <p className="text-xs text-slate-300">Fundador & CEO</p>
                  </div>
                  <p className="text-xs text-slate-400 italic pt-3 border-t border-white/20">
                    "Educação sem excelência é negligência. Excelência sem inclusão é privilégio."
                  </p>
                </div>
              </article>

              {/* COMPARTILHE */}
              <article className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-share-alt text-audit-gold"></i>
                  Compartilhe
                </h3>
                <div className="flex gap-3">
                  {[
                    { icon: 'fab fa-linkedin', label: 'LinkedIn' },
                    { icon: 'fab fa-twitter', label: 'Twitter' },
                    { icon: 'fab fa-facebook', label: 'Facebook' }
                  ].map((social, i) => (
                    <button
                      key={i}
                      onClick={() => showToast(`Compartilhado no ${social.label}`)}
                      className="flex-1 p-3 bg-slate-100 hover:bg-audit-gold/10 text-audit-navy rounded-lg transition-all border border-slate-200"
                      title={social.label}
                    >
                      <i className={`${social.icon}`}></i>
                    </button>
                  ))}
                </div>
              </article>

              {/* DOCUMENTOS */}
              <article className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-file-pdf text-audit-gold"></i>
                  Documentos
                </h3>
                <button
                  onClick={() => showToast('Download iniciado')}
                  className="w-full p-3 bg-audit-gold hover:bg-yellow-500 text-audit-navy font-bold rounded-lg transition-all text-sm"
                >
                  Baixar Manifesto PDF
                </button>
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