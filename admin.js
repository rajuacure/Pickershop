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
// ==========================================
// Dashboard Statistics
// ==========================================

window.loadDashboard = async function () {

    try {

        // Products
        const productSnap = await getDocs(collection(db, "products"));

        // Orders
        const orderSnap = await getDocs(collection(db, "orders"));

        // Users
        const userSnap = await getDocs(collection(db, "users"));

        let totalSales = 0;
        let pendingOrders = 0;
        let completedOrders = 0;

        orderSnap.forEach((docItem) => {

            const order = docItem.data();

            totalSales += Number(order.total || 0);

            if (order.status === "Pending") {
                pendingOrders++;
            }

            if (order.status === "Delivered") {
                completedOrders++;
            }

        });

        // Dashboard Cards
        const totalProducts = document.getElementById("totalProducts");
        const totalOrders = document.getElementById("totalOrders");
        const totalUsers = document.getElementById("totalUsers");
        const totalRevenue = document.getElementById("totalRevenue");
        const pending = document.getElementById("pendingOrders");
        const delivered = document.getElementById("completedOrders");

        if (totalProducts)
            totalProducts.innerHTML = productSnap.size;

        if (totalOrders)
            totalOrders.innerHTML = orderSnap.size;

        if (totalUsers)
            totalUsers.innerHTML = userSnap.size;

        if (totalRevenue)
            totalRevenue.innerHTML = "৳ " + totalSales;

        if (pending)
            pending.innerHTML = pendingOrders;

        if (delivered)
            delivered.innerHTML = completedOrders;

    }

    catch (error) {

        console.error(error);

    }

};


// ==========================================
// Auto Load Dashboard
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("totalProducts")) {

        loadDashboard();

    }

});
