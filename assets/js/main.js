/**
 * Main JS - Audit Educa
 * Controlador Principal: Coordena a inicialização após o Template Engine.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ouve o evento de sucesso do Template Engine
    document.addEventListener('template-loaded', () => {
        console.log('🏁 Main JS: Evento recebido. Inicializando app...');
        initializeApp();
    });

    // 2. Fallback: Se o evento já ocorreu (cache rápido), verifica a variável global
    if (window.TemplateEngine) {
        // Aguarda um pequeno delay para garantir que o DOM injetado foi processado
        setTimeout(initializeApp, 50);
    }
});

function initializeApp() {
    // Previne inicialização dupla
    if (window.appInitialized) return;
    window.appInitialized = true;

    try {
        // A. Inicializa lógica do Header (Menu Mobile)
        // Se a função existir no escopo global (carregada pelo executeScripts)
        if (typeof initHeader === 'function') {
            initHeader();
        }

        // B. Inicializa Gerenciador de Cookies
        if (typeof CookieManager !== 'undefined') {
            CookieManager.init();
        }

        // C. Ajustes de Layout
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
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const height = entry.contentRect.height;
                if (height > 0) {
                    // Adiciona padding para o conteúdo não ficar atrás do header fixo
                    main.style.paddingTop = `0px`; // O header agora é sticky relativo ao placeholder, se necessário ajuste aqui
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