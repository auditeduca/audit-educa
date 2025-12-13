class TemplateEngineV3 {
  constructor() {
    this.config = {
      'header-container': 'assets/components/header.html',
      'main-container': 'assets/components/main.html',
      'footer-container': 'assets/components/footer.html',
      'modals-container': 'assets/components/modals-main.html'
    };
    
    this.currentPage = null;
    this.initPromise = null;
    this.isLoading = false;
    this.componentsLoaded = false;
    this.pageCache = new Map();
    this.componentCache = new Map();
    this.activeModals = new Set();
    
    // Fallbacks inline para componentes (usados quando arquivos não carregam)
    this.componentFallbacks = {
      'header-container': this.getHeaderFallback(),
      'main-container': this.getMainFallback(),
      'footer-container': this.getFooterFallback(),
      'modals-container': this.getModalsFallback()
    };
    
    if (window.__TEMPLATE_ENGINE_V3_INIT__) {
      return;
    }
    window.__TEMPLATE_ENGINE_V3_INIT__ = true;
    
    this.waitForDOM().then(() => {
      this.init();
    });
  }

  // Fallback para header
  getHeaderFallback() {
    return `
    <header id="header" class="fixed w-full top-0 z-[100] transition-all duration-300">
        <div class="bg-white dark:bg-gray-900 glass shadow-lg backdrop-blur-md relative z-[100]">
            <div class="py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs sm:text-sm">
                    <div class="flex items-center gap-6 text-gray-600 dark:text-gray-300">
                        <div class="flex gap-3 items-center">
                            <button id="btn-font-decrease" class="hover:text-yellow-500 font-bold transition text-base px-1" aria-label="Diminuir fonte" title="Diminuir Fonte">A-</button>
                            <button id="btn-font-increase" class="hover:text-yellow-500 font-bold transition text-base px-1" aria-label="Aumentar fonte" title="Aumentar Fonte">A+</button>
                            <span class="w-px h-4 bg-gray-300 dark:bg-gray-600"></span>
                            <button id="theme-toggle" class="hover:text-yellow-500 transition flex items-center gap-1 text-base px-1" aria-label="Alternar Tema" title="Alternar Tema">
                                <i class="fas fa-moon dark:hidden"></i>
                                <i class="fas fa-sun hidden dark:inline"></i>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <a href="#" class="hover:text-yellow-500 transition">Contato</a>
                        <a href="#" class="hover:text-yellow-500 transition">Login</a>
                    </div>
                </div>
            </div>
            <div class="py-4">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Audit Educa</h1>
                        </div>
                        <nav class="hidden md:flex space-x-6">
                            <a href="#sobre-nos" class="text-gray-600 dark:text-gray-300 hover:text-yellow-500 transition">Sobre</a>
                            <a href="#sustentabilidade-digital" class="text-gray-600 dark:text-gray-300 hover:text-yellow-500 transition">Sustentabilidade</a>
                            <a href="#tecnologia-verde" class="text-gray-600 dark:text-gray-300 hover:text-yellow-500 transition">Tecnologia</a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </header>`;
  }

  // Fallback para main
  getMainFallback() {
    return `
    <main id="main-content" class="flex-grow min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-36">
        <div id="content-placeholder">
            <div class="flex justify-center items-center h-[calc(100vh-200px)]">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mx-auto mb-4"></div>
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Audit Educa</h2>
                    <p class="text-gray-600 dark:text-gray-300">Portal Corporativo Modular</p>
                    <div class="mt-8 space-x-4">
                        <button onclick="window.TemplateEngineV3.loadPage('sobre-nos')" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Sobre Nós</button>
                        <button onclick="window.TemplateEngineV3.loadPage('sustentabilidade-digital')" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Sustentabilidade</button>
                        <button onclick="window.TemplateEngineV3.loadPage('tecnologia-verde')" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition">Tecnologia Verde</button>
                    </div>
                </div>
            </div>
        </div>
    </main>`;
  }

  // Fallback para footer
  getFooterFallback() {
    return `
    <footer id="footer" class="bg-gray-800 dark:bg-gray-900 text-gray-300 pt-16 border-t border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                    <h3 class="text-white font-bold text-lg mb-4">Audit Educa</h3>
                    <p class="text-gray-400 text-sm">Portal corporativo dedicado à educação em auditoria e contabilidade.</p>
                </div>
                <div>
                    <h3 class="text-white font-bold text-lg mb-4">Links</h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="#sobre-nos" class="hover:text-yellow-500 transition">Sobre Nós</a></li>
                        <li><a href="#sustentabilidade-digital" class="hover:text-yellow-500 transition">Sustentabilidade</a></li>
                        <li><a href="#tecnologia-verde" class="hover:text-yellow-500 transition">Tecnologia Verde</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-white font-bold text-lg mb-4">Contato</h3>
                    <p class="text-gray-400 text-sm">Email: contato@auditeduca.com.br</p>
                    <p class="text-gray-400 text-sm">Telefone: (11) 9999-9999</p>
                </div>
            </div>
            <div class="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
                <p>&copy; 2025 Audit Educa. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>`;
  }

  // Fallback para modals
  getModalsFallback() {
    return `
    <!-- Modals de fallback -->
    <div id="newsletter-modal" class="modal-overlay fixed inset-0 z-50 hidden">
        <div class="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300"></div>
        <div class="modal-container relative flex items-center justify-center min-h-screen p-4">
            <div class="modal-content bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform translate-y-8 opacity-0 transition-all duration-300">
                <div class="modal-header p-6 pb-0">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                <i class="fas fa-check text-white text-xl"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Teste Modal</h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Modal de fallback funcionando</p>
                            </div>
                        </div>
                        <button class="modal-close-btn text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <i class="fas fa-times text-lg"></i>
                        </button>
                    </div>
                </div>
                <div class="modal-body p-6 pt-4">
                    <p class="text-gray-600 dark:text-gray-300 text-center">Este é um modal de fallback que funciona quando os arquivos não carregam.</p>
                </div>
                <div class="modal-footer p-6 pt-0">
                    <button class="modal-close-btn w-full bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Cookie FAB (botão flutuante) -->
    <button id="cookie-fab" class="fixed bottom-20 right-6 z-[90] bg-blue-500 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center opacity-100 pointer-events-auto transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50" title="Preferências de Cookies">
        <i class="fas fa-cookie-bite text-xl"></i>
    </button>

    <!-- Cookie Banner (rodapé) -->
    <div id="cookie-banner" class="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-[0_-5px_20px_rgba(0,0,0,0.15)] z-[90] transform translate-y-0 transition-transform duration-500 border-t border-gray-200 dark:border-gray-700 p-5 md:px-10 md:py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex-1 space-y-3 text-center md:text-left">
            <p class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                <strong class="text-gray-900 dark:text-white">Seu conhecimento importa e sua privacidade também.</strong><br>
                Utilizamos cookies para aprimorar sua experiência e analisar nosso tráfego.
            </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button id="banner-options" class="px-6 py-2.5 rounded-full border-2 border-dashed border-blue-500 text-blue-500 font-bold text-sm hover:bg-blue-500/5 transition">Personalizar</button>
            <button id="banner-accept" class="px-8 py-2.5 rounded-full bg-blue-500 text-white font-bold text-sm shadow-md hover:opacity-90 transition">Aceitar</button>
        </div>
    </div>

    <!-- Back to top button -->
    <button id="backToTop" class="fixed bottom-6 right-6 z-[90] bg-yellow-500 text-gray-900 w-12 h-12 rounded-full shadow-lg flex items-center justify-center opacity-100 pointer-events-auto transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50" title="Voltar ao topo">
        <i class="fas fa-arrow-up font-bold"></i>
    </button>`;
  }

  waitForDOM() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }

  async init() {
    try {
      console.log('🚀 Template Engine V3 - Inicializando...');
      this.cleanupCache();
      await this.loadComponentsWithRetry();
      this.setupErrorBoundary();
      this.setupModalSystem();
      this.setupAdvancedRouting();
      this.forceLoadHomePage();
      
      // Aguardar componentes carregarem antes de sinalizar conclusão
      setTimeout(() => {
        console.log('✅ Componentes carregados e sistema operacional');
      }, 500);
    } catch (error) {
      console.error('❌ Erro ao inicializar Template Engine:', error);
      this.renderError('init', error.message);
    }
  }

  async loadComponentsWithRetry() {
    const maxRetries = 2; // Reduzido para usar fallbacks mais rapidamente
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        await this.loadComponents();
        this.componentsLoaded = true;
        return;
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          console.warn(`⚠️ Usando fallbacks para componentes após ${attempt} tentativas`);
          await this.loadComponentFallbacks();
          return;
        }
        console.warn(`🔄 Tentativa ${attempt} de carregar componentes falhou, tentando novamente...`);
        await this.delay(1000);
      }
    }
  }

  async loadComponents() {
    console.log('📂 Carregando componentes do template...');
    
    const promises = Object.entries(this.config).map(async ([containerId, componentPath]) => {
      try {
        const response = await fetch(componentPath);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const componentHTML = await response.text();
        this.saveToCache('component', containerId, componentHTML);
        
        console.log(`✅ Componente ${containerId} carregado: ${componentPath}`);
        return { containerId, componentHTML };
      } catch (error) {
        console.warn(`⚠️ Erro ao carregar componente ${containerId}:`, error);
        throw error;
      }
    });

    const components = await Promise.all(promises);
    
    // Renderizar componentes
    for (const { containerId, componentHTML } of components) {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = componentHTML;
        console.log(`🎯 Componente ${containerId} renderizado no DOM`);
      } else {
        console.error(`❌ Container ${containerId} não encontrado no DOM`);
      }
    }
  }

  async loadComponentFallbacks() {
    console.log('🔄 Carregando componentes via fallback inline...');
    
    for (const [containerId, fallbackHTML] of Object.entries(this.componentFallbacks)) {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = fallbackHTML;
        console.log(`✅ Componente ${containerId} carregado via fallback`);
      } else {
        console.error(`❌ Container ${containerId} não encontrado no DOM para fallback`);
      }
    }
    
    this.componentsLoaded = true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setupErrorBoundary() {
    window.addEventListener('error', (event) => {
      console.error('❌ Erro JavaScript:', event.error);
    });
  }

  setupModalSystem() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.modal-trigger');
      if (trigger) {
        e.preventDefault();
        const modalId = trigger.getAttribute('href')?.substring(1);
        if (modalId) {
          this.openModal(modalId);
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal') || e.target.classList.contains('modal-backdrop')) {
        this.closeModal(e.target.closest('.modal-overlay')?.id);
      }
    });

    // Setup específico para modals de fallback
    this.setupFallbackModalEvents();
  }

  setupFallbackModalEvents() {
    // Cookie FAB
    const cookieFAB = document.getElementById('cookie-fab');
    if (cookieFAB) {
      cookieFAB.addEventListener('click', () => {
        this.openModal('newsletter-modal'); // Modal de teste
      });
    }

    // Cookie Banner
    const bannerAccept = document.getElementById('banner-accept');
    if (bannerAccept) {
      bannerAccept.addEventListener('click', () => {
        this.acceptCookies();
      });
    }

    const bannerOptions = document.getElementById('banner-options');
    if (bannerOptions) {
      bannerOptions.addEventListener('click', () => {
        this.openModal('newsletter-modal'); // Modal de teste
      });
    }

    // Back to top
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Modal close buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-close-btn')) {
        const modal = e.target.closest('.modal-overlay');
        if (modal) {
          this.closeModal(modal.id);
        }
      }
    });
  }

  acceptCookies() {
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.transform = 'translateY(100%)';
    }
    
    console.log('✅ Cookies aceitos com sucesso');
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.warn(`⚠️ Modal não encontrado: ${modalId}`);
      return;
    }

    // Mostrar modal
    modal.classList.remove('hidden');
    
    // Animar backdrop
    const backdrop = modal.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.style.opacity = '1';
    }
    
    // Animar conteúdo
    const content = modal.querySelector('.modal-content');
    if (content) {
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }

    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';

    return modal;
  }

  closeModal(modalId) {
    if (!modalId) return;
    
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Animar saída
    const backdrop = modal.querySelector('.modal-backdrop');
    const content = modal.querySelector('.modal-content');
    
    if (backdrop) {
      backdrop.style.opacity = '0';
    }
    
    if (content) {
      content.style.opacity = '0';
      content.style.transform = 'translateY(8px)';
    }

    // Esconder após animação
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }

  setupAdvancedRouting() {
    window.addEventListener('hashchange', () => {
      const pageName = this.getPageNameFromHash();
      if (pageName && pageName !== this.currentPage) {
        this.loadPage(pageName);
      }
    });
  }

  async forceLoadHomePage() {
    console.log('🏠 Template Engine V3 Iniciado - Sistema Modular');
    console.log('📂 Componentes configurados:', Object.keys(this.config).length);
    console.log('🔄 Sistema de cache ativado para otimização');
    
    const contentPlaceholder = document.getElementById('content-placeholder');
    if (contentPlaceholder) {
      contentPlaceholder.innerHTML = `
        <div class="flex items-center justify-center h-64">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p class="text-gray-600 dark:text-gray-300 font-medium">Sistema carregado com sucesso</p>
            <p class="text-sm text-gray-500 mt-2">Use a navegação do header para acessar as páginas disponíveis</p>
            <div class="mt-6 space-x-4">
              <button onclick="window.TemplateEngineV3.loadPage('sobre-nos')" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Sobre Nós</button>
              <button onclick="window.TemplateEngineV3.loadPage('sustentabilidade-digital')" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Sustentabilidade</button>
              <button onclick="window.TemplateEngineV3.loadPage('tecnologia-verde')" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition">Tecnologia Verde</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  getPageNameFromHash() {
    return window.location.hash.substring(1) || null;
  }

  async loadPage(pageName) {
    if (this.isLoading && pageName === this.currentPage) {
      return;
    }

    this.isLoading = true;

    try {
      // Verificar se a página existe antes de tentar carregar
      const availablePages = ['sobre-nos', 'sustentabilidade-digital', 'tecnologia-verde'];
      if (!availablePages.includes(pageName)) {
        throw new Error(`Página '${pageName}' não encontrada. Páginas disponíveis: ${availablePages.join(', ')}`);
      }
      
      const response = await fetch(`assets/pages/${pageName}.html`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const pageHTML = await response.text();
      this.renderPage(pageHTML, pageName);
      
    } catch (error) {
      // Só mostrar erro se não for um erro de página não encontrada esperado
      if (!error.message.includes('não encontrada')) {
        console.error(`❌ Erro ao carregar página ${pageName}:`, error);
      }
      this.renderError(pageName, error.message);
    } finally {
      this.isLoading = false;
    }
  }

  renderPage(pageHTML, pageName) {
    const contentPlaceholder = document.getElementById('content-placeholder');
    if (!contentPlaceholder) return;

    try {
      contentPlaceholder.innerHTML = pageHTML;
      this.currentPage = pageName;
      this.executeScripts(contentPlaceholder);
      
      contentPlaceholder.dispatchEvent(new CustomEvent('pageLoaded', {
        detail: { pageName, pageHTML }
      }));
      
    } catch (error) {
      console.error('❌ Erro ao renderizar página:', error);
    }
  }

  renderError(pageName, errorMessage) {
    const contentPlaceholder = document.getElementById('content-placeholder');
    if (contentPlaceholder) {
      contentPlaceholder.innerHTML = `
        <div class="flex items-center justify-center min-h-[400px]">
          <div class="text-center">
            <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Erro ao carregar página</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4">${errorMessage}</p>
            <button onclick="window.TemplateEngineV3.loadPage('${pageName}')" 
                    class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              <i class="fas fa-redo mr-2"></i>Tentar Novamente
            </button>
          </div>
        </div>
      `;
    }
  }

  executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src) {
        const newScript = document.createElement('script');
        newScript.src = script.src;
        newScript.type = script.type || 'text/javascript';
        document.head.appendChild(newScript);
      } else if (script.textContent.trim()) {
        try {
          eval(script.textContent);
        } catch (error) {
          console.error('❌ Erro ao executar script inline:', error);
        }
      }
    });
  }

  getFromCache(type, identifier) {
    if (type === 'component') {
      return this.componentCache.get(identifier);
    }
    return null;
  }

  saveToCache(type, identifier, data) {
    if (type === 'component') {
      this.componentCache.set(identifier, data);
    }
  }

  cleanupCache() {
    // Limpeza básica
    if (this.componentCache.size > 10) {
      this.componentCache.clear();
    }
  }
}

// Inicialização
if (!window.__TEMPLATE_ENGINE_V3_GLOBAL_INIT__) {
  window.__TEMPLATE_ENGINE_V3_GLOBAL_INIT__ = true;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const engine = new TemplateEngineV3();
      window.TemplateEngineV3 = engine;
      window.TemplateEngineV2 = engine;
      
      // Sistema de cookies inicializado automaticamente
    });
  } else {
    const engine = new TemplateEngineV3();
    window.TemplateEngineV3 = engine;
    window.TemplateEngineV2 = engine;
    
    // Sistema de cookies inicializado automaticamente
  }
}
