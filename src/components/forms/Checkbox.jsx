import React from 'react';

export default function Checkbox({ label, className = "", ...props }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        className={`w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 ${className}`}
        {...props}
      />
      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
    </label>
  );
}