 // ==========================================
// Picker Shop V15
// firebase.js
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSHIUE40N17ISOxduOSoaDt2gxtwSxKto",
  authDomain: "picker-shop.firebaseapp.com",
  projectId: "picker-shop",
  storageBucket: "picker-shop.firebasestorage.app",
  messagingSenderId: "841337147537",
  appId: "1:841337147537:web:5bca33f1c004806a4daf30"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  app,
  auth,
  db,
  storage,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
