import { useState, useCallback } from 'react';

export function useFormValidation(rules) {
  const [errors, setErrors] = useState([]);

  const validateAll = useCallback((values) => {
    const newErrors = [];
    for (const [field, rule] of Object.entries(rules)) {
      const value = values[field];
      if (rule.required && !value?.trim()) {
        newErrors.push({ field, message: 'Campo obrigatório' });
      } else if (rule.minLength && value?.length < rule.minLength) {
        newErrors.push({ field, message: `Mínimo de ${rule.minLength} caracteres` });
      } else if (rule.maxLength && value?.length > rule.maxLength) {
        newErrors.push({ field, message: `Máximo de ${rule.maxLength} caracteres` });
      }
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  }, [rules]);

  const reset = useCallback(() => setErrors([]), []);

  return { state: { errors }, validateAll, reset };
}