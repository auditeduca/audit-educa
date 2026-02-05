/**
 * CookieManager.js
 * Gerencia consentimento LGPD/GDPR, banner de cookies e ativação condicional de scripts.
 */

const CookieManager = {
    config: {
        storageKey: 'auditEduca_consent_v1', // Versão para forçar re-aceite se mudar a política
        expiryDays: 365,
        selectors: {
            banner: 'cookie-banner',
            fab: 'cookie-fab',
            acceptBtn: 'banner-accept',
            optionsBtn: 'banner-options',
            modal: 'cookie-modal', // ID do modal de preferências (verifique no seu modals-main.html)
            modalSaveBtn: 'modal-save',
            modalRejectBtn: 'modal-reject-all',
            checkboxAnalytics: 'check-stats',
            checkboxMarketing: 'check-mkt'
        }
    },

    state: {
        necessary: true, // Sempre true
        analytics: false,
        marketing: false,
        consented: false,
        timestamp: null
    },

    init() {
        console.log('🍪 CookieManager: Inicializando...');
        this.loadConsent();
        this.bindEvents();
        
        if (!this.state.consented) {
            this.showBanner();
        } else {
            this.applyConsent(); // Aplica scripts se já tiver consentimento salvo
            this.showFab();
        }
    },

    loadConsent() {
        const stored = localStorage.getItem(this.config.storageKey);
        if (stored) {
            try {
                this.state = JSON.parse(stored);
            } catch (e) {
                console.error('🍪 Erro ao ler consentimento, resetando...', e);
                localStorage.removeItem(this.config.storageKey);
            }
        }
    },

    saveConsent(preferences) {
        this.state = {
            ...this.state,
            ...preferences,
            consented: true,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem(this.config.storageKey, JSON.stringify(this.state));
        
        this.hideBanner();
        this.showFab();
        this.applyConsent();
        
        // Feedback visual (Opcional, requer utils.js)
        if (typeof Utils !== 'undefined' && Utils.showNotification) {
            Utils.showNotification('Preferências de privacidade salvas com sucesso!', 'success');
        }
    },

    bindEvents() {
        const els = this.getElements();

        // 1. Botão "Aceitar Tudo" no Banner
        if (els.acceptBtn) {
            els.acceptBtn.addEventListener('click', () => {
                this.saveConsent({ analytics: true, marketing: true });
            });
        }

        // 2. Botão "Personalizar" (Abre Modal)
        if (els.optionsBtn) {
            els.optionsBtn.addEventListener('click', () => {
                this.openPreferencesModal();
            });
        }

        // 3. Botão Flutuante (Reabrir Banner/Modal)
        if (els.fab) {
            els.fab.addEventListener('click', () => {
                this.openPreferencesModal();
            });
        }

        // 4. Salvar dentro do Modal
        if (els.modalSaveBtn) {
            els.modalSaveBtn.addEventListener('click', () => {
                const analytics = document.getElementById(this.config.selectors.checkboxAnalytics)?.checked || false;
                const marketing = document.getElementById(this.config.selectors.checkboxMarketing)?.checked || false;
                this.saveConsent({ analytics, marketing });
                this.closePreferencesModal();
            });
        }

        // 5. Rejeitar Tudo dentro do Modal
        if (els.modalRejectBtn) {
            els.modalRejectBtn.addEventListener('click', () => {
                this.saveConsent({ analytics: false, marketing: false });
                
                // Desmarca checkboxes visuais
                if(document.getElementById(this.config.selectors.checkboxAnalytics)) 
                    document.getElementById(this.config.selectors.checkboxAnalytics).checked = false;
                if(document.getElementById(this.config.selectors.checkboxMarketing)) 
                    document.getElementById(this.config.selectors.checkboxMarketing).checked = false;
                
                this.closePreferencesModal();
            });
        }
    },

    applyConsent() {
        // Lógica para ativar scripts baseados no consentimento
        console.log('🍪 Aplicando consentimento:', this.state);

        // Scripts de Analytics (Ex: GA4)
        if (this.state.analytics) {
            this.loadAnalyticsScripts();
        }

        // Scripts de Marketing (Ex: Pixel do Facebook, Ads)
        if (this.state.marketing) {
            this.loadMarketingScripts();
        }
    },

    loadAnalyticsScripts() {
        if (window.analyticsLoaded) return;
        window.analyticsLoaded = true;
        console.log('📊 Carregando Scripts de Analytics...');
        // Exemplo: Inserir tag do Google Analytics dinamicamente aqui
        /*
        const script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=SEU-ID';
        document.head.appendChild(script);
        */
    },

    loadMarketingScripts() {
        if (window.marketingLoaded) return;
        window.marketingLoaded = true;
        console.log('📢 Carregando Scripts de Marketing...');
    },

    // --- Controle de UI ---

    showBanner() {
        const banner = document.getElementById(this.config.selectors.banner);
        if (banner) {
            banner.style.display = 'flex'; // Garante que não está display:none
            // Pequeno delay para permitir transição CSS (translate-y)
            setTimeout(() => {
                banner.classList.remove('translate-y-full');
            }, 100);
        }
    },

    hideBanner() {
        const banner = document.getElementById(this.config.selectors.banner);
        if (banner) {
            banner.classList.add('translate-y-full');
            // Espera transição terminar antes de esconder
            setTimeout(() => {
                // banner.style.display = 'none'; // Opcional, depende do CSS
            }, 500);
        }
    },

    showFab() {
        const fab = document.getElementById(this.config.selectors.fab);
        if (fab) {
            fab.classList.remove('hidden');
            fab.classList.add('flex'); // ou a classe que o torna visível
        }
    },

    openPreferencesModal() {
        // Assume que você tem um modal com ID 'cookie-modal' ou similar nos seus partials
        // Se usar o modals-main.html, verifique o ID correto do container do modal de cookies
        const modal = document.querySelector('.cookie-modal-overlay') || document.getElementById('modal-cookies'); 
        
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            // Pré-seleciona os checkboxes com o estado atual
            const chkStats = document.getElementById(this.config.selectors.checkboxAnalytics);
            const chkMkt = document.getElementById(this.config.selectors.checkboxMarketing);
            
            if (chkStats) chkStats.checked = this.state.analytics;
            if (chkMkt) chkMkt.checked = this.state.marketing;
        } else {
            console.warn('🍪 Modal de preferências não encontrado no DOM.');
        }
    },

    closePreferencesModal() {
        const modal = document.querySelector('.cookie-modal-overlay') || document.getElementById('modal-cookies');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    },

    getElements() {
        const s = this.config.selectors;
        return {
            banner: document.getElementById(s.banner),
            fab: document.getElementById(s.fab),
            acceptBtn: document.getElementById(s.acceptBtn),
            optionsBtn: document.getElementById(s.optionsBtn),
            modalSaveBtn: document.getElementById(s.modalSaveBtn),
            modalRejectBtn: document.getElementById(s.modalRejectBtn)
        };
    }
};

// Expor globalmente
window.CookieManager = CookieManager;