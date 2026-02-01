import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeftRight, ArrowLeft } from 'lucide-react';
import { CURRENCIES, getAllCurrencies } from '@/lib/currencies';
import { useCurrencyQuotes } from '@/hooks/useCurrencyQuotes';

export default function Converter() {
  const [, navigate] = useLocation();
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('1000');

  const currenciesToFetch = useMemo(() => {
    const codes = new Set<string>();
    if (fromCurrency !== 'BRL') codes.add(fromCurrency);
    if (toCurrency !== 'BRL') codes.add(toCurrency);
    return Array.from(codes);
  }, [fromCurrency, toCurrency]);

  const { data: quotesData } = useCurrencyQuotes(currenciesToFetch);

  // Calculate conversion
  const result = useMemo(() => {
    const numAmount = parseFloat(amount) || 0;

    if (fromCurrency === 'BRL' && toCurrency === 'BRL') {
      return numAmount;
    }

    if (fromCurrency === 'BRL') {
      // BRL to foreign currency
      const quote = quotesData[toCurrency];
      if (quote?.quote) {
        return numAmount / quote.quote.cotacaoVenda;
      }
      return 0;
    }

    if (toCurrency === 'BRL') {
      // Foreign currency to BRL
      const quote = quotesData[fromCurrency];
      if (quote?.quote) {
        return numAmount * quote.quote.cotacaoVenda;
      }
      return 0;
    }

    // Foreign to foreign
    const fromQuote = quotesData[fromCurrency];
    const toQuote = quotesData[toCurrency];
    if (fromQuote?.quote && toQuote?.quote) {
      const brlAmount = numAmount * fromQuote.quote.cotacaoVenda;
      return brlAmount / toQuote.quote.cotacaoVenda;
    }

    return 0;
  }, [amount, fromCurrency, toCurrency, quotesData]);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const allCurrencies = useMemo(() => {
    const list = [
      { code: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷' },
      ...getAllCurrencies(),
    ];
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Conversor de Moedas</h1>
              <p className="text-sm text-slate-500">Converta entre moedas em tempo real</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg border border-slate-200 shadow-lg p-8">
          {/* From */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-900 mb-3">De</label>
            <div className="flex gap-4">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {allCurrencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={swap}
              className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors"
            >
              <ArrowLeftRight className="w-6 h-6" />
            </button>
          </div>

          {/* To */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-900 mb-3">Para</label>
            <div className="flex gap-4">
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {allCurrencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
              <div className="flex-1 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 flex items-center">
                <span className="font-mono text-lg font-bold text-slate-900">
                  {result.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

          {/* Exchange Rate */}
          <div className="pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Taxa de câmbio: 1 {fromCurrency} ={' '}
              <span className="font-semibold text-slate-900">
                {(result / (parseFloat(amount) || 1)).toFixed(4).replace('.', ',')} {toCurrency}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
