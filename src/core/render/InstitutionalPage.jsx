import PageLayout from '../../components/PageLayout';
import equipe from '../../../content/pages/equipe.json';
import compliance from '../../../content/pages/compliance.json';
import sustentabilidade from '../../../content/pages/sustentabilidade.json';

const CONTENT_MAP = {
  'content/pages/equipe.json': equipe,
  'content/pages/compliance.json': compliance,
  'content/pages/sustentabilidade.json': sustentabilidade,
};

function ProseSection({ section }) {
  return (
    <section id={section.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
      {section.title && <h2 className="text-2xl font-serif font-bold text-audit-navy mb-4">{section.title}</h2>}
      <p className="text-slate-600 leading-relaxed">{section.body}</p>
    </section>
  );
}

function GridSection({ section }) {
  return (
    <section id={section.id} className="mb-8">
      {section.title && <h2 className="text-2xl font-serif font-bold text-audit-navy mb-6">{section.title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {section.items?.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-audit-navy mb-2">{item.title}</h3>
            <p className="text-sm text-slate-600">{item.desc}</p>
            {item.href && (
              <a href={item.href} className="text-audit-gold text-sm font-bold mt-2 inline-block">
                Saiba mais →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function renderSection(section) {
  if (section.type === 'prose') return <ProseSection key={section.id} section={section} />;
  if (section.type === 'grid') return <GridSection key={section.id} section={section} />;
  return null;
}

export default function InstitutionalPage({ contentFile }) {
  const data = CONTENT_MAP[contentFile];
  if (!data) {
    return (
      <PageLayout title="Página" breadcrumbs={[{ label: 'Home', to: '/' }]}>
        <p>Conteúdo não encontrado.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={data.title}
      breadcrumbs={data.breadcrumbs}
      themeColor={data.themeColor}
      sections={data.sections.map((s) => ({ id: s.id, label: s.title || s.id }))}
      hero={
        data.hero && (
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-4 rounded-full bg-audit-blue/10 text-audit-blue text-[10px] font-bold tracking-widest uppercase mb-4">
              {data.hero.eyebrow}
            </span>
            <h1 className="text-4xl font-serif font-bold text-audit-navy mb-4">{data.hero.title}</h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">{data.hero.subtitle}</p>
          </div>
        )
      }
    >
      {data.sections.map(renderSection)}
    </PageLayout>
  );
}
