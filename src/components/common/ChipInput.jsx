import { X, Tag } from 'lucide-react';

export default function ChipInput({
  tags = [],
  onAddTag,
  onRemoveTag,
  inputValue,
  onInputChange,
  onKeyDown,
  placeholder = "Digite uma tag e pressione Enter",
  label = "Tags",
  disabled = false
}) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Tag className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-slate-50"
        />
      </div>
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {tags.length === 0 && <span className="text-sm text-slate-400 italic">Nenhuma tag adicionada.</span>}
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full border border-blue-200">
            {tag}
            <button type="button" onClick={() => onRemoveTag(tag)} className="text-blue-400 hover:text-blue-700 focus:outline-none" disabled={disabled}>
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}