class TemplateEngine {
    constructor() {
        this.config = {
            'header-container': 'components/header.html',
            'main-container': 'components/main.html',
            'footer-container': 'components/footer.html'
        };
        this.init();
    }

    async init() {
        // 1. Carrega a estrutura (Header, Main, Footer)
        await this.loadComponents();
        
        // 2. Define FLAG GLOBAL para scripts que carregarem depois
        window.__COMPONENTS_LOADED__ = true;

        // 3. Dispara evento para scripts que já estavam ouvindo
        document.dispatchEvent(new CustomEvent('componentsLoaded'));

        // 4. Carrega o conteúdo do JSON (Home, Sobre, etc)
        this.setupRouting();
    }

    async loadComponents() {
        const isLocalFile = window.location.protocol === 'file:';

        const promises = Object.entries(this.config).map(async ([containerId, filePath]) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            if (isLocalFile) {
                container.innerHTML = `<div style="color:red; padding:20px;">ERRO: Use um servidor local (Live Server) para ver ${filePath}</div>`;
                return;
            }

            try {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const html = await response.text();
                container.innerHTML = html;
            } catch (error) {
                console.error(`Erro no arquivo ${filePath}:`, error);
            }
        });

        await Promise.all(promises);
    }

    setupRouting() {
        const loadRoute = () => {
            const hash = window.location.hash.slice(1) || 'home';
            this.loadPage(hash);
        };
        window.addEventListener('hashchange', loadRoute);
        loadRoute(); // Executa na carga inicial
    }

    async loadPage(page) {
        const contentPlaceholder = document.getElementById('content-placeholder');
        if (!contentPlaceholder) return; // Main ainda não carregou

        try {
            const response = await fetch(`pages/${page}.json`);
            if (!response.ok) throw new Error('Página não encontrada');
            const data = await response.json();
            
            if (data.html) contentPlaceholder.innerHTML = data.html;
            if (data.title) document.title = data.title;
            
        } catch (error) {
            console.warn(`Conteúdo para ${page} não encontrado.`, error);
            // Não limpa o placeholder para evitar "piscar" se for apenas um delay
        }
    }
}
