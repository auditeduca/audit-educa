import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ROUTE_REGISTRY } from '../../generated/routes.jsx';

export default function FerramentasHub() {
  const tools = ROUTE_REGISTRY.filter(
    (r) => r.status === 'live' && (r.category === 'tool' || r.category === 'calculator' || r.category === 'education')
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-serif font-bold text-audit-navy mb-4">Ferramentas e Recursos</h1>
        <p className="text-slate-600 mb-10">Calculadoras, simuladores, templates e conteúdos educacionais disponíveis na plataforma.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {tools.map((t) => (
            <Link
              key={t.path}
              to={t.path}
              className="block bg-white rounded-2xl p-6 border border-slate-200 hover:border-audit-gold transition"
            >
              <span className="text-[10px] uppercase tracking-widest text-slate-400">{t.category}</span>
              <h2 className="font-bold text-audit-navy">{t.title}</h2>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
