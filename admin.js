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
// ==========================
// Add Product (Temporary)
// ==========================

function addProduct(){

    const name =
    document.getElementById("productName");

    const price =
    document.getElementById("productPrice");

    const category =
    document.getElementById("productCategory");

    const image =
    document.getElementById("productImage");

    const description =
    document.getElementById("productDescription");

    if(
        name.value==="" ||
        price.value===""
    ){

        alert("Product Name এবং Price লিখুন");

        return;

    }

    alert("✅ Product Save Successfully");

    name.value="";
    price.value="";
    category.value="";
    image.value="";
    description.value="";

}
// ==========================================
// Firebase Product Add
// ==========================================

import { db } from "./firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

async function addProduct() {

    const name = document.getElementById("productName").value.trim();
    const price = document.getElementById("productPrice").value.trim();
    const category = document.getElementById("productCategory").value.trim();
    const image = document.getElementById("productImage").value.trim();
    const description = document.getElementById("productDescription").value.trim();

    if (!name || !price || !category || !image) {

        alert("সব তথ্য পূরণ করুন");

        return;

    }

    try {

        await addDoc(collection(db, "products"), {

            name: name,
            price: Number(price),
            category: category,
            image: image,
            description: description,
            stock: 100,
            createdAt: new Date()

        });

        alert("✅ Product সফলভাবে যোগ হয়েছে");

        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productCategory").value = "";
        document.getElementById("productImage").value = "";
        document.getElementById("productDescription").value = "";

    } catch (error) {

        console.error(error);

        alert("❌ Product Save করতে সমস্যা হয়েছে");

    }

}
