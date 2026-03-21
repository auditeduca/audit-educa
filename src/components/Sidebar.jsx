import React, { useState } from 'react';

const Sidebar = () => {
  const [sugText, setSugText] = useState('');
  const [sugStatus, setSugStatus] = useState('idle');

  const handleSendSug = () => {
    if (!sugText.trim()) {
      alert('Por favor, escreva sua sugestão antes de enviar.');
      return;
    }
    setSugStatus('sent');
    setSugText('');
    setTimeout(() => setSugStatus('idle'), 4000);
  };

  return (
    <aside className="sidebar">
      {/* Caixa Sugestões */}
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
            <div style={{ marginTop: '.6rem', fontSize: '.7rem', color: 'var(--green)', fontWeight: 600, textAlign: 'center' }}>
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
            <div className="mi-sub" style={{ color: 'var(--red)' }}><i className="fas fa-caret-up"></i> +0.12 pp</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;