import React, { useState, useRef, useLayoutEffect } from 'react';
import ShareSidebar from './ShareSidebar';

export default function FixedShareSidebar({ headerHeight, dateBarHeight, onHeightChange }) {
  const [internalHeight, setInternalHeight] = useState(45);
  const wrapperRef = useRef(null);

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (wrapperRef.current) {
        const height = wrapperRef.current.offsetHeight || 45;
        setInternalHeight(height);
        onHeightChange?.(height);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);

    return () => resizeObserver.disconnect();
  }, [onHeightChange]);

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-x-0 z-40 bg-white border-b border-slate-200 transition-all duration-300"
      style={{ top: `${headerHeight + dateBarHeight}px` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShareSidebar
          title="Sobre Nós - Audit Educa"
          url={typeof window !== 'undefined' ? window.location.href : 'https://auditeduca.com.br/sobre-nos'}
        />
      </div>
    </div>
  );
}