// src/libs/letterTemplates.js

export const N = "#0C1B33";
export const G = "#C9A84C";
export const GL = "#E2C87A";
export const BG = "#F8F7F4";
export const WH = "#FFF";
export const BD = "#E0DDD8";
export const BD2 = "#CCC9C2";
export const TX = "#2D3748";
export const T2 = "#6B7280";
export const T3 = "#9CA3AF";
export const GR = "#065F46";
export const RD = "#991B1B";
export const AM = "#B45309";
export const BL = "#1E40AF";
export const PU = "#5B21B6";

export const CTYPES = {
  bancos: { label: "Bancos", desc: "Confirmação de saldos e produtos bancários", l: "Bancos", norm: "NBC TA 505 / ISA 505", icon: "🏦" },
  clientes: { label: "Clientes (Contas a Receber)", desc: "Confirmação de valores a receber", l: "Clientes (Contas a Receber)", norm: "NBC TA 505", icon: "👥" },
  fornecedores: { label: "Fornecedores (Contas a Pagar)", desc: "Confirmação de obrigações a pagar", l: "Fornecedores (Contas a Pagar)", norm: "NBC TA 505", icon: "📦" },
  advogados: { label: "Advogados (Contingências)", desc: "Confirmação de processos e contingências", l: "Advogados (Contingências)", norm: "NBC TA 505", icon: "⚖️" },
  estoques: { label: "Estoques em Poder de Terceiros", desc: "Confirmação de saldos de estoques", l: "Estoques em Poder de Terceiros", norm: "NBC TA 505", icon: "📦" },
  "partes-relacionadas": { label: "Partes Relacionadas", desc: "Confirmação de transações com partes relacionadas", l: "Partes Relacionadas", norm: "NBC TA 505", icon: "🤝" },
  custom: { label: "Personalizado", desc: "Texto livre para personalização", l: "Personalizado", norm: "Personalizado", icon: "✏️" },
};

export const TCOLS = {
  bancos: ["Operação", "Saldo / Valor", "Vencimento", "Garantias"],
  clientes: ["Descrição", "Valor", "Vencimento", "Observações"],
  fornecedores: ["Nota Fiscal", "Valor", "Vencimento", "Status"],
  advogados: ["Processo", "Valor", "Probabilidade", "Observações"],
  estoques: ["Produto", "Quantidade", "Valor", "Localização"],
  "partes-relacionadas": ["Transação", "Valor", "Condições", "Garantias"],
  custom: ["Descrição", "Valor", "Data", "Observações"],
};

export const BANK_PRODS = {
  "Contas e Aplicações": [
    { id: "cta_cor", l: "Conta Corrente / Reservas", f: "Saldo, tipo, restrições" },
    { id: "apl_fin", l: "Aplicações Financeiras", f: "CDB, compromissadas, liquidez" },
    { id: "poup", l: "Poupança", f: "Saldo e rendimentos" },
  ],
  "Empréstimos e Financiamentos": [
    { id: "cap_giro", l: "Capital de Giro", f: "Saldo devedor, taxa, garantias" },
    { id: "lear", l: "Arrendamento Mercantil", f: "Contrato, bem, VPL, taxa efetiva" },
    { id: "ccb", l: "CCB", f: "Número, valor, taxa, garantias" },
    { id: "desc", l: "Desconto de Duplicatas", f: "Carteira, valor, taxa" },
  ],
  "Garantias e Avais": [
    { id: "aval", l: "Aval Bancário", f: "Beneficiário, valor, vencimento" },
    { id: "fian", l: "Fiança Bancária", f: "Favorecido, objeto, valor, prazo" },
  ],
};

export const TPLS = [
  {
    id: "bank_std",
    tipo: "bancos",
    nome: "Confirmação Bancária — Padrão",
    desc: "Solicitação de saldos, empréstimos e garantias bancárias.",
    tags: ["Bancos", "Risco Sig."],
    icon: "🏦",
    thumbnail: "🏦",
    body: {
      pt: (d, ph) => `Em conformidade com a NBC TA 505, solicitamos confirmar os saldos e operações de ${d.ent} em ${d.db}. ${ph} Agradecemos a atenção.`,
      en: (d, ph) => `In accordance with ISA 505, please confirm the balances and operations of ${d.ent} as of ${d.db}. ${ph} Thank you.`,
      es: (d, ph) => `Conforme NIA 505, solicitamos confirmar los saldos y operaciones de ${d.ent} al ${d.db}. ${ph} Agradecemos.`,
    },
  },
  {
    id: "bank_detailed",
    tipo: "bancos",
    nome: "Confirmação Bancária — Detalhada",
    desc: "Inclui informações detalhadas sobre garantias e operações especiais.",
    tags: ["Bancos", "Detalhado"],
    icon: "🏦📊",
    thumbnail: "🏦📊",
    body: {
      pt: (d, ph) => `Solicitamos confirmar todos os saldos e operações ativas de ${d.ent} na data-base ${d.db}, incluindo os produtos listados: ${ph}. Favor enviar extrato analítico.`,
      en: (d, ph) => `Please confirm all balances and active operations of ${d.ent} as of ${d.db}, including the listed products: ${ph}. Please send analytical statement.`,
      es: (d, ph) => `Solicitamos confirmar todos los saldos y operaciones activas de ${d.ent} al ${d.db}, incluidos los productos listados: ${ph}. Envíe extracto analítico.`,
    },
  },
  {
    id: "client_pos",
    tipo: "clientes",
    nome: "Confirmação Positiva (Resposta Obrigatória)",
    desc: "Solicita resposta obrigatória do cliente, com confirmação ou divergência.",
    tags: ["Clientes", "Positiva"],
    icon: "👥✅",
    thumbnail: "👥✅",
    body: {
      pt: (d) => `Conforme registros, o saldo de ${d.ent} em ${d.db} é de ${d.saldo}. Caso esteja correto, favor confirmar; em caso de divergência, informar o valor correto e os motivos.`,
      en: (d) => `According to our records, the balance of ${d.ent} as of ${d.db} is ${d.saldo}. If correct, please confirm; if different, inform the correct amount and reasons.`,
      es: (d) => `Según nuestros registros, el saldo de ${d.ent} al ${d.db} es ${d.saldo}. Si es correcto, confirme; en caso contrario, informe el monto correcto y los motivos.`,
    },
  },
  {
    id: "client_neg",
    tipo: "clientes",
    nome: "Confirmação Negativa (Resposta apenas se divergir)",
    desc: "Comunicação de saldo sem resposta obrigatória.",
    tags: ["Clientes", "Negativa"],
    icon: "👥❌",
    thumbnail: "👥❌",
    body: {
      pt: (d) => `Informamos que, segundo nossos registros, não há saldo a receber de ${d.ent} em ${d.db}. Caso haja divergência, favor comunicar até ${d.dr}.`,
      en: (d) => `We inform that according to our records, there is no balance receivable from ${d.ent} as of ${d.db}. If you disagree, please contact us by ${d.dr}.`,
      es: (d) => `Informamos que según nuestros registros no hay saldo a cobrar de ${d.ent} al ${d.db}. Si existe discrepancia, comuníquese hasta ${d.dr}.`,
    },
  },
  {
    id: "supplier_std",
    tipo: "fornecedores",
    nome: "Confirmação de Saldos a Pagar",
    desc: "Confirmação de saldos devidos a fornecedores.",
    tags: ["Fornecedores"],
    icon: "📦",
    thumbnail: "📦",
    body: {
      pt: (d) => `Solicitamos confirmar o saldo a pagar de ${d.ent} em ${d.db} no valor de ${d.saldo}. Favor informar se está correto ou apresentar divergências.`,
      en: (d) => `Please confirm the payable balance of ${d.ent} as of ${d.db} in the amount of ${d.saldo}. If correct, please confirm; otherwise inform discrepancies.`,
      es: (d) => `Solicitamos confirmar el saldo a pagar de ${d.ent} al ${d.db} por el monto de ${d.saldo}. Si es correcto, confirme; de lo contrario informe discrepancias.`,
    },
  },
  {
    id: "lawyer_std",
    tipo: "advogados",
    nome: "Confirmação de Contingências Legais",
    desc: "Solicita informações sobre processos e contingências.",
    tags: ["Advogados", "Contingências"],
    icon: "⚖️",
    thumbnail: "⚖️",
    body: {
      pt: (d) => `Solicitamos informar sobre os processos em que ${d.ent} é parte, com valor envolvido e probabilidade de perda. Prazo: ${d.dr}.`,
      en: (d) => `Please provide information on lawsuits involving ${d.ent}, including amounts and probability of loss. Deadline: ${d.dr}.`,
      es: (d) => `Solicitamos información sobre los procesos en que ${d.ent} es parte, con monto involucrado y probabilidad de pérdida. Plazo: ${d.dr}.`,
    },
  },
  {
    id: "inventory_std",
    tipo: "estoques",
    nome: "Confirmação de Estoques em Depósito",
    desc: "Confirmação de mercadorias armazenadas em terceiros.",
    tags: ["Estoques", "Terceiros"],
    icon: "📦🏭",
    thumbnail: "📦🏭",
    body: {
      pt: (d) => `Solicitamos confirmar a quantidade e descrição das mercadorias de ${d.ent} armazenadas em seu poder em ${d.db}.`,
      en: (d) => `Please confirm the quantity and description of merchandise of ${d.ent} stored in your custody as of ${d.db}.`,
      es: (d) => `Solicitamos confirmar la cantidad y descripción de las mercancías de ${d.ent} almacenadas en su poder al ${d.db}.`,
    },
  },
  {
    id: "related_std",
    tipo: "partes-relacionadas",
    nome: "Confirmação de Transações com Partes Relacionadas",
    desc: "Confirmação de saldos e condições de transações com partes relacionadas.",
    tags: ["Partes Relacionadas"],
    icon: "🤝",
    thumbnail: "🤝",
    body: {
      pt: (d) => `Solicitamos confirmar as transações realizadas com ${d.ent} durante o exercício, incluindo saldos e condições comerciais.`,
      en: (d) => `Please confirm transactions with ${d.ent} during the year, including balances and commercial terms.`,
      es: (d) => `Solicitamos confirmar las transacciones realizadas con ${d.ent} durante el ejercicio, incluyendo saldos y condiciones comerciales.`,
    },
  },
  {
    id: "custom_generic",
    tipo: "custom",
    nome: "Template Personalizado",
    desc: "Texto livre para personalização manual.",
    tags: ["Personalizado"],
    icon: "✏️",
    thumbnail: "✏️",
    body: {
      pt: (d) => `Conforme solicitado, segue confirmação para ${d.ent} em ${d.db}.`,
      en: (d) => `As requested, please confirm for ${d.ent} as of ${d.db}.`,
      es: (d) => `Según lo solicitado, confirme para ${d.ent} al ${d.db}.`,
    },
  },
];