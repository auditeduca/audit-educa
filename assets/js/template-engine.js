class TemplateEngine {
    constructor() {
        this.components = {};
        this.seoConfig = {};
        this.currentPage = 'home';
        this.init();
    }

    async init() {
        await this.loadComponents();
        this.injectComponents();
        this.setupRouting();
    }

    async loadComponents() {
        try {
            const [header, main, footer] = await Promise.all([
                fetch('components/header.html').then(r => r.text()),
                fetch('components/main.html').then(r => r.text()),
                fetch('components/footer.html').then(r => r.text())
            ]);

            this.components = { header, main, footer };
        } catch (error) {
            console.error('Erro ao carregar componentes:', error);
        }
    }

    injectComponents() {
        const headerContainer = document.getElementById('header-container');
        const mainContainer = document.getElementById('main-container');
        const footerContainer = document.getElementById('footer-container');

        if (headerContainer) headerContainer.innerHTML = this.components.header;
        if (mainContainer) mainContainer.innerHTML = this.components.main;
        if (footerContainer) footerContainer.innerHTML = this.components.footer;

        this.dispatchComponentsLoaded();
    }

    dispatchComponentsLoaded() {
        document.dispatchEvent(new CustomEvent('componentsLoaded', {
            detail: { components: this.components }
        }));
    }

    setupRouting() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        this.loadPage(hash);
    }

    async loadPage(page) {
        this.currentPage = page;
        try {
            const response = await fetch(`pages/${page}.json`);
            const pageData = await response.json();
            this.renderPage(pageData);
            this.updateSEO(pageData);
        } catch (error) {
            console.error(`Erro ao carregar página ${page}:`, error);
        }
    }

    renderPage(pageData) {
        const mainContainer = document.getElementById('content-placeholder');
        if (mainContainer && pageData.html) {
            mainContainer.innerHTML = pageData.html;
        }
    }

    updateSEO(pageData) {
        if (pageData.title) {
            document.title = pageData.title;
        }

        if (pageData.description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = pageData.description;
        }

        if (pageData.canonical) {
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
                canonical = document.createElement('link');
                canonical.rel = 'canonical';
                document.head.appendChild(canonical);
            }
            canonical.href = pageData.canonical;
        }

        if (pageData.ogTitle || pageData.ogDescription || pageData.ogImage) {
            this.updateOpenGraphTags(pageData);
        }

        if (pageData.keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = 'keywords';
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = pageData.keywords;
        }
    }

    updateOpenGraphTags(pageData) {
        const ogTags = [
            { property: 'og:title', content: pageData.ogTitle },
            { property: 'og:description', content: pageData.ogDescription },
            { property: 'og:image', content: pageData.ogImage },
            { property: 'og:url', content: pageData.canonical },
            { property: 'og:type', content: pageData.ogType || 'website' }
        ];

        ogTags.forEach(tag => {
            if (tag.content) {
                let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
                if (!metaTag) {
                    metaTag = document.createElement('meta');
                    metaTag.setAttribute('property', tag.property);
                    document.head.appendChild(metaTag);
                }
                metaTag.content = tag.content;
            }
        });
    }

    async loadPageData(page) {
        try {
            const response = await fetch(`pages/${page}.json`);
            return await response.json();
        } catch (error) {
            console.error(`Erro ao carregar dados da página ${page}:`, error);
            return null;
        }
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

const templateEngine = new TemplateEngine();