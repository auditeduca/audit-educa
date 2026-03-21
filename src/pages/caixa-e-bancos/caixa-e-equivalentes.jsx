// caixa-e-equivalentes.jsx
import React, { useState, useRef, useLayoutEffect, useEffect, useCallback, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Toast from '../../components/ui/Toast';
import BackgroundImage from '../../components/BackgroundImage';
import MeasuredDateBar from '../../components/MeasuredDateBar';
import SidebarTools from '../../components/SidebarTools';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// ============================================================
// METADADOS DO MÓDULO (ATRIBUÍVEL - ALCOA)
// ============================================================
const MODULE_METADATA = {
  name: 'CaixaEquivalentes',
  version: '2.0.0',
  author: 'Engenharia Audit Educa',
  lastUpdated: '2026-03-20',
  responsible: 'Time de Desenvolvimento',
  classificationCriteria: 'CPC 03 (R2)',
  validationRequired: true,
  auditTrail: true
};

// ============================================================
// CONSTANTES VALIDADAS E RASTREÁVEIS (ACURADO - ALCOA)
// ============================================================
const STORAGE_KEY = 'audit_educa_caixa_equivalentes_v2';

const REF_PRODUTOS = Object.freeze([
  { id: "CDB", label: "CDB / RDB", desc: "Certificado de Depósito Bancário / Recibo de Depósito Bancário", categoria: "Renda Fixa Bancária" },
  { id: "LCI", label: "LCI / LCA", desc: "Letra de Crédito Imobiliário / do Agronegócio", categoria: "Renda Fixa Isenta" },
  { id: "POUP", label: "Poupança", desc: "Caderneta de Poupança", categoria: "Depósito de Poupança" },
  { id: "CASH", label: "Dinheiro / Conta Corrente", desc: "Disponibilidades imediatas", categoria: "Caixa" },
  { id: "LFT", label: "Tesouro Selic (LFT)", desc: "Título público pós‑fixado", categoria: "Tesouro Direto" },
  { id: "IPCA", label: "Tesouro Prefixado / IPCA", desc: "Títulos públicos com juros semestrais", categoria: "Tesouro Direto" },
  { id: "FDI", label: "Fundo DI / Renda Fixa", desc: "Fundos de investimento de renda fixa", categoria: "Fundos" },
  { id: "FMM", label: "Fundo Multimercado / Ações", desc: "Fundos com exposição a risco", categoria: "Fundos" },
  { id: "DEB", label: "Debêntures", desc: "Títulos de dívida privada", categoria: "Renda Fixa Privada" },
  { id: "CORP", label: "Ações / Derivativos", desc: "Participações societárias e derivativos", categoria: "Renda Variável" }
]);

const CLASSIFICATION_RULES = Object.freeze({
  CAIXA_E_EQUIVALENTES: {
    name: 'Caixa e Equivalentes',
    maxDaysToMaturity: 90,
    reasoning: 'Vencimento original ≤ 90 dias (Item 7 CPC 03)',
    color: '#10b981',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800'
  },
  ATIVO_FINANCEIRO_AC: {
    name: 'Ativo Financeiro (AC)',
    reasoning: 'Realizável em 12 meses, mas vencimento original > 90 dias',
    color: '#3b82f6',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800'
  },
  ATIVO_FINANCEIRO_ANC: {
    name: 'Ativo Financeiro (ANC)',
    reasoning: 'Vencimento a longo prazo (> 12 meses da data base)',
    color: '#6366f1',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-200 dark:border-indigo-800'
  },
  CAIXA_RESTRITO: {
    name: 'Caixa Restrito (ANC)',
    reasoning: 'Item 48 CPC 03: Saldo indisponível para uso imediato',
    color: '#ef4444',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800'
  },
  RISCO_SIGNIFICATIVO: {
    name: 'Ativo Financeiro (AC)',
    reasoning: 'Risco significativo de mudança de valor (não atende definição de equivalente)',
    color: '#f59e0b',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800'
  }
});

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6366f1'];

// ============================================================
// FUNÇÕES PURAS DE UTILIDADE (TESTÁVEIS E RASTREÁVEIS)
// ============================================================

const formatCurrency = (val) => {
  if (typeof val !== 'number' || isNaN(val)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const formatDate = (date) => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('pt-BR');
  } catch {
    return '';
  }
};

const daysBetween = (start, end) => {
  return Math.ceil((end - start) / 86400000);
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// ============================================================
// MOTOR DE CLASSIFICAÇÃO CPC 03 (DOCUMENTADO E TESTÁVEL)
// ============================================================

function classificarAtivo({ product, acquisitionDate, maturityDate, reportDate, isRestricted }) {
  if (!product || !acquisitionDate || !maturityDate || !reportDate) {
    throw new Error('Parâmetros insuficientes para classificação');
  }

  if (isRestricted) {
    return {
      ...CLASSIFICATION_RULES.CAIXA_RESTRITO,
      classification: CLASSIFICATION_RULES.CAIXA_RESTRITO.name,
      reasoning: CLASSIFICATION_RULES.CAIXA_RESTRITO.reasoning,
      color: CLASSIFICATION_RULES.CAIXA_RESTRITO.color,
      bg: CLASSIFICATION_RULES.CAIXA_RESTRITO.bg,
      border: CLASSIFICATION_RULES.CAIXA_RESTRITO.border
    };
  }

  const highRiskProducts = ['Ações / Derivativos', 'Fundo Multimercado / Ações'];
  if (highRiskProducts.includes(product)) {
    return {
      ...CLASSIFICATION_RULES.RISCO_SIGNIFICATIVO,
      classification: CLASSIFICATION_RULES.RISCO_SIGNIFICATIVO.name,
      reasoning: CLASSIFICATION_RULES.RISCO_SIGNIFICATIVO.reasoning,
      color: CLASSIFICATION_RULES.RISCO_SIGNIFICATIVO.color,
      bg: CLASSIFICATION_RULES.RISCO_SIGNIFICATIVO.bg,
      border: CLASSIFICATION_RULES.RISCO_SIGNIFICATIVO.border
    };
  }

  const dtAcq = new Date(acquisitionDate);
  const dtMat = new Date(maturityDate);
  const dtRep = new Date(reportDate);

  if (isNaN(dtAcq) || isNaN(dtMat) || isNaN(dtRep)) {
    throw new Error('Datas inválidas fornecidas');
  }

  const daysAcqToMat = daysBetween(dtAcq, dtMat);
  const daysRepToMat = daysBetween(dtRep, dtMat);

  if (daysAcqToMat <= CLASSIFICATION_RULES.CAIXA_E_EQUIVALENTES.maxDaysToMaturity) {
    return {
      ...CLASSIFICATION_RULES.CAIXA_E_EQUIVALENTES,
      classification: CLASSIFICATION_RULES.CAIXA_E_EQUIVALENTES.name,
      reasoning: CLASSIFICATION_RULES.CAIXA_E_EQUIVALENTES.reasoning,
      color: CLASSIFICATION_RULES.CAIXA_E_EQUIVALENTES.color,
      bg: CLASSIFICATION_RULES.CAIXA_E_EQUIVALENTES.bg,
      border: CLASSIFICATION_RULES.CAIXA_E_EQUIVALENTES.border
    };
  }

  if (daysRepToMat > 365) {
    return {
      ...CLASSIFICATION_RULES.ATIVO_FINANCEIRO_ANC,
      classification: CLASSIFICATION_RULES.ATIVO_FINANCEIRO_ANC.name,
      reasoning: CLASSIFICATION_RULES.ATIVO_FINANCEIRO_ANC.reasoning,
      color: CLASSIFICATION_RULES.ATIVO_FINANCEIRO_ANC.color,
      bg: CLASSIFICATION_RULES.ATIVO_FINANCEIRO_ANC.bg,
      border: CLASSIFICATION_RULES.ATIVO_FINANCEIRO_ANC.border
    };
  }

  return {
    ...CLASSIFICATION_RULES.ATIVO_FINANCEIRO_AC,
    classification: CLASSIFICATION_RULES.ATIVO_FINANCEIRO_AC.name,
    reasoning: CLASSIFICATION_RULES.ATIVO_FINANCEIRO_AC.reasoning,
    color: CLASSIFICATION_RULES.ATIVO_FINANCEIRO_AC.color,
    bg: CLASSIFICATION_RULES.ATIVO_FINANCEIRO_AC.bg,
    border: CLASSIFICATION_RULES.ATIVO_FINANCEIRO_AC.border
  };
}

// ============================================================
// COMPONENTES UI RASTREÁVEIS (LEGÍVEL - ALCOA)
// ============================================================

const Icon = ({ name, className = '', title = '' }) => (
  <i className={`fas fa-${name} ${className}`} aria-hidden="true" title={title} />
);

const SectionTitle = ({ children, icon, documentation = '' }) => (
  <div className="group relative">
    <h3 className="text-lg font-bold text-audit-navy dark:text-white flex items-center gap-2 mb-6">
      {icon && <Icon name={icon} className="text-audit-gold" />}
      {children}
      {documentation && (
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[8px] bg-gray-100 px-2 py-1 rounded-full text-gray-500">
          {documentation}
        </span>
      )}
    </h3>
  </div>
);

const Card = ({ children, className = '', id = '' }) => (
  <div id={id} className={`bg-white dark:bg-audit-navy rounded-2xl shadow-mega border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', onClick, disabled, className = '', icon, id = '', title = '' }) => {
  const variants = {
    primary: 'bg-audit-navy dark:bg-audit-gold dark:text-audit-navy text-white hover:bg-opacity-90',
    gold: 'bg-audit-gold text-audit-navy hover:bg-yellow-500',
    outline: 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
    danger: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
    ghost: 'text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600',
  };

  return (
    <button
      id={id}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm ${variants[variant]} ${className}`}
    >
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children, id = '' }) => {
  if (!isOpen) return null;
  return (
    <div id={id} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-audit-navy rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in-up">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h4 className="font-bold text-audit-navy dark:text-white">{title}</h4>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Icon name="times" className="text-gray-500" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

const ProgressBar = ({ steps, currentStep, id = '' }) => {
  const percentage = ((currentStep + 1) / steps.length) * 100;
  return (
    <div id={id} className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-6">
      <div
        className="bg-audit-gold h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
        title={`Progresso: ${Math.round(percentage)}%`}
      />
    </div>
  );
};

// ============================================================
// COMPONENTE DE NAVEGAÇÃO LATERAL (BASEADO NO SIDEBARTOOLS)
// ============================================================
const SideNavTools = ({ setActiveConcept, activeConcept, items }) => {
  // Seções para os botões (mesmos IDs usados nos modais)
  const sections = [
    { id: 'produtos', icon: 'fa-building-columns', label: 'Produtos' },
    { id: 'norma', icon: 'fa-scale-balanced', label: 'Norma' },
    { id: 'tutorial', icon: 'fa-circle-play', label: 'Tutorial' },
  ];

  // Função para lidar com clique (abre modal)
  const handleToolClick = (id) => {
    setActiveConcept(id);
  };

  // Função para o botão de ajuda (pode iniciar tutorial ou abrir modal de tutorial)
  const handleTourStart = () => {
    setActiveConcept('tutorial');
  };

  // Recomendações simples (mantendo a "IA" simulada)
  const recommendations = useMemo(() => {
    const recs = [];
    if (items.length === 0) {
      recs.push('Nenhum ativo cadastrado. Comece importando ou cadastrando manualmente.');
    } else {
      const unverified = items.filter(i => !i.verified).length;
      if (unverified > 0) {
        recs.push(`${unverified} ativo(s) pendente(s) de validação.`);
      }
    }
    return recs;
  }, [items]);

  return (
    <div className="relative h-full">
      <SidebarTools
        sections={sections}
        activeSection={activeConcept}
        onTourStart={handleTourStart}
        onToolClick={handleToolClick}
      />
      
      {/* Área de recomendações (estilo similar ao SidebarTools) */}
      {recommendations.length > 0 && (
        <div className="absolute bottom-20 left-0 w-full p-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300">
            <p className="font-bold mb-2 flex items-center gap-1">
              <i className="fas fa-lightbulb"></i> Sugestões
            </p>
            <ul className="space-y-1">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="text-[10px]">• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// STEP 0: BOAS-VINDAS (COM CARDS NA LATERAL DIREITA)
// ============================================================
const WelcomeStep = ({ onNext, setMethod, onDownloadTemplate, setActiveConcept }) => {
  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7">
        <div className="relative overflow-hidden rounded-3xl bg-audit-navy/90 text-white p-10 md:p-16 shadow-2xl h-full flex flex-col justify-center">
          <BackgroundImage
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"
            opacity={15}
          />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-audit-gold rounded-3xl rotate-12 flex items-center justify-center mb-8 shadow-xl">
              <Icon name="coins" className="text-4xl text-audit-navy -rotate-12" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Classificador de <br className="hidden md:block" />
              <span className="text-audit-gold font-serif italic">Caixa e Equivalentes de Caixa</span>
            </h2>
            <p className="text-gray-300 max-w-xl mb-10 text-lg leading-relaxed">
              Módulo de classificação contábil conforme CPC 03 (R2). Rastreabilidade completa e validação obrigatória.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="gold" onClick={() => { setMethod('manual'); onNext(); }} className="py-4 px-8 text-lg shadow-lg" icon="mouse-pointer" id="btn-manual">
                Cadastro Manual
              </Button>
              <Button variant="outline" onClick={() => { setMethod('import'); onNext(); }} className="py-4 px-8 text-lg bg-white/10 text-white border-white/20 hover:bg-white/20" icon="cloud-upload-alt" id="btn-import">
                Importar Dados
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <Card className="p-6" id="quick-start-card">
          <h4 className="text-sm font-bold text-audit-navy dark:text-white mb-4 flex items-center gap-2">
            <Icon name="star" className="text-audit-gold" /> Comece Rápido
          </h4>
          <div className="space-y-3">
            <button 
              onClick={onDownloadTemplate}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all border border-gray-200 dark:border-gray-700"
              id="btn-download-template"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                <Icon name="file-excel" />
              </div>
              <div className="text-left flex-grow">
                <p className="font-bold text-audit-navy dark:text-white text-sm">Baixar Template de Importação</p>
                <p className="text-[10px] text-gray-500">Modelo Excel com validações</p>
              </div>
              <Icon name="download" className="text-gray-400" />
            </button>
            <button 
              onClick={() => setActiveConcept('tutorial')}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all border border-gray-200 dark:border-gray-700"
              id="btn-tutorial"
            >
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600">
                <Icon name="play" />
              </div>
              <div className="text-left flex-grow">
                <p className="font-bold text-audit-navy dark:text-white text-sm">Tutorial Guiado</p>
                <p className="text-[10px] text-gray-500">Passo a passo da classificação</p>
              </div>
              <Icon name="arrow-right" className="text-gray-400" />
            </button>
          </div>
        </Card>

        <Card className="p-6" id="recent-card">
          <h4 className="text-sm font-bold text-audit-navy dark:text-white mb-4 flex items-center gap-2">
            <Icon name="clock-rotate-left" className="text-audit-gold" /> Última Sessão
          </h4>
          <p className="text-xs text-gray-500 text-center py-4">
            {localStorage.getItem(STORAGE_KEY) ? 'Análise em andamento encontrada' : 'Nenhuma análise recente'}
          </p>
        </Card>
      </div>
    </div>
  );
};

// ============================================================
// STEP 1A: IMPORTAÇÃO COM TEMPLATE E VALIDAÇÕES
// ============================================================
const ImportStep = ({ onBack, onNext, showToast, setItems }) => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleFileChange = (e) => {
    setValidationErrors([]);
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        'Produto': 'CDB / RDB',
        'Instituição': 'Banco Itaú',
        'Data Aquisição': '2026-01-15',
        'Data Vencimento': '2026-04-15',
        'Valor': 10000.00,
        'Restrito': 'NÃO'
      },
      {
        'Produto': 'Tesouro Selic (LFT)',
        'Instituição': 'Tesouro Direto',
        'Data Aquisição': '2026-02-01',
        'Data Vencimento': '2026-05-01',
        'Valor': 5000.00,
        'Restrito': 'NÃO'
      }
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'template_importacao_caixa.xlsx');
    showToast('Template baixado com sucesso!');
  };

  const validateImportedData = (data) => {
    const errors = [];
    const validProducts = REF_PRODUTOS.map(p => p.label);

    data.forEach((row, index) => {
      const lineNum = index + 2;
      
      const product = row['Produto'] || row['produto'] || '';
      if (!product) {
        errors.push(`Linha ${lineNum}: Produto não informado`);
      } else if (!validProducts.includes(product)) {
        errors.push(`Linha ${lineNum}: Produto "${product}" não reconhecido`);
      }

      const acquisitionDate = row['Data Aquisição'] || row['data_aquisicao'] || '';
      const maturityDate = row['Data Vencimento'] || row['data_vencimento'] || '';
      
      if (!acquisitionDate) {
        errors.push(`Linha ${lineNum}: Data de aquisição não informada`);
      } else if (!isValidDate(acquisitionDate)) {
        errors.push(`Linha ${lineNum}: Data de aquisição inválida`);
      }

      if (!maturityDate) {
        errors.push(`Linha ${lineNum}: Data de vencimento não informada`);
      } else if (!isValidDate(maturityDate)) {
        errors.push(`Linha ${lineNum}: Data de vencimento inválida`);
      }

      const amount = parseFloat(row['Valor'] || row['valor'] || 0);
      if (isNaN(amount) || amount <= 0) {
        errors.push(`Linha ${lineNum}: Valor inválido ou não informado`);
      }
    });

    return errors;
  };

  const handleImport = () => {
    if (!file) {
      showToast('Selecione um arquivo para importar.', 'error');
      return;
    }

    setImporting(true);
    setValidationErrors([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const errors = validateImportedData(jsonData);
        if (errors.length > 0) {
          setValidationErrors(errors);
          setImporting(false);
          showToast(`${errors.length} erro(s) encontrados na importação`, 'error');
          return;
        }

        const importedItems = jsonData.map((row, index) => {
          const product = row['Produto'] || row['produto'] || '';
          const institution = row['Instituição'] || row['instituicao'] || row['instituição'] || '';
          const acquisitionDate = row['Data Aquisição'] || row['data_aquisicao'] || '';
          const maturityDate = row['Data Vencimento'] || row['data_vencimento'] || '';
          const amount = parseFloat(row['Valor'] || row['valor'] || 0);
          const isRestricted = (row['Restrito'] || '').toString().toUpperCase() === 'SIM';

          const classificationData = classificarAtivo({
            product,
            acquisitionDate,
            maturityDate,
            reportDate: new Date().toISOString().split('T')[0],
            isRestricted
          });

          return {
            id: Date.now() + index,
            product,
            institution,
            acquisitionDate,
            maturityDate,
            amount,
            isRestricted,
            ...classificationData,
            verified: false,
            importTimestamp: new Date().toISOString(),
            importSource: file.name
          };
        });

        setItems(prev => [...prev, ...importedItems]);
        showToast(`${importedItems.length} ativos importados com sucesso!`);
        setTimeout(() => onNext(), 1500);
      } catch (error) {
        showToast('Erro ao processar arquivo: ' + error.message, 'error');
      } finally {
        setImporting(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8" id="import-step">
        <SectionTitle icon="cloud-upload-alt" documentation="Step 1A: Importação de dados">
          Importar Dados
        </SectionTitle>
        
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-audit-navy rounded-lg flex items-center justify-center text-amber-500">
              <Icon name="file-excel" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Template de Importação</p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400">Baixe o modelo com validações</p>
            </div>
          </div>
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 bg-white dark:bg-audit-navy rounded-lg text-sm font-bold text-amber-600 hover:bg-amber-100 transition-colors flex items-center gap-2"
            id="btn-download-import"
          >
            <Icon name="download" /> Download
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Carregue um arquivo CSV ou Excel com os dados dos ativos financeiros. 
          O sistema validará automaticamente os dados contra as regras do CPC 03.
        </p>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 text-center mb-6 hover:border-audit-gold transition-colors">
          <Icon name="file-import" className="text-4xl text-gray-400 mb-4" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {file ? file.name : 'Arraste um arquivo ou clique para selecionar'}
          </p>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-3 bg-audit-gold text-audit-navy rounded-xl font-bold text-sm cursor-pointer hover:bg-yellow-500 transition-colors"
          >
            Selecionar Arquivo
          </label>
        </div>

        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
              <Icon name="exclamation-circle" /> Erros de validação:
            </p>
            <ul className="space-y-1">
              {validationErrors.map((error, idx) => (
                <li key={idx} className="text-[10px] text-red-500 dark:text-red-400">{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="ghost" onClick={onBack} icon="arrow-left" disabled={importing}>Voltar</Button>
          <Button variant="primary" onClick={handleImport} icon="check-circle" disabled={!file || importing}>
            {importing ? 'Importando...' : 'Importar e Continuar'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

// ============================================================
// STEP 1B: CADASTRO MANUAL (COM VALIDAÇÕES)
// ============================================================
const ManualStep = ({ items, setItems, reportDate, onNext, onBack, showToast }) => {
  const [formData, setFormData] = useState({
    product: 'CDB / RDB',
    institution: '',
    acquisitionDate: '',
    maturityDate: '',
    amount: '',
    isRestricted: false,
    editingId: null
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }
    
    if (!formData.acquisitionDate) {
      newErrors.acquisitionDate = 'Data de aquisição obrigatória';
    } else if (!isValidDate(formData.acquisitionDate)) {
      newErrors.acquisitionDate = 'Data inválida';
    }
    
    if (!formData.maturityDate) {
      newErrors.maturityDate = 'Data de vencimento obrigatória';
    } else if (!isValidDate(formData.maturityDate)) {
      newErrors.maturityDate = 'Data inválida';
    }

    if (formData.acquisitionDate && formData.maturityDate && 
        isValidDate(formData.acquisitionDate) && isValidDate(formData.maturityDate)) {
      const dtAcq = new Date(formData.acquisitionDate);
      const dtMat = new Date(formData.maturityDate);
      if (dtMat <= dtAcq) {
        newErrors.maturityDate = 'Vencimento deve ser posterior à aquisição';
      }
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddOrUpdate = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Preencha todos os campos corretamente.', 'error');
      return;
    }

    try {
      const classificationData = classificarAtivo({ ...formData, reportDate });
      const newItem = {
        ...formData,
        id: formData.editingId || Date.now(),
        amount: parseFloat(formData.amount),
        ...classificationData,
        verified: false,
        createdTimestamp: new Date().toISOString(),
        createdBy: 'manual'
      };

      if (formData.editingId) {
        setItems(items.map(i => i.id === formData.editingId ? { ...i, ...newItem, updatedTimestamp: new Date().toISOString() } : i));
        showToast('Item atualizado!');
      } else {
        setItems([...items, newItem]);
        showToast('Item adicionado!');
      }
      
      setFormData({
        product: 'CDB / RDB',
        institution: '',
        acquisitionDate: '',
        maturityDate: '',
        amount: '',
        isRestricted: false,
        editingId: null
      });
      setErrors({});
    } catch (error) {
      showToast('Erro ao classificar ativo: ' + error.message, 'error');
    }
  };

  const handleEdit = (item) => {
    setFormData({ ...item, editingId: item.id });
  };

  const handleDelete = (id) => {
    if (window.confirm('Remover este ativo? Esta ação não pode ser desfeita.')) {
      setItems(items.filter(i => i.id !== id));
      showToast('Item removido.');
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5">
        <Card className="p-6" id="manual-form">
          <SectionTitle icon={formData.editingId ? 'pen' : 'plus-circle'} documentation="Step 1B: Cadastro manual com validações">
            {formData.editingId ? 'Editar Ativo' : 'Novo Cadastro Manual'}
          </SectionTitle>
          <div className="space-y-4">
            <div>
              <select
                name="product"
                value={formData.product}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-audit-gold"
              >
                {REF_PRODUTOS.map(p => <option key={p.id} value={p.label}>{p.label}</option>)}
              </select>
            </div>
            
            <div>
              <input
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                placeholder="Instituição Financeira"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-audit-gold"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="date"
                  name="acquisitionDate"
                  value={formData.acquisitionDate}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-50 dark:bg-gray-800 border rounded-xl px-4 py-3 text-sm outline-none focus:border-audit-gold ${
                    errors.acquisitionDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  }`}
                />
                {errors.acquisitionDate && (
                  <p className="text-[8px] text-red-500 mt-1">{errors.acquisitionDate}</p>
                )}
              </div>
              <div>
                <input
                  type="date"
                  name="maturityDate"
                  value={formData.maturityDate}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-50 dark:bg-gray-800 border rounded-xl px-4 py-3 text-sm outline-none focus:border-audit-gold ${
                    errors.maturityDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  }`}
                />
                {errors.maturityDate && (
                  <p className="text-[8px] text-red-500 mt-1">{errors.maturityDate}</p>
                )}
              </div>
            </div>
            
            <div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Valor Atualizado"
                className={`w-full bg-gray-50 dark:bg-gray-800 border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-audit-gold ${
                  errors.amount ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              />
              {errors.amount && (
                <p className="text-[8px] text-red-500 mt-1">{errors.amount}</p>
              )}
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <input
                type="checkbox"
                id="restricted"
                name="isRestricted"
                checked={formData.isRestricted}
                onChange={handleInputChange}
                className="w-4 h-4 accent-audit-gold"
              />
              <label htmlFor="restricted" className="text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer flex items-center gap-2">
                <Icon name="lock" className={formData.isRestricted ? 'text-red-500' : 'text-gray-400'} />
                Caixa Restrito?
              </label>
            </div>
            
            <Button variant="primary" onClick={handleAddOrUpdate} className="w-full py-4" icon="save">
              {formData.editingId ? 'SALVAR' : 'ADICIONAR'}
            </Button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-7">
        <Card className="p-6" id="inventory-list">
          <SectionTitle icon="file-spreadsheet" documentation="Lista de ativos cadastrados">
            Inventário ({items.length})
          </SectionTitle>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Nenhum ativo cadastrado.</p>
            ) : (
              items.map(item => (
                <div key={item.id} className="py-3 flex justify-between items-center group">
                  <div>
                    <div className="text-sm font-bold text-audit-navy dark:text-white">{item.product}</div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase">
                      {item.institution} • {formatCurrency(item.amount)}
                      {item.verified && <span className="ml-2 text-emerald-500">✓</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" title="Editar">
                      <Icon name="pen" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Excluir">
                      <Icon name="trash" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {items.length > 0 && (
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={onBack} icon="arrow-left">Voltar</Button>
              <Button variant="gold" onClick={onNext} className="px-8" icon="arrow-right" id="btn-next-to-review">
                Revisar e Validar Dados
              </Button>
            </div>
          )}
          {items.length === 0 && (
            <div className="mt-8 flex justify-start">
              <Button variant="ghost" onClick={onBack} icon="arrow-left">Voltar</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// ============================================================
// STEP 1C: ÚLTIMA SEÇÃO (RESUMO E FINALIZAÇÃO)
// ============================================================
const LastSectionStep = ({ items, onNext, onBack }) => {
  const totals = items.reduce((acc, item) => {
    acc[item.classification] = (acc[item.classification] || 0) + item.amount;
    return acc;
  }, {});
  const totalGeral = items.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-8" id="summary-step">
        <SectionTitle icon="check-double" documentation="Resumo antes da revisão final">
          Resumo do Cadastro
        </SectionTitle>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total de Ativos</p>
            <p className="text-2xl font-bold text-audit-navy dark:text-white">{items.length}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Valor Total</p>
            <p className="text-2xl font-bold text-audit-navy dark:text-white">{formatCurrency(totalGeral)}</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {Object.entries(totals).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-3 bg-white dark:bg-audit-navy border border-gray-200 dark:border-gray-700 rounded-xl">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{key}</span>
              <span className="text-sm font-bold text-audit-navy dark:text-white">{formatCurrency(value)}</span>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <Icon name="lightbulb" className="text-amber-500 mt-0.5" />
            <span>
              <strong>Próxima etapa:</strong> Você irá revisar cada ativo e validar sua classificação conforme os critérios do CPC 03.
              {items.filter(i => !i.verified).length > 0 && (
                <span className="block mt-1 text-amber-600">
                  {items.filter(i => !i.verified).length} ativo(s) aguardando validação.
                </span>
              )}
            </span>
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={onBack} icon="arrow-left">Voltar ao Cadastro</Button>
          <Button variant="gold" onClick={onNext} icon="arrow-right" className="px-8" id="btn-to-review">
            Ir para Revisão
          </Button>
        </div>
      </Card>
    </div>
  );
};

// ============================================================
// STEP 2: REVISÃO (VALIDAÇÃO OBRIGATÓRIA)
// ============================================================
const VerificationStep = ({ items, setItems, onNext, onBack, showToast }) => {
  const [showConfirmAll, setShowConfirmAll] = useState(false);

  const toggleVerify = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, verified: !item.verified, verificationTimestamp: new Date().toISOString() } : item
    ));
  };

  const verifyAll = () => {
    setItems(items.map(item => ({ 
      ...item, 
      verified: true, 
      verificationTimestamp: new Date().toISOString(),
      verifiedBy: 'batch'
    })));
    setShowConfirmAll(false);
    showToast('Todos os ativos foram validados com sucesso.');
  };

  const allVerified = items.length > 0 && items.every(i => i.verified);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold text-audit-navy dark:text-white tracking-tight uppercase">Revisão Técnica</h2>
          <p className="text-sm text-gray-500">Valide os critérios de classificação antes de gerar o dashboard.</p>
        </div>
        <Button variant="outline" onClick={() => setShowConfirmAll(true)} disabled={allVerified} className="border-amber-200 text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300" id="btn-validate-all">
          Validar Todos <Icon name="check-square" />
        </Button>
      </div>

      <div className="grid gap-4">
        {items.map(item => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${
              item.verified
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                : 'bg-white dark:bg-audit-navy border-gray-200 dark:border-gray-700'
            }`}
            id={`item-${item.id}`}
          >
            <div className="flex gap-4 items-center">
              <div className={`p-3 rounded-2xl ${item.bg}`}>
                <Icon name="building-columns" style={{ color: item.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-audit-navy dark:text-white">{item.product}</span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full border bg-white font-bold"
                    style={{ color: item.color, borderColor: item.color + '40' }}
                  >
                    {item.classification}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 max-w-md italic">{item.reasoning}</p>
                {item.verified && (
                  <p className="text-[8px] text-gray-400 mt-1">
                    Validado em: {new Date(item.verificationTimestamp).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-bold text-audit-navy dark:text-white">{formatCurrency(item.amount)}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase">{item.institution}</p>
              </div>
              <button
                onClick={() => toggleVerify(item.id)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  item.verified
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-amber-400 hover:text-amber-500'
                }`}
                title={item.verified ? 'Validado' : 'Clique para validar'}
              >
                {item.verified ? <Icon name="check-circle" className="text-2xl" /> : <Icon name="square" className="text-2xl" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-6">
        <Button variant="ghost" onClick={onBack} icon="arrow-left">Retornar</Button>
        <div className="flex items-center gap-4">
          {!allVerified && (
            <p className="text-xs font-bold text-rose-500 animate-pulse flex items-center gap-1">
              <Icon name="exclamation-circle" /> Validação obrigatória pendente
            </p>
          )}
          <Button variant="primary" onClick={onNext} disabled={!allVerified} className="px-10 py-4 shadow-xl" icon="dashboard" id="btn-to-dashboard">
            Prosseguir para o Dashboard
          </Button>
        </div>
      </div>

      <Modal isOpen={showConfirmAll} onClose={() => setShowConfirmAll(false)} title="Atenção: Validação em Lote">
        <div className="text-center">
          <Icon name="exclamation-triangle" className="text-5xl text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
            Você está prestes a validar todos os ativos simultaneamente. Certifique-se de que revisou os fundamentos técnicos de cada item.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setShowConfirmAll(false)}>Cancelar</Button>
            <Button variant="gold" onClick={verifyAll} id="btn-confirm-validate-all">Sim, validar todos</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// STEP 3: DASHBOARD (GRÁFICOS E TOTAIS)
// ============================================================
const DashboardStep = ({ items, onNext, onBack }) => {
  const totals = items.reduce((acc, item) => {
    acc[item.classification] = (acc[item.classification] || 0) + item.amount;
    return acc;
  }, {});
  const pieData = Object.entries(totals).map(([name, value]) => ({ name, value }));
  const totalGeral = items.reduce((a, b) => a + b.amount, 0);

  const kpis = [
    { label: 'Caixa e Equivalentes', value: totals['Caixa e Equivalentes'] || 0, color: 'emerald' },
    { label: 'Ativos Financeiros (AC)', value: totals['Ativo Financeiro (AC)'] || 0, color: 'blue' },
    { label: 'Não Circulante / Restrito', value: (totals['Ativo Financeiro (ANC)'] || 0) + (totals['Caixa Restrito (ANC)'] || 0), color: 'indigo' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="p-6">
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{kpi.label}</span>
            <div className="text-2xl font-bold text-audit-navy dark:text-white mt-1">{formatCurrency(kpi.value)}</div>
            <div className="mt-4 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full bg-${kpi.color}-500`} style={{ width: `${(kpi.value / (totalGeral || 1)) * 100}%` }} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <SectionTitle icon="chart-pie" documentation="Distribuição por classificação contábil">
            Mix da Carteira
          </SectionTitle>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-10 flex flex-col justify-center text-center">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="file-download" className="text-3xl text-amber-500" />
          </div>
          <h4 className="text-xl font-bold text-audit-navy dark:text-white">Concluir Análise</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Todos os ativos foram validados tecnicamente. Gere os arquivos de auditoria agora.
          </p>
          <Button variant="gold" onClick={onNext} className="w-full py-4" icon="file-download" id="btn-to-export">
            Exportar Relatórios
          </Button>
        </Card>
      </div>

      <Button variant="ghost" onClick={onBack} icon="arrow-left">Voltar à Revisão</Button>
    </div>
  );
};

// ============================================================
// STEP 4: EXPORTAÇÃO COM TEMPLATES ESTILIZADOS
// ============================================================
const ExportStep = ({ items, onRestart, showToast, reportDate }) => {
  const [exporting, setExporting] = useState(false);

  const exportToExcel = () => {
    setExporting(true);
    try {
      const exportData = items.map(item => ({
        'ID': item.id,
        'Produto': item.product,
        'Instituição': item.institution,
        'Data Aquisição': formatDate(item.acquisitionDate),
        'Data Vencimento': formatDate(item.maturityDate),
        'Valor (R$)': item.amount,
        'Classificação CPC 03': item.classification,
        'Fundamento': item.reasoning,
        'Restrito': item.isRestricted ? 'SIM' : 'NÃO',
        'Validado': item.verified ? 'SIM' : 'NÃO',
        'Data Validação': item.verificationTimestamp ? formatDate(item.verificationTimestamp) : '',
        'Origem': item.importSource || 'manual'
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      const colWidths = [
        { wch: 10 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 },
        { wch: 15 }, { wch: 30 }, { wch: 40 }, { wch: 10 }, { wch: 10 },
        { wch: 15 }, { wch: 15 }
      ];
      ws['!cols'] = colWidths;

      const metadata = [
        ['RELATÓRIO DE ANÁLISE - CAIXA E EQUIVALENTES'],
        ['Gerado em:', new Date().toLocaleString('pt-BR')],
        ['Data Base:', formatDate(reportDate)],
        ['Total de Ativos:', items.length],
        ['Valor Total:', formatCurrency(items.reduce((a, b) => a + b.amount, 0))],
        ['Versão do Módulo:', MODULE_METADATA.version],
        ['Responsável:', MODULE_METADATA.responsible],
        []
      ];

      const wsResumo = XLSX.utils.aoa_to_sheet(metadata);
      XLSX.utils.book_append_sheet(wb, wsResumo, 'Metadados');
      XLSX.utils.book_append_sheet(wb, ws, 'Detalhamento');

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const fileName = `analise_caixa_equivalentes_${timestamp}.xlsx`;
      
      XLSX.writeFile(wb, fileName);
      showToast('Arquivo Excel exportado com sucesso!');
    } catch (error) {
      showToast('Erro ao exportar Excel: ' + error.message, 'error');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      doc.setFontSize(18);
      doc.setTextColor(0, 51, 102);
      doc.text('Relatório de Análise - Caixa e Equivalentes', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Módulo: ${MODULE_METADATA.name} v${MODULE_METADATA.version}`, 14, 30);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 35);
      doc.text(`Data Base: ${formatDate(reportDate)}`, 14, 40);
      doc.text(`Responsável: ${MODULE_METADATA.responsible}`, 14, 45);

      const totalGeral = items.reduce((a, b) => a + b.amount, 0);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total de Ativos: ${items.length}`, 14, 55);
      doc.text(`Valor Total: ${formatCurrency(totalGeral)}`, 14, 62);

      const tableColumn = ['Produto', 'Instituição', 'Valor', 'Classificação', 'Restrito'];
      const tableRows = items.map(item => [
        item.product,
        item.institution || '-',
        formatCurrency(item.amount),
        item.classification,
        item.isRestricted ? 'SIM' : 'NÃO'
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        theme: 'striped',
        headStyles: { fillColor: [245, 158, 11] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 40 },
          2: { cellWidth: 30 },
          3: { cellWidth: 50 },
          4: { cellWidth: 20 }
        }
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(6);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Documento gerado pelo módulo ${MODULE_METADATA.name} - ALCOA Compliant`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      doc.save(`relatorio_caixa_${timestamp}.pdf`);
      showToast('Relatório PDF exportado com sucesso!');
    } catch (error) {
      showToast('Erro ao exportar PDF: ' + error.message, 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8" id="export-step">
        <SectionTitle icon="file-export" documentation="Exportação com rastreabilidade ALCOA">
          Exportar Relatórios
        </SectionTitle>
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check-circle" className="text-4xl text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-audit-navy dark:text-white mb-2">Análise Finalizada</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {items.length} ativos analisados • Data base: {formatDate(reportDate)}
          </p>
        </div>

        <div className="grid gap-4 mb-8">
          <button
            onClick={exportToExcel}
            disabled={exporting}
            className="group flex items-center justify-between p-6 bg-white dark:bg-audit-navy border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition-all"
            id="btn-export-excel"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                <Icon name="file-excel" className="text-xl" />
              </div>
              <div className="text-left">
                <p className="font-bold text-audit-navy dark:text-white">Planilha Excel (XLSX)</p>
                <p className="text-[10px] text-gray-400">Com metadados e rastreabilidade</p>
              </div>
            </div>
            <Icon name="download" className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
          </button>

          <button
            onClick={exportToPDF}
            disabled={exporting}
            className="group flex items-center justify-between p-6 bg-white dark:bg-audit-navy border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-red-500 hover:shadow-lg transition-all"
            id="btn-export-pdf"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
                <Icon name="file-pdf" className="text-xl" />
              </div>
              <div className="text-left">
                <p className="font-bold text-audit-navy dark:text-white">Relatório PDF</p>
                <p className="text-[10px] text-gray-400">Documento técnico com rodapé ALCOA</p>
              </div>
            </div>
            <Icon name="download" className="text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onRestart} icon="rotate-left" id="btn-restart">
            Nova Análise
          </Button>
          <Button variant="primary" onClick={() => window.print()} icon="print" id="btn-print">
            Imprimir
          </Button>
        </div>

        <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
          <p className="text-[8px] text-gray-500 uppercase tracking-wider">
            ⚖️ Padrão ALCOA: Atribuível • Legível • Contemporâneo • Original • Acurado
          </p>
        </div>
      </Card>
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL - ORQUESTRADOR DO FLUXO
// ============================================================
export default function CaixaEquivalentes() {
  const [currentStep, setCurrentStep] = useState(0);
  const [items, setItems] = useState([]);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [activeConcept, setActiveConcept] = useState(null);
  const [method, setMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [headerHeight, setHeaderHeight] = useState(80);
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

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const { items: savedItems, reportDate: savedDate, method: savedMethod, currentStep: savedStep, lastUpdated } = JSON.parse(savedData);
        setItems(savedItems || []);
        if (savedDate) setReportDate(savedDate);
        if (savedMethod) setMethod(savedMethod);
        if (savedStep) setCurrentStep(savedStep);
        console.log(`[AUDIT] Dados recuperados. Última atualização: ${lastUpdated}`);
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const dataToSave = {
        items,
        reportDate,
        method,
        currentStep,
        lastUpdated: new Date().toISOString(),
        moduleVersion: MODULE_METADATA.version
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [items, reportDate, method, currentStep, isLoading]);

  const showToast = useCallback((message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
      setToastType('success');
    }, 3000);
  }, []);

  const downloadTemplate = useCallback(() => {
    const template = [
      {
        'Produto': 'CDB / RDB',
        'Instituição': 'Banco Itaú',
        'Data Aquisição': '2026-01-15',
        'Data Vencimento': '2026-04-15',
        'Valor': 10000.00,
        'Restrito': 'NÃO'
      },
      {
        'Produto': 'Tesouro Selic (LFT)',
        'Instituição': 'Tesouro Direto',
        'Data Aquisição': '2026-02-01',
        'Data Vencimento': '2026-05-01',
        'Valor': 5000.00,
        'Restrito': 'NÃO'
      }
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'template_importacao_caixa.xlsx');
    showToast('Template baixado com sucesso!');
  }, [showToast]);

  const steps = useMemo(() => {
    const baseSteps = [
      { title: 'Início', component: WelcomeStep },
      ...(method === 'import' ? [{ title: 'Importação', component: ImportStep }] : []),
      ...(method === 'manual' ? [{ title: 'Cadastro', component: ManualStep }] : []),
      ...(items.length > 0 && method ? [{ title: 'Resumo', component: LastSectionStep }] : []),
      { title: 'Revisão', component: VerificationStep },
      { title: 'Dashboard', component: DashboardStep },
      { title: 'Conclusão', component: ExportStep },
    ];
    return baseSteps.filter(Boolean);
  }, [method, items.length]);

  const handleNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const handleBack = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const handleRestart = useCallback(() => {
    if (window.confirm('Iniciar nova análise? Todos os dados não exportados serão perdidos.')) {
      setItems([]);
      setMethod(null);
      setCurrentStep(0);
      localStorage.removeItem(STORAGE_KEY);
      showToast('Nova análise iniciada!');
    }
  }, [showToast]);

  const ActiveComponent = steps[currentStep]?.component || WelcomeStep;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-audit-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando módulo de classificação...</p>
          <p className="text-[8px] text-gray-400 mt-2">v{MODULE_METADATA.version} | {MODULE_METADATA.lastUpdated}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SideNavTools setActiveConcept={setActiveConcept} activeConcept={activeConcept} items={items} />

      <div className="flex-grow">
        <div ref={headerRef} className="z-50 relative bg-white">
          <Header />
        </div>

        <div
          className="sticky w-full z-40 py-4 bg-white border-b border-slate-200 transition-all duration-300"
          style={{ top: headerHeight }}
        >
          <MeasuredDateBar
            activeTopic={null}
            setActiveTopic={() => {}}
            onHeightChange={() => {}}
          />
        </div>

        <main
          className="flex-grow pb-10 px-4 sm:px-6 transition-all duration-300"
          style={{ paddingTop: headerHeight }}
        >
          <div className="max-w-7xl mx-auto">
            <nav className="pt-6 mb-0 no-print flex text-xs sm:text-sm font-semibold text-slate-500 tracking-normal">
              <ol className="flex items-center gap-3">
                <li><Link to="/" className="hover:text-audit-gold">Home</Link></li>
                <li className="text-slate-300"><Icon name="chevron-right" className="text-xs" /></li>
                <li><span className="text-slate-600">Ferramentas</span></li>
                <li className="text-slate-300"><Icon name="chevron-right" className="text-xs" /></li>
                <li className="text-audit-gold font-bold">Caixa e Equivalentes</li>
              </ol>
            </nav>

            {currentStep > 0 && (
              <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
                <h1 className="text-2xl md:text-4xl font-bold text-audit-navy dark:text-white">
                  Caixa e Equivalentes
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-[10px] font-bold uppercase text-gray-500">
                  <Icon name="calendar-alt" /> Data-base:
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 p-0 text-[10px] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {currentStep > 0 && steps.length > 1 && (
              <div className="mb-12 max-w-4xl mx-auto">
                <div className="flex justify-between mb-4">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                          idx <= currentStep
                            ? 'bg-audit-navy text-amber-500 shadow-xl'
                            : 'bg-white text-gray-300 border border-gray-200'
                        }`}
                      >
                        {idx < currentStep ? <Icon name="check-circle" /> : idx + 1}
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-tighter ${idx <= currentStep ? 'text-audit-navy' : 'text-gray-300'}`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
                <ProgressBar steps={steps} currentStep={currentStep} />
              </div>
            )}

            <ActiveComponent
              items={items}
              setItems={setItems}
              reportDate={reportDate}
              onNext={handleNext}
              onBack={handleBack}
              onRestart={handleRestart}
              showToast={showToast}
              setActiveConcept={setActiveConcept}
              setMethod={setMethod}
              onDownloadTemplate={downloadTemplate}
            />
          </div>
        </main>

        <Footer />
      </div>

      {/* Modais informativos */}
      <Modal isOpen={activeConcept === 'norma'} onClose={() => setActiveConcept(null)} title="Conceito da Norma CPC 03 (R2)">
        <div className="space-y-6">
          <div>
            <h5 className="font-bold text-audit-navy dark:text-white text-sm uppercase mb-2">Definição de Caixa</h5>
            <p className="text-sm text-gray-600 dark:text-gray-300">Compreende numerário em espécie e depósitos bancários disponíveis (conta corrente).</p>
          </div>
          <div>
            <h5 className="font-bold text-audit-navy dark:text-white text-sm uppercase mb-2">Definição de Equivalentes</h5>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Investimentos de curto prazo e alta liquidez, prontamente conversíveis em montante conhecido de caixa e com risco insignificante de mudança de valor.
            </p>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
            <p className="text-xs text-amber-800 dark:text-amber-300 font-bold leading-relaxed italic">
              "Um investimento é normalmente classificado como equivalente de caixa somente quando tem vencimento de curto prazo, por exemplo, três meses ou menos, a partir da data da aquisição." (Item 7)
            </p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeConcept === 'produtos'} onClose={() => setActiveConcept(null)} title="Produtos Financeiros Comuns">
        <div className="grid gap-4">
          {REF_PRODUTOS.map(p => (
            <div key={p.id} className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex gap-4 items-center">
              <div className="w-10 h-10 bg-white dark:bg-audit-navy rounded-xl shadow-sm flex items-center justify-center text-amber-500 font-bold text-xs">
                {p.id}
              </div>
              <div>
                <p className="text-sm font-bold text-audit-navy dark:text-white">{p.label}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{p.desc}</p>
                <p className="text-[8px] text-gray-400 mt-1">Categoria: {p.categoria}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={activeConcept === 'tutorial'} onClose={() => setActiveConcept(null)} title="Tutorial Guiado">
        <div className="space-y-4 text-center">
          <Icon name="circle-play" className="text-5xl text-amber-500 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-300 font-medium">Siga os passos abaixo para realizar sua auditoria:</p>
          <ol className="text-sm text-left text-gray-500 dark:text-gray-400 space-y-3 bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl">
            <li className="flex gap-3"><strong>1.</strong> Cadastre seus ativos no inventário (manual ou importação).</li>
            <li className="flex gap-3"><strong>2.</strong> Clique em Revisão para validar cada item individualmente.</li>
            <li className="flex gap-3"><strong>3.</strong> Confira os gráficos de mix de carteira no Dashboard.</li>
            <li className="flex gap-3"><strong>4.</strong> Exporte o arquivo PDF/Excel para seus papéis de trabalho.</li>
          </ol>
          <p className="text-[8px] text-gray-400 mt-4">Tutorial interativo - versão 2.0</p>
          <Button variant="primary" onClick={() => setActiveConcept(null)} className="w-full">Entendido!</Button>
        </div>
      </Modal>

      <Toast message={toastMessage} type={toastType} />
    </div>
  );
}