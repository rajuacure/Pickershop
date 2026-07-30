// ==========================================
// Picker Shop V2
// auth.js
// Phase 2 - Part 7.1
// Complete File
// ==========================================

import {
    auth,
    db
} from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


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

    if (!name || !phone || !email || !password) {

        alert("সব তথ্য পূরণ করুন");

        return;

    }

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        await updateProfile(userCredential.user, {

            displayName: name

        });

        await setDoc(
            doc(db, "users", userCredential.user.uid),
            {

                uid: userCredential.user.uid,

                name,

                phone,

                email,

                createdAt: new Date().toISOString()

            }
        );

        alert("✅ Registration Successful");

        window.location.href = "login.html";

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

        window.location.href = "profile.html";

    }

    catch (error) {

        alert(error.message);

    }

};


// ==========================================
// Logout
// ==========================================

window.logoutUser = async function () {

    await signOut(auth);

    window.location.href = "login.html";

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

        alert(error.message);

    }

};


// ==========================================
// Load Profile
// ==========================================

window.loadProfile = function () {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {

            window.location.href = "login.html";

            return;

        }

        const snap =
            await getDoc(
                doc(db, "users", user.uid)
            );

        if (!snap.exists()) return;

        const data = snap.data();

        const name =
            document.getElementById("profileName");

        const email =
            document.getElementById("profileEmail");

        const phone =
            document.getElementById("profilePhone");

        if (name)
            name.innerHTML = data.name;

        if (email)
            email.innerHTML = data.email;

        if (phone)
            phone.innerHTML = data.phone;

    });

};


// ==========================================
// Login Check
// ==========================================

window.checkLogin = function () {

    onAuthStateChanged(auth, (user) => {

        const loginBtn =
            document.getElementById("loginBtn");

        const profileBtn =
            document.getElementById("profileBtn");

        if (loginBtn && profileBtn) {

            if (user) {

                loginBtn.style.display = "none";

                profileBtn.style.display = "inline-block";

            }

            else {

                loginBtn.style.display = "inline-block";

                profileBtn.style.display = "none";

            }

        }

    });

};


// ==========================================
// Auto Run
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    checkLogin();

});
