import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import DateBar from '../components/DateBar';
import Hero from '../components/Hero';
import TopicFilter from '../components/TopicFilter';
import Footer from '../components/Footer';

const Home = () => {
  const [activeTopic, setActiveTopic] = useState('all');
  const [sugText, setSugText] = useState('');
  const [sugStatus, setSugStatus] = useState('idle');
  const appRef = useRef(null);

  // Refs para medição
  const headerRef = useRef(null);
  const dateBarRef = useRef(null);
  const [contentPadding, setContentPadding] = useState(0);

  useEffect(() => {
    const updatePadding = () => {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const dateBarHeight = dateBarRef.current?.offsetHeight || 0;
      
      // 💡 AJUSTE AQUI: Valor em pixels para reduzir o espaço entre a DateBar e o Conteúdo.
      // Se o espaço ainda estiver grande, aumente este valor (ex: 60, 80).
      // Se ficar muito colado, diminua o valor (ex: 20, 0).
      const reducaoDeEspaco = 50; 

      // Se o DateBar NÃO for 'position: fixed' no CSS, você pode até remover 'dateBarHeight' da soma abaixo.
      let totalPadding = (headerHeight + dateBarHeight) - reducaoDeEspaco;
      
      // Prevenção de segurança: garante que o padding nunca fique negativo quebrando o layout
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
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });

      const elements = appRef.current.querySelectorAll('.art-v, .tool-card, .g-item, .ad-adsense, .market-indices');
      elements.forEach(el => {
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

  return (
    <div ref={appRef} className="flex flex-col min-h-screen">
      <Header ref={headerRef} />
      <div className="content-wrapper flex-grow">
        <DateBar ref={dateBarRef} activeTopic={activeTopic} setActiveTopic={setActiveTopic} />

        {/* Área com padding dinâmico ajustado */}
        <div style={{ paddingTop: contentPadding }}>
          <Hero />
          <TopicFilter activeTopic={activeTopic} setActiveTopic={setActiveTopic} />

          <main className="main-wrap">
            <div>
              {isVisible('interna') && (
                <section className="a2" style={{ marginBottom: '3.25rem' }}>
                  <div className="sec-hd">
                    <div className="sec-hd-l">
                      <span className="sec-eye"><i className="fas fa-shield-alt"></i> Hot Topic</span>
                      <h2 className="sec-ttl">Auditoria Interna</h2>
                    </div>
                    <span className="see-all">Ver todos <i className="fas fa-arrow-right"></i></span>
                  </div>

                  <article className="art-h">
                    <div className="a-thumb">
                      <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop" alt="IPPF" loading="lazy" />
                    </div>
                    <div>
                      <div className="a-cat" style={{ color: '#1D4ED8' }}>IPPF 2024 · IIA Global</div>
                      <h3 className="art-ttl">IPPF Atualizado: as Novas Exigências de Competência</h3>
                      <div className="art-exc">O IPPF revisado em 2024 eleva o padrão de competências técnicas e comportamentais.</div>
                      <div className="art-ft">
                        <div className="art-meta"><i className="fas fa-clock"></i> 9 min · Mar 2026</div>
                        <span className="art-arrow">Ler <i className="fas fa-arrow-right"></i></span>
                      </div>
                    </div>
                  </article>

                  <article className="art-h">
                    <div className="a-thumb">
                      <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" alt="BI" loading="lazy" />
                    </div>
                    <div>
                      <div className="a-cat" style={{ color: '#065F46' }}>Auditoria Contínua · Data Analytics</div>
                      <h3 className="art-ttl">Auditoria Contínua com Power BI e Python</h3>
                      <div className="art-exc">Como estruturar monitoramento contínuo integrando Power BI, scripts Python e APIs de ERP.</div>
                      <div className="art-ft">
                        <div className="art-meta"><i className="fas fa-clock"></i> 15 min · Fev 2026</div>
                        <span className="art-arrow">Ler <i className="fas fa-arrow-right"></i></span>
                      </div>
                    </div>
                  </article>
                </section>
              )}

              <div className="ad-adsense">
                <span className="ad-label-tag">Publicidade</span>
                <i className="fas fa-ad"></i>
                <p>Espaço Google AdSense (In-Feed)</p>
              </div>

              {isVisible('ia') && (
                <section className="a3" style={{ marginBottom: '3.25rem' }}>
                  <div className="sec-hd" style={{ borderBottomColor: '#7C3AED' }}>
                    <div className="sec-hd-l">
                      <span className="sec-eye" style={{ color: '#7C3AED' }}><i className="fas fa-robot"></i> Em Alta</span>
                      <h2 className="sec-ttl">IA Agêntica &amp; Contabilidade</h2>
                    </div>
                    <span className="see-all">Ver todos <i className="fas fa-arrow-right"></i></span>
                  </div>

                  <article className="ai-spot">
                    <div className="ai-spot-img">
                      <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop" alt="IA e Auditoria" loading="lazy" />
                      <div className="ai-spot-overlay">
                        <div className="ai-badge"><i className="fas fa-microchip"></i> IA Agêntica · Exclusivo</div>
                        <h3 className="ai-hl">Como Agentes LLM Estão Revolucionando a Revisão de Contratos (IFRS 16)</h3>
                        <div className="ai-sub hidden md:block">Da extração automática de cláusulas à geração do cronograma de amortização — sem intervenção humana.</div>
                      </div>
                    </div>
                    <div className="ai-body">
                      <p className="ai-body-text">Agentes LLM processam centenas de contratos PDF, extraem automaticamente taxa, prazo e índice, e alimentam o cálculo do passivo de arrendamento conforme IFRS 16 / CPC 06(R2).</p>
                      <div className="ai-tags">
                        <span className="ai-tag">IFRS 16</span><span className="ai-tag">LangGraph</span><span className="ai-tag">GPT-4o</span>
                      </div>
                      <span className="ai-cta">Ler artigo completo <i className="fas fa-arrow-right"></i></span>
                    </div>
                  </article>

                  <div className="vgrid" style={{ marginTop: '1.375rem' }}>
                    <article className="art-v">
                      <div className="av-img"><img src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=600&auto=format&fit=crop" alt="NLP" loading="lazy" /></div>
                      <span className="av-tag" style={{ background: 'rgba(124,58,237,.1)', color: '#7C3AED' }}>IA · NLP</span>
                      <div className="av-cat" style={{ color: '#7C3AED' }}>NBC TA 265</div>
                      <h3 className="av-ttl">NLP para Detecção Automática de Deficiências</h3>
                      <div className="av-desc">Classificadores treinados em relatórios identificam padrões de deficiências.</div>
                      <div className="av-ft"><span>7 min</span><span>→ Ler</span></div>
                    </article>
                    <article className="art-v">
                      <div className="av-img"><img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop" alt="Python" loading="lazy" /></div>
                      <span className="av-tag" style={{ background: 'rgba(4,120,87,.1)', color: '#065F46' }}>Python · ECL</span>
                      <div className="av-cat" style={{ color: '#065F46' }}>IFRS 9</div>
                      <h3 className="av-ttl">Calculando a PECLD com Script Python</h3>
                      <div className="av-desc">Implementação completa do modelo ECL com estimativas PD e LGD.</div>
                      <div className="av-ft"><span>10 min</span><span>→ Ler</span></div>
                    </article>
                    <article className="art-v hidden md:block">
                      <div className="av-img"><img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop" alt="Regulação" loading="lazy" /></div>
                      <span className="av-tag" style={{ background: 'rgba(29,78,216,.1)', color: '#1D4ED8' }}>IA · Regulação</span>
                      <div className="av-cat" style={{ color: '#1D4ED8' }}>CVM · IASB</div>
                      <h3 className="av-ttl">O que Reguladores Dizem sobre IA</h3>
                      <div className="av-desc">Análise comparada das posições regulatórias sobre uso de IA.</div>
                      <div className="av-ft"><span>8 min</span><span>→ Ler</span></div>
                    </article>
                  </div>
                </section>
              )}

              {isVisible('ferramentas') && (
                <section className="a3" style={{ marginBottom: '3.25rem' }}>
                  <div className="sec-hd">
                    <div className="sec-hd-l">
                      <span className="sec-eye"><i className="fas fa-tools"></i> Plataforma SGG</span>
                      <h2 className="sec-ttl">Ferramentas em Destaque</h2>
                    </div>
                    <span className="see-all">Ver todas <i className="fas fa-arrow-right"></i></span>
                  </div>
                  <div className="tools-grid">
                    {[
                      { title: "Gerador de Cartas de Circularização Bancária", desc: "NBC TA 505", icon: "fa-envelope", img: "1611974789855-9c2a0a7236a3" },
                      { title: "Calculadora IFRS 16 — Passivo e ROU", desc: "CPC 06(R2)", icon: "fa-building", img: "1486406146926-c627a92ad1ab" },
                      { title: "Teste de Auditoria — PECLD e Aging", desc: "IFRS 9", icon: "fa-chart-bar", img: "1543286386-713bdd548da4" },
                      { title: "Painel de Indicadores Financeiros", desc: "NBC TA 520", icon: "fa-chart-line", img: "1460925895917-afdab827c52f" }
                    ].map((tool, idx) => (
                      <div key={idx} className="tool-card">
                        <div className="t-preview">
                          <img src={`https://images.unsplash.com/photo-${tool.img}?q=80&w=800&auto=format&fit=crop`} alt="Tool" loading="lazy" />
                          <div className="t-prev-overlay"><span className="t-prev-cat"><i className={`fas ${tool.icon}`}></i> Ferramenta</span></div>
                        </div>
                        <div className="t-info">
                          <h3 className="tool-name">{tool.title}</h3>
                          <div className="tool-desc">Automatize cálculos e exporte documentação alinhada à {tool.desc}.</div>
                          <div className="tool-norms"><span className="tool-norm">{tool.desc}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {isVisible('guias') && (
                <section className="a4" style={{ marginBottom: '3.25rem' }}>
                  <div className="sec-hd">
                    <div className="sec-hd-l">
                      <span className="sec-eye"><i className="fas fa-graduation-cap"></i> Certificações &amp; Qualificação</span>
                      <h2 className="sec-ttl">Guias de Estudo</h2>
                    </div>
                    <span className="see-all">Ver todos <i className="fas fa-arrow-right"></i></span>
                  </div>
                  <div className="guide-list">
                    <div className="g-item">
                      <div className="g-num">01</div>
                      <div>
                        <h3 className="g-ttl">Guia Completo QTG — Qualificação Técnica</h3>
                        <div className="g-meta"><i className="fas fa-clock"></i> 6h estimado <i className="fas fa-tag"></i> CNAI · CFC</div>
                      </div>
                      <span className="g-badge badge-key">Essencial</span>
                    </div>
                    <div className="g-item">
                      <div className="g-num">02</div>
                      <div>
                        <h3 className="g-ttl">Exame de Suficiência CFC — Acervo 2017–2025</h3>
                        <div className="g-meta"><i className="fas fa-clock"></i> 4h estimado <i className="fas fa-tag"></i> CRC · NBC</div>
                      </div>
                      <span className="g-badge badge-new">Novo</span>
                    </div>
                  </div>
                </section>
              )}
            </div>

            <aside className="sidebar">
              <div className="sw sug-box">
                <div className="sw-head" style={{ paddingLeft: 0, paddingTop: 0, border: 'none', marginBottom: '.5rem' }}>
                  <span className="sw-title"><i className="fas fa-lightbulb"></i> Envie sua Sugestão</span>
                </div>
                <div>
                  <p className="sug-desc">Sentiu falta de algum artigo, calculadora ou guia? Compartilhe connosco de forma 100% segura.</p>
                  <textarea
                    className="sug-textarea"
                    placeholder="Escreva sua ideia aqui..."
                    rows="3"
                    value={sugText}
                    onChange={(e) => setSugText(e.target.value)}
                  />
                  <button className="sug-btn" onClick={handleSendSug}>
                    <i className="fas fa-paper-plane" style={{ marginRight: '.4rem' }}></i>Enviar Sugestão
                  </button>
                  {sugStatus === 'sent' && (
                    <div style={{ marginTop:'.6rem', fontSize:'.7rem', color:'var(--green)', fontWeight:600, textAlign:'center' }}>
                      Recebemos a sua sugestão. Muito obrigado!
                    </div>
                  )}
                </div>
              </div>

              <div className="ad-adsense sidebar-ad">
                <span className="ad-label-tag">Publicidade</span>
                <i className="fas fa-ad"></i>
                <p>Espaço Google AdSense</p>
              </div>

              <div className="sw">
                <div className="sw-head">
                  <span className="sw-title"><i className="fas fa-fire"></i> Em Alta Agora</span>
                </div>
                <div className="trend-list">
                  {[
                    { title: 'IA Agêntica em Auditoria', sub: 'NBC TA 330' },
                    { title: 'NBC TA 600 Revisada', sub: 'Auditoria de Grupos' },
                    { title: 'IFRS S1 & S2 — ESG', sub: 'Sustentabilidade' }
                  ].map((t, i) => (
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
                  <span className="sw-title"><i className="fas fa-chart-pie"></i> Mercado &amp; Índices</span>
                </div>
                <div className="market-indices">
                  <div className="mi-box">
                    <div className="mi-lbl">Taxa Selic</div>
                    <div className="mi-val">10.75%</div>
                    <div className="mi-sub text-rose-600"><i className="fas fa-caret-down"></i> -0.50 pp</div>
                  </div>
                  <div className="mi-box">
                    <div className="mi-lbl">IPCA (12m)</div>
                    <div className="mi-val">4.52%</div>
                    <div className="mi-sub" style={{color:'var(--red)'}}><i className="fas fa-caret-up"></i> +0.12 pp</div>
                  </div>
                </div>
              </div>
            </aside>
          </main>

          <section className="cta-wrapper">
            <div className="cta-card">
              <span className="cta-eye">Auditoria Descomplicada</span>
              <h2 className="cta-ttl">Plataforma Aberta e Ferramentas Gratuitas!</h2>
              <p className="cta-sub">O esforço técnico gerou resultados. Ferramentas sem cadastro, baseadas em normas reais para facilitar o dia a dia.</p>
              <div className="cta-btns">
                <button className="btn-gold"><i className="fas fa-share-alt"></i> Explorar Ferramentas</button>
                <button className="btn-ghost">Biblioteca Técnica</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;