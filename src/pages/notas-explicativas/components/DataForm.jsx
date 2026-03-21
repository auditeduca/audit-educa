import React from 'react';

export default function DataForm({ template, data, onChange }) {
  if (!template) return null;

  const handleChange = (fieldId, value) => {
    onChange({ ...data, [fieldId]: value });
  };

  const renderField = (campo) => {
    const baseClass = "w-full p-3 rounded-xl border border-slate-200 focus:border-audit-gold focus:ring-1 focus:ring-audit-gold outline-none text-sm";

    if (campo.type === 'textarea') {
      return (
        <textarea
          rows="4"
          value={data[campo.id] || ''}
          onChange={(e) => handleChange(campo.id, e.target.value)}
          placeholder={campo.placeholder}
          className={`${baseClass} resize-y`}
        />
      );
    }
    return (
      <input
        type={campo.type}
        value={data[campo.id] || ''}
        onChange={(e) => handleChange(campo.id, e.target.value)}
        placeholder={campo.placeholder}
        className={baseClass}
      />
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <h3 className="text-sm font-bold text-audit-navy uppercase tracking-widest mb-6 flex items-center gap-2">
        <i className="fas fa-pen text-audit-gold"></i> Preenchimento dos Dados
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {template.campos.map((campo) => (
          <div key={campo.id} className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {campo.label}
            </label>
            {renderField(campo)}
          </div>
        ))}
      </div>
    </div>
  );
}