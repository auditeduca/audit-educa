// src/pages/circularizacao/components/CNPJField.jsx
import React, { useState } from "react";
import { apiCNPJ, cleanNum, fmtCNPJ } from "../../../libs/utils.js";
import { Building2, Loader2, CheckCircle2, AlertCircle, Search } from "lucide-react";

export default function CNPJField({ value, onChange, onFill, placeholder, className }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleLookup = async () => {
    const c = cleanNum(value);
    if (c.length !== 14) {
      setStatus("invalid");
      return;
    }
    setLoading(true);
    setStatus(null);
    const data = await apiCNPJ(value);
    setLoading(false);
    if (!data) {
      setStatus("err");
      return;
    }
    setStatus("ok");
    if (onFill) onFill(data);
  };

  const isValidLength = cleanNum(value).length === 14;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2 group">
        <div className="relative flex-1">
          <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
            status === "ok" ? "text-green-500" : status === "err" ? "text-red-500" : "text-gray-400"
          }`} size={16} />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(fmtCNPJ(e.target.value));
              setStatus(null);
            }}
            placeholder={placeholder || "00.000.000/0001-00"}
            className={`w-full pl-10 pr-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white transition-all ${
              status === "err" || status === "invalid"
                ? "border-red-500"
                : status === "ok"
                ? "border-green-500"
                : "border-gray-300 dark:border-gray-700"
            } ${className || ""}`}
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors whitespace-nowrap text-audit-navy dark:text-white shadow-sm"
          onClick={handleLookup}
          disabled={loading || !isValidLength}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
          <span>Validar</span>
        </button>
      </div>
      
      {status === "err" && (
        <div className="flex items-center gap-1 text-[11px] text-amber-600 font-medium ml-1">
          <AlertCircle size={12} />
          <span>Serviço indisponível ou CNPJ inexistente.</span>
        </div>
      )}
      {status === "ok" && (
        <div className="flex items-center gap-1 text-[11px] text-green-600 font-medium ml-1">
          <CheckCircle2 size={12} />
          <span>Dados recuperados com sucesso!</span>
        </div>
      )}
    </div>
  );
}