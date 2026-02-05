/**
 * Footer.js
 * Gerencia interações específicas da área do rodapé (ex: validação de newsletter, links).
 * A lógica de Cookies foi movida para assets/js/cookie-manager.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // Aguarda o template carregar o footer
    const initFooterInteractions = () => {
        const footer = document.getElementById('footer');
        if (!footer) return;

        console.log('🦶 Footer interações inicializadas.');

        // 1. Configurar ano atual automaticamente
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }

        // 2. Lógica do botão "Voltar ao Topo" (se existir no footer.html)
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.remove('opacity-0', 'invisible');
                    backToTopBtn.classList.add('opacity-100', 'visible');
                } else {
                    backToTopBtn.classList.add('opacity-0', 'invisible');
                    backToTopBtn.classList.remove('opacity-100', 'visible');
                }
            });

            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    };

    // Tenta inicializar quando o evento do template ocorrer
    document.addEventListener('template-loaded', initFooterInteractions);
    
    // Ou se o DOM já estiver pronto e o template engine também
    if (document.getElementById('footer')) {
        initFooterInteractions();
    }
});