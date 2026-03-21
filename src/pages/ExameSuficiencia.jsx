import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Dados mockados (iguais ao original)
const editionsData = [
  { edition: '2025.2', approved: 'Aguardando', url: '/tests/exame-suficiencia-2025-02.json' },
  { edition: '2025.1', approved: '19.8%', url: '/tests/exame-suficiencia-2025-01.json' },
  { edition: '2024.2', approved: '22.1%', url: '/tests/exame-suficiencia-2024-02.json' },
  { edition: '2024.1', approved: '18.4%', url: '/tests/exame-suficiencia-2024-01.json' },
  { edition: '2023.2', approved: '24.2%', url: '/tests/exame-suficiencia-2023-02.json' },
  { edition: '2023.1', approved: '16.7%', url: '/tests/exame-suficiencia-2023-01.json' },
  { edition: '2022.2', approved: '21.5%', url: '/tests/exame-suficiencia-2022-02.json' },
  { edition: '2022.1', approved: '19.3%', url: '/tests/exame-suficiencia-2022-01.json' },
  { edition: '2021.2', approved: '20.1%', url: '/tests/exame-suficiencia-2021-02.json' },
  { edition: '2021.1', approved: '23.8%', url: '/tests/exame-suficiencia-2021-01.json' },
  { edition: '2020.2', approved: '25.6%', url: '/tests/exame-suficiencia-2020-02.json' },
  { edition: '2020.1', approved: '31.2%', url: '/tests/exame-suficiencia-2020-01.json' },
  { edition: '2019.2', approved: '18.9%', url: '/tests/exame-suficiencia-2019-02.json' },
  { edition: '2019.1', approved: '17.5%', url: '/tests/exame-suficiencia-2019-01.json' },
  { edition: '2018.2', approved: '21.0%', url: '/tests/exame-suficiencia-2018-02.json' },
  { edition: '2018.1', approved: '28.3%', url: '/tests/exame-suficiencia-2018-01.json' },
  { edition: '2017.2', approved: '26.4%', url: '/tests/exame-suficiencia-2017-02.json' },
  { edition: '2017.1', approved: '24.8%', url: '/tests/exame-suficiencia-2017-01.json' }
];

const syllabus = [
  { topic: 'Contabilidade Geral', q: 17, desc: 'Pronunciamentos CPCs (Estoque, Imobilizado, Intangível, DRE, DFC, BP).' },
  { topic: 'Contabilidade de Custos', q: 4, desc: 'Custeio por Absorção, Variável, ABC e Equivalente de Produção.' },
  { topic: 'Contabilidade Pública', q: 3, desc: 'MCASP, Receita e Despesa Pública, Demonstrações Contábeis.' },
  { topic: 'Contabilidade Gerencial', q: 4, desc: 'Ponto de Equilíbrio, Margem de Contribuição, Orçamento.' },
  { topic: 'Legislação Aplicada', q: 3, desc: 'Direito Tributário, Trabalhista e Previdenciário.' },
  { topic: 'Matemática e Estatística', q: 2, desc: 'Juros Compostos, VPL, TIR e Descontos.' },
  { topic: 'Teoria da Contabilidade', q: 4, desc: 'Escolas Contábeis, Estrutura Conceitual Básica.' },
  { topic: 'Princípios e Ética', q: 4, desc: 'Ética Profissional (NBC PG 01) e Código de Conduta.' }
];

const glossary = {
  CFC: 'Conselho Federal de Contabilidade.',
  DVA: 'Demonstração do Valor Adicionado: evidencia a riqueza gerada pela entidade e sua distribuição.',
  CPC: 'Comitê de Pronunciamentos Contábeis.',
  NBC: 'Normas Brasileiras de Contabilidade.',
  PATRIMÔNIO: 'Conjunto de bens, direitos e obrigações de uma entidade.',
  'LAUDO PERICIAL': 'Documento técnico elaborado pelo perito contador.'
};

const ExameSuficiencia = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filteredEditions, setFilteredEditions] = useState([]);
  const [cartItems, setCartItems] = useState(new Set());
  const [savedItems, setSavedItems] = useState(new Set());
  const [examData, setExamData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEdition, setCurrentEdition] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSplitMode, setIsSplitMode] = useState(false);
  const [fontSizeBase, setFontSizeBase] = useState(16);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});

  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const modalRef = useRef(null);
  const paperRef = useRef(null);
  const readingBarRef = useRef(null);
  const toastTimeout = useRef(null);

  // Efeito para filtrar e ordenar edições
  useEffect(() => {
    let filtered = editionsData.filter(ed => 
      ed.edition.toLowerCase().includes(searchTerm.toLowerCase())
    );
    filtered.sort((a, b) => 
      sortOrder === 'desc' ? b.edition.localeCompare(a.edition) : a.edition.localeCompare(b.edition)
    );
    setFilteredEditions(filtered);
  }, [searchTerm, sortOrder]);

  // Inicializar gráfico
  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    const validData = editionsData.filter(e => e.approved !== 'Aguardando').reverse();
    
    if (chartInstance.current) chartInstance.current.destroy();
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: validData.map(e => e.edition),
        datasets: [{
          label: 'Aprovação (%)',
          data: validData.map(e => parseFloat(e.approved.replace('%', ''))),
          borderColor: '#C5A059',
          backgroundColor: 'rgba(197, 160, 89, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#0f172a',
          pointBorderColor: '#ffffff',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false }, 
          tooltip: { backgroundColor: '#0f172a', padding: 10, cornerRadius: 8 } 
        },
        scales: {
          y: { 
            beginAtZero: true, 
            max: 40, 
            grid: { color: '#f1f5f9' }, 
            ticks: { color: '#94a3b8', font: { size: 10 } } 
          },
          x: { 
            grid: { display: false }, 
            ticks: { color: '#94a3b8', font: { size: 10 } } 
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  // Atualizar badges
  useEffect(() => {
    const badge = document.getElementById('save-badge');
    if (badge) {
      badge.textContent = savedItems.size;
      badge.classList.toggle('hidden', savedItems.size === 0);
    }
    const cartCount = document.getElementById('toolbar-cart-count');
    if (cartCount) cartCount.textContent = cartItems.size;
  }, [savedItems, cartItems]);

  // Toast auto-close
  useEffect(() => {
    if (showToast) {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => {
        setShowToast(false);
        setToastMessage('');
      }, 3000);
    }
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, [showToast]);

  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  const toggleCart = (edition) => {
    setCartItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(edition)) newSet.delete(edition);
      else newSet.add(edition);
      return newSet;
    });
  };

  const toggleSave = (edition) => {
    setSavedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(edition)) newSet.delete(edition);
      else newSet.add(edition);
      return newSet;
    });
  };

  const openPreview = async (edition, url) => {
    setCurrentEdition(edition);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro ao carregar');
      const data = await res.json();
      setExamData(transformExamData(data));
    } catch (e) {
      console.warn('Falha ao carregar JSON, exibindo dados mock');
      setExamData([]);
    }
  };

  const transformExamData = (raw) => {
    if (Array.isArray(raw) && raw.length && raw[0].number) return raw;
    if (raw.questoes && Array.isArray(raw.questoes)) {
      return raw.questoes.map(q => ({
        number: q.numero || q.questao_numero || 0,
        text: q.enunciado || q.descricao || '',
        options: (q.alternativas || []).map((alt, idx) => ({
          letter: alt.letra || String.fromCharCode(65 + idx),
          text: alt.texto || alt
        })),
        gabarito: (raw.gabarito || []).find(g => g.questao === (q.numero || q.questao_numero))?.resposta || ''
      }));
    }
    return [];
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
  };

  const applyGlossary = (text) => {
    if (!text) return '';
    let formatted = text;
    Object.keys(glossary).forEach(term => {
      const regex = new RegExp(`\\b(${term})\\b`, 'gi');
      formatted = formatted.replace(regex, `<span class="glossary-term">$1<span class="glossary-tooltip">${glossary[term]}</span></span>`);
    });
    return formatted;
  };

  const selectOpt = (qNum, el) => {
    const selector = `.q-${qNum}-opt`;
    document.querySelectorAll(selector).forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    setSelectedOptions(prev => ({ ...prev, [qNum]: el }));
  };

  const scrollToQuestion = (num) => {
    const el = document.getElementById(`q-anchor-${num}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const generateStyledPDF = async (edition, questions) => {
    const doc = new jsPDF();
    const navy = '#0f172a';
    const gold = '#C5A059';

    doc.setFillColor(navy);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(gold);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Audit Educa', 105, 20, { align: 'center' });
    doc.setTextColor(navy);
    doc.setFontSize(14);
    doc.text(`Exame de Suficiência - Edição ${edition}`, 105, 40, { align: 'center' });

    let y = 55;
    questions.forEach((q, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 30;
        doc.setFillColor(navy);
        doc.rect(0, 0, 210, 15, 'F');
        doc.setTextColor(gold);
        doc.setFontSize(10);
        doc.text(`Audit Educa - Edição ${edition}`, 105, 10, { align: 'center' });
        y = 25;
      }
      doc.setTextColor(navy);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Q${q.number}:`, 20, y);
      doc.setFont('helvetica', 'normal');
      const textLines = doc.splitTextToSize(q.text, 170);
      doc.text(textLines, 25, y + 5);
      y += (textLines.length * 5) + 5;

      if (q.options) {
        q.options.forEach((opt, i) => {
          if (y > 280) { doc.addPage(); y = 30; }
          doc.setTextColor('#334155');
          doc.setFont('helvetica', 'normal');
          const optText = `${opt.letter}) ${opt.text}`;
          const optLines = doc.splitTextToSize(optText, 165);
          doc.text(optLines, 30, y);
          y += (optLines.length * 5) + 2;
        });
      }
      y += 8;
    });

    doc.addPage();
    doc.setFillColor(navy);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(gold);
    doc.setFontSize(18);
    doc.text('Gabarito Oficial', 105, 20, { align: 'center' });
    let gabY = 40;
    questions.forEach(q => {
      if (gabY > 280) { doc.addPage(); gabY = 30; }
      doc.setTextColor(navy);
      doc.setFont('helvetica', 'bold');
      doc.text(`Q${q.number}:`, 20, gabY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(gold);
      doc.text(q.gabarito || '-', 40, gabY);
      gabY += 8;
    });

    doc.save(`exame_suficiencia_${edition.replace('.', '_')}.pdf`);
    showToastMessage(`PDF da edição ${edition} gerado com sucesso!`);
  };

  const downloadExamAsPDF = async (edition, url) => {
    showToastMessage(`Gerando PDF da edição ${edition}...`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro ao carregar dados');
      const data = await res.json();
      const questions = transformExamData(data);
      await generateStyledPDF(edition, questions);
    } catch (e) {
      showToastMessage('Erro ao gerar PDF. Tente novamente.');
      console.error(e);
    }
  };

  const downloadBatch = async () => {
    if (cartItems.size === 0) {
      showToastMessage('Cesta vazia. Adicione provas com o ícone de cesta.');
      return;
    }
    showToastMessage(`Gerando PDFs de ${cartItems.size} edições...`);
    for (let edition of cartItems) {
      const exam = editionsData.find(e => e.edition === edition);
      if (exam) {
        await downloadExamAsPDF(exam.edition, exam.url);
        await new Promise(r => setTimeout(r, 500));
      }
    }
  };

  const printExam = async (edition, url) => {
    await openPreview(edition, url);
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const renderProg = () => {
    return syllabus.map((item, idx) => (
      <div key={idx} className="prog-card">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-sm font-bold text-audit-navy">{item.topic}</h3>
          <span className="bg-slate-100 text-audit-navy text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">{item.q} Q</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
      </div>
    ));
  };

  const createEditionCard = (ed) => {
    const isSaved = savedItems.has(ed.edition);
    const inCart = cartItems.has(ed.edition);
    return (
      <div key={ed.edition} className="flex flex-col gap-4 group exam-item" data-year={ed.edition}>
        <div className="exam-page-cover w-full">
          <div className="svg-texture"></div>
          <div className="cover-frame"></div>
          <div className="card-actions-top">
            <button onClick={() => toggleSave(ed.edition)} className={`card-btn-icon ${isSaved ? 'active-save' : ''}`} title="Salvar">
              <i className={isSaved ? 'fas fa-bookmark' : 'far fa-bookmark'}></i>
            </button>
            <button onClick={() => toggleCart(ed.edition)} className={`card-btn-icon ${inCart ? 'active-cart' : ''}`} title="Adicionar à Cesta">
              <i className={inCart ? 'fas fa-check' : 'fas fa-shopping-basket'}></i>
            </button>
            <button onClick={() => printExam(ed.edition, ed.url)} className="card-btn-icon" title="Imprimir Prova">
              <i className="fas fa-print text-[12px]"></i>
            </button>
          </div>
          <div className="relative z-10 p-5 sm:p-8 h-full flex flex-col items-center justify-center text-center w-full mt-2">
            <div className="w-12 h-0.5 bg-audit-gold mb-5 opacity-50"></div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-inner border border-slate-200 flex items-center justify-center mb-5 overflow-hidden relative">
              <div className="absolute inset-1 border border-dashed border-slate-300 rounded-full"></div>
              <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=150&q=80" alt="Exame" className="w-full h-full object-cover opacity-60 mix-blend-luminosity rounded-full" />
            </div>
            <h3 className="font-serif font-black text-audit-navy uppercase leading-tight text-base sm:text-lg tracking-widest px-2">
              Exame de<br />Suficiência
            </h3>
            <p className="mt-4 text-[8px] sm:text-[9px] uppercase font-bold text-slate-400 tracking-[0.2em]">Edição Oficial</p>
            <div className="mt-1 text-audit-gold font-serif text-lg sm:text-xl font-black">{ed.edition}</div>
          </div>
        </div>
        <div className="flex shadow-sm rounded-xl overflow-hidden border border-slate-200">
          <button onClick={() => openPreview(ed.edition, ed.url)} className="btn-view-premium group-hover:bg-slate-50">
            <i className="fas fa-eye text-audit-gold"></i> Visualizar
          </button>
          <button onClick={() => downloadExamAsPDF(ed.edition, ed.url)} className="btn-download-premium">
            <i className="fas fa-download text-audit-gold"></i> PDF
          </button>
        </div>
      </div>
    );
  };

  const renderQuestions = () => {
    if (!examData.length) {
      return <p className="text-center text-slate-400">Nenhuma questão disponível para esta edição.</p>;
    }
    return examData.map(q => (
      <div key={q.number} id={`q-anchor-${q.number}`} className="question-block">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-audit-navy text-white font-black text-sm w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg">
            {q.number}
          </div>
          <div 
            className="question-text flex-1 text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ 
              __html: q.text.split('\n').map(p => {
                if (p.includes('<table')) return p;
                return `<p class="mb-4">${applyGlossary(p)}</p>`;
              }).join('')
            }}
          />
        </div>
        <div className="pl-0 sm:pl-14 space-y-3">
          {q.options && q.options.map(opt => (
            <div 
              key={opt.letter} 
              className={`option-item q-${q.number}-opt`} 
              onClick={(e) => selectOpt(q.number, e.currentTarget)}
            >
              <div className="option-letter font-bold text-audit-navy bg-gray-100 w-8 h-8 rounded flex items-center justify-center shrink-0">
                {opt.letter}
              </div>
              <div className="option-content">{opt.text}</div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const renderGabarito = () => {
    if (!examData.length) return null;
    return examData.map(q => (
      <div 
        key={q.number}
        className="border border-gray-200 p-2 rounded flex justify-between items-center dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => scrollToQuestion(q.number)}
      >
        <span className="text-[10px] font-bold">Q {q.number}</span>
        <span className="font-black text-audit-gold" style={{ color: '#C5A059' }}>{q.gabarito || '-'}</span>
      </div>
    ));
  };

  const generateSidebarThumbs = () => {
    const steps = 5;
    const thumbs = [];
    for (let i = 1; i <= examData.length; i += steps) {
      thumbs.push(
        <div key={i} className="nav-thumb" onClick={() => scrollToQuestion(i)}>
          <i className="fas fa-file-text w-4 h-4 mb-1"></i>
          Questões {i}-{Math.min(i + steps - 1, examData.length)}
        </div>
      );
    }
    return thumbs;
  };

  return (
    <>
      {/* Toast Notification */}
      <div 
        className={`fixed bottom-20 sm:bottom-10 left-1/2 -translate-x-1/2 bg-audit-navy text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] shadow-2xl transition-all duration-300 z-[9999] pointer-events-none border border-audit-gold/30 whitespace-nowrap ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <i className="fas fa-info-circle text-audit-gold mr-2"></i> {toastMessage}
      </div>

      {/* Barra de Foco de Leitura */}
      <div 
        ref={readingBarRef} 
        className={`fixed pointer-events-none left-0 right-0 h-[35px] bg-audit-gold/15 border-t border-b border-audit-gold/30 z-[10000] shadow-lg ${isFocusMode ? 'block' : 'hidden'}`}
      ></div>

      {/* Header */}
      <Header />

      {/* ALERT BANNER */}
      <div className="bg-gradient-to-r from-audit-navy to-slate-800 text-white text-center py-3 px-4 text-sm font-medium sticky top-0 z-[100] shadow-md flex justify-center items-center flex-wrap gap-4 border-b border-audit-gold/30">
        <span><i className="fas fa-bullhorn text-audit-gold mr-2"></i> Exame de Suficiência: Inscrições <span className="text-audit-gold font-bold uppercase tracking-widest mx-1">Abertas</span> para a edição 2026.1!</span>
        <a href="#inscricao" className="bg-audit-gold text-audit-navy px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-sm">Inscreva-se</a>
      </div>

      {/* BARRA LATERAL DE FERRAMENTAS */}
      <aside className="sidebar-left-tools no-print">
        <button className="tool-btn" onClick={() => document.getElementById('acervo')?.scrollIntoView({ behavior: 'smooth' })} title="Acervo">
          <i className="fas fa-book"></i>
          <span className="btn-label">Provas</span>
        </button>
        <button className="tool-btn" onClick={() => showToastMessage('Visualizando Estatísticas...')} title="Dados">
          <i className="fas fa-chart-pie"></i>
          <span className="btn-label">Dados</span>
        </button>
        <button className="tool-btn" onClick={() => showToastMessage('Visualizando Provas Salvas...')} title="Provas Salvas">
          <i className="fas fa-bookmark"></i>
          <span className="btn-label">Salvos</span>
          <span id="save-badge" className="badge-count hidden" style={{ background: '#1e40af' }}>{savedItems.size}</span>
        </button>
        <button className="tool-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="Voltar ao Topo">
          <i className="fas fa-chevron-up"></i>
          <span className="btn-label">Topo</span>
        </button>
      </aside>

      <main className="flex-grow pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto content-wrapper space-y-20">
          {/* BREADCRUMB E HERO */}
          <div>
            <nav className="flex mb-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest no-print">
              <ol className="flex items-center gap-2">
                <li><Link to="/" className="hover:text-audit-gold transition">Dashboard</Link></li>
                <li><i className="fas fa-chevron-right text-[8px]"></i></li>
                <li>Suficiência</li>
                <li><i className="fas fa-chevron-right text-[8px]"></i></li>
                <li className="text-audit-gold underline underline-offset-4 tracking-widest">Guia & Acervo Oficial</li>
              </ol>
            </nav>
            <div className="text-center lg:text-left lg:flex lg:justify-between lg:items-end gap-10">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-serif font-black text-audit-navy tracking-tighter mb-4 leading-none">Exame de Suficiência</h1>
                <p className="text-slate-500 text-base sm:text-lg font-light leading-relaxed">O repositório técnico definitivo para bacharéis em Ciências Contábeis. Acervo oficial atualizado, estatísticas de aprovação e simulados estruturados.</p>
              </div>
            </div>
          </div>

          {/* SEÇÃO SOBRE O EXAME */}
          <section id="sobre">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
              <i className="fas fa-circle-info text-audit-gold text-xs"></i>
              <h2 className="text-[11px] font-black text-audit-navy uppercase tracking-[0.2em]">Diretrizes Oficiais do Exame</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-audit-gold transition-colors">
                <i className="fas fa-file-signature text-2xl text-audit-gold mb-4"></i>
                <h3 className="font-serif text-lg font-bold text-audit-navy mb-2">O Objetivo</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Instituído pela Lei nº 12.249/2010, o exame comprova a obtenção de conhecimentos médios técnicos exigidos pelas diretrizes do MEC.</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-audit-gold transition-colors">
                <i className="fas fa-user-graduate text-2xl text-audit-gold mb-4"></i>
                <h3 className="font-serif text-lg font-bold text-audit-navy mb-2">Requisito Profissional</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Etapa obrigatória para obtenção do registro profissional no Conselho Regional de Contabilidade (CRC) aos Bacharéis em Contábeis.</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-audit-gold transition-colors">
                <i className="fas fa-list-check text-2xl text-audit-gold mb-4"></i>
                <h3 className="font-serif text-lg font-bold text-audit-navy mb-2">Estrutura da Prova</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Composta por 50 questões objetivas. A aprovação exige 50% de acertos (mínimo de 25 questões corretas).</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-audit-gold transition-colors">
                <i className="fas fa-calendar-alt text-2xl text-audit-gold mb-4"></i>
                <h3 className="font-serif text-lg font-bold text-audit-navy mb-2">Aplicação</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Aplicado semestralmente em todo o território nacional. A última edição validada foi a 2025.2.</p>
              </div>
            </div>
          </section>

          {/* CONTEÚDO E ESTATÍSTICAS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <section id="conteudo">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                <i className="fas fa-book-open text-audit-gold text-xs"></i>
                <h2 className="text-[11px] font-black text-audit-navy uppercase tracking-[0.2em]">Conteúdo Programático</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="prog-grid">
                {renderProg()}
              </div>
            </section>
            <section id="estatisticas">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                <i className="fas fa-chart-line text-audit-gold text-xs"></i>
                <h2 className="text-[11px] font-black text-audit-navy uppercase tracking-[0.2em]">Estatísticas de Aprovação</h2>
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="w-full h-[350px]">
                  <canvas ref={chartRef} id="approvalChart"></canvas>
                </div>
                <p className="text-[9px] text-slate-400 mt-4 text-center leading-relaxed font-medium">As edições em andamento não constam na média histórica oficial.</p>
              </div>
            </section>
          </div>

          {/* ACERVO DE EDIÇÕES */}
          <section id="acervo" className="pt-10">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
              <i className="fas fa-layer-group text-audit-gold text-xs"></i>
              <h2 className="text-[11px] font-black text-audit-navy uppercase tracking-[0.2em]">Repositório de Edições</h2>
            </div>

            {/* PAINEL DE CONTROLE */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between no-print">
              <div className="relative w-full md:w-1/3">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar ano ou edição..." 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-audit-gold transition"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <i className="fas fa-sort-amount-down text-slate-400 text-xs"></i>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent text-[10px] font-bold text-audit-navy uppercase outline-none cursor-pointer w-full tracking-widest"
                >
                  <option value="desc">Mais Recentes</option>
                  <option value="asc">Mais Antigos</option>
                </select>
              </div>
              <div className="flex items-center justify-between gap-6 w-full md:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Na Cesta</span>
                  <span className="text-xs font-semibold text-audit-navy"><span id="toolbar-cart-count">{cartItems.size}</span> Arquivos</span>
                </div>
                <button onClick={downloadBatch} className="bg-audit-navy text-white px-4 py-2 rounded-lg text-[9px] uppercase font-bold tracking-wider hover:bg-audit-gold transition shadow-md">
                  Baixar Lote (PDF)
                </button>
              </div>
            </div>

            {/* Grid de Capas A4 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8" id="edicoes-grid">
              {filteredEditions.map(createEditionCard)}
            </div>
          </section>

          {/* CTA APROVADOS */}
          <section className="mt-10 bg-audit-navy rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden group shadow-2xl no-print">
            <div className="absolute -right-10 -bottom-20 opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12">
              <i className="fas fa-trophy text-[22rem]"></i>
            </div>
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <p className="text-audit-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Você venceu a jornada</p>
              <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 leading-tight">Você foi aprovado? Parabéns!</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-10">O esforço técnico gerou resultados. Celebre a conquista e inspire futuros profissionais gerando o seu card oficial.</p>
              <button onClick={() => showToastMessage('A redirecionar para gerador de cards...')} className="inline-flex items-center gap-4 bg-audit-gold text-audit-navy px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl">
                <i className="fas fa-share-nodes"></i> Criar Card de Aprovação
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* MODAL DO VISUALIZADOR PREMIUM */}
      {modalOpen && (
        <div 
          id="preview-modal" 
          className="fixed inset-0 bg-gray-900/95 flex flex-col opacity-100 transition-opacity duration-300 z-[9000]"
          ref={modalRef}
        >
          {/* CABEÇALHO DE FERRAMENTAS */}
          <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 z-[9001] shrink-0 no-print">
            <div className="flex items-center gap-4">
              <button onClick={() => document.getElementById('pdf-sidebar')?.classList.toggle('hidden')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500" title="Miniaturas">
                <i className="fas fa-panel-left w-5 h-5"></i>
              </button>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"></div>
              <h4 className="text-xs font-black text-audit-navy dark:text-audit-gold uppercase tracking-tighter hidden md:block">Exame CFC {currentEdition}</h4>
            </div>

            {/* Controles de Leitura */}
            <div className="flex items-center gap-2">
              <button onClick={() => setIsSplitMode(!isSplitMode)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500" title="Lado a Lado">
                <i className="fas fa-columns w-5 h-5"></i>
              </button>
              <button onClick={() => setIsFocusMode(!isFocusMode)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500" title="Foco de Leitura">
                <i className="fas fa-underline w-5 h-5"></i>
              </button>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
              <button onClick={() => setFontSizeBase(prev => Math.max(12, prev - 2))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500" title="Diminuir Fonte">
                <i className="fas fa-minus-circle w-5 h-5"></i>
              </button>
              <button onClick={() => setFontSizeBase(prev => Math.min(30, prev + 2))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500" title="Aumentar Fonte">
                <i className="fas fa-plus-circle w-5 h-5"></i>
              </button>
              <button onClick={() => window.print()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 ml-2" title="Imprimir Prova">
                <i className="fas fa-print w-5 h-5"></i>
              </button>
            </div>

            {/* Ações Rápidas */}
            <div className="flex items-center gap-3">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500" title="Modo Noturno">
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} w-5 h-5`}></i>
              </button>
              <button onClick={closeModal} className="bg-audit-navy text-white p-2 rounded-lg hover:scale-105 transition-transform" title="Fechar">
                <i className="fas fa-times w-5 h-5"></i>
              </button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            {/* BARRA LATERAL (MINIATURAS) */}
            <aside id="pdf-sidebar" className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto custom-scroll p-4 hidden md:block no-print">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-widest">Navegação</p>
              <div id="sidebar-thumbs">
                {generateSidebarThumbs()}
              </div>
            </aside>

            {/* ÁREA DO DOCUMENTO */}
            <div id="document-scroll" className="flex-1 overflow-y-auto bg-gray-200 dark:bg-gray-950 p-4 sm:p-12 custom-scroll relative">
              <div 
                ref={paperRef}
                id="paper-container" 
                className={`preview-paper p-8 sm:p-20 transform scale-95 transition-all duration-500 mx-auto dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl bg-white min-h-[1000px] max-w-[850px] mb-20`}
                style={{ fontSize: `${fontSizeBase}px` }}
              >
                <div id="split-layout" className={`grid gap-12 transition-all duration-300 ${isSplitMode ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  <div id="main-content-col">
                    {/* Cabeçalho com logo e identidade visual */}
                    <div className="text-center mb-10 pb-6 border-b-2 border-gray-100 dark:border-gray-800 flex flex-col items-center">
                      <img 
                        src="https://auditeduca.com.br/assets/images/tests/simulado-prova-exame-suficiencia-carteirinha-contabilidade-contador-contabilista.avif" 
                        alt="Audit Educa Logo" 
                        className="w-20 h-20 mb-4 object-contain"
                      />
                      <h1 className="text-2xl font-black text-audit-navy dark:text-white uppercase tracking-widest mb-2">
                        Exame de Suficiência <span id="paper-edition">{currentEdition}</span>
                      </h1>
                      <p className="text-[10px] text-gray-400 italic">Material de estudo - Acervo Audit Educa</p>
                    </div>
                    <div id="content-questions" className="space-y-4">
                      {renderQuestions()}
                    </div>
                  </div>

                  {/* Coluna de Gabarito (Modo Lado a Lado) */}
                  <div id="secondary-content-col" className={`border-l border-gray-100 dark:border-gray-800 pl-8 ${isSplitMode ? 'block' : 'hidden'}`}>
                    <h3 className="text-lg font-black text-audit-navy dark:text-audit-gold uppercase mb-6 flex items-center gap-2">
                      <i className="fas fa-check-square w-5 h-5"></i> Gabarito
                    </h3>
                    <div className="grid grid-cols-2 gap-2" id="gabarito-grid-container">
                      {renderGabarito()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Estilos específicos da página (incluir se necessário) */}
      <style>{`
        .sidebar-left-tools {
          position: fixed; left: 0; top: 50%; transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 12px; z-index: 900; padding: 10px 0;
        }
        .tool-btn {
          background-color: white; color: #0f172a; border: 1px solid #e2e8f0; border-left: none;
          width: 54px; height: 54px; border-radius: 0 14px 14px 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 4px 0 10px rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative;
        }
        .tool-btn:focus-visible { outline: 2px solid #C5A059; }
        .tool-btn:hover, .tool-btn.active { width: 65px; background-color: #0f172a; color: #C5A059; padding-left: 5px; }
        .btn-label {
          display: none; position: absolute; left: 60px; background: #0f172a; color: white;
          padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: bold;
          white-space: nowrap; pointer-events: none; opacity: 0; transform: translateX(-10px); transition: all 0.2s;
        }
        .tool-btn:hover .btn-label { display: block; opacity: 1; transform: translateX(0); }

        @media (max-width: 768px) {
          .sidebar-left-tools {
            top: auto; bottom: 0; left: 0; width: 100%; height: 70px;
            flex-direction: row; transform: none; justify-content: space-around;
            align-items: center; background: white; border-top: 1px solid #e2e8f0;
            border-radius: 0; box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.08); padding: 0 5px; z-index: 1001;
          }
          .tool-btn { border: none; width: auto; height: 100%; flex: 1; gap: 4px; box-shadow: none; background: transparent; }
          .tool-btn:hover, .tool-btn.active { width: auto; background: transparent; color: #0f172a; padding-left: 0; }
          .btn-label { display: block; position: static; background: transparent; color: currentColor; font-size: 9px; padding: 0; opacity: 1; transform: none; }
          body { padding-bottom: 90px; }
        }
        .exam-page-cover {
          aspect-ratio: 1 / 1.414;
          background: #ffffff;
          position: relative;
          transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .exam-page-cover:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          border-color: #C5A059;
        }
        .card-actions-top {
          position: absolute; top: 20px; right: 20px; display: flex; gap: 8px; z-index: 20;
        }
        .card-btn-icon {
          color: #94a3b8;
          background-color: rgba(255,255,255,0.9);
          backdrop-filter: blur(4px);
          border-radius: 9999px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #f1f5f9;
          cursor: pointer;
          transition: color 0.2s;
        }
        .card-btn-icon:hover { color: #0f172a; }
        .card-btn-icon.active-save { color: #C5A059; border-color: #C5A059; }
        .card-btn-icon.active-cart { color: #1e40af; border-color: #1e40af; }
        .btn-download-premium {
          flex: 1; background-color: #0f172a; color: white; font-size: 8px; font-weight: 900;
          text-transform: uppercase; letter-spacing: 0.1em; padding: 12px 0;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          border: none; border-top: 1px solid rgba(255,255,255,0.05); cursor: pointer;
          transition: all 0.2s;
        }
        .btn-download-premium:hover { background-color: #1e293b; }
        .btn-view-premium {
          flex: 1; background-color: white; color: #0f172a; font-size: 8px; font-weight: 900;
          text-transform: uppercase; letter-spacing: 0.1em; padding: 12px 0;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          border: none; border-right: 1px solid #e2e8f0; cursor: pointer;
          transition: all 0.2s;
        }
        .btn-view-premium:hover { background-color: #f8fafc; }
      `}</style>
    </>
  );
};

export default ExameSuficiencia;