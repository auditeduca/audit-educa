class SEOManager {
    constructor() {
        this.baseConfig = {
            siteName: 'Audit Educa',
            siteUrl: 'https://www.auditeduca.com.br',
            defaultImage: 'https://www.auditeduca.com.br/assets/images/og-image.png',
            defaultDescription: 'Acessibilidade em Conhecimento',
            twitterHandle: '@auditeduca',
            locale: 'pt_BR'
        };
        this.init();
    }

    init() {
        // Aguarda o template engine carregar para garantir que o HEAD esteja pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupSEO());
        } else {
            this.setupSEO();
        }
    }

    setupSEO() {
        this.ensureBasicMetaTags();
        // this.setupStructuredData(); // Opcional: ativar se tiver dados estruturados
    }

    ensureBasicMetaTags() {
        const metaTags = [
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
            { name: 'theme-color', content: '#0f172a' },
            // CORREÇÃO: Substituído 'apple-mobile-web-app-capable' por 'mobile-web-app-capable'
            { name: 'mobile-web-app-capable', content: 'yes' }, 
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
        ];

        metaTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    updatePageSEO(pageData) {
        if (!pageData) return;

        if (pageData.title) document.title = pageData.title;
        if (pageData.description) this.setMetaTag('description', pageData.description);
        if (pageData.keywords) this.setMetaTag('keywords', pageData.keywords);
        if (pageData.canonical) this.updateCanonical(pageData.canonical);
        
        // Atualiza OpenGraph se disponível
        if (pageData.ogTitle || pageData.title) {
            this.updateOpenGraph(pageData);
        }
    }

    setMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    updateCanonical(url) {
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.rel = 'canonical';
            document.head.appendChild(link);
        }
        link.href = url;
    }

    updateOpenGraph(pageData) {
        const ogMap = {
            'og:title': pageData.ogTitle || pageData.title,
            'og:description': pageData.ogDescription || pageData.description,
            'og:image': pageData.ogImage || this.baseConfig.defaultImage,
            'og:url': pageData.canonical || window.location.href,
            'og:type': pageData.ogType || 'website'
        };

        for (const [property, content] of Object.entries(ogMap)) {
            if (content) {
                let meta = document.querySelector(`meta[property="${property}"]`);
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.setAttribute('property', property);
                    document.head.appendChild(meta);
                }
                meta.content = content;
            }
        }
    }
}

// Instancia globalmente para ser acessado pelo Template Engine
window.seoManager = new SEOManager();
