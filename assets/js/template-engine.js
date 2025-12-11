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
        
        // 2. Avisa que os componentes HTML estão prontos
        document.dispatchEvent(new CustomEvent('componentsLoaded'));

        // 3. Carrega o conteúdo do JSON (Home, Sobre, etc)
        this.setupRouting();
    }

    async loadComponents() {
        const isLocalFile = window.location.protocol === 'file:';

        const promises = Object.entries(this.config).map(async ([containerId, filePath]) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            if (isLocalFile) {
                container.innerHTML = `
                    <div style="background: #fee2e2; color: #991b1b; padding: 1rem; border: 1px solid #f87171; font-family: sans-serif; margin: 10px;">
                        <strong>Erro de Visualização:</strong> Navegadores bloqueiam carregamento de componentes modulares (<em>${filePath}</em>).
                        <br>
                        <strong>Solução:</strong> Use um servidor local (ex: Live Server) ou suba para o GitHub Pages.
                    </div>
                `;
                return;
            }

            try {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error(`HTTP ${response.status} - Arquivo não encontrado`);
                const html = await response.text();
                container.innerHTML = html;
            } catch (error) {
                console.error(`Erro ao carregar ${filePath}:`, error);
                container.innerHTML = `<div class="error-box">Erro ao carregar ${filePath}</div>`;
            }
        });

        await Promise.all(promises);
    }

    setupRouting() {
        // Ouve mudanças na URL (#home, #about)
        window.addEventListener('hashchange', () => this.handleRoute());
        // Carrega a página inicial na primeira visita
        this.handleRoute();
    }

    handleRoute() {
        // Pega o hash da URL (ex: #about -> about) ou define 'home' como padrão
        const hash = window.location.hash.slice(1) || 'home';
        this.loadPage(hash);
    }

    async loadPage(page) {
        const contentPlaceholder = document.getElementById('content-placeholder');
        if (!contentPlaceholder) {
            // Se o main.html ainda não carregou ou não tem o placeholder, espera um pouco
            console.warn('Placeholder de conteúdo não encontrado. O main.html carregou?');
            return;
        }

        // Mostra um loading simples
        contentPlaceholder.style.opacity = '0.5';

        try {
            // Busca o JSON da página (ex: pages/home.json)
            const response = await fetch(`pages/${page}.json`);
            
            if (!response.ok) {
                throw new Error(`Página não encontrada: ${page}`);
            }

            const data = await response.json();
            
            // Injeta o HTML do JSON no placeholder
            if (data.html) {
                contentPlaceholder.innerHTML = data.html;
                contentPlaceholder.style.opacity = '1';
            }

            // Atualiza SEO (Título e Descrição)
            if (data.title) document.title = data.title;
            if (data.description) {
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) metaDesc.content = data.description;
            }

        } catch (error) {
            console.error(`Erro ao carregar página ${page}:`, error);
            contentPlaceholder.innerHTML = `
                <div class="text-center py-10">
                    <h2 class="text-2xl font-bold text-gray-700">Conteúdo não encontrado</h2>
                    <p class="text-gray-500">Não foi possível carregar o arquivo <code>pages/${page}.json</code>.</p>
                </div>
            `;
            contentPlaceholder.style.opacity = '1';
        }
    }
}

// Inicializa o motor
const templateEngine = new TemplateEngine();
