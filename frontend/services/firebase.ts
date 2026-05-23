import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase config from google-services.json (project: ganu-denu-live)
const firebaseConfig = {
  apiKey: 'AIzaSyAHVVftepTGTfDQuKb9LRYQ2bTt-kFH7M',
  authDomain: 'ganu-denu-live.firebaseapp.com',
  projectId: 'ganu-denu-live',
  storageBucket: 'ganu-denu-live.firebasestorage.app',
  messagingSenderId: '829001947256',
  appId: '1:829001947256:android:f48387470baf4ddfdf758d',
};

// Prevent duplicate initialization in Expo hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export default app;
