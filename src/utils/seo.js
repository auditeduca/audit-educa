export function getCanonicalUrl(location) {
  if (typeof window === 'undefined') return '';
  const origin = import.meta.env.VITE_SITE_URL || window.location.origin;
  return origin + location.pathname;
}

export function getSiteOrigin() {
  if (typeof window === 'undefined') return '';
  return import.meta.env.VITE_SITE_URL || window.location.origin;
}