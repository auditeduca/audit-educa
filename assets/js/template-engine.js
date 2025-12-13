/**
 * TemplateEngineV3 - Versão Multi-Page Application (MPA)
 * * Lógica alterada para manter a modularidade (Header/Footer/Modals injetáveis),
 * mas respeitando a navegação tradicional de múltiplas páginas HTML.
 */

class TemplateEngineV3 {
    constructor() {
        // Configuração dos componentes globais
        // REMOVIDO: 'main-container' (pois cada página HTML terá seu próprio conteúdo principal)
        this.config = {
            'header-container': 'assets/components/header.html',
            'footer-container': 'assets/components/footer.html',
            'modals-container': 'assets/components/modals-main.html'
        };

        this.initPromise = null;
        this.componentsLoaded = false;
        this.componentCache = new Map();
        
        // Fallbacks inline atualizados com links reais (MPA)
        this.componentFallbacks = {
            'header-container': this.getHeaderFallback(),
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

    // --- Fallbacks Atualizados para Links Reais ---

    getHeaderFallback() {
        // Nota: Os hrefs apontam para arquivos .html (index.html é a home)
        return `
        <header id="header" class="fixed w-full top-0 z-[100] transition-all duration-300">
            <div class="bg-white dark:bg-gray-900 glass shadow-lg backdrop-blur-md relative z-[100]">
                <div class="py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs sm:text-sm">
                        <div class="flex items-center gap-6 text-gray-600 dark:text-gray-300">
                            <div class="flex gap-3 items-center">
                                <button id="btn-font-decrease" class="hover:text-yellow-500 font-bold transition text-base px-1" aria-label="Diminuir fonte">A-</button>
                                <button id="btn-font-increase" class="hover:text-yellow-500 font-bold transition text-base px-1" aria-label="Aumentar fonte">A+</button>
                                <span class="w-px h-4 bg-gray-300 dark:bg-gray-600"></span>
                                <button id="theme-toggle" class="hover:text-yellow-500 transition flex items-center gap-1 text-base px-1" aria-label="Alternar Tema">
                                    <i class="fas fa-moon dark:hidden"></i>
                                    <i class="fas fa-sun hidden dark:inline"></i>
                                </button>
                            </div>
                        </div>
                        <div id="top-bar-links" class="flex items-center gap-4">
                            <a href="contato.html" class="hover:text-yellow-500 transition">Contato</a>
                            <a href="login.html" class="hover:text-yellow-500 transition">Login</a>
                        </div>
                    </div>
                </div>
                <div class="py-4">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <a href="index.html" class="text-2xl font-bold text-gray-800 dark:text-white hover:text-yellow-500 transition">Audit Educa</a>
                            </div>
                            <nav class="hidden md:flex space-x-6">
                                <!-- Links MPA: Apontam para arquivos físicos (index.html como principal) -->
                                <a href="index.html" class="nav-link text-gray-600 dark:text-gray-300 hover:text-yellow-500 transition">Home</a>
                                <a href="sobre.html" class="nav-link text-gray-600 dark:text-gray-300 hover:text-yellow-500 transition">Sobre</a>
                                <a href="sustentabilidade.html" class="nav-link text-gray-600 dark:text-gray-300 hover:text-yellow-500 transition">Sustentabilidade</a>
                                <a href="tecnologia.html" class="nav-link text-gray-600 dark:text-gray-300 hover:text-yellow-500 transition">Tecnologia</a>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </header>`;
    }

    getFooterFallback() {
        return `
        <footer id="footer" class="bg-gray-800 dark:bg-gray-900 text-gray-300 pt-16 border-t border-gray-700 mt-auto">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 class="text-white font-bold text-lg mb-4">Audit Educa</h3>
                        <p class="text-gray-400 text-sm">Portal corporativo dedicado à educação em auditoria e contabilidade.</p>
                    </div>
                    <div>
                        <h3 class="text-white font-bold text-lg mb-4">Links</h3>
                        <ul class="space-y-2 text-sm">
                            <li><a href="sobre.html" class="hover:text-yellow-500 transition">Sobre Nós</a></li>
                            <li><a href="sustentabilidade.html" class="hover:text-yellow-500 transition">Sustentabilidade</a></li>
                            <li><a href="tecnologia.html" class="hover:text-yellow-500 transition">Tecnologia Verde</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-white font-bold text-lg mb-4">Contato</h3>
                        <p class="text-gray-400 text-sm">Email: contato@auditeduca.com.br</p>
                    </div>
                </div>
                <div class="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
                    <p>&copy; 2025 Audit Educa. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>`;
    }

    getModalsFallback() {
        // Mantido igual ao original, pois modais são globais
        return `
        <div id="newsletter-modal" class="modal-overlay fixed inset-0 z-50 hidden">
            <div class="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300"></div>
            <div class="modal-container relative flex items-center justify-center min-h-screen p-4">
                <div class="modal-content bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform translate-y-8 opacity-0 transition-all duration-300">
                    <div class="modal-header p-6 pb-0">
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Aviso</h3>
                            <button class="modal-close-btn text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="modal-body p-6 pt-4">
                        <p class="text-gray-600 dark:text-gray-300">Conteúdo do modal global.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Botões flutuantes globais -->
        <button id="backToTop" class="fixed bottom-6 right-6 z-[90] bg-yellow-500 text-gray-900 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hidden hover:scale-110 transition-all">
            <i class="fas fa-arrow-up"></i>
        </button>
        `;
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
            console.log('🚀 Template Engine V3 (MPA) - Inicializando...');
            
            // 1. Carrega Header, Footer e Modais
            await this.loadComponentsWithRetry();
            
            // 2. Configura funcionalidades globais
            this.setupErrorBoundary();
            this.setupModalSystem();
            
            // 3. Funcionalidades específicas de MPA
            this.highlightActiveMenuItem(); // Marca o menu atual
            this.setupScrollToTop();        // Configura botão de voltar ao topo
            
            // 4. Dispara evento de pronto para scripts específicos da página
            document.dispatchEvent(new Event('template-loaded'));
            
            console.log('✅ Sistema MPA operacional');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Template Engine:', error);
        }
    }

    async loadComponentsWithRetry() {
        const maxRetries = 2;
        let attempt = 0;
        
        while (attempt < maxRetries) {
            try {
                await this.loadComponents();
                this.componentsLoaded = true;
                return;
            } catch (error) {
                attempt++;
                if (attempt >= maxRetries) {
                    console.warn(`⚠️ Usando fallbacks após falha no carregamento`);
                    await this.loadComponentFallbacks();
                    return;
                }
                await new Promise(r => setTimeout(r, 500));
            }
        }
    }

    async loadComponents() {
        // Percorre apenas os componentes configurados (Header, Footer, Modais)
        const promises = Object.entries(this.config).map(async ([containerId, componentPath]) => {
            const container = document.getElementById(containerId);
            
            // Se o container não existe na página atual, ignoramos (ex: página sem footer)
            if (!container) return;

            try {
                const response = await fetch(componentPath);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const html = await response.text();
                container.innerHTML = html;
                
                // Executa scripts que possam vir dentro dos componentes carregados
                this.executeScripts(container);
                
            } catch (error) {
                console.warn(`⚠️ Falha ao carregar ${containerId}, usando fallback.`);
                throw error; // Joga erro para acionar o fallback
            }
        });

        await Promise.all(promises);
    }

    async loadComponentFallbacks() {
        for (const [containerId, fallbackHTML] of Object.entries(this.componentFallbacks)) {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = fallbackHTML;
            }
        }
        this.componentsLoaded = true;
        // Após carregar fallbacks, precisamos destacar o menu novamente
        this.highlightActiveMenuItem();
    }

    /**
     * NOVA FUNÇÃO: Identifica a página atual pela URL e marca no menu
     */
    highlightActiveMenuItem() {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop() || 'index.html'; // Pega 'sobre.html' ou default
        
        // Seleciona todos os links de navegação dentro do header e do topo (login/contato)
        const navLinks = document.querySelectorAll('header nav a, header .mobile-menu a, #top-bar-links a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Remove classes ativas anteriores
            link.classList.remove('text-yellow-500', 'font-bold');
            
            // Compara o href com a página atual
            if (href && (href === pageName || currentPath.endsWith(href))) {
                link.classList.add('text-yellow-500', 'font-bold');
            }
        });
    }

    setupModalSystem() {
        // Lógica de modais mantida, mas agora buscando elementos que podem ter sido injetados dinamicamente
        document.body.addEventListener('click', (e) => {
            // Trigger de abrir modal
            const trigger = e.target.closest('.modal-trigger');
            if (trigger) {
                e.preventDefault();
                const targetId = trigger.getAttribute('data-modal-target') || trigger.getAttribute('href')?.substring(1);
                this.openModal(targetId);
            }

            // Fechar modal (botão ou backdrop)
            if (e.target.classList.contains('modal-backdrop') || e.target.closest('.modal-close-btn')) {
                const modal = e.target.closest('.modal-overlay');
                if (modal) this.closeModal(modal.id);
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.remove('hidden');
        // Pequeno delay para permitir transição CSS
        requestAnimationFrame(() => {
            const backdrop = modal.querySelector('.modal-backdrop');
            const content = modal.querySelector('.modal-content');
            if (backdrop) backdrop.style.opacity = '1';
            if (content) {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }
        });
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const backdrop = modal.querySelector('.modal-backdrop');
        const content = modal.querySelector('.modal-content');
        
        if (backdrop) backdrop.style.opacity = '0';
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(8px)';
        }

        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    setupScrollToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btn.classList.remove('hidden');
            } else {
                btn.classList.add('hidden');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    executeScripts(container) {
        // Necessário para fazer scripts dentro de arquivos HTML importados funcionarem
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            document.body.appendChild(newScript);
        });
    }

    setupErrorBoundary() {
        window.addEventListener('error', (event) => {
            console.error('❌ Erro global:', event.error);
        });
    }
}

// Inicialização Global
if (!window.__TEMPLATE_ENGINE_V3_GLOBAL_INIT__) {
    window.__TEMPLATE_ENGINE_V3_GLOBAL_INIT__ = true;
    const initEngine = () => { window.TemplateEngine = new TemplateEngineV3(); };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEngine);
    } else {
        initEngine();
    }
}
