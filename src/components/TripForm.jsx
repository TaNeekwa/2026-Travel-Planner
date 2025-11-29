import { useState } from 'react';

function TripForm({ trip, onSave, onCancel }) {
  const defaultFormData = {
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    baseCost: '',
    currency: 'USD',
    tags: [],
    photos: [],
    isGroupTrip: false,
    groupTripOrganizer: '',
    isBooked: false,
    includesAccommodation: false,
    deposit: '',
    depositPaid: false,
    depositDueDate: '',
    monthlyPayments: [],
    flights: [],
    hotels: [],
    itinerary: [],
    additionalExpenses: [],
    travelChecklist: [],
    packingList: [],
    documents: {
      passportExpiry: '',
      visaRequired: false,
      visaStatus: '',
      travelInsurance: '',
      insuranceProvider: '',
    },
    notes: '',
  };

  const [formData, setFormData] = useState(() => {
    if (!trip) return defaultFormData;

    // Merge trip data with defaults to ensure all new fields exist
    return {
      ...defaultFormData,
      ...trip,
      documents: {
        ...defaultFormData.documents,
        ...(trip.documents || {}),
      },
      // Ensure arrays exist
      tags: trip.tags || [],
      photos: trip.photos || [],
      travelChecklist: trip.travelChecklist || [],
      packingList: trip.packingList || [],
      monthlyPayments: trip.monthlyPayments || [],
      flights: trip.flights || [],
      hotels: trip.hotels || [],
      itinerary: trip.itinerary || [],
      additionalExpenses: trip.additionalExpenses || [],
    };
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddMonthlyPayment = () => {
    setFormData({
      ...formData,
      monthlyPayments: [
        ...formData.monthlyPayments,
        { description: '', amount: '', dueDate: '', paid: false },
      ],
    });
  };

  const handleRemoveMonthlyPayment = (index) => {
    setFormData({
      ...formData,
      monthlyPayments: formData.monthlyPayments.filter((_, i) => i !== index),
    });
  };

  const handleMonthlyPaymentChange = (index, field, value) => {
    const updated = [...formData.monthlyPayments];
    updated[index][field] = value;
    setFormData({ ...formData, monthlyPayments: updated });
  };

  const handleAddFlight = () => {
    setFormData({
      ...formData,
      flights: [
        ...formData.flights,
        { from: '', to: '', departureDate: '', airline: '', flightNumber: '', cost: '', confirmationNumber: '', seatAssignment: '' },
      ],
    });
  };

  const handleRemoveFlight = (index) => {
    setFormData({
      ...formData,
      flights: formData.flights.filter((_, i) => i !== index),
    });
  };

  const handleFlightChange = (index, field, value) => {
    const updated = [...formData.flights];
    updated[index][field] = value;
    setFormData({ ...formData, flights: updated });
  };

  const handleAddHotel = () => {
    setFormData({
      ...formData,
      hotels: [
        ...formData.hotels,
        { name: '', location: '', checkIn: '', checkOut: '', cost: '', confirmationNumber: '' },
      ],
    });
  };

  const handleRemoveHotel = (index) => {
    setFormData({
      ...formData,
      hotels: formData.hotels.filter((_, i) => i !== index),
    });
  };

  const handleHotelChange = (index, field, value) => {
    const updated = [...formData.hotels];
    updated[index][field] = value;
    setFormData({ ...formData, hotels: updated });
  };

  const handleAddItineraryItem = () => {
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { date: '', title: '', description: '' }],
    });
  };

  const handleRemoveItineraryItem = (index) => {
    setFormData({
      ...formData,
      itinerary: formData.itinerary.filter((_, i) => i !== index),
    });
  };

  const handleItineraryChange = (index, field, value) => {
    const updated = [...formData.itinerary];
    updated[index][field] = value;
    setFormData({ ...formData, itinerary: updated });
  };

  const handleAddExpense = () => {
    setFormData({
      ...formData,
      additionalExpenses: [...formData.additionalExpenses, { description: '', amount: '' }],
    });
  };

  const handleRemoveExpense = (index) => {
    setFormData({
      ...formData,
      additionalExpenses: formData.additionalExpenses.filter((_, i) => i !== index),
    });
  };

  const handleExpenseChange = (index, field, value) => {
    const updated = [...formData.additionalExpenses];
    updated[index][field] = value;
    setFormData({ ...formData, additionalExpenses: updated });
  };

  // Travel Checklist handlers
  const handleAddChecklistItem = () => {
    setFormData({
      ...formData,
      travelChecklist: [...formData.travelChecklist, { task: '', completed: false, link: '' }],
    });
  };

  const handleRemoveChecklistItem = (index) => {
    setFormData({
      ...formData,
      travelChecklist: formData.travelChecklist.filter((_, i) => i !== index),
    });
  };

  const handleChecklistChange = (index, field, value) => {
    const updated = [...formData.travelChecklist];
    updated[index][field] = value;
    setFormData({ ...formData, travelChecklist: updated });
  };

  // Packing List handlers
  const handleAddPackingItem = () => {
    setFormData({
      ...formData,
      packingList: [...formData.packingList, { item: '', packed: false, link: '' }],
    });
  };

  const handleRemovePackingItem = (index) => {
    setFormData({
      ...formData,
      packingList: formData.packingList.filter((_, i) => i !== index),
    });
  };

  const handlePackingChange = (index, field, value) => {
    const updated = [...formData.packingList];
    updated[index][field] = value;
    setFormData({ ...formData, packingList: updated });
  };

  // Document handlers
  const handleDocumentChange = (field, value) => {
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [field]: value,
      },
    });
  };

  // Tag handlers
  const handleAddTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  // Photo handlers
  const handleAddPhoto = () => {
    setFormData({
      ...formData,
      photos: [...formData.photos, { url: '', caption: '' }],
    });
  };

  const handleRemovePhoto = (index) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index),
    });
  };

  const handlePhotoChange = (index, field, value) => {
    const updated = [...formData.photos];
    updated[index][field] = value;
    setFormData({ ...formData, photos: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert('Please fill in the required fields: Trip Name, Start Date, and End Date');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="trip-form">
      <div className="form-header">
        <h2>{trip ? 'Edit Trip' : 'Add New Trip'}</h2>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label htmlFor="name">
              Trip Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Tokyo Adventure 2026"
            />
          </div>

          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g., Tokyo, Japan"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">
                Start Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">
                End Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Brief description of the trip..."
            />
          </div>

          <div className="form-group">
            <label>Trip Tags/Categories</label>
            <div className="tags-selector">
              {['Leisure', 'Business', 'Family', 'Solo', 'Adventure', 'Beach', 'City', 'Cultural', 'Food', 'Nature', 'Romantic', 'Budget'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-btn ${formData.tags.includes(tag) ? 'active' : ''}`}
                  onClick={() => {
                    if (formData.tags.includes(tag)) {
                      handleRemoveTag(tag);
                    } else {
                      handleAddTag(tag);
                    }
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
            {formData.tags.length > 0 && (
              <div className="selected-tags">
                <small>Selected: </small>
                {formData.tags.map(tag => (
                  <span key={tag} className="tag-chip">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isGroupTrip"
                checked={formData.isGroupTrip}
                onChange={handleChange}
              />
              <span>This is a group trip</span>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isBooked"
                checked={formData.isBooked}
                onChange={handleChange}
              />
              <span>Trip is booked (not just planning)</span>
            </label>
          </div>

          {formData.isGroupTrip && (
            <div className="form-group">
              <label htmlFor="groupTripOrganizer">Organized By</label>
              <input
                type="text"
                id="groupTripOrganizer"
                name="groupTripOrganizer"
                value={formData.groupTripOrganizer}
                onChange={handleChange}
                placeholder="e.g., Travel Company Name"
              />
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Cost & Budget</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="baseCost">Base Trip Cost</label>
              <input
                type="number"
                id="baseCost"
                name="baseCost"
                value={formData.baseCost}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
              />
              <small>The main cost of the trip package or total estimated cost</small>
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="USD">USD - US Dollar ($)</option>
                <option value="GBP">GBP - British Pound (£)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="JPY">JPY - Japanese Yen (¥)</option>
                <option value="CNY">CNY - Chinese Yuan</option>
                <option value="MXN">MXN - Mexican Peso</option>
                <option value="BRL">BRL - Brazilian Real</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
              <small>Currency for all costs in this trip</small>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="includesAccommodation"
                checked={formData.includesAccommodation}
                onChange={handleChange}
              />
              <span>Base cost includes accommodation</span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Deposit</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="deposit">Deposit Amount</label>
              <input
                type="number"
                id="deposit"
                name="deposit"
                value={formData.deposit}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="depositDueDate">Deposit Due Date</label>
              <input
                type="date"
                id="depositDueDate"
                name="depositDueDate"
                value={formData.depositDueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {formData.deposit && parseFloat(formData.deposit) > 0 && (
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="depositPaid"
                  checked={formData.depositPaid}
                  onChange={handleChange}
                />
                <span>Deposit has been paid</span>
              </label>
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Monthly Payment Plan</h3>
          <p className="section-description">
            Track installment payments for group trips or payment plans
          </p>

          {formData.monthlyPayments.map((payment, index) => (
            <div key={index} className="dynamic-item">
              <div className="form-row">
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={payment.description}
                    onChange={(e) =>
                      handleMonthlyPaymentChange(index, 'description', e.target.value)
                    }
                    placeholder={`Payment ${index + 1}`}
                  />
                </div>

                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={payment.amount}
                    onChange={(e) => handleMonthlyPaymentChange(index, 'amount', e.target.value)}
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={payment.dueDate}
                    onChange={(e) => handleMonthlyPaymentChange(index, 'dueDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="item-actions">
                <label className="checkbox-inline">
                  <input
                    type="checkbox"
                    checked={payment.paid}
                    onChange={(e) => handleMonthlyPaymentChange(index, 'paid', e.target.checked)}
                  />
                  <span>Paid</span>
                </label>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveMonthlyPayment(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={handleAddMonthlyPayment}>
            + Add Monthly Payment
          </button>
        </div>

        <div className="form-section">
          <h3>Flights</h3>

          {formData.flights.map((flight, index) => (
            <div key={index} className="dynamic-item">
              <div className="form-row">
                <div className="form-group">
                  <label>From</label>
                  <input
                    type="text"
                    value={flight.from}
                    onChange={(e) => handleFlightChange(index, 'from', e.target.value)}
                    placeholder="Airport/City"
                  />
                </div>

                <div className="form-group">
                  <label>To</label>
                  <input
                    type="text"
                    value={flight.to}
                    onChange={(e) => handleFlightChange(index, 'to', e.target.value)}
                    placeholder="Airport/City"
                  />
                </div>

                <div className="form-group">
                  <label>Departure Date</label>
                  <input
                    type="date"
                    value={flight.departureDate}
                    onChange={(e) => handleFlightChange(index, 'departureDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Airline</label>
                  <input
                    type="text"
                    value={flight.airline}
                    onChange={(e) => handleFlightChange(index, 'airline', e.target.value)}
                    placeholder="Airline name"
                  />
                </div>

                <div className="form-group">
                  <label>Flight Number</label>
                  <input
                    type="text"
                    value={flight.flightNumber || ''}
                    onChange={(e) => handleFlightChange(index, 'flightNumber', e.target.value)}
                    placeholder="e.g., AA123"
                  />
                </div>

                <div className="form-group">
                  <label>Seat Assignment</label>
                  <input
                    type="text"
                    value={flight.seatAssignment || ''}
                    onChange={(e) => handleFlightChange(index, 'seatAssignment', e.target.value)}
                    placeholder="e.g., 12A"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cost</label>
                  <input
                    type="number"
                    value={flight.cost}
                    onChange={(e) => handleFlightChange(index, 'cost', e.target.value)}
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Confirmation #</label>
                  <input
                    type="text"
                    value={flight.confirmationNumber}
                    onChange={(e) =>
                      handleFlightChange(index, 'confirmationNumber', e.target.value)
                    }
                    placeholder="Confirmation number"
                  />
                </div>
              </div>

              <div className="item-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveFlight(index)}
                >
                  Remove Flight
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={handleAddFlight}>
            + Add Flight
          </button>
        </div>

        <div className="form-section">
          <h3>Accommodations</h3>

          {formData.hotels.map((hotel, index) => (
            <div key={index} className="dynamic-item">
              <div className="form-row">
                <div className="form-group">
                  <label>Hotel Name</label>
                  <input
                    type="text"
                    value={hotel.name}
                    onChange={(e) => handleHotelChange(index, 'name', e.target.value)}
                    placeholder="Hotel name"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={hotel.location}
                    onChange={(e) => handleHotelChange(index, 'location', e.target.value)}
                    placeholder="City/Area"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Check-in</label>
                  <input
                    type="date"
                    value={hotel.checkIn}
                    onChange={(e) => handleHotelChange(index, 'checkIn', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Check-out</label>
                  <input
                    type="date"
                    value={hotel.checkOut}
                    onChange={(e) => handleHotelChange(index, 'checkOut', e.target.value)}
                  />
                </div>

                {!formData.includesAccommodation && (
                  <div className="form-group">
                    <label>Cost</label>
                    <input
                      type="number"
                      value={hotel.cost}
                      onChange={(e) => handleHotelChange(index, 'cost', e.target.value)}
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Confirmation #</label>
                <input
                  type="text"
                  value={hotel.confirmationNumber}
                  onChange={(e) => handleHotelChange(index, 'confirmationNumber', e.target.value)}
                  placeholder="Confirmation number"
                />
              </div>

              <div className="item-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveHotel(index)}
                >
                  Remove Hotel
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={handleAddHotel}>
            + Add Hotel
          </button>
        </div>

        <div className="form-section">
          <h3>Itinerary</h3>

          {formData.itinerary.map((item, index) => (
            <div key={index} className="dynamic-item">
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) => handleItineraryChange(index, 'date', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Activity/Event</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                    placeholder="Activity name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={item.description}
                  onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                  rows="2"
                  placeholder="Details about this activity..."
                />
              </div>

              <div className="item-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveItineraryItem(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={handleAddItineraryItem}>
            + Add Itinerary Item
          </button>
        </div>

        <div className="form-section">
          <h3>Additional Expenses</h3>

          {formData.additionalExpenses.map((expense, index) => (
            <div key={index} className="dynamic-item">
              <div className="form-row">
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={expense.description}
                    onChange={(e) => handleExpenseChange(index, 'description', e.target.value)}
                    placeholder="e.g., Travel insurance, visa fees"
                  />
                </div>

                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="item-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveExpense(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={handleAddExpense}>
            + Add Expense
          </button>
        </div>

        <div className="form-section">
          <h3>Travel Checklist</h3>
          <p className="section-description">
            Pre-trip tasks and reminders (e.g., book flights, get visa, renew passport)
          </p>

          {formData.travelChecklist.map((item, index) => (
            <div key={index} className="dynamic-item">
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Task</label>
                  <input
                    type="text"
                    value={item.task}
                    onChange={(e) => handleChecklistChange(index, 'task', e.target.value)}
                    placeholder="e.g., Apply for visa"
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label>Link (optional)</label>
                  <input
                    type="url"
                    value={item.link}
                    onChange={(e) => handleChecklistChange(index, 'link', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="item-actions">
                <label className="checkbox-inline">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) =>
                      handleChecklistChange(index, 'completed', e.target.checked)
                    }
                  />
                  <span>Completed</span>
                </label>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveChecklistItem(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={handleAddChecklistItem}>
            + Add Checklist Item
          </button>
        </div>

        <div className="form-section">
          <h3>Packing List</h3>
          <p className="section-description">
            Items to pack (add links to buy items you need)
          </p>

          {formData.packingList.map((item, index) => (
            <div key={index} className="dynamic-item">
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Item</label>
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => handlePackingChange(index, 'item', e.target.value)}
                    placeholder="e.g., Sunscreen, Camera"
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label>Buy Link (optional)</label>
                  <input
                    type="url"
                    value={item.link}
                    onChange={(e) => handlePackingChange(index, 'link', e.target.value)}
                    placeholder="https://amazon.com/..."
                  />
                </div>
              </div>

              <div className="item-actions">
                <label className="checkbox-inline">
                  <input
                    type="checkbox"
                    checked={item.packed}
                    onChange={(e) => handlePackingChange(index, 'packed', e.target.checked)}
                  />
                  <span>Packed</span>
                </label>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemovePackingItem(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={handleAddPackingItem}>
            + Add Packing Item
          </button>
        </div>

        <div className="form-section">
          <h3>Travel Documents</h3>
          <p className="section-description">
            Track important travel documents and requirements
          </p>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="passportExpiry">Passport Expiry Date</label>
              <input
                type="date"
                id="passportExpiry"
                value={formData.documents.passportExpiry}
                onChange={(e) => handleDocumentChange('passportExpiry', e.target.value)}
              />
              <small>Many countries require 6 months validity</small>
            </div>

            <div className="form-group">
              <label htmlFor="travelInsurance">Travel Insurance Policy #</label>
              <input
                type="text"
                id="travelInsurance"
                value={formData.documents.travelInsurance}
                onChange={(e) => handleDocumentChange('travelInsurance', e.target.value)}
                placeholder="Policy number"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="insuranceProvider">Insurance Provider</label>
              <input
                type="text"
                id="insuranceProvider"
                value={formData.documents.insuranceProvider}
                onChange={(e) => handleDocumentChange('insuranceProvider', e.target.value)}
                placeholder="Provider name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="visaStatus">Visa Status</label>
              <select
                id="visaStatus"
                value={formData.documents.visaStatus}
                onChange={(e) => handleDocumentChange('visaStatus', e.target.value)}
              >
                <option value="">Select status</option>
                <option value="not-required">Not Required</option>
                <option value="pending">Pending/To Apply</option>
                <option value="approved">Approved</option>
                <option value="visa-free">Visa Free</option>
              </select>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.documents.visaRequired}
                onChange={(e) => handleDocumentChange('visaRequired', e.target.checked)}
              />
              <span>Visa required for this destination</span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Photo Gallery</h3>
          <p className="section-description">
            Add photos or inspiration images for your trip (enter image URLs)
          </p>

          {formData.photos.map((photo, index) => (
            <div key={index} className="dynamic-item">
              <div className="form-row">
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={photo.url}
                    onChange={(e) => handlePhotoChange(index, 'url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <small>Paste a URL to an image online</small>
                </div>

                <div className="form-group">
                  <label>Caption (Optional)</label>
                  <input
                    type="text"
                    value={photo.caption}
                    onChange={(e) => handlePhotoChange(index, 'caption', e.target.value)}
                    placeholder="Photo description"
                  />
                </div>
              </div>

              <div className="item-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemovePhoto(index)}
                >
                  Remove Photo
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={handleAddPhoto}>
            + Add Photo
          </button>
        </div>

        <div className="form-section">
          <h3>Notes</h3>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Any other information about this trip..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg">
            {trip ? 'Update Trip' : 'Create Trip'}
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TripForm;
