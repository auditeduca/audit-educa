import { Link } from 'react-router-dom';

export function CtaBanner({ cta }) {
  if (!cta) return null;
  return (
    <section className="cta-wrapper">
      <div className="cta-card">
        <span className="cta-eye">{cta.eyebrow}</span>
        <h2 className="cta-ttl">{cta.title}</h2>
        <p className="cta-sub">{cta.subtitle}</p>
        <div className="cta-btns">
          {cta.primary?.to && (
            <Link to={cta.primary.to} className="btn-gold">
              <i className="fas fa-share-alt" /> {cta.primary.label}
            </Link>
          )}
          {cta.secondary?.to && (
            <Link to={cta.secondary.to} className="btn-ghost">
              {cta.secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
