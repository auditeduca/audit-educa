import React from 'react';

export default function Tooltip({ children, content }) {
  return (
    <div className="group relative flex items-center">
      {children}
      <div className="absolute bottom-full mb-2 hidden group-hover:block w-max max-w-xs p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-50">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
}