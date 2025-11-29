// Currency conversion utilities

// Exchange rates relative to USD (approximate rates as of 2024)
const exchangeRates = {
  USD: 1.00,
  EUR: 0.92,      // Euro
  GBP: 0.79,      // British Pound
  JPY: 149.50,    // Japanese Yen
  CAD: 1.36,      // Canadian Dollar
  AUD: 1.53,      // Australian Dollar
  CHF: 0.88,      // Swiss Franc
  CNY: 7.24,      // Chinese Yuan
  INR: 83.12,     // Indian Rupee
  MXN: 17.15,     // Mexican Peso
  BRL: 4.97,      // Brazilian Real
  ZAR: 18.65,     // South African Rand
  SGD: 1.35,      // Singapore Dollar
  NZD: 1.67,      // New Zealand Dollar
  HKD: 7.83,      // Hong Kong Dollar
  KRW: 1320.50,   // South Korean Won
  THB: 35.60,     // Thai Baht
  MYR: 4.68,      // Malaysian Ringgit
  PHP: 56.30,     // Philippine Peso
  IDR: 15678.00,  // Indonesian Rupiah
  AED: 3.67,      // UAE Dirham
  SAR: 3.75,      // Saudi Riyal
  TRY: 32.15,     // Turkish Lira
  RUB: 92.50,     // Russian Ruble
  PLN: 4.02,      // Polish Zloty
  SEK: 10.58,     // Swedish Krona
  NOK: 10.85,     // Norwegian Krone
  DKK: 6.86,      // Danish Krone
};

/**
 * Convert amount from one currency to another
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - Source currency code (e.g., 'GBP')
 * @param {string} toCurrency - Target currency code (e.g., 'USD')
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency = 'USD', toCurrency = 'USD') => {
  if (!amount || amount === 0) return 0;

  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  // If same currency, return original amount
  if (from === to) return amount;

  // If either currency is not supported, return original amount
  if (!exchangeRates[from] || !exchangeRates[to]) {
    console.warn(`Currency ${from} or ${to} not supported. Showing original amount.`);
    return amount;
  }

  // Convert to USD first, then to target currency
  const amountInUSD = amount / exchangeRates[from];
  const convertedAmount = amountInUSD * exchangeRates[to];

  return convertedAmount;
};

/**
 * Format amount with both original currency and USD equivalent
 * @param {number} amount - The amount to format
 * @param {string} currency - The original currency code
 * @returns {string} Formatted string like "£1,000 ($1,280 USD)"
 */
export const formatCurrencyWithUSD = (amount, currency = 'USD') => {
  if (!amount || amount === 0) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(0);
  }

  const currencyCode = (currency || 'USD').toUpperCase();

  // Format original currency
  const originalFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  // If already USD, just return the formatted amount
  if (currencyCode === 'USD') {
    return originalFormatted;
  }

  // Convert to USD
  const usdAmount = convertCurrency(amount, currencyCode, 'USD');

  // Format USD amount
  const usdFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(usdAmount);

  // Return combined format
  return `${originalFormatted} (${usdFormatted})`;
};

/**
 * Get the currency symbol for a currency code
 * @param {string} currencyCode - The currency code
 * @returns {string} The currency symbol
 */
export const getCurrencySymbol = (currencyCode = 'USD') => {
  try {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(0);

    // Extract just the symbol
    return formatted.replace(/[\d,.\s]/g, '');
  } catch (error) {
    return '$'; // Default to dollar sign
  }
};

/**
 * Get list of supported currencies
 * @returns {Array} Array of currency codes
 */
export const getSupportedCurrencies = () => {
  return Object.keys(exchangeRates).sort();
};

/**
 * Check if a currency is supported
 * @param {string} currencyCode - The currency code to check
 * @returns {boolean} True if supported
 */
export const isCurrencySupported = (currencyCode) => {
  return exchangeRates.hasOwnProperty(currencyCode.toUpperCase());
};
