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

// বর্তমানে Edit হওয়া Product ID
let editingProductId = null;

// ==========================================
// Admin Login
// ==========================================

window.adminLogin = async function () {

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    if (!email || !password) {

        alert("ইমেইল ও পাসওয়ার্ড লিখুন");

        return;

    }

    try {

        await signInWithEmailAndPassword(auth, email, password);

        localStorage.setItem("pickerAdmin", "true");

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
// ==========================================
// Upload Product Image
// ==========================================

window.uploadImage = async function () {

    const file = document.getElementById("productFile").files[0];

    if (!file) {

        alert("ছবি নির্বাচন করুন");

        return;

    }

    try {

        const fileName = Date.now() + "_" + file.name;

        const storageRef = ref(storage, "products/" + fileName);

        await uploadBytes(storageRef, file);

        const downloadURL = await getDownloadURL(storageRef);

        document.getElementById("productImage").value = downloadURL;

        const preview = document.getElementById("previewImage");

        preview.src = downloadURL;

        preview.style.display = "block";

        alert("✅ Image Uploaded");

    }

    catch (error) {

        console.error(error);

        alert("❌ Image Upload Failed");

    }

};

// ==========================================
// Add Product
// ==========================================

window.addProduct = async function () {

    const name = document.getElementById("productName").value.trim();

    const price = document.getElementById("productPrice").value;

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

            featured: false,

            createdAt: new Date().toISOString()

        });

        alert("✅ Product Added Successfully");

        resetProductForm();

        loadProducts();

    }

    catch (error) {

        console.error(error);

        alert("❌ Product Add Failed");

    }

};
