// src/pages/mapa-do-site.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/ui/Toast';

export default function MapaDoSite() {
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      {/* Sidebar esquerda (ferramentas) - CORREÇÃO: nomes acessíveis */}
      <aside className="sidebar-left-tools no-print" aria-label="Ferramentas Laterais">
        <Link to="/" className="tool-btn" aria-label="Início">
          <i className="fas fa-home"></i>
        </Link>
        <Link to="/institucional" className="tool-btn" aria-label="Institucional">
          <i className="fas fa-building"></i>
        </Link>
        <button 
          onClick={() => showToast('Índice Sincronizado')} 
          className="tool-btn" 
          aria-label="Sincronizar índice"
        >
          <i className="fas fa-sync-alt text-audit-blue"></i>
        </button>
      </aside>

      <main className="flex-grow pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto content-wrapper">
          {/* Breadcrumb - CORREÇÃO: contraste de cor */}
          <nav className="mb-12 no-print text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <ol className="flex items-center gap-2">
              <li><Link to="/" className="hover:text-audit-gold transition">Início</Link></li>
              <li><i className="fas fa-chevron-right text-[8px]"></i></li>
              <li className="text-audit-blue underline underline-offset-4">Mapa do Site</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="text-center mb-20">
            <span className="inline-block py-1 px-4 rounded-full bg-audit-blue/10 text-audit-blue text-[10px] font-bold tracking-[0.2em] uppercase mb-6 border border-audit-blue/20">
              Navegação Estruturada
            </span>
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-audit-navy leading-tight mb-6">
              Índice Geral e <span className="text-audit-blue">Mapa do Site</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed">
              Bem-vindo ao diretório centralizado do AuditEduca. Esta página reflete a arquitetura dinâmica da nossa plataforma, garantindo transparência e facilidade de acesso a todo o conhecimento disponível.
            </p>
          </div>

          {/* GRID PRINCIPAL (8/4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* CONTEÚDO (8 Colunas) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Arquitetura Section */}
              <section className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute -right-10 -top-10 opacity-5">
                  <i className="fas fa-sitemap text-9xl"></i>
                </div>
                <h2 className="text-2xl font-serif font-bold text-audit-navy mb-6">Arquitetura da Informação</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Para garantir a máxima eficiência, este mapa é gerado dinamicamente. Ele reflete a estrutura hierárquica dividida em nossos pilares estratégicos: <strong>Institucional</strong>, <strong>Técnico</strong>, <strong>Legal</strong> e <strong>Sustentabilidade</strong>.
                </p>
              </section>

              {/* Sitemap List */}
              <div id="dynamic-sitemap" className="space-y-12">
                {/* Pillar: Institucional */}
                <div className="sitemap-group">
                  <h3 className="sitemap-title"><i className="fas fa-building text-audit-gold text-sm"></i> Institucional</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <Link to="/" className="sitemap-link">Início / Home</Link>
                    <Link to="/institucional" className="sitemap-link">Sobre o AuditEduca</Link>
                    <Link to="/equipe" className="sitemap-link">Corpo Técnico e Consultores</Link>
                    <Link to="/missao-valores" className="sitemap-link">Missão, Visão e Valores</Link>
                    <Link to="/fale-conosco" className="sitemap-link">Canais de Atendimento</Link>
                  </div>
                </div>

                {/* Pillar: Sustentabilidade (ESG) */}
                <div className="sitemap-group">
                  <h3 className="sitemap-title"><i className="fas fa-leaf text-green-600 text-sm"></i> Sustentabilidade Digital (ESG)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <Link to="/tecnologia-verde" className="sitemap-link">Arquitetura Tecnologia Verde</Link>
                    <Link to="/pegada-de-carbono" className="sitemap-link">Nossa Pegada de Carbono</Link>
                    <Link to="/relatorio-impacto" className="sitemap-link">Relatório de Impacto Digital</Link>
                    <Link to="/sustentabilidade" className="sitemap-link">Compromissos Ambientais</Link>
                  </div>
                </div>

                {/* Pillar: Recursos e Acessibilidade */}
                <div className="sitemap-group">
                  <h3 className="sitemap-title"><i className="fas fa-universal-access text-audit-blue text-sm"></i> Acessibilidade e Recursos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <Link to="/politica-de-acessibilidade" className="sitemap-link">Política de Acessibilidade</Link>
                    <Link to="/recursos-assistivos" className="sitemap-link">Guia de Recursos Assistivos</Link>
                    <Link to="/calculadoras" className="sitemap-link">Hub de Calculadoras Técnicas</Link>
                    <Link to="/ferramentas" className="sitemap-link">Ferramentas de Auditoria</Link>
                  </div>
                </div>

                {/* Pillar: Jurídico */}
                <div className="sitemap-group">
                  <h3 className="sitemap-title"><i className="fas fa-shield-alt text-slate-400 text-sm"></i> Transparência e Legal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <Link to="/privacidade" className="sitemap-link">Política de Privacidade (LGPD)</Link>
                    <Link to="/termos-de-uso" className="sitemap-link">Termos e Condições de Uso</Link>
                    <Link to="/compliance" className="sitemap-link">Programa de Compliance</Link>
                    <Link to="/mapa-do-site" className="sitemap-link font-bold text-audit-blue">Mapa do Site (Você está aqui)</Link>
                  </div>
                </div>
              </div>

              {/* Statistics Grid - CORREÇÃO: contraste de cores */}
              <section className="pt-8">
                <h2 className="text-2xl font-serif font-bold text-audit-navy mb-8">Métricas da Plataforma</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="stat-card">
                    <div className="text-2xl font-bold text-audit-blue mb-1" id="total-pages">18+</div>
                    <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Páginas Totais</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-2xl font-bold text-audit-gold-dark mb-1">100%</div>
                    <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Acessibilidade</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-2xl font-bold text-green-600 mb-1">64-bit</div>
                    <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Arquitetura</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-2xl font-bold text-purple-600 mb-1">Zero</div>
                    <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Links Quebrados</div>
                  </div>
                </div>
              </section>
            </div>

            {/* SIDEBAR (4 Colunas) - CORREÇÕES: hierarquia de títulos e contraste */}
            <div className="lg:col-span-4 space-y-8">
              {/* Search Widget */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm sticky top-24">
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                  <i className="fas fa-search text-audit-gold text-[10px]"></i>
                  <span className="text-[10px] font-bold text-audit-navy uppercase tracking-widest">Busca Rápida</span>
                </div>
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Procurar página..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-audit-blue transition"
                    aria-label="Campo de busca de páginas"
                  />
                </div>
                <nav className="space-y-4" aria-labelledby="categorias-heading">
                  <h2 id="categorias-heading" className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                    Categorias
                  </h2>
                  <a href="#" className="flex items-center justify-between text-xs text-slate-600 hover:text-audit-blue transition">
                    <span>Institucional</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full text-[9px]" aria-label="5 páginas">05</span>
                  </a>
                  <a href="#" className="flex items-center justify-between text-xs text-slate-600 hover:text-audit-blue transition">
                    <span>Sustentabilidade</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full text-[9px]" aria-label="4 páginas">04</span>
                  </a>
                  <a href="#" className="flex items-center justify-between text-xs text-slate-600 hover:text-audit-blue transition">
                    <span>Jurídico</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full text-[9px]" aria-label="3 páginas">03</span>
                  </a>
                </nav>
              </div>

              {/* CTA Sidebar - CORREÇÃO: hierarquia de títulos */}
              <div className="bg-audit-navy p-8 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition duration-500">
                  <i className="fas fa-compass text-6xl"></i>
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-audit-gold mb-4">
                  Ajuda na Navegação
                </h2>
                <p className="text-xs font-light text-slate-300 mb-6 leading-relaxed">Não encontrou o que procurava? Nosso guia de navegação assistida pode ajudar.</p>
                <Link to="/fale-conosco" className="block w-full p-3 bg-audit-gold text-audit-navy font-bold text-center text-[10px] uppercase tracking-widest rounded-lg hover:bg-yellow-500 transition shadow-lg">
                  Suporte Técnico
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <section className="mt-24 bg-gradient-to-r from-audit-blue to-audit-navy rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">Transparência em Cada Link</h2>
            <p className="text-slate-300 text-lg font-light max-w-2xl mx-auto mb-10 opacity-90 leading-relaxed">
              Nossa plataforma foi projetada para ser um ecossistema aberto e acessível. Explore nossos recursos e junte-se à nossa missão educativa.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/institucional" className="bg-white text-audit-navy px-10 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 transition shadow-xl">
                Nossa Instituição
              </Link>
              <Link to="/calculadoras" className="bg-transparent border-2 border-white/30 px-10 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition">
                Hub de Ferramentas
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <Toast message={toastMessage} />

      {/* Estilos adicionais - CORREÇÃO: adicionado tom mais escuro para o dourado */}
      <style>{`
        .sidebar-left-tools {
            position: fixed; left: 0; top: 50%; transform: translateY(-50%);
            display: flex; flex-direction: column; gap: 12px; z-index: 1000; padding: 10px 0;
        }
        .tool-btn {
            background-color: white; color: #0f172a; border: 1px solid #e2e8f0; border-left: none;
            width: 54px; height: 54px; border-radius: 0 14px 14px 0;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 4px 0 10px rgba(0, 0, 0, 0.05);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tool-btn:hover { width: 65px; background-color: #0f172a; color: #C5A059; padding-left: 5px; }

        .sitemap-group { margin-bottom: 3rem; }
        .sitemap-title { 
            font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; 
            color: #0f172a; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;
            border-bottom: 2px solid #f1f5f9; padding-bottom: 0.5rem;
        }
        .sitemap-link {
            display: block; padding: 0.5rem 0; font-size: 0.85rem; color: #64748b;
            transition: all 0.2s; border-left: 2px solid transparent; padding-left: 1rem;
        }
        .sitemap-link:hover { color: #1e40af; border-left-color: #C5A059; padding-left: 1.25rem; }

        .stat-card {
            background: white; border-radius: 1.25rem; padding: 1.5rem;
            border: 1px solid #e2e8f0; text-align: center;
            transition: transform 0.3s ease;
        }
        .stat-card:hover { transform: translateY(-5px); border-color: #1e40af; }

        /* CORREÇÃO: contraste para o texto dourado de 100% */
        .text-audit-gold-dark {
            color: #937b38 !important;
        }

        @media (max-width: 768px) {
            .sidebar-left-tools { display: none; }
        }
      `}</style>
    </div>
  );
}
