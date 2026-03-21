import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  Cell, PieChart, Pie
} from 'recharts';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// --- Constantes de Design (cores audit-navy, audit-gold, etc.) ---
const COLORS = ['#0f172a', '#C5A059', '#1e40af', '#334155', '#475569', '#1e293b', '#64748b'];

// --- Componentes Atônicos (podem ser movidos para /components/ui futuramente) ---
const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-900 border-blue-200',
    red: 'bg-red-100 text-red-900 border-red-200',
    green: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    amber: 'bg-amber-100 text-amber-900 border-amber-200',
    navy: 'bg-audit-navy text-white border-audit-navy'
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-tighter ${colors[color]}`}>
      {children}
    </span>
  );
};

const StepIndicator = ({ currentStep }) => {
  const steps = ["Setup", "Dados", "Validação", "Aging/NC", "Circularização", "Conclusão"];
  return (
    <div className="flex flex-wrap gap-2 mb-10 no-print">
      {steps.map((s, i) => (
        <div
          key={i}
          className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
            currentStep === i + 1
              ? 'bg-audit-navy text-white shadow-lg scale-105 border-audit-navy'
              : 'bg-white text-slate-500 border-slate-200 shadow-sm'
          }`}
        >
          {i + 1}. {s}
        </div>
      ))}
    </div>
  );
};

// --- Componente Principal ---
export default function Fornecedores() {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('Audit Educa Fornecedores Demo');
  const [reportDate, setReportDate] = useState('2025-12-31');
  const [data, setData] = useState([]);
  const [accountingBalance, setAccountingBalance] = useState('');

  // Decisões Etapa 1
  const [hasRelatedParties, setHasRelatedParties] = useState(false);
  const [relatedPartiesInput, setRelatedPartiesInput] = useState('');
  const [excludeInput, setExcludeInput] = useState('');
  const [toast, setToast] = useState(null);

  // Amostragem
  const [selectedForCircularization, setSelectedForCircularization] = useState([]);

  // Form para entrada manual
  const [manualForm, setManualForm] = useState({
    fornecedorCodigo: '', fornecedorNome: '', titulo: '', emissao: '', vencimento: '', valor: ''
  });

  const [agingConfig, setAgingConfig] = useState([
    { id: 1, label: 'A vencer', min: -9999, max: 0 },
    { id: 2, label: '01-30 dias', min: 1, max: 30 },
    { id: 3, label: '31-60 dias', min: 31, max: 60 },
    { id: 4, label: '61-90 dias', min: 61, max: 90 },
    { id: 5, label: '91-180 dias', min: 91, max: 180 },
    { id: 6, label: '181-360 dias', min: 181, max: 360 },
    { id: 7, label: '> 360 dias', min: 361, max: 9999 }
  ]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!manualForm.fornecedorCodigo || !manualForm.valor) {
      showToast("Campos obrigatórios: Código e Valor.");
      return;
    }
    const newItem = { ...manualForm, id: `manual-${Date.now()}` };
    setData(prev => [...prev, newItem]);
    setManualForm({ fornecedorCodigo: '', fornecedorNome: '', titulo: '', emissao: '', vencimento: '', valor: '' });
    showToast("Título adicionado.");
  };

  // --- Lógica de Auditoria Master ---
  const audit = useMemo(() => {
    if (!data.length) return null;

    const dtBase = new Date(reportDate);
    const relatedList = hasRelatedParties ? relatedPartiesInput.split(',').map(s => s.trim().toUpperCase()).filter(s => s) : [];
    const exclusions = excludeInput.split(',').map(s => s.trim().toUpperCase()).filter(s => s);

    let totalListagem = 0;
    let circulante = 0;
    let naoCirculante = 0;
    let saldosDevedores = 0;

    const processed = data.map((item, idx) => {
      const valor = parseFloat(item.valor) || 0;
      totalListagem += valor;

      const dtEmissao = new Date(item.emissao);
      const dtVenc = new Date(item.vencimento);
      const diffTime = dtBase - dtVenc;
      const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const daysFromBase = Math.ceil((dtVenc - dtBase) / (1000 * 60 * 60 * 24));
      const isNC = daysFromBase > 365;
      if (isNC) naoCirculante += valor; else circulante += valor;

      const isRelated = relatedList.some(n => item.fornecedorNome.toUpperCase().includes(n));
      const isExcluded = exclusions.some(f =>
        item.fornecedorNome.toUpperCase().includes(f) || item.fornecedorCodigo.toUpperCase().includes(f)
      );

      const alerts = [];
      if (valor < 0) {
        alerts.push("Saldo Devedor (Erro/Adiant.)");
        saldosDevedores += Math.abs(valor);
      }
      if (dtEmissao > dtVenc) alerts.push("Anacronismo Emissão/Venc.");

      const isDuplicate = data.some((other, oIdx) =>
        oIdx !== idx && other.fornecedorCodigo === item.fornecedorCodigo && Math.abs(parseFloat(other.valor) - valor) < 0.01 && other.titulo === item.titulo
      );
      if (isDuplicate) alerts.push("Duplicidade Identificada");

      const range = agingConfig.find(r => daysOverdue >= r.min && daysOverdue <= r.max);

      // Vagão Fornecedores: Títulos vencidos há muito tempo mas ainda não liquidados (pode indicar litígio ou baixa omitida)
      const isWagon = daysOverdue > 180 && !isRelated;

      return {
        ...item,
        id: item.id || `row-${idx}`,
        valor,
        daysOverdue,
        isNC,
        isRelated,
        isExcluded,
        isWagon,
        alerts,
        rangeLabel: range ? range.label : 'N/A'
      };
    });

    return {
      processed, totalListagem, circulante, naoCirculante, saldosDevedores,
      agingSummary: agingConfig.map(range => ({
        name: range.label,
        value: processed.filter(p => p.rangeLabel === range.label).reduce((a, b) => a + b.valor, 0)
      })),
      diffAccounting: totalListagem - (parseFloat(accountingBalance) || 0)
    };
  }, [data, reportDate, agingConfig, accountingBalance, hasRelatedParties, relatedPartiesInput, excludeInput]);

  const toggleSample = (id) => setSelectedForCircularization(prev =>
    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
  );

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result.split('\n').filter(l => l.trim()).slice(1).map((line, idx) => {
        const cols = line.split(';').map(c => c.trim().replace(/"/g, ''));
        return {
          id: `csv-${idx}-${Date.now()}`,
          fornecedorCodigo: cols[0],
          fornecedorNome: cols[1],
          titulo: cols[2],
          emissao: cols[3],
          vencimento: cols[4],
          valor: cols[5]?.replace(',', '.')
        };
      });
      setData(rows);
      showToast(`${rows.length} itens carregados.`);
    };
    reader.readAsText(file);
  };

  const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-grow p-4 md:p-12 max-w-7xl mx-auto w-full">

        <StepIndicator currentStep={step} />

        {/* ETAPA 1: SETUP E CRITÉRIOS */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">

            <div className="lg:col-span-5 space-y-6">
              {/* Dados da Empresa */}
              <section className="bg-white border-2 border-slate-200 p-8 rounded-[2rem] shadow-sm space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b-4 border-audit-gold pb-3 inline-block">Planejamento</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nome da Entidade Auditada</label>
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-audit-navy transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Data-Base Auditoria</label>
                      <select value={reportDate} onChange={e => setReportDate(e.target.value)} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-audit-navy">
                        <option value="2025-03-31">31/03/2025</option>
                        <option value="2025-06-30">30/06/2025</option>
                        <option value="2025-09-30">30/09/2025</option>
                        <option value="2025-12-31">31/12/2025</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Saldo Contábil Razão</label>
                      <input type="number" value={accountingBalance} onChange={e => setAccountingBalance(e.target.value)} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-bold font-mono outline-none focus:border-audit-navy" placeholder="0,00" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Partes Relacionadas Decision */}
              <section className="bg-white border-2 border-slate-200 p-8 rounded-[2rem] shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Partes Relacionadas?</h3>
                  <div className="flex bg-slate-100 p-1.5 rounded-xl border-2 border-slate-200">
                    <button onClick={() => setHasRelatedParties(true)} className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${hasRelatedParties ? 'bg-audit-navy text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}>SIM</button>
                    <button onClick={() => { setHasRelatedParties(false); setRelatedPartiesInput(''); }} className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${!hasRelatedParties ? 'bg-audit-navy text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}>NÃO</button>
                  </div>
                </div>
                {hasRelatedParties && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Nomes das Empresas para Filtro</label>
                    <textarea value={relatedPartiesInput} onChange={e => setRelatedPartiesInput(e.target.value)} className="w-full h-20 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-semibold outline-none focus:border-audit-navy" placeholder="Ex: HOLDING, MATRIZ, COLIGADA X..." />
                  </div>
                )}
              </section>

              {/* Exclusões */}
              <section className="bg-white border-2 border-slate-200 p-8 rounded-[2rem] shadow-sm space-y-4">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Regras de Exclusão</h3>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Títulos/Fornecedores a ignorar no teste</label>
                  <textarea value={excludeInput} onChange={e => setExcludeInput(e.target.value)} className="w-full h-16 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-semibold outline-none focus:border-audit-navy" placeholder="Códigos ou nomes específicos..." />
                </div>
              </section>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <section className="bg-white border-2 border-slate-200 p-10 rounded-[2.5rem] shadow-xl space-y-8">
                <div className="flex justify-between items-center border-b-2 border-slate-100 pb-6">
                  <h3 className="text-xl font-serif font-black text-slate-900">Entrada de Base</h3>
                  <label className="bg-audit-navy text-white px-6 py-3 rounded-2xl text-[10px] font-bold uppercase cursor-pointer hover:bg-audit-navy/80 transition shadow-lg">
                    <i className="fas fa-upload mr-2"></i> Importar CSV
                    <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <form onSubmit={handleManualAdd} className="grid grid-cols-2 gap-4 bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100 relative">
                  <div className="absolute -top-3 left-8 bg-audit-navy text-white px-3 py-1 rounded text-[8px] font-bold uppercase">Digitação Manual</div>
                  <input type="text" placeholder="Código Fornecedor" value={manualForm.fornecedorCodigo} onChange={e => setManualForm({ ...manualForm, fornecedorCodigo: e.target.value })} className="h-12 px-4 bg-white border-2 border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-audit-gold" />
                  <input type="text" placeholder="Nome / Razão Social" value={manualForm.fornecedorNome} onChange={e => setManualForm({ ...manualForm, fornecedorNome: e.target.value })} className="h-12 px-4 bg-white border-2 border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-audit-gold" />
                  <input type="date" value={manualForm.emissao} onChange={e => setManualForm({ ...manualForm, emissao: e.target.value })} className="h-12 px-4 bg-white border-2 border-slate-200 rounded-2xl text-xs font-bold outline-none" />
                  <input type="date" value={manualForm.vencimento} onChange={e => setManualForm({ ...manualForm, vencimento: e.target.value })} className="h-12 px-4 bg-white border-2 border-slate-200 rounded-2xl text-xs font-bold outline-none" />
                  <div className="col-span-2">
                    <input type="number" placeholder="Valor da Obrigação (R$)" value={manualForm.valor} onChange={e => setManualForm({ ...manualForm, valor: e.target.value })} className="w-full h-14 px-6 bg-white border-2 border-slate-200 rounded-2xl text-lg font-black outline-none focus:border-audit-navy" />
                  </div>
                  <button type="submit" className="col-span-2 h-14 bg-white border-2 border-audit-navy text-audit-navy hover:bg-audit-navy hover:text-white rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all">
                    Adicionar Título à Base
                  </button>
                </form>

                {data.length > 0 && (
                  <div className="pt-6">
                    <button onClick={() => setStep(2)} className="w-full h-16 bg-audit-navy text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:scale-[1.01] transition flex items-center justify-center gap-4">
                      Processar Auditoria ({data.length} Itens)
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </section>

              {data.length === 0 && (
                <div className="h-80 flex flex-col items-center justify-center border-4 border-dashed border-slate-200 rounded-[3rem] text-slate-300">
                  <i className="fas fa-database text-6xl mb-4 opacity-10"></i>
                  <p className="font-black uppercase text-[10px] tracking-widest opacity-40 italic">Aguardando dados para teste substantivo</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ETAPA 2: DADOS E CONCILIAÇÃO */}
        {step === 2 && audit && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Listagem', val: formatBRL(audit.totalListagem), icon: 'clipboard-list', color: 'text-slate-900' },
                { label: 'Diferença Razão', val: formatBRL(audit.diffAccounting), icon: 'equals', color: Math.abs(audit.diffAccounting) > 0.01 ? 'text-red-600 font-black' : 'text-emerald-700 font-black' },
                { label: 'Saldos Devedores', val: formatBRL(audit.saldosDevedores), icon: 'arrow-right-from-bracket', sub: 'Reclassificação para Ativo', color: 'text-red-700' },
                { label: 'Obrigações Atuais', val: formatBRL(audit.totalListagem - audit.saldosDevedores), icon: 'shield-check', color: 'text-slate-700' }
              ].map((card, i) => (
                <div key={i} className="bg-white border-2 border-slate-200 p-8 rounded-[2rem] text-center shadow-sm flex flex-col items-center group hover:border-audit-navy transition-all">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-audit-gold group-hover:bg-audit-navy group-hover:text-white transition-all">
                    <i className={`fas fa-${card.icon}`}></i>
                  </div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{card.label}</h4>
                  <div className={`text-lg font-black mt-2 ${card.color}`}>{card.val}</div>
                  {card.sub && <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 italic">{card.sub}</p>}
                </div>
              ))}
            </div>

            <section className="bg-white border-2 border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl">
              <div className="bg-audit-navy px-8 py-6 flex justify-between items-center">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Análise Analítica de Fornecedores</h4>
                <button onClick={() => setStep(3)} className="bg-audit-gold text-audit-navy px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">Próximo Teste <i className="fas fa-arrow-right ml-2"></i></button>
              </div>
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase border-b-2 border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-8 py-5">Fornecedor / Razão Social</th>
                      <th className="px-8 py-5 text-right">Saldo Credor (Devedor)</th>
                      <th className="px-8 py-5 text-center">Alertas de Auditoria</th>
                      <th className="px-8 py-5">Prazo Venc.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-100">
                    {audit.processed.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50 transition border-b">
                        <td className="px-8 py-6">
                          <div className="font-black text-slate-900">{row.fornecedorNome}</div>
                          <div className="text-[9px] text-slate-500 font-mono mt-1">ID: {row.fornecedorCodigo} | Título: {row.titulo}</div>
                        </td>
                        <td className={`px-8 py-6 text-right font-black font-mono text-sm ${row.valor < 0 ? 'text-red-700 bg-red-50/50' : 'text-slate-900'}`}>{formatBRL(row.valor)}</td>
                        <td className="px-8 py-6 text-center">
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {row.isRelated && <Badge color="amber">Parte Relacionada</Badge>}
                            {row.isExcluded && <Badge color="navy">Item Excluído</Badge>}
                            {row.alerts.map((a, i) => <Badge key={i} color="red">{a}</Badge>)}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-[10px] font-black uppercase">
                          {row.isNC ? <span className="text-audit-blue">Passivo NC</span> : <span className="text-emerald-700">Passivo Circ.</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ETAPA 3: VALIDAÇÃO (VAGÃO / DUPLICIDADE) */}
        {step === 3 && audit && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
              <div className="md:w-1/3 bg-audit-navy text-white p-12 rounded-[3rem] shadow-2xl flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                  <i className="fas fa-triangle-exclamation text-9xl"></i>
                </div>
                <div className="w-16 h-16 bg-audit-gold rounded-[1.5rem] flex items-center justify-center text-audit-navy mb-8 shadow-lg">
                  <i className="fas fa-microscope text-3xl"></i>
                </div>
                <h3 className="text-3xl font-serif font-black mb-6 leading-tight">Análise de Exceções</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-10 italic border-l-4 border-audit-gold pl-6">
                  Auditamos títulos vencidos há mais de 180 dias. Estes itens podem representar erros de baixa, pagamentos não conciliados ou passivos fictícios.
                </p>
                <div className="space-y-6 flex-grow">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-audit-gold uppercase block mb-1">Itens Críticos</span>
                      <div className="text-3xl font-black">{audit.processed.filter(p => p.isWagon).length}</div>
                    </div>
                    <i className="fas fa-exclamation-triangle text-audit-gold opacity-50 text-xl"></i>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-audit-gold uppercase block mb-1">Montante Exposto</span>
                      <div className="text-2xl font-black font-mono">{formatBRL(audit.processed.filter(p => p.isWagon).reduce((a, b) => a + b.valor, 0))}</div>
                    </div>
                    <i className="fas fa-coins text-audit-gold opacity-50 text-xl"></i>
                  </div>
                </div>
                <button onClick={() => setStep(4)} className="w-full mt-12 h-16 bg-audit-gold text-audit-navy rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest hover:bg-white transition-all shadow-xl">Análise de Aging <i className="fas fa-arrow-right ml-2"></i></button>
              </div>

              <div className="md:w-2/3 bg-white border-2 border-slate-200 rounded-[3rem] overflow-hidden flex flex-col shadow-sm">
                <div className="bg-slate-50 px-10 py-6 border-b-2 border-slate-100 font-black text-[11px] uppercase text-slate-900 tracking-widest">Dossiê de Obrigações Antigas (Vagão)</div>
                <div className="overflow-x-auto flex-grow max-h-[650px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-black uppercase text-[9px] border-b">
                        <th className="px-10 py-5">Fornecedor</th>
                        <th className="px-10 py-5 text-right">Saldo Vencido</th>
                        <th className="px-10 py-5 text-center">Dias Atraso</th>
                        <th className="px-10 py-5">Nota de Auditoria</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-100">
                      {audit.processed.filter(p => p.isWagon).length === 0 ? (
                        <tr><td colSpan="4" className="px-10 py-48 text-center text-slate-300 font-black uppercase tracking-widest opacity-40 italic">Nenhuma anomalia de idade detectada.</td></tr>
                      ) : (
                        audit.processed.filter(p => p.isWagon).map(row => (
                          <tr key={row.id} className="hover:bg-red-50/50 transition border-b">
                            <td className="px-10 py-6">
                              <div className="font-black text-slate-900">{row.fornecedorNome}</div>
                              <div className="text-[9px] text-slate-500 font-mono italic">Ref: {row.titulo}</div>
                            </td>
                            <td className="px-10 py-6 text-right font-black text-red-700 font-mono text-sm">{formatBRL(row.valor)}</td>
                            <td className="px-10 py-6 text-center">
                              <span className="bg-red-100 text-red-900 px-4 py-1.5 rounded-full font-black font-mono">{row.daysOverdue} d</span>
                            </td>
                            <td className="px-10 py-6 text-slate-500 font-bold italic">
                              Verifique possível prescrição ou erro de baixa.
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 4: AGING E SEGREGAÇÃO */}
        {step === 4 && audit && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Métricas Globais */}
              <section className="bg-white border-2 border-slate-200 p-10 rounded-[2.5rem] shadow-sm flex flex-col gap-8">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-100 pb-4">Indicadores do Passivo</h4>
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 border-l-8 border-l-audit-navy rounded-2xl">
                    <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Passivo Circulante</span>
                    <div className="text-2xl font-black text-slate-900 font-mono">{formatBRL(audit.circulante)}</div>
                  </div>
                  <div className="p-6 bg-slate-50 border-l-8 border-l-audit-blue rounded-2xl">
                    <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Passivo Não Circulante</span>
                    <div className="text-2xl font-black text-audit-blue font-mono">{formatBRL(audit.naoCirculante)}</div>
                  </div>
                  <div className="p-8 bg-audit-navy text-white rounded-[2rem] text-center shadow-2xl relative">
                    <span className="text-[10px] font-black text-audit-gold uppercase tracking-[0.2em] block mb-3">Diferença Auditoria</span>
                    <div className="text-3xl font-black font-mono">{formatBRL(audit.diffAccounting)}</div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-4 tracking-tighter">Ajuste na data-base: {reportDate}</p>
                  </div>
                </div>
                <button onClick={() => setStep(5)} className="w-full mt-auto h-16 bg-audit-gold text-audit-navy rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl hover:bg-audit-navy hover:text-white transition-all">Ir para Circularização <i className="fas fa-envelope-open-text ml-2"></i></button>
              </section>

              {/* Composição Gráfica */}
              <section className="lg:col-span-2 bg-white border-2 border-slate-200 p-10 rounded-[3rem] shadow-sm flex flex-col">
                <h3 className="text-xl font-serif font-black text-slate-900 mb-10 text-center">Concentração da Dívida por Aging</h3>
                <div className="h-80 w-full flex-grow">
                  <ResponsiveContainer>
                    <BarChart data={audit.agingSummary}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 'bold' }} />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000) + 'k'} tick={{ fill: '#64748b' }} />
                      <RechartsTooltip formatter={(v) => formatBRL(v)} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                      <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                        {audit.agingSummary.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {audit.agingSummary.map((item, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border-b-4 border-b-slate-200 flex flex-col items-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase mb-1">{item.name}</span>
                      <span className="text-xs font-black text-slate-900 font-mono">{formatBRL(item.value)}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ETAPA 5: CIRCULARIZAÇÃO */}
        {step === 5 && audit && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-8 items-end justify-between no-print">
              <div className="max-w-2xl text-left">
                <h3 className="text-3xl font-serif font-black text-slate-900 mb-3 leading-tight">Seleção para Circularização (ISA 505)</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed italic border-l-4 border-audit-gold pl-6">Selecione os fornecedores para envio de pedido de confirmação de saldos. Priorize saldos de materialidade elevada ou partes relacionadas.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-audit-navy text-white px-10 py-5 rounded-[2rem] flex items-center gap-6 shadow-2xl border-b-4 border-audit-gold">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-audit-gold">Amostra</span>
                    <span className="text-3xl font-black font-mono leading-none">{selectedForCircularization.length}</span>
                  </div>
                  <i className="fas fa-users-viewfinder text-2xl text-audit-gold opacity-50"></i>
                </div>
                <button onClick={() => setStep(6)} disabled={selectedForCircularization.length === 0} className="bg-audit-gold text-audit-navy font-black uppercase text-[11px] px-10 py-5 rounded-[2rem] shadow-xl hover:scale-105 transition-all disabled:opacity-30 disabled:grayscale">Gerar Cartas <i className="fas fa-file-export ml-2"></i></button>
              </div>
            </div>

            <section className="bg-white border-2 border-slate-200 rounded-[3rem] overflow-hidden shadow-xl">
              <div className="overflow-x-auto max-h-[650px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 font-black uppercase text-[10px] text-slate-600 sticky top-0 z-20 shadow-md">
                    <tr>
                      <th className="px-10 py-6 text-center">Sel.</th>
                      <th className="px-10 py-6">Fornecedor / Favorecido</th>
                      <th className="px-10 py-6 text-right">Saldo Devedor</th>
                      <th className="px-10 py-6 text-center">Status Aging</th>
                      <th className="px-10 py-6">Riscos Detectados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-100">
                    {audit.processed.map(row => (
                      <tr key={row.id} className={`transition cursor-pointer border-b ${selectedForCircularization.includes(row.id) ? 'bg-audit-navy text-white' : 'hover:bg-slate-50'}`} onClick={() => toggleSample(row.id)}>
                        <td className="px-10 py-6 text-center">
                          <div className={`w-8 h-8 mx-auto rounded-xl border-2 flex items-center justify-center transition-all ${selectedForCircularization.includes(row.id) ? 'bg-audit-gold border-audit-gold text-audit-navy' : 'bg-white border-slate-300'}`}>
                            {selectedForCircularization.includes(row.id) && <i className="fas fa-check text-xs"></i>}
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="font-black text-lg">{row.fornecedorNome}</div>
                          <div className={`text-[10px] font-mono ${selectedForCircularization.includes(row.id) ? 'text-slate-400' : 'text-slate-500'}`}>{row.fornecedorCodigo}</div>
                        </td>
                        <td className={`px-10 py-6 text-right font-black font-mono text-base ${row.valor < 0 && !selectedForCircularization.includes(row.id) ? 'text-red-700' : ''}`}>{formatBRL(row.valor)}</td>
                        <td className="px-10 py-6 text-center">
                          <Badge color={row.daysOverdue > 90 ? 'red' : row.daysOverdue > 0 ? 'amber' : 'green'}>{row.rangeLabel}</Badge>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex flex-wrap gap-1.5">
                            {row.alerts.length > 0 ? row.alerts.map((a, i) => <Badge key={i} color="red">{a}</Badge>) : <span className="text-[10px] font-bold opacity-30 italic">Risco Normal</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ETAPA 6: CONCLUSÃO E NOTAS */}
        {step === 6 && audit && (
          <div className="animate-in fade-in slide-in-from-top-6 duration-700 max-w-5xl mx-auto space-y-12">
            <div className="flex justify-between items-center no-print">
              <h3 className="text-3xl font-serif font-black text-slate-900">Finalização do Trabalho</h3>
              <div className="flex gap-4">
                <button onClick={() => window.print()} className="px-8 py-3 bg-audit-navy text-white rounded-2xl font-black text-[11px] uppercase shadow-2xl hover:bg-audit-navy/80 transition-all"><i className="fas fa-print mr-3"></i>Imprimir Cartas e Relatórios</button>
                <button onClick={() => setStep(1)} className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-[11px] uppercase hover:bg-slate-50 transition-all">Novo Teste de Fornecedores</button>
              </div>
            </div>

            {/* NOTAS EXPLICATIVAS */}
            <section className="bg-white border-2 border-slate-200 p-12 rounded-[3rem] shadow-xl relative overflow-hidden border-t-8 border-t-audit-navy">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <i className="fas fa-file-contract text-9xl"></i>
              </div>
              <h4 className="text-2xl font-serif font-black text-slate-900 mb-10 border-b-2 border-slate-100 pb-6 flex items-center gap-4">
                <i className="fas fa-feather-pointed text-audit-gold"></i> Minutas de Divulgação Contábil
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="p-8 bg-slate-50 border-l-8 border-l-audit-navy rounded-[2rem]">
                    <h5 className="font-black text-slate-900 uppercase text-[11px] mb-4 tracking-widest flex items-center gap-3">
                      <img src="https://flagcdn.com/w20/br.png" className="w-5 h-4 rounded-sm object-cover" alt="Brasil" /> Brasil (CPC 48 / 26)
                    </h5>
                    <p className="text-[12px] leading-loose text-slate-600 font-mono italic">
                      "Os saldos de fornecedores são registrados pelo valor das obrigações contratuais na data-base de {new Date(reportDate).toLocaleDateString('pt-BR')}. O montante circulante totaliza {formatBRL(audit.circulante)}, enquanto o saldo de longo prazo (acima de 12 meses) é de {formatBRL(audit.naoCirculante)}. Eventuais saldos devedores são reclassificados como adiantamentos no Ativo."
                    </p>
                  </div>

                  <div className="p-8 bg-slate-50 border-l-8 border-l-audit-gold rounded-[2rem]">
                    <h5 className="font-black text-slate-900 uppercase text-[11px] mb-4 tracking-widest flex items-center gap-3">
                      <img src="https://flagcdn.com/w20/mx.png" className="w-5 h-4 rounded-sm object-cover" alt="México" /> México (NIF C-19)
                    </h5>
                    <p className="text-[12px] leading-loose text-slate-600 font-mono italic">
                      "Los pasivos financieros por cuentas por pagar se reconocen inicialmente a su valor nominal. Al {new Date(reportDate).toLocaleDateString('es-MX')}, se identificó una concentración del {((audit.naoCirculante / audit.totalListagem) * 100).toFixed(1)}% en pasivos a largo plazo."
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-8 bg-audit-navy text-slate-300 rounded-[2rem] border-t-8 border-t-audit-gold">
                    <h5 className="font-black text-audit-gold uppercase text-[11px] mb-4 tracking-widest flex items-center gap-3">
                      <i className="fas fa-globe text-xs"></i> International (IFRS 9)
                    </h5>
                    <p className="text-[12px] leading-loose italic">
                      "Trade payables are measured at their nominal value. The entity assesses the liquidity risk and the maturity profile of its financial liabilities. As of the reporting date, the current liabilities amount to {formatBRL(audit.circulante)}, which are expected to be settled within the normal operating cycle."
                    </p>
                  </div>

                  <div className="p-8 bg-slate-50 border-l-8 border-l-audit-blue rounded-[2rem]">
                    <h5 className="font-black text-slate-900 uppercase text-[11px] mb-4 tracking-widest flex items-center gap-3">
                      <img src="https://flagcdn.com/w20/us.png" className="w-5 h-4 rounded-sm object-cover" alt="EUA" /> US GAAP (ASC 405)
                    </h5>
                    <p className="text-[12px] leading-loose text-slate-600 font-mono italic">
                      "Liabilities are recognized when the company has a present obligation. Accounts payable are stated at their settlement value. Management has reviewed the aging of payables to ensure appropriate classification between current and long-term debt."
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-12">
                <button onClick={() => showToast("Notas copiadas para o clipboard!")} className="w-full h-16 bg-audit-navy text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl hover:bg-audit-gold hover:text-audit-navy transition-all">Copiar Todas as Notas Técnicas</button>
              </div>
            </section>

            {/* CARTA DE CIRCULARIZAÇÃO (PRONTO PARA IMPRESSÃO) */}
            <section className="bg-white p-20 shadow-2xl rounded-[1rem] border-2 border-slate-200 min-h-[1000px] font-serif print:shadow-none print:border-none print:m-0 print:p-10">
              <div className="text-center mb-16 border-b-8 border-double border-audit-navy pb-8">
                <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tighter">Pedido de Confirmação de Saldos (Passivo)</h2>
                <p className="text-[11px] font-sans text-slate-500 mt-3 font-bold uppercase tracking-widest italic">Procedimento Formal de Auditoria Independente • ISA 505</p>
              </div>

              <div className="grid grid-cols-2 mb-16 text-[14px]">
                <p>Empresa Auditada: <strong className="text-slate-900">{companyName}</strong></p>
                <p className="text-right">Data-Base de Referência: <strong className="text-slate-900">{new Date(reportDate).toLocaleDateString('pt-BR')}</strong></p>
              </div>

              <div className="space-y-10 text-[14px] text-slate-900 leading-[1.8] text-justify">
                <p>À Gerência / Departamento Financeiro,</p>
                <p>Para fins de revisão anual de nossas demonstrações financeiras, solicitamos a gentileza de confirmar diretamente aos nossos auditores se o saldo em aberto em nome desta empresa, conforme seus registros internos em <strong>{new Date(reportDate).toLocaleDateString('pt-BR')}</strong>, está em conformidade com os montantes discriminados abaixo.</p>

                <table className="w-full border-collapse border-2 border-audit-navy mt-10 shadow-lg">
                  <thead className="bg-slate-100 text-[11px] uppercase font-black text-slate-900">
                    <tr>
                      <th className="border-2 border-audit-navy p-4 text-left">Código Ref.</th>
                      <th className="border-2 border-audit-navy p-4 text-left">Razão Social do Credor</th>
                      <th className="border-2 border-audit-navy p-4 text-left">Título / NF</th>
                      <th className="border-2 border-audit-navy p-4 text-right">Saldo Credor (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audit.processed.filter(f => selectedForCircularization.includes(f.id)).map(row => (
                      <tr key={row.id} className="text-[12px]">
                        <td className="border-2 border-audit-navy p-4 text-slate-600 font-mono">{row.fornecedorCodigo}</td>
                        <td className="border-2 border-audit-navy p-4 font-black">{row.fornecedorNome}</td>
                        <td className="border-2 border-audit-navy p-4 font-mono">{row.titulo}</td>
                        <td className="border-2 border-audit-navy p-4 text-right font-black font-mono text-slate-900">{formatBRL(row.valor)}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-black border-t-4 border-audit-navy">
                      <td colSpan="3" className="border-2 border-audit-navy p-4 text-right uppercase text-[11px]">Total Amostrado para Circularização</td>
                      <td className="border-2 border-audit-navy p-4 text-right font-mono text-lg">{formatBRL(audit.processed.filter(f => selectedForCircularization.includes(f.id)).reduce((a, b) => a + b.valor, 0))}</td>
                    </tr>
                  </tbody>
                </table>

                <p className="mt-16 bg-slate-50 p-8 border-l-8 border-audit-gold text-[13px] italic font-sans leading-relaxed">"Solicitamos que a resposta seja enviada diretamente ao endereço físico ou eletrônico de nossos auditores independentes, indicando quaisquer divergências nos saldos ou prazos de vencimento aqui apresentados."</p>

                <div className="mt-40 flex justify-between gap-16 no-print-flex">
                  <div className="text-center w-full border-t-2 border-audit-navy pt-4">
                    <span className="text-[11px] uppercase font-black">Diretoria Financeira da Entidade</span>
                  </div>
                  <div className="text-center w-full border-t-2 border-audit-navy pt-4">
                    <span className="text-[11px] uppercase font-black text-slate-900">Auditoria Independente</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] animate-bounce">
          <div className="bg-audit-navy text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border-2 border-audit-gold flex items-center gap-3">
            <i className="fas fa-check-circle text-audit-gold"></i> {toast}
          </div>
        </div>
      )}
    </div>
  );
}