/**
 * Template Engine - Audit Educa
 * Carrega componentes, executa scripts embutidos e gerencia utilitários globais.
 */

class TemplateEngine {
    constructor() {
        // CONFIGURAÇÃO: IDs do HTML
        this.config = {
            'header-placeholder': 'assets/components/header.html',
            'footer-placeholder': 'assets/components/footer.html',
            'modals-placeholder': 'assets/components/modals-main.html'
        };

        if (window.__TEMPLATE_ENGINE_INIT__) return;
        window.__TEMPLATE_ENGINE_INIT__ = true;

        this.init();
    }

    async init() {
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }

        console.log('🚀 Template Engine: Carregando componentes...');
        await this.loadComponents();
        
        // CRÍTICO: Executa os scripts que vieram dentro do HTML (ex: menu mobile, cookies)
        this.executeScriptsInPlaceholders();
        
        this.highlightActiveMenuItem();
        this.setupScrollToTop(); 
        
        // Avisa o resto do sistema que terminou
        document.dispatchEvent(new Event('template-loaded'));
        console.log('✅ Template Engine: Pronto.');
    }

    async loadComponents() {
        const promises = Object.entries(this.config).map(async ([id, url]) => {
            const container = document.getElementById(id);
            if (!container) return;

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

    // Função mágica que faz o Mega Menu e Cookies funcionarem
    executeScriptsInPlaceholders() {
        Object.keys(this.config).forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                const scripts = container.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    // Copia atributos (src, type, etc)
                    Array.from(oldScript.attributes).forEach(attr => 
                        newScript.setAttribute(attr.name, attr.value)
                    );
                    // Copia o conteúdo inline
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
        // Procura o botão. Se não achar (não veio no footer), cria um.
        let btn = document.getElementById('btn-back-to-top');
        
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'btn-back-to-top';
            btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
            // Estilos Tailwind para o botão flutuante
            btn.className = 'fixed bottom-6 right-6 z-50 bg-audit-navy text-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 opacity-0 pointer-events-none hover:bg-audit-gold hover:-translate-y-1';
            document.body.appendChild(btn);
        }

        // Lógica de aparecer/sumir
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btn.classList.remove('opacity-0', 'pointer-events-none');
            } else {
                btn.classList.add('opacity-0', 'pointer-events-none');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Inicializa
window.TemplateEngine = new TemplateEngine();