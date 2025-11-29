import { useState } from 'react';
import WeatherWidget from './WeatherWidget';
import {
  calculateTripTotal,
  calculateTotalPaid,
  calculateRemainingBalance,
  calculateNextPaymentDue,
  formatCurrency,
  formatDate,
} from '../utils/calculations';

function TripDetail({ trip, onBack, onEdit, onDelete, onUpdatePayment }) {
  const [localTrip, setLocalTrip] = useState(trip);

  const total = calculateTripTotal(localTrip);
  const paid = calculateTotalPaid(localTrip);
  const remaining = calculateRemainingBalance(localTrip);
  const nextPayment = calculateNextPaymentDue(localTrip);

  const handleTogglePayment = (paymentType, index) => {
    const updatedTrip = { ...localTrip };

    if (paymentType === 'deposit') {
      updatedTrip.depositPaid = !updatedTrip.depositPaid;
    } else if (paymentType === 'monthly') {
      updatedTrip.monthlyPayments[index].paid = !updatedTrip.monthlyPayments[index].paid;
    } else if (paymentType === 'payment') {
      updatedTrip.payments[index].paid = !updatedTrip.payments[index].paid;
    }

    setLocalTrip(updatedTrip);
    onUpdatePayment(updatedTrip);
  };

  return (
    <div className="trip-detail">
      <div className="detail-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <div className="detail-actions">
          <button className="btn btn-primary" onClick={onEdit}>
            Edit Trip
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${trip.name}"?`)) {
                onDelete();
              }
            }}
          >
            Delete Trip
          </button>
        </div>
      </div>

      <div className="detail-content">
        {/* Main Content Column */}
        <div className="detail-main">
          <div className="detail-hero">
            <h1>{localTrip.name}</h1>
            {localTrip.destination && (
              <p className="destination">📍 {localTrip.destination}</p>
            )}
            <div className="trip-dates">
              <strong>📅 Dates:</strong> {formatDate(localTrip.startDate)} - {formatDate(localTrip.endDate)}
            </div>
            {localTrip.isGroupTrip && (
              <div className="group-trip-badge">
                <span>👥 Group Trip</span>
                {localTrip.groupTripOrganizer && (
                  <span> · Organized by {localTrip.groupTripOrganizer}</span>
                )}
              </div>
            )}
            <div className={`booking-status-badge ${localTrip.isBooked ? 'booked' : 'planning'}`}>
              {localTrip.isBooked ? '✓ Trip Booked' : '📝 Still Planning'}
            </div>
          </div>

          {localTrip.description && (
            <div className="detail-card">
              <h3>✈️ About This Trip</h3>
              <p>{localTrip.description}</p>
            </div>
          )}

          <div className="detail-card">
            <h3>💰 Financial Summary</h3>
            <div className="financial-summary">
              <div className="summary-row">
                <span>Base Trip Cost:</span>
                <span className="amount">{formatCurrency(parseFloat(localTrip.baseCost || 0))}</span>
              </div>
              <div className="summary-row">
                <span>Total Cost:</span>
                <span className="amount total">{formatCurrency(total)}</span>
              </div>
              <div className="summary-row paid-row">
                <span>Total Paid:</span>
                <span className="amount paid">{formatCurrency(paid)}</span>
              </div>
              <div className="summary-row remaining-row">
                <span>Remaining Balance:</span>
                <span className="amount remaining">{formatCurrency(remaining)}</span>
              </div>
            </div>

            {nextPayment && (
              <div className="next-payment-alert">
                <strong>Next Payment Due:</strong> {formatCurrency(nextPayment.amount)} on{' '}
                {formatDate(nextPayment.dueDate)}
              </div>
            )}
          </div>

          {localTrip.deposit && parseFloat(localTrip.deposit) > 0 && (
            <div className="detail-section">
              <h3>Deposit</h3>
              <div className="payment-item">
                <label className="payment-checkbox">
                  <input
                    type="checkbox"
                    checked={localTrip.depositPaid || false}
                    onChange={() => handleTogglePayment('deposit')}
                  />
                  <span>
                    Deposit: {formatCurrency(parseFloat(localTrip.deposit))}
                    {localTrip.depositDueDate && ` (Due: ${formatDate(localTrip.depositDueDate)})`}
                  </span>
                </label>
              </div>
            </div>
          )}

          {localTrip.monthlyPayments && localTrip.monthlyPayments.length > 0 && (
            <div className="detail-section">
              <h3>Monthly Payment Plan</h3>
              <div className="payments-list">
                {localTrip.monthlyPayments.map((payment, index) => (
                  <div key={index} className="payment-item">
                    <label className="payment-checkbox">
                      <input
                        type="checkbox"
                        checked={payment.paid || false}
                        onChange={() => handleTogglePayment('monthly', index)}
                      />
                      <span>
                        {payment.description || `Payment ${index + 1}`}:{' '}
                        {formatCurrency(parseFloat(payment.amount))} - Due:{' '}
                        {formatDate(payment.dueDate)}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {localTrip.flights && localTrip.flights.length > 0 && (
            <div className="detail-section">
              <h3>Flights</h3>
              <div className="items-list">
                {localTrip.flights.map((flight, index) => (
                  <div key={index} className="item-card">
                    <div className="item-header">
                      <strong>
                        {flight.from} → {flight.to}
                      </strong>
                      <span className="amount">{formatCurrency(parseFloat(flight.cost || 0))}</span>
                    </div>
                    {flight.departureDate && (
                      <div className="item-detail">Departure: {formatDate(flight.departureDate)}</div>
                    )}
                    {flight.airline && <div className="item-detail">Airline: {flight.airline}</div>}
                    {flight.flightNumber && (
                      <div className="item-detail">Flight: {flight.flightNumber}</div>
                    )}
                    {flight.seatAssignment && (
                      <div className="item-detail">Seat: {flight.seatAssignment}</div>
                    )}
                    {flight.confirmationNumber && (
                      <div className="item-detail">
                        Confirmation: {flight.confirmationNumber}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {localTrip.hotels && localTrip.hotels.length > 0 && (
            <div className="detail-section">
              <h3>Accommodations</h3>
              <div className="items-list">
                {localTrip.hotels.map((hotel, index) => (
                  <div key={index} className="item-card">
                    <div className="item-header">
                      <strong>{hotel.name}</strong>
                      {!localTrip.includesAccommodation && (
                        <span className="amount">{formatCurrency(parseFloat(hotel.cost || 0))}</span>
                      )}
                    </div>
                    {hotel.location && <div className="item-detail">📍 {hotel.location}</div>}
                    {hotel.checkIn && hotel.checkOut && (
                      <div className="item-detail">
                        {formatDate(hotel.checkIn)} - {formatDate(hotel.checkOut)}
                      </div>
                    )}
                    {hotel.confirmationNumber && (
                      <div className="item-detail">
                        Confirmation: {hotel.confirmationNumber}
                      </div>
                    )}
                    {localTrip.includesAccommodation && (
                      <div className="item-detail included">✓ Included in package</div>
                    )}
                    <div className="item-actions-inline">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          hotel.name + ' ' + (hotel.location || localTrip.destination || '')
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-map"
                      >
                        📍 View on Google Maps
                      </a>
                      {hotel.location && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                            hotel.name + ' ' + hotel.location
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-secondary"
                        >
                          🧭 Get Directions
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {localTrip.itinerary && localTrip.itinerary.length > 0 && (
            <div className="detail-section">
              <h3>Itinerary</h3>
              <div className="itinerary-list">
                {localTrip.itinerary.map((item, index) => (
                  <div key={index} className="itinerary-item">
                    {item.date && (
                      <div className="itinerary-date">{formatDate(item.date)}</div>
                    )}
                    <div className="itinerary-content">
                      <strong>{item.title}</strong>
                      {item.description && <p>{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {localTrip.additionalExpenses && localTrip.additionalExpenses.length > 0 && (
            <div className="detail-section">
              <h3>Additional Expenses</h3>
              <div className="items-list">
                {localTrip.additionalExpenses.map((expense, index) => (
                  <div key={index} className="item-card">
                    <div className="item-header">
                      <strong>{expense.description}</strong>
                      <span className="amount">{formatCurrency(parseFloat(expense.amount))}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {localTrip.travelChecklist && localTrip.travelChecklist.length > 0 && (
            <div className="detail-section">
              <h3>Travel Checklist</h3>
              <div className="checklist">
                {localTrip.travelChecklist.map((item, index) => (
                  <div key={index} className="checklist-item">
                    <div className="checklist-content">
                      <span className={item.completed ? 'task-completed' : 'task-pending'}>
                        {item.completed ? '✅' : '⏳'} {item.task}
                      </span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="task-link"
                        >
                          🔗 Link
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {localTrip.packingList && localTrip.packingList.length > 0 && (
            <div className="detail-section">
              <h3>Packing List</h3>
              <div className="packing-list">
                {localTrip.packingList.map((item, index) => (
                  <div key={index} className="packing-item">
                    <div className="packing-content">
                      <span className={item.packed ? 'item-packed' : 'item-pending'}>
                        {item.packed ? '✅' : '📦'} {item.item}
                      </span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="buy-link"
                        >
                          🛒 Buy
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {localTrip.documents && (
            <div className="detail-section">
              <h3>Travel Documents</h3>
              <div className="documents-grid">
                {localTrip.documents.passportExpiry && (
                  <div className="document-item">
                    <div className="document-label">Passport Expiry</div>
                    <div className="document-value">{formatDate(localTrip.documents.passportExpiry)}</div>
                  </div>
                )}
                {localTrip.documents.visaRequired && (
                  <div className="document-item">
                    <div className="document-label">Visa Required</div>
                    <div className="document-value">
                      Yes - {localTrip.documents.visaStatus || 'Status not set'}
                    </div>
                  </div>
                )}
                {localTrip.documents.travelInsurance && (
                  <div className="document-item">
                    <div className="document-label">Travel Insurance</div>
                    <div className="document-value">
                      Policy: {localTrip.documents.travelInsurance}
                      {localTrip.documents.insuranceProvider && (
                        <span> ({localTrip.documents.insuranceProvider})</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {localTrip.notes && (
            <div className="detail-section">
              <h3>Notes</h3>
              <div className="notes-content">{localTrip.notes}</div>
            </div>
          )}

          {localTrip.photos && localTrip.photos.length > 0 && (
            <div className="detail-section">
              <h3>Photo Gallery</h3>
              <div className="photo-gallery">
                {localTrip.photos.map((photo, index) => (
                  <div key={index} className="photo-item">
                    {photo.url && (
                      <>
                        <img
                          src={photo.url}
                          alt={photo.caption || `Trip photo ${index + 1}`}
                          className="gallery-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="image-error" style={{ display: 'none' }}>
                          Image failed to load
                        </div>
                        {photo.caption && (
                          <div className="photo-caption">{photo.caption}</div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="detail-sidebar">
          {localTrip.destination && (
            <div className="sidebar-card">
              <h3>🌤️ Weather Forecast</h3>
              <WeatherWidget destination={localTrip.destination} startDate={localTrip.startDate} />
            </div>
          )}

          {localTrip.tags && localTrip.tags.length > 0 && (
            <div className="sidebar-card">
              <h3>🏷️ Trip Tags</h3>
              <div className="sidebar-tags">
                {localTrip.tags.map((tag, index) => (
                  <span key={index} className="sidebar-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="sidebar-card">
            <h3>📊 Quick Stats</h3>
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-label">Total Cost</span>
                <span className="stat-value">{formatCurrency(total, localTrip.currency)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Paid</span>
                <span className="stat-value paid">{formatCurrency(paid, localTrip.currency)}</span>
              </div>
              {remaining > 0 && (
                <div className="stat-item">
                  <span className="stat-label">Remaining</span>
                  <span className="stat-value remaining">{formatCurrency(remaining, localTrip.currency)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripDetail;
