class HeaderManager {
    constructor() {
        this.currentFontSize = 100; // Porcentagem (100%)
        // Tenta iniciar imediatamente ou aguarda
        this.attemptInitialization();
    }

    attemptInitialization() {
        // Se o template engine já terminou, inicia direto
        if (window.__COMPONENTS_LOADED__) {
            this.init();
        } else {
            // Se não, ouve o evento E define um timeout de segurança
            document.addEventListener('componentsLoaded', () => this.init());
            // Fallback: Verifica a cada 500ms se o header apareceu (caso o evento tenha se perdido)
            const checkInterval = setInterval(() => {
                if (document.getElementById('header')) {
                    clearInterval(checkInterval);
                    if (!this.initialized) this.init();
                }
            }, 500);
        }
    }

    init() {
        if (this.initialized) return; // Evita rodar duas vezes
        
        console.log('HeaderManager: Inicializando controles...');
        
        // Garante que o HTML existe antes de buscar IDs
        const header = document.getElementById('header');
        if (!header) {
            console.warn('HeaderManager: HTML do header não encontrado. Tentando novamente em breve...');
            setTimeout(() => this.init(), 500);
            return;
        }

        this.attachEventListeners();
        this.loadThemePreference();
        this.initialized = true;
    }

    attachEventListeners() {
        console.log('HeaderManager: Anexando eventos de clique...');

        // --- 1. Acessibilidade: Fontes ---
        this.safeAddListener('btn-font-decrease', () => this.adjustFontSize(-10));
        this.safeAddListener('btn-font-increase', () => this.adjustFontSize(10));

        // --- 2. Acessibilidade: Tema ---
        this.safeAddListener('theme-toggle', () => this.toggleTheme());

        // --- 3. Painéis Desktop (Busca, Idioma, Menus) ---
        // Mapeamento: ID do Botão -> ID do Painel
        const panelMap = {
            'desktop-search-trigger': 'desktop-search-panel',
            'desktop-lang-trigger': 'desktop-lang-panel',
            'desktop-sobre-trigger': 'desktop-sobre-panel',
            'desktop-conteudo-trigger': 'desktop-conteudo-panel',
            'desktop-ferramentas-trigger': 'desktop-ferramentas-panel',
            'desktop-carreiras-trigger': 'desktop-carreiras-panel'
        };

        Object.entries(panelMap).forEach(([btnId, panelId]) => {
            this.safeAddListener(btnId, (e) => {
                e.stopPropagation(); // Impede que o clique feche o menu imediatamente
                this.toggleDesktopPanel(panelId);
                this.rotateIcon(btnId);
            });
        });

        // --- 4. Menu Mobile ---
        this.safeAddListener('mobile-menu-btn', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
        
        this.safeAddListener('mobile-search-trigger', () => {
            const bar = document.getElementById('mobile-search-bar');
            bar.classList.toggle('hidden'); // Tailwind hidden
            if (!bar.classList.contains('hidden')) {
                bar.style.maxHeight = '80px'; 
                bar.querySelector('input').focus();
            } else {
                bar.style.maxHeight = '0';
            }
        });

        // --- 5. Fechar ao clicar fora ---
        document.addEventListener('click', (e) => {
            if (!e.target.closest('header')) {
                this.closeAllPanels();
            }
        });

        // --- 6. Mega Menu Hover (Troca de conteúdo interno) ---
        const menuItems = document.querySelectorAll('.menu-item-primary');
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const area = item.getAttribute('data-area');
                // Encontra o painel pai deste item
                const parentPanel = item.closest('[id$="-panel"]');
                if (parentPanel && area) {
                    // Esconde todos os detalhes deste painel
                    parentPanel.querySelectorAll('.detail-content').forEach(el => el.classList.add('hidden'));
                    // Mostra o detalhe específico (ex: id="about-criador")
                    // Procura em prefixos comuns: about-, content-, tool-, career-
                    const possibleIds = [`about-${area}`, `content-${area}`, `tool-${area}`, `career-${area}`];
                    possibleIds.forEach(id => {
                        const target = document.getElementById(id);
                        if (target) target.classList.remove('hidden');
                    });
                }
            });
        });
    }

    // Função utilitária para evitar erro se o botão não existir
    safeAddListener(id, callback) {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', callback);
        } else {
            console.warn(`HeaderManager: Botão '${id}' não encontrado no HTML.`);
        }
    }

    adjustFontSize(amount) {
        this.currentFontSize += amount;
        // Limites: min 80%, max 130%
        if (this.currentFontSize < 80) this.currentFontSize = 80;
        if (this.currentFontSize > 130) this.currentFontSize = 130;
        
        document.documentElement.style.fontSize = `${this.currentFontSize}%`;
        console.log(`Fonte ajustada para ${this.currentFontSize}%`);
    }

    toggleTheme() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    loadThemePreference() {
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
        }
    }

    toggleDesktopPanel(targetId) {
        const allPanels = document.querySelectorAll('[id$="-panel"]');
        
        allPanels.forEach(panel => {
            if (panel.id === targetId) {
                panel.classList.toggle('hidden');
            } else {
                panel.classList.add('hidden');
            }
        });
    }

    closeAllPanels() {
        const allPanels = document.querySelectorAll('[id$="-panel"]');
        allPanels.forEach(panel => panel.classList.add('hidden'));
        
        // Remove rotação dos ícones
        document.querySelectorAll('.fa-chevron-down').forEach(icon => {
            icon.style.transform = 'rotate(0deg)';
        });
    }

    rotateIcon(btnId) {
        // Reseta todos
        document.querySelectorAll('.fa-chevron-down').forEach(icon => icon.style.transform = 'rotate(0deg)');
        
        // Roda o atual se o painel estiver abrindo
        const btn = document.getElementById(btnId);
        const panelId = btnId.replace('trigger', 'panel'); // ex: desktop-search-trigger -> desktop-search-panel
        const panel = document.getElementById(panelId);
        
        if (btn && panel && !panel.classList.contains('hidden')) {
            const icon = btn.querySelector('.fa-chevron-down');
            if (icon) icon.style.transform = 'rotate(180deg)';
        }
    }
}

const headerManager = new HeaderManager();
