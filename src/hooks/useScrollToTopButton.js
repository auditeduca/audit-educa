import { useEffect, useState } from 'react';

export function useScrollToTopButton(threshold = 300) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // estado inicial
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return show;
}