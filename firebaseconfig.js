import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB2tipLVpU8V4kfO2tUkOBKgqeDph6qhC4",
  authDomain: "proyectoseis6-f76d3.firebaseapp.com",
  projectId: "proyectoseis6-f76d3",
  storageBucket: "proyectoseis6-f76d3.appspot.com",
  messagingSenderId: "621121829999",
  appId: "1:621121829999:web:608f618ee0abc6c0d8619a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };