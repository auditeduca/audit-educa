/**
 * Formats a number as currency.
 * @param {number} value - The value to format.
 * @param {string} currency - ISO currency code (e.g., 'BRL', 'USD').
 * @returns {string} Formatted currency string.
 */
export const formatCurrency = (value, currency = 'BRL') => {
  if (value === undefined || value === null) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formats a number with thousand separators and fixed decimals.
 * @param {number} value - The value to format.
 * @param {number} decimals - Number of decimal places.
 * @returns {string} Formatted number.
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === undefined || value === null) return '';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Formats a date to a localized string.
 * @param {string|Date} date - Date to format.
 * @returns {string} Formatted date (dd/mm/yyyy).
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

/**
 * Parses a localized currency string back to a number.
 * @param {string} value - Currency string (e.g., 'R$ 1.234,56').
 * @returns {number} Parsed number.
 */
export const parseCurrency = (value) => {
  if (!value) return 0;
  const numeric = value
    .replace(/[^0-9,-]/g, '')
    .replace(',', '.')
    .replace(/\.(?=.*\.)/g, '');
  return parseFloat(numeric) || 0;
};