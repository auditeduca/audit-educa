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
        document.addEventListener('componentsLoaded', () => this.setupSEO());
    }

    setupSEO() {
        this.ensureBasicMetaTags();
        this.setupStructuredData();
    }

    ensureBasicMetaTags() {
        const metaTags = [
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
            { name: 'theme-color', content: '#0f172a' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
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
        this.updateBasicMeta(pageData);
        this.updateOpenGraph(pageData);
        this.updateTwitterCard(pageData);
        this.updateCanonical(pageData);
        this.updateStructuredData(pageData);
    }

    updateBasicMeta(pageData) {
        if (pageData.title) {
            document.title = pageData.title;
        }

        if (pageData.description) {
            this.setMetaTag('description', pageData.description);
        }

        if (pageData.keywords) {
            this.setMetaTag('keywords', pageData.keywords);
        }

        if (pageData.author) {
            this.setMetaTag('author', pageData.author);
        }
    }

    updateOpenGraph(pageData) {
        const ogData = {
            'og:title': pageData.ogTitle || pageData.title,
            'og:description': pageData.ogDescription || pageData.description,
            'og:image': pageData.ogImage || this.baseConfig.defaultImage,
            'og:url': pageData.canonical || this.baseConfig.siteUrl,
            'og:type': pageData.ogType || 'website',
            'og:site_name': this.baseConfig.siteName,
            'og:locale': this.baseConfig.locale
        };

        Object.entries(ogData).forEach(([property, content]) => {
            if (content) {
                this.setOpenGraphTag(property, content);
            }
        });
    }

    updateTwitterCard(pageData) {
        const twitterData = {
            'twitter:card': pageData.twitterCard || 'summary_large_image',
            'twitter:title': pageData.twitterTitle || pageData.title,
            'twitter:description': pageData.twitterDescription || pageData.description,
            'twitter:image': pageData.twitterImage || pageData.ogImage || this.baseConfig.defaultImage,
            'twitter:creator': this.baseConfig.twitterHandle
        };

        Object.entries(twitterData).forEach(([name, content]) => {
            if (content) {
                this.setTwitterTag(name, content);
            }
        });
    }

    updateCanonical(pageData) {
        if (pageData.canonical) {
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
                canonical = document.createElement('link');
                canonical.rel = 'canonical';
                document.head.appendChild(canonical);
            }
            canonical.href = pageData.canonical;
        }
    }

    updateStructuredData(pageData) {
        if (pageData.structuredData) {
            this.addStructuredData(pageData.structuredData);
        } else {
            this.addDefaultStructuredData(pageData);
        }
    }

    addDefaultStructuredData(pageData) {
        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': pageData.title,
            'description': pageData.description,
            'url': pageData.canonical || this.baseConfig.siteUrl,
            'image': pageData.ogImage || this.baseConfig.defaultImage,
            'publisher': {
                '@type': 'Organization',
                'name': this.baseConfig.siteName,
                'url': this.baseConfig.siteUrl,
                'logo': {
                    '@type': 'ImageObject',
                    'url': 'https://www.auditeduca.com.br/assets/images/audit-educa-favicon.webp'
                }
            }
        };

        this.addStructuredData(structuredData);
    }

    addStructuredData(data) {
        let script = document.querySelector('script[type="application/ld+json"]');
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(data);
    }

    setupStructuredData() {
        const organizationData = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': this.baseConfig.siteName,
            'url': this.baseConfig.siteUrl,
            'logo': 'https://www.auditeduca.com.br/assets/images/audit-educa-favicon.webp',
            'description': this.baseConfig.defaultDescription,
            'sameAs': [
                'https://www.linkedin.com/company/audit-educa',
                'https://twitter.com/auditeduca',
                'https://github.com/auditeduca'
            ]
        };

        this.addStructuredData(organizationData);
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

    setOpenGraphTag(property, content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    setTwitterTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    generateSitemap() {
        const pages = ['home', 'about', 'services', 'contact'];
        const sitemap = pages.map(page => ({
            url: `${this.baseConfig.siteUrl}/#${page}`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: page === 'home' ? '1.0' : '0.8'
        }));

        return sitemap;
    }

    generateRobotsTxt() {
        return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: ${this.baseConfig.siteUrl}/sitemap.xml`;
    }
}

const seoManager = new SEOManager();