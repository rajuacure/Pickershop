// ==========================================
// Picker Shop V3
// firebase.js
// Complete File
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

// ==========================================
// Firebase Config
// ==========================================

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_PROJECT.firebaseapp.com",

    projectId: "YOUR_PROJECT",

    storageBucket: "YOUR_PROJECT.firebasestorage.app",

    messagingSenderId: "XXXXXXXXXXXX",

    appId: "YOUR_APP_ID"

};

// ==========================================
// Initialize Firebase
// ==========================================

const app = initializeApp(firebaseConfig);

// ==========================================
// Export Services
// ==========================================

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
