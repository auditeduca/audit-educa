        document.addEventListener('DOMContentLoaded', () => {
            // --- Variáveis DOM ---
            const backToTopBtn = document.getElementById('backToTop');
            const cookieFab = document.getElementById('cookie-fab');
            const cookieBanner = document.getElementById('cookie-banner');
            const cookieOverlay = document.getElementById('cookie-overlay');
            const cookieModalContent = document.getElementById('cookie-modal-content');
            
            // Botões de ação
            const bannerAcceptBtn = document.getElementById('banner-accept');
            const bannerOptionsBtn = document.getElementById('banner-options');
            const footerConfigBtn = document.getElementById('footer-config-btn');
            const footerCookiesBtn = document.getElementById('footer-cookies-btn');
            const modalCloseX = document.getElementById('modal-close-x');
            const modalSaveBtn = document.getElementById('modal-save');
            const modalRejectAllBtn = document.getElementById('modal-reject-all');
            const toggleDescBtns = document.querySelectorAll('.cookie-desc-toggle');
            const themeToggleBtn = document.getElementById('theme-toggle');

            // --- Lógica de LocalStorage (Cookies) ---
            const checkCookieConsent = () => {
                const consent = localStorage.getItem('auditEducaConsent');
                if (!consent) {
                    setTimeout(() => {
                        cookieBanner.classList.remove('translate-y-full');
                    }, 1000); // Delay de 1s para aparecer
                } else {
                    // Carregar configurações salvas nos checkboxes se necessário
                    const preferences = JSON.parse(consent);
                    if (document.getElementById('check-stats')) document.getElementById('check-stats').checked = preferences.analytics;
                    if (document.getElementById('check-mkt')) document.getElementById('check-mkt').checked = preferences.marketing;
                }
            };

            const saveConsent = (analytics, marketing) => {
                const consent = {
                    necessary: true,
                    analytics: analytics,
                    marketing: marketing,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem('auditEducaConsent', JSON.stringify(consent));
                
                // Esconde Banner
                cookieBanner.classList.add('translate-y-full');
                // Esconde Modal
                closeModal();
            };

            // --- Lógica do Modal ---
            const openModal = () => {
                cookieOverlay.classList.remove('invisible', 'opacity-0');
                cookieModalContent.classList.remove('translate-y-full');
                // Esconde o banner se estiver aberto para não sobrepor
                cookieBanner.classList.add('translate-y-full');
            };

            const closeModal = () => {
                cookieOverlay.classList.add('opacity-0');
                cookieModalContent.classList.add('translate-y-full');
                
                setTimeout(() => {
                    cookieOverlay.classList.add('invisible');
                }, 300);

                // Se não houve consentimento ainda, mostra o banner novamente
                if (!localStorage.getItem('auditEducaConsent')) {
                   cookieBanner.classList.remove('translate-y-full'); 
                }
            };

            // --- Event Listeners ---

            // Scroll Back to Top
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                    backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
                } else {
                    backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
                    backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Abrir Modal
            cookieFab.addEventListener('click', openModal);
            bannerOptionsBtn.addEventListener('click', openModal);
            if (footerConfigBtn) footerConfigBtn.addEventListener('click', openModal);
            if (footerCookiesBtn) footerCookiesBtn.addEventListener('click', openModal);

            // Fechar Modal
            modalCloseX.addEventListener('click', closeModal);
            cookieOverlay.addEventListener('click', (e) => {
                if (e.target === cookieOverlay) closeModal();
            });

            // Expandir Detalhes (Accordion)
            toggleDescBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetId = btn.getAttribute('data-target');
                    const targetContent = document.getElementById(targetId);
                    const icon = btn.querySelector('.fa-chevron-down');
                    
                    targetContent.classList.toggle('hidden');
                    
                    // Girar ícone
                    if (targetContent.classList.contains('hidden')) {
                        icon.style.transform = 'rotate(0deg)';
                    } else {
                        icon.style.transform = 'rotate(180deg)';
                    }
                });
            });

            // Ações de Consentimento
            bannerAcceptBtn.addEventListener('click', () => {
                // Aceita tudo
                if (document.getElementById('check-stats')) document.getElementById('check-stats').checked = true;
                if (document.getElementById('check-mkt')) document.getElementById('check-mkt').checked = true;
                saveConsent(true, true);
            });

            modalSaveBtn.addEventListener('click', () => {
                const analytics = document.getElementById('check-stats') ? document.getElementById('check-stats').checked : false;
                const marketing = document.getElementById('check-mkt') ? document.getElementById('check-mkt').checked : false;
                saveConsent(analytics, marketing);
            });

            modalRejectAllBtn.addEventListener('click', () => {
                if (document.getElementById('check-stats')) document.getElementById('check-stats').checked = false;
                if (document.getElementById('check-mkt')) document.getElementById('check-mkt').checked = false;
                saveConsent(false, false);
            });

            // Dark Mode Toggle (Apenas para demonstração)
            if (themeToggleBtn) {
                themeToggleBtn.addEventListener('click', () => {
                    document.documentElement.classList.toggle('dark');
                });
            }

            // Inicialização
            checkCookieConsent();
        });
