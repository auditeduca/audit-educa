import { useEffect, useState } from 'react';

export interface CurrencyQuote {
  codigo: string;
  nome: string;
  cotacaoCompra: number;
  cotacaoVenda: number;
  dataHoraCotacao: string;
  tipoBoletim: string;
}

export interface CurrencyData {
  quote: CurrencyQuote | null;
  loading: boolean;
  error: string | null;
}

const PTAX_API_BASE = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata';

// Função auxiliar para fazer requisições com tratamento de CORS
const fetchWithTimeout = async (url: string, timeout = 8000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

export function useCurrencyQuotes(currencyCodes: string[]) {
  const [data, setData] = useState<Record<string, CurrencyData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currencyCodes || currencyCodes.length === 0) {
      setLoading(false);
      return;
    }

    const fetchQuotes = async () => {
      setLoading(true);
      setError(null);
      const newData: Record<string, CurrencyData> = {};

      try {
        // Buscar cotações para cada moeda
        const promises = currencyCodes.map(async (code) => {
          try {
            const today = new Date();
            const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;

            const url = `${PTAX_API_BASE}/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${code}'&@dataCotacao='${dateStr}'&$format=json`;

            const response = await fetchWithTimeout(url);

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            if (result.value && result.value.length > 0) {
              newData[code] = {
                quote: result.value[0],
                loading: false,
                error: null,
              };
            } else {
              newData[code] = {
                quote: null,
                loading: false,
                error: 'Nenhum dado encontrado',
              };
            }
          } catch (err) {
            newData[code] = {
              quote: null,
              loading: false,
              error: err instanceof Error ? err.message : 'Erro desconhecido',
            };
          }
        });

        await Promise.all(promises);
        setData(newData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar cotações');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [currencyCodes.join(',')]);

  return { data, loading, error };
}

export function useCurrencyQuotesByDate(
  currencyCode: string,
  startDate: string,
  endDate: string
) {
  const [quotes, setQuotes] = useState<CurrencyQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currencyCode || !startDate || !endDate) {
      return;
    }

    const fetchQuotes = async () => {
      setLoading(true);
      setError(null);

      try {
        // Formatar datas para o padrão da API (MM-DD-YYYY)
        const formatDate = (date: string) => {
          const [year, month, day] = date.split('-');
          return `${month}-${day}-${year}`;
        };

        const formattedStart = formatDate(startDate);
        const formattedEnd = formatDate(endDate);

        const url = `${PTAX_API_BASE}/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='${currencyCode}'&@dataInicial='${formattedStart}'&@dataFinalCotacao='${formattedEnd}'&$top=10000&$orderby=dataHoraCotacao asc&$format=json`;

        const response = await fetchWithTimeout(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (result.value && Array.isArray(result.value)) {
          setQuotes(result.value);
        } else {
          setQuotes([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar histórico');
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [currencyCode, startDate, endDate]);

  return { quotes, loading, error };
}
