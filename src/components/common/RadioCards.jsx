import { Check } from 'lucide-react';

export default function RadioCards({ options, value, onChange, columns = 2 }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-${columns} gap-3`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 ${
            value === opt.value 
              ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-sm' 
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {opt.icon && <span className={value === opt.value ? 'text-blue-600' : 'text-slate-400'}>{opt.icon}</span>}
            <span className="font-medium text-sm">{opt.label}</span>
          </div>
          {value === opt.value && <Check size={18} className="text-blue-600" />}
        </button>
      ))}
    </div>
  );
}