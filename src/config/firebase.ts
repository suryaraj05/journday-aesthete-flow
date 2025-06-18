
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAK74AzvmkX6IhAcK6iW4GBUSLko0TM4kY",
  authDomain: "journday-11c4e.firebaseapp.com",
  projectId: "journday-11c4e",
  storageBucket: "journday-11c4e.firebasestorage.app",
  messagingSenderId: "685832597408",
  appId: "1:685832597408:web:d0a0f5cf7d34e29ac7fec5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Note: The OAuth error is because the current domain is not authorized.
// We're using email/password authentication which doesn't require OAuth setup.
// For production, add your domain to Firebase Console -> Authentication -> Settings -> Authorized domains

export default app;
