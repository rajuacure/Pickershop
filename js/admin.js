// ==========================================
// Picker Shop V15
// admin.js
// Part 1
// ==========================================

import {
    auth,
    db,
    storage,
    signInWithEmailAndPassword,
    signOut
} from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";


// ==========================================
// Global Variables
// ==========================================

let editingProductId = null;

let uploadedImage = "";


// ==========================================
// Admin Login
// ==========================================

window.adminLogin = async function () {

    const email =
        document.getElementById("adminEmail").value.trim();

    const password =
        document.getElementById("adminPassword").value;

    if (!email || !password) {

        alert("Email এবং Password লিখুন");

        return;

    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("✅ Login Successful");

        location.href = "admin-dashboard.html";

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

};
// ==========================================
// Admin Logout
// ==========================================

window.adminLogout = async function () {

    try {

        await signOut(auth);

        localStorage.removeItem("pickerAdmin");

        window.location.href = "admin-login.html";

    }

    catch (error) {

        console.error(error);

        alert("Logout Failed");

    }

};

// ==========================================
// Check Admin Login
// ==========================================

window.checkAdmin = function () {

    const isLogin = localStorage.getItem("pickerAdmin");

    const currentPage = window.location.pathname;

    // Login Page হলে Check লাগবে না
    if (currentPage.includes("admin-login.html")) {

        return;

    }

    if (!isLogin) {

        alert("প্রথমে Admin Login করুন");

        window.location.href = "admin-login.html";

    }

};

// ==========================================
// Run Authentication Check
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    checkAdmin();

});
// ==========================================
// Upload Product Image
// ==========================================

window.uploadImage = async function () {

    const file = document
        .getElementById("productFile")
        .files[0];

    if (!file) {

        alert("প্রথমে একটি ছবি নির্বাচন করুন");

        return;

    }

    try {

        const fileName =
            Date.now() + "_" + file.name;

        const storageRef = ref(
            storage,
            "products/" + fileName
        );

        await uploadBytes(storageRef, file);

        const downloadURL =
            await getDownloadURL(storageRef);

        uploadedImage = downloadURL;

        document.getElementById("productImage").value =
            downloadURL;

        const preview =
            document.getElementById("previewImage");

        if (preview) {

            preview.src = downloadURL;

            preview.style.display = "block";

        }

        alert("✅ Image Uploaded Successfully");

    }

    catch (error) {

        console.error(error);

        alert("❌ Image Upload Failed");

    }

};

// ==========================================
// Preview Local Image
// ==========================================

window.previewLocalImage = function () {

    const file =
        document.getElementById("productFile").files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        const preview =
            document.getElementById("previewImage");

        if (preview) {

            preview.src = e.target.result;

            preview.style.display = "block";

        }

    };

    reader.readAsDataURL(file);

};
