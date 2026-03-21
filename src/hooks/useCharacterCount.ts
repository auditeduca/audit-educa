import { useState, useCallback } from 'react';

interface CharacterCountState {
  current: number;
  max: number;
  percentage: number;
  status: 'ok' | 'warning' | 'error';
  remainingChars: number;
}

/**
 * Hook para gerenciar contador de caracteres em formulários
 * Fornece estado de validação visual (ok, warning, error)
 * @param max - limite máximo de caracteres
 * @returns { state, reset }
 */
export function useCharacterCount(max: number = 1000) {
  const [currentCount, setCurrentCount] = useState(0);

  const handleChange = useCallback(
    (value: string) => {
      // Remove espaços múltiplos e conta apenas caracteres "reais"
      const trimmedValue = value.trim();
      setCurrentCount(trimmedValue.length);
      return value;
    },
    []
  );

  const reset = useCallback(() => {
    setCurrentCount(0);
  }, []);

  const state: CharacterCountState = {
    current: currentCount,
    max,
    percentage: (currentCount / max) * 100,
    status:
      currentCount === 0
        ? 'ok'
        : currentCount < max * 0.8
        ? 'ok'
        : currentCount < max
        ? 'warning'
        : 'error',
    remainingChars: max - currentCount
  };

  return { state, handleChange, reset };
}
