import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Send, 
  FileText, 
  Activity, 
  BookOpen, 
  AlertCircle,
  Cpu,
  Search,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Trophy,
  Database,
  Scale
} from 'lucide-react';

/**
 * IAGEN - Módulo de Auditoria Agêntica v3.0
 * Localização: src/pages/IAGEN.jsx
 * Estilo: Premium Navy & Gold
 */

const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-[#C5A059] hover:bg-[#b38f4d] text-[#0C1B33] shadow-lg shadow-[#C5A059]/20',
    outline: 'border border-[#C5A059]/30 hover:border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059]/5',
    navy: 'bg-[#0C1B33] hover:bg-[#0e2142] text-white border border-white/10'
  };
  return (
    <button 
      onClick={onClick} 
      className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", onClick = null }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-500 group ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);

export default function IAGEN() {
  const [step, setStep] = useState('selection'); // 'selection' ou 'simulator'
  const [selectedCase, setSelectedCase] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [ceticismo, setCeticismo] = useState(30);

  const cases = [
    { 
      id: 1, 
      title: "Corte de Vendas (Cut-off)", 
      desc: "Valide a competência das receitas de final de ano conforme o CPC 47.",
      norma: "CPC 47 / IFRS 15",
      impacto: "500 XP",
      icon: <Activity size={24} className="text-[#C5A059]" />
    },
    { 
      id: 2, 
      title: "Inventário de Estoques", 
      desc: "Analise divergências de contagem física e riscos de obsolescência (CPC 16).",
      norma: "CPC 16 / IAS 2",
      impacto: "750 XP",
      icon: <Database size={24} className="text-[#C5A059]" />
    }
  ];

  const handleSelectCase = (c) => {
    setSelectedCase(c);
    setMessages([{ 
      role: 'ai', 
      content: `Bem-vindo ao Laboratório IA. Sou seu Revisor Sênior. Analise o caso "${c.title}" e submeta seu parecer técnico.` 
    }]);
    setStep('simulator');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: selectedCase?.title,
          userMessage: userMsg
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.analise || data.pergunta_socrata }]);
      if (data.ceticismo_score) setCeticismo(data.ceticismo_score);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Erro na rede agêntica. Verifique os documentos." }]);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'selection') {
    return (
      <div className="p-10 max-w-7xl mx-auto animate-in fade-in duration-700">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4 text-[#C5A059]">
            <div className="h-1 bg-[#C5A059] w-12 rounded-full"></div>
            <span className="uppercase tracking-[0.3em] font-black text-[10px]">Workshops IA 2026</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-[#0C1B33] tracking-tight text-white">
            Desafios <span className="text-[#C5A059]">Agênticos</span>
          </h2>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {cases.map(c => (
            <Card key={c.id} onClick={() => handleSelectCase(c)} className="hover:border-b-4 hover:border-b-[#C5A059]">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-[#0C1B33] group-hover:text-[#C5A059] transition-all duration-500">
                {c.icon}
              </div>
              <div className="mb-2 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                <span>{c.norma}</span>
                <span className="bg-slate-100 px-2 py-1 rounded text-slate-500">{c.impacto}</span>
              </div>
              <h3 className="text-2xl font-black text-[#0C1B33] mb-4 tracking-tight group-hover:text-[#C5A059] transition-colors">{c.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1 font-light italic">"{c.desc}"</p>
              <div className="flex items-center gap-2 text-[#0C1B33] font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                Iniciar Papel de Trabalho <ChevronRight size={14} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-in fade-in duration-500">
      {/* Header do Caso */}
      <div className="bg-[#0C1B33] p-6 border-b border-white/10 flex justify-between items-center rounded-t-3xl">
        <div className="flex items-center gap-4">
          <button onClick={() => setStep('selection')} className="text-[#C5A059] hover:bg-white/5 p-2 rounded-xl transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="text-white font-bold text-lg">{selectedCase?.title}</h3>
            <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-widest">{selectedCase?.norma}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest block mb-1">Ceticismo</span>
              <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-[#C5A059] transition-all duration-1000 shadow-[0_0_10px_#C5A059]" style={{ width: `${ceticismo}%` }}></div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat de Auditoria */}
        <div className="w-full md:w-[450px] bg-white border-r border-slate-200 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-[#0C1B33] text-white rounded-tr-none' 
                  : 'bg-slate-50 border border-slate-200 text-slate-600 rounded-tl-none border-l-4 border-l-[#C5A059]'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-[11px] text-[#C5A059] animate-pulse font-bold italic">IA analisando riscos...</div>}
          </div>
          <form onSubmit={handleSend} className="p-6 border-t border-slate-200 bg-white">
            <div className="relative">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Discuta as evidências..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm outline-none focus:ring-2 focus:ring-[#C5A059]/30 transition-all pr-14"
              />
              <button type="submit" className="absolute right-3 top-2.5 w-10 h-10 bg-[#0C1B33] text-[#C5A059] rounded-xl flex items-center justify-center">
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Dashboard de Trabalho */}
        <div className="hidden md:flex flex-1 p-10 bg-[#F8FAFC] overflow-y-auto flex-col gap-8">
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#C5A059]">
                 <FileText size={32} />
              </div>
              <div>
                 <h4 className="font-black text-[#0C1B33] uppercase text-xs tracking-widest mb-1">Pasta de Trabalho Digital</h4>
                 <p className="text-slate-500 text-sm">Arraste os documentos de suporte (PDF/XLSX) para validação agêntica.</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#0C1B33] p-8 rounded-[2rem] text-white relative overflow-hidden">
                 <Trophy className="absolute -right-4 -bottom-4 text-[#C5A059] opacity-10" size={100} />
                 <h5 className="text-[#C5A059] text-[10px] font-black uppercase tracking-widest mb-4">Procedimentos Requeridos</h5>
                 <ul className="text-xs space-y-3 text-slate-300">
                    <li className="flex gap-2 items-center"><CheckCircle2 size={12} className="text-[#C5A059]" /> Validar competência do exercício</li>
                    <li className="flex gap-2 items-center"><CheckCircle2 size={12} className="text-[#C5A059]" /> Cruzamento de datas NF vs Canhotos</li>
                    <li className="flex gap-2 items-center"><CheckCircle2 size={12} className="text-[#C5A059]" /> Cálculo de PECLD (CPC 48)</li>
                 </ul>
              </div>
              <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-200 flex flex-col justify-center">
                 <AlertCircle size={24} className="text-amber-600 mb-3" />
                 <p className="text-xs text-amber-900 leading-relaxed font-medium italic">
                    "O auditor deve planejar e executar a auditoria com ceticismo profissional, reconhecendo que podem existir distorções relevantes." (NBC TA 200)
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}