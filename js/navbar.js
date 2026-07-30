// ==========================================
// Picker Shop V3
// navbar.js
// Complete File
// ==========================================

import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

window.logout = async function () {

    try {

        await signOut(auth);

        location.href = "login.html";

    }

    catch (error) {

        alert(error.message);

    }

};

onAuthStateChanged(auth, (user) => {

    const guestMenu =
        document.getElementById("guestMenu");

    const userMenu =
        document.getElementById("userMenu");

    const userName =
        document.getElementById("navUserName");

    if (user) {

        if (guestMenu)
            guestMenu.style.display = "none";

        if (userMenu)
            userMenu.style.display = "flex";

        if (userName)
            userName.innerHTML =
                user.displayName || "Customer";

    }

    else {

        if (guestMenu)
            guestMenu.style.display = "flex";

        if (userMenu)
            userMenu.style.display = "none";

    }

});
