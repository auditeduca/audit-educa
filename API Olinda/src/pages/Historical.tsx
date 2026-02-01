import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Calendar, TrendingUp, ArrowLeft } from 'lucide-react';
import { CURRENCIES, getPrincipalCurrencies } from '@/lib/currencies';
import { useCurrencyQuotesByDate } from '@/hooks/useCurrencyQuotes';
import ExportButtons from '@/components/ExportButtons';
import APIDocumentation from '@/components/APIDocumentation';

export default function Historical() {
  const [, navigate] = useLocation();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { quotes, loading, error } = useCurrencyQuotesByDate(selectedCurrency, startDate, endDate);

  // Process data for chart
  const chartData = useMemo(() => {
    return quotes.map((quote) => ({
      date: new Date(quote.dataHoraCotacao).toLocaleDateString('pt-BR'),
      compra: quote.cotacaoCompra,
      venda: quote.cotacaoVenda,
      media: (quote.cotacaoCompra + quote.cotacaoVenda) / 2,
    }));
  }, [quotes]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return { max: 0, min: 0, avg: 0, variation: 0 };
    }

    const vendas = chartData.map((d) => d.venda);
    const max = Math.max(...vendas);
    const min = Math.min(...vendas);
    const avg = vendas.reduce((a, b) => a + b, 0) / vendas.length;
    const variation = ((vendas[vendas.length - 1] - vendas[0]) / vendas[0]) * 100;

    return { max, min, avg, variation };
  }, [chartData]);

  const currency = CURRENCIES[selectedCurrency];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Série Histórica</h1>
                <p className="text-sm text-slate-500">Análise de tendências de cotação</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold">Análise de Tendências</h2>
          <p className="text-amber-100 mt-2">
            Visualize a evolução das cotações em um período específico
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Currency Select */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Moeda</label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {getPrincipalCurrencies().map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code} - {curr.name}
                  </option>
                ))}
                <optgroup label="Outras Moedas">
                  {Object.values(CURRENCIES)
                    .filter((c) => !c.isPrincipal)
                    .map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.flag} {curr.code} - {curr.name}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Data Inicial
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Data Final
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        {!loading && chartData.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Exportar Dados</h3>
            <ExportButtons
              quotes={quotes}
              currencyCode={selectedCurrency}
              currencyName={currency?.name || selectedCurrency}
              disabled={quotes.length === 0}
            />
          </div>
        )}

        {/* Statistics */}
        {!loading && chartData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Maior Cotação
              </p>
              <p className="font-mono text-2xl font-bold text-red-600">
                R$ {stats.max.toFixed(4).replace('.', ',')}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Menor Cotação
              </p>
              <p className="font-mono text-2xl font-bold text-green-600">
                R$ {stats.min.toFixed(4).replace('.', ',')}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Média do Período
              </p>
              <p className="font-mono text-2xl font-bold text-slate-900">
                R$ {stats.avg.toFixed(4).replace('.', ',')}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Variação
              </p>
              <p
                className={`font-mono text-2xl font-bold ${
                  stats.variation >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stats.variation.toFixed(2)}%
              </p>
            </div>
          </div>
        )}

        {/* Chart */}
        {loading ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-500 font-medium">Carregando dados...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg border border-red-200 shadow-sm p-8 text-center">
            <p className="text-red-600 font-semibold">Erro ao carregar dados</p>
            <p className="text-red-500 text-sm mt-2">{error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center">
            <p className="text-slate-500 font-medium">Nenhum dado disponível para este período</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {currency?.flag} Cotação de {currency?.name}
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVenda" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: '#64748b' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: '#64748b' }}
                  label={{ value: 'R$', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => `R$ ${value.toFixed(4).replace('.', ',')}`}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ color: '#64748b' }} />
                <Area
                  type="monotone"
                  dataKey="venda"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVenda)"
                  name="Preço de Venda"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="compra"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Preço de Compra"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* API Documentation */}
        <div className="mt-12">
          <APIDocumentation />
        </div>
      </div>
    </div>
  );
}
