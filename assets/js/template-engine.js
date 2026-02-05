/**
 * Template Engine Simples para Audit Educa
 * Carrega componentes HTML (Header, Footer, Modais) e injeta na página.
 * Dispara evento 'audit:components:loaded' quando finalizado.
 */

document.addEventListener('DOMContentLoaded', async () => {
    
    // Função auxiliar para carregar um componente
    const loadComponent = async (id, file) => {
        const element = document.getElementById(id);
        if (!element) return;

        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Erro ao carregar ${file}`);
            const html = await response.text();
            
            // Injeta o HTML
            element.innerHTML = html;
            
            // Executa scripts que possam estar dentro do HTML injetado (opcional, mas útil)
            const scripts = element.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });

        } catch (error) {
            console.error(`[TemplateEngine] Falha ao carregar ${file}:`, error);
        }
    };

    // Lista de promessas de carregamento
    // Verifica se os placeholders existem no index.html antes de tentar carregar
    const loadPromises = [];

    // Tenta carregar Header
    // (Você precisará criar <div id="header-placeholder"></div> no topo do seu index.html se não tiver)
    if (document.getElementById('header-placeholder')) {
        loadPromises.push(loadComponent('header-placeholder', 'assets/components/header.html'));
    } else {
        // Fallback: se o header for carregado via 'header.html' direto no body ou similar, ajuste aqui.
        // Assumindo padrão de placeholders:
        console.warn("[TemplateEngine] #header-placeholder não encontrado.");
    }

    // Carrega Footer
    if (document.getElementById('footer-placeholder')) {
        loadPromises.push(loadComponent('footer-placeholder', 'assets/components/footer.html'));
    }

    // Carrega Modais (inclui Cookie Banner)
    if (document.getElementById('modals-placeholder')) {
        loadPromises.push(loadComponent('modals-placeholder', 'assets/components/modals-main.html'));
    }

    // Aguarda todos carregarem
    await Promise.all(loadPromises);

    console.log("[TemplateEngine] Todos os componentes carregados.");

    // DISPARA O EVENTO QUE OS OUTROS SCRIPTS ESTÃO ESPERANDO
    const event = new Event('audit:components:loaded');
    document.dispatchEvent(event);
    
    // Inicializa Lucide Icons (se estiver sendo usado)
    if (window.lucide) window.lucide.createIcons();
});