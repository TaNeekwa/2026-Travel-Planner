// Utility functions for calculating trip finances

export const calculateTripTotal = (trip) => {
  let total = 0;

  // Add base trip cost if it exists
  if (trip.baseCost) {
    total += parseFloat(trip.baseCost) || 0;
  }

  // Add flight costs
  if (trip.flights && Array.isArray(trip.flights)) {
    trip.flights.forEach(flight => {
      total += parseFloat(flight.cost) || 0;
    });
  }

  // Add hotel costs (if not included in base cost)
  if (!trip.includesAccommodation && trip.hotels && Array.isArray(trip.hotels)) {
    trip.hotels.forEach(hotel => {
      total += parseFloat(hotel.cost) || 0;
    });
  }

  // Add additional expenses
  if (trip.additionalExpenses && Array.isArray(trip.additionalExpenses)) {
    trip.additionalExpenses.forEach(expense => {
      total += parseFloat(expense.amount) || 0;
    });
  }

  return total;
};

export const calculateTotalPaid = (trip) => {
  let paid = 0;

  // Add deposit if paid
  if (trip.deposit && trip.depositPaid) {
    paid += parseFloat(trip.deposit) || 0;
  }

  // Add monthly payments
  if (trip.monthlyPayments && Array.isArray(trip.monthlyPayments)) {
    trip.monthlyPayments.forEach(payment => {
      if (payment.paid) {
        paid += parseFloat(payment.amount) || 0;
      }
    });
  }

  // Add one-time payments
  if (trip.payments && Array.isArray(trip.payments)) {
    trip.payments.forEach(payment => {
      if (payment.paid) {
        paid += parseFloat(payment.amount) || 0;
      }
    });
  }

  return paid;
};

export const calculateRemainingBalance = (trip) => {
  const total = calculateTripTotal(trip);
  const paid = calculateTotalPaid(trip);
  return total - paid;
};

export const calculateNextPaymentDue = (trip) => {
  if (!trip.monthlyPayments || !Array.isArray(trip.monthlyPayments)) {
    return null;
  }

  const unpaidPayments = trip.monthlyPayments
    .filter(payment => !payment.paid)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return unpaidPayments.length > 0 ? unpaidPayments[0] : null;
};

export const calculateAllTripsTotal = (trips) => {
  return trips.reduce((sum, trip) => sum + calculateTripTotal(trip), 0);
};

export const calculateAllTripsPaid = (trips) => {
  return trips.reduce((sum, trip) => sum + calculateTotalPaid(trip), 0);
};

export const getTripsByStatus = (trips) => {
  const now = new Date();

  return {
    upcoming: trips.filter(trip => {
      const startDate = new Date(trip.startDate);
      return startDate > now;
    }),
    active: trips.filter(trip => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      return startDate <= now && endDate >= now;
    }),
    completed: trips.filter(trip => {
      const endDate = new Date(trip.endDate);
      return endDate < now;
    }),
  };
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Countdown timer functions
export const getDaysUntilTrip = (startDate) => {
  if (!startDate) return null;
  const now = new Date();
  const tripDate = new Date(startDate);
  const diffTime = tripDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export const getCountdownText = (startDate) => {
  const days = getDaysUntilTrip(startDate);
  if (days === null) return '';
  if (days === 0) return 'Today!';
  if (days === 1) return '1 day';
  return `${days} days`;
};
