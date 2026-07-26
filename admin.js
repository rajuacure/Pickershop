/* ==========================================
Picker Shop V13
admin.js
Part 1
========================================== */

import {
    auth,
    db,
    signInWithEmailAndPassword,
    signOut
} from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ==========================================
// Admin Login
// ==========================================

window.adminLogin = async function () {

    const email = document.getElementById("adminEmail");
    const password = document.getElementById("adminPassword");

    if (!email || !password) return;

    if (email.value.trim() === "" || password.value.trim() === "") {

        alert("ইমেইল এবং পাসওয়ার্ড লিখুন");

        return;

    }

    try {

        await signInWithEmailAndPassword(

            auth,

            email.value,

            password.value

        );

        localStorage.setItem("pickerAdmin", "true");

        alert("✅ Admin Login Successful");

        window.location.href = "admin-dashboard.html";

    }

    catch (error) {

        alert(error.message);

    }

};

// ==========================================
// Logout
// ==========================================

window.adminLogout = async function () {

    await signOut(auth);

    localStorage.removeItem("pickerAdmin");

    window.location.href = "admin-login.html";

};
