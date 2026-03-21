import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotificacoesLegais = () => {
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const tourSteps = [
    { id: 'hero', text: 'Bem-vindo aos Termos de Uso e Notificações Legais do Audit Educa.' },
    { id: 'propriedade', text: 'Entenda como protegemos nosso Ativo Intangível (Direitos Autorais).' },
    { id: 'responsabilidade', text: 'Limitação de Escopo: Nosso conteúdo é educacional, não consultoria.' },
    { id: 'termos', text: 'Regras de convivência, cadastro e uso ético da plataforma.' }
  ];

  // Preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreloaderVisible(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll spy for sidebar active class
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'propriedade', 'responsabilidade', 'termos'];
      const scrollPos = window.scrollY + 200;
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const offsetTop = el.offsetTop;
          const offsetBottom = offsetTop + el.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toast function
  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  // Tour functions
  const startTour = () => {
    setTourActive(true);
    setTourStep(0);
  };

  const nextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setTourActive(false);
    }
  };

  const endTour = () => {
    setTourActive(false);
  };

  // Scroll to section for tour
  useEffect(() => {
    if (tourActive && tourSteps[tourStep]) {
      const el = document.getElementById(tourSteps[tourStep].id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [tourStep, tourActive]);

  return (
    <>
      {/* Preloader */}
      {preloaderVisible && (
        <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center transition-opacity duration-500" style={{ opacity: preloaderVisible ? 1 : 0 }}>
          <div className="animate-pulse text-audit-gold text-2xl font-serif font-bold">Audit Educa...</div>
        </div>
      )}

      {/* Toast */}
      <div
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 bg-audit-navy text-white px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 z-[2000] pointer-events-none border border-white/10 backdrop-blur-md ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {toastMessage}
      </div>

      {/* Header */}
      <Header />

      {/* Sidebar Tools (Navegação Interna) */}
      <aside className="sidebar-left-tools no-print" aria-label="Navegação Legal">
        <a
          href="#hero"
          className={`tool-btn ${activeSection === 'hero' ? 'active' : ''}`}
          title="Visão Geral"
          aria-label="Visão Geral"
          onClick={(e) => { e.preventDefault(); document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }); }}
        >
          <i className="fas fa-gavel" aria-hidden="true"></i>
          <span className="btn-label">Geral</span>
        </a>
        <a
          href="#propriedade"
          className={`tool-btn ${activeSection === 'propriedade' ? 'active' : ''}`}
          title="Propriedade Intelectual"
          aria-label="Direitos Autorais"
          onClick={(e) => { e.preventDefault(); document.getElementById('propriedade')?.scrollIntoView({ behavior: 'smooth' }); }}
        >
          <i className="fas fa-copyright" aria-hidden="true"></i>
          <span className="btn-label">Autoria</span>
        </a>
        <a
          href="#responsabilidade"
          className={`tool-btn ${activeSection === 'responsabilidade' ? 'active' : ''}`}
          title="Isenção de Responsabilidade"
          aria-label="Limitação de Responsabilidade"
          onClick={(e) => { e.preventDefault(); document.getElementById('responsabilidade')?.scrollIntoView({ behavior: 'smooth' }); }}
        >
          <i className="fas fa-balance-scale-right" aria-hidden="true"></i>
          <span className="btn-label">Isenção</span>
        </a>
        <a
          href="#termos"
          className={`tool-btn ${activeSection === 'termos' ? 'active' : ''}`}
          title="Termos de Uso"
          aria-label="Regras de Uso"
          onClick={(e) => { e.preventDefault(); document.getElementById('termos')?.scrollIntoView({ behavior: 'smooth' }); }}
        >
          <i className="fas fa-file-contract" aria-hidden="true"></i>
          <span className="btn-label">Termos</span>
        </a>

        <button className="tool-btn" onClick={startTour} title="Resumo Guiado" aria-label="Iniciar resumo guiado">
          <i className="fas fa-magic text-audit-gold" aria-hidden="true"></i>
          <span className="btn-label">Resumo</span>
        </button>
      </aside>

      {/* Tour Popover */}
      {tourActive && (
        <div id="tour-container">
          <div
            className="tour-popover fixed bg-white p-5 rounded-xl shadow-floating border-t-4 border-audit-gold z-[1302] w-72 transition-all duration-300"
            style={{
              top: (() => {
                const el = document.getElementById(tourSteps[tourStep].id);
                if (!el) return '50%';
                const rect = el.getBoundingClientRect();
                if (window.innerHeight - rect.bottom < 200) {
                  return rect.top - 180;
                }
                return rect.bottom + 15;
              })(),
              left: Math.max(10, document.getElementById(tourSteps[tourStep].id)?.getBoundingClientRect().left || 10)
            }}
          >
            <p className="text-xs font-bold text-audit-navy mb-3 uppercase tracking-widest">
              Guia Legal ({tourStep + 1}/{tourSteps.length})
            </p>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">{tourSteps[tourStep].text}</p>
            <div className="flex justify-between items-center">
              <button
                onClick={endTour}
                className="text-[10px] font-bold text-slate-400 uppercase hover:text-red-500"
              >
                Sair
              </button>
              <button
                onClick={nextTourStep}
                className="bg-audit-gold text-audit-navy px-4 py-2 rounded-lg text-[10px] font-bold uppercase shadow-sm"
              >
                {tourStep === tourSteps.length - 1 ? 'Concluir' : 'Próximo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto content-wrapper">
          {/* Breadcrumb */}
          <nav className="mb-8 no-print flex mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><a href="/" className="hover:text-audit-goldDark transition focus:outline-none focus:underline">Home</a></li>
              <li><i className="fas fa-chevron-right text-[8px]" aria-hidden="true"></i></li>
              <li>Institucional</li>
              <li><i className="fas fa-chevron-right text-[8px]" aria-hidden="true"></i></li>
              <li className="text-audit-goldDark underline underline-offset-4" aria-current="page">Notificações Legais</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div id="hero" className="bg-white rounded-3xl p-10 md:p-16 shadow-card border border-slate-200 relative overflow-hidden mb-20 group">
            <div className="absolute inset-0 z-0 opacity-5">
              <img
                src="https://placehold.co/1200x800/0f172a/ffffff?text=Legal+Compliance"
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative z-10 max-w-4xl">
              <span className="inline-block py-1.5 px-4 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold tracking-widest uppercase mb-6 border border-slate-200">
                <i className="fas fa-check-double text-[8px] align-middle mr-2 mb-0.5 text-audit-gold"></i> Última Revisão: Fev/2026
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-audit-navy mb-6 leading-tight">
                Notificações <span className="text-audit-gold">Legais</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8 font-light max-w-3xl">
                A transparência é a base de qualquer auditoria. Aqui definimos os limites de escopo, responsabilidades e a proteção dos nossos ativos intelectuais.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider pt-8 border-t border-slate-100">
                <span className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  <i className="fas fa-gavel text-audit-gold"></i> Lei 9.610/98 (Direitos Autorais)
                </span>
                <span className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  <i className="fas fa-globe text-audit-gold"></i> Marco Civil da Internet
                </span>
                <span className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  <i className="fas fa-code-branch text-audit-gold"></i> Licenciamento
                </span>
              </div>
            </div>
          </div>

          {/* 1. Propriedade Intelectual */}
          <div id="propriedade" className="mb-32 scroll-mt-40">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              <div className="lg:w-1/3 lg:sticky lg:top-40">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-1 bg-audit-navy rounded-full"></div>
                  <span className="text-audit-goldDark font-bold text-xs uppercase tracking-widest">Ativos Intangíveis</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-audit-navy mb-6 leading-tight">Direitos Autorais e Propriedade Intelectual</h2>
                <blockquote className="text-slate-600 italic border-l-4 border-audit-navy pl-6 py-2 text-lg leading-relaxed font-light">
                  "Todo o conteúdo deste portal constitui ativo intelectual protegido, análogo a um Ativo Intangível (CPC 04 / IAS 38)."
                </blockquote>
              </div>
              <div className="lg:w-2/3 space-y-8">
                <div className="prose text-slate-600 max-w-none mb-8">
                  <p>O Audit Educa detém a titularidade exclusiva sobre textos, imagens, logotipos, vídeos e códigos-fonte presentes neste domínio, salvo indicação expressa em contrário (conteúdo de terceiros devidamente creditado).</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                    <h3 className="text-green-800 font-bold mb-3 flex items-center gap-2">
                      <i className="fas fa-check-circle"></i> Uso Permitido
                    </h3>
                    <ul className="text-sm text-green-700 space-y-2">
                      <li>• Citação de pequenos trechos com link direto para a fonte (backlink).</li>
                      <li>• Uso para fins de estudo pessoal e intransferível.</li>
                      <li>• Compartilhamento de links nas redes sociais.</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                    <h3 className="text-red-800 font-bold mb-3 flex items-center gap-2">
                      <i className="fas fa-ban"></i> Uso Proibido
                    </h3>
                    <ul className="text-sm text-red-700 space-y-2">
                      <li>• Reprodução total ou parcial sem autorização prévia (Clonagem de UI).</li>
                      <li>• Uso comercial de materiais gratuitos.</li>
                      <li>• Data mining ou uso de bots para extração de dados.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Isenção de Responsabilidade */}
          <div id="responsabilidade" className="mb-32 scroll-mt-40">
            <div className="bg-slate-50 rounded-[3rem] p-10 lg:p-16 border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <i className="fas fa-balance-scale text-9xl text-audit-navy"></i>
              </div>
              <div className="max-w-4xl mx-auto relative z-10">
                <span className="text-audit-goldDark font-bold text-xs uppercase tracking-widest mb-4 block">Limitação de Escopo</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy mb-8">Natureza Educacional vs. Consultoria Profissional</h2>
                <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-audit-gold mb-8">
                  <p className="text-slate-700 leading-relaxed font-medium">
                    <i className="fas fa-exclamation-circle text-audit-gold mr-2"></i> Aviso Importante:
                  </p>
                  <p className="text-slate-600 mt-2 leading-relaxed">
                    O conteúdo disponibilizado no Audit Educa tem caráter estritamente <strong>informativo e educacional</strong>. Embora busquemos a máxima precisão técnica baseada nas normas (NBCs, IFRS, ISA), as informações aqui contidas <strong>não substituem o julgamento profissional</strong> de um auditor independente ou consultor contábil em casos concretos.
                  </p>
                </div>
                <div className="space-y-4 text-slate-600 text-sm">
                  <div className="legal-clause">
                    <strong className="text-audit-navy block mb-1">1. Atualização Normativa</strong>
                    Normas contábeis e fiscais mudam frequentemente. Não garantimos que todo o conteúdo esteja sincronizado em tempo real com as últimas revisões do CFC/CVM.
                  </div>
                  <div className="legal-clause">
                    <strong className="text-audit-navy block mb-1">2. Decisões de Negócio</strong>
                    O Audit Educa e seus autores não se responsabilizam por quaisquer perdas ou danos (diretos ou indiretos) decorrentes do uso das informações aqui publicadas para tomada de decisões financeiras.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Termos de Uso */}
          <div id="termos" className="mb-32 scroll-mt-40">
            <div className="flex items-center gap-3 justify-center lg:justify-start mb-10">
              <div className="bg-audit-navy p-3 rounded-lg text-white">
                <i className="fas fa-file-signature" aria-hidden="true"></i>
              </div>
              <h2 className="text-3xl font-serif font-bold text-audit-navy">Termos de Uso do Portal</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-audit-goldDark transition-all duration-300 shadow-sm hover:shadow-lg">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-audit-navy mb-6 text-xl">
                  <i className="fas fa-user-shield"></i>
                </div>
                <h3 className="font-bold text-audit-navy text-lg mb-3">Acesso e Cadastro</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Ao se cadastrar, você garante que as informações fornecidas são verdadeiras. O compartilhamento de credenciais de acesso (login) é estritamente proibido e pode levar à suspensão da conta.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-audit-goldDark transition-all duration-300 shadow-sm hover:shadow-lg">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-audit-navy mb-6 text-xl">
                  <i className="fas fa-comments"></i>
                </div>
                <h3 className="font-bold text-audit-navy text-lg mb-3">Conduta nos Comentários</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Promovemos um ambiente de debate técnico. Comentários ofensivos, spam, ou que violem a ética profissional (NBC PG 100) serão removidos sem aviso prévio.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-audit-goldDark transition-all duration-300 shadow-sm hover:shadow-lg">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-audit-navy mb-6 text-xl">
                  <i className="fas fa-external-link-alt"></i>
                </div>
                <h3 className="font-bold text-audit-navy text-lg mb-3">Links Externos</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Podemos conter links para sites de terceiros (ex: Planalto, CFC). Não exercemos controle e não assumimos responsabilidade pelo conteúdo ou práticas dessas "Entidades Relacionadas".
                </p>
              </div>
            </div>
          </div>

          {/* Footer Grid (Contato Legal) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-slate-200 pt-20">
            <div className="lg:col-span-8">
              <div className="bg-audit-navy p-10 rounded-3xl shadow-2xl text-white relative overflow-hidden group mb-12">
                <div className="absolute inset-0 opacity-10 z-0">
                  <img src="https://placehold.co/800x400/0f172a/ffffff?text=Juridico+Compliance" alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-bold mb-2">Dúvidas?</h3>
                    <p className="text-sm font-light leading-relaxed text-slate-300">
                      Para notificações de infração de direitos autorais ou esclarecimentos sobre nossos termos, entre em contato conosco.
                    </p>
                  </div>
                  <div className="w-full md:w-auto">
                    <a
                      href="mailto:juridico@auditeduca.com.br"
                      className="inline-block w-full text-center p-4 bg-white text-audit-navy font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-audit-gold transition shadow-lg"
                    >
                      Entre em contato
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 h-full">
                <h3 className="text-sm font-bold text-audit-navy mb-4 uppercase tracking-wider">
                  <i className="fas fa-map-marker-alt text-audit-gold mr-2"></i> Foro e Jurisdição
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-mono">
                  Fica eleito o Foro da Comarca de São Paulo/SP para dirimir quaisquer questões oriundas destes Termos de Uso, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Styles específicos da página */}
      <style>{`
        .sidebar-left-tools {
            position: fixed; left: 0; top: 50%; transform: translateY(-50%);
            display: flex; flex-direction: column; gap: 12px; z-index: 900; padding: 10px 0;
        }
        .tool-btn {
            background-color: white; color: #0f172a; border: 1px solid #e2e8f0; border-left: none;
            width: 54px; height: 54px; border-radius: 0 14px 14px 0;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 4px 0 10px rgba(0, 0, 0, 0.05);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; outline: none; text-decoration: none;
        }
        .tool-btn:focus-visible { outline: 2px solid #C5A059; outline-offset: 2px; }
        .tool-btn:hover, .tool-btn.active { width: 65px; background-color: #0f172a; color: #C5A059; padding-left: 5px; }
        .btn-label {
            display: none; position: absolute; left: 60px; background: #0f172a; color: white;
            padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: bold;
            white-space: nowrap; pointer-events: none; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            opacity: 0; transform: translateX(-10px); transition: all 0.2s;
        }
        .tool-btn:hover .btn-label { display: block; opacity: 1; transform: translateX(0); }

        @media (max-width: 768px) {
            .sidebar-left-tools {
                top: auto; bottom: 0; left: 0; width: 100%; height: 70px;
                flex-direction: row; transform: none; justify-content: space-around;
                align-items: center; background: white; border-top: 1px solid #e2e8f0;
                border-radius: 0; box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.08); padding: 0 5px; z-index: 1001;
            }
            .tool-btn { border: none; width: auto; height: 100%; flex: 1; gap: 4px; box-shadow: none; background: transparent; border-radius: 8px; color: #64748b; }
            .tool-btn:hover, .tool-btn.active { width: auto; background: transparent; color: #0f172a; padding-left: 0; }
            .btn-label { display: block; position: static; background: transparent; color: currentColor; font-size: 9px; padding: 0; box-shadow: none; opacity: 1; transform: none; }
            body { padding-bottom: 90px; }
        }

        .tour-popover {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .legal-clause {
            border-left: 3px solid #e2e8f0;
            padding-left: 1.5rem;
            transition: all 0.3s;
        }
        .legal-clause:hover {
            border-left-color: #C5A059;
            background-color: #f8fafc;
        }
      `}</style>
    </>
  );
};

export default NotificacoesLegais;