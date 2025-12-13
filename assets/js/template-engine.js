class TemplateEngine {
    constructor() {
        this.config = {
            'header-container': 'assets/components/header.html',
            'footer-container': 'assets/components/footer.html',
            'modals-container': 'assets/components/modals-main.html'
        };

        this.initPromise = null;
        this.componentsLoaded = false;
        
        if (window.__TEMPLATE_ENGINE_INIT__) {
            return;
        }
        window.__TEMPLATE_ENGINE_INIT__ = true;

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
            console.log('🚀 Template Engine (MPA) - Inicializando...');
            
            await this.loadComponentsWithRetry();
            
            this.setupErrorBoundary();
            this.setupModalSystem();
            
            this.highlightActiveMenuItem(); 
            this.setupScrollToTop();
            
            document.dispatchEvent(new Event('template-loaded'));
            
            console.log('✅ Sistema MPA operacional');
            
        } catch (error) {
            console.error('❌ Erro crítico ao inicializar Template Engine:', error);
        }
    }

    async loadComponentsWithRetry() {
        const maxRetries = 2;
        let attempt = 0;
        
        while (attempt <= maxRetries) {
            try {
                await this.loadComponents();
                this.componentsLoaded = true;
                return;
            } catch (error) {
                attempt++;
                console.warn(`⚠️ Tentativa ${attempt} de carregar componentes falhou.`);
                
                if (attempt > maxRetries) {
                    console.error('❌ Falha definitiva ao carregar componentes essenciais.');
                    this.showCriticalError("Não foi possível carregar partes do site. Verifique sua conexão.");
                    return;
                }
                
                await new Promise(r => setTimeout(r, 500 * attempt));
            }
        }
    }

    async loadComponents() {
        const promises = Object.entries(this.config).map(async ([containerId, componentPath]) => {
            const container = document.getElementById(containerId);
            
            if (!container) return;

            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`HTTP ${response.status} ao carregar ${componentPath}`);
            
            const html = await response.text();
            container.innerHTML = html;
            
            this.executeScripts(container);
        });

        await Promise.all(promises);
    }

    showCriticalError(message) {
        const div = document.createElement('div');
        div.className = "fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 shadow-lg";
        div.innerHTML = `<strong class="font-bold">Erro:</strong> <span class="block sm:inline">${message}</span>`;
        document.body.appendChild(div);
    }

    highlightActiveMenuItem() {
        requestAnimationFrame(() => {
            const currentPath = window.location.pathname;
            const pageName = currentPath.split('/').pop() || 'index.html';
            
            const navLinks = document.querySelectorAll('header nav a, header .mobile-menu a, #top-bar-links a');
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href) return;

                link.classList.remove('text-yellow-500', 'font-bold');
                
                if (href === pageName || (pageName === '' && href === 'index.html') || currentPath.endsWith(href)) {
                    link.classList.add('text-yellow-500', 'font-bold');
                }
            });
        });
    }

    setupModalSystem() {
        document.body.addEventListener('click', (e) => {
            const trigger = e.target.closest('.modal-trigger');
            if (trigger) {
                e.preventDefault();
                const targetId = trigger.getAttribute('data-modal-target') || trigger.getAttribute('href')?.substring(1);
                this.openModal(targetId);
            }

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
        const checkBtn = setInterval(() => {
            const btn = document.getElementById('backToTop');
            if (btn) {
                clearInterval(checkBtn);
                
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
        }, 500);

        setTimeout(() => clearInterval(checkBtn), 5000);
    }

    executeScripts(container) {
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
            console.error('❌ Erro global capturado:', event.error);
        });
    }
}

if (!window.__TEMPLATE_ENGINE_GLOBAL_INIT__) {
    window.__TEMPLATE_ENGINE_GLOBAL_INIT__ = true;
    const initEngine = () => { window.TemplateEngine = new TemplateEngine(); };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEngine);
    } else {
        initEngine();
    }
}
