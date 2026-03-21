// src/pages/imobilizado/Imobilizado.jsx
import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  Cell, PieChart, Pie
} from 'recharts';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// --- Constantes de Design Audit Educa (cores do tema) ---
const COLORS = ['#0f172a', '#C5A059', '#1e40af', '#334155', '#475569', '#1e293b', '#1e3a8a'];

// --- Componentes Atônicos ---
const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-900 border-blue-200',
    red: 'bg-red-100 text-red-900 border-red-200',
    green: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    gold: 'bg-amber-100 text-amber-900 border-amber-200',
    navy: 'bg-audit-navy text-white border-audit-navy'
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

const StepIndicator = ({ currentStep }) => {
  const steps = ["Configuração", "Recálculo Analítico", "Análise Global", "Ajustes & Notas"];
  return (
    <div className="flex flex-wrap gap-3 mb-10 no-print">
      {steps.map((s, i) => (
        <div
          key={i}
          className={`px-5 py-2.5 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all duration-500 shadow-sm ${
            currentStep === i + 1
              ? 'bg-audit-navy text-white shadow-xl scale-105 border-audit-navy'
              : 'bg-white text-slate-500 border-slate-200'
          }`}
        >
          {i + 1}. {s}
        </div>
      ))}
    </div>
  );
};

export default function Imobilizado() {
  console.log("🔧 Componente Imobilizado montado"); // Log de depuração

  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('Cliente Exemplo S.A.');
  const [reportDate, setReportDate] = useState('2025-12-31');
  const [data, setData] = useState([]);
  const [toast, setToast] = useState(null);

  // Formulário manual
  const [manualForm, setManualForm] = useState({
    tag: '', descricao: '', categoria: 'Maquinários', dataInic: '', custo: '', residual: '', vidaUtil: '', vctoContabil: ''
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!manualForm.descricao || !manualForm.custo || !manualForm.dataInic) {
      showToast("Preencha Descrição, Custo e Data.");
      return;
    }
    const newItem = { ...manualForm, id: `fa-${Date.now()}` };
    setData(prev => [...prev, newItem]);
    setManualForm({ tag: '', descricao: '', categoria: 'Maquinários', dataInic: '', custo: '', residual: '', vidaUtil: '', vctoContabil: '' });
    showToast("Ativo adicionado com sucesso.");
  };

  // Lógica de recálculo
  const audit = useMemo(() => {
    if (!data.length) return null;
    const dtBase = new Date(reportDate);
    let totalCusto = 0;
    let totalDeprAuditada = 0;
    let totalDeprContabil = 0;

    const processed = data.map((item, idx) => {
      const custo = parseFloat(item.custo) || 0;
      const residual = parseFloat(item.residual) || 0;
      const vidaUtilMeses = (parseInt(item.vidaUtil) || 1) * 12;
      const deprContabil = parseFloat(item.vctoContabil) || 0;

      totalCusto += custo;
      totalDeprContabil += deprContabil;

      const dtInic = new Date(item.dataInic);
      let monthsElapsed = (dtBase.getFullYear() - dtInic.getFullYear()) * 12;
      monthsElapsed -= dtInic.getMonth();
      monthsElapsed += dtBase.getMonth() + 1;
      const safeMonths = Math.max(0, Math.min(monthsElapsed, vidaUtilMeses));
      const valorDepreciavel = Math.max(0, custo - residual);
      const deprMensal = valorDepreciavel / vidaUtilMeses;
      const deprAcumAuditada = deprMensal * safeMonths;
      totalDeprAuditada += deprAcumAuditada;

      const variancia = deprAcumAuditada - deprContabil;
      const percErro = deprContabil > 0 ? (Math.abs(variancia) / deprContabil) * 100 : 0;

      return {
        ...item,
        id: item.id || `fa-${idx}`,
        custo, deprMensal, deprAcumAuditada, variancia, percErro, safeMonths,
        status: Math.abs(percErro) > 5 ? 'Crítico' : Math.abs(percErro) > 1 ? 'Atenção' : 'Ok'
      };
    });

    const categorias = [...new Set(processed.map(p => p.categoria))];
    const globalSummary = categorias.map(cat => {
      const filtered = processed.filter(p => p.categoria === cat);
      return {
        name: cat,
        custo: filtered.reduce((a, b) => a + b.custo, 0),
        auditada: filtered.reduce((a, b) => a + b.deprAcumAuditada, 0),
        contabil: filtered.reduce((a, b) => a + (parseFloat(b.vctoContabil) || 0), 0)
      };
    });

    return {
      processed,
      totalCusto,
      totalDeprAuditada,
      totalDeprContabil,
      globalSummary,
      proposedAdjustment: totalDeprAuditada - totalDeprContabil
    };
  }, [data, reportDate]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result.split('\n').filter(l => l.trim()).slice(1).map((line, idx) => {
        const cols = line.split(';').map(c => c.trim().replace(/"/g, ''));
        return {
          id: `csv-${idx}-${Date.now()}`,
          tag: cols[0],
          descricao: cols[1],
          categoria: cols[2],
          dataInic: cols[3],
          custo: cols[4]?.replace(',', '.'),
          residual: cols[5]?.replace(',', '.'),
          vidaUtil: cols[6],
          vctoContabil: cols[7]?.replace(',', '.')
        };
      });
      setData(rows);
      showToast(`${rows.length} ativos importados.`);
    };
    reader.readAsText(file);
  };

  const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-grow p-4 md:p-12 max-w-7xl mx-auto w-full">
        {/* Debug: exibe o step atual */}
        <div className="text-xs text-slate-400 mb-2">Step: {step}</div>

        <StepIndicator currentStep={step} />

        {/* ETAPA 1: CONFIGURAÇÃO - sempre visível quando step===1 */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
            <div className="lg:col-span-4 space-y-6">
              <section className="bg-white border-2 border-slate-200 p-8 rounded-[2rem] shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <i className="fas fa-sliders text-audit-gold"></i> Setup de Auditoria
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Entidade</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold outline-none focus:border-audit-gold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Data-Base do Teste</label>
                    <input
                      type="date"
                      value={reportDate}
                      onChange={e => setReportDate(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-audit-gold"
                    />
                  </div>
                  <div className="pt-4">
                    <label className="w-full h-14 bg-audit-navy text-white rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:bg-audit-navy/80 transition shadow-xl">
                      <i className="fas fa-file-csv text-audit-gold"></i>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Importar Planilha (.CSV)</span>
                      <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </section>

              <div className="p-6 bg-audit-gold/10 border border-audit-gold/30 rounded-3xl">
                <h4 className="text-[10px] font-bold text-audit-navy uppercase tracking-widest mb-2 flex items-center gap-2">
                  <i className="fas fa-info-circle"></i> Nota de Orientação
                </h4>
                <p className="text-[11px] text-slate-700 leading-relaxed italic">
                  O recálculo considera o método linear. Verifique se a entidade utiliza outros métodos (unidades produzidas/soma dos dígitos) antes de prosseguir com os ajustes propostos.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <section className="bg-white border-2 border-slate-200 p-8 rounded-[2rem] shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Inclusão Manual de Ativos</h3>
                <form onSubmit={handleManualAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Descrição do Ativo (Ex: Notebook Dell G15)"
                      value={manualForm.descricao}
                      onChange={e => setManualForm({ ...manualForm, descricao: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-audit-gold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-2">Categoria</label>
                    <select
                      value={manualForm.categoria}
                      onChange={e => setManualForm({ ...manualForm, categoria: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-audit-gold"
                    >
                      <option>Maquinários</option><option>Imóveis</option><option>Veículos</option><option>TI / Hardware</option><option>Móveis e Utensílios</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-2">Início da Depreciação</label>
                    <input
                      type="date"
                      value={manualForm.dataInic}
                      onChange={e => setManualForm({ ...manualForm, dataInic: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-audit-gold"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Custo de Aquisição (R$)"
                      value={manualForm.custo}
                      onChange={e => setManualForm({ ...manualForm, custo: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-audit-gold"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Vida Útil (Anos)"
                      value={manualForm.vidaUtil}
                      onChange={e => setManualForm({ ...manualForm, vidaUtil: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-audit-gold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="w-full h-12 bg-white border-2 border-audit-navy text-audit-navy rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-audit-navy hover:text-white transition shadow-sm"
                    >
                      Adicionar Item ao Teste
                    </button>
                  </div>
                </form>

                {data.length > 0 && (
                  <div className="pt-10 border-t mt-6">
                    <button
                      onClick={() => setStep(2)}
                      className="w-full h-16 bg-audit-navy text-white rounded-3xl font-bold uppercase text-xs tracking-[0.3em] shadow-2xl hover:scale-[1.01] transition flex items-center justify-center gap-4"
                    >
                      Executar Recálculo Analítico ({data.length} Itens)
                      <i className="fas fa-calculator"></i>
                    </button>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* ETAPA 2: RECÁLCULO ANALÍTICO */}
        {step === 2 && audit && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Imobilizado', val: formatBRL(audit.totalCusto), icon: 'boxes-stacked', color: 'text-slate-900' },
                { label: 'Depr. Acum. Auditada', val: formatBRL(audit.totalDeprAuditada), icon: 'check-double', color: 'text-emerald-700' },
                { label: 'Depr. Acum. Contábil', val: formatBRL(audit.totalDeprContabil), icon: 'book', color: 'text-slate-700' },
                { label: 'Divergência Total', val: formatBRL(audit.proposedAdjustment), icon: 'triangle-exclamation', color: Math.abs(audit.proposedAdjustment) > 1000 ? 'text-red-600 font-black' : 'text-slate-900' }
              ].map((card, i) => (
                <div key={i} className="bg-white border-2 border-slate-200 p-6 rounded-3xl text-center shadow-sm group hover:border-audit-navy transition-all">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-audit-gold group-hover:bg-audit-navy group-hover:text-white transition-all">
                    <i className={`fas fa-${card.icon}`}></i>
                  </div>
                  <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{card.label}</h4>
                  <div className={`text-base font-bold mt-1 font-mono ${card.color}`}>{card.val}</div>
                </div>
              ))}
            </div>

            <section className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-audit-navy px-8 py-5 flex justify-between items-center">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Detalhamento Analítico por Ativo</h4>
                <button onClick={() => setStep(3)} className="bg-audit-gold text-audit-navy px-6 py-2 rounded-xl text-[10px] font-bold uppercase shadow-lg hover:bg-white transition">
                  Análise Global <i className="fas fa-chart-pie ml-2"></i>
                </button>
              </div>
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                {audit.processed.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">Nenhum ativo para exibir.</div>
                ) : (
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead className="bg-slate-50 text-[9px] font-bold text-slate-500 uppercase border-b sticky top-0 z-10">
                      <tr>
                        <th className="px-8 py-4">Ativo / Tag</th>
                        <th className="px-8 py-4 text-right">Custo / Residual</th>
                        <th className="px-8 py-4 text-center">Meses Dec.</th>
                        <th className="px-8 py-4 text-right">Depr. Auditada</th>
                        <th className="px-8 py-4 text-right">Divergência</th>
                        <th className="px-8 py-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {audit.processed.map(row => (
                        <tr key={row.id} className="hover:bg-slate-50 transition border-b">
                          <td className="px-8 py-5">
                            <div className="font-bold text-slate-900">{row.descricao}</div>
                            <div className="text-[9px] text-slate-500 flex gap-2 mt-1">
                              <span>ID: {row.tag || row.id.slice(-6)}</span>
                              <span>•</span>
                              <span>Início: {row.dataInic.split('-').reverse().join('/')}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right font-mono">
                            <div className="font-bold text-slate-900">{formatBRL(row.custo)}</div>
                            <div className="text-[9px] text-slate-400">Res: {formatBRL(row.residual)}</div>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <div className="inline-block px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600">
                              {row.safeMonths} m
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right font-bold text-emerald-700 font-mono">
                            {formatBRL(row.deprAcumAuditada)}
                          </td>
                          <td className={`px-8 py-5 text-right font-bold font-mono ${Math.abs(row.variancia) > 1 ? 'text-red-600' : 'text-slate-400'}`}>
                            {formatBRL(row.variancia)}
                          </td>
                          <td className="px-8 py-5 text-center">
                            <Badge color={row.status === 'Crítico' ? 'red' : row.status === 'Atenção' ? 'gold' : 'green'}>
                              {row.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ETAPA 3: ANÁLISE GLOBAL */}
        {step === 3 && audit && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-white border-2 border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">Comparativo Global por Categoria</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <BarChart data={audit.globalSummary} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" fontSize={10} width={80} axisLine={false} tickLine={false} />
                      <RechartsTooltip formatter={(v) => formatBRL(v)} cursor={{ fill: '#f8fafc' }} />
                      <Legend iconType="circle" />
                      <Bar dataKey="contabil" name="Vcto Contábil" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={12} />
                      <Bar dataKey="auditada" name="Auditada" fill="#C5A059" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="bg-white border-2 border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Composição da Carteira (Custo)</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={audit.globalSummary} dataKey="custo" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                        {audit.globalSummary.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                      </Pie>
                      <RechartsTooltip formatter={(v) => formatBRL(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  {audit.globalSummary.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase">{c.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="bg-audit-navy p-10 rounded-[2.5rem] text-white shadow-2xl flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-audit-gold border border-white/5">
                  <i className="fas fa-scale-balanced text-2xl"></i>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-audit-gold uppercase tracking-widest mb-1">Divergência de Auditoria Identificada</h4>
                  <p className="text-3xl font-bold font-mono">{formatBRL(audit.proposedAdjustment)}</p>
                  <p className="text-[9px] text-slate-400 mt-2 italic">
                    A divergência representa {((Math.abs(audit.proposedAdjustment) / audit.totalDeprContabil) * 100).toFixed(2)}% do saldo contabilizado pelo cliente.
                  </p>
                </div>
              </div>
              <button onClick={() => setStep(4)} className="h-14 px-10 bg-audit-gold text-audit-navy rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white transition shadow-lg">
                Finalizar e Gerar Notas
              </button>
            </section>
          </div>
        )}

        {/* ETAPA 4: AJUSTES E NOTAS */}
        {step === 4 && audit && (
          <div className="animate-in slide-in-from-bottom duration-500 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <section className="bg-white border-2 border-slate-200 p-10 rounded-[3rem] shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b pb-6">
                  <div className="w-10 h-10 bg-audit-navy text-audit-gold rounded-xl flex items-center justify-center">
                    <i className="fas fa-pen-nib"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Lançamento Proposto</h3>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 border-l-4 border-l-audit-navy rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ajuste de Depreciação</span>
                      <span className="text-xs font-mono font-bold text-slate-900">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-4 font-mono text-xs">
                      <div className="flex justify-between items-center border-b border-dashed pb-2">
                        <span className="text-slate-500">D - Despesa de Depreciação (Resultado)</span>
                        <span className="font-bold text-slate-900">{formatBRL(Math.abs(audit.proposedAdjustment))}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-dashed pb-2">
                        <span className="text-slate-500">C - Depreciação Acumulada (Ativo)</span>
                        <span className="font-bold text-slate-900">{formatBRL(Math.abs(audit.proposedAdjustment))}</span>
                      </div>
                    </div>
                    <p className="mt-6 text-[10px] text-slate-400 italic">
                      Histórico: Ajuste referente a divergência no recálculo de depreciação acumulada identificado em auditoria para o exercício findo em {reportDate.split('-').reverse().join('/')}.
                    </p>
                  </div>

                  <button onClick={() => window.print()} className="w-full h-12 border-2 border-audit-navy text-audit-navy rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-audit-navy hover:text-white transition">
                    Exportar Memória de Cálculo
                  </button>
                </div>
              </section>

              <section className="bg-audit-navy p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <i className="fas fa-file-invoice text-9xl"></i>
                </div>
                <h3 className="text-2xl font-serif font-bold mb-8">Minuta de Divulgação</h3>
                <div className="space-y-8 text-[11px] text-slate-400 font-mono leading-relaxed h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                  <div className="border-b border-white/10 pb-6">
                    <h5 className="font-bold text-audit-gold mb-2 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-gavel"></i> Nota 12 - Imobilizado (BR/CPC)
                    </h5>
                    <p>
                      "A Companhia avalia seus bens de uso pelo custo de aquisição deduzido da respectiva depreciação acumulada, apurada pelo método linear. O valor residual e a vida útil dos bens são revisados anualmente. Em {reportDate.split('-').reverse().join('/')}, o montante do custo total é de {formatBRL(audit.totalCusto)} com depreciação acumulada de {formatBRL(audit.totalDeprContabil)}."
                    </p>
                  </div>

                  <div className="border-b border-white/10 pb-6">
                    <h5 className="font-bold text-audit-gold mb-2 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-globe"></i> Property, Plant & Equipment (IFRS)
                    </h5>
                    <p>
                      "Items of property, plant and equipment are measured at cost less accumulated depreciation and any accumulated impairment losses. Depreciation is calculated on a straight-line basis over the estimated useful lives of the assets. Residual values are based on current estimates of salvage value at the end of useful life."
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-audit-gold mb-2 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-flag-usa"></i> Fixed Assets Disclosure (US GAAP)
                    </h5>
                    <p>
                      "Fixed assets are stated at cost less accumulated depreciation. Depreciation is provided over the estimated useful lives of the assets, generally ranging from 5 to 25 years, using the straight-line method. Repair and maintenance costs are expensed as incurred."
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <button onClick={() => showToast("Copiado com sucesso!")} className="w-full h-14 bg-audit-gold text-audit-navy rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg hover:bg-white transition">
                    Copiar Notas Técnicas
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] animate-bounce">
          <div className="bg-audit-navy text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl border-2 border-audit-gold flex items-center gap-3">
            <i className="fas fa-check-circle text-audit-gold"></i> {toast}
          </div>
        </div>
      )}
    </div>
  );
}