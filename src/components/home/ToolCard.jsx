import { Link } from 'react-router-dom';
import { thumbUrl } from '../../core/thumbnails';

export function ToolCard({ item }) {
  const img = thumbUrl(item.thumbnail);
  const card = (
    <div className="tool-card">
      <div className="t-preview">
        <img src={img} alt={item.title} loading="lazy" />
        <div className="t-prev-overlay">
          <span className="t-prev-cat">
            <i className={`fas ${item.icon}`} /> Ferramenta
          </span>
        </div>
      </div>
      <div className="t-info">
        <h3 className="tool-name">{item.title}</h3>
        <div className="tool-desc">Automatize cálculos e exporte documentação alinhada à {item.desc}.</div>
        <div className="tool-norms">
          <span className="tool-norm">{item.norm}</span>
        </div>
      </div>
    </div>
  );

  if (item.href && item.status === 'live') {
    return <Link to={item.href}>{card}</Link>;
  }
  return card;
}
