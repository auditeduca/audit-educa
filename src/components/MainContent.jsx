/** @deprecated Use home.jsx with content/pages/home.json */
import React from 'react';
import Sidebar from './Sidebar';

const MainContent = ({ activeTopic, isVisible }) => {
  return (
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
              <div className="a-thumb"><img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop" alt="IPPF" loading="lazy" /></div>
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
              <div className="a-thumb"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" alt="BI" loading="lazy" /></div>
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

      <Sidebar />
    </main>
  );
};

export default MainContent;