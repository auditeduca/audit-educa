// src/pages/circularizacao/components/CEPField.jsx
import React, { useState } from "react";
import { apiCEP, cleanNum, fmtCEP } from "../../../libs/utils.js";
import { MapPin, Loader2, Search } from "lucide-react";

export default function CEPField({ value, onChange, onFill, className }) {
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    if (cleanNum(value).length !== 8) return;
    setLoading(true);
    const data = await apiCEP(value);
    setLoading(false);
    if (data && onFill) onFill(data);
  };

  return (
    <div className="flex gap-2 group">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(fmtCEP(e.target.value))}
          placeholder="00000-000"
          className={`w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white transition-all ${className || ""}`}
        />
      </div>
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors text-audit-navy dark:text-white shadow-sm"
        onClick={handleLookup}
        disabled={loading || cleanNum(value).length !== 8}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <Search size={16} />
        )}
        <span>Buscar</span>
      </button>
    </div>
  );
}