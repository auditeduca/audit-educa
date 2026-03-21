// src/components/ReadingMask.jsx
import React, { useEffect, useRef } from 'react';

const maskHeights = [0, 50, 80, 120];

export default function ReadingMask({ level }) {
  const maskRef = useRef(null);

  useEffect(() => {
    if (level === 0) return;

    const handleMouseMove = (e) => {
      if (!maskRef.current) return;
      const y = e.clientY;
      const h = maskHeights[level];
      maskRef.current.style.clipPath = `polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% ${y - h}px, 100% ${y - h}px, 100% ${y + h}px, 0% ${y + h}px, 0% ${y - h}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [level]);

  if (level === 0) return null;

  return (
    <div
      ref={maskRef}
      className="fixed top-0 left-0 w-full h-full bg-black/70 z-[99998] pointer-events-none"
    ></div>
  );
}