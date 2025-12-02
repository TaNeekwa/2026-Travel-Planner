// Map countries to their currencies
const countryCurrencyMap = {
  // North America
  'United States': 'USD',
  'USA': 'USD',
  'US': 'USD',
  'Canada': 'CAD',
  'Mexico': 'MXN',

  // Europe (Euro countries)
  'France': 'EUR',
  'Germany': 'EUR',
  'Italy': 'EUR',
  'Spain': 'EUR',
  'Netherlands': 'EUR',
  'Belgium': 'EUR',
  'Austria': 'EUR',
  'Portugal': 'EUR',
  'Greece': 'EUR',
  'Ireland': 'EUR',
  'Finland': 'EUR',

  // Europe (non-Euro)
  'United Kingdom': 'GBP',
  'UK': 'GBP',
  'England': 'GBP',
  'Scotland': 'GBP',
  'Wales': 'GBP',
  'Switzerland': 'CHF',
  'Norway': 'NOK',
  'Sweden': 'SEK',
  'Denmark': 'DKK',
  'Poland': 'PLN',
  'Czech Republic': 'CZK',
  'Hungary': 'HUF',
  'Romania': 'RON',

  // Asia
  'Japan': 'JPY',
  'China': 'CNY',
  'South Korea': 'KRW',
  'India': 'INR',
  'Thailand': 'THB',
  'Singapore': 'SGD',
  'Malaysia': 'MYR',
  'Indonesia': 'IDR',
  'Philippines': 'PHP',
  'Vietnam': 'VND',
  'Hong Kong': 'HKD',
  'Taiwan': 'TWD',

  // Oceania
  'Australia': 'AUD',
  'New Zealand': 'NZD',

  // Africa
  'Nigeria': 'NGN',
  'South Africa': 'ZAR',
  'Egypt': 'EGP',
  'Kenya': 'KES',
  'Ghana': 'GHS',
  'Morocco': 'MAD',

  // Middle East
  'United Arab Emirates': 'AED',
  'UAE': 'AED',
  'Saudi Arabia': 'SAR',
  'Israel': 'ILS',
  'Turkey': 'TRY',

  // South America
  'Brazil': 'BRL',
  'Argentina': 'ARS',
  'Chile': 'CLP',
  'Colombia': 'COP',
  'Peru': 'PEN',
};

/**
 * Get currency code from destination string
 * @param {string} destination - e.g., "Paris, France" or "New York, USA"
 * @returns {string} Currency code (e.g., "EUR", "USD")
 */
export function getCurrencyFromDestination(destination) {
  if (!destination) return 'USD';

  // Split by comma and get the last part (usually the country)
  const parts = destination.split(',').map(part => part.trim());

  // Try matching from the end to beginning (most specific to least specific)
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    if (countryCurrencyMap[part]) {
      return countryCurrencyMap[part];
    }
  }

  // Default to USD if no match found
  return 'USD';
}

/**
 * Get currency symbol from currency code
 * @param {string} currencyCode - e.g., "USD", "EUR"
 * @returns {string} Currency symbol (e.g., "$", "€")
 */
export function getCurrencySymbol(currencyCode) {
  const symbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CNY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'NZD': 'NZ$',
    'CHF': 'CHF',
    'NGN': '₦',
    'INR': '₹',
    'KRW': '₩',
    'MXN': '$',
    'BRL': 'R$',
    'ZAR': 'R',
    'AED': 'د.إ',
  };

  return symbols[currencyCode] || currencyCode;
}
