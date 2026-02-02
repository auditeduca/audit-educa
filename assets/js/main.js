/**
 * Main JS - Audit Educa
 * Controlador Principal: Coordena a inicialização após o Template Engine.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Escuta o evento disparado pelo Template Engine
    document.addEventListener('template-loaded', () => {
        console.log('🏁 Main JS: Templates prontos. Inicializando lógica dependente...');
        initializeApp();
    });

    // Fallback de segurança: Se o evento já passou (raro, mas possível em cache), verifica manualmente
    if (window.TemplateEngineInstance && window.TemplateEngineInstance.componentsLoaded) {
        initializeApp();
    }
});

function initializeApp() {
    // 1. Inicializa lógica do Header (Menu Mobile, etc)
    // Verifica se a função existe no escopo global (vinda do header.html/js)
    if (typeof initHeader === 'function') {
        initHeader();
    }

    // 2. Inicializa Gerenciador de Cookies
    // Agora é seguro, pois o banner (que estava no modals ou index) já existe no DOM
    if (typeof CookieManager !== 'undefined') {
        CookieManager.init();
    } else {
        console.warn('CookieManager não encontrado.');
    }

    // 3. Ajustes Finais de Layout (Sticky Footer e Header Fixo)
    adjustMainSpacing();

    // 4. Remove Preloader com transição suave
    removePreloader();
}

function adjustMainSpacing() {
    const header = document.querySelector('header'); // Agora o <header> existe, pois foi injetado
    const main = document.querySelector('main');
    
    if (header && main) {
        // Usa ResizeObserver para detectar mudanças de tamanho no header (ex: troca de banner responsivo)
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const height = entry.contentRect.height;
                // Ajusta o padding do main para o conteúdo não ficar escondido
                main.style.paddingTop = `calc(${height}px + 2rem)`; 
                // Garante sticky footer
                main.style.minHeight = `calc(100vh - ${height}px - 100px)`; 
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