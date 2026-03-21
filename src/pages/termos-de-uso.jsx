import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicLinks from '../components/TopicLinks';
import Toast from '../components/ui/Toast';
import BackgroundImage from '../components/BackgroundImage';
import MeasuredDateBar from '../components/MeasuredDateBar';
import ShareSidebar from '../components/ShareSidebar';

export default function TermosDeUso() {
  const [toastMessage, setToastMessage] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');

  // Estados para alturas dos elementos fixos
  const [headerHeight, setHeaderHeight] = useState(80);
  const [dateBarHeight, setDateBarHeight] = useState(40);

  // Estado para controle da DateBar
  const [activeTopic, setActiveTopic] = useState(null);

  const headerRef = useRef(null);

  // Mede a altura do Header
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

  // Altura total ocupada pelos elementos fixos (usado APENAS para o Menu Lateral não cobrir o texto)
  const totalTopOffset = headerHeight + dateBarHeight + paddingExtraDateBar;
  
  // O padding do conteúdo principal só precisa compensar o Header
  const contentPaddingTop = headerHeight;

  // Intersection Observer para destacar seção ativa no índice lateral
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

    const sections = ['hero', 'adesao', 'propriedade', 'responsabilidade', 'limitacao'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [totalTopOffset]);

  // Rolagem suave para as seções
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
    { id: 'hero', label: 'Geral', icon: 'fa-file-contract' },
    { id: 'adesao', label: 'Adesão ao Serviço', icon: 'fa-handshake' },
    { id: 'propriedade', label: 'Propriedade Intelectual', icon: 'fa-copyright' },
    { id: 'responsabilidade', label: 'Responsabilidades', icon: 'fa-user-shield' },
    { id: 'limitacao', label: 'Limitação de Escopo', icon: 'fa-exclamation-circle' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* HEADER com ref para medição */}
      <div ref={headerRef} className="z-50 relative bg-white">
        <Header />
      </div>

      {/* DATEBAR - Posicionado logo abaixo do cabeçalho dinamicamente */}
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
                Termos de Uso
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
                  src="https://images.unsplash.com/photo-1554224311-beee415c15db?auto=format&fit=crop&w=1200&q=80"
                  opacity={10}
                />

                {/* Decoração geométrica */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-audit-gold/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 z-0"></div>

                {/* Conteúdo */}
                <div className="relative z-10 p-8 md:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-1 w-8 bg-audit-gold rounded-full"></div>
                    <span className="text-audit-gold font-bold text-xs uppercase tracking-[0.15em]">
                      Contrato de Uso
                    </span>
                  </div>

                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Termos de <span className="text-audit-gold block sm:inline">Uso</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-8 max-w-2xl font-light">
                    Os termos e condições que regulam o uso da plataforma Audit Educa. Ao acessar nosso site, você aceita estas disposições.
                  </p>

                  {/* METADATA */}
                  <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-audit-gold/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-file-contract text-audit-gold text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">
                          Versão
                        </span>
                        <time className="text-white font-semibold">
                          1.1 - Vigente
                        </time>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-audit-gold/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-calendar-days text-audit-gold text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">
                          Atualizado em
                        </span>
                        <time dateTime="2026-02-08" className="text-white font-semibold">
                          8 de Fevereiro, 2026
                        </time>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-audit-gold/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-gavel text-audit-gold text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">
                          Jurisdição
                        </span>
                        <span className="text-white font-semibold">São Paulo/SP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* SHARE SIDEBAR */}
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm mb-8">
                <ShareSidebar
                  title="Termos de Uso - Audit Educa"
                  url={typeof window !== 'undefined' ? window.location.href : 'https://auditeduca.com.br/termos-de-uso'}
                />
              </div>

              {/* SEÇÃO 1: ADESÃO */}
              <section id="adesao" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Adesão ao Serviço
                  </h2>
                </div>

                <div className="space-y-6">
                  <article className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all duration-300">
                    <h3 className="text-xl font-bold text-audit-navy mb-3 flex items-center gap-3">
                      <span className="w-8 h-8 bg-audit-gold text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      Aceitação dos Termos
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-light">
                      Ao usar a plataforma Audit Educa, você aceita automaticamente estes Termos de Uso. Se não concordar com alguma cláusula, abstenga-se de usar os serviços.
                    </p>
                  </article>

                  <article className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all duration-300">
                    <h3 className="text-xl font-bold text-audit-navy mb-3 flex items-center gap-3">
                      <span className="w-8 h-8 bg-audit-gold text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      Cadastro e Credenciais
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-light">
                      Você é responsável por manter a confidencialidade de suas credenciais de acesso. O compartilhamento de senhas viola estes termos e resultará em suspensão imediata da conta.
                    </p>
                  </article>

                  <article className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all duration-300">
                    <h3 className="text-xl font-bold text-audit-navy mb-3 flex items-center gap-3">
                      <span className="w-8 h-8 bg-audit-gold text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      Elegibilidade
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-light">
                      Você declara que tem capacidade legal para usar este serviço e que todas as informações fornecidas no cadastro são precisas, completas e atualizadas.
                    </p>
                  </article>
                </div>
              </section>

              {/* SEÇÃO 2: PROPRIEDADE INTELECTUAL */}
              <section id="propriedade" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Propriedade Intelectual
                  </h2>
                </div>

                <article className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 md:p-10 border border-slate-200 mb-6">
                  <p className="text-slate-700 leading-relaxed font-light mb-4">
                    Todo conteúdo, design, código, imagens, textos e ferramentas são ativos intangíveis protegidos por direitos autorais do Audit Educa.
                  </p>
                  <ul className="space-y-3 text-slate-600 text-sm font-light">
                    <li className="flex gap-3">
                      <span className="text-audit-gold">✓</span>
                      <span>Você pode acessar e usar para fins educacionais pessoais</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-audit-gold">✗</span>
                      <span>Não reproduzir, copiar ou distribuir sem consentimento explícito</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-audit-gold">✗</span>
                      <span>Proibido descompilar, reverse engineering ou modificar</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-audit-gold">✗</span>
                      <span>Vedado usar para fins comerciais sem licença</span>
                    </li>
                  </ul>
                </article>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                  <p className="text-amber-900 text-sm leading-relaxed">
                    <strong>Notificação DMCA:</strong> Se você acredita que seus direitos autorais foram infringidos, notifique imediatamente através de <a href="mailto:juridico@auditeduca.com.br" className="font-bold underline hover:text-amber-800">juridico@auditeduca.com.br</a>
                  </p>
                </div>
              </section>

              {/* SEÇÃO 3: RESPONSABILIDADES */}
              <section id="responsabilidade" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Responsabilidades do Usuário
                  </h2>
                </div>

                <div className="grid sm:grid-cols-3 gap-5">
                  {[
                    {
                      icon: 'fa-key',
                      title: 'Segurança de Acesso',
                      desc: 'Mantenha suas credenciais seguras. Notifique imediatamente sobre acessos não autorizados.'
                    },
                    {
                      icon: 'fa-database',
                      title: 'Integridade dos Dados',
                      desc: 'Você é responsável pela precisão dos dados inseridos nas ferramentas.'
                    },
                    {
                      icon: 'fa-comment-slash',
                      title: 'Conduta Ética',
                      desc: 'Proibido disseminar conteúdo ofensivo, spam ou em desacordo com o Código de Ética Profissional.'
                    }
                  ].map((item, i) => (
                    <article
                      key={i}
                      className="flex items-start gap-5 bg-white p-6 rounded-2xl border border-slate-200 hover:border-audit-gold/40 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-audit-navy to-audit-gold rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                        <i className={`fas ${item.icon} text-lg`}></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-audit-navy text-base mb-1">{item.title}</h3>
                        <p className="text-slate-600 text-sm font-light">{item.desc}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* SEÇÃO 4: LIMITAÇÃO DE ESCOPO */}
              <section
                id="limitacao"
                className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 md:p-12 border border-red-200 shadow-sm mb-16 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-red-200/10 rounded-full"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      <i className="fas fa-exclamation-triangle text-lg"></i>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-red-900">
                      Limitação de Responsabilidade
                    </h2>
                  </div>

                  <div className="space-y-4 text-red-800">
                    <p className="leading-relaxed">
                      <strong>Conteúdo Educacional:</strong> O conteúdo deste site é fornecido "como está" e possui fins estritamente educacionais, não constituindo consultoria legal, contábil ou fiscal profissional.
                    </p>
                    <p className="leading-relaxed">
                      <strong>Isenção de Responsabilidade:</strong> O Audit Educa não se responsabiliza por decisões tomadas com base em simuladores ou ferramentas. Sempre consulte um profissional habilitado em casos reais.
                    </p>
                    <p className="leading-relaxed">
                      <strong>Disponibilidade:</strong> Não garantimos disponibilidade ininterrupta. Podem haver paradas para manutenção sem aviso prévio.
                    </p>
                  </div>
                </div>
              </section>

              {/* CTA FINAL */}
              <article className="bg-audit-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg mb-16">
                <div className="absolute top-0 right-0 w-96 h-96 bg-audit-gold/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                    Dúvidas Jurídicas?
                  </h3>
                  <p className="text-slate-200 mb-6 max-w-2xl font-light">
                    Para esclarecimentos sobre qualquer cláusula ou notificação de infração, entre em contato com nosso departamento jurídico.
                  </p>
                  <a
                    href="mailto:juridico@auditeduca.com.br"
                    className="inline-flex items-center gap-2 bg-audit-gold hover:bg-yellow-500 text-audit-navy font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-audit-gold/50"
                  >
                    <i className="fas fa-envelope text-sm"></i>
                    Contato Jurídico
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

              {/* INFORMAÇÃO LEGAL */}
              <article className="bg-blue-50 rounded-3xl p-6 border border-blue-200 shadow-sm hover:shadow-md hover:border-audit-gold/40 transition-all duration-300 group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <i className="fas fa-gavel text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-blue-900 mb-1">
                      Jurisdição
                    </h3>
                    <p className="text-xs text-blue-700 font-light">
                      Foro da Comarca de São Paulo/SP
                    </p>
                  </div>
                </div>
                <p className="text-blue-800 text-sm font-light leading-relaxed">
                  Qualquer litígio oriundo destes Termos será resolvido pela Justiça de São Paulo, com renúncia a outro foro.
                </p>
              </article>

              {/* DOCUMENTOS RELACIONADOS */}
              <article className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-audit-gold/40 transition-all duration-300 group flex flex-col gap-6">
                <div className="w-full aspect-[3/4] bg-slate-50 rounded-2xl p-3 shadow-inner border border-slate-100 relative overflow-hidden shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-audit-navy to-audit-navy/80 border border-dashed border-slate-300/50 rounded-xl flex flex-col items-center justify-center relative">
                    <i className="fas fa-file-pdf text-6xl text-white/30 mb-4 group-hover:scale-110 group-hover:text-audit-gold/30 transition-all duration-500"></i>
                    <span className="text-xs font-black text-white/50 uppercase tracking-wider text-center px-4 leading-tight">
                      Audit Educa
                      <br />
                      Termos 2026
                    </span>
                  </div>
                </div>

                <div className="w-full">
                  <span className="text-audit-gold font-bold text-xs uppercase tracking-[0.15em] mb-3 block">
                    Documentos Jurídicos
                  </span>
                  <p className="text-slate-600 text-sm font-light mb-5">
                    Versão completa em PDF com assinatura digital.
                  </p>

                  <button
                    className="w-full bg-audit-gold hover:bg-yellow-500 active:scale-95 text-audit-navy font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-audit-gold/50"
                    onClick={() => showToast('Download iniciado')}
                  >
                    <i className="fas fa-download text-sm"></i>
                    Baixar PDF
                  </button>
                </div>
              </article>

              {/* DÚVIDAS FREQUENTES */}
              <article className="bg-gradient-to-br from-audit-navy/5 to-audit-gold/5 rounded-3xl p-6 border border-audit-gold/30 shadow-sm hover:shadow-md transition-all duration-300 group">
                <h3 className="text-xl font-serif font-bold text-audit-navy mb-4">
                  Dúvidas Frequentes
                </h3>
                <div className="space-y-3 text-sm">
                  <details className="group/detail">
                    <summary className="font-semibold text-audit-navy cursor-pointer hover:text-audit-gold transition flex items-center gap-2">
                      <i className="fas fa-chevron-right text-xs group-open/detail:rotate-90 transition"></i>
                      Posso compartilhar minha senha?
                    </summary>
                    <p className="text-slate-600 mt-2 pl-5 font-light text-xs">
                      Não. Compartilhar credenciais viola estes termos e resultará em suspensão imediata.
                    </p>
                  </details>

                  <details className="group/detail">
                    <summary className="font-semibold text-audit-navy cursor-pointer hover:text-audit-gold transition flex items-center gap-2">
                      <i className="fas fa-chevron-right text-xs group-open/detail:rotate-90 transition"></i>
                      Posso copiar o conteúdo?
                    </summary>
                    <p className="text-slate-600 mt-2 pl-5 font-light text-xs">
                      Não. Todo conteúdo é protegido por direitos autorais. Uso pessoal é permitido apenas.
                    </p>
                  </details>

                  <details className="group/detail">
                    <summary className="font-semibold text-audit-navy cursor-pointer hover:text-audit-gold transition flex items-center gap-2">
                      <i className="fas fa-chevron-right text-xs group-open/detail:rotate-90 transition"></i>
                      Isso substitui consultoria profissional?
                    </summary>
                    <p className="text-slate-600 mt-2 pl-5 font-light text-xs">
                      Não. Este é conteúdo educacional apenas. Sempre consulte um profissional habilitado.
                    </p>
                  </details>
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