import { useState, useEffect } from 'react';

/**
 * Hook que rastreia qual seção está visível na viewport
 * Usa IntersectionObserver para detectar seções dinamicamente
 * @param sectionIds - array de IDs das seções a monitorar
 * @param threshold - quanto da seção deve estar visível (0 a 1)
 * @returns string - ID da seção atualmente ativa (primeira que entra na viewport)
 */
export function useActiveSection(
  sectionIds: string[] = [],
  threshold: number = 0.3
): string {
  const [activeSection, setActiveSection] = useState<string>(
    sectionIds.length > 0 ? sectionIds[0] : ''
  );

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Encontra a primeira seção que entra na viewport
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50% 0px' // Detecta quando topo da seção entra na viewport
      }
    );

    // Observar todas as seções
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [sectionIds, threshold]);

  return activeSection;
}
