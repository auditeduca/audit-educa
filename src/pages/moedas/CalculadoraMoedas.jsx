import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FaCalendarAlt, FaCodeBranch, FaLink, FaChevronRight,
  FaChevronDown, FaArrowUp, FaEye, FaLightbulb, FaChartLine, FaFilePdf
} from 'react-icons/fa';

import MainLayout from '../../components/layout/MainLayout';
import TopicLinks from '../../components/TopicLinks';
import ShareSidebar from '../../components/ShareSidebar';
import Toast from '../../components/ui/Toast';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useScrollToTopButton } from '../../hooks/useScrollToTop';

import useMoedas from './hooks/useMoedas';
import ConversorMoedas from './components/ConversorMoedas';
import GraficoCambio from './components/GraficoCambio';
import SeletorMoedas from './components/SeletorMoedas';
import SeriesHistorica from './components/SeriesHistorica';
import TabelaMoedas from './components/TabelaMoedas';
import { formatCurrency } from '../../utils/formatadores';
import { useAuditUI } from '../../components/context/AuditUIContext';

export default function CalculadoraMoedas() {
  const location = useLocation();
  const { showToast } = useAuditUI();

  // State
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topOffset, setTopOffset] = useState(140);

  // Custom hooks
  const { currencies, rates, loading, error, fetchRates, fetchHistorical } = useMoedas();
  const isScrollingUp = useScrollDirection();
  const isIndexVisible = isScrollingUp;
  const sections = useMemo(() => ['hero', 'seletor', 'conversor', 'resultado', 'grafico', 'tabela'], []);
  const activeSection = useActiveSection(sections);
  const showScrollTop = useScrollToTopButton();

  const rate = rates ? (rates[toCurrency] / rates[fromCurrency]).toFixed(4) : 0;

  // Get total offset (header + datebar) for smooth scrolling
  const getTotalOffset = useCallback(() => {
    const headerEl = document.querySelector('header') || document.querySelector('.sticky.top-0');
    const headerHeight = headerEl ? headerEl.offsetHeight : 80;
    const dateBarEl = document.querySelector('.sticky.z-40');
    const dateBarHeight = dateBarEl ? dateBarEl.offsetHeight : 40;
    return headerHeight + dateBarHeight;
  }, []);

  // Update offset on resize / layout changes
  useEffect(() => {
    const updateOffset = () => setTopOffset(getTotalOffset());
    updateOffset();

    const resizeObserver = new ResizeObserver(() => requestAnimationFrame(updateOffset));
    const headerEl = document.querySelector('header') || document.querySelector('.sticky.top-0');
    const dateBarEl = document.querySelector('.sticky.z-40');
    if (headerEl) resizeObserver.observe(headerEl);
    if (dateBarEl) resizeObserver.observe(dateBarEl);

    return () => resizeObserver.disconnect();
  }, [getTotalOffset]);

  const scrollToSection = useCallback((e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    const totalOffset = getTotalOffset();
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - totalOffset;

    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [getTotalOffset]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Currency conversion
  const handleConvert = async () => {
    if (!rates || !rates[fromCurrency] || !rates[toCurrency]) {
      await fetchRates(fromCurrency);
    }
    const rateVal = rates?.[toCurrency] / rates?.[fromCurrency];
    if (rateVal) {
      setResult(amount * rateVal);
      showToast('Conversão realizada com sucesso!');
    } else {
      setResult(null);
      showToast('Erro ao calcular a taxa de câmbio.', 3000);
    }
  };

  const handleFromCurrencyChange = (currency) => {
    setFromCurrency(currency);
    setResult(null);
  };

  const handleToCurrencyChange = (currency) => {
    setToCurrency(currency);
    setResult(null);
  };

  const handleAmountChange = (newAmount) => {
    setAmount(newAmount);
    setResult(null);
  };

  const copyResultToClipboard = () => {
    if (result !== null) {
      const text = `AUDIT EDUCA Hub - Conversão de Moedas\n------------------------\n${amount} ${fromCurrency} = ${formatCurrency(result, toCurrency)}\nTaxa: ${rate}\nEmitido em: ${new Date().toLocaleString()}`;
      navigator.clipboard.writeText(text);
      showToast('Resultado copiado!');
    } else {
      showToast('Nenhum resultado para copiar.');
    }
  };

  // Loading / error states
  if (loading && !rates) return <div className="text-center py-10">Carregando dados de câmbio...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Erro: {error}</div>;

  const lastUpdated = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <>
      <Helmet>
        <title>Calculadora de Moedas | Audit Educa</title>
        <meta name="description" content="Converta valores entre moedas internacionais com taxas atualizadas. Ideal para auditoria financeira e provisões em moeda estrangeira." />
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content="Calculadora de Moedas | Audit Educa" />
        <meta property="og:description" content="Ferramenta profissional de conversão de moedas para auditoria e compliance." />
      </Helmet>

      <MainLayout>
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="pt-8 mb-6 no-print" aria-label="Navegação de localização">
            <ol className="flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-slate-600">
              <li><Link to="/" className="hover:text-audit-navy transition-colors">Home</Link></li>
              <li aria-hidden="true"><FaChevronRight className="text-[10px] opacity-50" /></li>
              <li><span>Ferramentas Financeiras</span></li>
              <li aria-hidden="true"><FaChevronRight className="text-[10px] opacity-50" /></li>
              <li className="text-audit-navy font-bold" aria-current="page">Calculadora de Moedas</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-8 space-y-12">
              {/* HERO */}
              <section id="hero" className="bg-audit-navy relative overflow-hidden rounded-[2.5rem] shadow-2xl group border border-white/10">
                <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(197,160,89,0.08),transparent)]"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-audit-gold/20 blur-2xl rounded-full pointer-events-none"></div>
                <div className="relative z-10 p-10 md:p-16">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-audit-gold opacity-75 motion-reduce:animate-none"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-audit-gold"></span>
                    </span>
                    <span className="text-audit-gold font-bold text-[10px] uppercase tracking-[0.2em]">Ferramenta Profissional</span>
                  </div>

                  <h1 className="font-serif text-5xl md:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                    Calculadora de <span className="text-audit-gold italic">Moedas</span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-12 max-w-2xl font-light">
                    Conversão precisa entre moedas internacionais. Ideal para conferência de <strong className="text-white">provisões em moeda estrangeira</strong> e <strong className="text-white">análise de contratos</strong>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                        <FaCalendarAlt className="text-audit-gold text-sm" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Atualização</span>
                        <span className="text-white font-medium text-sm">{lastUpdated}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                        <FaCodeBranch className="text-audit-gold text-sm" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Versão</span>
                        <span className="text-white font-medium text-sm">2.0</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                        <FaLink className="text-audit-gold text-sm" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Normas</span>
                        <span className="text-white font-medium text-sm">NBC TA 500 · CPC 02</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Share Sidebar */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <ShareSidebar title="Calculadora de Moedas - Audit Educa" url={window.location.href} />
              </div>

              {/* Seletor de Moedas */}
              <section id="seletor" className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-audit-navy/5 rounded-xl flex items-center justify-center text-audit-navy">
                    <FaEye className="text-2xl" />
                  </div>
                  <h2 className="text-3xl font-serif font-black text-audit-navy">Seletor de Moedas</h2>
                </div>
                <SeletorMoedas
                  currencies={currencies}
                  fromCurrency={fromCurrency}
                  toCurrency={toCurrency}
                  onFromChange={handleFromCurrencyChange}
                  onToChange={handleToCurrencyChange}
                />
              </section>

              {/* Conversor */}
              <section id="conversor" className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-audit-navy/5 rounded-xl flex items-center justify-center text-audit-navy">
                    <FaChartLine className="text-2xl" />
                  </div>
                  <h2 className="text-3xl font-serif font-black text-audit-navy">Conversor</h2>
                </div>
                <ConversorMoedas
                  amount={amount}
                  onAmountChange={handleAmountChange}
                  fromCurrency={fromCurrency}
                  toCurrency={toCurrency}
                  result={result}
                  onConvert={handleConvert}
                />
              </section>

              {/* Resultado */}
              {result !== null && (
                <div id="resultado" className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm">
                  <div className="result-card-premium p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-center md:text-left">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Valor Convertido</p>
                      <h2 className="text-5xl md:text-6xl font-serif font-bold text-audit-navy tracking-tight">
                        {formatCurrency(result, toCurrency)}
                      </h2>
                    </div>
                    <div className="flex flex-col gap-4 w-full md:w-auto">
                      <div className="flex justify-between items-center gap-10 p-5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Taxa Utilizada</span>
                        <span className="text-lg font-bold text-audit-blue font-serif">
                          1 {fromCurrency} = {rate} {toCurrency}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-10 p-5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Valor Original</span>
                        <span className="text-lg font-bold text-slate-700">
                          {formatCurrency(amount, fromCurrency)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-6 no-print">
                    <button
                      onClick={() => showToast('Funcionalidade em desenvolvimento.')}
                      className="flex-1 py-4 bg-audit-navy text-white rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 shadow-lg"
                    >
                      <FaFilePdf className="text-audit-gold" /> EXPORTAR RESULTADO EM PDF
                    </button>
                    <button
                      onClick={copyResultToClipboard}
                      className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:border-audit-gold transition"
                    >
                      <FaLink /> COPIAR RESULTADO
                    </button>
                  </div>
                </div>
              )}

              {/* Gráfico */}
              <section id="grafico" className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-audit-navy/5 rounded-xl flex items-center justify-center text-audit-navy">
                    <FaChartLine className="text-2xl" />
                  </div>
                  <h2 className="text-3xl font-serif font-black text-audit-navy">Gráfico de Câmbio</h2>
                </div>
                <GraficoCambio
                  fromCurrency={fromCurrency}
                  toCurrency={toCurrency}
                  fetchHistorical={fetchHistorical}
                />
              </section>

              {/* Série Histórica */}
              <section id="historico" className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-audit-navy/5 rounded-xl flex items-center justify-center text-audit-navy">
                    <FaEye className="text-2xl" />
                  </div>
                  <h2 className="text-3xl font-serif font-black text-audit-navy">Série Histórica</h2>
                </div>
                <SeriesHistorica
                  fromCurrency={fromCurrency}
                  toCurrency={toCurrency}
                  fetchHistorical={fetchHistorical}
                />
              </section>

              {/* Tabela de Moedas */}
              <section id="tabela" className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-audit-navy/5 rounded-xl flex items-center justify-center text-audit-navy">
                    <FaEye className="text-2xl" />
                  </div>
                  <h2 className="text-3xl font-serif font-black text-audit-navy">Tabela de Moedas</h2>
                </div>
                <TabelaMoedas
                  rates={rates}
                  baseCurrency={fromCurrency}
                  currencies={currencies}
                />
              </section>

              {/* Insight Profissional */}
              <div className="bg-audit-blue/5 p-8 border-l-4 border-audit-blue rounded-r-2xl flex gap-6 no-print">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                  <FaLightbulb className="text-audit-blue text-xl" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-audit-blue uppercase tracking-widest mb-2">Insight Profissional</p>
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    Em auditoria, utilize esta ferramenta para conferir provisões em moeda estrangeira e contratos de câmbio, garantindo conformidade com as normas internacionais.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Desktop index */}
              <div className="hidden lg:block">
                <div
                  className={`bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 sticky z-10 transition-all duration-500 ${
                    isIndexVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                  style={{ top: topOffset + 32 }}
                >
                  <h3 className="text-[10px] font-black text-audit-navy uppercase tracking-[0.3em] mb-8 pb-4 border-b border-slate-100 flex items-center gap-3">
                    <span className="w-2 h-2 bg-audit-gold rounded-full"></span> Conteúdo
                  </h3>
                  <nav className="flex flex-col gap-6" aria-label="Índice da página">
                    {[
                      { label: 'Seletor de Moedas', href: 'seletor', icon: FaEye },
                      { label: 'Conversor', href: 'conversor', icon: FaChartLine },
                      { label: 'Resultado', href: 'resultado', icon: FaLink },
                      { label: 'Gráfico', href: 'grafico', icon: FaChartLine },
                      { label: 'Tabela de Moedas', href: 'tabela', icon: FaEye },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.href}
                          href={`#${item.href}`}
                          onClick={(e) => scrollToSection(e, item.href)}
                          className={`group flex items-center gap-4 text-sm font-bold transition-all ${
                            activeSection === item.href ? 'text-audit-navy translate-x-2' : 'text-slate-600 hover:text-audit-navy hover:translate-x-1'
                          }`}
                          aria-current={activeSection === item.href ? 'location' : undefined}
                        >
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            activeSection === item.href ? 'bg-audit-gold text-audit-navy shadow-lg shadow-audit-gold/20' : 'bg-slate-50 text-slate-600'
                          }`}>
                            <Icon className="text-[10px]" />
                          </span>
                          {item.label}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Mobile index */}
              <div className="lg:hidden sticky top-[calc(var(--header-height)+48px)] z-20 mb-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-md">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex items-center justify-between w-full p-4 text-left"
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-menu-nav"
                  >
                    <span className="text-xs font-black text-audit-navy uppercase tracking-wider">Conteúdo</span>
                    <FaChevronDown className={`text-slate-400 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileMenuOpen && (
                    <nav className="flex flex-col gap-4 p-4 border-t border-slate-100" id="mobile-menu-nav">
                      {[
                        { label: 'Seletor de Moedas', href: 'seletor' },
                        { label: 'Conversor', href: 'conversor' },
                        { label: 'Resultado', href: 'resultado' },
                        { label: 'Gráfico', href: 'grafico' },
                        { label: 'Tabela de Moedas', href: 'tabela' },
                      ].map((item) => (
                        <a
                          key={item.href}
                          href={`#${item.href}`}
                          onClick={(e) => scrollToSection(e, item.href)}
                          className="text-sm font-medium py-3 block"
                          style={{ color: activeSection === item.href ? '#C5A059' : '#475569' }}
                        >
                          {item.label}
                        </a>
                      ))}
                    </nav>
                  )}
                </div>
              </div>

              {/* Newsletter */}
              <article className="bg-gradient-to-br from-[#0C1B33] to-[#0f172a] rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.1),transparent)] pointer-events-none"></div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-2xl">
                    <FaEye className="text-3xl text-audit-gold" />
                  </div>
                  <h3 className="text-2xl font-serif font-black mb-4 tracking-tight">Newsletter Audit</h3>
                  <p className="text-slate-300 font-light text-sm leading-relaxed mb-8 px-2">
                    Receba atualizações semanais sobre normas técnicas e novas ferramentas.
                  </p>
                  <div className="flex flex-col gap-3">
                    <label htmlFor="newsletter-email" className="sr-only">Seu e-mail</label>
                    <input
                      id="newsletter-email"
                      name="newsletter-email"
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-xs outline-none focus:border-audit-gold transition"
                      aria-label="Endereço de e-mail para assinar a newsletter"
                    />
                    <button
                      onClick={() => showToast('Assinatura realizada!')}
                      className="bg-audit-gold text-audit-navy font-black py-4 rounded-2xl hover:bg-yellow-500 transition-all active:scale-95 text-xs uppercase tracking-widest shadow-xl"
                    >
                      Assinar Agora
                    </button>
                  </div>
                </div>
              </article>
            </aside>
          </div>

          <section className="mt-24 pt-16 border-t border-slate-200">
            <TopicLinks />
          </section>
        </div>
      </MainLayout>

      <Toast message={null} role="status" aria-live="polite" />

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 bg-audit-gold text-audit-navy rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-audit-gold focus:ring-offset-2 ${
          showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        aria-label="Voltar ao topo"
      >
        <FaArrowUp className="text-lg" />
      </button>
    </>
  );
}