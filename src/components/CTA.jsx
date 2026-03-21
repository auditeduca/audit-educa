import React from 'react';

const CTA = () => {
  return (
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
  );
};

export default CTA;