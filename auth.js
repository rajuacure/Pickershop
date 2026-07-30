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
