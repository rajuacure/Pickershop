// ==========================================
// Picker Shop V3
// auth.js
// Complete File
// Segment 1
// ==========================================

import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ==========================================
// Current User
// ==========================================

let currentUser = null;

// ==========================================
// Register
// ==========================================

window.registerUser = async function () {

    const name =
        document.getElementById("registerName").value.trim();

    const phone =
        document.getElementById("registerPhone").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const confirm =
        document.getElementById("registerConfirmPassword").value;

    if (
        !name ||
        !phone ||
        !email ||
        !password
    ) {

        alert("সব তথ্য পূরণ করুন");

        return;

    }

    if (password !== confirm) {

        alert("Password মিলছে না");

        return;

    }

    try {

        const userCredential =

            await createUserWithEmailAndPassword(

                auth,

                email,

                password

            );

        await updateProfile(

            userCredential.user,

            {

                displayName: name

            }

        );

        await setDoc(

            doc(db, "users", userCredential.user.uid),

            {

                uid: userCredential.user.uid,

                name,

                phone,

                email,

                role: "customer",

                createdAt: serverTimestamp()

            }

        );

        alert("✅ Registration Successful");

        location.href = "login.html";

    }

    catch (error) {

        alert(error.message);

    }

};

// ==========================================
// Login
// ==========================================

window.loginUser = async function () {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    if (!email || !password) {

        alert("Email ও Password দিন");

        return;

    }

    try {

        await signInWithEmailAndPassword(

            auth,

            email,

            password

        );

        alert("✅ Login Successful");

        location.href = "profile.html";

    }

    catch (error) {

        alert(error.message);

    }

};
// ==========================================
// Logout
// ==========================================

window.logoutUser = async function () {

    try {

        await signOut(auth);

        alert("✅ Logout Successful");

        location.href = "login.html";

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

};


// ==========================================
// Forgot Password
// ==========================================

window.resetPassword = async function () {

    const email =
        document.getElementById("resetEmail").value.trim();

    if (!email) {

        alert("Email লিখুন");

        return;

    }

    try {

        await sendPasswordResetEmail(

            auth,

            email

        );

        alert("✅ Password Reset Email পাঠানো হয়েছে");

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

};


// ==========================================
// Auth State
// ==========================================

onAuthStateChanged(auth, async (user) => {

    currentUser = user;

    if (!user) {

        updateNavbar(null);

        return;

    }

    try {

        const snap = await getDoc(

            doc(db, "users", user.uid)

        );

        if (snap.exists()) {

            updateNavbar(snap.data());

        }

        else {

            updateNavbar({

                name: user.displayName || "Customer"

            });

        }

    }

    catch (error) {

        console.error(error);

    }

});


// ==========================================
// Navbar
// ==========================================

function updateNavbar(user) {

    const loginBtn =
        document.getElementById("loginBtn");

    const profileBtn =
        document.getElementById("profileBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const userName =
        document.getElementById("userName");

    if (!loginBtn) return;

    if (user) {

        loginBtn.style.display = "none";

        if (profileBtn)
            profileBtn.style.display = "inline-block";

        if (logoutBtn)
            logoutBtn.style.display = "inline-block";

        if (userName)
            userName.innerHTML =
                "👋 " + (user.name || "Customer");

    }

    else {

        loginBtn.style.display = "inline-block";

        if (profileBtn)
            profileBtn.style.display = "none";

        if (logoutBtn)
            logoutBtn.style.display = "none";

        if (userName)
            userName.innerHTML = "";

    }

}
// ==========================================
// Picker Shop V3
// auth.js
// Segment 3
// Profile + Protected Pages
// ==========================================


// ==========================================
// Load Profile
// ==========================================

window.loadProfile = async function () {

    if (!currentUser) {

        location.href = "login.html";

        return;

    }

    try {

        const snap = await getDoc(

            doc(db, "users", currentUser.uid)

        );

        if (!snap.exists()) return;

        const user = snap.data();

        if (document.getElementById("profileName"))
            document.getElementById("profileName").value =
                user.name || "";

        if (document.getElementById("profilePhone"))
            document.getElementById("profilePhone").value =
                user.phone || "";

        if (document.getElementById("profileEmail"))
            document.getElementById("profileEmail").value =
                user.email || "";

    }

    catch (error) {

        console.error(error);

        alert("Profile Load Failed");

    }

};


// ==========================================
// Update Profile
// ==========================================

window.updateUserProfile = async function () {

    if (!currentUser) return;

    const name =
        document.getElementById("profileName").value.trim();

    const phone =
        document.getElementById("profilePhone").value.trim();

    try {

        await updateProfile(

            currentUser,

            {

                displayName: name

            }

        );

        await updateDoc(

            doc(db, "users", currentUser.uid),

            {

                name,

                phone

            }

        );

        alert("✅ Profile Updated Successfully");

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

};


// ==========================================
// Protect Pages
// ==========================================

window.protectPage = function () {

    onAuthStateChanged(auth, (user) => {

        if (!user) {

            alert("প্রথমে Login করুন");

            location.href = "login.html";

        }

    });

};


// ==========================================
// Auto Load Profile
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("profileName")) {

        loadProfile();

    }

});
// ==========================================
// Picker Shop V3
// auth.js
// Segment 4 (Final)
// ==========================================

// ==========================================
// Get Current User
// ==========================================

window.getCurrentUser = function () {

    return currentUser;

};


// ==========================================
// Check Admin
// ==========================================

window.isAdmin = async function () {

    if (!currentUser) return false;

    try {

        const snap = await getDoc(

            doc(db, "users", currentUser.uid)

        );

        if (!snap.exists()) return false;

        return snap.data().role === "admin";

    }

    catch (error) {

        console.error(error);

        return false;

    }

};


// ==========================================
// Check Customer
// ==========================================

window.isCustomer = async function () {

    if (!currentUser) return false;

    try {

        const snap = await getDoc(

            doc(db, "users", currentUser.uid)

        );

        if (!snap.exists()) return false;

        return snap.data().role === "customer";

    }

    catch (error) {

        console.error(error);

        return false;

    }

};


// ==========================================
// Protect Admin Page
// ==========================================

window.protectAdmin = async function () {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {

            location.href = "login.html";

            return;

        }

        const admin = await isAdmin();

        if (!admin) {

            alert("Admin Access Only");

            location.href = "index.html";

        }

    });

};


// ==========================================
// Protect Customer Page
// ==========================================

window.protectCustomer = function () {

    onAuthStateChanged(auth, (user) => {

        if (!user) {

            location.href = "login.html";

        }

    });

};


// ==========================================
// Auto Restore Session
// ==========================================

window.restoreSession = function () {

    onAuthStateChanged(auth, (user) => {

        currentUser = user || null;

    });

};


// ==========================================
// Initialize Auth
// ==========================================

window.initializeAuth = function () {

    restoreSession();

    checkLogin();

};


// ==========================================
// Auto Initialize
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeAuth();

});
