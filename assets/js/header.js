/**
 * HeaderManager
 * Gerencia a lógica de UI do cabeçalho, incluindo Dark Mode e Seletor de Idiomas.
 */
const HeaderManager = (function() {
    console.log('HeaderManager: Script carregado.');

    const ELEMENTS = {
        html: document.documentElement,
        darkModeToggle: null,
        languageSwitcher: null,
        languageButton: null,
        languageMenu: null,
        currentFlag: null,
        currentLangSpan: null,
        langOptions: null,
    };

    const LANGUAGES = {
        'pt-BR': { flag: 'https://auditeduca.com.br/assets/flags/bandeira-brasil.webp', name: 'PT-BR' },
        'en': { flag: 'https://auditeduca.com.br/assets/flags/flag-usa.webp', name: 'EN' },
        'es': { flag: 'https://auditeduca.com.br/assets/flags/bandera-espana.webp', name: 'ES' }
    };

    /**
     * Aplica o tema Dark/Light ao HTML e salva a preferência.
     * @param {boolean} isDark 
     */
    function applyDarkMode(isDark) {
        if (isDark) {
            ELEMENTS.html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            ELEMENTS.html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }

    /**
     * Inicializa a funcionalidade Dark Mode.
     */
    function initDarkMode() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            applyDarkMode(true);
        } else {
            applyDarkMode(false);
        }

        ELEMENTS.darkModeToggle.addEventListener('click', () => {
            const isDark = ELEMENTS.html.classList.contains('dark');
            applyDarkMode(!isDark);
        });
    }

    /**
     * Alterna a visibilidade do menu de idiomas.
     */
    function toggleLanguageMenu() {
        ELEMENTS.languageMenu.classList.toggle('active');
    }

    /**
     * Fecha o menu de idiomas se o clique for fora dele.
     * @param {Event} event 
     */
    function closeLanguageMenuOnClickOutside(event) {
        if (!ELEMENTS.languageSwitcher.contains(event.target) && ELEMENTS.languageMenu.classList.contains('active')) {
            ELEMENTS.languageMenu.classList.remove('active');
        }
    }

    /**
     * Define o idioma atual no seletor.
     * @param {string} langCode 
     */
    function setCurrentLanguage(langCode) {
        const lang = LANGUAGES[langCode] || LANGUAGES['pt-BR'];
        
        ELEMENTS.currentFlag.src = lang.flag;
        ELEMENTS.currentFlag.alt = lang.name;
        
        if (ELEMENTS.currentLangSpan) {
            ELEMENTS.currentLangSpan.textContent = lang.name;
        }

        // Simula a mudança de idioma global
        localStorage.setItem('currentLang', langCode);
        console.log(`Idioma alterado para: ${langCode}`);

        // O TemplateEngine.js faria o recarregamento do conteúdo da página no idioma selecionado
    }

    /**
     * Manipulador de clique para as opções de idioma.
     * @param {Event} event 
     */
    function handleLanguageChange(event) {
        event.preventDefault();
        const selectedOption = event.target.closest('.lang-option');
        if (selectedOption) {
            const newLang = selectedOption.dataset.lang;
            setCurrentLanguage(newLang);
            toggleLanguageMenu(); // Fecha o menu
        }
    }

    /**
     * Inicializa todos os elementos DOM e anexa eventos.
     */
    function initializeControls() {
        // Mapeia elementos do Header (presumindo que o HTML foi carregado)
        ELEMENTS.darkModeToggle = document.getElementById('dark-mode-toggle');
        ELEMENTS.languageSwitcher = document.getElementById('language-switcher');
        ELEMENTS.languageButton = document.getElementById('language-button');
        ELEMENTS.languageMenu = document.getElementById('language-menu');
        ELEMENTS.currentFlag = document.getElementById('current-flag');
        ELEMENTS.currentLangSpan = ELEMENTS.languageButton ? ELEMENTS.languageButton.querySelector('span') : null;
        ELEMENTS.langOptions = ELEMENTS.languageMenu ? ELEMENTS.languageMenu.querySelectorAll('.lang-option') : [];

        if (ELEMENTS.darkModeToggle) {
            initDarkMode();
        } else {
            console.warn('HeaderManager: Botão Dark Mode não encontrado.');
        }

        if (ELEMENTS.languageSwitcher) {
            // Inicializa idioma padrão (ou o último salvo)
            const savedLang = localStorage.getItem('currentLang') || 'pt-BR';
            setCurrentLanguage(savedLang);

            // Anexa eventos do seletor de idioma
            ELEMENTS.languageButton.addEventListener('click', toggleLanguageMenu);
            ELEMENTS.languageMenu.addEventListener('click', handleLanguageChange);
            document.addEventListener('click', closeLanguageMenuOnClickOutside);
            
            console.log('HeaderManager: Seletor de Idiomas inicializado.');
        } else {
            console.warn('HeaderManager: Seletor de Idiomas não encontrado.');
        }

        console.log('HeaderManager: Inicialização de controles concluída.');
    }

    // Ouve o evento de carregamento para iniciar a lógica
    document.addEventListener('componentsLoaded', initializeControls);

    return {
        // Expor funções públicas se necessário
    };
})();
