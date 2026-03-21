import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const [cookieModalOpen, setCookieModalOpen] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    statistics: false,
    marketing: false
  });
  const [descVisible, setDescVisible] = useState({ desc1: false, desc2: false, desc3: false });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === null) {
      setCookieBannerVisible(true);
    } else {
      try {
        const prefs = JSON.parse(consent);
        setCookiePreferences({
          essential: true,
          statistics: prefs.statistics ?? false,
          marketing: prefs.marketing ?? false
        });
      } catch {
        setCookieBannerVisible(true);
      }
    }
  }, []);

  const acceptAllCookies = () => {
    const prefs = { essential: true, statistics: true, marketing: true };
    setCookiePreferences(prefs);
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    setCookieBannerVisible(false);
    setCookieModalOpen(false);
  };

  const rejectAllCookies = () => {
    const prefs = { essential: true, statistics: false, marketing: false };
    setCookiePreferences(prefs);
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    setCookieBannerVisible(false);
    setCookieModalOpen(false);
  };

  const saveCookiePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(cookiePreferences));
    setCookieBannerVisible(false);
    setCookieModalOpen(false);
  };

  const toggleDescription = (id) => {
    setDescVisible(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openCookieModal = () => {
    setCookieModalOpen(true);
    setCookieBannerVisible(false);
  };

  const closeCookieModal = () => {
    setCookieModalOpen(false);
    if (!localStorage.getItem('cookieConsent')) {
      setCookieBannerVisible(true);
    }
  };

  return (
    <>
      {/* Botão Voltar ao Topo */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-[90] bg-audit-gold dark:bg-yellow-500 text-audit-navy dark:text-gray-900 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50 ${
          showBackToTop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        title="Voltar ao topo"
      >
        <i className="fas fa-arrow-up font-bold"></i>
      </button>

      {/* Botão Cookie FAB */}
      <button
        onClick={openCookieModal}
        className="fixed bottom-20 right-6 z-[90] bg-audit-blue dark:bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50"
        title="Preferências de Cookies"
      >
        <i className="fas fa-cookie-bite text-xl"></i>
      </button>

      {/* Banner de Cookies */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-[0_-5px_20px_rgba(0,0,0,0.15)] z-[100] transform transition-transform duration-500 border-t border-gray-200 dark:border-gray-700 p-5 md:px-10 md:py-6 flex flex-col lg:flex-row items-center justify-between gap-6 ${
          cookieBannerVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex-1 space-y-3 text-center lg:text-left">
          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
            <strong className="text-audit-gold">Seu conhecimento importa e sua privacidade também.</strong><br />
            Nós do Audit Educa utilizamos cookies para aprimorar sua experiência de navegação e analisar nosso tráfego. Queremos assegurar-lhe a melhor utilização possível e a melhoria contínua do nosso website. Assim, podemos também apresentar-lhe conteúdo e publicidade baseados no seu perfil de utilização, e, para isso, trabalhamos em conjunto com parceiro selecionado (Google).
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-semibold text-audit-blue dark:text-audit-gold">
            <Link to="/politica-de-privacidade" className="hover:underline">Privacidade</Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <Link to="/termos-de-uso" className="hover:underline">Termos e Condições</Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <Link to="/notificacoes-legais" className="hover:underline">Notificações Legais</Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          <button
            onClick={openCookieModal}
            className="px-6 py-2.5 rounded-full border-2 border-dashed border-audit-blue dark:border-audit-gold text-audit-blue dark:text-audit-gold font-bold text-sm hover:bg-audit-blue/5 dark:hover:bg-audit-gold/10 transition whitespace-nowrap"
          >
            Personalizar
          </button>
          <button
            onClick={acceptAllCookies}
            className="px-8 py-2.5 rounded-full bg-audit-blue dark:bg-audit-gold text-white dark:text-audit-navy font-bold text-sm shadow-md hover:opacity-90 transition whitespace-nowrap"
          >
            Aceitar
          </button>
        </div>
      </div>

      {/* Modal de Preferências de Cookies */}
      <div
        className={`fixed inset-0 z-[110] bg-black/60 flex justify-center items-end md:items-center transition-all duration-300 backdrop-blur-sm ${
          cookieModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeCookieModal}
      >
        <div
          className={`bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] transform transition-transform duration-300 ${
            cookieModalOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <header className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-2xl">
            <h2 className="text-lg font-bold text-audit-navy dark:text-white">Preferências de Cookies</h2>
            <button
              onClick={closeCookieModal}
              className="text-gray-400 dark:text-gray-500 hover:text-audit-navy dark:hover:text-white text-2xl leading-none"
            >
              &times;
            </button>
          </header>

          <div className="p-5 overflow-y-auto flex-grow space-y-6 custom-scrollbar">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Gerencie suas preferências de privacidade. Algumas funcionalidades podem depender de cookies para funcionar corretamente.
            </p>

            {/* Item 1: Essenciais */}
            <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-3 shadow-sm bg-gray-50/50 dark:bg-gray-700/20">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 dark:bg-gray-600 p-2 rounded-full">
                    <i className="fas fa-shield-alt text-gray-600 dark:text-gray-300 text-sm"></i>
                  </div>
                  <span className="font-bold text-audit-navy dark:text-gray-100 text-sm">Tecnicamente Necessário</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked disabled />
                  <span className="slider round"></span>
                </label>
              </div>
              <button
                onClick={() => toggleDescription('desc1')}
                className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-audit-blue flex items-center gap-1 mt-1 w-full justify-between group"
              >
                <span>Ver detalhes técnicos</span>
                <i className={`fas fa-chevron-down text-[10px] transform transition-transform ${descVisible.desc1 ? 'rotate-180' : ''} group-hover:text-audit-blue`}></i>
              </button>
              <div className={`item-desc mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 ${descVisible.desc1 ? 'block' : 'hidden'}`}>
                <h4 className="text-xs font-bold text-audit-blue dark:text-audit-gold mb-2">Google Tag Manager | BR</h4>
                <table className="cookie-data-table">
                  <tbody>
                    <tr><td className="cookie-label">Empresa</td><td className="cookie-value">Google Ireland Limited<br />Google Building Gordon House, 4 Barrow St, Dublin, D04 E5W5, Ireland</td></tr>
                    <tr><td className="cookie-label">Finalidade</td><td className="cookie-value">Gestão de tags</td></tr>
                    <tr><td className="cookie-label">Tecnologias</td><td className="cookie-value">Cookies, Pixels</td></tr>
                    <tr><td className="cookie-label">Dados</td><td className="cookie-value">Dados agregados sobre disparo de tags</td></tr>
                    <tr><td className="cookie-label">Base Legal</td><td className="cookie-value">Interesses legítimos, Art. 7(9) LGPD</td></tr>
                    <tr><td className="cookie-label">Retenção</td><td className="cookie-value">14 dias após recuperação</td></tr>
                    <tr><td className="cookie-label">Local</td><td className="cookie-value">União Europeia</td></tr>
                    <tr><td className="cookie-label">Transferência</td><td className="cookie-value">Taiwan, Chile, Singapura, EUA</td></tr>
                    <tr><td className="cookie-label">Links</td><td className="cookie-value">
                      <a href="https://business.safety.google/privacy/?hl=en" target="_blank" rel="noopener noreferrer" className="cookie-link">Privacidade</a> | 
                      <a href="https://www.google.com/intl/de/tagmanager/use-policy.html" target="_blank" rel="noopener noreferrer" className="cookie-link">Política de Cookies</a>
                    </td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Item 2: Análise e Estatísticas */}
            <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-3 shadow-sm bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <i className="fas fa-chart-bar text-blue-600 dark:text-blue-400 text-sm"></i>
                  </div>
                  <span className="font-bold text-audit-navy dark:text-gray-100 text-sm">Análise e Estatísticas</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.statistics}
                    onChange={(e) => setCookiePreferences(prev => ({ ...prev, statistics: e.target.checked }))}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <button
                onClick={() => toggleDescription('desc2')}
                className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-audit-blue flex items-center gap-1 mt-1 w-full justify-between group"
              >
                <span>Ver detalhes técnicos</span>
                <i className={`fas fa-chevron-down text-[10px] transform transition-transform ${descVisible.desc2 ? 'rotate-180' : ''} group-hover:text-audit-blue`}></i>
              </button>
              <div className={`item-desc mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 ${descVisible.desc2 ? 'block' : 'hidden'}`}>
                <h4 className="text-xs font-bold text-audit-blue dark:text-audit-gold mb-2">Google Analytics | BR</h4>
                <table className="cookie-data-table">
                  <tbody>
                    <tr><td className="cookie-label">Empresa</td><td className="cookie-value">Google Ireland Limited</td></tr>
                    <tr><td className="cookie-label">Finalidade</td><td className="cookie-value">Análise, ROI, Comportamento do usuário</td></tr>
                    <tr><td className="cookie-label">Tecnologias</td><td className="cookie-value">Pixel, Cookies</td></tr>
                    <tr><td className="cookie-label">Dados</td><td className="cookie-value">Trajeto de cliques, IP, Localização, Dispositivo, Páginas visitadas, Resolução, Sistema Operativo, etc.</td></tr>
                    <tr><td className="cookie-label">Base Legal</td><td className="cookie-value">Art. 6, par. 1 s. 1 al. f RGPD</td></tr>
                    <tr><td className="cookie-label">Retenção</td><td className="cookie-value">Configurável pelo cliente (Google Analytics)</td></tr>
                    <tr><td className="cookie-label">Transferência</td><td className="cookie-value">Singapura, Chile, Taiwan, EUA</td></tr>
                    <tr><td className="cookie-label">Links</td><td className="cookie-value">
                      <a href="https://business.safety.google/privacy/?hl=en" target="_blank" rel="noopener noreferrer" className="cookie-link">Privacidade</a> | 
                      <a href="https://tools.google.com/dlpage/gaoptout?hl=de" target="_blank" rel="noopener noreferrer" className="cookie-link">Opt-out</a>
                    </td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Item 3: Marketing */}
            <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-3 shadow-sm bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                    <i className="fas fa-bullhorn text-yellow-600 dark:text-yellow-400 text-sm"></i>
                  </div>
                  <span className="font-bold text-audit-navy dark:text-gray-100 text-sm">Marketing</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.marketing}
                    onChange={(e) => setCookiePreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <button
                onClick={() => toggleDescription('desc3')}
                className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-audit-blue flex items-center gap-1 mt-1 w-full justify-between group"
              >
                <span>Ver detalhes técnicos</span>
                <i className={`fas fa-chevron-down text-[10px] transform transition-transform ${descVisible.desc3 ? 'rotate-180' : ''} group-hover:text-audit-blue`}></i>
              </button>
              <div className={`item-desc mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 ${descVisible.desc3 ? 'block' : 'hidden'}`}>
                <h4 className="text-xs font-bold text-audit-blue dark:text-audit-gold mb-2">Google Analytics Advertising | BR</h4>
                <table className="cookie-data-table">
                  <tbody>
                    <tr><td className="cookie-label">Empresa</td><td className="cookie-value">Google Ireland Limited</td></tr>
                    <tr><td className="cookie-label">Finalidade</td><td className="cookie-value">Anúncio, Marketing, Remarketing, Segmentação</td></tr>
                    <tr><td className="cookie-label">Tecnologias</td><td className="cookie-value">Cookies, Pixel, JavaScript</td></tr>
                    <tr><td className="cookie-label">Dados</td><td className="cookie-value">Anúncios vistos, IP, Geolocalização, URL referência, Comportamento, Sites visitados.</td></tr>
                    <tr><td className="cookie-label">Base Legal</td><td className="cookie-value">Consentimento, Art. 7(1) LGPD</td></tr>
                    <tr><td className="cookie-label">Retenção</td><td className="cookie-value">Até o fim da necessidade de processamento</td></tr>
                    <tr><td className="cookie-label">Transferência</td><td className="cookie-value">Singapura, Chile, Taiwan, EUA</td></tr>
                    <tr><td className="cookie-label">Links</td><td className="cookie-value">
                      <a href="https://business.safety.google/privacy/?hl=en" target="_blank" rel="noopener noreferrer" className="cookie-link">Privacidade</a>
                    </td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <footer className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl flex flex-col sm:flex-row gap-3">
            <button
              onClick={rejectAllCookies}
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
            >
              Rejeitar Tudo
            </button>
            <button
              onClick={saveCookiePreferences}
              className="flex-1 px-4 py-3 rounded-full bg-audit-blue dark:bg-audit-gold text-white dark:text-audit-navy font-bold shadow-lg hover:opacity-90 transition text-sm"
            >
              Salvar Minhas Opções
            </button>
          </footer>
        </div>
      </div>

      {/* Rodapé Principal */}
      <footer id="footer" className="bg-audit-navy/95 dark:bg-gray-900/95 backdrop-blur-lg text-gray-300 dark:text-gray-300 pt-16 border-t border-white/10 dark:border-gray-700/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
            <div>
              <h3 className="text-white dark:text-gray-100 font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-audit-gold rounded-full"></span> Institucional
              </h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/sobre-nos" className="hover:text-audit-gold transition text-gray-300 dark:text-gray-400">Sobre Nós</Link></li>
                <li><Link to="/privacidade" className="hover:text-audit-gold transition text-gray-300 dark:text-gray-400">Políticas do Site</Link></li>
                <li><Link to="/mapa-do-site" className="hover:text-audit-gold transition text-gray-300 dark:text-gray-400">Mapa do Site</Link></li>
              </ul>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-white dark:text-gray-100 font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-audit-gold rounded-full"></span> Acessibilidade Digital
                </h3>
                <ul className="space-y-3 text-sm">
                  <li><Link to="/politica-de-acessibilidade" className="hover:text-audit-gold transition text-gray-300 dark:text-gray-400">Política de Acessibilidade</Link></li>
                  <li><Link to="/recursos-assistivos" className="hover:text-audit-gold transition text-gray-300 dark:text-gray-400">Recursos Assistivos</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white dark:text-gray-100 font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-audit-gold rounded-full"></span> Sustentabilidade Digital
                </h3>
                <ul className="space-y-3 text-sm">
                  <li><Link to="/sustentabilidade-digital" className="hover:text-audit-gold transition text-gray-300 dark:text-gray-400">Nosso Compromisso</Link></li>
                  <li><Link to="/pegada-de-carbono" className="hover:text-audit-gold transition text-gray-300 dark:text-gray-400">Pegada de Carbono</Link></li>
                  <li><Link to="/tecnologia-verde" className="hover:text-audit-gold transition text-gray-300 dark:text-gray-400">Tecnologia Verde</Link></li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-white dark:text-gray-100 font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-audit-gold rounded-full"></span> Nosso Compromisso
              </h3>
              <p className="text-sm leading-relaxed text-gray-400 dark:text-gray-500 mb-6">
                Nosso site adota como princípio de governança, o comprometimento com elevados padrões de acessibilidade digital, sustentabilidade digital e proteção de dados.
              </p>
              <div className="bg-audit-blue/30 dark:bg-black/20 p-4 rounded-lg flex flex-wrap justify-center gap-4 border border-audit-gold/20 shadow-inner">
                <img src="/assets/images/selo-privacidadede-dados.webp" alt="Selo Privacidade de Dados" className="h-10 w-auto" onError={(e) => e.target.style.display = 'none'} />
                <img src="/assets/images/selo-acessibilidade-digital.webp" alt="Selo Acessibilidade Digital" className="h-10 w-auto" onError={(e) => e.target.style.display = 'none'} />
                <img src="/assets/images/selo-sustentabilidade-digital.webp" alt="Selo Sustentabilidade Digital" className="h-10 w-auto" onError={(e) => e.target.style.display = 'none'} />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 dark:border-gray-700/10 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-400 gap-4">
              <div className="flex flex-col items-center md:items-start space-y-2">
                <p className="order-last md:order-first text-gray-500 dark:text-gray-400">
                  &copy; {currentYear} Audit Educa. Todos os direitos reservados.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
                  <Link to="/privacidade" className="hover:text-audit-gold transition">Central de Privacidade</Link>
                  <Link to="/notificacoes-legais" className="hover:text-audit-gold transition">Notificações Legais</Link>
                  <Link to="/termos-de-uso" className="hover:text-audit-gold transition">Configurações</Link>
                </div>
              </div>
              <div className="flex gap-4 text-xl text-white dark:text-gray-300">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-audit-gold transition" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-audit-gold transition" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-audit-gold transition" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-audit-gold transition" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .toggle-switch {
          position: relative; display: inline-block; width: 44px; height: 24px;
        }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc; transition: .4s;
        }
        .slider:before {
          position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
          background-color: white; transition: .4s;
        }
        input:checked + .slider { background-color: #1e40af; }
        input:focus + .slider { box-shadow: 0 0 1px #1e40af; }
        input:checked + .slider:before { transform: translateX(20px); }
        .slider.round { border-radius: 34px; }
        .slider.round:before { border-radius: 50%; }
        .dark input:checked + .slider { background-color: #fbbf24; }
        .item-desc { transition: all 0.3s ease-in-out; }
        .cookie-data-table { width: 100%; border-collapse: collapse; font-size: 0.75rem; margin-top: 0.5rem; }
        .cookie-data-table td { padding: 4px 0; vertical-align: top; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .dark .cookie-data-table td { border-bottom: 1px solid rgba(255,255,255,0.05); }
        .cookie-label { font-weight: 700; width: 35%; color: #4b5563; }
        .dark .cookie-label { color: #9ca3af; }
        .cookie-value { color: #6b7280; }
        .dark .cookie-value { color: #d1d5db; }
        .cookie-link { color: #1e40af; text-decoration: underline; }
        .dark .cookie-link { color: #fbbf24; }
      `}</style>
    </>
  );
};

export default Footer;