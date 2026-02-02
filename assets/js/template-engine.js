/**
 * Template Engine - Audit Educa
 * Carrega componentes HTML dinamicamente e gerencia a injeção no DOM.
 * Dispara o evento 'template-loaded' quando finalizado.
 */

class TemplateEngine {
    constructor() {
        // CONFIGURAÇÃO: Mapeia os IDs do HTML (chaves) para os arquivos (valores)
        // Ajustado para bater com o seu index.html (placeholder)
        this.config = {
            'header-placeholder': 'assets/components/header.html',
            'footer-placeholder': 'assets/components/footer.html',
            'modals-placeholder': 'assets/components/modals-main.html'
        };

        this.initPromise = null;
        this.componentsLoaded = false;
        
        // Evita múltiplas instâncias
        if (window.__TEMPLATE_ENGINE_INIT__) return;
        window.__TEMPLATE_ENGINE_INIT__ = true;

        // Auto-inicialização segura
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
            
            await this.loadComponentsWithRetry();
            
            // Funções auxiliares do engine
            this.setupErrorBoundary();
            this.highlightActiveMenuItem(); 
            this.executeScriptsInPlaceholders(); // Garante que scripts dentro dos HTMLs injetados rodem
            
            // Marca como carregado e avisa o sistema
            this.componentsLoaded = true;
            document.dispatchEvent(new Event('template-loaded'));
            console.log('✅ Template Engine - Componentes carregados e evento disparado.');
            
        } catch (error) {
            console.error('❌ Erro crítico no Template Engine:', error);
            // Mesmo com erro, dispara o evento para não travar a aplicação
            document.dispatchEvent(new Event('template-loaded'));
        }
    }

    async loadComponentsWithRetry(retries = 3) {
        const promises = Object.entries(this.config).map(async ([id, url]) => {
            const container = document.getElementById(id);
            if (!container) {
                // Se o placeholder não existe na página atual, ignoramos silenciosamente
                return; 
            }

            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const html = await response.text();
                    
                    // Injeção segura
                    container.innerHTML = html;
                    return; // Sucesso, sai do loop
                } catch (err) {
                    console.warn(`Tentativa ${i + 1} falhou para ${url}:`, err);
                    if (i === retries - 1) console.error(`Falha final ao carregar ${url}`);
                    await new Promise(r => setTimeout(r, 1000)); // Espera 1s antes de tentar de novo
                }
            }
        });

        await Promise.all(promises);
    }

    // Executa scripts que vieram dentro do HTML injetado (o innerHTML por padrão não executa <script>)
    executeScriptsInPlaceholders() {
        Object.keys(this.config).forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                const scripts = container.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });
            }
        });
    }

    highlightActiveMenuItem() {
        // Lógica simples para marcar o menu ativo
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('nav a');
        links.forEach(link => {
            if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href').includes('index'))) {
                link.classList.add('active');
            }
        });
    }

    setupErrorBoundary() {
        window.addEventListener('error', (event) => {
            console.error('⚠️ Erro capturado pelo Engine:', event.message);
        });
    }
}

// Inicialização Global
if (!window.TemplateEngineInstance) {
    window.TemplateEngineInstance = new TemplateEngine();
}