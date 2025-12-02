// Firebase Firestore storage utility functions
// Now using actual cloud storage with localStorage as backup

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Collection name in Firestore
const TRIPS_COLLECTION = 'trips';

// Helper: Save trips to localStorage as backup
const backupToLocalStorage = (userId, trips) => {
  try {
    const storageKey = `trips_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(trips));
    console.log('✅ Backup saved to localStorage');
  } catch (error) {
    console.error('Failed to backup to localStorage:', error);
  }
};

// Helper: Convert Firestore timestamp to ISO string
const convertTimestamp = (timestamp) => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

// Load all trips for the current user
export const loadTrips = async (userId) => {
  try {
    if (!userId) {
      console.warn('No user ID provided to loadTrips');
      return [];
    }

    console.log('📥 Loading trips from Firestore...');

    // Query trips for this user from Firestore
    const tripsRef = collection(db, TRIPS_COLLECTION);
    const q = query(
      tripsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const trips = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      trips.push({
        ...data,
        id: doc.id,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      });
    });

    console.log(`✅ Loaded ${trips.length} trips from Firestore`);

    // Backup to localStorage
    backupToLocalStorage(userId, trips);

    return trips;
  } catch (error) {
    console.error('❌ Error loading trips from Firestore:', error);

    // Fallback: Try to load from localStorage
    console.log('⚠️ Attempting to load from localStorage backup...');
    try {
      const storageKey = `trips_${userId}`;
      const backup = JSON.parse(localStorage.getItem(storageKey) || '[]');
      console.log(`📦 Loaded ${backup.length} trips from localStorage backup`);
      return backup;
    } catch (backupError) {
      console.error('Failed to load from backup:', backupError);
      return [];
    }
  }
};

// Add a new trip for the current user
export const addTrip = async (userId, trip) => {
  try {
    if (!userId) throw new Error('User ID is required');

    console.log('📤 Adding trip to Firestore...');

    const newTrip = {
      ...trip,
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, TRIPS_COLLECTION), newTrip);

    const addedTrip = {
      ...newTrip,
      id: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('✅ Trip added to Firestore:', docRef.id);

    // Backup to localStorage
    const trips = await loadTrips(userId);

    return addedTrip;
  } catch (error) {
    console.error('❌ Error adding trip:', error);
    throw error;
  }
};

// Update an existing trip
export const updateTrip = async (userId, tripId, updates) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!tripId) throw new Error('Trip ID is required');

    console.log('📝 Updating trip in Firestore...');

    const tripRef = doc(db, TRIPS_COLLECTION, tripId);

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(tripRef, updateData);

    console.log('✅ Trip updated in Firestore');

    // Get updated trip
    const updatedDoc = await getDoc(tripRef);
    const updatedTrip = {
      ...updatedDoc.data(),
      id: updatedDoc.id,
      createdAt: convertTimestamp(updatedDoc.data().createdAt),
      updatedAt: convertTimestamp(updatedDoc.data().updatedAt),
    };

    // Refresh backup
    await loadTrips(userId);

    return updatedTrip;
  } catch (error) {
    console.error('❌ Error updating trip:', error);
    throw error;
  }
};

// Delete a trip
export const deleteTrip = async (userId, tripId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!tripId) throw new Error('Trip ID is required');

    console.log('🗑️ Deleting trip from Firestore...');

    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    await deleteDoc(tripRef);

    console.log('✅ Trip deleted from Firestore');

    // Refresh backup
    await loadTrips(userId);

    return true;
  } catch (error) {
    console.error('❌ Error deleting trip:', error);
    throw error;
  }
};

// Get a specific trip by ID
export const getTripById = async (userId, tripId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!tripId) throw new Error('Trip ID is required');

    console.log('🔍 Getting trip from Firestore...');

    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    const tripDoc = await getDoc(tripRef);

    if (!tripDoc.exists()) {
      console.log('Trip not found');
      return null;
    }

    const trip = {
      ...tripDoc.data(),
      id: tripDoc.id,
      createdAt: convertTimestamp(tripDoc.data().createdAt),
      updatedAt: convertTimestamp(tripDoc.data().updatedAt),
    };

    console.log('✅ Trip retrieved from Firestore');
    return trip;
  } catch (error) {
    console.error('❌ Error getting trip:', error);
    return null;
  }
};

// Export trips data (for manual backup)
export const exportTrips = async (userId) => {
  try {
    const trips = await loadTrips(userId);
    const dataStr = JSON.stringify(trips, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `travel-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    console.log('✅ Trips exported successfully');
  } catch (error) {
    console.error('❌ Error exporting trips:', error);
    throw error;
  }
};
