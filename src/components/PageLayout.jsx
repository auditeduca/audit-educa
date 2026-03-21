/**
 * COMPONENTE DE LAYOUT PADRÃO PARA PÁGINAS INSTITUCIONAIS - v2.0
 * 
 * ====== O QUE ENCAPSULA ======
 * - Header com medição dinâmica de altura
 * - MeasuredDateBar sticky com cálculo de offset
 * - Breadcrumb com navegação e aria-current
 * - Grid principal 8/4 (conteúdo/sidebar)
 * - Sidebar sticky com offset calculado
 * - ShareSidebar integrado
 * - TopicLinks antes do Footer
 * - Toast notifications
 * - IntersectionObserver para scroll spy (seções)
 * 
 * ====== PROPS ACEITAS ======
 * @param {string} title - Título da página (em breadcrumb)
 * @param {Array} breadcrumbs - [{label, to}, ...] para navegação
 * @param {ReactNode} hero - Seção hero customizada (opcional)
 * @param {ReactNode} children - Conteúdo principal (coluna 8)
 * @param {ReactNode} sidebar - Conteúdo sidebar (coluna 4, opcional)
 * @param {string} bgColor - Cor de fundo, padrão 'bg-slate-50'
 * @param {string} maxWidth - Max width, padrão 'max-w-7xl'
 * @param {string} themeColor - Cor temática para highlights (audit-gold, green-500, etc)
 * @param {string} heroGradient - Gradiente do hero, ex: 'from-audit-navy to-blue-700'
 * @param {boolean} showShareSidebar - Mostrar ShareSidebar, padrão true
 * @param {boolean} showTopicLinks - Mostrar TopicLinks, padrão true
 * @param {Array} sections - [{id, label}, ...] para scroll spy automático
 * 
 * ====== EXEMPLO DE USO ======
 * <PageLayout
 *   title="Política de Privacidade"
 *   breadcrumbs={[
 *     { label: "Home", to: "/" },
 *     { label: "Institucional", to: "/institucional" },
 *     { label: "Privacidade" }
 *   ]}
 *   sections={[
 *     { id: "hero", label: "Apresentação" },
 *     { id: "coleta", label: "Coleta de Dados" },
 *     { id: "direitos", label: "Seus Direitos" }
 *   ]}
 *   themeColor="green-500"
 * >
 *   {/* Conteúdo principal */}
 *   <section id="hero">...</section>
 *   <section id="coleta">...</section>
 * </PageLayout>
 */

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MeasuredDateBar from './MeasuredDateBar';
import TopicLinks from './TopicLinks';
import ShareSidebar from './ShareSidebar';
import Toast from './ui/Toast';

export default function PageLayout({
  title,
  breadcrumbs = [],
  hero,
  children,
  sidebar,
  bgColor = 'bg-slate-50',
  maxWidth = 'max-w-7xl',
  themeColor = 'audit-gold',
  heroGradient = 'from-audit-navy to-audit-navy/80',
  showShareSidebar = true,
  showTopicLinks = true,
  sections = [],
  shareUrl,
  shareTitle
}) {
  const [toastMessage, setToastMessage] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(80);
  const [dateBarHeight, setDateBarHeight] = useState(40);
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [activeTopic, setActiveTopic] = useState(null);

  const headerRef = useRef(null);

  // Medir altura do header com ResizeObserver
  useLayoutEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight || 80);
      }
    };
    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) resizeObserver.observe(headerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Cálculos de offset para sidebar sticky
  const paddingExtraDateBar = 0;
  const totalTopOffset = headerHeight + dateBarHeight + paddingExtraDateBar;
  const contentPaddingTop = headerHeight;

  // IntersectionObserver para scroll spy automático
  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${totalTopOffset + 24}px 0px -60% 0px`,
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, totalTopOffset]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetPosition =
        element.getBoundingClientRect().top + window.pageYOffset - totalTopOffset - 24;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${bgColor}`}>
      {/* HEADER */}
      <div ref={headerRef} className="z-50 relative bg-white">
        <Header />
      </div>

      {/* DATEBAR */}
      <div
        className="sticky w-full z-40 py-4 bg-white border-b border-slate-200 transition-all duration-300"
        style={{ top: headerHeight }}
      >
        <MeasuredDateBar
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
          onHeightChange={setDateBarHeight}
        />
      </div>

      {/* MAIN CONTENT */}
      <main
        className="flex-grow pb-10 px-4 sm:px-6 transition-all duration-300"
        style={{ paddingTop: contentPaddingTop }}
      >
        <div className={`${maxWidth} mx-auto content-wrapper`}>
          
          {/* BREADCRUMB */}
          {breadcrumbs.length > 0 && (
            <nav
              className="pt-6 mb-0 no-print flex text-xs sm:text-sm font-semibold text-slate-500 tracking-normal"
              aria-label="Navegação de localização"
            >
              <ol className="flex items-center gap-3 flex-wrap">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && (
                      <li className="text-slate-300" aria-hidden="true">
                        <i className="fas fa-chevron-right text-xs"></i>
                      </li>
                    )}
                    <li>
                      {crumb.to ? (
                        <Link
                          to={crumb.to}
                          className="hover:text-audit-gold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-audit-gold/50 rounded px-1"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span
                          className="text-audit-gold font-bold"
                          aria-current="page"
                        >
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  </React.Fragment>
                ))}
              </ol>
            </nav>
          )}

          {/* HERO SECTION (OPTIONAL) */}
          {hero && <div className="mb-8">{hero}</div>}

          {/* SHARE SIDEBAR (OPCIONAL) */}
          {showShareSidebar && (
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm mb-8">
              <ShareSidebar
                title={shareTitle || title}
                url={shareUrl || (typeof window !== 'undefined' ? window.location.href : '')}
              />
            </div>
          )}

          {/* GRID PRINCIPAL 8/4 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* COLUNA ESQUERDA - CONTEÚDO PRINCIPAL */}
            <div className="lg:col-span-8 xl:col-span-8">
              {children}
            </div>

            {/* COLUNA DIREITA - SIDEBAR */}
            {(sidebar || sections.length > 0) && (
              <aside className="lg:col-span-4 xl:col-span-4 space-y-8">
                
                {/* ÍNDICE AUTOMÁTICO (se sections fornecido) */}
                {sections.length > 0 && (
                  <div
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky z-20 transition-all duration-300"
                    style={{ top: totalTopOffset + 24 }}
                    role="navigation"
                    aria-label="Índice da página"
                  >
                    <h3 className="text-xs font-black text-audit-navy uppercase tracking-[0.2em] mb-5 pb-4 border-b-2 border-slate-100 flex items-center gap-2">
                      <i className={`fas fa-list text-${themeColor}`}></i>
                      <span>Nesta Página</span>
                    </h3>
                    <nav className="flex flex-col gap-4">
                      {sections.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={(e) => scrollToSection(e, item.id)}
                          className={`text-sm font-semibold transition-all flex items-center gap-3 group focus:outline-none focus:ring-2 rounded px-2 py-1 ${
                            activeSection === item.id
                              ? 'text-audit-navy'
                              : 'text-slate-500 hover:text-audit-navy'
                          }`}
                          aria-current={activeSection === item.id ? 'location' : undefined}
                        >
                          <span
                            className={`h-1 transition-all duration-300 rounded-full ${
                              activeSection === item.id
                                ? `w-6 bg-${themeColor}`
                                : `w-0 bg-${themeColor} group-hover:w-6`
                            }`}
                          ></span>
                          {item.label}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                {/* SIDEBAR CUSTOMIZADO */}
                {sidebar && <div>{sidebar}</div>}
              </aside>
            )}
          </div>

          {/* TOPIC LINKS (OPCIONAL) */}
          {showTopicLinks && (
            <section
              className="mt-16 w-full bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm"
              aria-labelledby="related-topics"
            >
              <h2 id="related-topics" className="sr-only">
                Tópicos Relacionados
              </h2>
              <TopicLinks />
            </section>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* TOAST */}
      <Toast message={toastMessage} />
    </div>
  );
}