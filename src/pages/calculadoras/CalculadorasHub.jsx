import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ROUTE_REGISTRY } from '../../generated/routes.jsx';

export default function CalculadorasHub() {
  const calculators = ROUTE_REGISTRY.filter(
    (r) => r.status === 'live' && r.category === 'calculator' && r.path !== '/calculadoras'
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-serif font-bold text-audit-navy mb-4">Hub de Calculadoras Técnicas</h1>
        <p className="text-slate-600 mb-10 max-w-2xl">
          Ferramentas financeiras e trabalhistas validadas por schema, para estudo e simulação profissional.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((c) => (
            <Link
              key={c.path}
              to={c.path}
              className="block bg-white rounded-2xl p-6 border border-slate-200 hover:border-audit-gold transition shadow-sm"
            >
              <h2 className="font-bold text-audit-navy text-lg mb-1">{c.title}</h2>
              <span className="text-xs text-audit-gold uppercase tracking-widest">Abrir →</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
