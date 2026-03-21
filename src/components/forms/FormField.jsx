import React from 'react';

export default function FormField({ 
  label, 
  required = false, 
  error, 
  children,
  className = "",
  labelClassName = ""
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className={`block text-xs font-bold text-slate-500 uppercase tracking-wider ${labelClassName}`}>
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}