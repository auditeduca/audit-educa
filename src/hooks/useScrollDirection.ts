import { useState, useEffect } from 'react';

/**
 * Hook que rastreia a direção do scroll (para cima ou para baixo)
 * Usado para animar a visibilidade do índice sidebar
 * @param threshold - pixels de mudança antes de considerar como scroll
 * @returns boolean - true se usuário scrollou para cima (mostrar), false se para baixo (esconder)
 */
export function useScrollDirection(threshold: number = 10): boolean {
  const [isScrolling, setIsScrolling] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = Math.abs(currentScrollY - lastScrollY);

          if (diff > threshold) {
            const scrollingDown = currentScrollY > lastScrollY;
            setIsScrolling(!scrollingDown);
            setLastScrollY(currentScrollY);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, threshold]);

  return isScrolling;
}
