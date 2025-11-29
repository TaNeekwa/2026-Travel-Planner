import {
  calculateTripTotal,
  calculateTotalPaid,
  calculateRemainingBalance,
  formatCurrency,
  formatDate,
  getDaysUntilTrip,
  getCountdownText,
} from '../utils/calculations';
import { getLocalTime, getTimezoneOffset } from '../utils/geocoding';
import { formatCurrencyWithUSD } from '../utils/currency';

function TripCard({ trip, onView, onEdit, onDelete }) {
  const total = calculateTripTotal(trip);
  const paid = calculateTotalPaid(trip);
  const remaining = calculateRemainingBalance(trip);
  const percentPaid = total > 0 ? (paid / total) * 100 : 0;

  const getTripStatus = () => {
    const now = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    if (startDate > now) return 'upcoming';
    if (endDate < now) return 'completed';
    return 'active';
  };

  const status = getTripStatus();
  const localTime = trip.destination ? getLocalTime(trip.destination) : null;
  const timezoneOffset = trip.destination ? getTimezoneOffset(trip.destination) : null;

  return (
    <div className={`trip-card trip-card-${status}`} onClick={onView}>
      <div className="trip-card-header">
        <h3>{trip.name}</h3>
        <span className={`status-badge status-${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="trip-card-body">
        <div className="trip-info">
          <div className="info-row">
            <span className="icon">📍</span>
            <span>{trip.destination || 'No destination set'}</span>
          </div>
          <div className="info-row">
            <span className="icon">📅</span>
            <span>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>
          {localTime && (
            <div className="info-row timezone-info">
              <span className="icon">🕐</span>
              <span>
                Local time: {localTime} {timezoneOffset && `(${timezoneOffset})`}
              </span>
            </div>
          )}
          {trip.isGroupTrip && (
            <div className="info-row">
              <span className="icon">👥</span>
              <span>Group Trip</span>
            </div>
          )}
          <div className="info-row">
            <span className={`booking-status-badge ${trip.isBooked ? 'booked' : 'planning'}`}>
              {trip.isBooked ? '✓ Booked' : '📝 Planning'}
            </span>
          </div>
          {status === 'upcoming' && getDaysUntilTrip(trip.startDate) !== null && (
            <div className="countdown-badge">
              <span className="icon">⏱️</span>
              <span className="countdown-text">{getCountdownText(trip.startDate)} away</span>
            </div>
          )}
        </div>

        {trip.tags && trip.tags.length > 0 && (
          <div className="trip-tags">
            {trip.tags.map((tag, index) => (
              <span key={index} className="trip-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="trip-finances">
          <div className="finance-row">
            <span>Total Cost:</span>
            <span className="amount">{formatCurrencyWithUSD(total, trip.currency)}</span>
          </div>
          <div className="finance-row">
            <span>Paid:</span>
            <span className="amount paid">{formatCurrencyWithUSD(paid, trip.currency)}</span>
          </div>
          {remaining > 0 && (
            <div className="finance-row">
              <span>Remaining:</span>
              <span className="amount remaining">{formatCurrencyWithUSD(remaining, trip.currency)}</span>
            </div>
          )}
        </div>

        {total > 0 && (
          <div className="payment-progress">
            <div className="progress-bar-small">
              <div
                className="progress-fill-small"
                style={{ width: `${Math.min(percentPaid, 100)}%` }}
              />
            </div>
            <span className="progress-text">{percentPaid.toFixed(0)}% paid</span>
          </div>
        )}
      </div>

      <div className="trip-card-actions" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-sm btn-secondary" onClick={onEdit}>
          Edit
        </button>
        <button className="btn btn-sm btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TripCard;
