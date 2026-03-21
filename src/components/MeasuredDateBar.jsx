import React, { useState, useRef, useLayoutEffect } from 'react';
import DateBar from './DateBar';

export default function MeasuredDateBar({ activeTopic, setActiveTopic, onHeightChange }) {
  const [internalHeight, setInternalHeight] = useState(48);
  const wrapperRef = useRef(null);

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (wrapperRef.current) {
        const height = wrapperRef.current.offsetHeight || 48;
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
    <div ref={wrapperRef}>
      <DateBar activeTopic={activeTopic} setActiveTopic={setActiveTopic} />
    </div>
  );
}