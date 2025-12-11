// Footer Module
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.html = document.documentElement;
        this.init();
    }
    init() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        this.loadSavedTheme();
    }
    toggleTheme() {
        this.html.classList.toggle('dark');
        const consent = localStorage.getItem('cookieConsent');
        if (consent) {
            localStorage.setItem('theme', this.html.classList.contains('dark') ? 'dark' : 'light');
        } else {
            sessionStorage.setItem('theme', this.html.classList.contains('dark') ? 'dark' : 'light');
        }
    }
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme') || sessionStorage.getItem('theme');
        if (savedTheme === 'dark') this.html.classList.add('dark');
    }
}
const themeManager = new ThemeManager();
