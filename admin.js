// ==========================================
// Picker Shop V16
// admin.js
// Part 1
// ==========================================

// Firebase Config
import {
    auth,
    db,
    storage
} from "./firebase.js";

// Firebase Auth
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Firestore
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Storage
import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";


// ==========================================
// Global Variables
// ==========================================

let editingProductId = null;
let uploadedImageURL = "";


// ==========================================
// Admin Login
// ==========================================

window.adminLogin = async function () {

    const email =
        document.getElementById("adminEmail").value.trim();

    const password =
        document.getElementById("adminPassword").value;

    if (email === "" || password === "") {

        alert("Email এবং Password দিন");

        return;

    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("✅ Login Successful");

        window.location.href =
            "admin-dashboard.html";

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

};


// ==========================================
// Logout
// ==========================================

window.adminLogout = async function () {

    try {

        await signOut(auth);

        window.location.href =
            "admin-login.html";

    }

    catch (error) {

        console.error(error);

    }

};


// ==========================================
// Protect Admin Pages
// ==========================================

onAuthStateChanged(auth, (user) => {

    const isLoginPage =
        location.pathname.includes("admin-login.html");

    if (!user && !isLoginPage) {

        window.location.href =
            "admin-login.html";

    }

});
