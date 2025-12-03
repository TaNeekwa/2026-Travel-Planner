import { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '../utils/calculations';

function PaymentNotifications({ trips }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const checkPayments = () => {
      const now = new Date();
      const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const alerts = [];

      trips.forEach(trip => {
        // Check deposit payments
        if (trip.deposit && parseFloat(trip.deposit) > 0 && trip.depositDueDate && !trip.depositPaid) {
          const dueDate = new Date(trip.depositDueDate);

          if (dueDate <= oneWeekFromNow && dueDate >= now) {
            alerts.push({
              type: 'urgent',
              tripName: trip.name,
              amount: parseFloat(trip.deposit),
              dueDate: trip.depositDueDate,
              description: 'Deposit',
              daysUntil: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
            });
          } else if (dueDate <= endOfMonth && dueDate >= now) {
            alerts.push({
              type: 'upcoming',
              tripName: trip.name,
              amount: parseFloat(trip.deposit),
              dueDate: trip.depositDueDate,
              description: 'Deposit',
              daysUntil: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
            });
          }
        }

        // Check monthly payment plan
        if (trip.monthlyPayments && trip.monthlyPayments.length > 0) {
          trip.monthlyPayments.forEach(payment => {
            if (!payment.paid && payment.dueDate) {
              const dueDate = new Date(payment.dueDate);

              if (dueDate <= oneWeekFromNow && dueDate >= now) {
                alerts.push({
                  type: 'urgent',
                  tripName: trip.name,
                  amount: parseFloat(payment.amount),
                  dueDate: payment.dueDate,
                  description: payment.description || 'Payment',
                  daysUntil: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
                });
              } else if (dueDate <= endOfMonth && dueDate >= now) {
                alerts.push({
                  type: 'upcoming',
                  tripName: trip.name,
                  amount: parseFloat(payment.amount),
                  dueDate: payment.dueDate,
                  description: payment.description || 'Payment',
                  daysUntil: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
                });
              }
            }
          });
        }

        // Check custom payments
        if (trip.payments && trip.payments.length > 0) {
          trip.payments.forEach(payment => {
            if (!payment.paid && payment.dueDate) {
              const dueDate = new Date(payment.dueDate);

              if (dueDate <= oneWeekFromNow && dueDate >= now) {
                alerts.push({
                  type: 'urgent',
                  tripName: trip.name,
                  amount: parseFloat(payment.amount),
                  dueDate: payment.dueDate,
                  description: payment.description || 'Payment',
                  daysUntil: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
                });
              } else if (dueDate <= endOfMonth && dueDate >= now) {
                alerts.push({
                  type: 'upcoming',
                  tripName: trip.name,
                  amount: parseFloat(payment.amount),
                  dueDate: payment.dueDate,
                  description: payment.description || 'Payment',
                  daysUntil: Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
                });
              }
            }
          });
        }
      });

      // Sort by due date (soonest first)
      alerts.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setNotifications(alerts);
    };

    checkPayments();
  }, [trips]);

  if (notifications.length === 0) {
    return null;
  }

  const urgentNotifications = notifications.filter(n => n.type === 'urgent');
  const upcomingNotifications = notifications.filter(n => n.type === 'upcoming');

  return (
    <div className="payment-notifications">
      {urgentNotifications.length > 0 && (
        <div className="notification-banner notification-urgent">
          <div className="notification-icon">⚠️</div>
          <div className="notification-content">
            <h4>Urgent: Payments Due This Week!</h4>
            <div className="notification-list">
              {urgentNotifications.map((notif, index) => (
                <div key={index} className="notification-item">
                  <strong>{notif.tripName}</strong> - {notif.description}: {formatCurrency(notif.amount)}
                  <span className="notification-due">
                    {notif.daysUntil === 0 ? 'Due today!' :
                     notif.daysUntil === 1 ? 'Due tomorrow' :
                     `Due in ${notif.daysUntil} days`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {upcomingNotifications.length > 0 && (
        <div className="notification-banner notification-upcoming">
          <div className="notification-icon">📅</div>
          <div className="notification-content">
            <h4>Upcoming Payments This Month</h4>
            <div className="notification-list">
              {upcomingNotifications.map((notif, index) => (
                <div key={index} className="notification-item">
                  <strong>{notif.tripName}</strong> - {notif.description}: {formatCurrency(notif.amount)}
                  <span className="notification-due">Due {formatDate(notif.dueDate)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentNotifications;
