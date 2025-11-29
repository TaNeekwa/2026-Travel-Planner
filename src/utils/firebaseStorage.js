// Firebase Firestore utility functions for managing travel data
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Get the trips collection reference for a specific user
const getTripsCollection = (userId) => {
  if (!userId) throw new Error('User ID is required');
  return collection(db, 'users', userId, 'trips');
};

// Load all trips for the current user
export const loadTrips = async (userId) => {
  try {
    if (!userId) {
      console.warn('No user ID provided to loadTrips');
      return [];
    }

    // Use flat collection structure and filter by userId
    const tripsCollection = collection(db, 'trips');
    const q = query(
      tripsCollection,
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const trips = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Only include trips for this user
      if (data.userId === userId) {
        trips.push({
          id: doc.id,
          ...data,
        });
      }
    });

    return trips;
  } catch (error) {
    console.error('Error loading trips from Firebase:', error);
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

    console.log('Firebase addTrip - userId:', userId);
    console.log('Firebase addTrip - trip data:', trip);
    console.log('Firebase addTrip - db object:', db);

    // Use regular timestamps instead of serverTimestamp() to avoid hanging
    const timestamp = new Date().toISOString();
    const newTrip = {
      ...trip,
      userId: userId, // Add userId to the document
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    console.log('Firebase addTrip - newTrip object:', newTrip);

    // Try using a flat collection structure instead of subcollections
    // This helps isolate if the issue is with subcollections
    const tripsCollection = collection(db, 'trips');
    console.log('Firebase addTrip - collection path: trips (flat structure)');
    console.log('Firebase addTrip - about to call addDoc...');

    const docRef = await addDoc(tripsCollection, newTrip);
    console.log('Firebase addTrip - SUCCESS! docRef created:', docRef.id);

    // Return the trip with the new ID
    return {
      id: docRef.id,
      ...newTrip,
    };
  } catch (error) {
    console.error('Error adding trip to Firebase:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

// Update an existing trip
export const updateTrip = async (userId, tripId, updates) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!tripId) throw new Error('Trip ID is required');

    // Use flat collection structure
    const tripRef = doc(db, 'trips', tripId);

    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(tripRef, updateData);

    // Return the updated trip
    return {
      id: tripId,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error updating trip in Firebase:', error);
    throw error;
  }
};

// Delete a trip
export const deleteTrip = async (userId, tripId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!tripId) throw new Error('Trip ID is required');

    // Use flat collection structure
    const tripRef = doc(db, 'trips', tripId);
    await deleteDoc(tripRef);

    return true;
  } catch (error) {
    console.error('Error deleting trip from Firebase:', error);
    throw error;
  }
};

// Get a specific trip by ID
export const getTripById = async (userId, tripId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!tripId) throw new Error('Trip ID is required');

    // Use flat collection structure
    const tripRef = doc(db, 'trips', tripId);
    const docSnap = await getDoc(tripRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Verify this trip belongs to the user
      if (data.userId === userId) {
        return {
          id: docSnap.id,
          ...data,
        };
      } else {
        return null; // Trip doesn't belong to this user
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting trip from Firebase:', error);
    return null;
  }
};
