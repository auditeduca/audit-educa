#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { assertValid } from '../core/validate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const COMPONENT_IMPORTS = {
  home: '../pages/home',
  ExameSuficiencia: '../pages/ExameSuficiencia',
  NotificacoesLegais: '../pages/NotificacoesLegais',
  PoliticaPrivacidade: '../pages/PoliticaPrivacidade',
  CurriculoHome: '../pages/curriculo/Home',
  ResumeWizard: '../pages/curriculo/ResumeWizard',
  PoliticaAcessibilidade: '../pages/PoliticaAcessibilidade',
  SobreNos: '../pages/SobreNos',
  DeOlhoNaAcessibilidade: '../pages/de-olho-na-acessibilidade',
  PegadaDeCarbono: '../pages/pegada-de-carbono',
  TermosDeUso: '../pages/termos-de-uso',
  RelatorioDeImpacto: '../pages/RelatorioDeImpacto',
  MapaSite: '../pages/mapa-do-site',
  FaleConosco: '../pages/fale-conosco',
  BuscaEConteudo: '../pages/BuscaEConteudo',
  TecnologiaVerde: '../pages/tecnologia-verde',
  TemplatesHub: '../pages/templates/TemplatesHub',
  TemplateWizard: '../pages/template-wizard/TemplateWizard',
  SobreOCriador: '../pages/sobre-o-criador',
  NossoCompromisso: '../pages/nosso-compromisso',
  RecursosAssistivos: '../pages/recursos-assistivos',
  RelatorioInstitucional: '../pages/RelatorioInstitucional',
  ConversorDeMoedas: '../pages/moedas/CalculadoraMoedas',
  CalculadorasHub: '../pages/calculadoras/CalculadorasHub',
  CalculadoraPage: '../pages/calculadoras/CalculadoraPage',
  InstitutionalPage: '../core/render/InstitutionalPage',
  FerramentasHub: '../pages/ferramentas/FerramentasHub',
  RedirectRoute: '../components/routing/RedirectRoute',
};

function loadRoutes() {
  return JSON.parse(readFileSync(join(ROOT, 'content/registry/routes.json'), 'utf8')).routes;
}

function loadIntegrations() {
  const path = join(ROOT, 'content/registry/integrations.json');
  const base = JSON.parse(readFileSync(path, 'utf8'));
  return {
    ...base,
    gtm: { ...base.gtm, containerId: process.env.VITE_GTM_ID || base.gtm.containerId },
    ga4: { ...base.ga4, measurementId: process.env.VITE_GA4_ID || base.ga4.measurementId },
  };
}

function generateRoutes() {
  const routes = loadRoutes();
  const live = routes.filter((r) => r.status === 'live' || r.status === 'redirect');
  const components = new Set();
  live.forEach((r) => {
    if (r.status === 'live') components.add(r.component);
    if (r.status === 'redirect') components.add('RedirectRoute');
  });

  const lazyImports = [...components]
    .map((c) => {
      const path = COMPONENT_IMPORTS[c];
      if (!path) throw new Error(`Missing import mapping for component: ${c}`);
      return `const ${c} = lazy(() => import('${path}'));`;
    })
    .join('\n');

  const routeElements = live
    .map((r) => {
      if (r.status === 'redirect') {
        return `        <Route path="${r.path}" element={<RedirectRoute to="${r.redirectTo}" />} />`;
      }
      const props =
        r.component === 'CalculadoraPage' && r.contentFile
          ? ` contentFile="${r.contentFile}"`
          : r.component === 'InstitutionalPage' && r.contentFile
            ? ` contentFile="${r.contentFile}"`
            : '';
      const Comp = r.component;
      return `        <Route path="${r.path}" element={<${Comp}${props} />} />`;
    })
    .join('\n');

  const out = `/* AUTO-GENERATED — do not edit. Run: npm run generate */
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

${lazyImports}

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
${routeElements}
      </Routes>
    </Suspense>
  );
}

export const ROUTE_REGISTRY = ${JSON.stringify(routes, null, 2)};
`;

  const dir = join(ROOT, 'src/generated');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'routes.jsx'), out);
  console.log('Generated src/generated/routes.jsx');
}

function generateIntegrationsConfig() {
  const integrations = loadIntegrations();
  const out = `/* AUTO-GENERATED — do not edit. Run: npm run generate */
export const INTEGRATIONS = ${JSON.stringify(integrations, null, 2)};
`;
  mkdirSync(join(ROOT, 'src/generated'), { recursive: true });
  writeFileSync(join(ROOT, 'src/generated/integrations.js'), out);
  console.log('Generated src/generated/integrations.js');
}

function generateTemplatesIndex() {
  const templatesDir = join(ROOT, 'src/pages/templates/data/templates');
  const indexPath = join(templatesDir, 'index.js');
  if (!existsSync(indexPath)) return;
  const indexContent = readFileSync(indexPath, 'utf8');
  const ids = [...indexContent.matchAll(/'([^']+)':/g)].map((m) => m[1]);
  const metaFiles = ids.map((id) => {
    try {
      const modPath = join(templatesDir, `${id}.js`);
      if (!existsSync(modPath)) return null;
      const content = readFileSync(modPath, 'utf8');
      const nameMatch = content.match(/name:\s*['`]([^'`]+)['`]/);
      const descMatch = content.match(/description:\s*['`]([^'`]+)['`]/);
      const catMatch = content.match(/category:\s*['`]([^'`]+)['`]/);
      const varsMatch = content.match(/variables:\s*\[([^\]]*)\]/);
      const variables = varsMatch
        ? varsMatch[1].split(',').map((v) => v.trim().replace(/['"]/g, '')).filter(Boolean)
        : [];
      return {
        id,
        name: nameMatch?.[1] || id,
        description: descMatch?.[1] || '',
        category: catMatch?.[1] || 'Geral',
        variables,
        sourceModule: `src/pages/templates/data/templates/${id}.js`,
        thumbnail: `/assets/thumbnails/templates/${id}.webp`,
      };
    } catch {
      return null;
    }
  }).filter(Boolean);

  mkdirSync(join(ROOT, 'content/templates'), { recursive: true });
  writeFileSync(
    join(ROOT, 'content/templates/index.json'),
    JSON.stringify({ templates: metaFiles }, null, 2)
  );
  console.log(`Generated content/templates/index.json (${metaFiles.length} templates)`);
}

function injectAnalytics() {
  const { gtm, ga4 } = loadIntegrations();
  const htmlPath = join(ROOT, 'index.html');
  let html = readFileSync(htmlPath, 'utf8');

  html = html.replace(/<!-- GTM-START -->[\s\S]*?<!-- GTM-END -->\n?/g, '');
  html = html.replace(/<!-- GA4-START -->[\s\S]*?<!-- GA4-END -->\n?/g, '');
  html = html.replace(/<!-- GTM-NOSCRIPT-START -->[\s\S]*?<!-- GTM-NOSCRIPT-END -->\n?/g, '');

  const gtmHead =
    gtm.enabled
      ? `<!-- GTM-START -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtm.containerId}');</script>
    <!-- GTM-END -->
`
      : '';

  const ga4Head =
    ga4.enabled && !ga4.viaGtmOnly
      ? `<!-- GA4-START -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${ga4.measurementId}"></script>
    <!-- GA4-END -->
`
      : '';

  const gtmBody =
    gtm.enabled
      ? `<!-- GTM-NOSCRIPT-START -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtm.containerId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- GTM-NOSCRIPT-END -->
`
      : '';

  html = html.replace('</head>', `${gtmHead}${ga4Head}  </head>`);
  html = html.replace('<body>', `<body>\n${gtmBody}`);
  writeFileSync(htmlPath, html);
  console.log('Updated index.html analytics snippets');
}

const args = process.argv.slice(2);
const runAll = args.includes('--all') || args.length === 0;
const validateOnly = args.includes('--validate-only');

try {
  const runTemplates = runAll || args.includes('--templates-index');
  const runValidate = validateOnly || runAll;

  if (runAll || args.includes('--templates-index')) generateTemplatesIndex();

  if (runValidate) {
    assertValid({ includeTemplates: runTemplates || existsSync(join(ROOT, 'content/templates/index.json')) });
    console.log('Validation OK');
  }
  if (validateOnly) process.exit(0);

  if (runAll || args.includes('--routes')) generateRoutes();
  if (runAll || args.includes('--integrations')) generateIntegrationsConfig();
  if (args.includes('--templates-index') && !runAll) generateTemplatesIndex();
  if (runAll || args.includes('--inject-analytics')) injectAnalytics();
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
}
