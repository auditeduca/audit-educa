export function thumbUrl(thumbnail) {
  if (!thumbnail) return '';
  if (thumbnail.src) return thumbnail.src;
  if (thumbnail.unsplashId) {
    return `https://images.unsplash.com/photo-${thumbnail.unsplashId}?q=80&w=800&auto=format&fit=crop`;
  }
  return '/assets/images/logotipo-audit-educa-default.webp';
}
