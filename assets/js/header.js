/**
 * Lógica do Header, Mega Menu e Menu Mobile
 * Espera o evento 'audit:components:loaded' para garantir que o HTML existe.
 */

document.addEventListener('audit:components:loaded', () => {
    console.log("[Header.js] Iniciando lógica do header...");

    // --- MENU MOBILE ---
    const mobileMenu = document.getElementById('mobile-menu');
    const openBtn = document.querySelector('[data-toggle="mobile-menu"]'); // Adicione este atributo no seu botão hambúrguer no header.html
    // OU se o botão tiver um ID específico, use: const openBtn = document.getElementById('mobile-menu-trigger');
    const closeBtn = document.getElementById('close-mobile-menu');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    const drawer = document.getElementById('mobile-menu-drawer');

    // Função para abrir
    const openMobileMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('hidden');
        // Pequeno delay para permitir transição CSS
        setTimeout(() => {
            if (backdrop) backdrop.classList.remove('opacity-0');
            if (drawer) drawer.classList.remove('-translate-x-full');
        }, 10);
    };

    // Função para fechar
    const closeMobileMenu = () => {
        if (!mobileMenu) return;
        if (backdrop) backdrop.classList.add('opacity-0');
        if (drawer) drawer.classList.add('-translate-x-full');
        
        // Espera a animação acabar para esconder
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
    };

    // Event Listeners Mobile
    if (openBtn) openBtn.addEventListener('click', openMobileMenu);
    
    // Fallback: Tenta encontrar qualquer botão com classes comuns de hamburger se o data-toggle não existir
    if (!openBtn) {
        const potentialBtn = document.querySelector('.hamburger') || document.querySelector('#hamburger-btn');
        if (potentialBtn) potentialBtn.addEventListener('click', openMobileMenu);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
    if (backdrop) backdrop.addEventListener('click', closeMobileMenu);

    // --- MEGA MENU DESKTOP ---
    // Adiciona delay para evitar que o menu feche instantaneamente ao mover o mouse
    const megaMenuItems = document.querySelectorAll('.has-mega-menu'); // Certifique-se que o LI pai tem essa classe

    megaMenuItems.forEach(item => {
        const panel = item.querySelector('.mega-panel');
        let timeout;

        if (panel) {
            item.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                panel.style.visibility = 'visible';
                panel.style.opacity = '1';
                panel.style.transform = 'translateY(0)';
            });

            item.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    panel.style.visibility = 'hidden';
                    panel.style.opacity = '0';
                    panel.style.transform = 'translateY(-10px)';
                }, 200); // 200ms de tolerância
            });
        }
    });

    // --- PESQUISA ---
    // (Adicione lógica de pesquisa aqui se houver botão de lupa)
});