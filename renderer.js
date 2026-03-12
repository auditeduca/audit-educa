/**
 * Audit Educa — Template Renderer v3.0
 * ─────────────────────────────────────────────────────────────────────────
 * Suporte completo ao design.json v6.0.0:
 *   • Resolvedor W3C de {path.to.token} com detecção de ciclos
 *   • Escala de sizing sem magic numbers (--sz-*)
 *   • Composite tokens no semanticGuide
 *   • Overlays em HEX8 (#RRGGBBAA) — compatíveis com Web, iOS, Android
 *   • Transições compostas via --t-fast / --t-base / --t-image
 *   • Zero valores hardcoded no CSS injetado
 *
 * USO:
 *   const renderer = new AuditEducaRenderer(content, design);
 *   renderer.renderAll('#app');
 *
 * EDIÇÃO RÁPIDA:
 *   Textos/links   → content.json
 *   Cores/fontes   → design.json > tokens
 *   Ordem seções   → content.json > pageLayout.order
 */

class TokenResolver {
  /**
   * Resolve referências W3C {category.key} dentro de um design.json.
   * Suporta referências encadeadas e detecta ciclos circulares.
   */
  constructor(tokens) {
    this._tokens = tokens;
    this._cache  = new Map();
    this._REF    = /\{([^}]+)\}/g;
  }

  /**
   * Resolve um valor que pode conter {path.to.token}.
   * Strings mistas como "clamp({typography.scale24}, 3vw, {typography.scale32})"
   * são resolvidas substituindo cada referência.
   */
  resolve(value, _visited = new Set()) {
    if (typeof value !== 'string') return String(value);
    if (!value.includes('{'))      return value;

    const cacheKey = value;
    if (this._cache.has(cacheKey)) return this._cache.get(cacheKey);

    const resolved = value.replace(this._REF, (match, path) => {
      if (_visited.has(path)) {
        console.warn(`[TokenResolver] Ciclo detectado em: ${path}`);
        return match;
      }
      const raw = this._get(path);
      if (raw === undefined) {
        console.warn(`[TokenResolver] Token não encontrado: ${path}`);
        return match;
      }
      const next = new Set(_visited).add(path);
      return this.resolve(String(raw), next);
    });

    this._cache.set(cacheKey, resolved);
    return resolved;
  }

  /** Navega pelo objeto tokens por um path dotted "colors.navy700" */
  _get(path) {
    return path.split('.').reduce((obj, key) =>
      obj && obj[key] !== undefined ? obj[key] : undefined,
      this._tokens
    );
  }

  /**
   * Resolve todos os valores de uma categoria flat (ex: tokens.colors)
   * e retorna um mapa {chave: valorResolvido}.
   */
  resolveAll(category) {
    const obj = this._tokens[category];
    if (!obj) return {};
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([k]) => !k.startsWith('_'))
        .map(([k, v]) => [k, this.resolve(String(v))])
    );
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   RENDERER PRINCIPAL
   ═══════════════════════════════════════════════════════════════════════ */

class AuditEducaRenderer {
  constructor(content, design) {
    this.c  = content;
    this.d  = design;
    this._r = new TokenResolver(design.tokens);
    this._injectCSSVariables();
  }

  /* ── CSS Variables ──────────────────────────────────────────────────── */

  _injectCSSVariables() {
    const r  = this._r;
    const t  = this.d.tokens;

    /* ── Helpers ── */

    // Monta pares [--var-name, resolvedValue] de toda uma categoria
    const fromCategory = (category, prefix, keyTransform = k => k) =>
      Object.entries(r.resolveAll(category))
        .map(([k, v]) => [`--${prefix}-${keyTransform(k)}`, v]);

    // Transforma "camelCase" → "kebab-case"  (ex: navy700 → navy-700, cardHover → card-hover)
    const kebab = s => s.replace(/([a-z])([A-Z])/g, '$1-$2')
                        .replace(/([0-9])([a-zA-Z])/g, '$1-$2')
                        .toLowerCase();

    /* ── Composite motion vars (não existem como tokens mas são derivadas) */
    const mo = r.resolveAll('motion');
    const ease = mo.easingDefault;
    const compositeMotion = [
      ['--t-fast',   `${mo.durationFast}  ${ease}`],
      ['--t-base',   `${mo.durationBase}  ${ease}`],
      ['--t-medium', `${mo.durationMedium} ${ease}`],
      ['--t-slow',   `${mo.durationSlow}  ${ease}`],
      ['--t-image',  `${mo.durationSlow}  ${mo.easingOut}`],
    ];

    /* ── Layout vars (referências {spacing.N} já resolvidas) ── */
    const la = r.resolveAll('layout');

    const vars = [
      /* Colors — primitivos */
      ...fromCategory('colors', 'color', kebab),

      /* Typography */
      ['--font-display',   r.resolve(t.typography.fontDisplay)],
      ['--font-body',      r.resolve(t.typography.fontBody)],
      ['--font-mono',      r.resolve(t.typography.fontMono)],
      ...Object.entries(t.typography)
        .filter(([k]) => k.startsWith('scale'))
        .map(([k, v]) => [`--${kebab(k)}`, v]),

      /* Typography — aliases semânticos */
      ['--size-label',       r.resolve(t.typography.sizeLabel)],
      ['--size-caption',     r.resolve(t.typography.sizeCaption)],
      ['--size-small',       r.resolve(t.typography.sizeSmall)],
      ['--size-body',        r.resolve(t.typography.sizeBody)],
      ['--size-lead',        r.resolve(t.typography.sizeLead)],
      ['--size-sub',         r.resolve(t.typography.sizeSub)],
      ['--size-card-title',  r.resolve(t.typography.sizeCardTitle)],
      ['--size-section-h',   r.resolve(t.typography.sizeSectionH)],
      ['--size-hero-h',      r.resolve(t.typography.sizeHeroH)],
      ['--size-display-h',   r.resolve(t.typography.sizeDisplayH)],

      /* Weights (agora numbers) */
      ['--w-normal',   t.typography.weightNormal],
      ['--w-medium',   t.typography.weightMedium],
      ['--w-semibold', t.typography.weightSemibold],
      ['--w-bold',     t.typography.weightBold],

      /* Line heights (agora numbers) */
      ['--lh-none',    t.typography.lineHeightNone],
      ['--lh-tight',   t.typography.lineHeightTight],
      ['--lh-snug',    t.typography.lineHeightSnug],
      ['--lh-normal',  t.typography.lineHeightNormal],
      ['--lh-relaxed', t.typography.lineHeightRelaxed],
      ['--lh-loose',   t.typography.lineHeightLoose],

      /* Tracking */
      ['--tracking-tight',   t.typography.trackingTight],
      ['--tracking-normal',  t.typography.trackingNormal],
      ['--tracking-wide',    t.typography.trackingWide],
      ['--tracking-wider',   t.typography.trackingWider],
      ['--tracking-widest',  t.typography.trackingWidest],
      ['--tracking-ultra',   t.typography.trackingUltra],

      /* Spacing */
      ...fromCategory('spacing', 'sp', k => k),

      /* Sizing — nova escala sem magic numbers */
      ...fromCategory('sizing', 'sz', kebab),

      /* Radii */
      ...fromCategory('radii', 'r', k => k),

      /* Shadows */
      ...fromCategory('shadows', 'shadow', kebab),

      /* Motion — primitivos */
      ...fromCategory('motion', 'motion', kebab),
      /* Motion — compostos derivados */
      ...compositeMotion,

      /* Layout */
      ['--container-max',  la.containerMax],
      ['--container-pad',  la.containerPad],
      ['--sidebar-width',  la.sidebarWidth],
      ['--main-gap',       la.mainGap],
      ['--section-gap',    la.sectionGap],
      ['--card-gap',       la.cardGap],
      ['--header-height',  la.headerHeight],
      ['--filter-bar-h',   la.filterBarH],

      /* Z-index (agora integers) */
      ...Object.entries(t.zIndex)
        .map(([k, v]) => [`--z-${k}`, v]),

      /* Breakpoints */
      ...Object.entries(t.breakpoints)
        .map(([k, v]) => [`--bp-${k}`, v]),
    ];

    const existing = document.getElementById('ae-vars');
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.id = 'ae-vars';
    style.textContent =
      `:root {\n` +
      vars.map(([k, v]) => `  ${k}: ${v};`).join('\n') +
      `\n}`;
    document.head.prepend(style);
  }

  /* ── Render All ─────────────────────────────────────────────────────── */

  renderAll(selector) {
    const root = document.querySelector(selector);
    if (!root) throw new Error(`[AE Renderer] Container "${selector}" não encontrado`);

    const layout = this.c.pageLayout;

    const wrapper = this._el('div', 'ae-page-wrapper');
    const main    = this._el('main', 'ae-main');

    layout.order.forEach(key => {
      const el = this._renderBlock(key);
      if (el) main.appendChild(el);
    });

    wrapper.appendChild(main);

    if (layout.hasSidebar) {
      wrapper.appendChild(this._renderSidebar());
    }

    root.appendChild(wrapper);

    // Filter bar — fora do wrapper (full-width)
    if (!document.querySelector('.ae-filter-bar')) {
      root.prepend(this._renderFilterBar());
    }
  }

  _renderBlock(key) {
    if (key === 'filterBar')      return null;
    if (key === 'hero')           return this._renderHero();
    if (key === 'featuredTrio')   return this._renderFeaturedTrio();
    if (key === 'suggestionForm') return this._renderSuggestionForm();
    if (key === 'ctaBanner')      return this._renderCtaBanner();

    if (key.startsWith('sections.')) {
      const id  = key.replace('sections.', '');
      const sec = this.c.sections.find(s => s.id === id);
      if (!sec) return null;
      const map = {
        'grid-3col':             () => this._renderGrid3col(sec),
        'featured-large-plus-3': () => this._renderFeaturedLarge(sec),
        'tools-grid':            () => this._renderToolsGrid(sec),
        'numbered-list':         () => this._renderNumberedList(sec),
      };
      return map[sec.template] ? map[sec.template]() : null;
    }
    return null;
  }

  /* ── Filter Bar ─────────────────────────────────────────────────────── */

  _renderFilterBar() {
    const fb  = this.c.filterBar;
    const nav = this._el('nav', 'ae-filter-bar');
    nav.setAttribute('aria-label', 'Filtro de categorias');
    nav.innerHTML = fb.items.map(item => `
      <button class="ae-filter-pill${item.active ? ' ae-filter-pill--active' : ''}"
              data-filter="${item.value}"
              aria-pressed="${item.active}">
        ${item.label}
      </button>
    `).join('');

    nav.querySelectorAll('.ae-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        nav.querySelectorAll('.ae-filter-pill').forEach(b => {
          b.classList.remove('ae-filter-pill--active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('ae-filter-pill--active');
        btn.setAttribute('aria-pressed', 'true');
        document.dispatchEvent(
          new CustomEvent('ae:filter', { detail: btn.dataset.filter })
        );
      });
    });
    return nav;
  }

  /* ── Hero ───────────────────────────────────────────────────────────── */

  _renderHero() {
    const h   = this.c.hero;
    const div = this._el('section', 'ae-hero');
    div.innerHTML = `
      <div class="ae-hero__img-wrap">
        <img src="${h.image}" alt="${h.imageAlt}" loading="eager" class="ae-hero__img">
      </div>
      <div class="ae-hero__content">
        <span class="ae-badge ae-badge--accent">${h.badge}</span>
        <h1 class="ae-hero__title">${h.title}</h1>
        <p class="ae-hero__meta">
          <span class="ae-read-time">⏱ ${h.readTime}</span>
          <span class="ae-dot">·</span>
          <span>${h.author}</span>
          <span class="ae-dot">·</span>
          <time>${h.date}</time>
        </p>
        <p class="ae-hero__excerpt">${h.excerpt}</p>
        <a href="${h.ctaUrl}" class="ae-btn ae-btn--accent">${h.ctaLabel}</a>
        <ul class="ae-hero__bullets" aria-label="Pontos-chave">
          ${h.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `;
    return div;
  }

  /* ── Featured Trio ──────────────────────────────────────────────────── */

  _renderFeaturedTrio() {
    const trio = this.c.featuredTrio;
    const sec  = this._el('section', 'ae-featured-trio');
    sec.setAttribute('aria-label', 'Artigos em destaque');
    sec.innerHTML = trio.articles.map(a => `
      <a href="${a.url}" class="ae-trio-card">
        <div class="ae-trio-card__img-wrap">
          <img src="${a.image}" alt="${a.title}" loading="lazy">
          <span class="ae-badge ae-badge--glass">${a.badge}</span>
        </div>
        <div class="ae-trio-card__body">
          <span class="ae-trio-card__category">${a.category}</span>
          <h2 class="ae-trio-card__title">${a.title}</h2>
          <span class="ae-read-time">⏱ ${a.readTime}</span>
        </div>
      </a>
    `).join('');
    return sec;
  }

  /* ── Section Header ─────────────────────────────────────────────────── */

  _sectionHeader(sec) {
    return `
      <div class="ae-section-header">
        <div class="ae-section-header__left">
          <div class="ae-section-header__accent" aria-hidden="true"></div>
          <span class="ae-section-header__label">${sec.label || ''}</span>
          <h2 class="ae-section-header__title">${sec.title}</h2>
        </div>
        ${sec.ctaUrl
          ? `<a href="${sec.ctaUrl}" class="ae-section-header__cta">${sec.ctaLabel || 'Ver todos'} →</a>`
          : ''}
      </div>
    `;
  }

  /* ── Grid 3 Col ─────────────────────────────────────────────────────── */

  _renderGrid3col(sec) {
    const wrap = this._el('section', 'ae-section');
    wrap.setAttribute('data-section', sec.id);
    wrap.innerHTML = this._sectionHeader(sec);

    const grid = this._el('div', 'ae-grid-3col');
    grid.innerHTML = sec.articles.map(a => `
      <a href="${a.url}" class="ae-article-card">
        <div class="ae-article-card__img-wrap">
          <img src="${a.image}" alt="${a.title}" loading="lazy">
        </div>
        <div class="ae-article-card__body">
          <span class="ae-article-card__badge">${a.badge}</span>
          <h3 class="ae-article-card__title">${a.title}</h3>
          <p class="ae-article-card__excerpt">${a.excerpt}</p>
          <div class="ae-article-card__footer">
            <span class="ae-read-time">⏱ ${a.readTime}</span>
            <time class="ae-date">${a.date}</time>
            <span class="ae-cta-link" aria-hidden="true">Ler →</span>
          </div>
        </div>
      </a>
    `).join('');

    wrap.appendChild(grid);
    if (sec.showAd) wrap.appendChild(this._adSlot('inFeed'));
    return wrap;
  }

  /* ── Featured Large + 3 ─────────────────────────────────────────────── */

  _renderFeaturedLarge(sec) {
    const wrap = this._el('section', 'ae-section');
    wrap.setAttribute('data-section', sec.id);
    wrap.innerHTML = this._sectionHeader(sec);

    const layout = this._el('div', 'ae-featured-layout');

    const f       = sec.featured;
    const bigCard = this._el('a', 'ae-featured-card');
    bigCard.href  = f.url;
    bigCard.innerHTML = `
      <div class="ae-featured-card__img-wrap">
        <img src="${f.image}" alt="${f.title}" loading="lazy">
        <span class="ae-badge ae-badge--accent">${f.badge}</span>
      </div>
      <div class="ae-featured-card__body">
        <h3 class="ae-featured-card__title">${f.title}</h3>
        <p class="ae-featured-card__excerpt">${f.excerpt}</p>
        <div class="ae-featured-card__tags">
          ${f.tags.map(t => `<span class="ae-tag">${t}</span>`).join('')}
        </div>
        <span class="ae-btn ae-btn--brand ae-btn--sm">${f.ctaLabel}</span>
      </div>
    `;
    layout.appendChild(bigCard);

    const stack   = this._el('div', 'ae-side-stack');
    stack.innerHTML = sec.articles.map(a => `
      <a href="${a.url}" class="ae-side-card">
        <img src="${a.image}" alt="${a.title}" class="ae-side-card__img" loading="lazy">
        <div class="ae-side-card__body">
          <div class="ae-side-card__meta">
            <span class="ae-badge ae-badge--inline">${a.badge}</span>
            <span class="ae-norm-label">${a.norm}</span>
          </div>
          <h4 class="ae-side-card__title">${a.title}</h4>
          <p class="ae-side-card__excerpt">${a.excerpt}</p>
          <span class="ae-read-time">⏱ ${a.readTime} → Ler</span>
        </div>
      </a>
    `).join('');
    layout.appendChild(stack);

    wrap.appendChild(layout);
    return wrap;
  }

  /* ── Tools Grid ─────────────────────────────────────────────────────── */

  _renderToolsGrid(sec) {
    const wrap = this._el('section', 'ae-section');
    wrap.setAttribute('data-section', sec.id);
    wrap.innerHTML = this._sectionHeader(sec);

    const grid = this._el('div', 'ae-tools-grid');
    grid.innerHTML = sec.tools.map(t => `
      <a href="${t.url}" class="ae-tool-card">
        <div class="ae-tool-card__img-wrap">
          <img src="${t.image}" alt="${t.title}" loading="lazy">
          <span class="ae-tool-card__category">${t.category}</span>
        </div>
        <div class="ae-tool-card__body">
          <h3 class="ae-tool-card__title">${t.title}</h3>
          <p class="ae-tool-card__desc">${t.description}</p>
          <div class="ae-tool-card__tags">
            ${t.tags.map(tag => `<span class="ae-tag">${tag}</span>`).join('')}
          </div>
        </div>
      </a>
    `).join('');

    wrap.appendChild(grid);
    return wrap;
  }

  /* ── Numbered List ──────────────────────────────────────────────────── */

  _renderNumberedList(sec) {
    const wrap = this._el('section', 'ae-section');
    wrap.setAttribute('data-section', sec.id);
    wrap.innerHTML = this._sectionHeader(sec);

    const grid = this._el('div', 'ae-guides-grid');
    grid.innerHTML = sec.guides.map(g => `
      <a href="${g.url}" class="ae-guide-item">
        <span class="ae-guide-item__number" aria-hidden="true">${g.number}</span>
        <div class="ae-guide-item__body">
          <span class="ae-guide-item__badge ae-guide-item__badge--${g.badge.toLowerCase()}">${g.badge}</span>
          <h3 class="ae-guide-item__title">${g.title}</h3>
          <p class="ae-guide-item__meta">
            <span>⏱ ${g.duration}</span>
            <span class="ae-dot">·</span>
            <span>${g.modules}</span>
            <span class="ae-dot">·</span>
            <span class="ae-norm-label">${g.norm}</span>
          </p>
        </div>
      </a>
    `).join('');

    wrap.appendChild(grid);
    return wrap;
  }

  /* ── Sidebar ────────────────────────────────────────────────────────── */

  _renderSidebar() {
    const sb     = this.c.sidebar;
    const aside  = this._el('aside', 'ae-sidebar');
    const layout = this.c.pageLayout;

    layout.sidebarSections.forEach(key => {
      const widget = this._renderWidget(key, sb[key]);
      if (widget) aside.appendChild(widget);
    });

    aside.appendChild(this._adSlot('square'));
    aside.appendChild(this._adSlot('skyscraper'));
    return aside;
  }

  _renderWidget(key, data) {
    if (!data) return null;
    const box    = this._el('div', `ae-widget ae-widget--${key}`);
    const header = `<h3 class="ae-widget__title">${data.title}</h3>`;

    if (key === 'trending') {
      box.innerHTML = header + `<ol class="ae-trending-list">
        ${data.items.map(item => `
          <li class="ae-trending-item">
            <span class="ae-trending-item__rank" aria-hidden="true">${item.rank}</span>
            <div>
              <strong class="ae-trending-item__title">${item.title}</strong>
              <div class="ae-trending-item__tags">${item.tags.join(' · ')}</div>
            </div>
          </li>
        `).join('')}
      </ol>`;
    }

    if (key === 'quickTools') {
      box.innerHTML = header + `
        <div class="ae-widget__header-row">
          <a href="${data.ctaUrl}" class="ae-widget__cta-link">${data.ctaLabel} →</a>
        </div>
        <ul class="ae-quick-tools-list">
          ${data.items.map(item => `
            <li><a href="${item.url}" class="ae-quick-tool-item">
              <span class="ae-quick-tool-item__label">${item.label}</span>
              <span class="ae-norm-label">${item.norm}</span>
            </a></li>
          `).join('')}
        </ul>`;
    }

    if (key === 'simulados') {
      box.innerHTML = header + `<ul class="ae-simulados-list">
        ${data.items.map(item => `
          <li><a href="${item.url}" class="ae-simulado-item">
            <strong>${item.label}</strong>
            <span class="ae-norm-label">${item.sub}</span>
          </a></li>
        `).join('')}
      </ul>`;
    }

    if (key === 'normas') {
      box.innerHTML = header + `
        <div class="ae-widget__header-row">
          <a href="${data.ctaUrl}" class="ae-widget__cta-link">${data.ctaLabel} →</a>
        </div>
        <ul class="ae-normas-list">
          ${data.items.map(item => `
            <li class="ae-norma-item">
              <code class="ae-norma-item__code">${item.code}</code>
              <span class="ae-norma-item__desc">${item.desc}</span>
            </li>
          `).join('')}
        </ul>`;
    }

    if (key === 'marketData') {
      box.innerHTML = header + `<div class="ae-market-grid">
        ${data.items.map(item => `
          <div class="ae-market-item">
            <span class="ae-market-item__label">${item.label}</span>
            <span class="ae-market-item__value">${item.value}</span>
            <span class="ae-market-item__delta ae-market-item__delta--${item.trend}">
              ${item.delta}
            </span>
          </div>
        `).join('')}
      </div>`;
    }

    return box;
  }

  /* ── Suggestion Form ────────────────────────────────────────────────── */

  _renderSuggestionForm() {
    const f   = this.c.suggestionForm;
    const sec = this._el('section', 'ae-section ae-suggestion-form');
    sec.setAttribute('data-section', 'suggestion-form');
    sec.innerHTML = `
      <h2 class="ae-suggestion-form__title">${f.title}</h2>
      <p class="ae-suggestion-form__desc">${f.description}</p>
      <div class="ae-suggestion-form__actions">
        <button class="ae-btn ae-btn--brand" id="ae-suggest-btn">${f.ctaLabel}</button>
        <p class="ae-suggestion-form__success" id="ae-suggest-success" hidden>${f.successMessage}</p>
      </div>
    `;
    sec.querySelector('#ae-suggest-btn').addEventListener('click', () => {
      sec.querySelector('#ae-suggest-btn').hidden = true;
      sec.querySelector('#ae-suggest-success').hidden = false;
    });
    return sec;
  }

  /* ── CTA Banner ─────────────────────────────────────────────────────── */

  _renderCtaBanner() {
    const b   = this.c.ctaBanner;
    const sec = this._el('section', 'ae-cta-banner');
    sec.innerHTML = `
      <h2 class="ae-cta-banner__title">${b.title}</h2>
      <p class="ae-cta-banner__desc">${b.description}</p>
      <div class="ae-cta-banner__btns">
        ${b.ctas.map(cta => `
          <a href="${cta.url}" class="ae-btn ae-btn--cta-${cta.variant}">${cta.label}</a>
        `).join('')}
      </div>
    `;
    return sec;
  }

  /* ── Ad Slot ────────────────────────────────────────────────────────── */

  _adSlot(variant) {
    const cfg = this.d.templates.adSlot.variants[variant];
    const div = this._el('div', `ae-ad ae-ad--${variant}`);
    div.setAttribute('aria-label', 'Publicidade');
    div.innerHTML = `
      <span class="ae-ad__label">Publicidade</span>
      <span class="ae-ad__desc">${cfg.label}</span>
    `;
    return div;
  }

  /* ── Utils ──────────────────────────────────────────────────────────── */

  _el(tag, cls) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    return el;
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   LOADER — carrega JSONs e inicializa o renderer
   ═══════════════════════════════════════════════════════════════════════ */

async function loadAuditEduca({
  contentUrl = 'content.json',
  designUrl  = 'design.json',
  target     = '#app'
} = {}) {
  const [content, design] = await Promise.all([
    fetch(contentUrl).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }),
    fetch(designUrl).then(r  => { if (!r.ok) throw new Error(r.status); return r.json(); }),
  ]);
  const renderer = new AuditEducaRenderer(content, design);
  renderer.renderAll(target);
  return renderer;
}

/* Export ESM / CJS / global */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuditEducaRenderer, TokenResolver, loadAuditEduca };
} else if (typeof window !== 'undefined') {
  window.AuditEducaRenderer = AuditEducaRenderer;
  window.TokenResolver      = TokenResolver;
  window.loadAuditEduca     = loadAuditEduca;
}
