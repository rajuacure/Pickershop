/* ==========================================
Picker Shop V12
Firebase Configuration
========================================== */

// Firebase SDK

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {

getAuth,

signInWithEmailAndPassword,

onAuthStateChanged,

signOut

} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


// ==========================================
// Firebase Config
// ==========================================

const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain: "YOUR_PROJECT.firebaseapp.com",

projectId: "YOUR_PROJECT_ID",

storageBucket: "YOUR_PROJECT.appspot.com",

messagingSenderId: "123456789",

appId: "YOUR_APP_ID"

};


// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// Export

window.auth = auth;

window.signInWithEmailAndPassword = signInWithEmailAndPassword;

window.onAuthStateChanged = onAuthStateChanged;

window.signOut = signOut;
