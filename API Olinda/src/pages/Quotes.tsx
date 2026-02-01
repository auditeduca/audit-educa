import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Search, Filter, TrendingUp } from 'lucide-react';
import {
  CURRENCIES,
  Currency,
  REGION_LABELS,
  getPrincipalCurrencies,
  getAllCurrencies,
  getCurrenciesByRegion,
} from '@/lib/currencies';
import { useCurrencyQuotes } from '@/hooks/useCurrencyQuotes';
import CurrencyCard from '@/components/CurrencyCard';
import APIDocumentation from '@/components/APIDocumentation';

type FilterType = 'all' | 'principais' | 'americas' | 'europa' | 'asia' | 'africa' | 'outros';

export default function Quotes() {
  const [, navigate] = useLocation();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get all currency codes for initial fetch
  const allCurrencyCodes = useMemo(() => Object.keys(CURRENCIES), []);

  // Fetch quotes for all currencies
  const { data: quotesData, loading: quotesLoading } = useCurrencyQuotes(allCurrencyCodes);

  // Filter currencies based on active filter
  const filteredCurrencies = useMemo(() => {
    let currencies: Currency[] = [];

    if (activeFilter === 'all') {
      currencies = getAllCurrencies();
    } else if (activeFilter === 'principais') {
      currencies = getPrincipalCurrencies();
    } else {
      currencies = getCurrenciesByRegion(activeFilter);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      currencies = currencies.filter(
        (c) =>
          c.code.toLowerCase().includes(term) ||
          c.name.toLowerCase().includes(term) ||
          c.flag.includes(term)
      );
    }

    return currencies;
  }, [activeFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Cotação de Moedas</h1>
                <p className="text-sm text-slate-500">API Olinda - Banco Central do Brasil</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/historico')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
              >
                Série Histórica
              </button>
              <button
                onClick={() => navigate('/conversor')}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                Conversor
              </button>
              <button
                onClick={() => navigate('/sobre')}
                className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Sobre
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Cotações em Tempo Real</h2>
          <p className="text-blue-100 text-lg max-w-2xl">
            Consulte as cotações oficiais PTAX de todas as moedas suportadas pelo Banco Central do
            Brasil. Dados atualizados diariamente.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar moeda (ex: Dólar, USD, 🇺🇸)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-500'
            }`}
          >
            <Filter className="w-4 h-4" />
            Todas as Moedas ({Object.keys(CURRENCIES).length})
          </button>

          <button
            onClick={() => setActiveFilter('principais')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeFilter === 'principais'
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-500'
            }`}
          >
            Principais ({getPrincipalCurrencies().length})
          </button>

          <button
            onClick={() => setActiveFilter('americas')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeFilter === 'americas'
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-500'
            }`}
          >
            Américas ({getCurrenciesByRegion('americas').length})
          </button>

          <button
            onClick={() => setActiveFilter('europa')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeFilter === 'europa'
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-500'
            }`}
          >
            Europa ({getCurrenciesByRegion('europa').length})
          </button>

          <button
            onClick={() => setActiveFilter('asia')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeFilter === 'asia'
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-500'
            }`}
          >
            Ásia/Oceania ({getCurrenciesByRegion('asia').length})
          </button>

          <button
            onClick={() => setActiveFilter('africa')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeFilter === 'africa'
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-500'
            }`}
          >
            África ({getCurrenciesByRegion('africa').length})
          </button>
        </div>

        {/* API Documentation */}
        <div className="mb-12">
          <APIDocumentation />
        </div>

        {/* Currency Grid */}
        {filteredCurrencies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">Nenhuma moeda encontrada para sua busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCurrencies.map((currency) => {
              const quoteData = quotesData[currency.code];
              return (
                <CurrencyCard
                  key={currency.code}
                  currency={currency}
                  buyPrice={quoteData?.quote?.cotacaoCompra ?? null}
                  sellPrice={quoteData?.quote?.cotacaoVenda ?? null}
                  loading={quotesLoading}
                  error={quoteData?.error}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
