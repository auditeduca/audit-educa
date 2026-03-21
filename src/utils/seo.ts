/**
 * seo.ts - Utilitários para SEO, URLs canônicas e metadata
 * 
 * Funções robustas para construir URLs, canonical links e schema URLs
 * com suporte completo a SSR/Node environments
 */

/**
 * Obtém o origin do site (protocolo + domínio + porta)
 * Funciona em browser e SSR (Node.js)
 * 
 * @returns string - URL origin (ex: https://auditeduca.com.br)
 */
export function getSiteOrigin(): string {
  // Browser environment
  if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
    return window.location.origin;
  }

  // SSR/Node environment - usar variável de ambiente
  if (typeof process !== 'undefined' && process.env) {
    return (
      process.env.REACT_APP_SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      'https://auditeduca.com.br'
    );
  }

  // Fallback seguro
  return 'https://auditeduca.com.br';
}

/**
 * Construir URL canônica segura
 * 
 * @param location - objeto location do React Router
 * @returns string - URL canônica completa
 */
export function getCanonicalUrl(location: any): string {
  const origin = getSiteOrigin();
  const pathname = location?.pathname || '';
  
  // Remover trailing slash, mas manter /
  const cleanPathname = pathname === '/' ? '' : pathname;
  
  return `${origin}${pathname}`;
}

/**
 * Construir URL segura para assets (imagens, fonts, etc)
 * 
 * @param assetPath - path relativo do asset (ex: /og-image.jpg)
 * @returns string - URL completa do asset
 */
export function getAssetUrl(assetPath: string): string {
  const origin = getSiteOrigin();
  
  // Garantir que assetPath começa com /
  const cleanPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  
  return `${origin}${cleanPath}`;
}

/**
 * Construir URL interna segura
 * 
 * @param pathname - caminho interno (ex: /cursos-auditoria)
 * @returns string - URL completa interna
 */
export function getInternalUrl(pathname: string): string {
  const origin = getSiteOrigin();
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  
  return `${origin}${cleanPath}`;
}

/**
 * Validar se URL é interna (evitar open redirect)
 * 
 * @param url - URL a validar
 * @returns boolean - true se URL é interna
 */
export function isInternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, getSiteOrigin());
    const origin = getSiteOrigin();
    return urlObj.origin === origin;
  } catch {
    // Se URL é relativa (começa com /), é interna
    return url.startsWith('/');
  }
}

/**
 * Sanitizar pathname removendo parâmetros query
 * 
 * @param pathname - pathname com possíveis parâmetros
 * @returns string - pathname limpo
 */
export function cleanPathname(pathname: string): string {
  if (!pathname) return '/';
  
  // Remover query string e hash
  return pathname.split('?')[0].split('#')[0];
}

/**
 * Extrair base URL (origin + pathname até a última /)
 * Útil para breadcrumbs
 * 
 * @param pathname - pathname completo
 * @returns string - base URL
 */
export function getBaseUrl(pathname: string): string {
  const origin = getSiteOrigin();
  const cleanPath = cleanPathname(pathname);
  
  if (cleanPath === '/') {
    return origin;
  }
  
  // Ir para last / do pathname
  const lastSlashIndex = cleanPath.lastIndexOf('/');
  const basePath = cleanPath.substring(0, lastSlashIndex + 1);
  
  return `${origin}${basePath}`;
}

/**
 * Construir breadcrumb items com URLs seguras
 * 
 * @param pathname - pathname atual
 * @param labels - labels customizados opcional
 * @returns array - breadcrumb items
 */
export function getBreadcrumbItems(
  pathname: string,
  labels?: Record<string, string>
): { label: string; url: string; active: boolean }[] {
  const origin = getSiteOrigin();
  const cleanPath = cleanPathname(pathname);
  
  if (cleanPath === '/') {
    return [
      {
        label: labels?.home || 'Home',
        url: origin,
        active: true
      }
    ];
  }
  
  const items = [];
  
  // Home sempre primeiro
  items.push({
    label: labels?.home || 'Home',
    url: origin,
    active: false
  });
  
  // Quebrar path em partes
  const parts = cleanPath.split('/').filter(Boolean);
  let currentPath = '';
  
  parts.forEach((part, index) => {
    currentPath += `/${part}`;
    const isLast = index === parts.length - 1;
    
    items.push({
      label: labels?.[part] || part.replace(/-/g, ' '),
      url: `${origin}${currentPath}`,
      active: isLast
    });
  });
  
  return items;
}

/**
 * Construir schema.org BreadcrumbList JSON-LD
 * 
 * @param items - breadcrumb items
 * @returns object - schema BreadcrumbList
 */
export function getBreadcrumbSchema(
  items: { label: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.url
    }))
  };
}

/**
 * Gerar hreflang tags para múltiplos idiomas
 * 
 * @param pathname - pathname atual
 * @param languages - array de códigos de idioma (ex: ['pt-BR', 'en', 'es'])
 * @returns array - objetos com hreflang metadata
 */
export function getHrefLangLinks(
  pathname: string,
  languages: string[] = ['pt-BR', 'en']
): { hreflang: string; href: string }[] {
  const origin = getSiteOrigin();
  const cleanPath = cleanPathname(pathname);
  
  return languages.map((lang) => ({
    hreflang: lang,
    href: `${origin}${cleanPath}${cleanPath === '/' ? '' : '/'}`
      .replace('{{lang}}', lang.toLowerCase())
  }));
}

/**
 * Normalizar URL para evitar duplicação de conteúdo
 * Remove www, força HTTPS, remove trailing slash (exceto root)
 * 
 * @param url - URL a normalizar
 * @returns string - URL normalizada
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // Forçar HTTPS
    urlObj.protocol = 'https:';
    
    // Remover www
    if (urlObj.hostname.startsWith('www.')) {
      urlObj.hostname = urlObj.hostname.replace(/^www\./, '');
    }
    
    // Remover trailing slash (exceto para root)
    let pathname = urlObj.pathname;
    if (pathname !== '/' && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    urlObj.pathname = pathname;
    
    // Remover parâmetros padrão
    urlObj.search = '';
    urlObj.hash = '';
    
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Verificar se URL é válida
 * 
 * @param url - URL a validar
 * @returns boolean - true se válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    // Se é URL relativa, é válida
    return url.startsWith('/') || url.startsWith('#');
  }
}

/**
 * Construir og:image URL com suporte a fallback
 * 
 * @param imagePath - path da imagem (ex: /og-image.jpg)
 * @param fallback - URL fallback se imagePath estiver vazio
 * @returns string - URL completa da imagem
 */
export function getOgImageUrl(
  imagePath?: string,
  fallback?: string
): string {
  if (imagePath) {
    return getAssetUrl(imagePath);
  }
  
  if (fallback) {
    return fallback;
  }
  
  // Fallback padrão
  return getAssetUrl('/og-default.jpg');
}

/**
 * Extrair domínio de uma URL
 * 
 * @param url - URL completa
 * @returns string - domínio (ex: auditeduca.com.br)
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * Verificar se URL é externa
 * 
 * @param url - URL a verificar
 * @returns boolean - true se externa
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const origin = getSiteOrigin();
    return urlObj.origin !== origin;
  } catch {
    // Relativos são internos
    return false;
  }
}

/**
 * Gerar slug a partir de texto
 * Útil para criar URLs amigáveis
 * 
 * @param text - texto original
 * @param maxLength - comprimento máximo
 * @returns string - slug (ex: "meu-artigo-legal")
 */
export function generateSlug(text: string, maxLength: number = 50): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') // Remover acentos
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiais
    .replace(/[\s_]+/g, '-') // Espaços/underscores → hífens
    .replace(/-+/g, '-') // Múltiplos hífens → um
    .replace(/^-+|-+$/g, '') // Remover hífens nas extremidades
    .substring(0, maxLength);
}

/**
 * Construir URL de compartilhamento social
 * 
 * @param platform - rede social (facebook, twitter, linkedin)
 * @param pageUrl - URL da página
 * @param text - texto opcional
 * @returns string - URL para compartilhamento
 */
export function getSocialShareUrl(
  platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp',
  pageUrl: string,
  text?: string
): string {
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedText = text ? encodeURIComponent(text) : '';
  
  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case 'whatsapp':
      return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    default:
      return pageUrl;
  }
}
