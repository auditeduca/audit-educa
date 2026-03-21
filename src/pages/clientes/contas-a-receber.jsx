import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  Cell, PieChart, Pie
} from 'recharts';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// --- Constantes de Design Audit Educa ---
const COLORS = ['#0f172a', '#C5A059', '#1e40af', '#334155', '#475569', '#1e293b', '#1e3a8a'];

// --- Componentes Atômicos ---
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
  const steps = ["Dados", "Aging", "PECLD", "Circularização"];
  return (
    <div className="flex flex-wrap gap-3 mb-8 no-print">
      {steps.map((s, i) => (
        <div
          key={i}
          className={`px-5 py-2.5 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shadow-sm ${
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

const Icon = ({ name, className = "" }) => <i className={`fas fa-${name} ${className}`} aria-hidden="true"></i>;

export default function ContasAReceber() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState([]);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountingBalance, setAccountingBalance] = useState('');
  const [currentProvision, setCurrentProvision] = useState('');
  const [toast, setToast] = useState(null);
  const [selectedForSampling, setSelectedForSampling] = useState([]);

  // Formulário manual
  const [manualForm, setManualForm] = useState({
    cliente: '', documento: '', emissao: '', vencimento: '', valor: ''
  });

  const [agingConfig, setAgingConfig] = useState([
    { id: 1, label: 'A vencer', min: -9999, max: 0, prov: 0 },
    { id: 2, label: '01-30 dias', min: 1, max: 30, prov: 1.5 },
    { id: 3, label: '31-60 dias', min: 31, max: 60, prov: 3.0 },
    { id: 4, label: '61-90 dias', min: 61, max: 90, prov: 5.0 },
    { id: 5, label: '91-180 dias', min: 91, max: 180, prov: 20.0 },
    { id: 6, label: '181-360 dias', min: 181, max: 360, prov: 50.0 },
    { id: 7, label: '> 360 dias', min: 361, max: 9999, prov: 100.0 }
  ]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!manualForm.cliente || !manualForm.valor || !manualForm.vencimento) {
      showToast("Campos obrigatórios: Cliente, Valor e Vencimento.");
      return;
    }
    const newItem = { ...manualForm, id: `manual-${Date.now()}` };
    setData(prev => [...prev, newItem]);
    setManualForm({ cliente: '', documento: '', emissao: '', vencimento: '', valor: '' });
    showToast("Título adicionado.");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result.split('\n').filter(l => l.trim()).slice(1).map((line, idx) => {
        const cols = line.split(';').map(c => c.trim().replace(/"/g, ''));
        return {
          id: `csv-${idx}-${Date.now()}`,
          cliente: cols[0],
          documento: cols[1],
          emissao: cols[2],
          vencimento: cols[3],
          valor: cols[4]?.replace(',', '.')
        };
      });
      setData(rows);
      showToast(`${rows.length} itens importados.`);
    };
    reader.readAsText(file);
  };

  const toggleSample = (id) => {
    setSelectedForSampling(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const audit = useMemo(() => {
    if (!data.length) return null;

    const dtBase = new Date(reportDate);
    let totalBruto = 0;
    let circulante = 0;
    let naoCirculante = 0;
    let totalProvisioned = 0;

    const processed = data.map((item, idx) => {
      const valor = parseFloat(item.valor) || 0;
      totalBruto += valor;

      const dtVenc = new Date(item.vencimento);
      const diffTime = dtBase - dtVenc;
      const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const daysFromBase = Math.ceil((dtVenc - dtBase) / (1000 * 60 * 60 * 24));
      const isNC = daysFromBase > 365;
      if (isNC) naoCirculante += valor; else circulante += valor;

      const range = agingConfig.find(r => daysOverdue >= r.min && daysOverdue <= r.max);
      const provRate = range ? range.prov : 0;
      const itemProvision = valor > 0 ? (valor * (provRate / 100)) : 0;
      totalProvisioned += itemProvision;

      return {
        ...item,
        id: item.id || `row-${idx}`,
        valor,
        daysOverdue,
        isNC,
        rangeLabel: range ? range.label : 'N/A',
        itemProvision
      };
    });

    return {
      processed,
      totalBruto,
      circulante,
      naoCirculante,
      totalProvisioned,
      agingSummary: agingConfig.map(range => ({
        name: range.label,
        value: processed.filter(p => p.rangeLabel === range.label).reduce((a, b) => a + b.valor, 0)
      })),
      diffAccounting: totalBruto - (parseFloat(accountingBalance) || 0),
      proposedAdjustment: totalProvisioned - (parseFloat(currentProvision) || 0)
    };
  }, [data, reportDate, agingConfig, accountingBalance, currentProvision]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-grow p-4 md:p-12 max-w-7xl mx-auto w-full">
        <StepIndicator currentStep={step} />

        {/* ETAPA 1: Dados */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-5 space-y-6">
              <section className="bg-white border-2 border-slate-200 p-8 rounded-[2rem] shadow-sm">
                <h3 className="text-xs font-bold text-audit-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Icon name="gear" className="text-audit-gold" /> Configuração
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Data-Base</label>
                    <input
                      type="date"
                      value={reportDate}
                      onChange={e => setReportDate(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold outline-none focus:border-audit-gold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Saldo Contábil (R$)</label>
                    <input
                      type="number"
                      value={accountingBalance}
                      onChange={e => setAccountingBalance(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono outline-none focus:border-audit-gold"
                      placeholder="0,00"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Provisão Atual (R$)</label>
                    <input
                      type="number"
                      value={currentProvision}
                      onChange={e => setCurrentProvision(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono outline-none focus:border-audit-gold"
                      placeholder="0,00"
                    />
                  </div>
                  <div className="pt-4">
                    <label className="w-full h-14 bg-audit-navy text-white rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:bg-audit-navy/80 transition shadow-xl">
                      <Icon name="file-csv" className="text-audit-gold" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Importar CSV</span>
                      <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <section className="bg-white border-2 border-slate-200 p-8 rounded-[2rem] shadow-sm">
                <h3 className="text-xs font-bold text-audit-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Icon name="pen" className="text-audit-gold" /> Inclusão Manual
                </h3>
                <form onSubmit={handleManualAdd} className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Cliente"
                    value={manualForm.cliente}
                    onChange={e => setManualForm({ ...manualForm, cliente: e.target.value })}
                    className="col-span-2 h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-audit-gold"
                  />
                  <input
                    type="text"
                    placeholder="Documento"
                    value={manualForm.documento}
                    onChange={e => setManualForm({ ...manualForm, documento: e.target.value })}
                    className="h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-audit-gold"
                  />
                  <input
                    type="date"
                    value={manualForm.emissao}
                    onChange={e => setManualForm({ ...manualForm, emissao: e.target.value })}
                    className="h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-audit-gold"
                  />
                  <input
                    type="date"
                    value={manualForm.vencimento}
                    onChange={e => setManualForm({ ...manualForm, vencimento: e.target.value })}
                    className="h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-audit-gold"
                  />
                  <input
                    type="number"
                    placeholder="Valor (R$)"
                    value={manualForm.valor}
                    onChange={e => setManualForm({ ...manualForm, valor: e.target.value })}
                    className="col-span-2 h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold outline-none focus:border-audit-gold"
                  />
                  <button
                    type="submit"
                    className="col-span-2 h-12 bg-white border-2 border-audit-navy text-audit-navy rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-audit-navy hover:text-white transition"
                  >
                    Adicionar Título
                  </button>
                </form>
                {data.length > 0 && (
                  <div className="pt-6">
                    <button
                      onClick={() => setStep(2)}
                      className="w-full h-14 bg-audit-navy text-white rounded-2xl font-bold uppercase text-xs tracking-widest shadow-2xl hover:scale-[1.01] transition flex items-center justify-center gap-4"
                    >
                      Processar ({data.length} itens) <Icon name="arrow-right" />
                    </button>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* ETAPA 2: Aging */}
        {step === 2 && audit && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Listagem', val: formatBRL(audit.totalBruto), icon: 'list', color: 'text-audit-navy' },
                { label: 'Diferença Conciliação', val: formatBRL(audit.diffAccounting), icon: 'equals', color: Math.abs(audit.diffAccounting) > 0.01 ? 'text-red-600' : 'text-emerald-700' },
                { label: 'Circulante', val: formatBRL(audit.circulante), icon: 'calendar-day', color: 'text-slate-700' },
                { label: 'Não Circulante', val: formatBRL(audit.naoCirculante), icon: 'calendar-alt', color: 'text-audit-blue' }
              ].map((card, i) => (
                <div key={i} className="bg-white border-2 border-slate-200 p-6 rounded-3xl text-center flex flex-col items-center">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-audit-gold">
                    <Icon name={card.icon} />
                  </div>
                  <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{card.label}</h4>
                  <div className={`text-lg font-bold mt-1 font-mono ${card.color}`}>{card.val}</div>
                </div>
              ))}
            </div>

            <section className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden">
              <div className="bg-slate-50 px-8 py-5 border-b flex justify-between items-center">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-audit-navy">Envelhecimento</h4>
                <button onClick={() => setStep(3)} className="bg-audit-navy text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase hover:bg-slate-800 transition">
                  Próximo <Icon name="arrow-right" className="ml-2" />
                </button>
              </div>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-white text-[9px] font-bold text-slate-500 uppercase border-b sticky top-0">
                    <tr>
                      <th className="px-8 py-4">Cliente</th>
                      <th className="px-8 py-4 text-right">Valor</th>
                      <th className="px-8 py-4 text-center">Dias Venc.</th>
                      <th className="px-8 py-4">Faixa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {audit.processed.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50">
                        <td className="px-8 py-5">
                          <div className="font-bold text-slate-800">{row.cliente}</div>
                          <div className="text-[9px] text-slate-500 font-mono">{row.documento}</div>
                        </td>
                        <td className="px-8 py-5 text-right font-mono font-bold">{formatBRL(row.valor)}</td>
                        <td className="px-8 py-5 text-center">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${row.daysOverdue > 90 ? 'bg-red-100 text-red-800' : row.daysOverdue > 0 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                            {row.daysOverdue} d
                          </span>
                        </td>
                        <td className="px-8 py-5">{row.rangeLabel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ETAPA 3: PECLD */}
        {step === 3 && audit && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <section className="bg-white border-2 border-slate-200 p-8 rounded-[2rem] shadow-sm lg:col-span-1 space-y-6">
              <h4 className="text-[11px] font-bold text-audit-navy uppercase tracking-widest border-b pb-4">Provisão Calculada</h4>
              <div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Valor Provisionado</span>
                  <div className="text-2xl font-bold text-red-700 font-mono">{formatBRL(audit.totalProvisioned)}</div>
                </div>
                <div className="p-4 bg-audit-navy text-white rounded-2xl mt-4 text-center">
                  <span className="text-[10px] font-bold text-audit-gold uppercase block mb-2">Ajuste Proposto</span>
                  <div className="text-2xl font-bold font-mono">{formatBRL(audit.proposedAdjustment)}</div>
                </div>
              </div>
              <button onClick={() => setStep(4)} className="w-full h-14 bg-audit-gold text-audit-navy rounded-2xl font-bold uppercase text-[11px] hover:bg-audit-navy hover:text-white transition">
                Amostragem <Icon name="arrow-right" className="ml-2" />
              </button>
            </section>

            <section className="lg:col-span-2 bg-white border-2 border-slate-200 p-8 rounded-[2rem] shadow-sm">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-6">Perfil de Risco</h4>
              <div className="h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={audit.agingSummary}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {audit.agingSummary.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(v) => formatBRL(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        )}

        {/* ETAPA 4: Circularização */}
        {step === 4 && audit && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-audit-navy">Seleção para Circularização</h3>
              <div className="flex gap-4">
                <div className="bg-audit-navy text-white px-8 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
                  <span className="text-[10px] font-bold uppercase text-audit-gold">Amostra:</span>
                  <span className="text-2xl font-bold font-mono">{selectedForSampling.length}</span>
                </div>
                <button
                  onClick={() => window.print()}
                  disabled={selectedForSampling.length === 0}
                  className="bg-audit-gold text-audit-navy font-bold uppercase text-[11px] px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition disabled:opacity-30"
                >
                  Imprimir Cartas
                </button>
              </div>
            </div>

            <section className="bg-white border-2 border-slate-200 rounded-[2rem] overflow-hidden">
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 font-bold uppercase text-[9px] text-slate-600 sticky top-0">
                    <tr>
                      <th className="px-8 py-5 text-center w-12">Sel.</th>
                      <th className="px-8 py-5">Cliente</th>
                      <th className="px-8 py-5 text-right">Saldo</th>
                      <th className="px-8 py-5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audit.processed.map(row => (
                      <tr
                        key={row.id}
                        className={`transition cursor-pointer border-b ${selectedForSampling.includes(row.id) ? 'bg-audit-navy/10' : 'hover:bg-slate-100'}`}
                        onClick={() => toggleSample(row.id)}
                      >
                        <td className="px-8 py-5 text-center">
                          <div className={`w-6 h-6 mx-auto rounded-lg border-2 flex items-center justify-center transition-all ${selectedForSampling.includes(row.id) ? 'bg-audit-navy border-audit-navy text-white' : 'bg-white border-slate-300'}`}>
                            {selectedForSampling.includes(row.id) && <Icon name="check" className="text-[10px]" />}
                          </div>
                        </td>
                        <td className="px-8 py-5 font-bold">{row.cliente}</td>
                        <td className="px-8 py-5 text-right font-mono font-bold">{formatBRL(row.valor)}</td>
                        <td className="px-8 py-5 text-center">
                          <Badge color={row.daysOverdue > 90 ? 'red' : row.daysOverdue > 0 ? 'gold' : 'green'}>
                            {row.rangeLabel}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* Navegação entre etapas (se necessário) */}
        {step > 1 && step < 5 && (
          <div className="mt-10 flex justify-between">
            <button onClick={() => setStep(step - 1)} className="px-6 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
              Voltar
            </button>
            {step < 4 && (
              <button onClick={() => setStep(step + 1)} className="px-6 py-2 bg-audit-navy text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition">
                Próximo
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] animate-bounce">
          <div className="bg-audit-navy text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl border-2 border-audit-gold flex items-center gap-3">
            <Icon name="check-circle" className="text-audit-gold" /> {toast}
          </div>
        </div>
      )}
    </div>
  );
}