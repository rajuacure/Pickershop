// ==========================================
// Picker Shop V15
// firebase.js
// ==========================================

// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
  getStorage
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";


// ==========================================
// Firebase Config
// আপনার Firebase Console থেকে কপি করে বসান
// ==========================================

const firebaseConfig = {

  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX",

  authDomain: "your-project.firebaseapp.com",

  projectId: "your-project-id",

  storageBucket: "your-project.firebasestorage.app",

  messagingSenderId: "123456789012",

  appId: "1:123456789012:web:xxxxxxxxxxxxxxxx"

};


// ==========================================
// Initialize Firebase
// ==========================================

const app = initializeApp(firebaseConfig);


// ==========================================
// Firebase Services
// ==========================================

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);


// ==========================================
// Export
// ==========================================

export {

  app,

  auth,

  db,

  storage,

  signInWithEmailAndPassword,

  signOut,

  onAuthStateChanged

};
