import { Link } from 'react-router-dom';

export function GuideItem({ item }) {
  const content = (
    <div className="g-item">
      <div className="g-num">{item.num}</div>
      <div>
        <h3 className="g-ttl">{item.title}</h3>
        <div className="g-meta">
          <i className="fas fa-clock" /> {item.meta}
        </div>
      </div>
      {item.badge && (
        <span className={`g-badge badge-${item.badgeType || 'new'}`}>{item.badge}</span>
      )}
    </div>
  );

  if (item.href && item.status === 'live') {
    return <Link to={item.href}>{content}</Link>;
  }
  return content;
}
