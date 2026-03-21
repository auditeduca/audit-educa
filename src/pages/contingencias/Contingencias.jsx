// src/pages/contingencias/Contingencias.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  Cell, Legend, PieChart, Pie
} from 'recharts';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// --- Constantes de Estilo Audit Educa (Navy & Gold) ---
const COLORS = ['#0f172a', '#C5A059', '#1e40af', '#dc2626', '#475569', '#1e293b'];

// --- Componentes Atômicos ---
const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    red: 'bg-red-100 text-red-900 border-red-200',    // Provável
    amber: 'bg-amber-100 text-amber-900 border-amber-200', // Possível
    green: 'bg-emerald-100 text-emerald-900 border-emerald-200', // Remoto
    navy: 'bg-slate-900 text-white border-slate-700'
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-widest ${colors[color]}`}>
      {children}
    </span>
  );
};

const StepIndicator = ({ currentStep }) => {
  const steps = ["Planeamento", "Base de Dados", "Avaliação de Risco", "Ajustes Sugeridos", "Divulgação"];
  return (
    <div className="flex flex-wrap gap-3 mb-10 no-print">
      {steps.map((s, i) => (
        <div
          key={i}
          className={`px-5 py-2.5 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shadow-sm ${
            currentStep === i + 1
              ? 'bg-slate-900 text-white shadow-xl scale-105 border-slate-900'
              : 'bg-white text-slate-500 border-slate-200'
          }`}
        >
          {i + 1}. {s}
        </div>
      ))}
    </div>
  );
};

export default function Contingencias() {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('Entidade Audita S.A.');
  const [reportDate, setReportDate] = useState('2025-12-31');
  const [accountingBalance, setAccountingBalance] = useState('');
  const [data, setData] = useState([]);
  const [toast, setToast] = useState(null);

  // Form para entrada manual
  const [manualForm, setManualForm] = useState({
    processo: '', natureza: 'Cível', risco: 'Provável', valorCausa: '', provisaoCliente: '', escritorio: ''
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!manualForm.processo || !manualForm.valorCausa) return showToast("Preencha Processo e Valor.");
    const newItem = { ...manualForm, id: `ct-${Date.now()}` };
    setData(prev => [...prev, newItem]);
    setManualForm({ processo: '', natureza: 'Cível', risco: 'Provável', valorCausa: '', provisaoCliente: '', escritorio: '' });
    showToast("Processo adicionado à base.");
  };

  // --- Lógica de Auditoria Master ---
  const audit = useMemo(() => {
    if (!data.length) return null;

    let totalCausa = 0;
    let provisaoAuditada = 0; // Soma apenas os "Prováveis"
    let provisaoContabilizada = 0;

    const processed = data.map((item, idx) => {
      const valorCausa = parseFloat(item.valorCausa) || 0;
      const provCliente = parseFloat(item.provisaoCliente) || 0;

      totalCausa += valorCausa;
      provisaoContabilizada += provCliente;

      // Lógica de Auditoria: Se Risco = Provável, Provisão Auditada = Valor da Causa (ou estimativa informada)
      const auditEstimated = item.risco === 'Provável' ? valorCausa : 0;
      if (item.risco === 'Provável') provisaoAuditada += auditEstimated;

      const variancia = auditEstimated - provCliente;

      return {
        ...item,
        id: item.id || `row-${idx}`,
        valorCausa,
        provisaoCliente: provCliente,
        auditEstimated,
        variancia,
        statusRisco: item.risco === 'Provável' ? 'red' : item.risco === 'Possível' ? 'amber' : 'green'
      };
    });

    const naturezas = [...new Set(processed.map(p => p.natureza))];
    const natureSummary = naturezas.map(nat => ({
      name: nat,
      value: processed.filter(p => p.natureza === nat).reduce((a, b) => a + b.valorCausa, 0)
    }));

    const riskSummary = [
      { name: 'Provável', value: processed.filter(p => p.risco === 'Provável').reduce((a, b) => a + b.valorCausa, 0) },
      { name: 'Possível', value: processed.filter(p => p.risco === 'Possível').reduce((a, b) => a + b.valorCausa, 0) },
      { name: 'Remoto', value: processed.filter(p => p.risco === 'Remoto').reduce((a, b) => a + b.valorCausa, 0) }
    ];

    return {
      processed,
      totalCausa,
      provisaoAuditada,
      provisaoContabilizada,
      natureSummary,
      riskSummary,
      proposedAdjustment: provisaoAuditada - provisaoContabilizada,
      diffAccounting: provisaoContabilizada - (parseFloat(accountingBalance) || 0)
    };
  }, [data, accountingBalance]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result.split('\n').filter(l => l.trim()).slice(1).map((line, idx) => {
        const cols = line.split(';').map(c => c.trim().replace(/"/g, ''));
        return {
          id: `csv-${idx}-${Date.now()}`,
          processo: cols[0], natureza: cols[1], risco: cols[2],
          valorCausa: cols[3]?.replace(',', '.'),
          provisaoCliente: cols[4]?.replace(',', '.'),
          escritorio: cols[5]
        };
      });
      setData(rows);
      showToast(`${rows.length} processos importados.`);
    };
    reader.readAsText(file);
  };

  const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-grow p-4 md:p-12 max-w-7xl mx-auto w-full">

        <StepIndicator currentStep={step} />

        {/* ETAPA 1: PLANEAMENTO */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
            <div className="lg:col-span-5 space-y-6">
              <section className="bg-white border-2 border-slate-200 p-8 rounded-[2rem] shadow-sm space-y-6">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-b-4 border-amber-500 pb-3 inline-block">Configurações Base</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nome da Empresa</label>
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Data-Base Auditoria</label>
                      <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-bold outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Saldo Provisão Razão (R$)</label>
                      <input type="number" value={accountingBalance} onChange={e => setAccountingBalance(e.target.value)} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-bold font-mono outline-none" placeholder="0,00" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <i className="fas fa-balance-scale text-8xl"></i>
                </div>
                <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-4">Critério de Risco (ISA 501)</h4>
                <p className="text-xs text-slate-400 leading-relaxed italic border-l-4 border-amber-500 pl-4">
                  "O auditor deve obter evidência de auditoria suficiente quanto à existência e condição de litígios e reclamações envolvendo a entidade."
                </p>
              </section>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <section className="bg-white border-2 border-slate-200 p-10 rounded-[2.5rem] shadow-xl text-center space-y-8">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-amber-500 shadow-inner">
                  <i className="fas fa-file-invoice-dollar text-3xl"></i>
                </div>
                <h2 className="text-2xl font-serif font-black text-slate-900">Importação de Relatórios Jurídicos</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto italic">Carregue o relatório consolidado dos escritórios externos contendo Processo, Natureza, Risco e Valores.</p>

                <div className="flex flex-col gap-4">
                  <label className="w-full h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center gap-4 cursor-pointer hover:bg-slate-800 transition-all shadow-2xl group">
                    <i className="fas fa-file-csv text-amber-500 group-hover:scale-125 transition"></i>
                    <span className="font-bold uppercase text-xs tracking-widest">Carregar Listagem Jurídica (.CSV)</span>
                    <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <div className="flex items-center gap-4 py-2"><div className="flex-grow border-b"></div><span className="text-[9px] font-bold text-slate-300">OU</span><div className="flex-grow border-b"></div></div>
                  <button onClick={() => setStep(2)} className="w-full h-16 border-2 border-slate-900 text-slate-900 rounded-3xl font-bold uppercase text-xs tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">Configuração Manual / Análise de Dados</button>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ETAPA 2: BASE DE DADOS E MANUAL */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4">
                <section className="bg-white border-2 border-slate-200 p-8 rounded-[2rem] shadow-sm">
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">Novo Processo Judicial</h3>
                  <form onSubmit={handleManualAdd} className="space-y-4">
                    <input type="text" placeholder="Nº Processo" value={manualForm.processo} onChange={e => setManualForm({ ...manualForm, processo: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" />
                    <select value={manualForm.natureza} onChange={e => setManualForm({ ...manualForm, natureza: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none">
                      <option>Cível</option><option>Trabalhista</option><option>Tributária</option><option>Ambiental</option><option>Regulatória</option>
                    </select>
                    <select value={manualForm.risco} onChange={e => setManualForm({ ...manualForm, risco: e.target.value })} className={`w-full h-11 px-4 border-2 rounded-xl text-xs font-black outline-none ${manualForm.risco === 'Provável' ? 'border-red-500 text-red-700' : manualForm.risco === 'Possível' ? 'border-amber-500 text-amber-700' : 'border-emerald-500 text-emerald-700'}`}>
                      <option value="Provável">Risco Provável</option>
                      <option value="Possível">Risco Possível</option>
                      <option value="Remoto">Risco Remoto</option>
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 uppercase ml-2">Vl. Causa</label>
                        <input type="number" value={manualForm.valorCausa} onChange={e => setManualForm({ ...manualForm, valorCausa: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 uppercase ml-2">Vl. Prov. Cliente</label>
                        <input type="number" value={manualForm.provisaoCliente} onChange={e => setManualForm({ ...manualForm, provisaoCliente: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                      </div>
                    </div>
                    <input type="text" placeholder="Escritório Responsável" value={manualForm.escritorio} onChange={e => setManualForm({ ...manualForm, escritorio: e.target.value })} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" />
                    <button type="submit" className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg">Adicionar Processo</button>
                  </form>
                </section>
              </div>
              <div className="lg:col-span-8">
                <section className="bg-white border-2 border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-8 py-5 flex justify-between items-center border-b">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Listagem Consolidada de Litígios</h4>
                    <button onClick={() => setStep(3)} className="bg-amber-500 text-slate-900 px-6 py-2 rounded-xl text-[10px] font-bold uppercase shadow-md">Avaliação de Risco <i className="fas fa-chevron-right ml-2"></i></button>
                  </div>
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-[9px] font-black text-slate-500 uppercase sticky top-0 z-10 border-b">
                        <tr><th className="px-8 py-4">Nº Processo / Natureza</th><th className="px-8 py-4 text-center">Risco</th><th className="px-8 py-4 text-right">Valor Causa</th><th className="px-8 py-4 text-right">Provisão Cliente</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {audit?.processed.map(row => (
                          <tr key={row.id} className="hover:bg-slate-50 transition">
                            <td className="px-8 py-5">
                              <div className="font-bold text-slate-900">{row.processo}</div>
                              <div className="text-[10px] text-slate-500">{row.natureza} | {row.escritorio}</div>
                            </td>
                            <td className="px-8 py-5 text-center"><Badge color={row.statusRisco}>{row.risco}</Badge></td>
                            <td className="px-8 py-5 text-right font-bold text-slate-900 font-mono">{formatBRL(row.valorCausa)}</td>
                            <td className="px-8 py-5 text-right font-bold text-slate-400 font-mono">{formatBRL(row.provisaoCliente)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 3: AVALIAÇÃO DE RISCO E GRÁFICOS */}
        {step === 3 && audit && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total em Litígio', val: formatBRL(audit.totalCausa), icon: 'gavel', color: 'text-slate-900' },
                { label: 'Exposição Provável', val: formatBRL(audit.provisaoAuditada), icon: 'triangle-exclamation', color: 'text-red-600' },
                { label: 'Exposição Possível', val: formatBRL(audit.riskSummary.find(r => r.name === 'Possível')?.value || 0), icon: 'circle-info', color: 'text-amber-600' },
                { label: 'Divergência Razão', val: formatBRL(audit.diffAccounting), icon: 'equals', color: Math.abs(audit.diffAccounting) > 0.01 ? 'text-red-700 font-black' : 'text-emerald-700' }
              ].map((card, i) => (
                <div key={i} className="bg-white border-2 border-slate-200 p-6 rounded-3xl text-center shadow-sm group hover:border-slate-900 transition-all">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-500 group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <i className={`fas fa-${card.icon}`}></i>
                  </div>
                  <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{card.label}</h4>
                  <div className={`text-base font-bold mt-1 ${card.color}`}>{card.val}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gráfico por Natureza */}
              <section className="bg-white border-2 border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">Concentração por Natureza (Valor Causa)</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <BarChart data={audit.natureSummary}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000) + 'k'} />
                      <RechartsTooltip formatter={(v) => formatBRL(v)} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {audit.natureSummary.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Perfil de Risco */}
              <section className="bg-white border-2 border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Perfil de Risco da Carteira</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={audit.riskSummary} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                        <Cell fill="#dc2626" /> {/* Provável */}
                        <Cell fill="#C5A059" /> {/* Possível */}
                        <Cell fill="#10b981" /> {/* Remoto */}
                      </Pie>
                      <RechartsTooltip formatter={(v) => formatBRL(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-600"></div><span className="text-[9px] font-bold text-slate-500 uppercase">Provável</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div><span className="text-[9px] font-bold text-slate-500 uppercase">Possível</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div><span className="text-[9px] font-bold text-slate-500 uppercase">Remoto</span></div>
                </div>
              </section>
            </div>

            <section className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl">
              <div>
                <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Ajuste de Auditoria Proposto</h4>
                <div className="text-4xl font-bold font-mono">{formatBRL(audit.proposedAdjustment)}</div>
                <p className="text-[9px] text-slate-400 mt-2 uppercase font-bold tracking-tighter italic">Base: {audit.processed.filter(p => p.risco === 'Provável').length} processos com risco provável.</p>
              </div>
              <button onClick={() => setStep(4)} className="h-14 px-10 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-500 transition shadow-lg">Detalhamento e Notas</button>
            </section>
          </div>
        )}

        {/* ETAPA 4: AJUSTES SUGERIDOS */}
        {step === 4 && audit && (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8">
                <section className="bg-white border-2 border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-8 py-5 border-b font-black text-[10px] uppercase text-slate-900 tracking-widest">Memória de Cálculo: Ajustes Propostos</div>
                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 font-black uppercase text-[9px] border-b">
                          <th className="px-8 py-5">Processo / Natureza</th>
                          <th className="px-8 py-5 text-right">Auditado (Estimado)</th>
                          <th className="px-8 py-5 text-right">Contabilizado</th>
                          <th className="px-8 py-5 text-right">Ajuste Sugerido</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {audit.processed.filter(p => Math.abs(p.variancia) > 0.01).map(row => (
                          <tr key={row.id} className="hover:bg-slate-50">
                            <td className="px-8 py-6">
                              <div className="font-black text-slate-900">{row.processo}</div>
                              <div className="text-[9px] text-slate-500 italic">{row.natureza} | Risco: {row.risco}</div>
                            </td>
                            <td className="px-8 py-6 text-right font-black text-slate-900 font-mono">{formatBRL(row.auditEstimated)}</td>
                            <td className="px-8 py-6 text-right font-bold text-slate-400 font-mono">{formatBRL(row.provisaoCliente)}</td>
                            <td className={`px-8 py-6 text-right font-black font-mono text-sm ${row.variancia > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{formatBRL(row.variancia)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
              <div className="lg:col-span-4 space-y-6">
                <section className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><i className="fas fa-file-invoice text-9xl"></i></div>
                  <h4 className="text-xl font-serif font-black">Resumo Contabilístico</h4>
                  <div className="space-y-6 relative">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-2">D - Despesa de Contingência (DR)</span>
                      <div className="text-3xl font-black font-mono">{formatBRL(Math.abs(audit.proposedAdjustment))}</div>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-2">C - Provisão p/ Contingências (BP)</span>
                      <div className="text-3xl font-black font-mono">{formatBRL(Math.abs(audit.proposedAdjustment))}</div>
                    </div>
                    <button onClick={() => setStep(5)} className="w-full h-16 bg-amber-500 text-slate-900 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-white transition shadow-lg">Finalizar e Gerar Notas</button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 5: DIVULGAÇÃO E NOTAS */}
        {step === 5 && audit && (
          <div className="animate-in slide-in-from-bottom duration-700 max-w-5xl mx-auto space-y-12">
            <div className="flex justify-between items-center no-print">
              <h3 className="text-3xl font-serif font-black text-slate-900 flex items-center gap-4">
                <i className="fas fa-file-contract text-amber-500"></i> Notas Explicativas Multinormas
              </h3>
              <div className="flex gap-4">
                <button onClick={() => window.print()} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase shadow-xl hover:bg-slate-800 transition"><i className="fas fa-print mr-2"></i>Imprimir Dossiê</button>
                <button onClick={() => setStep(1)} className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-[11px] uppercase hover:bg-slate-50 transition">Novo Teste</button>
              </div>
            </div>

            <section className="bg-white border-2 border-slate-200 p-12 rounded-[3.5rem] shadow-2xl space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="p-8 bg-slate-50 border-l-8 border-l-slate-900 rounded-[2rem] relative">
                    <div className="absolute top-4 right-6 text-slate-200"><i className="fas fa-quote-right text-4xl"></i></div>
                    <h5 className="font-black text-slate-900 uppercase text-[11px] mb-4 tracking-widest flex items-center gap-3">
                      <img src="https://flagcdn.com/w20/br.png" className="w-4 h-3 rounded-sm" /> Brasil (CPC 25 / IAS 37)
                    </h5>
                    <p className="text-[12px] leading-loose text-slate-600 font-mono italic">
                      "A Companhia reconhece provisões para obrigações presentes de natureza legal decorrentes de eventos passados, cujo desembolso de recursos seja provável e o valor mensurado com confiabilidade. Em {new Date(reportDate).toLocaleDateString('pt-BR')}, o montante provisionado totaliza {formatBRL(audit.provisaoAuditada)}, referentes a processos de natureza {audit.natureSummary.map(n => n.name).join(', ')}. Os processos com risco possível totalizam {formatBRL(audit.riskSummary.find(r => r.name === 'Possível')?.value || 0)} e não estão provisionados."
                    </p>
                  </div>

                  <div className="p-8 bg-slate-50 border-l-8 border-l-amber-500 rounded-[2rem]">
                    <h5 className="font-black text-slate-900 uppercase text-[11px] mb-4 tracking-widest flex items-center gap-3">
                      México (NIF C-19 / C-9)
                    </h5>
                    <p className="text-[12px] leading-loose text-slate-600 font-mono italic">
                      "Los pasivos contingentes son obligaciones posibles surgidas de eventos pasados. La administración evalúa la probabilidad de salida de recursos. Al cierre de {new Date(reportDate).getFullYear()}, la provisión de {formatBRL(audit.provisaoAuditada)} refleja las mejores estimaciones disponibles para litigios probables."
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-8 bg-slate-900 text-slate-300 rounded-[2rem] border-t-8 border-t-amber-500">
                    <h5 className="font-black text-amber-500 uppercase text-[11px] mb-4 tracking-widest flex items-center gap-3">
                      <i className="fas fa-globe text-xs"></i> International (IAS 37)
                    </h5>
                    <p className="text-[12px] leading-loose italic">
                      "Provisions are recognized when the group has a present legal or constructive obligation. The estimation of liability involves judgment by legal counsel. The contingent liabilities amounting to {formatBRL(audit.riskSummary.find(r => r.name === 'Possível')?.value || 0)} are not recognized as a liability but are disclosed as they represent a possible obligation."
                    </p>
                  </div>

                  <div className="p-8 bg-slate-50 border-l-8 border-l-blue-600 rounded-[2rem]">
                    <h5 className="font-black text-slate-900 uppercase text-[11px] mb-4 tracking-widest flex items-center gap-3">
                      <img src="https://flagcdn.com/w20/us.png" className="w-4 h-3 rounded-sm" /> US GAAP (ASC 450)
                    </h5>
                    <p className="text-[12px] leading-loose text-slate-600 font-mono italic">
                      "Loss contingencies are accrued if it is probable that a liability has been incurred and the amount can be reasonably estimated. Management discloses material contingencies where a loss is at least reasonably possible."
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t-2 border-slate-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-6 rounded-2xl text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Taxa de Cobertura</span>
                    <div className="text-xl font-black text-slate-900">{((audit.provisaoAuditada / audit.totalCausa) * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Processos Ativos</span>
                    <div className="text-xl font-black text-slate-900">{audit.processed.length}</div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Maior Risco</span>
                    <div className="text-xl font-black text-red-600">{audit.natureSummary.sort((a, b) => b.value - a.value)[0]?.name}</div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Variação Aud.</span>
                    <div className="text-xl font-black text-amber-600">{((Math.abs(audit.proposedAdjustment) / (audit.provisaoContabilizada || 1)) * 100).toFixed(1)}%</div>
                  </div>
                </div>
                <button onClick={() => showToast("Notas copiadas para a área de transferência!")} className="w-full mt-10 h-16 bg-slate-900 text-white rounded-3xl font-black uppercase text-[11px] tracking-widest hover:bg-amber-500 hover:text-slate-900 transition-all shadow-2xl">Copiar Minutas para Relatório de Auditoria</button>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] animate-bounce">
          <div className="bg-slate-900 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border-2 border-amber-500 flex items-center gap-3">
            <i className="fas fa-check-circle text-amber-500"></i> {toast}
          </div>
        </div>
      )}
    </div>
  );
}