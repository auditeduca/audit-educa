#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function loadRoutes() {
  return JSON.parse(readFileSync(join(ROOT, 'content/registry/routes.json'), 'utf8')).routes;
}

function walkDir(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'node_modules' || name === 'dist' || name === '.git') continue;
      walkDir(p, files);
    } else if (/\.(jsx?|tsx?|html)$/.test(name)) {
      files.push(p);
    }
  }
  return files;
}

function extractLinks(content) {
  const links = [];
  const stripped = content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  const patterns = [
    /(?:to|href)=["'](\/[^"'#?]*)/g,
    /(?:to|href)=\{["'](\/[^"'#?]*)["']\}/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(stripped))) {
      const path = m[1].replace(/\/$/, '') || '/';
      if (path.startsWith('/assets/') || path.startsWith('/fonts/')) continue;
      links.push(path);
    }
  }
  return links;
}

function getLivePaths(routes) {
  const live = new Set();
  routes.forEach((r) => {
    if (r.status === 'live') live.add(r.path);
    if (r.status === 'redirect') live.add(r.path);
  });
  return live;
}

function getResolvablePaths(routes) {
  const map = new Map();
  routes.forEach((r) => {
    if (r.status === 'live') map.set(r.path, r);
    if (r.status === 'redirect') map.set(r.path, { ...r, resolvesTo: r.redirectTo });
    if (r.status === 'draft') map.set(r.path, r);
  });
  return map;
}

function scanPagesInventory() {
  const pagesDir = join(ROOT, 'src/pages');
  const files = walkDir(pagesDir);
  return files.map((f) => relative(ROOT, f));
}

function checkDuplicateAnalytics(files) {
  const issues = [];
  let gtmCount = 0;
  let gtagCount = 0;
  for (const f of files) {
    const c = readFileSync(f, 'utf8');
    if (c.includes('googletagmanager.com/gtm.js')) gtmCount++;
    if (c.includes('googletagmanager.com/gtag/js')) gtagCount++;
  }
  const indexHtml = readFileSync(join(ROOT, 'index.html'), 'utf8');
  if (indexHtml.includes('gtm.js')) gtmCount++;
  if (indexHtml.includes('gtag/js')) gtagCount++;
  if (gtagCount > 2) issues.push({ type: 'duplicateAnalytics', message: `Multiple gtag loaders detected (${gtagCount})` });
  return issues;
}

function generateBacklog(routes) {
  const draft = routes.filter((r) => r.status === 'draft');
  const archived = routes.filter((r) => r.status === 'archived');
  let md = '# Implementation Backlog\n\n';
  md += '## Draft routes (not in public navigation)\n\n';
  draft.forEach((r) => {
    md += `- \`${r.path}\` — ${r.title} (${r.category})\n`;
  });
  md += '\n## Archived audit tools (code retained, no public route)\n\n';
  archived.forEach((r) => {
    md += `- \`${r.path}\` — ${r.title}\n`;
  });
  md += '\n## Priority order\n\n';
  md += '1. Calculadoras avançadas (IFRS 16, PECLD)\n';
  md += '2. `/cursos-auditoria`, `/biblioteca`, `/simulados`\n';
  md += '3. TopicLinks: `/governanca`, `/esg`, `/normas`, `/qualidade`\n';
  md += '4. `/entrar` with Firebase Auth\n';
  return md;
}

function main() {
  const routes = loadRoutes();
  const resolvable = getResolvablePaths(routes);
  const livePaths = getLivePaths(routes);
  const srcFiles = walkDir(join(ROOT, 'src'));
  srcFiles.push(join(ROOT, 'index.html'));

  const brokenLinks = [];
  const linkRefs = {};

  for (const file of srcFiles) {
    const content = readFileSync(file, 'utf8');
    const links = extractLinks(content);
    const rel = relative(ROOT, file);
    for (const link of links) {
      if (link.startsWith('http') || link.endsWith('.html')) continue;
      const normalized = link.split('?')[0] || '/';
      if (!linkRefs[normalized]) linkRefs[normalized] = [];
      linkRefs[normalized].push(rel);

      const route = resolvable.get(normalized);
      if (!route && !livePaths.has(normalized)) {
        if (normalized.startsWith('/assets/') || normalized.startsWith('/fonts/')) continue;
        brokenLinks.push({ path: normalized, from: rel });
      } else if (route?.status === 'archived') {
        brokenLinks.push({ path: normalized, from: rel, reason: 'archived' });
      }
    }
  }

  const componentToRoute = {};
  routes.forEach((r) => {
    if (r.component) {
      if (!componentToRoute[r.component]) componentToRoute[r.component] = [];
      componentToRoute[r.component].push(r.path);
    }
  });

  const orphanRoutes = routes
    .filter((r) => r.status === 'live' && r.component)
    .filter((r) => {
      const comp = r.component;
      return !Object.values(linkRefs).flat().length; // always include live routes in matrix
    });

  const archivedStillLinked = brokenLinks.filter((b) => b.reason === 'archived');
  const duplicateContent = [];
  if (existsSync(join(ROOT, 'src/pages/caixa-e-bancos/caixaequivalentes.jsx'))) {
    duplicateContent.push({
      files: ['src/pages/caixa-e-bancos/caixaequivalentes.jsx', 'src/pages/caixa-e-bancos/caixa-e-equivalentes.jsx'],
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalRoutes: routes.length,
      live: routes.filter((r) => r.status === 'live').length,
      draft: routes.filter((r) => r.status === 'draft').length,
      archived: routes.filter((r) => r.status === 'archived').length,
      redirect: routes.filter((r) => r.status === 'redirect').length,
      brokenLinks: brokenLinks.filter((b) => !b.reason).length,
      archivedStillLinked: archivedStillLinked.length,
    },
    routeMatrix: routes.map((r) => ({
      path: r.path,
      status: r.status,
      component: r.component || null,
      contentFile: r.contentFile || null,
      redirectTo: r.redirectTo || null,
    })),
    pagesInventory: scanPagesInventory(),
    brokenLinks: brokenLinks.filter((b) => !b.reason),
    archivedStillLinked,
    orphanLiveRoutes: routes.filter((r) => r.status === 'live'),
    duplicateContent,
    duplicateAnalytics: checkDuplicateAnalytics(srcFiles),
    referencedButDraft: Object.keys(linkRefs)
      .filter((p) => {
        const r = routes.find((x) => x.path === p);
        return r?.status === 'draft';
      })
      .map((p) => ({ path: p, referencedFrom: linkRefs[p] })),
  };

  const reportsDir = join(ROOT, 'reports');
  if (!existsSync(reportsDir)) {
    mkdirSync(reportsDir, { recursive: true });
  }

  writeFileSync(join(reportsDir, 'site-audit.json'), JSON.stringify(report, null, 2));
  writeFileSync(join(reportsDir, 'implementation-backlog.md'), generateBacklog(routes));
  console.log('Wrote reports/site-audit.json');
  console.log('Wrote reports/implementation-backlog.md');
  console.log(`Broken links: ${report.summary.brokenLinks}, Archived linked: ${report.summary.archivedStillLinked}`);
}

main();
