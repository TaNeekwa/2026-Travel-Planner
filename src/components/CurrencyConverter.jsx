import { useState } from 'react';

function CurrencyConverter() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);

  // Static exchange rates (base: USD)
  // Note: These are approximate rates and should be updated periodically
  const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CAD: 1.36,
    AUD: 1.52,
    CNY: 7.24,
    MXN: 17.15,
    BRL: 4.97,
    INR: 83.12,
    NGN: 1540.00,
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  ];

  const handleConvert = () => {
    if (!amount || isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    const amountInUSD = parseFloat(amount) / exchangeRates[fromCurrency];
    const convertedAmount = amountInUSD * exchangeRates[toCurrency];
    setResult(convertedAmount.toFixed(2));
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  const getSymbol = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : code;
  };

  return (
    <div className="currency-converter">
      <h2>Currency Converter</h2>
      <p className="converter-note">
        Convert between different currencies for your travel budget planning
      </p>

      <div className="converter-form">
        <div className="converter-row">
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setResult(null);
              }}
              placeholder="Enter amount"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>From</label>
            <select
              value={fromCurrency}
              onChange={(e) => {
                setFromCurrency(e.target.value);
                setResult(null);
              }}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="converter-swap">
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={handleSwapCurrencies}
            title="Swap currencies"
          >
            ⇄
          </button>
        </div>

        <div className="converter-row">
          <div className="form-group">
            <label>To</label>
            <select
              value={toCurrency}
              onChange={(e) => {
                setToCurrency(e.target.value);
                setResult(null);
              }}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-convert"
          onClick={handleConvert}
        >
          Convert
        </button>

        {result && (
          <div className="converter-result">
            <div className="result-display">
              <div className="result-from">
                {getSymbol(fromCurrency)}{parseFloat(amount).toFixed(2)} {fromCurrency}
              </div>
              <div className="result-equals">=</div>
              <div className="result-to">
                {getSymbol(toCurrency)}{result} {toCurrency}
              </div>
            </div>
            <div className="exchange-rate">
              1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} {toCurrency}
            </div>
          </div>
        )}

        <div className="converter-disclaimer">
          <small>
            * Exchange rates are approximate and for planning purposes only.
            Please check current rates before making transactions.
          </small>
        </div>
      </div>
    </div>
  );
}

export default CurrencyConverter;
