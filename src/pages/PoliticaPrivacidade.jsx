import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicLinks from '../components/TopicLinks';
import Toast from '../components/ui/Toast';
import BackgroundImage from '../components/BackgroundImage';
import MeasuredDateBar from '../components/MeasuredDateBar';
import ShareSidebar from '../components/ShareSidebar';

export default function PoliticaPrivacidade() {
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

    const sections = ['hero', 'coleta', 'uso', 'lgpd', 'seguranca', 'direitos', 'contato'];
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
    { id: 'coleta', label: 'Coleta de Dados' },
    { id: 'uso', label: 'Como Usamos' },
    { id: 'lgpd', label: 'Conformidade LGPD' },
    { id: 'seguranca', label: 'Segurança' },
    { id: 'direitos', label: 'Seus Direitos' },
    { id: 'contato', label: 'Contato' }
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
                Política de Privacidade
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
                  src="https://images.unsplash.com/photo-1634632066475-a45960ad8fe0?auto=format&fit=crop&w=1200&q=80"
                  opacity={10}
                />

                <div className="absolute top-0 right-0 w-96 h-96 bg-audit-gold/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 z-0"></div>

                <div className="relative z-10 p-8 md:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-1 w-8 bg-audit-gold rounded-full"></div>
                    <span className="text-audit-gold font-bold text-xs uppercase tracking-[0.15em]">
                      Proteção de Dados
                    </span>
                  </div>

                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Política de <span className="text-audit-gold block sm:inline">Privacidade</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-8 max-w-2xl font-light">
                    Saiba como coletamos, protegemos e respeitamos seus dados pessoais conforme a LGPD.
                  </p>

                  {/* METADATA */}
                  <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-audit-gold/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-shield text-audit-gold text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">
                          Conformidade
                        </span>
                        <span className="text-white font-semibold">LGPD Certificada</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-audit-gold/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-lock text-audit-gold text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">
                          Encriptação
                        </span>
                        <span className="text-white font-semibold">SSL/TLS 256-bit</span>
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
                  title="Política de Privacidade - Audit Educa"
                  url={typeof window !== 'undefined' ? window.location.href : 'https://auditeduca.com.br/politica-privacidade'}
                />
              </div>

              {/* SEÇÃO 1: COLETA DE DADOS */}
              <section id="coleta" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Informações que Coletamos
                  </h2>
                </div>

                <div className="space-y-6">
                  <article className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                    <h3 className="text-lg font-bold text-audit-navy mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-audit-gold text-white rounded-full flex items-center justify-center">📝</span>
                      Dados Fornecidos por Você
                    </h3>
                    <ul className="space-y-2 text-slate-600 font-light">
                      <li className="flex gap-3"><span className="text-audit-gold">→</span> Nome completo</li>
                      <li className="flex gap-3"><span className="text-audit-gold">→</span> Endereço de e-mail</li>
                      <li className="flex gap-3"><span className="text-audit-gold">→</span> Número de telefone</li>
                      <li className="flex gap-3"><span className="text-audit-gold">→</span> Dados de empresa/organização</li>
                      <li className="flex gap-3"><span className="text-audit-gold">→</span> Informações inseridas em ferramentas</li>
                    </ul>
                  </article>

                  <article className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                    <h3 className="text-lg font-bold text-audit-navy mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-audit-gold text-white rounded-full flex items-center justify-center">📊</span>
                      Dados Coletados Automaticamente
                    </h3>
                    <ul className="space-y-2 text-slate-600 font-light">
                      <li className="flex gap-3"><span className="text-audit-gold">→</span> Endereço IP</li>
                      <li className="flex gap-3"><span className="text-audit-gold">→</span> Tipo e versão do navegador</li>
                      <li className="flex gap-3"><span className="text-audit-gold">→</span> Páginas visitadas e tempo de acesso</li>
                      <li className="flex gap-3"><span className="text-audit-gold">→</span> Cliques e interações</li>
                      <li className="flex gap-3"><span className="text-audit-gold">→</span> Dados de localização (se autorizado)</li>
                    </ul>
                  </article>
                </div>
              </section>

              {/* SEÇÃO 2: COMO USAMOS */}
              <section id="uso" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Como Usamos Seus Dados
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { icon: 'fa-cog', title: 'Melhorar Serviços', desc: 'Fornecer, manter e aprimorar a plataforma' },
                    { icon: 'fa-envelope', title: 'Comunicação', desc: 'Enviar atualizações e notificações relevantes' },
                    { icon: 'fa-shield-alt', title: 'Segurança', desc: 'Detectar e prevenir fraudes e ataques' },
                    { icon: 'fa-balance-scale', title: 'Conformidade', desc: 'Cumprir obrigações legais e regulatórias' }
                  ].map((item, i) => (
                    <article key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-audit-gold/40 hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-audit-navy to-audit-gold rounded-xl flex items-center justify-center text-white mb-4">
                        <i className={`fas ${item.icon}`}></i>
                      </div>
                      <h3 className="font-bold text-audit-navy mb-2">{item.title}</h3>
                      <p className="text-slate-600 text-sm font-light">{item.desc}</p>
                    </article>
                  ))}
                </div>
              </section>

              {/* SEÇÃO 3: CONFORMIDADE LGPD */}
              <section id="lgpd" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Conformidade com LGPD
                  </h2>
                </div>

                <article className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 md:p-10 border border-green-200 mb-8">
                  <p className="text-green-900 font-semibold mb-6">
                    ✓ Estamos 100% em conformidade com a Lei Geral de Proteção de Dados Brasileira
                  </p>
                  <div className="space-y-3 text-green-800 text-sm font-light">
                    <p className="flex gap-3"><span className="font-bold text-green-600">✓</span> Você pode acessar seus dados pessoais a qualquer momento</p>
                    <p className="flex gap-3"><span className="font-bold text-green-600">✓</span> Você pode solicitar a exclusão completa de seus dados</p>
                    <p className="flex gap-3"><span className="font-bold text-green-600">✓</span> Você pode revogar seu consentimento a qualquer hora</p>
                    <p className="flex gap-3"><span className="font-bold text-green-600">✓</span> Não compartilhamos dados sem consentimento explícito</p>
                    <p className="flex gap-3"><span className="font-bold text-green-600">✓</span> Mantemos dados apenas pelo tempo necessário</p>
                  </div>
                </article>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <i className="fas fa-info-circle text-blue-600"></i>
                    Encarregado de Dados (DPO)
                  </h3>
                  <p className="text-blue-800 text-sm">
                    Responsável pela conformidade LGPD: <strong>privacidade@auditeduca.com.br</strong>
                  </p>
                </div>
              </section>

              {/* SEÇÃO 4: SEGURANÇA */}
              <section id="seguranca" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Segurança dos Dados
                  </h2>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 mb-6">
                  <p className="text-slate-700 font-light leading-relaxed mb-6">
                    Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                      <span className="text-audit-gold font-bold">🔐</span>
                      <span className="text-slate-600 text-sm font-light">Criptografia SSL/TLS para transmissão de dados</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-audit-gold font-bold">🔐</span>
                      <span className="text-slate-600 text-sm font-light">Criptografia de dados em repouso</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-audit-gold font-bold">🔐</span>
                      <span className="text-slate-600 text-sm font-light">Firewalls e monitoramento 24/7</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-audit-gold font-bold">🔐</span>
                      <span className="text-slate-600 text-sm font-light">Controle de acesso e autenticação</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-audit-gold font-bold">🔐</span>
                      <span className="text-slate-600 text-sm font-light">Backups regulares e redundância</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-audit-gold font-bold">🔐</span>
                      <span className="text-slate-600 text-sm font-light">Auditorias de segurança periódicas</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* SEÇÃO 5: SEUS DIREITOS */}
              <section id="direitos" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Seus Direitos
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    {
                      icon: 'fa-eye',
                      title: 'Direito de Acesso',
                      desc: 'Solicitar acesso a todos os dados pessoais que temos sobre você'
                    },
                    {
                      icon: 'fa-pencil',
                      title: 'Direito de Correção',
                      desc: 'Corrigir ou retificar dados pessoais inexatos ou incompletos'
                    },
                    {
                      icon: 'fa-trash',
                      title: 'Direito ao Esquecimento',
                      desc: 'Solicitar a exclusão permanente de seus dados (com exceções legais)'
                    },
                    {
                      icon: 'fa-exchange-alt',
                      title: 'Direito de Portabilidade',
                      desc: 'Receber seus dados em formato estruturado e portável'
                    }
                  ].map((item, i) => (
                    <article key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-audit-gold/40 hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-audit-navy to-audit-gold rounded-xl flex items-center justify-center text-white mb-4">
                        <i className={`fas ${item.icon}`}></i>
                      </div>
                      <h3 className="font-bold text-audit-navy mb-2">{item.title}</h3>
                      <p className="text-slate-600 text-sm font-light">{item.desc}</p>
                    </article>
                  ))}
                </div>
              </section>

              {/* SEÇÃO 6: CONTATO */}
              <section id="contato" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Fale Conosco
                  </h2>
                </div>

                <article className="bg-audit-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-audit-gold/10 rounded-full -mr-48 -mt-48 z-0"></div>
                  <div className="relative z-10">
                    <p className="text-slate-200 mb-6 max-w-2xl font-light">
                      Para qualquer dúvida sobre privacidade ou para exercer seus direitos, contate nosso Encarregado de Dados:
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
                      <p className="font-semibold mb-3 flex items-center gap-2">
                        <i className="fas fa-envelope text-audit-gold"></i>
                        Email
                      </p>
                      <p className="text-audit-gold font-mono text-sm mb-4">privacidade@auditeduca.com.br</p>
                      
                      <p className="font-semibold mb-3 flex items-center gap-2">
                        <i className="fas fa-phone text-audit-gold"></i>
                        Telefone
                      </p>
                      <p className="text-slate-200">(11) 3000-0000</p>
                    </div>
                    <p className="text-xs text-slate-300">
                      Resposta em até 5 dias úteis conforme LGPD
                    </p>
                  </div>
                </article>
              </section>

              {/* INFORMAÇÃO FINAL */}
              <div className="text-center pt-8 border-t border-slate-200">
                <p className="text-xs text-slate-500 font-light">
                  Última atualização: 19 de março de 2026
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Reservamo-nos o direito de alterar esta política. Notificaremos sobre mudanças significativas.
                </p>
              </div>
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

              {/* CERTIFICAÇÃO DE SEGURANÇA */}
              <article className="bg-green-50 rounded-3xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-certificate text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900">LGPD Certificado</h3>
                    <p className="text-xs text-green-700">Conformidade Completa</p>
                  </div>
                </div>
                <p className="text-green-800 text-sm font-light leading-relaxed">
                  A Audit Educa passou por auditoria externa de conformidade LGPD e mantém certificações atualizadas.
                </p>
              </article>

              {/* DOCUMENTO DE PRIVACIDADE */}
              <article className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-audit-gold/40 transition-all duration-300 group">
                <div className="w-full aspect-[3/4] bg-slate-50 rounded-2xl p-3 shadow-inner border border-slate-100 relative overflow-hidden shrink-0 mb-6">
                  <div className="w-full h-full bg-gradient-to-br from-audit-navy to-audit-navy/80 border border-dashed border-slate-300/50 rounded-xl flex flex-col items-center justify-center relative">
                    <i className="fas fa-file-pdf text-6xl text-white/30 mb-4 group-hover:scale-110 group-hover:text-audit-gold/30 transition-all duration-500"></i>
                    <span className="text-xs font-black text-white/50 uppercase tracking-wider text-center px-4">
                      Política de
                      <br />
                      Privacidade 2026
                    </span>
                  </div>
                </div>

                <span className="text-audit-gold font-bold text-xs uppercase tracking-[0.15em] mb-3 block">
                  Download
                </span>
                <p className="text-slate-600 text-sm font-light mb-5">
                  Versão completa em PDF com termos detalhados.
                </p>

                <button
                  className="w-full bg-audit-gold hover:bg-yellow-500 active:scale-95 text-audit-navy font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  onClick={() => showToast('Download iniciado')}
                >
                  <i className="fas fa-download text-sm"></i>
                  Baixar PDF
                </button>
              </article>

              {/* SUAS RESPONSABILIDADES */}
              <article className="bg-blue-50 rounded-3xl p-6 border border-blue-200 shadow-sm">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-info-circle text-blue-600"></i>
                  Suas Responsabilidades
                </h3>
                <ul className="space-y-2 text-blue-800 text-sm font-light">
                  <li className="flex gap-2">
                    <span>→</span>
                    <span>Manter suas credenciais seguras</span>
                  </li>
                  <li className="flex gap-2">
                    <span>→</span>
                    <span>Notificar sobre acessos não autorizados</span>
                  </li>
                  <li className="flex gap-2">
                    <span>→</span>
                    <span>Fornecer dados precisos e atualizados</span>
                  </li>
                  <li className="flex gap-2">
                    <span>→</span>
                    <span>Cumprir as leis aplicáveis</span>
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