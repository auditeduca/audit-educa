class TemplateEngine {
    constructor() {
        // Configuração dos containers e arquivos
        this.config = {
            'header-container': 'components/header.html',
            'main-container': 'components/main.html',
            'footer-container': 'components/footer.html'
        };
        this.currentPage = null; // Rastreia a página atual para evitar recargas desnecessárias
        console.log('TemplateEngine: Iniciando...');
        this.init();
    }

    async init() {
        // Passo 1: Carregar a estrutura base (HTMLs)
        await this.loadComponents();
        
        // Passo 2: Avisar ao sistema que o HTML base está pronto
        // Isso permite que header.js e footer.js anexem seus eventos (cliques, modais)
        window.__COMPONENTS_LOADED__ = true;
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
        console.log('TemplateEngine: Componentes HTML carregados. Eventos disparados.');

        // Passo 3: Carregar o conteúdo dinâmico (JSON) dentro do Main
        this.setupRouting();
    }

    async loadComponents() {
        const isLocalFile = window.location.protocol === 'file:';

        // Cria um array de promessas para carregar tudo em paralelo
        const promises = Object.entries(this.config).map(async ([containerId, filePath]) => {
            const container = document.getElementById(containerId);
            
            if (!container) {
                console.warn(`TemplateEngine: Container #${containerId} não encontrado no index.html`);
                return;
            }

            // Verificação de segurança para execução local sem servidor
            if (isLocalFile) {
                container.innerHTML = `
                    <div style="background:#fee2e2; color:#991b1b; padding:1rem; border:1px solid #f87171; margin:10px;">
                        <strong>Erro de CORS:</strong> Não é possível carregar <em>${filePath}</em> via protocolo 'file://'.<br>
                        Por favor, abra este projeto usando um Servidor Local (ex: Live Server do VSCode).
                    </div>`;
                return;
            }

            try {
                // Adiciona timestamp para evitar cache agressivo durante desenvolvimento
                const response = await fetch(`${filePath}?v=${Date.now()}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const html = await response.text();
                container.innerHTML = html;
                
                // Executa scripts que possam estar dentro do HTML injetado (raro, mas útil)
                this.executeScripts(container);

            } catch (error) {
                console.error(`TemplateEngine: Erro ao carregar ${filePath}:`, error);
                container.innerHTML = `<div class="error-msg">Falha ao carregar componente: ${filePath}</div>`;
            }
        });

        await Promise.all(promises);
    }

    setupRouting() {
        // Lista de IDs internos que NÃO devem ser tratados como páginas JSON
        const internalAnchors = [
            'header', 'footer', 'main-content', 
            'acesso-rapido', 'inicio', 'newsletter', 
            'backToTop', 'cookie-fab'
        ];

        const loadRoute = () => {
            let hash = window.location.hash.slice(1);
            
            // Lógica de proteção:
            // 1. Se o hash for uma âncora interna (ex: #footer), ignoramos a carga de nova página.
            // 2. Se for a primeira carga (currentPage é null) e o hash for interno, forçamos 'home' 
            //    para garantir que o usuário veja conteúdo além do rodapé/topo.
            if (internalAnchors.includes(hash)) {
                if (this.currentPage) {
                    console.log(`TemplateEngine: Navegação interna para #${hash}. Mantendo página atual.`);
                    return; // Apenas rola a página, não carrega JSON
                }
                hash = 'home'; // Fallback para home na inicialização
            }

            // Se não houver hash, assume 'home'
            hash = hash || 'home';

            // Evita recarregar a mesma página JSON se já estiver nela
            if (this.currentPage === hash) return;

            console.log(`TemplateEngine: Carregando rota '${hash}' (pages/${hash}.json)...`);
            this.currentPage = hash;
            this.loadPage(hash);
        };

        // Ouve mudanças na URL e carrega na inicialização
        window.addEventListener('hashchange', loadRoute);
        loadRoute();
    }

    async loadPage(pageName) {
        const contentPlaceholder = document.getElementById('content-placeholder');
        
        // Se o main.html não carregou corretamente, não há onde por o JSON
        if (!contentPlaceholder) {
            console.error('TemplateEngine: #content-placeholder não encontrado. O main.html foi carregado?');
            return;
        }

        // Indicador de carregamento visual
        contentPlaceholder.style.opacity = '0.5';

        try {
            // Busca o JSON da página (ex: pages/home.json)
            const response = await fetch(`pages/${pageName}.json?v=${Date.now()}`);
            
            if (!response.ok) {
                throw new Error(`Arquivo pages/${pageName}.json não encontrado.`);
            }

            const data = await response.json();
            
            // Injeção do Conteúdo
            if (data.html) {
                contentPlaceholder.innerHTML = data.html;
                
                // Re-executa scripts se houver lógica no HTML injetado (ex: formulários)
                this.executeScripts(contentPlaceholder);
                
                // Animação suave de entrada
                contentPlaceholder.style.opacity = '1';
                contentPlaceholder.classList.add('animate-fade-in');
            }

            // Atualização de SEO
            if (data.title) document.title = data.title;
            if (data.description) {
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) metaDesc.content = data.description;
            }

        } catch (error) {
            console.error(`TemplateEngine: Erro ao carregar página ${pageName}:`, error);
            
            // Fallback amigável se a página não existir (ex: clicou em "Sobre Nós" mas não tem sobre.json)
            // Em vez de erro feio, avisa ou redireciona para Home se preferir.
            if (pageName !== 'home') {
                 console.log('Tentando carregar Home como fallback...');
                 this.loadPage('home'); // Tenta carregar a home se a página falhar
                 return;
            }

            contentPlaceholder.innerHTML = `
                <div class="flex flex-col items-center justify-center py-20 text-gray-500">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4 text-audit-gold"></i>
                    <h2 class="text-xl font-bold">Conteúdo indisponível</h2>
                    <p>Não foi possível carregar o conteúdo principal.</p>
                </div>
            `;
            contentPlaceholder.style.opacity = '1';
        }
    }

    // Utilitário para rodar <script> tags que venham dentro do HTML injetado
    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }
}

// Inicializa o motor
const templateEngine = new TemplateEngine();
