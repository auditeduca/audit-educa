import { useEffect, useState } from 'react';

export function useScrollToTopButton(threshold = 400) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setShow(window.scrollY > threshold);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // valor inicial
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return show;
}