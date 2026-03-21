import React from 'react';

export default function ProgressBar({ progress, className = "", color = "from-indigo-600 to-amber-400" }) {
  return (
    <div className={`bg-white h-2 rounded-full border border-slate-100 overflow-hidden ${className}`}>
      <div 
        className={`h-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}