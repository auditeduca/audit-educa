import { Routes, Route } from 'react-router-dom';
import { AuditUIProvider } from './components/context/AuditUIContext';
import SidebarTools from './components/SidebarTools';
import Drawers from './components/Drawers';
import Tour from './components/Tour';
import Toast from './components/ui/Toast';

// Páginas principais
import Home from './pages/home';
import Circularizacao from './pages/circularizacao/Circularizacao';

// Demais páginas
import ExameSuficiencia from './pages/ExameSuficiencia';
import NotificacoesLegais from './pages/NotificacoesLegais';
import PoliticaPrivacidade from './pages/PoliticaPrivacidade';
import CurriculoHome from './pages/curriculo/Home';
import ResumeWizard from './pages/curriculo/ResumeWizard';
import Contingencias from './pages/contingencias/Contingencias';
import Fornecedores from './pages/fornecedores/fornecedores';
import Imobilizado from './pages/imobilizado/Imobilizado';
import ContasAReceber from './pages/clientes/contas-a-receber';
import CaixaEquivalentes from './pages/caixa-e-bancos/caixa-e-equivalentes';
import NotasExplicativas from './pages/notas-explicativas/NotasExplicativas';
import PoliticaAcessibilidade from './pages/PoliticaAcessibilidade';
import SobreNos from './pages/SobreNos';
import DeOlhoNaAcessibilidade from './pages/de-olho-na-acessibilidade';
import PegadaDeCarbono from './pages/pegada-de-carbono';
import TermosDeUso from './pages/termos-de-uso';
import RelatorioDeImpacto from './pages/RelatorioDeImpacto';
import MapaSite from './pages/mapa-do-site';
import FaleConosco from './pages/fale-conosco';
import BuscaEConteudo from './pages/BuscaEConteudo';
import TecnologiaVerde from './pages/tecnologia-verde';
import TemplateWizard from './pages/template-wizard/TemplateWizard';
import SobreOCriador from './pages/sobre-o-criador';
import NossoCompromisso from './pages/nosso-compromisso';
import RecursosAssistivos from './pages/recursos-assistivos';
import TemplatesHub from './pages/templates/TemplatesHub';
import RelatorioInstitucional from './pages/RelatorioInstitucional';
import ConversorDeMoedas from './pages/moedas/CalculadoraMoedas';
import AuditLab from './pages/IAGEN';

// Componente global de acessibilidade
import AccessibilityWidget from './components/AccessibilityWidget';

function App() {
  return (
    <AuditUIProvider>
      <SidebarTools />
      <Drawers />
      <Tour />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/circularizacao" element={<Circularizacao />} />
        <Route path="/exame-suficiencia" element={<ExameSuficiencia />} />
        <Route path="/notificacoes-legais" element={<NotificacoesLegais />} />
        <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
        <Route path="/curriculo" element={<CurriculoHome />} />
        <Route path="/curriculo/wizard" element={<ResumeWizard />} />
        <Route path="/contingencias" element={<Contingencias />} />
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/imobilizado" element={<Imobilizado />} />
        <Route path="/contas-a-receber" element={<ContasAReceber />} />
        <Route path="/caixa-e-equivalentes" element={<CaixaEquivalentes />} />
        <Route path="/notas-explicativas" element={<NotasExplicativas />} />
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
        <Route path="/IAGEN" element={<AuditLab />} />
      </Routes>
      <AccessibilityWidget />
      <Toast />
    </AuditUIProvider>
  );
}

export default App;