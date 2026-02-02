/**
 * Main JS - Audit Educa
 * Controlador Principal: Coordena a inicialização após o Template Engine.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ouve o evento de sucesso do Template Engine
    document.addEventListener('template-loaded', () => {
        console.log('🏁 Main JS: Evento recebido. Inicializando app...');
        // Pequeno delay para garantir que o navegador processou a injeção do HTML
        setTimeout(initializeApp, 100);
    });

    // 2. Fallback: Se o evento já ocorreu (cache rápido), verifica a variável global
    if (window.TemplateEngine) {
        setTimeout(initializeApp, 100);
    }
});

function initializeApp() {
    // Previne inicialização dupla
    if (window.appInitialized) return;
    window.appInitialized = true;

    try {
        // A. Inicializa lógica do Header (Menu Mobile)
        // O Template Engine recria os scripts, então o initHeader deve estar disponível globalmente
        if (typeof window.initHeader === 'function') {
            window.initHeader();
        } else {
            console.log('ℹ️ initHeader não encontrado ou carregado via script tag direta.');
        }

        // B. Inicializa Gerenciador de Cookies
        if (typeof CookieManager !== 'undefined') {
            console.log('🍪 Inicializando CookieManager...');
            CookieManager.init();
        } else {
            console.warn('⚠️ CookieManager não definido. Verifique se o script foi carregado.');
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
    const header = document.querySelector('header') || document.querySelector('#header-placeholder > div');
    const main = document.querySelector('main');
    
    if (main) {
        // Se o header for Sticky no CSS (top-0), ele ocupa espaço no fluxo normal.
        // Não precisamos adicionar padding-top no main, apenas garantir o min-height para o footer.
        // Removemos qualquer padding calculado via JS para evitar o "espaço enorme".
        main.style.paddingTop = '0px'; 
        
        // Garante que o footer fique no final da página
        const footerHeight = 100; // Altura estimada do footer
        main.style.minHeight = `calc(100vh - ${footerHeight}px)`;
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