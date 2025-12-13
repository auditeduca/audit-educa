/**
 * UTILS - Utilitários Globais Consolidados
 * Centraliza funcionalidades comuns para evitar duplicação
 */

class Utils {
    /**
     * Sistema de Notificações Unificado
     */
    static showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)} mr-2"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease-out;
            background: ${this.getNotificationColor(type)};
            color: white;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
        
        return notification;
    }

    static getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #10b981, #34d399)',
            error: 'linear-gradient(135deg, #ef4444, #f87171)',
            info: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
            warning: 'linear-gradient(135deg, #f59e0b, #fbbf24)'
        };
        return colors[type] || colors.info;
    }

    static getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        return icons[type] || icons.info;
    }

    /**
     * Animações de Números
     */
    static animateNumber(element, start, end, suffix = '', duration = 2000, delay = 0) {
        setTimeout(() => {
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + (end - start) * easeOutCubic);
                
                element.textContent = `${current}${suffix}`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        }, delay);
    }

    /**
     * Animações de Entrada de Elementos
     */
    static animateElements(selector, options = {}) {
        const elements = document.querySelectorAll(selector);
        const {
            delay = 100,
            duration = 600,
            easing = 'ease-out',
            transform = 'translateY(30px)'
        } = options;

        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = transform;
            
            setTimeout(() => {
                el.style.transition = `all ${duration}ms ${easing}`;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * delay);
        });
    }

    /**
     * Observer para Animações
     */
    static observeElement(element, callback, options = {}) {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { ...defaultOptions, ...options });

        observer.observe(element);
        return observer;
    }

    /**
     * Sistema de Modal Simplificado
     */
    static openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.warn(`⚠️ Modal não encontrado: ${modalId}`);
            return;
        }

        // Mostrar modal
        modal.classList.remove('hidden');
        
        // Animar backdrop
        const backdrop1 = modal.querySelector('.modal-backdrop');
        if (backdrop1) {
            backdrop1.style.opacity = '1';
        }
        
        // Animar conteúdo
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }

        // Configurar fechamento
        const closeBtns = modal.querySelectorAll('.modal-close-btn, .modal-close');
        closeBtns.forEach(btn => {
            // Remover listeners existentes para evitar duplicação
            btn.removeEventListener('click', this.handleModalClose);
            // Adicionar novo listener
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal(modal);
            });
        });

        // Configurar fechamento via backdrop
        const backdrop2 = modal.querySelector('.modal-backdrop');
        if (backdrop2) {
            backdrop2.removeEventListener('click', this.handleBackdropClose);
            backdrop2.addEventListener('click', (e) => {
                if (e.target === backdrop2) {
                    this.closeModal(modal);
                }
            });
        }

        // Focus no primeiro elemento focável
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';

        return modal;
    }

    static closeModal(modal) {
        if (!modal) return;

        // Animar saída
        const backdrop3 = modal.querySelector('.modal-backdrop');
        const content = modal.querySelector('.modal-content');
        
        if (backdrop3) {
            backdrop3.style.opacity = '0';
        }
        
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(8px)';
        }

        // Esconder após animação
        setTimeout(() => {
            modal.classList.add('hidden');
            
            // Restaurar scroll do body
            document.body.style.overflow = '';
        }, 300);
    }

    // Handlers para referência
    static handleModalClose(e) {
        e.preventDefault();
        const modal = e.target.closest('.modal-overlay');
        if (modal) {
            this.closeModal(modal);
        }
    }

    static handleBackdropClose(e) {
        if (e.target === e.currentTarget) {
            this.closeModal(e.currentTarget);
        }
    }

    /**
     * Debounce para Performance
     */
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    /**
     * Throttle para Performance
     */
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Validar Email
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Formatar Data
     */
    static formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        return new Intl.DateTimeFormat('pt-BR', { ...defaultOptions, ...options })
            .format(new Date(date));
    }

    /**
     * Scroll Suave
     */
    static smoothScrollTo(element, duration = 1000) {
        const targetPosition = element.offsetTop - 100;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    /**
     * Local Storage Helpers
     */
    static setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('Erro ao salvar no localStorage:', error);
        }
    }

    static getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Erro ao ler do localStorage:', error);
            return defaultValue;
        }
    }

    static removeStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('Erro ao remover do localStorage:', error);
        }
    }
}

// Adicionar estilos dinâmicos globais
const globalStyles = document.createElement('style');
globalStyles.textContent = `
    /* ANIMAÇÕES DOS MENUS */
    .animate-fade-in-down {
        animation: fadeInDown 0.3s ease-out;
    }
    
    @keyframes fadeInDown {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .search-slide-enter {
        animation: slideInDown 0.3s ease-out;
    }
    
    @keyframes slideInDown {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    /* ESTADOS DOS BOTÕES */
    .menu-trigger {
        transition: all 0.2s ease;
    }
    
    .menu-trigger:hover {
        background-color: rgba(212, 175, 55, 0.1);
    }
    
    .lang-btn-mobile {
        transition: all 0.2s ease;
    }
    
    .lang-btn-mobile.grayscale {
        filter: grayscale(100%);
    }
    
    /* TRANSIÇÕES DOS PAINÉIS */
    .desktop-panel {
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);
    }
    
    /* ESTADOS DOS MODAIS */
    .modal-overlay {
        transition: opacity 0.3s ease;
    }
    
    .modal-content {
        transition: transform 0.3s ease;
    }
    
    /* ANIMAÇÕES DOS BOTÕES FLUTUANTES */
    #backToTop, #cookie-fab {
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    }
    
    #backToTop:hover, #cookie-fab:hover {
        transform: scale(1.1);
    }
    
    /* ESTADOS DOS ACCORDIONS MOBILE */
    .mobile-submenu-content {
        transition: all 0.3s ease;
    }
    
    .mobile-accordion-trigger {
        transition: all 0.2s ease;
    }
    
    /* EFEITOS DE HOVER */
    .menu-link:hover {
        background-color: rgba(212, 175, 55, 0.1);
        padding-left: 8px;
    }
    
    .detail-link:hover {
        background-color: rgba(59, 130, 246, 0.1);
        padding-left: 4px;
    }
    
    /* RESPONSIVIDADE */
    @media (max-width: 1024px) {
        .desktop-panel {
            display: none !important;
        }
    }
    
    @media (min-width: 1024px) {
        .mobile-menu {
            display: none !important;
        }
    }
    
    /* ESTADOS FOCAIS PARA ACESSIBILIDADE */
    .menu-trigger:focus,
    .lang-btn-mobile:focus,
    .search-trigger:focus,
    .mobile-accordion-trigger:focus {
        outline: 2px solid #D4AF37;
        outline-offset: 2px;
    }
    
    /* ANIMAÇÃO DO HEADER */
    .header-scrolled {
        background-color: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(20px) !important;
    }
    
    .dark .header-scrolled {
        background-color: rgba(15, 23, 42, 0.95) !important;
    }
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(globalStyles);

// ===== CONTROLE ESPECÍFICO PARA MODAIS DE COOKIES =====
class CookieModal {
    static init() {
        this.setupCookieModalControls();
    }
    
    static setupCookieModalControls() {
        // Botões de controle do modal de cookies
        const controls = {
            'cookie-fab': 'cookie-overlay',
            'cookie-banner': 'cookie-overlay', 
            'modal-close-x': 'cookie-overlay',
            'banner-options': 'cookie-overlay',
            'footer-cookies-btn': 'cookie-overlay'
        };
        
        Object.entries(controls).forEach(([btnId, modalId]) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    CookieModal.openCookieModal();
                });
            }
        });
        
        // Botões de ação
        const rejectBtn = document.getElementById('modal-reject-all');
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                CookieModal.rejectAllCookies();
            });
        }
        
        const saveBtn = document.getElementById('modal-save');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                CookieModal.saveCookiePreferences();
            });
        }
        
        const acceptBtn = document.getElementById('banner-accept');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                CookieModal.acceptAllCookies();
            });
        }
        
        // Fechar modal ao clicar no backdrop
        const overlay = document.getElementById('cookie-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    CookieModal.closeCookieModal();
                }
            });
        }
    }
    
    static openCookieModal() {
        const overlay = document.getElementById('cookie-overlay');
        if (!overlay) return;
        
        overlay.classList.remove('opacity-0', 'invisible');
        overlay.classList.add('opacity-100', 'visible');
        
        const content = document.getElementById('cookie-modal-content');
        if (content) {
            content.classList.remove('translate-y-full');
            content.classList.add('translate-y-0');
        }
        
        document.body.style.overflow = 'hidden';
    }
    
    static closeCookieModal() {
        const overlay = document.getElementById('cookie-overlay');
        if (!overlay) return;
        
        overlay.classList.add('opacity-0', 'invisible');
        overlay.classList.remove('opacity-100', 'visible');
        
        const content = document.getElementById('cookie-modal-content');
        if (content) {
            content.classList.add('translate-y-full');
            content.classList.remove('translate-y-0');
        }
        
        document.body.style.overflow = '';
    }
    
    static acceptAllCookies() {
        // Aceitar todos os cookies
        localStorage.setItem('cookiePreferences', JSON.stringify({
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        }));
        
        this.closeCookieModal();
        this.hideCookieBanner();
        
        if (typeof Utils !== 'undefined' && Utils.showNotification) {
            Utils.showNotification('Cookies aceitos com sucesso!', 'success');
        }
    }
    
    static rejectAllCookies() {
        // Aceitar apenas cookies necessários
        localStorage.setItem('cookiePreferences', JSON.stringify({
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        }));
        
        this.closeCookieModal();
        this.hideCookieBanner();
        
        if (typeof Utils !== 'undefined' && Utils.showNotification) {
            Utils.showNotification('Preferências de cookies salvas!', 'info');
        }
    }
    
    static saveCookiePreferences() {
        const analytics = document.getElementById('check-stats')?.checked || false;
        const marketing = document.getElementById('check-mkt')?.checked || false;
        
        localStorage.setItem('cookiePreferences', JSON.stringify({
            necessary: true,
            analytics: analytics,
            marketing: marketing,
            timestamp: new Date().toISOString()
        }));
        
        this.closeCookieModal();
        this.hideCookieBanner();
        
        if (typeof Utils !== 'undefined' && Utils.showNotification) {
            Utils.showNotification('Preferências de cookies salvas!', 'success');
        }
    }
    
    static hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            console.log('📋 Ocultando banner de cookies');
            banner.style.transform = 'translateY(100%)';
            banner.setAttribute('data-hidden', 'true');
            console.log('✅ Banner ocultado com sucesso');
        } else {
            console.log('❌ Banner de cookies não encontrado');
        }
    }
    
    static showCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            console.log('📋 Exibindo banner de cookies');
            banner.style.transform = 'translateY(0)';
            banner.setAttribute('data-hidden', 'false');
            console.log('✅ Banner exibido com sucesso');
        } else {
            console.log('❌ Banner de cookies não encontrado');
        }
    }
    
    static checkCookieConsent() {
        const preferences = localStorage.getItem('cookiePreferences');
        return preferences ? JSON.parse(preferences) : null;
    }
    
    // Função de debug para forçar exibição
    static debugForceShowElements() {
        console.log('🔍 Debug: Forçando exibição de elementos de cookies');
        
        const fab = document.getElementById('cookie-fab');
        const banner = document.getElementById('cookie-banner');
        
        if (fab) {
            console.log('👁️ FAB encontrado, forçando exibição...');
            fab.classList.remove('opacity-0', 'pointer-events-none');
            fab.classList.add('opacity-100');
        } else {
            console.log('❌ FAB não encontrado');
        }
        
        if (banner) {
            console.log('📋 Banner encontrado, forçando exibição...');
            this.showCookieBanner();
        } else {
            console.log('❌ Banner não encontrado');
        }
    }
    
    // Função específica para debug do banner
    static debugBannerStatus() {
        const banner = document.getElementById('cookie-banner');
        const preferences = this.checkCookieConsent();
        
        console.log('🔍 Status do Banner de Cookies:');
        console.log('- Elemento banner:', banner ? '✅ Encontrado' : '❌ Não encontrado');
        console.log('- Transform:', banner?.style.transform || 'Não definido');
        console.log('- Data-hidden:', banner?.getAttribute('data-hidden') || 'Não definido');
        console.log('- Preferências salvas:', preferences ? '✅ Sim' : '❌ Não');
        
        return {
            bannerExists: !!banner,
            bannerTransform: banner?.style.transform,
            bannerHidden: banner?.getAttribute('data-hidden') === 'true',
            preferencesExist: !!preferences
        };
    }
}

// Inicializar controle de cookies quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        CookieModal.init();
    });
} else {
    CookieModal.init();
}

// ===== SISTEMA DE TEMA CLARO/ESCURO =====
class ThemeManager {
    static init() {
        this.setupThemeToggle();
        this.loadSavedTheme();
    }
    
    static setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
    
    static toggleTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            this.setLightTheme();
        } else {
            this.setDarkTheme();
        }
        
        // Disparar evento personalizado para outros sistemas
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { isDark: !isDark }
        }));
    }
    
    static setDarkTheme() {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        
        // Forçar aplicação do modo escuro em elementos específicos
        this.forceDarkModeOnElements();
        
        localStorage.setItem('theme', 'dark');
        console.log('🌙 Tema escuro ativado');
    }
    
    static setLightTheme() {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        
        // Remover classes forçadas de modo escuro
        this.forceLightModeOnElements();
        
        localStorage.setItem('theme', 'light');
        console.log('☀️ Tema claro ativado');
    }
    
    static forceDarkModeOnElements() {
        // Forçar modo escuro em elementos específicos que podem não estar respondendo
        const footer = document.getElementById('footer');
        const backToTop = document.getElementById('backToTop');
        const cookieFAB = document.getElementById('cookie-fab');
        const cookieBanner = document.getElementById('cookie-banner');
        
        if (footer) {
            footer.classList.add('dark:bg-gray-900');
        }
        
        if (backToTop) {
            backToTop.classList.add('dark:bg-yellow-500', 'dark:text-gray-900');
        }
        
        if (cookieFAB) {
            cookieFAB.classList.add('dark:bg-blue-600');
        }
        
        if (cookieBanner) {
            cookieBanner.classList.add('dark:bg-gray-800', 'dark:border-gray-700');
        }
    }
    
    static forceLightModeOnElements() {
        // Remover classes forçadas de modo escuro
        const footer = document.getElementById('footer');
        const backToTop = document.getElementById('backToTop');
        const cookieFAB = document.getElementById('cookie-fab');
        const cookieBanner = document.getElementById('cookie-banner');
        
        if (footer) {
            footer.classList.remove('dark:bg-gray-900');
        }
        
        if (backToTop) {
            backToTop.classList.remove('dark:bg-yellow-500', 'dark:text-gray-900');
        }
        
        if (cookieFAB) {
            cookieFAB.classList.remove('dark:bg-blue-600');
        }
        
        if (cookieBanner) {
            cookieBanner.classList.remove('dark:bg-gray-800', 'dark:border-gray-700');
        }
    }
    
    static loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.setDarkTheme();
        } else {
            this.setLightTheme();
        }
    }
}

// ===== CONTROLE DE TAMANHO DE FONTE =====
class FontSizeManager {
    static init() {
        this.fontSize = parseInt(localStorage.getItem('fontSize')) || 100;
        this.setupFontControls();
        this.applyFontSize();
    }
    
    static setupFontControls() {
        const increaseBtn = document.getElementById('btn-font-increase');
        const decreaseBtn = document.getElementById('btn-font-decrease');
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => this.increaseFont());
        }
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => this.decreaseFont());
        }
    }
    
    static increaseFont() {
        if (this.fontSize < 150) {
            this.fontSize += 10;
            this.applyFontSize();
        }
    }
    
    static decreaseFont() {
        if (this.fontSize > 80) {
            this.fontSize -= 10;
            this.applyFontSize();
        }
    }
    
    static applyFontSize() {
        document.documentElement.style.fontSize = `${this.fontSize}%`;
        localStorage.setItem('fontSize', this.fontSize.toString());
    }
}

// ===== CONTROLE DE MENU MOBILE =====
class MobileMenuManager {
    static init() {
        this.setupMobileMenu();
        this.setupMegaMenus();
        this.setupDesktopMenus();
    }
    
    static setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            
            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }
    
    static toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            if (mobileMenu.classList.contains('hidden')) {
                this.openMobileMenu();
            } else {
                this.closeMobileMenu();
            }
        }
    }
    
    static openMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('animate-fade-in-down');
        }
    }
    
    static closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('animate-fade-in-down');
        }
    }
    
    // Setup dos accordion menus mobile
    static setupMegaMenus() {
        const accordionTriggers = document.querySelectorAll('.mobile-accordion-trigger');
        accordionTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const target = trigger.getAttribute('data-target');
                const content = document.getElementById(target);
                const icon = trigger.querySelector('.icon-chevron');
                
                if (content && icon) {
                    if (content.classList.contains('hidden')) {
                        content.classList.remove('hidden');
                        icon.style.transform = 'rotate(180deg)';
                    } else {
                        content.classList.add('hidden');
                        icon.style.transform = 'rotate(0deg)';
                    }
                }
            });
        });
    }
    
    // Setup dos mega menus desktop
    static setupDesktopMenus() {
        const menuTriggers = document.querySelectorAll('.menu-trigger');
        const desktopPanels = document.querySelectorAll('.desktop-panel');
        
        menuTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => {
                this.showDesktopMenu(trigger);
            });
            
            trigger.addEventListener('mouseleave', () => {
                this.hideDesktopMenu(trigger);
            });
        });
        
        // Fechar menus ao sair do painel
        desktopPanels.forEach(panel => {
            panel.addEventListener('mouseleave', () => {
                this.hideAllDesktopMenus();
            });
        });
    }
    
    static showDesktopMenu(trigger) {
        const panelId = trigger.id.replace('-trigger', '-panel');
        const panel = document.getElementById(panelId);
        
        if (panel) {
            this.hideAllDesktopMenus();
            panel.classList.remove('hidden');
            
            // Animar ícones
            const icon = trigger.querySelector('i.fa-chevron-down');
            if (icon) {
                icon.style.transform = 'rotate(180deg)';
            }
        }
    }
    
    static hideDesktopMenu(trigger) {
        const panelId = trigger.id.replace('-trigger', '-panel');
        const panel = document.getElementById(panelId);
        
        if (panel) {
            setTimeout(() => {
                if (!panel.matches(':hover')) {
                    panel.classList.add('hidden');
                    
                    const icon = trigger.querySelector('i.fa-chevron-down');
                    if (icon) {
                        icon.style.transform = 'rotate(0deg)';
                    }
                }
            }, 200);
        }
    }
    
    static hideAllDesktopMenus() {
        const panels = document.querySelectorAll('.desktop-panel');
        panels.forEach(panel => {
            panel.classList.add('hidden');
        });
        
        // Resetar ícones
        const icons = document.querySelectorAll('.menu-trigger i.fa-chevron-down');
        icons.forEach(icon => {
            icon.style.transform = 'rotate(0deg)';
        });
    }
}

// ===== SISTEMA DE BUSCA =====
class SearchManager {
    static init() {
        this.setupSearchTriggers();
    }
    
    static setupSearchTriggers() {
        const desktopSearchBtn = document.getElementById('desktop-search-trigger');
        const mobileSearchBtn = document.getElementById('mobile-search-trigger');
        const mobileSearchBar = document.getElementById('mobile-search-bar');
        
        if (desktopSearchBtn) {
            desktopSearchBtn.addEventListener('click', () => {
                this.toggleDesktopSearch();
            });
        }
        
        if (mobileSearchBtn && mobileSearchBar) {
            mobileSearchBtn.addEventListener('click', () => {
                this.toggleMobileSearch();
            });
        }
    }
    
    static toggleDesktopSearch() {
        const searchPanel = document.getElementById('desktop-search-panel');
        if (searchPanel) {
            if (searchPanel.classList.contains('hidden')) {
                searchPanel.classList.remove('hidden');
            } else {
                searchPanel.classList.add('hidden');
            }
        }
    }
    
    static toggleMobileSearch() {
        const searchBar = document.getElementById('mobile-search-bar');
        if (searchBar) {
            if (searchBar.classList.contains('hidden')) {
                searchBar.classList.remove('hidden');
                searchBar.classList.add('search-slide-enter');
            } else {
                searchBar.classList.add('hidden');
                searchBar.classList.remove('search-slide-enter');
            }
        }
    }
}

// ===== SISTEMA DE IDIOMAS =====
class LanguageManager {
    static init() {
        this.setupLanguageSelectors();
        this.loadSavedLanguage();
    }
    
    static setupLanguageSelectors() {
        const desktopLangBtn = document.getElementById('desktop-lang-trigger');
        const langOptions = document.querySelectorAll('[data-lang-select]');
        const mobileLangBtns = document.querySelectorAll('[data-lang]');
        
        if (desktopLangBtn) {
            desktopLangBtn.addEventListener('click', () => {
                this.toggleLanguagePanel();
            });
        }
        
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const lang = e.currentTarget.getAttribute('data-lang-select');
                this.setLanguage(lang);
            });
        });
        
        mobileLangBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    }
    
    static toggleLanguagePanel() {
        const langPanel = document.getElementById('desktop-lang-panel');
        if (langPanel) {
            if (langPanel.classList.contains('hidden')) {
                langPanel.classList.remove('hidden');
            } else {
                langPanel.classList.add('hidden');
            }
        }
    }
    
    static setLanguage(lang) {
        localStorage.setItem('language', lang);
        this.updateLanguageUI(lang);
        this.hideAllPanels();
    }
    
    static updateLanguageUI(lang) {
        const flags = {
            'pt': '🇧🇷',
            'en': '🇺🇸', 
            'es': '🇪🇸'
        };
        
        const currentLangFlag = document.getElementById('current-lang-flag');
        if (currentLangFlag && flags[lang]) {
            currentLangFlag.textContent = flags[lang];
        }
        
        // Atualizar botões mobile
        const mobileBtns = document.querySelectorAll('[data-lang]');
        mobileBtns.forEach(btn => {
            btn.classList.remove('ring-2', 'ring-audit-gold');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('ring-2', 'ring-audit-gold');
            } else {
                btn.classList.add('grayscale', 'opacity-50');
            }
        });
    }
    
    static loadSavedLanguage() {
        const savedLang = localStorage.getItem('language') || 'pt';
        this.updateLanguageUI(savedLang);
    }
    
    static hideAllPanels() {
        const panels = document.querySelectorAll('.desktop-panel');
        panels.forEach(panel => {
            panel.classList.add('hidden');
        });
    }
}

// ===== BOTÕES FLUTUANTES =====
class FloatingButtonsManager {
    static init() {
        this.setupBackToTop();
        this.setupCookieFAB();
        this.setupHeaderScroll();
    }
    
    static setupBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        
        if (backToTopBtn) {
            // Mostrar/ocultar baseado no scroll
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                    backToTopBtn.classList.add('opacity-100');
                } else {
                    backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
                    backToTopBtn.classList.remove('opacity-100');
                }
            });
            
            // Funcionalidade de voltar ao topo
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    static setupHeaderScroll() {
        const header = document.getElementById('header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 50) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }
            });
        }
    }
    
    static setupCookieFAB() {
        const cookieFAB = document.getElementById('cookie-fab');
        const cookieBanner = document.getElementById('cookie-banner');
        
        // FAB SEMPRE aparece (mesmo com preferências salvas) para permitir alteração
        if (cookieFAB) {
            console.log('🍪 FAB sempre será exibido para permitir alteração de preferências');
            setTimeout(() => {
                cookieFAB.classList.remove('opacity-0', 'pointer-events-none');
                cookieFAB.classList.add('opacity-100');
                console.log('✅ FAB exibido com sucesso');
            }, 2000);
        } else {
            console.log('⚠️ FAB de cookies será criado dinamicamente se necessário');
        }
        
        // Banner só aparece se não houver preferências salvas
        if (cookieBanner) {
            const preferences = CookieModal.checkCookieConsent();
            if (!preferences) {
                console.log('📋 Banner será exibido (sem preferências salvas)');
                setTimeout(() => {
                    CookieModal.showCookieBanner();
                }, 1000);
            } else {
                console.log('🍪 Banner ocultado (preferências já salvas)');
                CookieModal.hideCookieBanner();
            }
        } else {
            console.log('⚠️ Banner de cookies será criado dinamicamente se necessário');
        }
    }
}

// ===== INICIALIZAÇÃO COMPLETA =====
class SiteController {
    static init() {
        console.log('🚀 Inicializando sistema completo...');
        
        // Aguardar componentes carregarem
        setTimeout(() => {
            try {
                ThemeManager.init();
                FontSizeManager.init();
                MobileMenuManager.init();
                SearchManager.init();
                LanguageManager.init();
                FloatingButtonsManager.init();
                CookieModal.init();
                
                // Usar sistema de fallback integrado para header
                window.HeaderFallbackSystem.init();
                
                console.log('✅ Sistema completo inicializado');
            } catch (error) {
                console.error('❌ Erro na inicialização:', error);
            }
        }, 1000);
    }
    
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        SiteController.init();
    });
} else {
    SiteController.init();
}

// Export global
window.Utils = Utils;
window.CookieModal = CookieModal;
window.ThemeManager = ThemeManager;
window.FontSizeManager = FontSizeManager;
window.MobileMenuManager = MobileMenuManager;
window.SearchManager = SearchManager;
window.LanguageManager = LanguageManager;
window.FloatingButtonsManager = FloatingButtonsManager;
window.SiteController = SiteController;

// Função de debug global
window.debugCookies = function() {
    console.log('🔍 Debug completo dos cookies:');
    console.log('- FAB elemento:', document.getElementById('cookie-fab'));
    console.log('- Banner elemento:', document.getElementById('cookie-banner'));
    console.log('- Preferências salvas:', localStorage.getItem('cookiePreferences'));
    console.log('- FAB classes:', document.getElementById('cookie-fab')?.classList.toString());
    console.log('- Banner transform:', document.getElementById('cookie-banner')?.style.transform);
    
    if (window.CookieModal) {
        window.CookieModal.debugForceShowElements();
        window.CookieModal.debugBannerStatus();
    }
};

// Função específica para debug do banner
window.debugBanner = function() {
    console.log('🔍 Debug específico do Banner:');
    if (window.CookieModal) {
        window.CookieModal.debugBannerStatus();
    }
};

// Função de reset rápido para testes
window.resetCookieTest = function() {
    localStorage.removeItem('cookiePreferences');
    console.log('🧹 Preferências de cookies removidas para teste');
    console.log('🔄 Recarregue a página para testar o banner');
};

// ===== GESTOR DO HEADER ATUALIZADO =====
class HeaderManager {
    static init() {
        console.log('🔧 HeaderManager: Iniciando...');
        
        // Verificar se os elementos existem
        const triggers = document.querySelectorAll('.nav-trigger');
        const panels = document.querySelectorAll('.mega-panel');
        const header = document.querySelector('#header');
        const tabTriggers = document.querySelectorAll('.menu-tab-trigger');
        
        console.log(`📊 HeaderManager: Elementos encontrados - Triggers: ${triggers.length}, Panels: ${panels.length}, Header: ${header ? 'Sim' : 'Não'}, Tabs: ${tabTriggers.length}`);
        
        // Aguardar elementos carregarem se necessário
        if (triggers.length === 0 || panels.length === 0 || !header) {
            console.warn('⚠️ HeaderManager: Elementos não encontrados, tentando novamente em 500ms...');
            setTimeout(() => this.init(), 500);
            return;
        }
        
        let activePanel = null;

        // --- Lógica Mega Menu Desktop ---
        function closeAllPanels() {
            panels.forEach(panel => {
                panel.classList.remove('active');
                // Resetar aria-expanded nos triggers que controlam este painel
                const id = panel.id;
                const trigger = document.querySelector(`.nav-trigger[data-panel="${id}"]`);
                if(trigger) trigger.setAttribute('aria-expanded', 'false');
            });
            activePanel = null;
        }

        triggers.forEach(trigger => {
            // Suporte a clique e tecla Enter/Espaço para acessibilidade
            const toggleMenu = (e) => {
                e.stopPropagation();
                // Se for teclado, previne scroll
                if(e.type === 'keydown') e.preventDefault();

                const targetId = trigger.getAttribute('data-panel');
                const targetPanel = document.getElementById(targetId);

                if (activePanel === targetPanel) {
                    closeAllPanels();
                } else {
                    closeAllPanels();
                    if (targetPanel) {
                        targetPanel.classList.add('active');
                        trigger.setAttribute('aria-expanded', 'true');
                        activePanel = targetPanel;
                        // Focar no primeiro elemento interativo dentro do painel (opcional, mas bom para UX)
                        const firstFocusable = targetPanel.querySelector('input, a, button, [tabindex="0"]');
                        if(firstFocusable) firstFocusable.focus();
                    }
                }
            };

            trigger.addEventListener('click', toggleMenu);
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') toggleMenu(e);
            });
        });

        document.addEventListener('click', (e) => {
            if (!header.contains(e.target)) {
                closeAllPanels();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllPanels();
                closeMobileMenu();
            }
        });

        // Lógica de Tabs internas (Sobre Nós, etc.)
        tabTriggers.forEach(tab => {
            const activateTab = () => {
                // Remove ativo dos irmãos
                const parent = tab.closest('ul');
                parent.querySelectorAll('.menu-tab-trigger').forEach(t => {
                     t.classList.remove('active');
                     t.setAttribute('aria-selected', 'false');
                });
                
                // Ativa atual
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');

                // Gerencia conteúdo
                const panel = tab.closest('.mega-panel');
                const allContents = panel.querySelectorAll('.tab-content');
                allContents.forEach(c => c.classList.remove('active'));

                const targetContentId = tab.getAttribute('data-target');
                const targetContent = document.getElementById(targetContentId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            };

            tab.addEventListener('mouseenter', activateTab);
            tab.addEventListener('focus', activateTab); // Acessibilidade via teclado (Tab navega e ativa)
        });

        // --- Lógica Menu Mobile ---
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileTrigger = document.getElementById('mobile-menu-trigger');
        const mobileClose = document.getElementById('close-mobile-menu');
        const mobileBackdrop = document.getElementById('mobile-menu-backdrop');
        const mobileDrawer = document.getElementById('mobile-menu-drawer');
        const mobileAccordions = document.querySelectorAll('.mobile-accordion-trigger');
        
        console.log(`📱 HeaderManager: Mobile - Menu: ${mobileMenu ? 'Sim' : 'Não'}, Trigger: ${mobileTrigger ? 'Sim' : 'Não'}, Accordions: ${mobileAccordions.length}`);

        function openMobileMenu() {
            mobileMenu.classList.remove('hidden');
            mobileTrigger.setAttribute('aria-expanded', 'true');
            // Adiciona o foco visualmente
            document.body.style.overflow = 'hidden'; 
            setTimeout(() => {
                mobileBackdrop.classList.remove('opacity-0');
                mobileDrawer.classList.remove('-translate-x-full');
                // Focar no botão de fechar ao abrir
                mobileClose.focus();
            }, 10);
        }

        function closeMobileMenu() {
            mobileBackdrop.classList.add('opacity-0');
            mobileDrawer.classList.add('-translate-x-full');
            mobileTrigger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileTrigger.focus(); // Retornar foco ao trigger
            }, 300);
        }

        if (mobileTrigger) mobileTrigger.addEventListener('click', openMobileMenu);
        if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
        if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

        mobileAccordions.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const content = trigger.nextElementSibling;
                const icon = trigger.querySelector('.fa-chevron-down');
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

                // Fecha outros submenus no mobile (comportamento de acordeão)
                if (!isExpanded) {
                    mobileAccordions.forEach(otherTrigger => {
                        if (otherTrigger !== trigger) {
                            otherTrigger.setAttribute('aria-expanded', 'false');
                            otherTrigger.nextElementSibling.classList.remove('open');
                            otherTrigger.querySelector('.fa-chevron-down').style.transform = 'rotate(0deg)';
                        }
                    });
                }

                // Toggle
                content.classList.toggle('open');
                trigger.setAttribute('aria-expanded', !isExpanded);
                
                if (content.classList.contains('open')) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });

        // --- Controles de Fonte ---
        const fontDecreaseBtn = document.querySelector('button[aria-label="Diminuir tamanho da fonte"]');
        const fontIncreaseBtn = document.querySelector('button[aria-label="Aumentar tamanho da fonte"]');
        
        console.log(`🔤 HeaderManager: Font controls - Decrease: ${fontDecreaseBtn ? 'Sim' : 'Não'}, Increase: ${fontIncreaseBtn ? 'Sim' : 'Não'}`);
        
        if (fontDecreaseBtn) {
            fontDecreaseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔤 Diminuir fonte');
                // Implementar lógica de decrease font
                const currentSize = parseInt(getComputedStyle(document.documentElement).fontSize) || 16;
                const newSize = Math.max(12, currentSize - 2);
                document.documentElement.style.fontSize = newSize + 'px';
            });
        }
        
        if (fontIncreaseBtn) {
            fontIncreaseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔤 Aumentar fonte');
                // Implementar lógica de increase font
                const currentSize = parseInt(getComputedStyle(document.documentElement).fontSize) || 16;
                const newSize = Math.min(24, currentSize + 2);
                document.documentElement.style.fontSize = newSize + 'px';
            });
        }

        const themeBtn = document.getElementById('theme-toggle');
        console.log(`🌙 HeaderManager: Theme toggle: ${themeBtn ? 'Sim' : 'Não'}`);
        
        if(themeBtn) {
            themeBtn.addEventListener('click', () => {
                console.log('🌙 Toggle theme');
                document.documentElement.classList.toggle('dark');
            });
        }
        
        console.log('✅ HeaderManager: Inicialização completa');
    }
}

// Exportar HeaderManager imediatamente para evitar problemas de hoisting
window.HeaderManager = HeaderManager;

// ===== SISTEMA DE FALLBACK INTEGRADO =====
// Função de fallback robusta para garantir funcionamento em produção
window.HeaderFallbackSystem = {
    maxRetries: 10,
    retryInterval: 1000,
    initAttempts: 0,
    isInitialized: false,
    
    init() {
        this.initAttempts++;
        console.log(`🔄 Tentativa ${this.initAttempts}/${this.maxRetries} de inicializar header...`);
        
        try {
            // Verificar se HeaderManager existe e funciona
            if (window.HeaderManager && typeof window.HeaderManager.init === 'function') {
                console.log('🎯 Tentando usar HeaderManager...');
                window.HeaderManager.init();
                this.isInitialized = true;
                console.log('✅ Header inicializado via HeaderManager');
                return;
            } else {
                console.log('⚠️ HeaderManager não encontrado ou não funcional, usando fallback manual');
            }
            
            // Fallback: inicialização manual
            this.initManualFallback();
            
        } catch (error) {
            console.error(`❌ Erro na tentativa ${this.initAttempts}:`, error);
            
            if (this.initAttempts < this.maxRetries) {
                setTimeout(() => this.init(), this.retryInterval);
            } else {
                console.error('❌ Falha ao inicializar header após todas as tentativas');
                this.initEmergencyFallback();
            }
        }
    },
    
    initManualFallback() {
        console.log('🔧 Usando inicialização manual...');
        
        // Verificar elementos
        const header = document.querySelector('#header');
        const triggers = document.querySelectorAll('.nav-trigger');
        const panels = document.querySelectorAll('.mega-panel');
        
        if (!header || triggers.length === 0 || panels.length === 0) {
            console.warn('⚠️ Elementos ainda não encontrados');
            if (this.initAttempts < this.maxRetries) {
                setTimeout(() => this.init(), this.retryInterval);
            }
            return;
        }
        
        // Inicialização manual completa
        this.initMegaMenusManual();
        this.initFontControlsManual();
        this.initThemeToggleManual();
        this.initMobileMenuManual();
        
        this.isInitialized = true;
        console.log('✅ Header inicializado via fallback manual');
    },
    
    initEmergencyFallback() {
        console.log('🚨 Inicialização de emergência...');
        
        // Lista mínima de funcionalidades críticas
        const criticalElements = {
            header: document.querySelector('#header'),
            sobreTrigger: document.querySelector('[data-panel="panel-sobre"]'),
            conteudoTrigger: document.querySelector('[data-panel="panel-conteudo"]'),
            fontIncrease: document.querySelector('button[aria-label="Aumentar tamanho da fonte"]'),
            fontDecrease: document.querySelector('button[aria-label="Diminuir tamanho da fonte"]'),
            themeToggle: document.querySelector('#theme-toggle')
        };
        
        Object.entries(criticalElements).forEach(([name, element]) => {
            if (element) {
                console.log(`✅ Elemento crítico encontrado: ${name}`);
            } else {
                console.warn(`⚠️ Elemento crítico ausente: ${name}`);
            }
        });
        
        // Tentar inicializar pelo menos o essencial
        this.initBasicFunctionality();
    },
    
    initMegaMenusManual() {
        const triggers = document.querySelectorAll('.nav-trigger');
        const panels = document.querySelectorAll('.mega-panel');
        const header = document.querySelector('#header');
        let activePanel = null;
        
        console.log(`🎯 Inicializando mega menus manualmente - Triggers: ${triggers.length}`);
        
        function closeAllPanels() {
            panels.forEach(panel => {
                panel.classList.remove('active');
                const id = panel.id;
                const trigger = document.querySelector(`.nav-trigger[data-panel="${id}"]`);
                if(trigger) trigger.setAttribute('aria-expanded', 'false');
            });
            activePanel = null;
        }
        
        triggers.forEach(trigger => {
            const toggleMenu = (e) => {
                e.stopPropagation();
                if(e.type === 'keydown') e.preventDefault();
                
                const targetId = trigger.getAttribute('data-panel');
                const targetPanel = document.getElementById(targetId);
                
                if (activePanel === targetPanel) {
                    closeAllPanels();
                } else {
                    closeAllPanels();
                    if (targetPanel) {
                        targetPanel.classList.add('active');
                        trigger.setAttribute('aria-expanded', 'true');
                        activePanel = targetPanel;
                        console.log(`📥 Painel aberto: ${targetId}`);
                    }
                }
            };
            
            trigger.addEventListener('click', toggleMenu);
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') toggleMenu(e);
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target)) {
                closeAllPanels();
            }
        });
        
        console.log('✅ Mega menus inicializados manualmente');
    },
    
    initFontControlsManual() {
        const fontDecreaseBtn = document.querySelector('button[aria-label="Diminuir tamanho da fonte"]');
        const fontIncreaseBtn = document.querySelector('button[aria-label="Aumentar tamanho da fonte"]');
        
        console.log(`🔤 Inicializando controles de fonte manualmente`);
        
        if (fontDecreaseBtn) {
            fontDecreaseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔤 Diminuir fonte');
                const currentSize = parseInt(getComputedStyle(document.documentElement).fontSize) || 16;
                const newSize = Math.max(12, currentSize - 2);
                document.documentElement.style.fontSize = newSize + 'px';
                console.log(`📏 Novo tamanho: ${newSize}px`);
            });
        }
        
        if (fontIncreaseBtn) {
            fontIncreaseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔤 Aumentar fonte');
                const currentSize = parseInt(getComputedStyle(document.documentElement).fontSize) || 16;
                const newSize = Math.min(24, currentSize + 2);
                document.documentElement.style.fontSize = newSize + 'px';
                console.log(`📏 Novo tamanho: ${newSize}px`);
            });
        }
        
        console.log('✅ Controles de fonte inicializados manualmente');
    },
    
    initThemeToggleManual() {
        const themeBtn = document.querySelector('#theme-toggle');
        
        console.log(`🌙 Inicializando theme toggle manualmente`);
        
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                console.log('🌙 Toggle theme');
                document.documentElement.classList.toggle('dark');
                const isDark = document.documentElement.classList.contains('dark');
                console.log(`🌓 Tema: ${isDark ? 'dark' : 'light'}`);
            });
        }
        
        console.log('✅ Theme toggle inicializado manualmente');
    },
    
    initMobileMenuManual() {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileTrigger = document.getElementById('mobile-menu-trigger');
        const mobileClose = document.getElementById('close-mobile-menu');
        const mobileBackdrop = document.getElementById('mobile-menu-backdrop');
        
        console.log(`📱 Inicializando menu mobile manualmente`);
        
        if (mobileTrigger && mobileMenu) {
            const openMobileMenu = () => {
                mobileMenu.classList.remove('hidden');
                mobileTrigger.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden'; 
                setTimeout(() => {
                    if (mobileBackdrop) mobileBackdrop.classList.remove('opacity-0');
                    if (mobileClose) mobileClose.focus();
                }, 10);
                console.log('📱 Menu mobile aberto');
            };
            
            const closeMobileMenu = () => {
                if (mobileBackdrop) mobileBackdrop.classList.add('opacity-0');
                mobileTrigger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                    mobileTrigger.focus();
                }, 300);
                console.log('📱 Menu mobile fechado');
            };
            
            mobileTrigger.addEventListener('click', openMobileMenu);
            if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
            if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);
        }
        
        console.log('✅ Menu mobile inicializado manualmente');
    },
    
    initBasicFunctionality() {
        console.log('🔧 Inicializando funcionalidades básicas...');
        
        // Apenas os controles mais críticos
        const themeBtn = document.querySelector('#theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
            });
        }
        
        const fontIncrease = document.querySelector('button[aria-label="Aumentar tamanho da fonte"]');
        if (fontIncrease) {
            fontIncrease.addEventListener('click', (e) => {
                e.preventDefault();
                const currentSize = parseInt(getComputedStyle(document.documentElement).fontSize) || 16;
                const newSize = Math.min(24, currentSize + 2);
                document.documentElement.style.fontSize = newSize + 'px';
            });
        }
        
        console.log('✅ Funcionalidades básicas inicializadas');
    }
};

// ===== FUNÇÕES GLOBAIS DE DEBUG E CONTROLE =====

// Função para forçar inicialização
window.forceHeaderInit = function() {
    console.log('🔧 Forçando inicialização do header...');
    window.HeaderFallbackSystem.init();
};

// Função de debug detalhado
window.debugHeader = function() {
    console.log('🔍 Debug do Header:');
    console.log('- HeaderManager existe:', !!window.HeaderManager);
    console.log('- Header element:', document.querySelector('#header'));
    console.log('- Triggers:', document.querySelectorAll('.nav-trigger').length);
    console.log('- Panels:', document.querySelectorAll('.mega-panel').length);
    console.log('- Font controls:', {
        decrease: !!document.querySelector('button[aria-label="Diminuir tamanho da fonte"]'),
        increase: !!document.querySelector('button[aria-label="Aumentar tamanho da fonte"]')
    });
    console.log('- Theme toggle:', !!document.querySelector('#theme-toggle'));
    console.log('- Mobile menu:', {
        trigger: !!document.querySelector('#mobile-menu-trigger'),
        menu: !!document.querySelector('#mobile-menu')
    });
    console.log('- Fallback system initialized:', window.HeaderFallbackSystem.isInitialized);
};

// Função para testar todas as funcionalidades
window.testAllHeaderFunctions = function() {
    console.log('🧪 Testando todas as funcionalidades do header...');
    
    // Testar mega menus
    const sobreTrigger = document.querySelector('[data-panel="panel-sobre"]');
    if (sobreTrigger) {
        sobreTrigger.click();
        console.log('✅ Teste mega menu "Sobre Nós" executado');
    }
    
    // Testar controles de fonte
    const fontIncrease = document.querySelector('button[aria-label="Aumentar tamanho da fonte"]');
    if (fontIncrease) {
        const beforeSize = parseInt(getComputedStyle(document.documentElement).fontSize) || 16;
        fontIncrease.click();
        const afterSize = parseInt(getComputedStyle(document.documentElement).fontSize) || 16;
        console.log(`✅ Teste fonte: ${beforeSize}px → ${afterSize}px`);
    }
    
    // Testar theme toggle
    const themeToggle = document.querySelector('#theme-toggle');
    if (themeToggle) {
        const beforeTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        themeToggle.click();
        const afterTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        console.log(`✅ Teste tema: ${beforeTheme} → ${afterTheme}`);
    }
    
    console.log('🧪 Todos os testes executados');
};

// Inicialização automática robusta
window.addEventListener('load', () => {
    console.log('🚀 Sistema robusto de header carregado');
    
    // Aguardar um pouco para garantir que todos os elementos foram carregados
    setTimeout(() => {
        if (!window.HeaderFallbackSystem.isInitialized) {
            console.log('🔄 Iniciando sistema de fallback...');
            window.HeaderFallbackSystem.init();
        }
    }, 1000); // Aumentado para 1000ms para dar mais tempo
});

// Exportar para console
console.log('📦 Sistema integrado de header com fallback carregado');
console.log('💡 Use forceHeaderInit() para forçar inicialização');
console.log('💡 Use debugHeader() para debug detalhado');
console.log('💡 Use testAllHeaderFunctions() para testar todas as funções');
