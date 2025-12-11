class TemplateEngine {
    constructor() {
        this.components = {};
        // Mapeamento dos containers para os arquivos
        this.config = {
            'header-container': 'components/header.html',
            'main-container': 'components/main.html',
            'footer-container': 'components/footer.html'
        };
        this.init();
    }

    async init() {
        await this.loadComponents();
        // Não precisamos chamar injectComponents aqui pois loadComponents já injeta conforme carrega
        this.dispatchComponentsLoaded();
        this.setupRouting(); // Se houver roteamento de páginas
    }

    async loadComponents() {
        const promises = Object.entries(this.config).map(async ([containerId, filePath]) => {
            const container = document.getElementById(containerId);
            if (!container) return; // Se o container não existe na página, ignora

            try {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const html = await response.text();
                
                // Injeta o HTML
                container.innerHTML = html;
                
                // Salva em cache se necessário
                const componentName = filePath.split('/')[1].replace('.html', '');
                this.components[componentName] = html;

            } catch (error) {
                console.error(`Erro ao carregar componente ${filePath}:`, error);
                container.innerHTML = `<div class="p-4 text-red-500 bg-red-100 rounded">Erro ao carregar ${filePath}. Verifique se o arquivo existe e se você está usando um Servidor Local (http://) e não abrindo o arquivo direto (file://).</div>`;
            }
        });

        await Promise.all(promises);
    }

    dispatchComponentsLoaded() {
        // Dispara evento para avisar ao header.js e outros scripts que o HTML está pronto
        document.dispatchEvent(new CustomEvent('componentsLoaded', {
            detail: { components: this.components }
        }));
    }

    setupRouting() {
        // Lógica simples de roteamento para carregar conteúdo no main
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1) || 'home';
            // Aqui você pode expandir para carregar pages/home.json se necessário
            console.log('Navegou para:', hash);
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Executa na carga inicial
    }
}

// Inicializa o motor
const templateEngine = new TemplateEngine();
