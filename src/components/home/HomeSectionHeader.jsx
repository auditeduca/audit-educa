import { Link } from 'react-router-dom';

export function HomeSectionHeader({ eyebrow, icon, title, seeAllHref }) {
  return (
    <div className="sec-hd">
      <div className="sec-hd-l">
        <span className="sec-eye">
          {icon && <i className={`fas ${icon}`} />} {eyebrow}
        </span>
        <h2 className="sec-ttl">{title}</h2>
      </div>
      {seeAllHref ? (
        <Link to={seeAllHref} className="see-all">
          Ver todos <i className="fas fa-arrow-right" />
        </Link>
      ) : (
        <span className="see-all">
          Ver todos <i className="fas fa-arrow-right" />
        </span>
      )}
    </div>
  );
}
