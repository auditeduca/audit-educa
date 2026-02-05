/**
 * Main JS - Audit Educa
 * Controlador Principal: Coordena a inicialização após o Template Engine.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ouve o evento de sucesso do Template Engine
    // O Template Engine dispara 'template-loaded' quando o HTML (header/footer) é injetado
    document.addEventListener('template-loaded', () => {
        console.log('🏁 Main JS: Evento recebido. Inicializando app...');
        setTimeout(initializeApp, 100);
    });

    // 2. Fallback: Se o evento já ocorreu ou TemplateEngine já terminou
    if (window.TemplateEngine && window.__TEMPLATE_ENGINE_INIT__) {
        setTimeout(initializeApp, 100);
    }
});

function initializeApp() {
    // Previne inicialização dupla
    if (window.appInitialized) return;
    window.appInitialized = true;

    try {
        // A. Inicializa lógica do Header (Menu Mobile, Acessibilidade)
        if (typeof window.HeaderManager !== 'undefined') {
            // O HeaderManager geralmente se auto-inicializa, mas podemos forçar se necessário
            // window.headerManagerInstance = new HeaderManager(); 
        }

        // B. Inicializa Gerenciador de Cookies (CORREÇÃO AQUI)
        if (typeof window.CookieManager !== 'undefined') {
            window.CookieManager.init();
        } else {
            console.warn('⚠️ CookieManager.js não foi carregado. Adicione <script src="assets/js/cookie-manager.js"></script> ao seu HTML.');
        }

        // C. Ajustes de Layout (Footer fixo, etc)
        adjustMainSpacing();

        // D. Remove Preloader (Transição final)
        removePreloader();
        
        // E. Inicializa Ícones (Lucide/FontAwesome se necessário recarregar)
        if (window.lucide) window.lucide.createIcons();

    } catch (error) {
        console.error('❌ Erro durante initializeApp:', error);
    }
}

function adjustMainSpacing() {
    const main = document.querySelector('main');
    if (main) {
        // Garante que o footer fique no final da página (Sticky Footer via JS fallback)
        // O CSS flex-grow já deve cuidar disso, mas isso é uma garantia extra
        const footerHeight = document.getElementById('footer')?.offsetHeight || 100;
        main.style.minHeight = `calc(100vh - ${footerHeight}px)`;
    }
}

function removePreloader() {
    const preloader = document.getElementById('loader-wrapper'); // ID corrigido baseado no preloader.js
    if (preloader) {
        // O preloader.js já gerencia a lógica complexa, aqui apenas garantimos que ele não trave
        setTimeout(() => {
            if (!document.body.classList.contains('loaded-complete')) {
                document.body.classList.add('loaded-complete');
            }
        }, 2000); // Timeout de segurança
    }
}