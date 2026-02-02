/**
 * Main JS - Audit Educa
 * Integração de componentes, inicialização e lógica global.
 */

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Carrega os componentes essenciais (Header, Footer, Modais)
        // Assume-se que 'loadComponent' vem do template-engine.js
        if (typeof loadTemplate === 'function') {
            await Promise.all([
                loadTemplate('header', 'assets/components/header.html'),
                loadTemplate('footer', 'assets/components/footer.html'),
                loadTemplate('modals', 'assets/components/modals-main.html') // Assume que o banner de cookie está aqui
            ]);
        } else {
            console.error('Template Engine não encontrado.');
        }

        // 2. Inicializa lógica específica do cabeçalho (menu mobile, etc)
        // Verifica se a função existe no escopo global (vinda de header.js)
        if (typeof initHeader === 'function') initHeader();

        // 3. Inicializa lógica de Cookies
        // Crítico: Só roda DEPOIS que 'modals' foi carregado no passo 1
        if (typeof CookieManager !== 'undefined') {
            CookieManager.init();
        }

        // 4. Ajustes de Layout (Espaçamento dinâmico)
        adjustMainSpacing();

        // 5. Remove Preloader
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }

    } catch (error) {
        console.error('Erro na inicialização da página:', error);
    }
});

// Ajusta o padding-top do main baseado na altura do header (se for fixo)
function adjustMainSpacing() {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    
    if (header && main) {
        const headerHeight = header.offsetHeight;
        // Adiciona um pouco de respiro extra (ex: +2rem)
        main.style.paddingTop = `calc(${headerHeight}px + 2rem)`;
        
        // Garante que o footer fique no final da página (Sticky Footer logic)
        main.style.minHeight = `calc(100vh - ${headerHeight}px - 200px)`; // 200px estimado do footer
    }
}

// Ouve redimensionamento para reajustar
window.addEventListener('resize', adjustMainSpacing);