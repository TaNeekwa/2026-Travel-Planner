import { calculateAllTripsTotal, calculateAllTripsPaid, formatCurrency, formatDate } from '../utils/calculations';

function BudgetOverview({ trips, tripsByStatus }) {
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

      {Object.keys(monthlyPayments).length > 0 && (
        <div className="monthly-payments-section">
          <h3>📅 Upcoming Payment Schedule</h3>
          <div className="monthly-payments-grid">
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
                      <div className="payment-type-amount">
                        <span className="payment-type">{payment.type}</span>
                        <span className="payment-amount">{formatCurrency(payment.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetOverview;
