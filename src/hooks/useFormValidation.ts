import { useState, useCallback } from 'react';

interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  required?: boolean;
  customValidator?: (value: string) => boolean;
}

interface FieldError {
  field: string;
  message: string;
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
}

interface ValidationState {
  isValid: boolean;
  errors: FieldError[];
  touched: Record<string, boolean>;
}

/**
 * Hook para gerenciar validação de formulário com suporte a múltiplas regras
 * @param rules - objeto com campo: ValidationRule
 * @returns { state, validate, getFieldError, markTouched, reset }
 */
export function useFormValidation(rules: Record<string, ValidationRule>) {
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (fieldName: string, value: string): boolean => {
      const rule = rules[fieldName];
      if (!rule) return true;

      const newErrors: FieldError[] = [];

      // Validação: required
      if (rule.required && !value.trim()) {
        newErrors.push({
          field: fieldName,
          message: 'Este campo é obrigatório.',
          type: 'required'
        });
      }

      // Validação: minLength
      if (rule.minLength && value.trim().length < rule.minLength) {
        newErrors.push({
          field: fieldName,
          message: `Mínimo de ${rule.minLength} caracteres.`,
          type: 'minLength'
        });
      }

      // Validação: maxLength
      if (rule.maxLength && value.length > rule.maxLength) {
        newErrors.push({
          field: fieldName,
          message: `Máximo de ${rule.maxLength} caracteres.`,
          type: 'maxLength'
        });
      }

      // Validação: pattern
      if (rule.pattern && !rule.pattern.test(value)) {
        newErrors.push({
          field: fieldName,
          message: 'Formato inválido.',
          type: 'pattern'
        });
      }

      // Validação: customValidator
      if (rule.customValidator && !rule.customValidator(value)) {
        newErrors.push({
          field: fieldName,
          message: 'Validação falhou.',
          type: 'custom'
        });
      }

      // Atualizar erros
      setErrors((prevErrors) => [
        ...prevErrors.filter((e) => e.field !== fieldName),
        ...newErrors
      ]);

      return newErrors.length === 0;
    },
    [rules]
  );

  const validateAll = useCallback(
    (values: Record<string, string>): boolean => {
      const allErrors: FieldError[] = [];

      Object.entries(values).forEach(([fieldName, value]) => {
        const rule = rules[fieldName];
        if (!rule) return;

        // Validação: required
        if (rule.required && !value.trim()) {
          allErrors.push({
            field: fieldName,
            message: 'Este campo é obrigatório.',
            type: 'required'
          });
        }

        // Validação: minLength
        if (rule.minLength && value.trim().length < rule.minLength) {
          allErrors.push({
            field: fieldName,
            message: `Mínimo de ${rule.minLength} caracteres.`,
            type: 'minLength'
          });
        }

        // Validação: maxLength
        if (rule.maxLength && value.length > rule.maxLength) {
          allErrors.push({
            field: fieldName,
            message: `Máximo de ${rule.maxLength} caracteres.`,
            type: 'maxLength'
          });
        }

        // Validação: pattern
        if (rule.pattern && !rule.pattern.test(value)) {
          allErrors.push({
            field: fieldName,
            message: 'Formato inválido.',
            type: 'pattern'
          });
        }

        // Validação: customValidator
        if (rule.customValidator && !rule.customValidator(value)) {
          allErrors.push({
            field: fieldName,
            message: 'Validação falhou.',
            type: 'custom'
          });
        }
      });

      setErrors(allErrors);
      return allErrors.length === 0;
    },
    [rules]
  );

  const markTouched = useCallback((fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  }, []);

  const getFieldError = useCallback(
    (fieldName: string): FieldError | undefined => {
      return errors.find((e) => e.field === fieldName);
    },
    [errors]
  );

  const reset = useCallback(() => {
    setErrors([]);
    setTouched({});
  }, []);

  const state: ValidationState = {
    isValid: errors.length === 0,
    errors,
    touched
  };

  return { state, validate, validateAll, markTouched, getFieldError, reset };
}
