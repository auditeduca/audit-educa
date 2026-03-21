import React from 'react';

const PRESET_COLORS = ['#1D4ED8', '#7C3AED', '#065F46', '#B45309'];

export default function ColorPicker({ selectedColor, onChange }) {
  return (
    <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
      <h4 className="text-sm font-bold text-slate-900 mb-4">Cor de Destaque</h4>
      <div className="flex gap-3">
        {PRESET_COLORS.map(c => (
          <button 
            key={c}
            onClick={() => onChange(c)}
            className={`w-10 h-10 rounded-full border-4 transition-all ${selectedColor === c ? 'border-white ring-2 ring-slate-900 scale-110' : 'border-white ring-1 ring-slate-200'}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <input 
          type="color" 
          value={selectedColor}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-full cursor-pointer border-0 p-0 bg-transparent"
        />
      </div>
    </div>
  );
}