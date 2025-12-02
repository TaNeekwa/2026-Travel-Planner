// Firebase configuration
// Get these values from your Firebase Console: https://console.firebase.google.com/

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase project configuration
// To get these values:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or select existing)
// 3. Click on "Web" icon to add a web app
// 4. Copy the configuration values below

const firebaseConfig = {
  apiKey: "AIzaSyBVu-om3qs73NaxRe6Mq7eaBpTOrLwYs4g",
  authDomain: "travel-planner-ddac0.firebaseapp.com",
  projectId: "travel-planner-ddac0",
  storageBucket: "travel-planner-ddac0.firebasestorage.app",
  messagingSenderId: "18077106012",
  appId: "1:18077106012:web:706c3ad7135d2df07a8b99",
  measurementId: "G-66Q2WN2FCL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
// Connect to the "test" database (not the default database)
export const db = getFirestore(app, 'test');

export default app;
