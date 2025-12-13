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
    
    if (window.__TEMPLATE_ENGINE_V3_INIT__) {
      return;
    }
    window.__TEMPLATE_ENGINE_V3_INIT__ = true;
    
    this.waitForDOM().then(() => {
      this.init();
    });
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
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        await this.loadComponents();
        this.componentsLoaded = true;
        return;
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          throw error;
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
        console.error(`❌ Erro ao carregar componente ${containerId}:`, error);
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
      }
    }
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
      if (e.target.classList.contains('modal')) {
        this.closeModal(e.target.id);
      }
    });
  }

  openModal(modalId) {
    if (typeof Utils !== 'undefined' && Utils.openModal) {
      Utils.openModal(modalId);
    } else {
      // Fallback para sistema próprio
      const modal = document.getElementById(modalId);
      if (!modal) return;

      this.activeModals.add(modalId);
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    if (typeof Utils !== 'undefined' && Utils.closeModal) {
      Utils.closeModal(modalId);
    } else {
      // Fallback para sistema próprio
      const modal = document.getElementById(modalId);
      if (!modal) return;

      this.activeModals.delete(modalId);
      modal.classList.add('hidden');
      
      if (this.activeModals.size === 0) {
        document.body.style.overflow = '';
      }
    }
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
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-audit-gold mx-auto mb-4"></div>
            <p class="text-gray-600 dark:text-gray-300 font-medium">Sistema carregado com sucesso</p>
            <p class="text-sm text-gray-500 mt-2">Use a navegação do header para acessar as páginas disponíveis</p>
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
                    class="bg-audit-blue text-white px-6 py-2 rounded-lg hover:bg-audit-navy transition-colors">
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