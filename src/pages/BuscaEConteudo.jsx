// src/pages/busca.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/ui/Toast';

// Base de dados do site (consolidada)
const siteContent = [
  {
    id: 1,
    title: "Página Institucional",
    desc: "Conheça a missão, visão e o corpo docente técnico do AuditEduca, focado em excelência educacional.",
    link: "/institucional",
    tags: ["institucional", "equipe", "educacao", "transparencia"]
  },
  {
    id: 2,
    title: "Política de Acessibilidade",
    desc: "Nossas diretrizes de conformidade WCAG 2.1 nível AAA para garantir inclusão digital total.",
    link: "/politica-de-acessibilidade",
    tags: ["acessibilidade", "wcag", "compliance", "inclusao"]
  },
  {
    id: 3,
    title: "Recursos Assistivos",
    desc: "Guia prático de ferramentas, leitores de tela e configurações para navegação inclusiva.",
    link: "/recursos-assistivos",
    tags: ["acessibilidade", "ferramentas", "tutorial", "inclusao"]
  },
  {
    id: 4,
    title: "Nossa Pegada de Carbono",
    desc: "Transparência ambiental sobre o consumo de energia da nossa infraestrutura digital (Metodologia SWD).",
    link: "/pegada-de-carbono",
    tags: ["sustentabilidade", "esg", "meioambiente", "transparencia"]
  },
  {
    id: 5,
    title: "Mapa do Site",
    desc: "Índice estruturado de todas as páginas e recursos disponíveis na plataforma.",
    link: "/mapa-do-site",
    tags: ["navegacao", "estrutura", "indice"]
  },
  {
    id: 6,
    title: "Tecnologia Verde",
    desc: "Nossa arquitetura de desenvolvimento sustentável focada em baixo consumo de processamento.",
    link: "/tecnologia-verde",
    tags: ["sustentabilidade", "tecnologia", "desenvolvimento"]
  }
];

// Cores das tags por categoria
const tagColors = {
  'acessibilidade': 'bg-blue-100 text-blue-700',
  'sustentabilidade': 'bg-emerald-100 text-emerald-700',
  'transparencia': 'bg-amber-100 text-amber-700',
  'compliance': 'bg-slate-100 text-slate-700',
  'default': 'bg-slate-50 text-slate-500 border border-slate-200'
};

export default function Busca() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState(siteContent);
  const [activeFilter, setActiveFilter] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Carregar tag da URL na inicialização
  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) {
      filterByTag(tagParam);
    }
  }, []);

  // Função de filtro por tag
  const filterByTag = (tag) => {
    setSearchQuery('');
    setActiveFilter(tag);
    const filtered = siteContent.filter(item => item.tags.includes(tag));
    setFilteredResults(filtered);
    setSearchParams({ tag });
  };

  // Função de busca por texto
  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveFilter(null);
    setSearchParams({});

    if (!query.trim()) {
      setFilteredResults(siteContent);
      return;
    }

    const q = query.toLowerCase();
    const filtered = siteContent.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    );
    setFilteredResults(filtered);
  };

  // Limpar filtros
  const clearSearch = () => {
    setSearchQuery('');
    setActiveFilter(null);
    setFilteredResults(siteContent);
    setSearchParams({});
  };

  // Lista única de todas as tags
  const allTags = [...new Set(siteContent.flatMap(item => item.tags))];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      {/* Sidebar esquerda (ferramentas) */}
      <aside className="sidebar-left-tools no-print" aria-label="Ferramentas Laterais">
        <Link to="/" className="tool-btn" title="Home"><i className="fas fa-home"></i></Link>
        <Link to="/sobre-nos" className="tool-btn" title="Institucional"><i className="fas fa-building"></i></Link>
        <button onClick={clearSearch} className="tool-btn" title="Limpar">
          <i className="fas fa-eraser text-audit-blue"></i>
        </button>
      </aside>

      <main className="flex-grow pb-24">
        <div className="max-w-7xl mx-auto content-wrapper">
          {/* Breadcrumb */}
          <nav className="mb-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <ol className="flex items-center gap-2">
              <li><Link to="/" className="hover:text-audit-gold transition">Home</Link></li>
              <li><i className="fas fa-chevron-right text-[8px]"></i></li>
              <li className="text-audit-blue underline underline-offset-4">Busca de Conteúdo</li>
            </ol>
          </nav>

          {/* Hero Search */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-audit-navy mb-6">
              O que você está <span className="text-audit-blue">procurando?</span>
            </h1>
            <div className="relative max-w-2xl">
              <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Busque por termos, hashtags ou políticas..."
                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:border-audit-blue focus:ring-4 focus:ring-audit-blue/5 transition text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* ÁREA DE RESULTADOS (8 Colunas) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Filtro Ativo Header */}
              {activeFilter && (
                <div className="flex items-center justify-between border-b pb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Filtrando por: <span className="text-audit-blue">#{activeFilter}</span>
                  </span>
                  <button onClick={clearSearch} className="text-[10px] font-bold text-red-500 uppercase hover:underline">
                    Remover Filtro
                  </button>
                </div>
              )}

              {/* Container de Resultados */}
              <div className="space-y-6">
                {filteredResults.length > 0 ? (
                  filteredResults.map(item => (
                    <div key={item.id} className="result-card animate-fade-in">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif font-bold text-xl text-audit-navy">{item.title}</h3>
                          <Link to={item.link} className="text-audit-blue hover:text-audit-gold transition">
                            <i className="fas fa-external-link-alt"></i>
                          </Link>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.tags.map(tag => (
                            <button
                              key={tag}
                              onClick={() => filterByTag(tag)}
                              className={`tag-pill ${tagColors[tag] || tagColors.default}`}
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                    <i className="fas fa-search text-slate-200 text-5xl mb-4"></i>
                    <h3 className="font-bold text-audit-navy">Nenhum resultado encontrado</h3>
                    <p className="text-xs text-slate-500">Tente buscar por termos mais genéricos ou use as hashtags sugeridas.</p>
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR (4 Colunas) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Trending Tags Widget */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                  <i className="fas fa-hashtag text-audit-gold text-[10px]"></i>
                  <span className="text-[10px] font-bold text-audit-navy uppercase tracking-widest">Tags em Alta</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => filterByTag(tag)}
                      className="tag-pill bg-slate-50 text-slate-600 hover:bg-audit-blue hover:text-white border border-slate-100"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Help Widget */}
              <div className="bg-audit-navy p-8 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition duration-500">
                  <i className="fas fa-question-circle text-6xl"></i>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-audit-gold mb-4">Dúvida Técnica?</h4>
                <p className="text-xs font-light text-slate-300 mb-6 leading-relaxed">
                  Não encontrou a norma ou política desejada? Entre em contato com nosso suporte regulatório.
                </p>
                <Link
                  to="/fale-conosco"
                  className="block w-full p-3 bg-audit-gold text-audit-navy font-bold text-center text-[10px] uppercase tracking-widest rounded-lg hover:bg-yellow-500 transition"
                >
                  Falar Conosco
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <Toast message={toastMessage} />

      {/* Estilos adicionais (podem ser movidos para global.css) */}
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
        .tool-btn:hover { width: 65px; background-color: #0f172a; color: #C5A059; }

        .tag-pill {
            cursor: pointer; transition: all 0.2s;
            display: inline-flex; align-items: center;
            padding: 4px 12px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;
        }
        .tag-pill:hover { transform: scale(1.05); filter: brightness(0.9); }

        .result-card {
            background: white; border-radius: 1.5rem; padding: 2rem;
            border: 1px solid #e2e8f0; transition: all 0.3s;
        }
        .result-card:hover { border-color: #1e40af; box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05); }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}