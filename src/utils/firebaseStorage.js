// Storage utility functions for managing travel data
// Using localStorage for simple, fast, browser-based storage

// Load all trips for the current user
export const loadTrips = async (userId) => {
  try {
    if (!userId) {
      console.warn('No user ID provided to loadTrips');
      return [];
    }

    // Load trips from localStorage
    const storageKey = `trips_${userId}`;
    const trips = JSON.parse(localStorage.getItem(storageKey) || '[]');

    // Sort by created date, newest first
    trips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log('Trips loaded from localStorage:', trips.length);
    return trips;
  } catch (error) {
    console.error('Error loading trips:', error);
    return [];
  }
};

// Save trips (not used in Firebase - we use add/update/delete instead)
export const saveTrips = async (userId, trips) => {
  console.warn('saveTrips is not needed with Firebase. Use addTrip, updateTrip, or deleteTrip instead.');
  return false;
};

// Add a new trip for the current user
export const addTrip = async (userId, trip) => {
  try {
    if (!userId) throw new Error('User ID is required');

    // Use regular timestamps
    const timestamp = new Date().toISOString();
    const tripId = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newTrip = {
      ...trip,
      id: tripId,
      userId: userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Get existing trips from localStorage
    const storageKey = `trips_${userId}`;
    const existingTrips = JSON.parse(localStorage.getItem(storageKey) || '[]');

    // Add new trip
    existingTrips.push(newTrip);

    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(existingTrips));

    console.log('Trip saved to localStorage:', newTrip);
    return newTrip;
  } catch (error) {
    console.error('Error adding trip:', error);
    throw error;
  }
};

// Update an existing trip
export const updateTrip = async (userId, tripId, updates) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!tripId) throw new Error('Trip ID is required');

    // Load trips from localStorage
    const storageKey = `trips_${userId}`;
    const trips = JSON.parse(localStorage.getItem(storageKey) || '[]');

    // Find and update the trip
    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) throw new Error('Trip not found');

    trips[tripIndex] = {
      ...trips[tripIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(trips));

    console.log('Trip updated in localStorage:', trips[tripIndex]);
    return trips[tripIndex];
  } catch (error) {
    console.error('Error updating trip:', error);
    throw error;
  }
};

// Delete a trip
export const deleteTrip = async (userId, tripId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!tripId) throw new Error('Trip ID is required');

    // Load trips from localStorage
    const storageKey = `trips_${userId}`;
    const trips = JSON.parse(localStorage.getItem(storageKey) || '[]');

    // Filter out the trip to delete
    const updatedTrips = trips.filter(t => t.id !== tripId);

    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(updatedTrips));

    console.log('Trip deleted from localStorage');
    return true;
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
};

// Get a specific trip by ID
export const getTripById = async (userId, tripId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!tripId) throw new Error('Trip ID is required');

    // Load trips from localStorage
    const storageKey = `trips_${userId}`;
    const trips = JSON.parse(localStorage.getItem(storageKey) || '[]');

    // Find the trip
    const trip = trips.find(t => t.id === tripId);

    console.log('Trip retrieved from localStorage:', trip);
    return trip || null;
  } catch (error) {
    console.error('Error getting trip:', error);
    return null;
  }
};
