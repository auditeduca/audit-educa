/* AUTO-GENERATED — do not edit. Run: npm run generate */
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const home = lazy(() => import('../pages/home'));
const ExameSuficiencia = lazy(() => import('../pages/ExameSuficiencia'));
const NotificacoesLegais = lazy(() => import('../pages/NotificacoesLegais'));
const PoliticaPrivacidade = lazy(() => import('../pages/PoliticaPrivacidade'));
const CurriculoHome = lazy(() => import('../pages/curriculo/Home'));
const ResumeWizard = lazy(() => import('../pages/curriculo/ResumeWizard'));
const PoliticaAcessibilidade = lazy(() => import('../pages/PoliticaAcessibilidade'));
const SobreNos = lazy(() => import('../pages/SobreNos'));
const DeOlhoNaAcessibilidade = lazy(() => import('../pages/de-olho-na-acessibilidade'));
const PegadaDeCarbono = lazy(() => import('../pages/pegada-de-carbono'));
const TermosDeUso = lazy(() => import('../pages/termos-de-uso'));
const RelatorioDeImpacto = lazy(() => import('../pages/RelatorioDeImpacto'));
const MapaSite = lazy(() => import('../pages/mapa-do-site'));
const FaleConosco = lazy(() => import('../pages/fale-conosco'));
const BuscaEConteudo = lazy(() => import('../pages/BuscaEConteudo'));
const TecnologiaVerde = lazy(() => import('../pages/tecnologia-verde'));
const TemplatesHub = lazy(() => import('../pages/templates/TemplatesHub'));
const TemplateWizard = lazy(() => import('../pages/template-wizard/TemplateWizard'));
const SobreOCriador = lazy(() => import('../pages/sobre-o-criador'));
const NossoCompromisso = lazy(() => import('../pages/nosso-compromisso'));
const RecursosAssistivos = lazy(() => import('../pages/recursos-assistivos'));
const RelatorioInstitucional = lazy(() => import('../pages/RelatorioInstitucional'));
const ConversorDeMoedas = lazy(() => import('../pages/moedas/CalculadoraMoedas'));
const CalculadorasHub = lazy(() => import('../pages/calculadoras/CalculadorasHub'));
const CalculadoraPage = lazy(() => import('../pages/calculadoras/CalculadoraPage'));
const InstitutionalPage = lazy(() => import('../core/render/InstitutionalPage'));
const FerramentasHub = lazy(() => import('../pages/ferramentas/FerramentasHub'));
const RedirectRoute = lazy(() => import('../components/routing/RedirectRoute'));

function RouteFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-slate-500">
      Carregando...
    </div>
  );
}

export default function GeneratedRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<home />} />
        <Route path="/exame-suficiencia" element={<ExameSuficiencia />} />
        <Route path="/notificacoes-legais" element={<NotificacoesLegais />} />
        <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
        <Route path="/curriculo" element={<CurriculoHome />} />
        <Route path="/curriculo/wizard" element={<ResumeWizard />} />
        <Route path="/politica-de-acessibilidade" element={<PoliticaAcessibilidade />} />
        <Route path="/sobre-nos" element={<SobreNos />} />
        <Route path="/de-olho-na-acessibilidade" element={<DeOlhoNaAcessibilidade />} />
        <Route path="/pegada-de-carbono" element={<PegadaDeCarbono />} />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
        <Route path="/relatorio-de-impacto" element={<RelatorioDeImpacto />} />
        <Route path="/mapa-do-site" element={<MapaSite />} />
        <Route path="/fale-conosco" element={<FaleConosco />} />
        <Route path="/busca-e-conteudo" element={<BuscaEConteudo />} />
        <Route path="/tecnologia-verde" element={<TecnologiaVerde />} />
        <Route path="/templates-pro" element={<TemplatesHub />} />
        <Route path="/template-wizard" element={<TemplateWizard />} />
        <Route path="/sobre-o-criador" element={<SobreOCriador />} />
        <Route path="/nosso-compromisso" element={<NossoCompromisso />} />
        <Route path="/recursos-assistivos" element={<RecursosAssistivos />} />
        <Route path="/relatorio-institucional" element={<RelatorioInstitucional />} />
        <Route path="/conversor-de-moedas" element={<ConversorDeMoedas />} />
        <Route path="/calculadoras" element={<CalculadorasHub />} />
        <Route path="/calculadora-juros-simples" element={<CalculadoraPage contentFile="content/calculators/juros-simples.json" />} />
        <Route path="/calculadora-juros-compostos" element={<CalculadoraPage contentFile="content/calculators/juros-compostos.json" />} />
        <Route path="/calculadora-desconto" element={<CalculadoraPage contentFile="content/calculators/desconto.json" />} />
        <Route path="/calculadora-de-salario-liquido" element={<CalculadoraPage contentFile="content/calculators/salario-liquido.json" />} />
        <Route path="/calculadora-de-ferias" element={<CalculadoraPage contentFile="content/calculators/ferias.json" />} />
        <Route path="/equipe" element={<InstitutionalPage contentFile="content/pages/equipe.json" />} />
        <Route path="/compliance" element={<InstitutionalPage contentFile="content/pages/compliance.json" />} />
        <Route path="/sustentabilidade" element={<InstitutionalPage contentFile="content/pages/sustentabilidade.json" />} />
        <Route path="/ferramentas" element={<FerramentasHub />} />
        <Route path="/missao-valores" element={<RedirectRoute to="/sobre-nos" />} />
        <Route path="/privacidade" element={<RedirectRoute to="/politica-de-privacidade" />} />
        <Route path="/institucional" element={<RedirectRoute to="/sobre-nos" />} />
        <Route path="/politica-acessibilidade" element={<RedirectRoute to="/politica-de-acessibilidade" />} />
        <Route path="/relatorio-impacto" element={<RedirectRoute to="/relatorio-de-impacto" />} />
        <Route path="/sustentabilidade-digital" element={<RedirectRoute to="/nosso-compromisso" />} />
        <Route path="/contato" element={<RedirectRoute to="/fale-conosco" />} />
      </Routes>
    </Suspense>
  );
}

export const ROUTE_REGISTRY = [
  {
    "path": "/",
    "status": "live",
    "component": "home",
    "category": "home",
    "title": "Início",
    "layout": "home",
    "contentFile": "content/pages/home.json"
  },
  {
    "path": "/exame-suficiencia",
    "status": "live",
    "component": "ExameSuficiencia",
    "category": "education",
    "title": "Exame de Suficiência",
    "layout": "tool"
  },
  {
    "path": "/notificacoes-legais",
    "status": "live",
    "component": "NotificacoesLegais",
    "category": "legal",
    "title": "Notificações Legais",
    "layout": "institutional"
  },
  {
    "path": "/politica-de-privacidade",
    "status": "live",
    "component": "PoliticaPrivacidade",
    "category": "legal",
    "title": "Política de Privacidade",
    "layout": "institutional",
    "contentFile": "content/pages/politica-privacidade.json"
  },
  {
    "path": "/curriculo",
    "status": "live",
    "component": "CurriculoHome",
    "category": "education",
    "title": "Currículo",
    "layout": "tool"
  },
  {
    "path": "/curriculo/wizard",
    "status": "live",
    "component": "ResumeWizard",
    "category": "education",
    "title": "Wizard de Currículo",
    "layout": "tool"
  },
  {
    "path": "/politica-de-acessibilidade",
    "status": "live",
    "component": "PoliticaAcessibilidade",
    "category": "institutional",
    "title": "Política de Acessibilidade",
    "layout": "institutional"
  },
  {
    "path": "/sobre-nos",
    "status": "live",
    "component": "SobreNos",
    "category": "institutional",
    "title": "Sobre Nós",
    "layout": "institutional"
  },
  {
    "path": "/de-olho-na-acessibilidade",
    "status": "live",
    "component": "DeOlhoNaAcessibilidade",
    "category": "institutional",
    "title": "De Olho na Acessibilidade",
    "layout": "institutional"
  },
  {
    "path": "/pegada-de-carbono",
    "status": "live",
    "component": "PegadaDeCarbono",
    "category": "esg",
    "title": "Pegada de Carbono",
    "layout": "institutional"
  },
  {
    "path": "/termos-de-uso",
    "status": "live",
    "component": "TermosDeUso",
    "category": "legal",
    "title": "Termos de Uso",
    "layout": "institutional"
  },
  {
    "path": "/relatorio-de-impacto",
    "status": "live",
    "component": "RelatorioDeImpacto",
    "category": "esg",
    "title": "Relatório de Impacto",
    "layout": "institutional"
  },
  {
    "path": "/mapa-do-site",
    "status": "live",
    "component": "MapaSite",
    "category": "institutional",
    "title": "Mapa do Site",
    "layout": "institutional"
  },
  {
    "path": "/fale-conosco",
    "status": "live",
    "component": "FaleConosco",
    "category": "institutional",
    "title": "Fale Conosco",
    "layout": "institutional"
  },
  {
    "path": "/busca-e-conteudo",
    "status": "live",
    "component": "BuscaEConteudo",
    "category": "institutional",
    "title": "Busca e Conteúdo",
    "layout": "institutional"
  },
  {
    "path": "/tecnologia-verde",
    "status": "live",
    "component": "TecnologiaVerde",
    "category": "esg",
    "title": "Tecnologia Verde",
    "layout": "institutional"
  },
  {
    "path": "/templates-pro",
    "status": "live",
    "component": "TemplatesHub",
    "category": "tool",
    "title": "Templates Pro",
    "layout": "tool"
  },
  {
    "path": "/template-wizard",
    "status": "live",
    "component": "TemplateWizard",
    "category": "tool",
    "title": "Template Wizard",
    "layout": "tool"
  },
  {
    "path": "/sobre-o-criador",
    "status": "live",
    "component": "SobreOCriador",
    "category": "institutional",
    "title": "Sobre o Criador",
    "layout": "institutional"
  },
  {
    "path": "/nosso-compromisso",
    "status": "live",
    "component": "NossoCompromisso",
    "category": "esg",
    "title": "Nosso Compromisso",
    "layout": "institutional"
  },
  {
    "path": "/recursos-assistivos",
    "status": "live",
    "component": "RecursosAssistivos",
    "category": "institutional",
    "title": "Recursos Assistivos",
    "layout": "institutional"
  },
  {
    "path": "/relatorio-institucional",
    "status": "live",
    "component": "RelatorioInstitucional",
    "category": "institutional",
    "title": "Relatório Institucional",
    "layout": "institutional"
  },
  {
    "path": "/conversor-de-moedas",
    "status": "live",
    "component": "ConversorDeMoedas",
    "category": "calculator",
    "title": "Conversor de Moedas",
    "layout": "calculator"
  },
  {
    "path": "/calculadoras",
    "status": "live",
    "component": "CalculadorasHub",
    "category": "calculator",
    "title": "Hub de Calculadoras",
    "layout": "calculator"
  },
  {
    "path": "/calculadora-juros-simples",
    "status": "live",
    "component": "CalculadoraPage",
    "category": "calculator",
    "title": "Juros Simples",
    "layout": "calculator",
    "contentFile": "content/calculators/juros-simples.json"
  },
  {
    "path": "/calculadora-juros-compostos",
    "status": "live",
    "component": "CalculadoraPage",
    "category": "calculator",
    "title": "Juros Compostos",
    "layout": "calculator",
    "contentFile": "content/calculators/juros-compostos.json"
  },
  {
    "path": "/calculadora-desconto",
    "status": "live",
    "component": "CalculadoraPage",
    "category": "calculator",
    "title": "Desconto Comercial",
    "layout": "calculator",
    "contentFile": "content/calculators/desconto.json"
  },
  {
    "path": "/calculadora-de-salario-liquido",
    "status": "live",
    "component": "CalculadoraPage",
    "category": "calculator",
    "title": "Salário Líquido",
    "layout": "calculator",
    "contentFile": "content/calculators/salario-liquido.json"
  },
  {
    "path": "/calculadora-de-ferias",
    "status": "live",
    "component": "CalculadoraPage",
    "category": "calculator",
    "title": "Férias",
    "layout": "calculator",
    "contentFile": "content/calculators/ferias.json"
  },
  {
    "path": "/equipe",
    "status": "live",
    "component": "InstitutionalPage",
    "category": "institutional",
    "title": "Corpo Técnico",
    "layout": "institutional",
    "contentFile": "content/pages/equipe.json"
  },
  {
    "path": "/compliance",
    "status": "live",
    "component": "InstitutionalPage",
    "category": "institutional",
    "title": "Programa de Compliance",
    "layout": "institutional",
    "contentFile": "content/pages/compliance.json"
  },
  {
    "path": "/sustentabilidade",
    "status": "live",
    "component": "InstitutionalPage",
    "category": "esg",
    "title": "Compromissos Ambientais",
    "layout": "institutional",
    "contentFile": "content/pages/sustentabilidade.json"
  },
  {
    "path": "/ferramentas",
    "status": "live",
    "component": "FerramentasHub",
    "category": "tool",
    "title": "Ferramentas",
    "layout": "default"
  },
  {
    "path": "/missao-valores",
    "status": "redirect",
    "redirectTo": "/sobre-nos",
    "category": "redirect",
    "title": "Missão e Valores"
  },
  {
    "path": "/privacidade",
    "status": "redirect",
    "redirectTo": "/politica-de-privacidade",
    "category": "redirect",
    "title": "Privacidade"
  },
  {
    "path": "/institucional",
    "status": "redirect",
    "redirectTo": "/sobre-nos",
    "category": "redirect",
    "title": "Institucional"
  },
  {
    "path": "/politica-acessibilidade",
    "status": "redirect",
    "redirectTo": "/politica-de-acessibilidade",
    "category": "redirect",
    "title": "Acessibilidade"
  },
  {
    "path": "/relatorio-impacto",
    "status": "redirect",
    "redirectTo": "/relatorio-de-impacto",
    "category": "redirect",
    "title": "Relatório de Impacto"
  },
  {
    "path": "/sustentabilidade-digital",
    "status": "redirect",
    "redirectTo": "/nosso-compromisso",
    "category": "redirect",
    "title": "Sustentabilidade Digital"
  },
  {
    "path": "/contato",
    "status": "redirect",
    "redirectTo": "/fale-conosco",
    "category": "redirect",
    "title": "Contato"
  },
  {
    "path": "/circularizacao",
    "status": "archived",
    "component": "Circularizacao",
    "category": "tool",
    "title": "Circularização"
  },
  {
    "path": "/contingencias",
    "status": "archived",
    "component": "Contingencias",
    "category": "tool",
    "title": "Contingências"
  },
  {
    "path": "/fornecedores",
    "status": "archived",
    "component": "Fornecedores",
    "category": "tool",
    "title": "Fornecedores"
  },
  {
    "path": "/imobilizado",
    "status": "archived",
    "component": "Imobilizado",
    "category": "tool",
    "title": "Imobilizado"
  },
  {
    "path": "/contas-a-receber",
    "status": "archived",
    "component": "ContasAReceber",
    "category": "tool",
    "title": "Contas a Receber"
  },
  {
    "path": "/caixa-e-equivalentes",
    "status": "archived",
    "component": "CaixaEquivalentes",
    "category": "tool",
    "title": "Caixa e Equivalentes"
  },
  {
    "path": "/notas-explicativas",
    "status": "archived",
    "component": "NotasExplicativas",
    "category": "tool",
    "title": "Notas Explicativas"
  },
  {
    "path": "/IAGEN",
    "status": "archived",
    "component": "AuditLab",
    "category": "tool",
    "title": "IAGEN"
  },
  {
    "path": "/calculadora-rescisao",
    "status": "draft",
    "component": "CalculadoraPage",
    "category": "calculator",
    "title": "Rescisão",
    "contentFile": "content/calculators/rescisao.json"
  },
  {
    "path": "/governanca",
    "status": "draft",
    "component": "InstitutionalPage",
    "category": "institutional",
    "title": "Governança Corporativa"
  },
  {
    "path": "/esg",
    "status": "draft",
    "component": "InstitutionalPage",
    "category": "esg",
    "title": "ESG"
  },
  {
    "path": "/normas",
    "status": "draft",
    "component": "InstitutionalPage",
    "category": "institutional",
    "title": "Normas Técnicas"
  },
  {
    "path": "/qualidade",
    "status": "draft",
    "component": "InstitutionalPage",
    "category": "institutional",
    "title": "Qualidade e Compliance"
  },
  {
    "path": "/acessibilidade",
    "status": "draft",
    "component": "InstitutionalPage",
    "category": "institutional",
    "title": "Acessibilidade Digital"
  },
  {
    "path": "/biblioteca",
    "status": "draft",
    "component": "BuscaEConteudo",
    "category": "education",
    "title": "Biblioteca"
  },
  {
    "path": "/simulados",
    "status": "draft",
    "component": "ExameSuficiencia",
    "category": "education",
    "title": "Simulados"
  },
  {
    "path": "/cursos-auditoria",
    "status": "draft",
    "component": "InstitutionalPage",
    "category": "education",
    "title": "Cursos de Auditoria"
  },
  {
    "path": "/entrar",
    "status": "draft",
    "component": "InstitutionalPage",
    "category": "institutional",
    "title": "Entrar"
  }
];
