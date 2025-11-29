import { calculateAllTripsTotal, calculateAllTripsPaid, formatCurrency, getDaysUntilTrip } from '../utils/calculations';

function TravelStats({ trips }) {
  // Calculate statistics
  const totalTrips = trips.length;
  const totalSpent = calculateAllTripsPaid(trips);
  const totalBudget = calculateAllTripsTotal(trips);
  const averageTripCost = totalTrips > 0 ? totalBudget / totalTrips : 0;

  // Get unique destinations/countries
  const destinations = trips
    .filter(trip => trip.destination)
    .map(trip => trip.destination.toLowerCase().trim())
    .filter((value, index, self) => self.indexOf(value) === index);

  const destinationCount = destinations.length;

  // Find next upcoming trip
  const now = new Date();
  const upcomingTrips = trips
    .filter(trip => new Date(trip.startDate) > now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const nextTrip = upcomingTrips.length > 0 ? upcomingTrips[0] : null;

  // Count trips by status
  const upcomingCount = trips.filter(trip => new Date(trip.startDate) > now).length;
  const completedCount = trips.filter(trip => new Date(trip.endDate) < now).length;
  const activeCount = trips.filter(trip => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return start <= now && end >= now;
  }).length;

  // Count trips by booking status
  const pendingBookingCount = trips.filter(trip => !trip.isBooked).length;

  // Calculate percentage of budget used
  const budgetUsedPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (totalTrips === 0) {
    return (
      <div className="travel-stats">
        <h2>Travel Statistics</h2>
        <div className="stats-empty">
          <p>📊 Your travel statistics will appear here once you add trips!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="travel-stats">
      <h2>Your 2026 Travel Statistics</h2>

      <div className="stats-highlight-grid">
        <div className="stat-highlight stat-primary">
          <div className="stat-highlight-icon">✈️</div>
          <div className="stat-highlight-value">{totalTrips}</div>
          <div className="stat-highlight-label">
            {totalTrips === 1 ? 'Trip' : 'Total Trips'}
          </div>
        </div>

        <div className="stat-highlight stat-success">
          <div className="stat-highlight-icon">🌍</div>
          <div className="stat-highlight-value">{destinationCount}</div>
          <div className="stat-highlight-label">
            {destinationCount === 1 ? 'Destination' : 'Destinations'}
          </div>
        </div>

        <div className="stat-highlight stat-warning">
          <div className="stat-highlight-icon">💰</div>
          <div className="stat-highlight-value">{formatCurrency(totalSpent)}</div>
          <div className="stat-highlight-label">Total Spent</div>
        </div>

        <div className="stat-highlight stat-info">
          <div className="stat-highlight-icon">📈</div>
          <div className="stat-highlight-value">{formatCurrency(averageTripCost)}</div>
          <div className="stat-highlight-label">Avg per Trip</div>
        </div>
      </div>

      <div className="stats-details-grid">
        <div className="stat-detail-card">
          <h4>Trip Status</h4>
          <div className="status-breakdown">
            <div className="status-item">
              <span className="status-dot upcoming"></span>
              <span className="status-label">Upcoming:</span>
              <span className="status-count">{upcomingCount}</span>
            </div>
            <div className="status-item">
              <span className="status-dot active"></span>
              <span className="status-label">Active:</span>
              <span className="status-count">{activeCount}</span>
            </div>
            <div className="status-item">
              <span className="status-dot completed"></span>
              <span className="status-label">Completed:</span>
              <span className="status-count">{completedCount}</span>
            </div>
            <div className="status-item">
              <span className="status-dot pending"></span>
              <span className="status-label">Pending Booking:</span>
              <span className="status-count">{pendingBookingCount}</span>
            </div>
          </div>
        </div>

        {nextTrip && (
          <div className="stat-detail-card next-trip-card">
            <h4>Next Adventure</h4>
            <div className="next-trip-info">
              <div className="next-trip-name">{nextTrip.name}</div>
              <div className="next-trip-destination">📍 {nextTrip.destination}</div>
              <div className="next-trip-countdown">
                ⏱️ {getDaysUntilTrip(nextTrip.startDate)} days away
              </div>
            </div>
          </div>
        )}

        <div className="stat-detail-card">
          <h4>Budget Overview</h4>
          <div className="budget-summary">
            <div className="budget-row">
              <span>Total Budget:</span>
              <span className="budget-amount">{formatCurrency(totalBudget)}</span>
            </div>
            <div className="budget-row">
              <span>Spent:</span>
              <span className="budget-amount spent">{formatCurrency(totalSpent)}</span>
            </div>
            <div className="budget-row">
              <span>Remaining:</span>
              <span className="budget-amount remaining">
                {formatCurrency(totalBudget - totalSpent)}
              </span>
            </div>
          </div>
          <div className="budget-progress-bar">
            <div
              className="budget-progress-fill"
              style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
            ></div>
          </div>
          <div className="budget-percent">{budgetUsedPercent.toFixed(0)}% of budget used</div>
        </div>
      </div>

      {destinationCount > 0 && (
        <div className="destinations-list">
          <h4>Destinations You're Visiting</h4>
          <div className="destination-tags">
            {destinations.map((dest, index) => (
              <span key={index} className="destination-tag">
                {dest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TravelStats;
