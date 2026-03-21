import React, { useState, useCallback, useMemo, lazy, Suspense, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import MainLayout from '../components/layout/MainLayout';
import TopicLinks from '../components/TopicLinks';
import Toast from '../components/ui/Toast';
import ShareSidebar from '../components/ShareSidebar';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useActiveSection } from '../hooks/useActiveSection';
import { useScrollToTopButton } from '../hooks/useScrollToTop';
import { useCharacterCount } from '../hooks/useCharacterCount';
import { useFormValidation } from '../hooks/useFormValidation';
import { getCanonicalUrl, getSiteOrigin } from '../utils/seo';
import data from '../data/sobreNos.json';

// Ícones SVG inline (react-icons)
import {
  FaCalendarAlt, FaLandmark, FaCodeBranch, FaBuilding, FaHistory,
  FaMountain, FaAward, FaQuestionCircle, FaHandshake, FaBullseye,
  FaLightbulb, FaBalanceScale, FaSearch, FaUsers, FaCommentDots,
  FaPaperPlane, FaSpinner, FaCheck, FaTimes, FaChevronRight,
  FaChevronDown, FaArrowUp, FaEye
} from 'react-icons/fa';

const RelatorioThumbnails = lazy(() => import(
  /* webpackPrefetch: true */
  '../components/RelatorioThumbnails'
));

const iconMap = {
  'fa-calendar-days': FaCalendarAlt,
  'fa-landmark': FaLandmark,
  'fa-code-branch': FaCodeBranch,
  'fa-building-columns': FaBuilding,
  'fa-history': FaHistory,
  'fa-mountain-sun': FaMountain,
  'fa-award': FaAward,
  'fa-question-circle': FaQuestionCircle,
  'fa-handshake-angle': FaHandshake,
};

export default function SobreNos() {
  const navigate = useNavigate();
  const location = useLocation();

  const canonicalUrl = useMemo(() => getCanonicalUrl(location), [location]);
  const siteOrigin = useMemo(() => getSiteOrigin(), []);

  const [toastMessage, setToastMessage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sugStatus, setSugStatus] = useState('idle');
  const [consentChecked, setConsentChecked] = useState(false);
  const [sugText, setSugText] = useState('');
  const [topOffset, setTopOffset] = useState(140); // valor inicial

  const abortControllerRef = useRef(null);

  const isScrollingUp = useScrollDirection();
  const isIndexVisible = isScrollingUp;
  const sections = useMemo(() => ['hero', 'historia', 'missao-visao', 'valores', 'faq', 'sugestao'], []);
  const activeSection = useActiveSection(sections);
  const showScrollTop = useScrollToTopButton();

  const { state: charCount, handleChange: handleCharChange, reset: resetCharCount } = useCharacterCount(data.sugestoes.maxLength);
  const { state: validationState, reset: resetValidation } = useFormValidation({
    sugestao: { required: true, minLength: data.sugestoes.minLength, maxLength: data.sugestoes.maxLength }
  });

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Função que calcula o offset total (header + datebar)
  const getTotalOffset = useCallback(() => {
    const headerEl = document.querySelector('header') || document.querySelector('.sticky.top-0');
    const headerHeight = headerEl ? headerEl.offsetHeight : 80;
    const dateBarEl = document.querySelector('.sticky.z-40');
    const dateBarHeight = dateBarEl ? dateBarEl.offsetHeight : 40;
    return headerHeight + dateBarHeight;
  }, []);

  // Atualiza o offset dinamicamente quando o layout mudar
  useEffect(() => {
    const updateOffset = () => setTopOffset(getTotalOffset());
    updateOffset();
    const resizeObserver = new ResizeObserver(() => requestAnimationFrame(updateOffset));
    const headerEl = document.querySelector('header') || document.querySelector('.sticky.top-0');
    const dateBarEl = document.querySelector('.sticky.z-40');
    if (headerEl) resizeObserver.observe(headerEl);
    if (dateBarEl) resizeObserver.observe(dateBarEl);
    return () => resizeObserver.disconnect();
  }, [getTotalOffset]);

  const scrollToSection = useCallback((e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    const totalOffset = getTotalOffset();
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - totalOffset;

    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [getTotalOffset]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSendSug = useCallback(async () => {
    if (!consentChecked) {
      showToast(data.sugestoes.validationMessages.requiresConsent);
      return;
    }
    if (!sugText.trim()) {
      showToast(data.sugestoes.validationMessages.empty);
      return;
    }
    if (sugText.trim().length < data.sugestoes.minLength) {
      showToast(data.sugestoes.validationMessages.tooShort);
      document.getElementById('sugestao-texto')?.focus();
      return;
    }
    if (sugText.length > data.sugestoes.maxLength) {
      showToast(data.sugestoes.validationMessages.tooLong);
      return;
    }

    const cleanedText = DOMPurify.sanitize(sugText.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setSugStatus('loading');

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          text: cleanedText,
          consent: true,
          timestamp: new Date().toISOString()
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro no servidor');
      }

      const result = await response.json();

      setSugText('');
      setConsentChecked(false);
      setSugStatus('sent');
      resetCharCount();
      resetValidation();
      showToast(data.sugestoes.successMessage);

      setTimeout(() => setSugStatus('idle'), 4000);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Erro ao enviar sugestão:', err);
        setSugStatus('error');
        showToast(data.sugestoes.errorMessage);
        setTimeout(() => setSugStatus('idle'), 4000);
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [sugText, consentChecked, showToast, resetCharCount, resetValidation]);

  const lastUpdated = useMemo(() =>
    new Date(data.meta.lastUpdated).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' }),
    []
  );

  // Schemas
  const organizationSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AuditEduca',
    url: canonicalUrl,
    logo: `${siteOrigin}/logo.png`,
    description: 'Plataforma de educação técnica em auditoria, contabilidade e governança.',
    sameAs: ['https://www.linkedin.com/company/auditeduca', 'https://www.instagram.com/auditeduca']
  }), [canonicalUrl, siteOrigin]);

  const breadcrumbSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteOrigin },
      { '@type': 'ListItem', position: 2, name: 'Institucional', item: `${siteOrigin}/institucional` },
      { '@type': 'ListItem', position: 3, name: 'Sobre Nós', item: canonicalUrl }
    ]
  }), [siteOrigin, canonicalUrl]);

  const aboutPageSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Sobre o AuditEduca – Missão, Visão e Valores',
    description: 'Conheça a história, missão, visão e valores do AuditEduca.',
    url: canonicalUrl,
    isPartOf: { '@type': 'WebSite', name: 'AuditEduca', url: siteOrigin }
  }), [canonicalUrl, siteOrigin]);

  const faqSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((item) => ({
      '@type': 'Question',
      name: item.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: item.resposta }
    }))
  }), []);

  const articleSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Sobre o AuditEduca',
    description: 'História, missão e valores da plataforma.',
    author: { '@type': 'Organization', name: 'AuditEduca' },
    publisher: { '@type': 'Organization', name: 'AuditEduca' },
    datePublished: data.meta.lastUpdated,
    dateModified: data.meta.lastUpdated,
    mainEntityOfPage: canonicalUrl
  }), [canonicalUrl]);

  return (
    <>
      <Helmet>
        <html lang="pt-BR" />
        <title>Sobre o AuditEduca: Missão, Visão e Valores</title>
        <meta name="description" content="Conheça a história, missão, visão e valores do AuditEduca. Somos referência em educação técnica para auditoria, com foco em ética, inovação e inclusão. Auditoria interna, compliance, governança corporativa, SOX, COSO – capacitação profissional e treinamento em auditoria." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="pt-BR" href={canonicalUrl} />
        <meta name="author" content="AuditEduca" />
        <meta name="publisher" content="AuditEduca" />
        <meta name="theme-color" content="#0C1B33" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sobre o AuditEduca – Missão, Visão e Valores" />
        <meta property="og:description" content="Conheça a história, missão, visão e valores do AuditEduca." />
        <meta property="og:image" content={`${siteOrigin}/assets/images/Audit-Educa-Hero.webp`} />
        <meta property="og:image:alt" content="Equipe executiva AuditEduca em reunião" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="AuditEduca" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sobre o AuditEduca – Missão, Visão e Valores" />
        <meta name="twitter:description" content="Conheça a história, missão, visão e valores do AuditEduca." />
        <meta name="twitter:image" content={`${siteOrigin}/assets/images/Audit-Educa-Hero.webp`} />

        {/* Preload de fonte (exemplo) */}
        <link rel="preload" href="/fonts/geist-variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

        {/* CSRF Token (preenchido pelo backend) */}
        <meta name="csrf-token" content="" />

        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(aboutPageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <MainLayout>
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="pt-8 mb-6 no-print" aria-label="Navegação de localização">
            <ol className="flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-slate-600">
              <li><Link to="/" className="hover:text-audit-navy transition-colors">Home</Link></li>
              <li aria-hidden="true"><FaChevronRight className="text-[10px] opacity-50" aria-hidden="true" /></li>
              <li><span>Institucional</span></li>
              <li aria-hidden="true"><FaChevronRight className="text-[10px] opacity-50" aria-hidden="true" /></li>
              <li className="text-audit-navy font-bold" aria-current="page">Sobre Nós</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* COLUNA ESQUERDA */}
            <div className="lg:col-span-8 space-y-12">
              {/* HERO */}
              <article id="hero" className="bg-audit-navy relative overflow-hidden rounded-[2.5rem] shadow-2xl group border border-white/10">
                <div className="absolute inset-0 w-full h-full">
                  <picture>
                    <source
                      srcSet="
                        /assets/images/Audit-Educa-Hero-480.avif 480w,
                        /assets/images/Audit-Educa-Hero-768.avif 768w,
                        /assets/images/Audit-Educa-Hero-1024.avif 1024w,
                        /assets/images/Audit-Educa-Hero.avif 1920w
                      "
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      type="image/avif"
                    />
                    <source
                      srcSet="
                        /assets/images/Audit-Educa-Hero-480.webp 480w,
                        /assets/images/Audit-Educa-Hero-768.webp 768w,
                        /assets/images/Audit-Educa-Hero-1024.webp 1024w,
                        /assets/images/Audit-Educa-Hero.webp 1920w
                      "
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      type="image/webp"
                    />
                    <img
                      src="/assets/images/Audit-Educa-Hero.jpg"
                      srcSet="
                        /assets/images/Audit-Educa-Hero-480.jpg 480w,
                        /assets/images/Audit-Educa-Hero-768.jpg 768w,
                        /assets/images/Audit-Educa-Hero-1024.jpg 1024w,
                        /assets/images/Audit-Educa-Hero.jpg 1920w
                      "
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      alt="Equipe executiva AuditEduca"
                      className="w-full h-full object-cover"
                      style={{ opacity: 0.15 }}
                      fetchPriority="high"
                      decoding="async"
                      loading="eager"
                    />
                  </picture>
                </div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-audit-gold/20 blur-2xl md:blur-[40px] rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 blur-2xl md:blur-[40px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 p-10 md:p-16">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-audit-gold opacity-75 motion-reduce:animate-none"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-audit-gold"></span>
                    </span>
                    <span className="text-audit-gold font-bold text-[10px] uppercase tracking-[0.2em]">Nossa Trajetória</span>
                  </div>

                  <h1 className="font-serif text-5xl md:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                    Sobre o AuditEduca:{' '}
                    <span className="text-audit-gold italic">Missão, Visão e Valores</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-12 max-w-2xl font-light">
                    No <strong className="text-white font-semibold underline decoration-audit-gold/50 underline-offset-4">AuditEduca</strong>, acreditamos que a excelência técnica só é plena quando partilhada. Somos o ponto de encontro entre o rigor da norma e o dinamismo da prática. Oferecemos{' '}
                    <Link to="/cursos-auditoria" className="text-audit-gold hover:underline">cursos de auditoria</Link>, conteúdos exclusivos e ferramentas que elevam o padrão profissional. Atuamos nas áreas de <strong>auditoria interna, compliance, governança corporativa, SOX e COSO</strong>, proporcionando capacitação profissional e treinamento em auditoria de ponta.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/10">
                    {[
                      { icon: 'fa-calendar-days', label: 'Última atualização', value: lastUpdated },
                      { icon: 'fa-landmark', label: 'Entidade', value: 'Audit Educa' },
                      { icon: 'fa-code-branch', label: 'Versão', value: data.meta.version }
                    ].map((item, idx) => {
                      const Icon = iconMap[item.icon];
                      return (
                        <div key={idx} className="flex items-center gap-4 group/item">
                          <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover/item:border-audit-gold/50 transition-colors">
                            <Icon className="text-audit-gold text-sm" aria-hidden="true" />
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">{item.label}</span>
                            <span className="text-white font-medium text-sm">{item.value}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>

              {/* SHARE */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <ShareSidebar title="Sobre Nós - Audit Educa" url={canonicalUrl} />
              </div>

              {/* HISTÓRIA */}
              <section id="historia" className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-audit-navy/5 rounded-xl flex items-center justify-center text-audit-navy">
                    <FaHistory className="text-2xl" aria-hidden="true" />
                  </div>
                  <h2 className="text-3xl font-serif font-black text-audit-navy">{data.historia.titulo}</h2>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">{data.historia.texto}</p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Com o objetivo de suprir a demanda por <strong>capacitação em auditoria interna</strong> e <strong>conformidade regulatória</strong>, a AuditEduca foi criada para oferecer <strong>treinamento em normas internacionais</strong> como <strong>SOX, COSO e controles internos</strong>. Desde então, impactamos <strong className="text-audit-navy">mais de 10.000 profissionais</strong> em todo o país, através de{' '}
                  <Link to="/cursos-auditoria" className="text-audit-gold hover:underline">cursos</Link>, conteúdos gratuitos e ferramentas inovadoras.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
                  {data.historia.impactos.map((stat, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-3">
                      <div className="text-2xl font-bold text-audit-gold">{stat.value}</div>
                      <div className="text-xs text-slate-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* MISSÃO & VISÃO */}
              <section id="missao-visao" className="grid md:grid-cols-2 gap-8">
                <article className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-audit-navy/5 rounded-2xl flex items-center justify-center mb-8 text-audit-navy">
                      <FaBullseye className="text-3xl" aria-hidden="true" />
                    </div>
                    <h2 className="text-3xl font-serif font-black text-audit-navy mb-5 tracking-tight">{data.missao.titulo}</h2>
                    <p className="text-slate-600 leading-relaxed font-light text-lg">
                      Democratizar o conhecimento técnico em <strong>auditoria contábil, gestão de riscos e governança corporativa</strong>, tornando a <strong>educação continuada</strong> acessível e prática.
                    </p>
                  </div>
                </article>

                <article className="bg-audit-navy p-10 rounded-[2rem] shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                  <div className="absolute -right-12 -bottom-12 opacity-5 group-hover:scale-125 transition-transform duration-700">
                    <FaEye className="text-[12rem] text-white" aria-hidden="true" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 text-audit-gold">
                      <FaLightbulb className="text-3xl animate-pulse motion-reduce:animate-none" aria-hidden="true" />
                    </div>
                    <h2 className="text-3xl font-serif font-black text-white mb-5 tracking-tight">{data.visao.titulo}</h2>
                    <p className="text-slate-200 leading-relaxed font-light text-lg">{data.visao.texto}</p>
                  </div>
                </article>
              </section>

              {/* VALORES */}
              <section id="valores" className="pt-8">
                <div className="flex items-center gap-5 mb-12">
                  <div className="h-12 w-1.5 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-4xl font-serif font-black text-audit-navy tracking-tight">Nossos Valores</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {data.valores.map((valor, i) => {
                    let Icon;
                    switch (valor.icon) {
                      case 'fa-scale-balanced': Icon = FaBalanceScale; break;
                      case 'fa-magnifying-glass': Icon = FaSearch; break;
                      case 'fa-users': Icon = FaUsers; break;
                      case 'fa-lightbulb': Icon = FaLightbulb; break;
                      default: Icon = FaBalanceScale;
                    }
                    return (
                      <article key={i} className="group flex flex-col items-start gap-4 bg-white p-8 rounded-3xl border border-slate-200 hover:border-audit-gold/30 hover:shadow-2xl hover:shadow-audit-navy/5 transition-all duration-300">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-audit-navy group-hover:bg-audit-gold group-hover:text-audit-navy transition-all duration-500 shadow-inner">
                          <Icon className="text-xl" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="font-black text-audit-navy text-lg mb-2">{valor.nome}</h3>
                          <p className="text-slate-500 text-sm font-light leading-relaxed">
                            {valor.nome === 'Ética Absoluta' && 'Aplicada em auditoria de conformidade e integridade profissional.'}
                            {valor.nome === 'Transparência' && 'Na comunicação de resultados de auditoria e relatórios de governança.'}
                            {valor.nome === 'Inclusão' && 'Promovendo a diversidade no mercado de auditoria e gestão de riscos.'}
                            {valor.nome === 'Inovação' && 'Com foco em tecnologia aplicada à auditoria e análise de dados.'}
                            {!['Ética Absoluta', 'Transparência', 'Inclusão', 'Inovação'].includes(valor.nome) && valor.desc}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-audit-navy/5 rounded-xl flex items-center justify-center text-audit-navy">
                    <FaQuestionCircle className="text-2xl" aria-hidden="true" />
                  </div>
                  <h2 className="text-3xl font-serif font-black text-audit-navy">Perguntas Frequentes</h2>
                </div>
                <div className="space-y-6">
                  {data.faq.map((item, idx) => (
                    <details key={idx} className="group border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-audit-gold/30 transition-colors">
                      <summary className="text-lg font-bold text-audit-navy flex justify-between items-center">
                        {item.pergunta}
                        <FaChevronDown className="group-open:rotate-180 transition-transform text-audit-gold" aria-hidden="true" />
                      </summary>
                      <p className="text-slate-600 mt-4">{item.resposta}</p>
                    </details>
                  ))}
                  <details className="group border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-audit-gold/30 transition-colors">
                    <summary className="text-lg font-bold text-audit-navy flex justify-between items-center">
                      A AuditEduca oferece conteúdo sobre auditoria interna e normas como SOX e COSO?
                      <FaChevronDown className="group-open:rotate-180 transition-transform text-audit-gold" aria-hidden="true" />
                    </summary>
                    <p className="text-slate-600 mt-4">
                      Sim. Nossos cursos abrangem <strong>auditoria interna</strong>, <strong>controles internos</strong>, <strong>conformidade (compliance)</strong> e as principais <strong>estruturas de governança corporativa</strong>, incluindo <strong>SOX</strong> e <strong>COSO</strong>, sempre alinhados às melhores práticas do mercado.
                    </p>
                  </details>
                </div>
              </section>

              {/* SUGESTÕES */}
              <section id="sugestao" className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32"></div>
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-4 mb-4 text-audit-gold">
                    <FaCommentDots className="text-2xl" aria-hidden="true" />
                    <span className="uppercase tracking-[0.3em] font-black text-[10px]">Feedback</span>
                  </div>
                  <h3 className="text-4xl font-serif font-black text-audit-navy mb-4">Contribua com a <span className="text-audit-gold">Evolução</span></h3>
                  <p className="text-slate-500 font-light text-lg mb-10 leading-relaxed">
                    {data.sugestoes.descricao} Sua opinião nos ajuda a evoluir nos temas de <strong>auditoria, compliance, governança corporativa e educação profissional</strong>.
                  </p>

                  <form onSubmit={(e) => { e.preventDefault(); handleSendSug(); }} className="space-y-6" noValidate>
                    <div>
                      <label htmlFor="sugestao-texto" className="block text-sm font-medium text-slate-700 mb-2">Sua sugestão *</label>
                      <textarea
                        id="sugestao-texto"
                        className={`w-full bg-slate-50 border-2 rounded-3xl p-6 text-base min-h-[180px] focus:ring-4 focus:ring-audit-gold/10 outline-none transition-all font-light text-slate-700 resize-none ${
                          validationState.errors.length > 0 ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-audit-gold'
                        }`}
                        placeholder={data.sugestoes.placeholder}
                        value={sugText}
                        onChange={(e) => {
                          setSugText(e.target.value);
                          handleCharChange(e.target.value);
                        }}
                        maxLength={data.sugestoes.maxLength}
                        aria-required="true"
                        aria-label="Campo de sugestão"
                        aria-invalid={validationState.errors.some(e => e.field === 'sugestao')}
                        disabled={sugStatus === 'loading' || sugStatus === 'sent'}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-slate-500 font-medium">{charCount.current}/{charCount.max} caracteres</p>
                        {charCount.status === 'warning' && <p className="text-xs text-amber-600 font-medium">⚠️ Aproximando do limite</p>}
                        {charCount.status === 'error' && (
                          <p className="text-xs text-red-600 font-medium" aria-live="assertive">❌ Limite excedido</p>
                        )}
                      </div>
                    </div>

                    {/* LGPD Consent Checkbox */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="lgpd-consent"
                        checked={consentChecked}
                        onChange={(e) => setConsentChecked(e.target.checked)}
                        className="mt-1 w-5 h-5 text-audit-gold bg-slate-100 border-slate-300 rounded cursor-pointer focus:ring-audit-gold"
                        aria-required="true"
                        required
                        disabled={sugStatus === 'loading' || sugStatus === 'sent'}
                      />
                      <label htmlFor="lgpd-consent" className="text-sm text-slate-700 cursor-pointer flex-1">
                        {data.lgpd.consentText}{' '}
                        <Link to={data.seo.privacyPolicyUrl} className="text-audit-gold hover:underline font-semibold" target="_blank" rel="noopener noreferrer">
                          Política de Privacidade
                        </Link>. *
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">Seus dados serão utilizados exclusivamente para análise de melhorias da plataforma, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>

                    <button
                      type="submit"
                      disabled={sugStatus === 'loading' || sugStatus === 'sent' || !consentChecked || charCount.status === 'error'}
                      aria-disabled={sugStatus === 'loading' || sugStatus === 'sent'}
                      aria-label="Enviar sugestão"
                      className={`group relative overflow-hidden w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
                        sugStatus === 'sent'
                          ? 'bg-emerald-500 text-white cursor-default'
                          : sugStatus === 'loading'
                          ? 'bg-audit-navy/70 text-white cursor-wait'
                          : !consentChecked || charCount.status === 'error'
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-audit-navy text-white hover:bg-audit-navy/90 hover:shadow-xl hover:shadow-audit-navy/20 active:scale-95'
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {sugStatus === 'sent' && <><FaCheck className="scale-125" aria-hidden="true" /> Mensagem Entregue</>}
                        {sugStatus === 'loading' && <><FaSpinner className="animate-spin" aria-hidden="true" /> Enviando...</>}
                        {sugStatus === 'error' && <><FaTimes className="scale-125" aria-hidden="true" /> Erro ao Enviar</>}
                        {sugStatus === 'idle' && <><FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" /> Enviar Agora</>}
                      </span>
                    </button>
                  </form>
                </div>
              </section>
            </div>

            {/* COLUNA DIREITA */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Índice Desktop - agora com top dinâmico */}
              <div className="hidden lg:block">
                <div
                  className={`bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 sticky z-10 transition-all duration-500 mb-12 ${
                    isIndexVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                  style={{ top: topOffset + 32 }}
                >
                  <h3 className="text-[10px] font-black text-audit-navy uppercase tracking-[0.3em] mb-8 pb-4 border-b border-slate-100 flex items-center gap-3">
                    <span className="w-2 h-2 bg-audit-gold rounded-full"></span> Conteúdo
                  </h3>
                  <nav className="flex flex-col gap-6" aria-label="Índice da página">
                    {[
                      { label: 'A Instituição', href: 'hero', icon: 'fa-building-columns' },
                      { label: 'Nossa História', href: 'historia', icon: 'fa-history' },
                      { label: 'Missão & Visão', href: 'missao-visao', icon: 'fa-mountain-sun' },
                      { label: 'Nossos Valores', href: 'valores', icon: 'fa-award' },
                      { label: 'FAQ', href: 'faq', icon: 'fa-question-circle' },
                      { label: 'Sugestões', href: 'sugestao', icon: 'fa-handshake-angle' }
                    ].map((item) => {
                      const Icon = iconMap[item.icon];
                      return (
                        <a
                          key={item.href}
                          href={`#${item.href}`}
                          onClick={(e) => scrollToSection(e, item.href)}
                          className={`group flex items-center gap-4 text-sm font-bold transition-all ${
                            activeSection === item.href ? 'text-audit-navy translate-x-2' : 'text-slate-600 hover:text-audit-navy hover:translate-x-1'
                          }`}
                          aria-current={activeSection === item.href ? 'location' : undefined}
                        >
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            activeSection === item.href ? 'bg-audit-gold text-audit-navy shadow-lg shadow-audit-gold/20' : 'bg-slate-50 text-slate-600'
                          }`}>
                            <Icon className="text-[10px]" aria-hidden="true" />
                          </span>
                          {item.label}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Índice Mobile */}
              <div className="lg:hidden sticky top-[calc(var(--header-height)+48px)] z-20 mb-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-md">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex items-center justify-between w-full p-4 text-left"
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-menu-nav"
                  >
                    <span className="text-xs font-black text-audit-navy uppercase tracking-wider">Conteúdo</span>
                    <FaChevronDown className={`text-slate-400 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  {mobileMenuOpen && (
                    <nav className="flex flex-col gap-4 p-4 border-t border-slate-100" id="mobile-menu-nav">
                      {[
                        { label: 'A Instituição', href: 'hero' },
                        { label: 'Nossa História', href: 'historia' },
                        { label: 'Missão & Visão', href: 'missao-visao' },
                        { label: 'Nossos Valores', href: 'valores' },
                        { label: 'FAQ', href: 'faq' },
                        { label: 'Sugestões', href: 'sugestao' }
                      ].map((item) => (
                        <a
                          key={item.href}
                          href={`#${item.href}`}
                          onClick={(e) => scrollToSection(e, item.href)}
                          className="text-sm font-medium py-3 block"
                          style={{ color: activeSection === item.href ? '#C5A059' : '#475569' }}
                        >
                          {item.label}
                        </a>
                      ))}
                    </nav>
                  )}
                </div>
              </div>

              {/* Thumbnail */}
              <Suspense fallback={<div className="h-96 bg-slate-100 rounded-2xl animate-pulse"></div>}>
                <RelatorioThumbnails
                  linkTo="/relatorio-institucional"
                  imageUrl="/images/executive-team.jpg"
                  logoPath="/assets/images/logotipo-audit-educa-default.webp"
                />
              </Suspense>

              {/* Comunidade CTA */}
              <article className="bg-gradient-to-br from-[#0C1B33] to-[#0f172a] rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.1),transparent)] pointer-events-none"></div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-2xl">
                    <FaUsers className="text-3xl text-audit-gold" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-serif font-black mb-4 tracking-tight">Comunidade Global</h3>
                  <p className="text-slate-300 font-light text-sm leading-relaxed mb-8 px-2">
                    Junte-se a milhares de especialistas e eleve o seu padrão profissional.
                  </p>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => navigate('/comunidade')} className="bg-white text-[#0C1B33] font-black py-4 rounded-2xl hover:bg-audit-gold hover:text-[#0C1B33] transition-all active:scale-95 text-xs uppercase tracking-widest shadow-xl" aria-label="Acessar a comunidade global">
                      Acessar Agora
                    </button>
                    <button onClick={() => navigate('/sobre-o-criador')} className="bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all text-xs uppercase tracking-widest" aria-label="Mais detalhes sobre a comunidade">
                      Mais Detalhes
                    </button>
                  </div>
                </div>
              </article>
            </aside>
          </div>

          <section className="mt-24 pt-16 border-t border-slate-200">
            <TopicLinks />
          </section>
        </div>
      </MainLayout>

      <Toast message={toastMessage} role="status" aria-live="polite" />

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 bg-audit-gold text-audit-navy rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-audit-gold focus:ring-offset-2 ${
          showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        aria-label="Voltar ao topo"
      >
        <FaArrowUp className="text-lg" aria-hidden="true" />
      </button>
    </>
  );
}