import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchLatestRates, fetchCurrencies, fetchHistoricalRates } from '../services/apiMoedas';

const useMoedas = () => {
  const [currencies, setCurrencies] = useState(null);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cache for rates per base currency
  const ratesCache = useRef({});

  // Prevent multiple concurrent fetches
  const fetchingRef = useRef(false);

  // Load currencies on mount (only once)
  useEffect(() => {
    let isMounted = true;
    const loadCurrencies = async () => {
      if (!isMounted) return;
      setLoading(true);
      try {
        const data = await fetchCurrencies();
        if (isMounted) setCurrencies(data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadCurrencies();
    return () => { isMounted = false; };
  }, []); // empty deps → runs once

  const fetchRates = useCallback(async (base = 'BRL') => {
    // If we already have rates for this base, use cache
    if (ratesCache.current[base]) {
      setRates(ratesCache.current[base]);
      return;
    }

    // Avoid parallel fetches
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    setLoading(true);
    try {
      const data = await fetchLatestRates(base);
      ratesCache.current[base] = data; // store in cache
      setRates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  const fetchHistorical = useCallback(async (base, target, startDate, endDate) => {
    setLoading(true);
    try {
      const data = await fetchHistoricalRates(base, target, startDate, endDate);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    currencies,
    rates,
    loading,
    error,
    fetchRates,
    fetchHistorical,
  };
};

export default useMoedas;