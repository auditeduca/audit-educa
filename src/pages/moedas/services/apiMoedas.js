// Use a free API or mock data. This example uses a mock with static data.
// Replace with real API calls when you have an API key.

export const fetchCurrencies = async () => {
  return {
    BRL: 'Real Brasileiro',
    USD: 'Dólar Americano',
    EUR: 'Euro',
    GBP: 'Libra Esterlina',
    JPY: 'Iene Japonês',
    CAD: 'Dólar Canadense',
    AUD: 'Dólar Australiano',
    CHF: 'Franco Suíço',
    CNY: 'Yuan Chinês',
    ARS: 'Peso Argentino',
  };
};

export const fetchLatestRates = async (base = 'BRL') => {
  const mockRates = {
    BRL: 1,
    USD: 0.2,
    EUR: 0.18,
    GBP: 0.15,
    JPY: 22.5,
    CAD: 0.27,
    AUD: 0.3,
    CHF: 0.18,
    CNY: 1.4,
    ARS: 35.0,
  };

  await new Promise((resolve) => setTimeout(resolve, 500));

  if (base === 'BRL') return mockRates;
  const baseRate = mockRates[base];
  if (!baseRate) throw new Error(`Base currency ${base} not found in mock data`);

  const convertedRates = {};
  for (const [currency, rate] of Object.entries(mockRates)) {
    convertedRates[currency] = rate / baseRate;
  }
  return convertedRates;
};

export const fetchHistoricalRates = async (base, target, startDate, endDate) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const data = [];

  let currentRate = getMockRate(base, target);
  for (let i = 0; i <= days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    if (date > end) break;

    const fluctuation = (Math.random() - 0.5) * 0.01;
    currentRate = currentRate * (1 + fluctuation);
    data.push({
      date: date.toISOString().split('T')[0],
      rate: currentRate,
    });
  }
  return data;
};

function getMockRate(base, target) {
  const mockRates = {
    BRLUSD: 0.20,
    BRLEUR: 0.18,
    BRLGBP: 0.15,
    USDBRL: 5.0,
    EURBRL: 5.5,
    GBPBRL: 6.7,
  };
  const key = `${base}${target}`;
  return mockRates[key] || 1.0;
}