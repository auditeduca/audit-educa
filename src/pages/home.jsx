import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import DateBar from '../components/DateBar';
import Hero from '../components/Hero';
import TopicFilter from '../components/TopicFilter';
import Footer from '../components/Footer';
import { HomeSectionHeader } from '../components/home/HomeSectionHeader';
import { ArticleCard } from '../components/home/ArticleCard';
import { ToolCard } from '../components/home/ToolCard';
import { GuideItem } from '../components/home/GuideItem';
import { CtaBanner } from '../components/home/CtaBanner';
import homeContent from '../../content/pages/home.json';

const Home = () => {
  const [activeTopic, setActiveTopic] = useState('all');
  const [sugText, setSugText] = useState('');
  const [sugStatus, setSugStatus] = useState('idle');
  const appRef = useRef(null);
  const headerRef = useRef(null);
  const dateBarRef = useRef(null);
  const [contentPadding, setContentPadding] = useState(0);

  useEffect(() => {
    const updatePadding = () => {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const dateBarHeight = dateBarRef.current?.offsetHeight || 0;
      const reducaoDeEspaco = 50;
      let totalPadding = headerHeight + dateBarHeight - reducaoDeEspaco;
      if (totalPadding < 0) totalPadding = 0;
      setContentPadding(totalPadding);
    };
    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  useEffect(() => {
    if ('IntersectionObserver' in window && appRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });

      const elements = appRef.current.querySelectorAll('.art-v, .tool-card, .g-item, .ad-adsense, .market-indices');
      elements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(14px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
      });
      return () => observer.disconnect();
    }
  }, [activeTopic]);

  const handleSendSug = () => {
    if (!sugText.trim()) {
      alert('Por favor, escreva sua sugestão antes de enviar.');
      return;
    }
    setSugStatus('sent');
    setSugText('');
    setTimeout(() => setSugStatus('idle'), 4000);
  };

  const isVisible = (topic) => activeTopic === 'all' || activeTopic === topic;

  const renderSection = (section) => {
    if (!isVisible(section.topic)) return null;

    if (section.type === 'articles') {
      const horizontal = section.items.filter((i) => i.layout === 'horizontal');
      const vertical = section.items.filter((i) => i.layout !== 'horizontal');
      return (
        <section key={section.id} className="a2" style={{ marginBottom: '3.25rem' }}>
          <HomeSectionHeader
            eyebrow={section.eyebrow}
            icon={section.icon}
            title={section.title}
            seeAllHref="/busca-e-conteudo"
          />
          {horizontal.map((item, idx) => (
            <ArticleCard key={idx} item={item} layout="horizontal" />
          ))}
          {vertical.length > 0 && (
            <div className="vgrid" style={{ marginTop: '1.375rem' }}>
              {vertical.map((item, idx) => (
                <ArticleCard key={idx} item={item} layout="vertical" />
              ))}
            </div>
          )}
        </section>
      );
    }

    if (section.type === 'tools') {
      return (
        <section key={section.id} className="a3" style={{ marginBottom: '3.25rem' }}>
          <HomeSectionHeader
            eyebrow={section.eyebrow}
            icon={section.icon}
            title={section.title}
            seeAllHref={section.seeAllHref}
          />
          <div className="tools-grid">
            {section.items.map((item, idx) => (
              <ToolCard key={idx} item={item} />
            ))}
          </div>
        </section>
      );
    }

    if (section.type === 'guides') {
      return (
        <section key={section.id} className="a4" style={{ marginBottom: '3.25rem' }}>
          <HomeSectionHeader
            eyebrow={section.eyebrow}
            icon={section.icon}
            title={section.title}
            seeAllHref={section.seeAllHref}
          />
          <div className="guide-list">
            {section.items.map((item, idx) => (
              <GuideItem key={idx} item={item} />
            ))}
          </div>
        </section>
      );
    }

    return null;
  };

  const { sidebar, cta } = homeContent;

  return (
    <div ref={appRef} className="flex flex-col min-h-screen">
      <Header ref={headerRef} />
      <div className="content-wrapper flex-grow">
        <DateBar ref={dateBarRef} activeTopic={activeTopic} setActiveTopic={setActiveTopic} />
        <div style={{ paddingTop: contentPadding }}>
          <Hero />
          <TopicFilter activeTopic={activeTopic} setActiveTopic={setActiveTopic} />

          <main className="main-wrap">
            <div>
              {homeContent.sections.map(renderSection)}

              <div className="ad-adsense">
                <span className="ad-label-tag">Publicidade</span>
                <i className="fas fa-ad" />
                <p>Espaço Google AdSense (In-Feed)</p>
              </div>
            </div>

            <aside className="sidebar">
              <div className="sw sug-box">
                <div className="sw-head" style={{ paddingLeft: 0, paddingTop: 0, border: 'none', marginBottom: '.5rem' }}>
                  <span className="sw-title"><i className="fas fa-lightbulb" /> Envie sua Sugestão</span>
                </div>
                <p className="sug-desc">Sentiu falta de algum artigo, calculadora ou guia? Compartilhe connosco de forma 100% segura.</p>
                <textarea
                  className="sug-textarea"
                  placeholder="Escreva sua ideia aqui..."
                  rows="3"
                  value={sugText}
                  onChange={(e) => setSugText(e.target.value)}
                />
                <button type="button" className="sug-btn" onClick={handleSendSug}>
                  <i className="fas fa-paper-plane" style={{ marginRight: '.4rem' }} />Enviar Sugestão
                </button>
                {sugStatus === 'sent' && (
                  <div style={{ marginTop: '.6rem', fontSize: '.7rem', color: 'var(--green)', fontWeight: 600, textAlign: 'center' }}>
                    Recebemos a sua sugestão. Muito obrigado!
                  </div>
                )}
              </div>

              <div className="ad-adsense sidebar-ad">
                <span className="ad-label-tag">Publicidade</span>
                <i className="fas fa-ad" />
                <p>Espaço Google AdSense</p>
              </div>

              <div className="sw">
                <div className="sw-head">
                  <span className="sw-title"><i className="fas fa-fire" /> Em Alta Agora</span>
                </div>
                <div className="trend-list">
                  {sidebar.trends.map((t, i) => (
                    <div key={i} className="trend-item">
                      <div className="t-num">{i + 1}</div>
                      <div>
                        <div className="t-ttl">{t.title}</div>
                        <div className="t-sub">{t.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sw">
                <div className="sw-head">
                  <span className="sw-title"><i className="fas fa-chart-pie" /> Mercado &amp; Índices</span>
                </div>
                <div className="market-indices">
                  {sidebar.market.map((m, i) => (
                    <div key={i} className="mi-box">
                      <div className="mi-lbl">{m.label}</div>
                      <div className="mi-val">{m.value}</div>
                      <div className={`mi-sub ${m.direction === 'down' ? 'text-rose-600' : ''}`} style={m.direction === 'up' ? { color: 'var(--red)' } : {}}>
                        <i className={`fas fa-caret-${m.direction === 'down' ? 'down' : 'up'}`} /> {m.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </main>

          <CtaBanner cta={cta} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
