/**
 * Formats a number into a currency string (e.g., VND or USD).
 * @param {number} amount - The amount to format.
 * @param {string} locale - The locale to use (e.g., 'vi-VN', 'en-US').
 * @param {string} currency - The currency code (e.g., 'VND', 'USD').
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount, locale = 'vi-VN', currency = 'VND') => {
  if (typeof amount !== 'number') return amount;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
