import { Link } from 'react-router-dom';
import { thumbUrl } from '../../core/thumbnails';

export function ArticleCard({ item, layout = 'vertical' }) {
  const img = thumbUrl(item.thumbnail);
  const inner = (
    <>
      <div className={layout === 'horizontal' ? 'a-thumb' : 'av-img'}>
        <img src={img} alt={item.thumbnail?.alt || item.title} loading="lazy" />
      </div>
      <div>
        {item.tag && (
          <span className="av-tag" style={item.tagStyle}>
            {item.tag}
          </span>
        )}
        {item.category && (
          <div className={layout === 'horizontal' ? 'a-cat' : 'av-cat'} style={{ color: item.categoryColor }}>
            {item.category}
          </div>
        )}
        <h3 className={layout === 'horizontal' ? 'art-ttl' : 'av-ttl'}>{item.title}</h3>
        {(item.excerpt || item.desc) && (
          <div className={layout === 'horizontal' ? 'art-exc' : 'av-desc'}>{item.excerpt || item.desc}</div>
        )}
        {item.meta && (
          <div className={layout === 'horizontal' ? 'art-ft' : 'av-ft'}>
            {layout === 'horizontal' ? (
              <>
                <div className="art-meta">
                  <i className="fas fa-clock" /> {item.meta}
                </div>
                <span className="art-arrow">
                  Ler <i className="fas fa-arrow-right" />
                </span>
              </>
            ) : (
              <>
                <span>{item.meta}</span>
                <span>→ Ler</span>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );

  const className = layout === 'horizontal' ? 'art-h' : 'art-v';
  if (item.href && item.status === 'live') {
    return (
      <Link to={item.href} className={className}>
        {inner}
      </Link>
    );
  }
  return <article className={className}>{inner}</article>;
}
