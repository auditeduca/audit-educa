// src/pages/mapa-do-site.jsx
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/ui/Toast';
import { ROUTE_REGISTRY } from '../generated/routes.jsx';

const PILLAR_MAP = {
  institutional: { title: 'Institucional', icon: 'fa-building', color: 'text-audit-gold' },
  esg: { title: 'Sustentabilidade Digital (ESG)', icon: 'fa-leaf', color: 'text-green-600' },
  legal: { title: 'Transparência e Legal', icon: 'fa-shield-alt', color: 'text-slate-400' },
  calculator: { title: 'Calculadoras', icon: 'fa-calculator', color: 'text-audit-blue' },
  tool: { title: 'Ferramentas e Educação', icon: 'fa-tools', color: 'text-audit-blue' },
  education: { title: 'Educação', icon: 'fa-graduation-cap', color: 'text-purple-600' },
  home: { title: 'Principal', icon: 'fa-home', color: 'text-audit-navy' },
};

export default function MapaDoSite() {
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const pillars = useMemo(() => {
    const live = ROUTE_REGISTRY.filter((r) => r.status === 'live');
    const groups = {};
    live.forEach((r) => {
      const cat = r.category || 'institutional';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(r);
    });
    return groups;
  }, []);

  const liveCount = ROUTE_REGISTRY.filter((r) => r.status === 'live').length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <aside className="sidebar-left-tools no-print" aria-label="Ferramentas Laterais">
        <Link to="/" className="tool-btn" title="Início"><i className="fas fa-home"></i></Link>
        <Link to="/sobre-nos" className="tool-btn" title="Institucional"><i className="fas fa-building"></i></Link>
        <button type="button" onClick={() => showToast('Índice Sincronizado')} className="tool-btn" title="Sincronizar">
          <i className="fas fa-sync-alt text-audit-blue"></i>
        </button>
      </aside>

      <main className="flex-grow pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto content-wrapper">
          <nav className="mb-12 no-print text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <ol className="flex items-center gap-2">
              <li><Link to="/" className="hover:text-audit-gold transition">Início</Link></li>
              <li><i className="fas fa-chevron-right text-[8px]"></i></li>
              <li className="text-audit-blue underline underline-offset-4">Mapa do Site</li>
            </ol>
          </nav>

          <div className="text-center mb-20">
            <span className="inline-block py-1 px-4 rounded-full bg-audit-blue/10 text-audit-blue text-[10px] font-bold tracking-[0.2em] uppercase mb-6 border border-audit-blue/20">
              Navegação Estruturada
            </span>
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-audit-navy leading-tight mb-6">
              Índice Geral e <span className="text-audit-blue">Mapa do Site</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed">
              Diretório gerado dinamicamente a partir do registry de rotas — {liveCount} páginas ativas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-12">
              <section className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-serif font-bold text-audit-navy mb-6">Arquitetura da Informação</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Este mapa reflete automaticamente o arquivo <code className="text-xs bg-slate-100 px-1 rounded">content/registry/routes.json</code>.
                  Rotas arquivadas (ferramentas de auditoria) não aparecem aqui.
                </p>
              </section>

              <div id="dynamic-sitemap" className="space-y-12">
                {Object.entries(pillars).map(([category, routes]) => {
                  const meta = PILLAR_MAP[category] || { title: category, icon: 'fa-link', color: 'text-slate-500' };
                  return (
                    <div key={category} className="sitemap-group">
                      <h3 className="sitemap-title">
                        <i className={`fas ${meta.icon} ${meta.color} text-sm`} /> {meta.title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        {routes.map((r) => (
                          <Link key={r.path} to={r.path} className="sitemap-link">
                            {r.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <section className="pt-8">
                <h2 className="text-2xl font-serif font-bold text-audit-navy mb-8">Métricas da Plataforma</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="stat-card">
                    <div className="text-2xl font-bold text-audit-blue mb-1">{liveCount}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Páginas Ativas</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-2xl font-bold text-audit-gold mb-1">100%</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Schema-validated</div>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm sticky top-24">
                <Link to="/calculadoras" className="block w-full p-3 bg-audit-gold text-audit-navy font-bold text-center text-[10px] uppercase tracking-widest rounded-lg hover:bg-yellow-500 transition shadow-lg mb-4">
                  Calculadoras
                </Link>
                <Link to="/fale-conosco" className="block w-full p-3 border border-slate-200 text-center text-[10px] uppercase tracking-widest rounded-lg hover:bg-slate-50">
                  Fale Conosco
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
