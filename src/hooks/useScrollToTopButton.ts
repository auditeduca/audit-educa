import { useState, useEffect } from 'react';

/**
 * Hook que controla visibilidade do botão "Voltar ao Topo"
 * @param threshold - pixels de scroll antes de mostrar o botão (padrão: 400px)
 * @returns boolean - true se botão deve estar visível
 */
export function useScrollToTopButton(threshold: number = 400): boolean {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldShow = window.scrollY > threshold;
          setShowButton(shouldShow);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Verificar no mount (caso página carregue com scroll já acontecido)
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return showButton;
}
