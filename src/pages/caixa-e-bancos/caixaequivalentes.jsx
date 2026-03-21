import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  Wallet, 
  Calculator, 
  FileCheck, 
  Calendar,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Lock,
  Download
} from 'lucide-react';

/**
 * DESIGN TOKENS (Baseados no padrão Audit Educa)
 */
const COLORS = {
  navy: '#0C1B33',
  gold: '#C9A84C',
  goldLight: '#E2C87A',
  slate: {
    50: '#F8F9FB',
    100: '#F1F5F9',
    200: '#E2E8F0',
    500: '#64748B',
    700: '#334155',
  }
};

/** * COMPONENTE: TELA DE BOAS-VINDAS
 */
const WelcomeScreen = ({ onStart }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/95 backdrop-blur-sm p-4">
    <div className="max-w-2xl w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
      <div className="md:w-1/2 bg-audit-navy p-10 flex flex-col justify-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-audit-gold rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <ShieldCheck className="w-16 h-16 text-audit-gold mb-6 relative z-10" />
        <h1 className="text-3xl font-bold mb-4 relative z-10 leading-tight">Módulo de Caixa e Equivalentes</h1>
        <p className="text-slate-300 relative z-10 leading-relaxed">
          Inicie o procedimento de auditoria substantiva para validar a existência, integridade e avaliação das disponibilidades da entidade.
        </p>
      </div>
      <div className="md:w-1/2 p-10 flex flex-col justify-center">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">O que vamos validar?</h2>
        <ul className="space-y-4 mb-8">
          {[
            { icon: Wallet, text: "Contagem física de caixa" },
            { icon: Calculator, text: "Conciliação bancária" },
            { icon: FileCheck, text: "Liquidez e restrições" }
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-600">
              <div className="p-2 bg-slate-100 rounded-lg text-audit-navy">
                <item.icon size={18} />
              </div>
              <span className="text-sm font-medium">{item.text}</span>
            </li>
          ))}
        </ul>
        <button 
          onClick={onStart}
          className="w-full bg-audit-navy hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 group"
        >
          Iniciar Auditoria <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
);

/**
 * COMPONENTE: BARRA DE DATA (MeasuredDateBar)
 */
const DateBar = ({ date, setDate }) => (
  <div className="w-full bg-slate-50 border-b border-slate-200 sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-audit-navy font-semibold text-sm uppercase tracking-wider">
        <Calendar size={16} className="text-audit-gold" />
        Data-Base da Auditoria:
      </div>
      <input 
        type="date" 
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-audit-gold outline-none text-slate-700"
      />
    </div>
    <div className="hidden md:flex items-center gap-6">
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        Ambiente de Produção
      </div>
      <div className="text-xs text-slate-400">Ref: NBC TA 315 / 330</div>
    </div>
  </div>
);

/**
 * COMPONENTE: BARRA DE PROGRESSO
 */
const Stepper = ({ currentStep, steps }) => (
  <div className="mb-10">
    <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center relative z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted ? 'bg-audit-gold text-white shadow-lg' : 
                  isActive ? 'bg-audit-navy text-white shadow-xl scale-110 ring-4 ring-slate-100' : 
                  'bg-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? <CheckCircle2 size={20} /> : <span className="font-bold text-sm">{index + 1}</span>}
              </div>
              <span className={`text-[10px] uppercase font-bold mt-2 absolute -bottom-6 whitespace-nowrap tracking-tighter ${isActive ? 'text-audit-navy' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 bg-slate-200 mx-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-audit-gold transition-all duration-500 ease-in-out" 
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

/**
 * CONTEÚDO DAS ETAPAS
 */
const StepContent = ({ step, data, updateData }) => {
  
  // Etapa 1: Listagem de Contas
  if (step === 0) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-audit-navy">Mapeamento de Contas</h3>
            <p className="text-slate-500">Identifique as contas que compõem o saldo de caixa e equivalentes.</p>
          </div>
          <button 
            onClick={() => updateData('contas', [...data.contas, { id: Date.now(), nome: '', saldo: 0, tipo: 'Banco' }])}
            className="bg-audit-navy text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus size={18} /> Adicionar Conta
          </button>
        </div>

        <div className="grid gap-4">
          {data.contas.map((conta, idx) => (
            <div key={conta.id} className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-wrap md:flex-nowrap gap-4 items-center shadow-sm hover:border-audit-gold/30 transition-all">
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Nome da Conta / Banco</label>
                <input 
                  type="text" 
                  placeholder="Ex: Banco Itaú - C/C principal"
                  className="w-full border-b border-slate-100 focus:border-audit-gold outline-none py-1 text-slate-700 font-medium"
                  value={conta.nome}
                  onChange={(e) => {
                    const newContas = [...data.contas];
                    newContas[idx].nome = e.target.value;
                    updateData('contas', newContas);
                  }}
                />
              </div>
              <div className="w-40">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Tipo</label>
                <select 
                  className="w-full bg-slate-50 rounded-lg p-1 text-sm outline-none border border-transparent focus:border-slate-200"
                  value={conta.tipo}
                  onChange={(e) => {
                    const newContas = [...data.contas];
                    newContas[idx].tipo = e.target.value;
                    updateData('contas', newContas);
                  }}
                >
                  <option>Banco</option>
                  <option>Caixa Físico</option>
                  <option>Aplicação Imediata</option>
                </select>
              </div>
              <div className="w-48">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Saldo no Razão (R$)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 rounded-lg p-2 text-right font-mono font-bold text-audit-navy outline-none border border-transparent focus:border-audit-gold/50"
                  value={conta.saldo}
                  onChange={(e) => {
                    const newContas = [...data.contas];
                    newContas[idx].saldo = e.target.value;
                    updateData('contas', newContas);
                  }}
                />
              </div>
              <button 
                onClick={() => updateData('contas', data.contas.filter(c => c.id !== conta.id))}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {data.contas.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
              Nenhuma conta adicionada. Clique em "Adicionar Conta" para começar.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Etapa 2: Conciliação
  if (step === 1) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-amber-50 border-l-4 border-audit-gold p-6 rounded-r-2xl">
          <div className="flex gap-3 text-amber-900 mb-2 font-bold items-center">
            <Info size={20} /> Procedimento de Conciliação
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">
            Compare os saldos do razão com os extratos bancários. Verifique se existem cheques em trânsito, depósitos não identificados ou tarifas não contabilizadas.
          </p>
        </div>

        <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Conta</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase text-right">Saldo Razão</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase text-right">Saldo Extrato</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase text-right">Diferença</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.contas.map((conta, idx) => {
                const extrato = data.conciliacao?.[conta.id]?.extrato || 0;
                const diff = Math.abs(conta.saldo - extrato);
                return (
                  <tr key={conta.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 font-semibold text-audit-navy">{conta.nome || 'Sem nome'}</td>
                    <td className="p-5 text-right font-mono text-slate-600">R$ {parseFloat(conta.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="p-5 text-right">
                      <input 
                        type="number" 
                        className="bg-slate-100 rounded px-2 py-1 text-right font-mono w-32 border border-transparent focus:border-audit-gold outline-none"
                        value={extrato}
                        onChange={(e) => {
                          const newConc = { ...data.conciliacao };
                          newConc[conta.id] = { ...newConc[conta.id], extrato: e.target.value };
                          updateData('conciliacao', newConc);
                        }}
                      />
                    </td>
                    <td className={`p-5 text-right font-mono font-bold ${diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      R$ {diff.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-5 text-center">
                      {diff === 0 ? (
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">Conciliado</span>
                      ) : (
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">Pendente</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Etapa 3: Resumo e Notas
  if (step === 2) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm">
            <h4 className="text-slate-500 text-xs font-bold uppercase mb-4">Total Caixa e Equivalentes</h4>
            <div className="text-3xl font-bold text-audit-navy">
              R$ {data.contas.reduce((acc, curr) => acc + parseFloat(curr.saldo || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-2 text-xs text-green-600 flex items-center gap-1 font-semibold">
              <CheckCircle2 size={12} /> Base 100% validada
            </div>
          </div>
          <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm">
            <h4 className="text-slate-500 text-xs font-bold uppercase mb-4">Diferenças Não Conciliadas</h4>
            <div className="text-3xl font-bold text-red-600">
              R$ {Object.keys(data.conciliacao || {}).reduce((acc, id) => {
                const conta = data.contas.find(c => c.id.toString() === id.toString());
                const diff = conta ? Math.abs(conta.saldo - (data.conciliacao[id].extrato || 0)) : 0;
                return acc + diff;
              }, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm flex flex-col justify-between">
            <h4 className="text-slate-500 text-xs font-bold uppercase mb-4">Risco de Auditoria</h4>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(v => (
                <div key={v} className={`h-2 flex-1 rounded-full ${v <= 2 ? 'bg-audit-navy' : 'bg-slate-100'}`}></div>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Nível: Baixo / Planejado</span>
          </div>
        </div>

        <div className="bg-audit-navy text-white p-8 rounded-[2.5rem] relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileCheck className="text-audit-gold" /> Conclusão da Auditoria
            </h3>
            <textarea 
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white placeholder:text-white/40 outline-none focus:bg-white/15 transition-all min-h-[150px]"
              placeholder="Descreva as principais constatações, ajustes sugeridos ou limitações de escopo..."
              value={data.conclusao}
              onChange={(e) => updateData('conclusao', e.target.value)}
            />
            <div className="mt-6 flex justify-end">
              <button className="bg-audit-gold hover:bg-audit-goldLight text-audit-navy font-bold px-6 py-3 rounded-xl transition-all active:scale-95 flex items-center gap-2">
                <Download size={18} /> Gerar Papel de Trabalho (PDF)
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <ShieldCheck size={180} />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

/**
 * COMPONENTE PRINCIPAL (APP)
 */
export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [auditData, setAuditData] = useState({
    contas: [
      { id: 1, nome: 'Caixa Geral - Sede', saldo: 1500.00, tipo: 'Caixa Físico' },
      { id: 2, nome: 'Banco do Brasil - Conta Movimento', saldo: 245600.50, tipo: 'Banco' }
    ],
    conciliacao: {},
    conclusao: ''
  });

  const STEPS = [
    { label: 'Identificação' },
    { label: 'Conciliação' },
    { label: 'Papel de Trabalho' }
  ];

  const updateData = (key, value) => {
    setAuditData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(curr => curr + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-sans text-slate-800">
      {showWelcome && <WelcomeScreen onStart={() => setShowWelcome(false)} />}
      
      {/* HEADER SIMULADO */}
      <header className="bg-audit-navy text-white px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-audit-gold rounded-xl flex items-center justify-center font-bold text-audit-navy text-xl">A</div>
          <div>
            <div className="text-lg font-bold leading-tight">Audit Educa</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-audit-gold opacity-80">Plataforma Educativa</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Search size={20} /></button>
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs border border-white/20">JD</div>
        </div>
      </header>

      <DateBar date={date} setDate={setDate} />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-audit-navy px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Lock size={12} className="text-audit-gold" /> Auditoria Substantiva
          </div>
          <h2 className="text-4xl font-extrabold text-audit-navy mb-2">Caixa e Equivalentes de Caixa</h2>
          <p className="text-slate-500 text-lg">Validação de ativos de alta liquidez e disponibilidades imediatas.</p>
        </div>

        <Stepper currentStep={currentStep} steps={STEPS} />

        <div className="mt-16 bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm min-h-[500px] relative">
          <StepContent 
            step={currentStep} 
            data={auditData} 
            updateData={updateData} 
          />

          {/* NAVEGAÇÃO INTERNA */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-50 active:scale-95'
              }`}
            >
              <ChevronLeft size={20} /> Voltar
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest mr-4">Etapa {currentStep + 1} de {STEPS.length}</span>
              <button 
                onClick={nextStep}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg ${
                  currentStep === STEPS.length - 1 
                    ? 'bg-green-600 text-white' 
                    : 'bg-audit-navy text-white hover:bg-slate-800'
                }`}
              >
                {currentStep === STEPS.length - 1 ? 'Finalizar Auditoria' : 'Próxima Etapa'}
                {currentStep !== STEPS.length - 1 && <ChevronRight size={20} />}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-400">A</div>
            <span>© 2024 Audit Educa. Todos os direitos reservados.</span>
          </div>
          <div className="flex gap-8 font-medium">
            <a href="#" className="hover:text-audit-navy transition-colors">Termos</a>
            <a href="#" className="hover:text-audit-navy transition-colors">Privacidade</a>
            <a href="#" className="hover:text-audit-navy transition-colors">Ajuda</a>
          </div>
        </div>
      </footer>

      {/* CSS ADICIONAL PARA ANIMAÇÕES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom { from { transform: translateY(1rem); } to { transform: translateY(0); } }
        @keyframes slide-in-from-right { from { transform: translateX(1rem); } to { transform: translateX(0); } }
        @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom; }
        .slide-in-from-right-4 { animation-name: slide-in-from-right; }
        .zoom-in { animation-name: zoom-in; }
        .duration-300 { animation-duration: 300ms; }
        .duration-500 { animation-duration: 500ms; }
        .bg-audit-navy { background-color: ${COLORS.navy}; }
        .text-audit-navy { color: ${COLORS.navy}; }
        .bg-audit-gold { background-color: ${COLORS.gold}; }
        .text-audit-gold { color: ${COLORS.gold}; }
        .hover\\:bg-audit-goldLight:hover { background-color: ${COLORS.goldLight}; }
      `}} />
    </div>
  );
}