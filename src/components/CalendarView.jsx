import { useState } from 'react';
import { formatCurrency } from '../utils/calculations';

function CalendarView({ trips, onViewTrip }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Start at January 2026

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getTripsForDate = (date) => {
    return trips.filter(trip => {
      const tripStart = new Date(trip.startDate);
      const tripEnd = new Date(trip.endDate);
      return date >= tripStart && date <= tripEnd;
    });
  };

  const getPaymentsForDate = (date) => {
    const payments = [];
    const dateStr = date.toISOString().split('T')[0];

    trips.forEach(trip => {
      // Check deposit due date
      if (trip.depositDueDate === dateStr && trip.deposit && !trip.depositPaid) {
        payments.push({
          tripName: trip.name,
          description: 'Deposit',
          amount: parseFloat(trip.deposit),
          currency: trip.currency || 'USD',
          type: 'deposit'
        });
      }

      // Check monthly payments
      if (trip.monthlyPayments && trip.monthlyPayments.length > 0) {
        trip.monthlyPayments.forEach(payment => {
          if (payment.dueDate === dateStr && !payment.paid) {
            payments.push({
              tripName: trip.name,
              description: payment.description || 'Payment',
              amount: parseFloat(payment.amount),
              currency: trip.currency || 'USD',
              type: 'monthly'
            });
          }
        });
      }
    });

    return payments;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day calendar-day-empty"></div>);
    }

    // Render days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const tripsOnDay = getTripsForDate(currentDateObj);
      const paymentsOnDay = getPaymentsForDate(currentDateObj);
      const isToday = currentDateObj.getTime() === today.getTime();
      const hasItems = tripsOnDay.length > 0 || paymentsOnDay.length > 0;

      days.push(
        <div
          key={day}
          className={`calendar-day ${hasItems ? 'has-trips' : ''} ${
            isToday ? 'is-today' : ''
          } ${paymentsOnDay.length > 0 ? 'has-payments' : ''}`}
        >
          <div className="calendar-day-number">{day}</div>

          {tripsOnDay.length > 0 && (
            <div className="calendar-day-trips">
              {tripsOnDay.map(trip => (
                <div
                  key={trip.id}
                  className="calendar-trip"
                  onClick={() => onViewTrip(trip)}
                  title={trip.name}
                >
                  <div className="calendar-trip-name">✈️ {trip.name}</div>
                </div>
              ))}
            </div>
          )}

          {paymentsOnDay.length > 0 && (
            <div className="calendar-day-payments">
              {paymentsOnDay.map((payment, idx) => (
                <div
                  key={idx}
                  className="calendar-payment"
                  title={`${payment.tripName}: ${payment.description} - ${formatCurrency(payment.amount)}`}
                >
                  <div className="calendar-payment-indicator">
                    💳 {formatCurrency(payment.amount)}
                  </div>
                  <div className="calendar-payment-trip" style={{ fontSize: '0.7rem' }}>
                    {payment.tripName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={previousMonth} className="btn btn-secondary">
          ← Previous
        </button>
        <div className="calendar-title">
          <h2>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={goToToday} className="btn btn-sm btn-primary">
            Today
          </button>
        </div>
        <button onClick={nextMonth} className="btn btn-secondary">
          Next →
        </button>
      </div>

      <div className="calendar-weekdays">
        <div className="calendar-weekday">Sun</div>
        <div className="calendar-weekday">Mon</div>
        <div className="calendar-weekday">Tue</div>
        <div className="calendar-weekday">Wed</div>
        <div className="calendar-weekday">Thu</div>
        <div className="calendar-weekday">Fri</div>
        <div className="calendar-weekday">Sat</div>
      </div>

      <div className="calendar-grid">{renderCalendar()}</div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span>✈️</span>
          <span>Trip days</span>
        </div>
        <div className="legend-item">
          <span>💳</span>
          <span>Payment due</span>
        </div>
        <div className="legend-item">
          <div className="legend-box is-today-box"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
