import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicLinks from '../components/TopicLinks';
import Toast from '../components/ui/Toast';
import BackgroundImage from '../components/BackgroundImage';
import MeasuredDateBar from '../components/MeasuredDateBar';
import ShareSidebar from '../components/ShareSidebar';

export default function FaleConosco() {
  const [toastMessage, setToastMessage] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [headerHeight, setHeaderHeight] = useState(80);
  const [dateBarHeight, setDateBarHeight] = useState(40);
  const [activeTopic, setActiveTopic] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: 'geral',
    mensagem: ''
  });
  const [formStatus, setFormStatus] = useState('idle');

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

    const sections = ['hero', 'formulario', 'canais', 'oficinas'];
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.email.trim() || !formData.mensagem.trim()) {
      showToast('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setFormStatus('sending');
    
    // Simular envio
    setTimeout(() => {
      setFormStatus('sent');
      setFormData({ nome: '', email: '', assunto: 'geral', mensagem: '' });
      showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    }, 1500);
  };

  const sectionsList = [
    { id: 'hero', label: 'Bem-vindo' },
    { id: 'formulario', label: 'Formulário de Contato' },
    { id: 'canais', label: 'Outros Canais' },
    { id: 'oficinas', label: 'Oficinas & Eventos' }
  ];

  const canaisContato = [
    {
      icon: 'fa-envelope',
      titulo: 'Email',
      descricao: 'Envie sua mensagem',
      contato: 'contato@auditeduca.com.br',
      tempo: 'Resposta em até 24h'
    },
    {
      icon: 'fab fa-whatsapp',
      titulo: 'WhatsApp',
      descricao: 'Chat instantâneo',
      contato: '(11) 99999-9999',
      tempo: 'Disponível 9h-18h'
    },
    {
      icon: 'fas fa-phone',
      titulo: 'Telefone',
      descricao: 'Fale com a equipe',
      contato: '(11) 3000-0000',
      tempo: 'Seg-Sex 9h-18h'
    },
    {
      icon: 'fab fa-linkedin',
      titulo: 'LinkedIn',
      descricao: 'Conecte-se conosco',
      contato: '@auditeduca',
      tempo: 'Monitorado diariamente'
    }
  ];

  const oficinas = [
    {
      titulo: 'Workshop NBC TA 505',
      data: '28 de Março, 2026',
      horario: '14:00 - 16:30',
      local: 'São Paulo/SP',
      vagas: 5
    },
    {
      titulo: 'Auditoria Interna Avançada',
      data: '04 de Abril, 2026',
      horario: '10:00 - 12:30',
      local: 'Online',
      vagas: 15
    },
    {
      titulo: 'Simulado CFC Completo',
      data: '11 de Abril, 2026',
      horario: '09:00 - 17:00',
      local: 'São Paulo/SP',
      vagas: 3
    }
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
                Fale Conosco
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
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
                  opacity={10}
                />

                <div className="absolute top-0 right-0 w-96 h-96 bg-audit-gold/10 rounded-full -mr-48 -mt-48 z-0"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 z-0"></div>

                <div className="relative z-10 p-8 md:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-1 w-8 bg-audit-gold rounded-full"></div>
                    <span className="text-audit-gold font-bold text-xs uppercase tracking-[0.15em]">
                      Vamos Conversar
                    </span>
                  </div>

                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Fale <span className="text-audit-gold block sm:inline">Conosco</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-8 max-w-2xl font-light">
                    Estamos sempre prontos para ouvir sugestões, responder dúvidas e colaborar no seu desenvolvimento profissional.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-audit-gold/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-envelope text-audit-gold text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">
                          Email Principal
                        </span>
                        <a href="mailto:contato@auditeduca.com.br" className="text-white font-semibold hover:text-audit-gold transition">
                          contato@auditeduca.com.br
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-audit-gold/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-phone text-audit-gold text-sm"></i>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">
                          Telefone
                        </span>
                        <a href="tel:1130000000" className="text-white font-semibold hover:text-audit-gold transition">
                          (11) 3000-0000
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* SHARE SIDEBAR */}
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm mb-8">
                <ShareSidebar
                  title="Fale Conosco - Audit Educa"
                  url={typeof window !== 'undefined' ? window.location.href : 'https://auditeduca.com.br/fale-conosco'}
                />
              </div>

              {/* SEÇÃO 1: FORMULÁRIO */}
              <section id="formulario" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Envie sua Mensagem
                  </h2>
                </div>

                <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-audit-navy mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleFormChange}
                        placeholder="João da Silva"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-audit-gold/50 focus:border-audit-gold transition-all text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-audit-navy mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="seu.email@example.com"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-audit-gold/50 focus:border-audit-gold transition-all text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-audit-navy mb-2">
                      Assunto
                    </label>
                    <select
                      name="assunto"
                      value={formData.assunto}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-audit-gold/50 focus:border-audit-gold transition-all text-sm bg-white"
                    >
                      <option value="geral">Dúvida Geral</option>
                      <option value="suporte">Suporte Técnico</option>
                      <option value="propostas">Propostas de Parceria</option>
                      <option value="imprensa">Imprensa</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-bold text-audit-navy mb-2">
                      Sua Mensagem *
                    </label>
                    <textarea
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleFormChange}
                      placeholder="Conte-nos tudo que precisamos saber..."
                      rows="6"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-audit-gold/50 focus:border-audit-gold transition-all text-sm resize-none font-light"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className={`w-full font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      formStatus === 'sent'
                        ? 'bg-green-500 text-white focus:ring-green-500/50'
                        : formStatus === 'sending'
                        ? 'bg-audit-gold text-audit-navy opacity-75 cursor-not-allowed'
                        : 'bg-audit-navy text-white hover:bg-audit-navy/90 focus:ring-audit-navy/50'
                    }`}
                  >
                    {formStatus === 'sending' ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Enviando...
                      </>
                    ) : formStatus === 'sent' ? (
                      <>
                        <i className="fas fa-check"></i>
                        Enviado com Sucesso!
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Enviar Mensagem
                      </>
                    )}
                  </button>
                </form>
              </section>

              {/* SEÇÃO 2: OUTROS CANAIS */}
              <section id="canais" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Outros Canais de Contato
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {canaisContato.map((canal, i) => (
                    <article
                      key={i}
                      className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-audit-gold/40 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-audit-navy to-audit-gold rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                        <i className={`fas ${canal.icon} text-lg`}></i>
                      </div>
                      <h3 className="text-lg font-bold text-audit-navy mb-2">{canal.titulo}</h3>
                      <p className="text-slate-600 text-sm font-light mb-3">{canal.descricao}</p>
                      <div className="bg-slate-50 rounded-lg p-3 mb-2">
                        <p className="text-audit-navy font-semibold text-sm">{canal.contato}</p>
                      </div>
                      <p className="text-xs text-slate-500 font-light">{canal.tempo}</p>
                    </article>
                  ))}
                </div>
              </section>

              {/* SEÇÃO 3: OFICINAS & EVENTOS */}
              <section id="oficinas" className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1 h-8 bg-gradient-to-b from-audit-gold to-audit-navy rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-audit-navy">
                    Próximos Eventos & Oficinas
                  </h2>
                </div>

                <div className="space-y-6">
                  {oficinas.map((evento, i) => (
                    <article
                      key={i}
                      className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 hover:border-audit-gold/40 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-audit-navy mb-4">{evento.titulo}</h3>
                          <div className="grid sm:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                              <i className="fas fa-calendar text-audit-gold w-5"></i>
                              <span className="font-light">{evento.data}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <i className="fas fa-clock text-audit-gold w-5"></i>
                              <span className="font-light">{evento.horario}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <i className="fas fa-map-marker-alt text-audit-gold w-5"></i>
                              <span className="font-light">{evento.local}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                          <div className="text-center">
                            <p className="text-xs text-slate-500 uppercase font-bold">Vagas</p>
                            <p className="text-2xl font-bold text-audit-gold">{evento.vagas}</p>
                          </div>
                          <button
                            onClick={() => showToast('Inscrição aberta! Encaminhe seu interesse.')}
                            className="bg-audit-navy hover:bg-audit-navy/90 text-white font-bold py-2 px-6 rounded-lg text-sm transition-all whitespace-nowrap"
                          >
                            Inscrever-se
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-8 bg-audit-navy/5 border border-audit-navy/20 rounded-2xl p-6">
                  <p className="text-audit-navy font-light">
                    <i className="fas fa-info-circle text-audit-gold mr-2"></i>
                    Quer propor um evento? Conte-nos na seção de mensagens acima!
                  </p>
                </div>
              </section>
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

              {/* INFORMAÇÕES DE CONTATO */}
              <article className="bg-audit-navy rounded-3xl p-8 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-audit-gold/10 rounded-full -mr-24 -mt-24 z-0"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <i className="fas fa-headset text-audit-gold"></i>
                    Atendimento
                  </h3>
                  <div className="space-y-4 text-sm font-light">
                    <div>
                      <p className="text-audit-gold font-semibold text-xs uppercase tracking-wide mb-1">
                        Horário
                      </p>
                      <p className="text-slate-200">
                        Segunda a Sexta<br />
                        09:00 - 18:00 (horário de Brasília)
                      </p>
                    </div>
                    <div className="pt-4 border-t border-white/20">
                      <p className="text-audit-gold font-semibold text-xs uppercase tracking-wide mb-1">
                        Resposta
                      </p>
                      <p className="text-slate-200">
                        Até 24h para emails<br />
                        Até 2h para WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* FALE COM TIME ESPECÍFICO */}
              <article className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <h3 className="text-lg font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-users text-audit-gold"></i>
                  Time Específico
                </h3>
                <div className="space-y-3">
                  <div className="border-b border-slate-100 pb-3">
                    <p className="font-semibold text-sm text-audit-navy">Suporte Técnico</p>
                    <a href="mailto:suporte@auditeduca.com.br" className="text-xs text-audit-gold hover:underline">
                      suporte@auditeduca.com.br
                    </a>
                  </div>
                  <div className="border-b border-slate-100 pb-3">
                    <p className="font-semibold text-sm text-audit-navy">Comercial</p>
                    <a href="mailto:comercial@auditeduca.com.br" className="text-xs text-audit-gold hover:underline">
                      comercial@auditeduca.com.br
                    </a>
                  </div>
                  <div className="border-b border-slate-100 pb-3">
                    <p className="font-semibold text-sm text-audit-navy">Jurídico</p>
                    <a href="mailto:juridico@auditeduca.com.br" className="text-xs text-audit-gold hover:underline">
                      juridico@auditeduca.com.br
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-audit-navy">Parcerias</p>
                    <a href="mailto:parcerias@auditeduca.com.br" className="text-xs text-audit-gold hover:underline">
                      parcerias@auditeduca.com.br
                    </a>
                  </div>
                </div>
              </article>

              {/* REDES SOCIAIS */}
              <article className="bg-gradient-to-br from-audit-gold/10 to-audit-navy/5 rounded-3xl p-6 border border-audit-gold/30">
                <h3 className="font-bold text-audit-navy mb-4 flex items-center gap-2">
                  <i className="fas fa-share-nodes text-audit-gold"></i>
                  Redes Sociais
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: 'fab fa-linkedin', label: 'LinkedIn', color: 'hover:text-blue-700' },
                    { icon: 'fab fa-instagram', label: 'Instagram', color: 'hover:text-pink-600' },
                    { icon: 'fab fa-youtube', label: 'YouTube', color: 'hover:text-red-600' },
                    { icon: 'fab fa-twitter', label: 'Twitter', color: 'hover:text-blue-400' }
                  ].map((social, i) => (
                    <a
                      key={i}
                      href="#"
                      className={`w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-audit-navy transition-all ${social.color}`}
                      title={social.label}
                    >
                      <i className={`${social.icon} text-sm`}></i>
                    </a>
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