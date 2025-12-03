import { useState, useRef } from 'react';
import { calculateAllTripsTotal, calculateAllTripsPaid, formatCurrency, formatDate } from '../utils/calculations';

function BudgetOverview({ trips, tripsByStatus }) {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const paymentsCarouselRef = useRef(null);
  const totalCost = calculateAllTripsTotal(trips);
  const totalPaid = calculateAllTripsPaid(trips);
  const remaining = totalCost - totalPaid;
  const percentPaid = totalCost > 0 ? (totalPaid / totalCost) * 100 : 0;

  // Calculate monthly payment obligations
  const getMonthlyPayments = () => {
    const monthlyPayments = {};

    trips.forEach(trip => {
      // Add deposit payments
      if (trip.deposit && parseFloat(trip.deposit) > 0 && trip.depositDueDate && !trip.depositPaid) {
        const month = new Date(trip.depositDueDate).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!monthlyPayments[month]) {
          monthlyPayments[month] = { total: 0, payments: [], date: new Date(trip.depositDueDate) };
        }
        monthlyPayments[month].total += parseFloat(trip.deposit);
        monthlyPayments[month].payments.push({
          tripName: trip.name,
          amount: parseFloat(trip.deposit),
          type: 'Deposit',
          dueDate: trip.depositDueDate
        });
      }

      // Add monthly payment plan payments
      if (trip.monthlyPayments && trip.monthlyPayments.length > 0) {
        trip.monthlyPayments.forEach(payment => {
          if (!payment.paid && payment.dueDate) {
            const month = new Date(payment.dueDate).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!monthlyPayments[month]) {
              monthlyPayments[month] = { total: 0, payments: [], date: new Date(payment.dueDate) };
            }
            monthlyPayments[month].total += parseFloat(payment.amount);
            monthlyPayments[month].payments.push({
              tripName: trip.name,
              amount: parseFloat(payment.amount),
              type: payment.description || 'Payment',
              dueDate: payment.dueDate
            });
          }
        });
      }

      // Add custom payments
      if (trip.payments && trip.payments.length > 0) {
        trip.payments.forEach(payment => {
          if (!payment.paid && payment.dueDate) {
            const month = new Date(payment.dueDate).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!monthlyPayments[month]) {
              monthlyPayments[month] = { total: 0, payments: [], date: new Date(payment.dueDate) };
            }
            monthlyPayments[month].total += parseFloat(payment.amount);
            monthlyPayments[month].payments.push({
              tripName: trip.name,
              amount: parseFloat(payment.amount),
              type: payment.description || 'Payment',
              dueDate: payment.dueDate
            });
          }
        });
      }
    });

    // Sort months chronologically
    return Object.entries(monthlyPayments)
      .sort(([, a], [, b]) => a.date - b.date)
      .reduce((acc, [month, data]) => {
        acc[month] = data;
        return acc;
      }, {});
  };

  const monthlyPayments = getMonthlyPayments();

  // Currency converter functions
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

  // Payment carousel navigation
  const scrollPaymentsLeft = () => {
    if (paymentsCarouselRef.current) {
      paymentsCarouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollPaymentsRight = () => {
    if (paymentsCarouselRef.current) {
      paymentsCarouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="budget-overview">
      <h2>2026 Travel Budget Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Budget</div>
          <div className="stat-value">{formatCurrency(totalCost)}</div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-label">Paid So Far</div>
          <div className="stat-value">{formatCurrency(totalPaid)}</div>
          <div className="stat-subtext">{percentPaid.toFixed(1)}% of total</div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-label">Remaining Balance</div>
          <div className="stat-value">{formatCurrency(remaining)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Trips</div>
          <div className="stat-value">{trips.length}</div>
          <div className="stat-subtext">
            {tripsByStatus.upcoming.length} upcoming · {tripsByStatus.completed.length} completed
          </div>
        </div>
      </div>

      {totalCost > 0 && (
        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(percentPaid, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Side by side: Payment Schedule & Currency Converter */}
      <div className="payments-converter-container">
        {/* Payment Schedule Carousel */}
        {Object.keys(monthlyPayments).length > 0 && (
          <div className="monthly-payments-section">
            <h3>📅 Upcoming Payment Schedule</h3>
            <div className="payments-carousel-wrapper">
              {Object.keys(monthlyPayments).length > 2 && (
                <button
                  className="carousel-nav carousel-nav-left"
                  onClick={scrollPaymentsLeft}
                  aria-label="Scroll left"
                >
                  ←
                </button>
              )}
              <div className="monthly-payments-carousel" ref={paymentsCarouselRef}>
                {Object.entries(monthlyPayments).map(([month, data]) => (
                  <div key={month} className="monthly-payment-card">
                    <div className="month-header">
                      <h4>{month}</h4>
                      <div className="month-total">{formatCurrency(data.total)}</div>
                    </div>
                    <div className="payment-details">
                      {data.payments.map((payment, index) => (
                        <div key={index} className="payment-detail-item">
                          <div className="payment-trip-name">{payment.tripName}</div>
                          <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {Object.keys(monthlyPayments).length > 2 && (
                <button
                  className="carousel-nav carousel-nav-right"
                  onClick={scrollPaymentsRight}
                  aria-label="Scroll right"
                >
                  →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Currency Converter */}
        <div className="currency-converter-inline">
          <h3>💱 Currency Converter</h3>
          <div className="converter-form-inline">
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

            <div className="converter-selects">
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

              <button
                type="button"
                className="btn btn-sm btn-secondary swap-btn"
                onClick={handleSwapCurrencies}
                title="Swap currencies"
              >
                ⇄
              </button>

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
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetOverview;
