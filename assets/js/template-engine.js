/**
 * Template Engine - Audit Educa
 * Versão Corrigida: Sincronizada com IDs 'placeholder' e execução de scripts.
 */

class TemplateEngine {
    constructor() {
        // CONFIGURAÇÃO: IDs ajustados para bater com seu index.html
        this.config = {
            'header-placeholder': 'assets/components/header.html',
            'footer-placeholder': 'assets/components/footer.html',
            'modals-placeholder': 'assets/components/modals-main.html'
        };

        // Evita duplicação
        if (window.__TEMPLATE_ENGINE_INIT__) return;
        window.__TEMPLATE_ENGINE_INIT__ = true;

        this.init();
    }

    async init() {
        // Aguarda o DOM estar pronto se necessário
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }

        console.log('🚀 Template Engine: Inicializando...');
        
        await this.loadComponents();
        
        // Após carregar HTML, executa scripts e configura UI
        this.executeScriptsInPlaceholders();
        this.highlightActiveMenuItem();
        this.setupScrollToTop(); // Configura o botão voltar ao topo
        
        // Dispara evento para o main.js e cookie-manager.js saberem que está pronto
        document.dispatchEvent(new Event('template-loaded'));
        console.log('✅ Template Engine: Concluído.');
    }

    async loadComponents() {
        const promises = Object.entries(this.config).map(async ([id, url]) => {
            const container = document.getElementById(id);
            if (!container) return; // Se não existir na página, ignora

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const html = await response.text();
                container.innerHTML = html;
            } catch (err) {
                console.warn(`Erro ao carregar ${url}:`, err);
            }
        });

        await Promise.all(promises);
    }

    // CRÍTICO: Faz o menu mobile e outros scripts funcionarem
    executeScriptsInPlaceholders() {
        Object.keys(this.config).forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                const scripts = container.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    Array.from(oldScript.attributes).forEach(attr => 
                        newScript.setAttribute(attr.name, attr.value)
                    );
                    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });
            }
        });
    }

    highlightActiveMenuItem() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('nav a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (currentPath.includes(href) || (currentPath === '/' && href.includes('index')))) {
                link.classList.add('text-audit-gold', 'font-bold');
            }
        });
    }

    setupScrollToTop() {
        // Cria o botão dinamicamente se não existir no footer/modals
        if (!document.getElementById('btn-back-to-top')) {
            const btn = document.createElement('button');
            btn.id = 'btn-back-to-top';
            btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
            btn.className = 'fixed bottom-6 right-6 z-40 bg-audit-navy text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none hover:bg-audit-gold';
            document.body.appendChild(btn);

            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    btn.classList.remove('opacity-0', 'pointer-events-none');
                } else {
                    btn.classList.add('opacity-0', 'pointer-events-none');
                }
            });
        }
    }
}

// Inicialização Global
window.TemplateEngine = new TemplateEngine();