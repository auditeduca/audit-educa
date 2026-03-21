import React from 'react';

export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm ${className}`}
      {...props}
    />
  );
}