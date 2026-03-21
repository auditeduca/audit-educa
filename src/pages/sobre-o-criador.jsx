import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicLinks from '../components/TopicLinks';
import Toast from '../components/ui/Toast';
import BackgroundImage from '../components/BackgroundImage';
import MeasuredDateBar from '../components/MeasuredDateBar';
import ShareSidebar from '../components/ShareSidebar';

export default function SobreOCriador() {
  const [toastMessage, setToastMessage] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [headerHeight, setHeaderHeight] = useState(80);
  const [dateBarHeight, setDateBarHeight] = useState(40);
  const [activeTopic, setActiveTopic] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight || 80);
      }
    };
    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) resizeObserver.observe(headerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const paddingExtraDateBar = 0;
  const totalTopOffset = headerHeight + dateBarHeight + paddingExtraDateBar;
  const contentPaddingTop = headerHeight;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${totalTopOffset + 24}px 0px -60% 0px`,
      }
    );

    const sections = ['hero', 'perfil', 'missao', 'expertise'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [totalTopOffset]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetPosition =
        element.getBoundingClientRect().top + window.pageYOffset - totalTopOffset - 24;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      showToast('Inscrição realizada com sucesso!');
      setNewsletterEmail('');
    }
  };

  const sectionsList = [
    { id: 'hero', label: 'Apresentação' },
    { id: 'perfil', label: 'Perfil' },
    { id: 'missao', label: 'Missão' },
    { id: 'expertise', label: 'Expertise' }
  ];

  const skills = [
    { categoria: 'Contábil', items: ['Auditoria Independente (CNAI)', 'Contabilidade (CRC)', 'Normas IFRS / NBC TA'] },
    { categoria: 'Tecnologia', items: ['Fullstack Development', 'HTML5 / Tailwind CSS', 'JavaScript Moderno'] }
  ];

  const linksRelacionados = [
    { icon: 'fa-building', titulo: 'Nossa Instituição', desc: 'Conheça o Audit Educa', link: '/institucional' },
    { icon: 'fa-chart-line', titulo: 'Impacto Digital', desc: 'ESG e transparência', link: '/relatorio-impacto' },
    { icon: 'fa-leaf', titulo: 'Tecnologia Verde', desc: 'Sustentabilidade', link: '/tecnologia-verde' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* HEADER */}
      <div ref={headerRef} className="z-50 relative bg-white">
        <Header />
      </div>

      {/* DATEBAR */}
      <div 
        className="sticky w-full z-40 py-4 bg-white border-b border-slate-200 transition-all duration-300"
        style={{ top: headerHeight }}
      >
        <MeasuredDateBar
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
          onHeightChange={setDateBarHeight}
        />
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main
        className="flex-grow pb-10 px-4 sm:px-6 transition-all duration-300"
        style={{ paddingTop: contentPaddingTop }}
      >
        <div className="max-w-7xl mx-auto content-wrapper">
          
          {/* BREADCRUMB */}
          <nav
            className="pt-6 mb-0 no-print flex text-xs sm:text-sm font-semibold text-slate-500 tracking-normal"
            aria-label="Navegação de localização"
          >
            <ol className="flex items-center gap-3 flex-wrap">
              <li>
                <Link
                  to="/"
                  className="hover:text-audit-gold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-audit-gold/50 rounded px-1"
                >
                  Home
                </Link>
              </li>
              <li className="text-slate-300" aria-hidden="true">
                <i className="fas fa-chevron-right text-xs"></i>
              </li>
              <li>
                <span className="text-slate-600">Institucional</span>
              </li>
              <li className="text-slate-300" aria-hidden="true">
                <i className="fas fa-chevron-right text-xs"></i>
              </li>
              <li className="text-audit-gold font-bold" aria-current="page">
                Sobre o Criador
              </li>
            </ol>
          </nav>

          {/* GRID DE CONTEÚDO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* COLUNA ESQUERDA - CONTEÚDO PRINCIPAL */}
            <div className="lg:col-span-8 xl:col-span-8">
              
              {/* HERO SECTION */}
              <article
                id="hero"
                className="bg-gradient-to-br from-audit-navy/95 to-audit-navy relative overflow-hidden rounded-3xl shadow-lg mb-8 group"
              >
                <BackgroundImage
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"
                  opacity={10}
                />

                <div className="absolute top-0 right-0 w-96 h-96 bg-audit-gold/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 z-0"></div>

                <div className="relative z-10 p-8 md:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-1 w-8 bg-audit-gold rounded-full"></div>
                    <span className="text-audit-gold font-bold text-xs uppercase tracking-[0.15em]">
                      Criador & Mentor
                    </span>
                  </div>

                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Leivis <span className="text-audit-gold block sm:inline">Lima</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-8 max-w-2xl font-light">
                    Contador, Auditor Independente e Facilitador de Conhecimento. Uma jornada dedicada a traduzir o complexo para o prático.
                  </p>

                  {/* METADATA */}
                  <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-audit-gold/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-briefcase text-audit-gold text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">
                          Experiência
                        </span>
                        <span className="text-white font-semibold">Big4 & Independente</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-audit-gold/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-code text-audit-gold text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">
                          Expertise
                        </span>
                        <span className="text-white font-semibold">Fullstack Developer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* SHARE SIDEBAR */}
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm mb-8">
                <ShareSidebar
                  title="Sobre Leivis Lima - Criador do Audit Educa"
                  url={typeof window !== 'undefined' ? window.location.href : 'https://auditeduca.com.br/sobre-o-criador'}
                />
              </div>

              {/* SEÇÃO 1: PERFIL */}
              <section id="perfil" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Perfil & Trajetória
                  </h2>
                </div>

                <article className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 hover:shadow-md transition-all mb-6">
                  <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
                    <div className="md:col-span-1 flex justify-center">
                      <div className="relative inline-block group">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-audit-gold shadow-lg">
                          <img
                            src="https://placehold.co/400x400/1E3A8A/D4AF37?text=Leivis+Lima"
                            alt="Leivis Lima"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-audit-gold/30 scale-110 group-hover:scale-125 transition duration-300"></div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-bold text-audit-navy mb-4">Olá, sou Leivis Lima</h3>
                      <p className="text-slate-600 leading-relaxed font-light mb-4">
                        Minha carreira foi forjada no rigor das maiores empresas de auditoria do mundo (Big4), onde cheguei ao cargo de Gerente. Mas minha verdadeira paixão sempre foi <strong className="text-audit-gold">ensinar e capacitar pessoas</strong>.
                      </p>
                      <p className="text-slate-600 leading-relaxed font-light">
                        Percebi que a aplicabilidade prática das normas contábeis muitas vezes era ensinada de forma desnecessariamente complexa. Decidi mudar isso.
                      </p>
                    </div>
                  </div>
                </article>
              </section>

              {/* SEÇÃO 2: MISSÃO */}
              <section id="missao" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Missão Pessoal
                  </h2>
                </div>

                <article className="bg-gradient-to-br from-audit-gold/5 to-audit-navy/5 rounded-2xl p-8 md:p-10 border border-audit-gold/20">
                  <div className="flex gap-6 mb-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-audit-gold/20">
                      <i className="fas fa-lightbulb text-audit-gold text-2xl"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-lg text-slate-700 leading-relaxed font-light italic">
                        "Considero que desenvolver pessoas — tanto técnica quanto comportamentalmente — é o maior legado que podemos deixar para a profissão contábil brasileira."
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-slate-600 font-light">
                    <p>
                      O <strong className="text-audit-navy">Audit Educa</strong> nasce dessa lacuna. É a materialização de uma paixão por ensinar, combinada com tecnologia moderna e acessível.
                    </p>
                    <p>
                      Não apenas projeto as ferramentas e conteúdos que você vê aqui — eu mesmo codifico e itero constantemente, buscando sempre a excelência em educação técnica.
                    </p>
                  </div>
                </article>
              </section>

              {/* SEÇÃO 3: EXPERTISE */}
              <section id="expertise" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Expertise & Skills
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {skills.map((skill, i) => (
                    <article key={i} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-audit-gold/40 hover:shadow-md transition-all">
                      <h3 className="font-bold text-audit-navy mb-6 pb-4 border-b-2 border-audit-gold/20">
                        {skill.categoria}
                      </h3>
                      <ul className="space-y-3">
                        {skill.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-3 text-slate-600 font-light">
                            <span className="w-2 h-2 bg-audit-gold rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>

              {/* CTA FINAL */}
              <article className="bg-audit-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg mb-16">
                <div className="absolute top-0 right-0 w-96 h-96 bg-audit-gold/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                    Conecte-se Comigo
                  </h3>
                  <p className="text-slate-200 mb-6 max-w-2xl font-light">
                    Tem perguntas sobre educação técnica, carreira em auditoria ou sugestões para o Audit Educa? Estou sempre aberto a conversas significativas.
                  </p>
                  <a
                    href="mailto:leivis@auditeduca.com.br"
                    className="inline-flex items-center gap-2 bg-audit-gold hover:bg-yellow-500 text-audit-navy font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-envelope text-sm"></i>
                    Enviar Email
                  </a>
                </div>
              </article>
            </div>

            {/* COLUNA DIREITA - SIDEBAR */}
            <aside className="lg:col-span-4 xl:col-span-4 space-y-8">
              
              {/* ÍNDICE NESTA PÁGINA */}
              <div
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky z-20 transition-all duration-300"
                style={{ top: totalTopOffset + 24 }}
                role="navigation"
                aria-label="Índice da página"
              >
                <h3 className="text-xs font-black text-audit-navy uppercase tracking-[0.2em] mb-5 pb-4 border-b-2 border-slate-100 flex items-center gap-2">
                  <i className="fas fa-list text-audit-gold"></i>
                  <span>Nesta Página</span>
                </h3>
                <nav className="flex flex-col gap-4">
                  {sectionsList.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className={`text-sm font-semibold transition-all flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-audit-gold/50 rounded px-2 py-1 ${
                        activeSection === item.id
                          ? 'text-audit-navy'
                          : 'text-slate-500 hover:text-audit-navy'
                      }`}
                      aria-current={activeSection === item.id ? 'location' : undefined}
                    >
                      <span
                        className={`h-1 transition-all duration-300 rounded-full ${
                          activeSection === item.id
                            ? 'w-6 bg-audit-gold'
                            : 'w-0 bg-audit-gold group-hover:w-6'
                        }`}
                      ></span>
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* NEWSLETTER */}
              <article className="bg-gradient-to-br from-audit-navy to-audit-navy/80 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <i className="fas fa-envelope text-8xl"></i>
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">Newsletter Audit</h3>
                  <p className="text-slate-300 text-sm font-light mb-6">
                    Receba insights sobre carreira, normas técnicas e educação contábil.
                  </p>
                  <form onSubmit={handleNewsletterSubmit}>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-audit-gold transition text-sm mb-3"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-audit-gold hover:bg-yellow-500 text-audit-navy font-bold py-3 rounded-lg transition-all text-sm"
                    >
                      Inscrever-se
                    </button>
                  </form>
                </div>
              </article>

              {/* REDES SOCIAIS */}
              <article className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-share-nodes text-audit-gold"></i>
                  Conecte-se
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: 'fab fa-linkedin', label: 'LinkedIn', color: 'hover:text-blue-700' },
                    { icon: 'fab fa-github', label: 'GitHub', color: 'hover:text-slate-900' },
                    { icon: 'fab fa-twitter', label: 'Twitter', color: 'hover:text-blue-400' },
                    { icon: 'fas fa-envelope', label: 'Email', color: 'hover:text-audit-gold' }
                  ].map((social, i) => (
                    <a
                      key={i}
                      href="#"
                      className={`p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-audit-navy transition ${social.color}`}
                      title={social.label}
                    >
                      <i className={`${social.icon} text-lg`}></i>
                    </a>
                  ))}
                </div>
              </article>

              {/* CONTEÚDO RELACIONADO */}
              <article className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-bookmark text-audit-gold"></i>
                  Páginas Relacionadas
                </h3>
                <div className="space-y-3">
                  {linksRelacionados.map((link, i) => (
                    <Link
                      key={i}
                      to={link.link}
                      className="block p-4 bg-slate-50 rounded-lg hover:bg-audit-gold/5 border border-transparent hover:border-audit-gold/20 transition"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <i className={`fas ${link.icon} text-audit-gold`}></i>
                        <p className="font-semibold text-sm text-audit-navy">{link.titulo}</p>
                      </div>
                      <p className="text-xs text-slate-600">{link.desc}</p>
                    </Link>
                  ))}
                </div>
              </article>
            </aside>
          </div>

          {/* TÓPICOS RELACIONADOS */}
          <section
            className="mt-16 w-full bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm"
            aria-labelledby="related-topics"
          >
            <h2 id="related-topics" className="sr-only">
              Tópicos Relacionados
            </h2>
            <TopicLinks />
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
      
      {/* Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}