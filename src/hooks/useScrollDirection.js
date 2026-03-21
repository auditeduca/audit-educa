import { useState, useEffect } from 'react';

export function useScrollDirection(threshold = 10) {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
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
            setIsScrollingUp(!scrollingDown);
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

  return isScrollingUp;
}