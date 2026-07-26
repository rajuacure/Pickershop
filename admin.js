/* =====================================
Picker Shop V12
Admin Panel
admin.js
===================================== */

// ==========================
// Admin Login
// ==========================

async function adminLogin(){

    const email =
        document.getElementById("adminEmail");

    const password =
        document.getElementById("adminPassword");

    if(!email || !password) return;

    if(
        email.value.trim()==="" ||
        password.value.trim()===""
    ){

        alert("ইমেইল এবং পাসওয়ার্ড লিখুন");

        return;

    }

    try{

        await signInWithEmailAndPassword(

            auth,

            email.value,

            password.value

        );

        localStorage.setItem(

            "pickerAdmin",

            "true"

        );

        alert("✅ Login Successful");

        window.location =
            "admin-dashboard.html";

    }

    catch(error){

        alert("❌ " + error.message);

    }

}

// ==========================
// Check Admin
// ==========================

function checkAdmin(){

    onAuthStateChanged(auth,function(user){

        if(!user){

            window.location =
                "admin-login.html";

        }

    });

}

// ==========================
// Logout
// ==========================

function adminLogout(){

    signOut(auth)

    .then(function(){

        localStorage.removeItem(

            "pickerAdmin"

        );

        window.location =
            "admin-login.html";

    });

}

// ==========================
// Auto Check
// ==========================

if(

window.location.pathname.includes(

"admin-dashboard"

)

){

    checkAdmin();

}
