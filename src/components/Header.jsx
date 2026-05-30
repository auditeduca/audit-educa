import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Link } from 'react-router-dom';

const Header = forwardRef((props, ref) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState(null);
  const [activeMegaPanel, setActiveMegaPanel] = useState(null);
  const [activeTab, setActiveTab] = useState({ panel: 'sobre', tab: 'sobre-inst' });
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [fontSize, setFontSize] = useState(100);

  const hoverTimeout = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isMobileMenuOpen]);

  const toggleMobileSubmenu = (id) => {
    setActiveMobileSubmenu(activeMobileSubmenu === id ? null : id);
  };

  const handleMouseEnter = (panelId) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setActiveMegaPanel(panelId);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setActiveMegaPanel(null);
    }, 200);
  };

  const handleTabClick = (panel, tab) => {
    setActiveTab({ panel, tab });
  };

  const increaseFont = () => setFontSize(prev => Math.min(prev + 10, 150));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 10, 70));

  return (
    <>
      {/* ========= MENU MOBILE ========= */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[2000] ${isMobileMenuOpen ? '' : 'hidden'}`}
        aria-labelledby="mobile-menu-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
        <div
          className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/assets/images/logotipo-audit-educa-default.webp" alt="Logotipo Audit Educa" className="h-8 w-auto" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-audit-gold text-lg p-2"
              aria-label="Fechar menu"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
          <h2 id="mobile-menu-title" className="sr-only">Menu de Navegação Principal</h2>

          <nav className="flex-1 overflow-y-auto custom-scroll p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/" className="block py-3 px-2 text-gray-800 dark:text-gray-200 font-bold border-b border-gray-100 dark:border-gray-800 hover:text-audit-gold transition-colors">
                  Início
                </Link>
              </li>
              
              {/* Sobre Nós */}
              <li>
                <button
                  onClick={() => toggleMobileSubmenu('sobre')}
                  className="w-full flex justify-between items-center py-3 px-2 text-gray-800 dark:text-gray-200 font-bold border-b border-gray-100 dark:border-gray-800 hover:text-audit-gold transition-colors"
                  aria-expanded={activeMobileSubmenu === 'sobre'}
                  aria-controls="mob-submenu-sobre"
                >
                  Sobre Nós <i className={`fas fa-chevron-down text-xs transition-transform ${activeMobileSubmenu === 'sobre' ? 'rotate-180' : ''}`}></i>
                </button>
                <div
                  id="mob-submenu-sobre"
                  className={`mobile-submenu bg-gray-50 dark:bg-slate-800/50 rounded-lg mt-1 overflow-hidden transition-all duration-300 ${
                    activeMobileSubmenu === 'sobre' ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <ul className="p-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li><Link to="/sobre-nos" className="block py-2 px-4 hover:text-audit-gold">Institucional</Link></li>
                    {/* <li><Link to="/sobre-o-criador" className="block py-2 px-4 hover:text-audit-gold">O Criador</Link></li> */}
                    <li><Link to="/politica-de-acessibilidade" className="block py-2 px-4 hover:text-audit-gold">Acessibilidade</Link></li>
                    <li><Link to="/de-olho-na-acessibilidade" className="block py-2 px-4 hover:text-audit-gold">De Olho na Acessibilidade</Link></li>
                    <li><Link to="/tecnologia-verde" className="block py-2 px-4 hover:text-audit-gold">Sustentabilidade</Link></li>
                    <li><Link to="/politica-de-privacidade" className="block py-2 px-4 hover:text-audit-gold">Políticas</Link></li>
                    <li><Link to="/mapa-do-site" className="block py-2 px-4 hover:text-audit-gold">Mapa do Site</Link></li>
                    <li><Link to="/busca-e-conteudo" className="block py-2 px-4 hover:text-audit-gold">Busca e Conteúdo</Link></li>
                  </ul>
                </div>
              </li>

              {/* Conteúdo */}
              <li>
                <button
                  onClick={() => toggleMobileSubmenu('conteudo')}
                  className="w-full flex justify-between items-center py-3 px-2 text-gray-800 dark:text-gray-200 font-bold border-b border-gray-100 dark:border-gray-800 hover:text-audit-gold transition-colors"
                  aria-expanded={activeMobileSubmenu === 'conteudo'}
                  aria-controls="mob-submenu-conteudo"
                >
                  Conteúdo <i className={`fas fa-chevron-down text-xs transition-transform ${activeMobileSubmenu === 'conteudo' ? 'rotate-180' : ''}`}></i>
                </button>
                <div
                  id="mob-submenu-conteudo"
                  className={`mobile-submenu bg-gray-50 dark:bg-slate-800/50 rounded-lg mt-1 overflow-hidden transition-all duration-300 ${
                    activeMobileSubmenu === 'conteudo' ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <ul className="p-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li><Link to="/busca-e-conteudo?categoria=auditoria" className="block py-2 px-4 hover:text-audit-gold">Auditoria</Link></li>
                    <li><Link to="/busca-e-conteudo?categoria=contabilidade" className="block py-2 px-4 hover:text-audit-gold">Contabilidade</Link></li>
                    <li><Link to="/busca-e-conteudo?categoria=esg" className="block py-2 px-4 hover:text-audit-gold">ESG</Link></li>
                    <li><Link to="/busca-e-conteudo?categoria=tributario" className="block py-2 px-4 hover:text-audit-gold">Tributário</Link></li>
                  </ul>
                </div>
              </li>

              {/* Ferramentas */}
              <li>
                <button
                  onClick={() => toggleMobileSubmenu('ferramentas')}
                  className="w-full flex justify-between items-center py-3 px-2 text-gray-800 dark:text-gray-200 font-bold border-b border-gray-100 dark:border-gray-800 hover:text-audit-gold transition-colors"
                  aria-expanded={activeMobileSubmenu === 'ferramentas'}
                  aria-controls="mob-submenu-ferramentas"
                >
                  Ferramentas <i className={`fas fa-chevron-down text-xs transition-transform ${activeMobileSubmenu === 'ferramentas' ? 'rotate-180' : ''}`}></i>
                </button>
                <div
                  id="mob-submenu-ferramentas"
                  className={`mobile-submenu bg-gray-50 dark:bg-slate-800/50 rounded-lg mt-1 overflow-hidden transition-all duration-300 ${
                    activeMobileSubmenu === 'ferramentas' ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <ul className="p-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {/* <li><Link to="/checklists" className="block py-2 px-4 hover:text-audit-gold">Checklists</Link></li>
                    <li><Link to="/planilhas" className="block py-2 px-4 hover:text-audit-gold">Planilhas</Link></li> */}
                    <li className="px-4 py-1 text-xs font-bold text-audit-gold uppercase mt-2">Financeira</li>
                    {/* <li><Link to="/calculadora-juros-simples" className="block py-2 px-4 hover:text-audit-gold">Calculadora de Juros Simples</Link></li> */}
                    <li className="px-4 py-1 text-xs font-bold text-audit-gold uppercase mt-2">Trabalhista</li>
                    {/* <li><Link to="/calculadora-de-salario-liquido" className="block py-2 px-4 hover:text-audit-gold">Calculadora de Salário Líquido</Link></li>
                    <li><Link to="/calculadora-de-ferias" className="block py-2 px-4 hover:text-audit-gold">Calculadora de Férias</Link></li> */}
                  </ul>
                </div>
              </li>

              {/* Carreiras */}
              <li>
                <button
                  onClick={() => toggleMobileSubmenu('carreiras')}
                  className="w-full flex justify-between items-center py-3 px-2 text-gray-800 dark:text-gray-200 font-bold border-b border-gray-100 dark:border-gray-800 hover:text-audit-gold transition-colors"
                  aria-expanded={activeMobileSubmenu === 'carreiras'}
                  aria-controls="mob-submenu-carreiras"
                >
                  Carreiras <i className={`fas fa-chevron-down text-xs transition-transform ${activeMobileSubmenu === 'carreiras' ? 'rotate-180' : ''}`}></i>
                </button>
                <div
                  id="mob-submenu-carreiras"
                  className={`mobile-submenu bg-gray-50 dark:bg-slate-800/50 rounded-lg mt-1 overflow-hidden transition-all duration-300 ${
                    activeMobileSubmenu === 'carreiras' ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <ul className="p-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {/* <li><Link to="/vagas" className="block py-2 px-4 hover:text-audit-gold">Vagas</Link></li>
                    <li><Link to="/trilhas" className="block py-2 px-4 hover:text-audit-gold">Trilhas</Link></li> */}
                  </ul>
                </div>
              </li>

              {/* Fale Conosco */}
              <li>
                <button
                  onClick={() => toggleMobileSubmenu('fale')}
                  className="w-full flex justify-between items-center py-3 px-2 text-gray-800 dark:text-gray-200 font-bold border-b border-gray-100 dark:border-gray-800 hover:text-audit-gold transition-colors"
                  aria-expanded={activeMobileSubmenu === 'fale'}
                  aria-controls="mob-submenu-fale"
                >
                  Fale Conosco <i className={`fas fa-chevron-down text-xs transition-transform ${activeMobileSubmenu === 'fale' ? 'rotate-180' : ''}`}></i>
                </button>
                <div
                  id="mob-submenu-fale"
                  className={`mobile-submenu bg-gray-50 dark:bg-slate-800/50 rounded-lg mt-1 overflow-hidden transition-all duration-300 ${
                    activeMobileSubmenu === 'fale' ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <ul className="p-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {/* <li><Link to="/canais" className="block py-2 px-4 hover:text-audit-gold">Canais</Link></li>
                    <li><Link to="/faq" className="block py-2 px-4 hover:text-audit-gold">FAQ</Link></li>
                    <li><Link to="/parcerias" className="block py-2 px-4 hover:text-audit-gold">Parcerias</Link></li> */}
                    <li><Link to="/fale-conosco" className="block py-2 px-4 hover:text-audit-gold">Central de Contato</Link></li>
                  </ul>
                </div>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500 uppercase font-bold">Idioma</span>
              <div className="flex gap-2">
                <button aria-label="Português"><img src="/assets/images/flags/bandeira-brasil.webp" alt="Brasil" className="w-6 h-auto rounded opacity-50 hover:opacity-100" /></button>
                <button aria-label="English"><img src="/assets/images/flags/flag-united-kingdom.webp" alt="UK" className="w-6 h-auto rounded opacity-50 hover:opacity-100" /></button>
                <button aria-label="Español"><img src="/assets/images/flags/bandera-espana.webp" alt="España" className="w-6 h-auto rounded opacity-50 hover:opacity-100" /></button>
              </div>
            </div>
            <Link to="/fale-conosco" className="block w-full text-center py-2 bg-audit-gold text-white rounded font-bold text-sm hover:bg-audit-goldDark transition-colors">
              Entrar / Área do Aluno
            </Link>
          </div>
        </div>
      </div>

      {/* ========= HEADER DESKTOP ========= */}
      <header
        ref={ref}
        id="header"
        className="fixed w-full top-0 z-[2000] transition-all duration-300 font-sans group bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
        onMouseLeave={handleMouseLeave}
      >
        <div className="bg-white dark:bg-gray-900 shadow-sm relative z-[2000]">
          <div className="py-1 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs">
              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 w-full lg:w-auto">
                <div className="flex gap-2 items-center">
                  <button onClick={decreaseFont} className="hover:text-audit-gold font-bold transition px-1 p-1" aria-label="Diminuir fonte">A-</button>
                  <button onClick={increaseFont} className="hover:text-audit-gold font-bold transition px-1 p-1" aria-label="Aumentar fonte">A+</button>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="hover:text-audit-gold transition ml-2 p-1"
                    aria-label="Alternar tema"
                  >
                    <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                  </button>
                </div>
                <nav className="hidden lg:flex items-center gap-1 border-l border-gray-300 dark:border-gray-600 pl-4 ml-2" aria-label="Navegação de Atalho">
                  <a href="#header" className="w-24 text-center py-1 bg-gray-100/50 dark:bg-white/5 hover:bg-audit-gold hover:text-white rounded transition text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Topo</a>
                  <a href="#main-content" className="w-24 text-center py-1 bg-gray-100/50 dark:bg-white/5 hover:bg-audit-gold hover:text-white rounded transition text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Conteúdo</a>
                  <a href="#footer" className="w-24 text-center py-1 bg-gray-100/50 dark:bg-white/5 hover:bg-audit-gold hover:text-white rounded transition text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Rodapé</a>
                </nav>
              </div>
            </div>
          </div>

          <div className="py-3 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <div className="flex items-center shrink-0">
                <Link to="/" className="flex items-center gap-2" aria-label="Página inicial">
                  <img src="/assets/images/logotipo-audit-educa-default.webp" alt="Audit Educa" className="h-10 w-auto" />
                </Link>
              </div>

              <nav className="hidden lg:flex items-center gap-1 h-10" aria-label="Menu Principal">
                <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-audit-gold transition">Início</Link>

                <div className="relative" onMouseEnter={() => handleMouseEnter('sobre')}>
                  <button className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-audit-gold transition flex items-center gap-1">
                    Sobre Nós <i className="fas fa-chevron-down text-[10px] opacity-50"></i>
                  </button>
                </div>

                <div className="relative" onMouseEnter={() => handleMouseEnter('conteudo')}>
                  <button className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-audit-gold transition flex items-center gap-1">
                    Conteúdo <i className="fas fa-chevron-down text-[10px] opacity-50"></i>
                  </button>
                </div>

                <div className="relative" onMouseEnter={() => handleMouseEnter('ferramentas')}>
                  <button className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-audit-gold transition flex items-center gap-1">
                    Ferramentas <i className="fas fa-chevron-down text-[10px] opacity-50"></i>
                  </button>
                </div>

                <div className="relative" onMouseEnter={() => handleMouseEnter('carreiras')}>
                  <button className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-audit-gold transition flex items-center gap-1">
                    Carreiras <i className="fas fa-chevron-down text-[10px] opacity-50"></i>
                  </button>
                </div>

                <div className="relative" onMouseEnter={() => handleMouseEnter('fale')}>
                  <button className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-audit-gold transition flex items-center gap-1">
                    Fale Conosco <i className="fas fa-chevron-down text-[10px] opacity-50"></i>
                  </button>
                </div>
              </nav>

              <div className="hidden lg:flex items-center gap-2">
                <button
                  onMouseEnter={() => handleMouseEnter('busca')}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-600 dark:text-gray-300"
                  aria-label="Buscar"
                >
                  <i className="fas fa-search"></i>
                </button>

                <button
                  onMouseEnter={() => handleMouseEnter('idioma')}
                  className="h-9 px-2 flex items-center gap-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-600 dark:text-gray-300"
                  aria-label="Idioma"
                >
                  <img src="/assets/images/flags/bandeira-brasil.webp" alt="Português" className="w-6 h-auto shadow-sm rounded-sm" />
                  <i className="fas fa-chevron-down text-[10px]"></i>
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-audit-navy dark:text-white"
                aria-label="Abrir menu"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>

          <div className="h-[2px] w-full bg-gradient-to-r from-audit-navy via-audit-gold to-audit-navy relative z-[1800]"></div>

          {/* MEGA PANELS */}
          {activeMegaPanel === 'sobre' && (
            <div
              id="panel-sobre"
              className="mega-panel active bg-white dark:bg-gray-900"
              onMouseEnter={() => handleMouseEnter('sobre')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-7xl mx-auto h-[400px] flex">
                <div className="w-1/4 border-r border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 py-6 pr-2 custom-scroll overflow-y-auto">
                  <ul className="space-y-1 px-4">
                    {[
                      { id: 'sobre-inst', label: 'Institucional' },
                      { id: 'sobre-criador', label: 'O Criador' },
                      { id: 'sobre-acessibilidade', label: 'Acessibilidade' },
                      { id: 'sobre-sustentabilidade', label: 'Sustentabilidade Digital' },
                      { id: 'sobre-politicas', label: 'Políticas do Site' },
                      { id: 'sobre-mapa', label: 'Mapa do Site' },
                    ].map(item => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleTabClick('sobre', item.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition flex justify-between items-center group focus:outline-none ${
                            activeTab.panel === 'sobre' && activeTab.tab === item.id
                              ? 'bg-white dark:bg-white/5 text-audit-gold'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-white/5'
                          }`}
                        >
                          {item.label}
                          <i className="fas fa-chevron-right text-xs opacity-0 group-hover:opacity-100 transition text-audit-gold"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-[45%] p-8 overflow-y-auto custom-scroll dark:text-gray-300">
                  {activeTab.panel === 'sobre' && activeTab.tab === 'sobre-inst' && (
                    <div>
                      <h3 className="text-xl font-bold text-audit-navy dark:text-white mb-2">Quem Somos</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">A Audit Educa nasceu para democratizar o conhecimento técnico em auditoria e finanças.</p>
                      <Link to="/sobre-nos" className="block p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                        <span className="text-audit-goldDark font-bold text-sm block mb-1">Missão, Visão e Valores</span>
                        <span className="text-xs text-gray-500 group-hover:text-audit-navy dark:group-hover:text-white">Conheça nossa Missão, Visão e Valores</span>
                      </Link>
                    </div>
                  )}
                  {activeTab.panel === 'sobre' && activeTab.tab === 'sobre-criador' && (
                    <div>
                      <h3 className="text-xl font-bold text-audit-navy dark:text-white mb-2">Sobre o Criador</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Conheça a trajetória de quem idealizou este projeto.</p>
                      <Link to="/sobre-o-criador" className="block p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                        <span className="text-audit-goldDark font-bold text-sm block mb-1">Sobre o Criador</span>
                        <span className="text-xs text-gray-500 group-hover:text-audit-navy dark:group-hover:text-white">Conheça mais sobre mim (em breve)</span>
                      </Link>
                    </div>
                  )}
                  {activeTab.panel === 'sobre' && activeTab.tab === 'sobre-acessibilidade' && (
                    <div>
                      <h3 className="text-xl font-bold text-audit-navy dark:text-white mb-2">Inclusão Digital</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Compromisso com o acesso universal ao conhecimento.</p>
                      <div className="space-y-3">
                        <Link to="/politica-de-acessibilidade" className="block p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                          <span className="text-audit-goldDark font-bold text-sm block mb-1">Política de Acessibilidade</span>
                          <span className="text-xs text-gray-500 group-hover:text-audit-navy dark:group-hover:text-white">Conheça nossas diretrizes de inclusão.</span>
                        </Link>
                        <Link to="/recursos-assistivos" className="block p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                          <span className="text-audit-goldDark font-bold text-sm block mb-1">Recursos Assistivos</span>
                          <span className="text-xs text-gray-500 group-hover:text-audit-navy dark:group-hover:text-white">Conheça nossos recursos de acessibilidade (em breve)</span>
                        </Link>
                        <Link to="/de-olho-na-acessibilidade" className="block p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                          <span className="text-audit-goldDark font-bold text-sm block mb-1">De Olho na Acessibilidade</span>
                          <span className="text-xs text-gray-500 group-hover:text-audit-navy dark:group-hover:text-white">Conheça nossa iniciativa de inclusão.</span>
                        </Link>
                      </div>
                    </div>
                  )}
                  {activeTab.panel === 'sobre' && activeTab.tab === 'sobre-sustentabilidade' && (
                    <div>
                      <h3 className="text-xl font-bold text-audit-navy dark:text-white mb-2">Sustentabilidade Digital</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Reduzindo nossa pegada ecológica através da tecnologia.</p>
                      <div className="grid grid-cols-2 gap-4">
                        <Link to="/nosso-compromisso" className="block p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                          <span className="text-audit-goldDark font-bold text-sm block mb-1">Nosso Compromisso</span>
                          <span className="text-xs text-gray-500 group-hover:text-audit-navy dark:group-hover:text-white">Conheça nossas metas ambientais.</span>
                        </Link>
                        <Link to="/pegada-de-carbono" className="block p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                          <span className="text-audit-goldDark font-bold text-sm block mb-1">Pegada de Carbono</span>
                          <span className="text-xs text-gray-500 group-hover:text-audit-navy dark:group-hover:text-white">Conheça o monitoramento de impacto.</span>
                        </Link>
                        <Link to="/relatorio-de-impacto" className="block p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                          <span className="text-audit-goldDark font-bold text-sm block mb-1">Relatório de Impacto</span>
                          <span className="text-xs text-gray-500 group-hover:text-audit-navy dark:group-hover:text-white">Conheça nossos resultados de impacto ambiental</span>
                        </Link>
                        <Link to="/tecnologia-verde" className="block p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                          <span className="text-audit-goldDark font-bold text-sm block mb-1">Tecnologia Verde</span>
                          <span className="text-xs text-gray-500 group-hover:text-audit-navy dark:group-hover:text-white">Conheça nossas tecnologias sustentáveis.</span>
                        </Link>
                      </div>
                    </div>
                  )}
                  {activeTab.panel === 'sobre' && activeTab.tab === 'sobre-politicas' && (
                    <div>
                      <h3 className="text-xl font-bold text-audit-navy dark:text-white mb-2">Políticas do Site</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Transparência e conformidade legal.</p>
                      <div className="space-y-3">
                        <Link to="/politica-de-privacidade" className="block p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                          <span className="text-audit-goldDark font-bold text-sm block mb-1">Central de Privacidade</span>
                          <span className="text-xs text-gray-500 group-hover:text-audit-navy dark:group-hover:text-white">Conheça nossas regras de privacidade.</span>
                        </Link>
                        <Link to="/notificacoes-legais" className="block p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                          <span className="text-audit-goldDark font-bold text-sm block mb-1">Notificações Legais</span>
                          <span className="text-xs text-gray-500 group-hover:text-audit-navy dark:group-hover:text-white">Conheça nossa isenção de responsabilidade.</span>
                        </Link>
                        <Link to="/termos-de-uso" className="block p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                          <span className="text-audit-goldDark font-bold text-sm block mb-1">Termos de Utilização e Uso</span>
                          <span className="text-xs text-gray-500 group-hover:text-audit-navy dark:group-hover:text-white">Conheça os termos de utilização.</span>
                        </Link>
                      </div>
                    </div>
                  )}
                  {activeTab.panel === 'sobre' && activeTab.tab === 'sobre-mapa' && (
                    <div>
                      <h3 className="text-xl font-bold text-audit-navy dark:text-white mb-2">Navegação</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Encontre o que você precisa rapidamente.</p>
                      <div className="space-y-3">
                        <Link to="/mapa-do-site" className="block p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                          <span className="text-audit-goldDark font-bold text-sm block mb-1">Mapa do Site</span>
                          <span className="text-xs text-gray-500 group-hover:text-audit-navy dark:group-hover:text-white">Conheça a estrutura completa.</span>
                        </Link>
                        <Link to="/busca-e-conteudo" className="block p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group">
                          <span className="text-audit-goldDark font-bold text-sm block mb-1">Busca e Conteúdo</span>
                          <span className="text-xs text-gray-500 group-hover:text-audit-navy dark:group-hover:text-white">Encontre artigos, cursos e materiais.</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-[30%] p-6 pr-8 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Escritório"
                    className="w-full h-full object-cover rounded-tl-[80px] rounded-br-[80px] rounded-tr-2xl rounded-bl-2xl border-2 border-audit-gold/50 shadow-md"
                    onError={(e) => e.target.src = '/assets/images/placeholder.jpg'}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Outros painéis (conteúdo, ferramentas, carreiras, fale) seguem a mesma estrutura... */}
          {/* Por brevidade, omitidos aqui, mas devem ser adicionados conforme necessidade com os links corrigidos */}
        </div>
      </header>
    </>
  );
});

export default Header;