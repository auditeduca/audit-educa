/**
 * Template Engine - Audit Educa
 * Carrega componentes HTML dinamicamente nos placeholders corretos.
 */

class TemplateEngine {
    constructor() {
        // CONFIGURAÇÃO: IDs corrigidos para bater com o index.html (placeholder)
        this.config = {
            'header-placeholder': 'assets/components/header.html',
            'footer-placeholder': 'assets/components/footer.html',
            'modals-placeholder': 'assets/components/modals-main.html'
        };

        this.componentsLoaded = false;
        
        // Evita múltiplas instâncias
        if (window.__TEMPLATE_ENGINE_INIT__) return;
        window.__TEMPLATE_ENGINE_INIT__ = true;

        // Inicia assim que o DOM estiver pronto
        this.waitForDOM().then(() => this.init());
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
            console.log('🚀 Template Engine - Inicializando...');
            
            await this.loadComponents();
            
            this.executeScriptsInPlaceholders(); // Reativa scripts (<script>) dentro do HTML injetado
            this.highlightActiveMenuItem();
            
            // Marca como pronto e avisa o Main JS
            this.componentsLoaded = true;
            document.dispatchEvent(new Event('template-loaded'));
            console.log('✅ Template Engine - Componentes carregados.');
            
        } catch (error) {
            console.error('❌ Erro no Template Engine:', error);
            // Dispara mesmo com erro para não travar o preloader eternamente
            document.dispatchEvent(new Event('template-loaded'));
        }
    }

    async loadComponents() {
        const promises = Object.entries(this.config).map(async ([id, url]) => {
            const container = document.getElementById(id);
            if (!container) return; // Placeholder não existe nesta página

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const html = await response.text();
                container.innerHTML = html;
            } catch (err) {
                console.warn(`Falha ao carregar componente ${url}:`, err);
            }
        });

        await Promise.all(promises);
    }

    // Função crítica: Scripts dentro de innerHTML não rodam automaticamente.
    // Precisamos recriá-los para que header.js e footer.js funcionem.
    executeScriptsInPlaceholders() {
        Object.keys(this.config).forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                const scripts = container.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    // Copia atributos (src, defer, etc)
                    Array.from(oldScript.attributes).forEach(attr => 
                        newScript.setAttribute(attr.name, attr.value)
                    );
                    // Copia conteúdo inline
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
            if (href && (currentPath.includes(href) || (currentPath === '/' && href === 'index.html'))) {
                link.classList.add('active');
            }
        });
    }
}

// Inicialização Global
if (!window.TemplateEngine) {
    window.TemplateEngine = new TemplateEngine();
}