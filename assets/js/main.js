/**
 * Main JS - Audit Educa
 * Controlador Principal: Coordena a inicialização após o Template Engine.
 * Atualizado para arquitetura orientada a eventos.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ouve o evento de sucesso do Template Engine
    document.addEventListener('template-loaded', () => {
        console.log('🏁 Main JS: Evento recebido. Inicializando app...');
        initializeApp();
    });

    // 2. Fallback: Se o evento já ocorreu (cache rápido), verifica a variável global
    if (window.TemplateEngine && window.TemplateEngine.componentsLoaded) {
        console.log('🏁 Main JS: Engine já estava pronto (fallback).');
        initializeApp();
    }
});

function initializeApp() {
    // Previne inicialização dupla
    if (window.appInitialized) return;
    window.appInitialized = true;

    try {
        // A. Inicializa lógica do Header (Menu Mobile)
        if (typeof initHeader === 'function') {
            initHeader();
        }

        // B. Inicializa Gerenciador de Cookies
        if (typeof CookieManager !== 'undefined') {
            CookieManager.init();
        } else {
            console.warn('⚠️ CookieManager não definido.');
        }

        // C. Ajustes de Layout (Sticky Footer)
        adjustMainSpacing();

        // D. Remove Preloader
        removePreloader();
        
    } catch (error) {
        console.error('❌ Erro durante initializeApp:', error);
    }
}

function adjustMainSpacing() {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    
    if (header && main) {
        // Usa ResizeObserver para responsividade em tempo real do cabeçalho
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const height = entry.contentRect.height;
                if (height > 0) {
                    main.style.paddingTop = `calc(${height}px + 2rem)`;
                    main.style.minHeight = `calc(100vh - ${height}px - 100px)`;
                }
            }
        });
        resizeObserver.observe(header);
    }
}

function removePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.transition = 'opacity 0.5s ease';
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 500);
    }
}