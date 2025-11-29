// LocalStorage utility functions for managing travel data

const STORAGE_KEY = 'travel-planner-2026';

export const loadTrips = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading trips:', error);
    return [];
  }
};

export const saveTrips = (trips) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return true;
  } catch (error) {
    console.error('Error saving trips:', error);
    return false;
  }
};

export const addTrip = (trip) => {
  const trips = loadTrips();
  const newTrip = {
    ...trip,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  trips.push(newTrip);
  saveTrips(trips);
  return newTrip;
};

export const updateTrip = (id, updates) => {
  const trips = loadTrips();
  const index = trips.findIndex(t => t.id === id);
  if (index !== -1) {
    trips[index] = {
      ...trips[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveTrips(trips);
    return trips[index];
  }
  return null;
};

export const deleteTrip = (id) => {
  const trips = loadTrips();
  const filtered = trips.filter(t => t.id !== id);
  saveTrips(filtered);
  return filtered;
};

export const getTripById = (id) => {
  const trips = loadTrips();
  return trips.find(t => t.id === id);
};
