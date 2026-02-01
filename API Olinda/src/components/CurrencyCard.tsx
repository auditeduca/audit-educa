import { Currency } from '@/lib/currencies';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface CurrencyCardProps {
  currency: Currency;
  buyPrice: number | null;
  sellPrice: number | null;
  loading?: boolean;
  error?: string | null;
}

export default function CurrencyCard({
  currency,
  buyPrice,
  sellPrice,
  loading = false,
  error = null,
}: CurrencyCardProps) {
  const variation = buyPrice && sellPrice ? ((sellPrice - buyPrice) / buyPrice) * 100 : 0;
  const isPositive = variation >= 0;

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-16" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 rounded w-20" />
          <div className="h-4 bg-slate-100 rounded w-16" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg border border-red-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{currency.flag}</span>
          <div>
            <h3 className="font-semibold text-slate-900">{currency.code}</h3>
            <p className="text-xs text-slate-500">{currency.name}</p>
          </div>
        </div>
        <p className="text-sm text-red-600">Erro ao carregar dados</p>
      </div>
    );
  }

  if (!buyPrice || !sellPrice) {
    return (
      <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{currency.flag}</span>
          <div>
            <h3 className="font-semibold text-slate-900">{currency.code}</h3>
            <p className="text-xs text-slate-500">{currency.name}</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">Dados não disponíveis</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all duration-300 group cursor-pointer">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currency.flag}</span>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{currency.code}</h3>
            <p className="text-xs text-slate-500 font-medium">{currency.name}</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-md ${
            isPositive ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span className={`text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {variation.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Prices */}
      <div className="space-y-3">
        <div>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
            Compra
          </p>
          <p className="font-mono text-lg font-bold text-slate-900">
            R$ {buyPrice.toFixed(4).replace('.', ',')}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
            Venda
          </p>
          <p className="font-mono text-lg font-bold text-amber-600">
            R$ {sellPrice.toFixed(4).replace('.', ',')}
          </p>
        </div>
      </div>

      {/* Spread */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
          Spread
        </p>
        <p className="font-mono text-sm text-slate-700">
          {(sellPrice - buyPrice).toFixed(4).replace('.', ',')}
        </p>
      </div>
    </div>
  );
}
