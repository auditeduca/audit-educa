import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundImage from '../components/BackgroundImage';
import ShareSidebar from '../components/ShareSidebar';

/**
 * PÁGINA: Relatório Institucional - Audit Educa
 * ESTILO: Editorial Executive Deep
 */

export default function RelatorioInstitucional() {
  // Configurações Visuais
  const coverImage = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80';
  const logoPath = "/assets/images/logotipo-audit-educa-default.webp";

  const sections = [
    {
      id: 'missao',
      title: 'Missão',
      tagline: 'Propósito e Entrega',
      content: `
        Democratizar o conhecimento técnico em auditoria, tornando a educação profissional de alto nível acessível e prática.
        Nosso compromisso é oferecer conteúdo de excelência, atualizado com as melhores práticas do mercado, para que profissionais
        de todas as regiões possam desenvolver suas carreiras com base em conhecimento sólido e aplicável.
      `,
      icon: 'fa-bullseye',
    },
    {
      id: 'visao',
      title: 'Visão',
      tagline: 'Futuro e Aspirações',
      content: `
        Ser a principal referência em formação contínua e inovação educativa para o mercado de auditoria brasileiro até 2030.
        Almejamos um ecossistema onde a tecnologia e a educação se encontram para potencializar a precisão contábil e a ética profissional.
      `,
      icon: 'fa-eye',
    },
    {
      id: 'valores',
      title: 'Valores',
      tagline: 'Ética e Conduta',
      content: `
        <ul class="space-y-4">
          <li class="flex gap-4">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-audit-gold/20 flex items-center justify-center text-audit-gold font-bold text-[10px]">01</span>
            <div><strong>Ética Absoluta:</strong> Integridade inegociável em todos os processos de auditoria.</div>
          </li>
          <li class="flex gap-4">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-audit-gold/20 flex items-center justify-center text-audit-gold font-bold text-[10px]">02</span>
            <div><strong>Transparência:</strong> Clareza total na comunicação de resultados e metodologias.</div>
          </li>
          <li class="flex gap-4">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-audit-gold/20 flex items-center justify-center text-audit-gold font-bold text-[10px]">03</span>
            <div><strong>Inclusão:</strong> Ambiente diverso que potencializa diferentes perspectivas técnicas.</div>
          </li>
          <li class="flex gap-4">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-audit-gold/20 flex items-center justify-center text-audit-gold font-bold text-[10px]">04</span>
            <div><strong>Inovação:</strong> Busca contínua por tecnologias que otimizam a precisão contábil.</div>
          </li>
        </ul>
      `,
      icon: 'fa-award',
    },
  ];

  return (
    <>
      <Helmet>
        <html lang="pt-BR" />
        <title>Missão, Visão e Valores | Audit Educa</title>
        <meta name="description" content="Conheça os pilares estratégicos do Audit Educa: Missão, Visão e Valores." />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
        <Header />

        <main className="flex-grow">
          {/* --- HERO SECTION: DESIGN EDITORIAL --- */}
          <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden bg-audit-navy">
            {/* Background com Padrão Geométrico */}
            <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
                <svg width="100%" height="100%">
                    <pattern id="hero-dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="#D4AF37" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#hero-dots)" />
                </svg>
            </div>
            
            {/* Imagem com Máscara Gradiente */}
            <div className="absolute top-0 right-0 w-full lg:w-2/3 h-full z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-audit-navy via-audit-navy/80 to-transparent z-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-audit-navy via-transparent to-transparent z-20"></div>
                <img 
                    src={coverImage} 
                    alt="Capa Relatório" 
                    className="w-full h-full object-cover grayscale brightness-50 contrast-125"
                />
            </div>

            <div className="container mx-auto px-6 relative z-30">
              <div className="max-w-3xl">
                {/* Badge Identidade */}
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-8 shadow-2xl animate-fade-in-down">
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white/10 p-1">
                    <img src={logoPath} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] font-black text-audit-gold uppercase tracking-[0.3em]">Documento Institucional</span>
                </div>

                <h1 className="font-serif text-5xl md:text-7xl text-white font-black leading-[1.1] mb-6">
                  Missão, Visão <br />
                  <span className="text-audit-gold italic">& Valores</span>
                </h1>
                
                <p className="text-xl text-slate-300 font-light max-w-xl leading-relaxed mb-10 border-l-2 border-audit-gold/30 pl-6">
                  Os pilares estratégicos que fundamentam a excelência educacional e o compromisso ético do <span className="text-white font-bold">Audit Educa</span>.
                </p>

                <div className="flex flex-wrap gap-8 text-[11px] font-bold text-white/40 uppercase tracking-widest no-print">
                   <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-audit-gold"></span>
                      Audit Educa Corp.
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-audit-gold"></span>
                      Versão 2.0 (2025)
                   </div>
                </div>
              </div>
            </div>

            {/* Decorativo lateral vertical */}
            <div className="absolute right-12 bottom-24 hidden lg:block transform rotate-90 origin-right pointer-events-none">
                <span className="text-[10px] font-black text-white/10 uppercase tracking-[2em]">GOVERNANÇA • ÉTICA • EDUCAÇÃO</span>
            </div>
          </section>

          {/* --- CONTEÚDO PRINCIPAL --- */}
          <div className="container mx-auto px-6 py-20">
            {/* Breadcrumb Minimalista */}
            <nav className="mb-12 no-print">
              <ol className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <li><Link to="/" className="hover:text-audit-gold transition-colors">Home</Link></li>
                <li className="w-1 h-1 rounded-full bg-slate-300"></li>
                <li><Link to="/sobre-nos" className="hover:text-audit-gold transition-colors">Institucional</Link></li>
                <li className="w-1 h-1 rounded-full bg-audit-gold"></li>
                <li className="text-audit-navy italic">Relatório</li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Navegação de Vidro (Sidebar) */}
              <aside className="lg:col-span-3 hidden lg:block">
                <div className="sticky top-32 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-2xl overflow-hidden group">
                  {/* Decoração interna da sidebar */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-audit-gold/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                  
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-audit-navy/40 mb-8 flex items-center gap-2">
                    Sumário
                  </h2>
                  <nav className="space-y-4">
                    {sections.map((sec) => (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        className="group flex items-center gap-4 text-sm font-bold text-slate-500 hover:text-audit-navy transition-all py-2 border-b border-transparent hover:border-audit-gold/20"
                      >
                        <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-audit-gold group-hover:text-white transition-colors">
                            <i className={`fas ${sec.icon} text-xs`}></i>
                        </span>
                        {sec.title}
                      </a>
                    ))}
                  </nav>

                  <div className="mt-12 pt-8 border-t border-slate-100">
                    <button 
                        onClick={() => window.print()}
                        className="w-full py-4 bg-audit-navy text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                        <i className="fas fa-file-pdf text-audit-gold"></i> Exportar PDF
                    </button>
                  </div>
                </div>
              </aside>

              {/* Seções de Texto Editorial */}
              <div className="lg:col-span-9 space-y-20">
                {sections.map((sec) => (
                  <section
                    key={sec.id}
                    id={sec.id}
                    className="relative bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] scroll-mt-32 overflow-hidden transition-all duration-500 hover:shadow-2xl"
                  >
                    {/* Elemento Decorativo: Número da Seção Gigante */}
                    <div className="absolute top-8 right-12 text-8xl font-serif font-black text-slate-50 opacity-[0.03] pointer-events-none select-none">
                        {sec.title}
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 bg-audit-navy text-audit-gold rounded-2xl flex items-center justify-center shadow-xl">
                                <i className={`fas ${sec.icon} text-2xl`}></i>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-audit-gold uppercase tracking-[0.4em] mb-1 block">{sec.tagline}</span>
                                <h2 className="text-4xl font-serif font-bold text-audit-navy leading-none">{sec.title}</h2>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            {sec.id === 'valores' ? (
                                <div 
                                    className="text-lg text-slate-600 leading-relaxed font-medium" 
                                    dangerouslySetInnerHTML={{ __html: sec.content }} 
                                />
                            ) : (
                                <p className="text-xl text-slate-600 leading-relaxed font-medium first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-audit-navy first-letter:mr-3 first-letter:float-left">
                                    {sec.content}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Rodapé Interno da Seção */}
                    <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                        <span>Audit Educa • Pilares</span>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-audit-gold"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                        </div>
                    </div>
                  </section>
                ))}

                {/* Bloco de Compartilhamento Stylized */}
                <div className="bg-audit-navy rounded-[3rem] p-12 text-center relative overflow-hidden no-print">
                   <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#hero-dots)" /></svg>
                   </div>
                   <div className="relative z-10">
                       <h3 className="text-white font-serif text-2xl mb-4">Compartilhe nossa <span className="text-audit-gold italic">Essência</span></h3>
                       <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-8">Disseminar o conhecimento é o nosso primeiro passo</p>
                       <ShareSidebar
                            title="Audit Educa - Missão, Visão e Valores"
                            url={typeof window !== 'undefined' ? window.location.href : 'https://auditeduca.com.br/relatorio-institucional'}
                        />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Estilos Auxiliares (Inline) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&family=Plus+Jakarta+Sans:wght@300;400;500;700;800&display=swap');
        
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        .bg-audit-navy { background-color: #0F172A; }
        .text-audit-navy { color: #0F172A; }
        .text-audit-gold { color: #D4AF37; }
        .bg-audit-gold { background-color: #D4AF37; }
        
        @media print {
            .no-print { display: none !important; }
            main { padding: 0 !important; }
            section { break-inside: avoid; shadow: none !important; border: 1px solid #eee !important; }
        }

        .animate-fade-in-down {
            animation: fadeInDown 1s ease-out forwards;
        }

        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}