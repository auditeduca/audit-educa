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
        await this.loadComponents();
        // Dispara evento para avisar outros scripts que o HTML está pronto
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
    }

    async loadComponents() {
        // Verifica se está rodando em file:// (o que bloqueia o fetch)
        const isLocalFile = window.location.protocol === 'file:';

        const promises = Object.entries(this.config).map(async ([containerId, filePath]) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Se for arquivo local sem servidor, mostra aviso amigável
            if (isLocalFile) {
                container.innerHTML = `
                    <div style="background: #fee2e2; color: #991b1b; padding: 1rem; border: 1px solid #f87171; font-family: sans-serif; margin: 10px;">
                        <strong>Erro de Visualização:</strong> Navegadores bloqueiam carregamento de componentes modulares (<em>${filePath}</em>) quando o arquivo é aberto direto.
                        <br>
                        <strong>Solução:</strong> Use um servidor local (ex: Live Server do VSCode) ou suba para o GitHub Pages.
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
                container.innerHTML = `
                    <div style="background: #fee2e2; color: #991b1b; padding: 1rem; border: 1px solid #f87171; margin: 10px;">
                        Erro ao carregar <strong>${filePath}</strong>. (Verifique se a pasta 'components' existe na raiz).
                    </div>
                `;
            }
        });

        await Promise.all(promises);
    }
}

// Inicializa o motor
const templateEngine = new TemplateEngine();
