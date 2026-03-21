import React from 'react';

const Hero = () => {
  return (
    <section className="hero-wrap">
      <div className="hero-gold-bar"></div>
      <div className="hero-grid">
        <article className="hero-lead a1">
          <div className="hero-img">
            <img
              src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=1400&auto=format&fit=crop"
              alt="IA Agêntica"
            />
            <div className="hero-overlay">
              <div className="h-cat">
                <i className="fas fa-robot"></i> IA Agêntica · Hot Topic
              </div>
              <h1 className="h-hl">
                Agentes de IA na Auditoria: da Prova de Conceito à Execução Real de Testes
              </h1>
              <div className="h-meta">
                <span>
                  <i className="fas fa-clock" style={{ color: 'var(--gold)' }}></i> 12 min
                </span>
                <span>·</span>
                <span>Audit Educa · Mar 2026</span>
              </div>
            </div>
          </div>
          <div className="hero-body">
            <div>
              <p className="hero-text">
                LLMs evoluem de assistentes passivos para agentes autônomos que executam sequências
                completas de auditoria — extração de ERP, testes substantivos e geração de papéis
                de trabalho conforme NBC TA 330.
              </p>
              <p className="hero-text">
                Este artigo analisa os frameworks mais relevantes (AutoGen, LangGraph, CrewAI) e
                seus casos de uso reais em engagements de auditoria externa e interna.
              </p>
              <span className="read-more">
                Ler artigo completo <i className="fas fa-arrow-right"></i>
              </span>
            </div>
            <div>
              <div className="key-card hidden md:block">
                <div className="key-label">
                  <i className="fas fa-bookmark"></i> Pontos-Chave
                </div>
                <ul>
                  <li>Agentes reduzem 40–60% do tempo em testes de dados</li>
                  <li>NBC TA 330 e ISA 330 já permitem uso de CAAT</li>
                  <li>Risco de "alucinação" exige supervisão humana no loop</li>
                  <li>Big 4 em rollout interno de agentes especializados</li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        <aside className="hero-stack a2">
          <article className="sec-art">
            <div className="sec-img">
              <img
                src="https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=700&auto=format&fit=crop"
                alt="IFRS S1 S2"
              />
            </div>
            <div className="sec-cat">
              <i className="fas fa-leaf"></i> IFRS S1 &amp; S2
            </div>
            <h2 className="sec-title">Relatório de Sustentabilidade: o que o Auditor Precisa Saber</h2>
            <div className="sec-meta">8 min · Contabilidade</div>
          </article>
          <article className="sec-art">
            <div className="sec-img">
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=700&auto=format&fit=crop"
                alt="NBC TA 600"
              />
            </div>
            <div className="sec-cat">
              <i className="fas fa-file-alt"></i> NBC TA 600 Rev.
            </div>
            <h2 className="sec-title">Nova NBC TA 600: Auditoria de Grupos — Mudanças Críticas</h2>
            <div className="sec-meta">6 min · Auditoria Externa</div>
          </article>
          <article className="sec-art">
            <div className="sec-img">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=700&auto=format&fit=crop"
                alt="Perícia"
              />
            </div>
            <div className="sec-cat">
              <i className="fas fa-gavel"></i> Perícia Contábil
            </div>
            <h2 className="sec-title">Laudo Pericial com Uso de Dados: NBC PP 01 e o Perito Digital</h2>
            <div className="sec-meta">10 min · Perícia</div>
          </article>
        </aside>
      </div>
    </section>
  );
};

export default Hero;