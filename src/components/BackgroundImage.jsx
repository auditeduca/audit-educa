import React from 'react';

export default function BackgroundImage({ 
  src, 
  alt = '', 
  opacity = 10, 
  className = '',
  ...props 
}) {
  return (
    <div 
      className={`absolute inset-0 z-0 ${className}`}
      aria-hidden="true"
      style={{ opacity: opacity / 100 }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        {...props}
      />
    </div>
  );
}