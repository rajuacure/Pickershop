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
// ==========================================
// Add Product
// ==========================================

window.addProduct = async function () {

    const name =
        document.getElementById("productName").value.trim();

    const price =
        document.getElementById("productPrice").value;

    const category =
        document.getElementById("productCategory").value.trim();

    const image =
        document.getElementById("productImage").value.trim();

    const description =
        document.getElementById("productDescription").value.trim();

    if (
        name === "" ||
        price === "" ||
        category === "" ||
        image === ""
    ) {

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


// ==========================================
// Reset Product Form
// ==========================================

window.resetProductForm = function () {

    document.getElementById("productName").value = "";

    document.getElementById("productPrice").value = "";

    document.getElementById("productCategory").value = "";

    document.getElementById("productImage").value = "";

    document.getElementById("productDescription").value = "";

    document.getElementById("productFile").value = "";

    uploadedImage = "";

    editingProductId = null;

    const preview =
        document.getElementById("previewImage");

    if (preview) {

        preview.src = "";

        preview.style.display = "none";

    }

};
// ==========================================
// Load Products
// ==========================================

window.loadProducts = async function () {

    const table = document.getElementById("productTable");

    if (!table) return;

    table.innerHTML = `
    <tr>
        <td colspan="5" style="text-align:center;">
            Loading...
        </td>
    </tr>
    `;

    try {

        const snapshot = await getDocs(collection(db, "products"));

        if (snapshot.empty) {

            table.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    কোনো Product পাওয়া যায়নি।
                </td>
            </tr>
            `;

            return;

        }

        table.innerHTML = "";

        snapshot.forEach((docItem) => {

            const product = docItem.data();

            table.innerHTML += `

            <tr>

                <td>

                    <img
                    src="${product.image}"
                    width="60"
                    style="border-radius:8px;">

                </td>

                <td>

                    ${product.name}

                    ${product.featured
                        ? '<br><span style="color:#ffc107;">⭐ Featured</span>'
                        : ''}

                </td>

                <td>

                    ৳${product.price}

                </td>

                <td>

                    ${product.category}

                </td>

                <td>

                    <button
                    class="btn"
                    onclick="editProduct('${docItem.id}')">

                    ✏️ Edit

                    </button>

                    <button
                    class="btn"
                    style="background:#dc3545;margin-left:5px;"
                    onclick="deleteProduct('${docItem.id}')">

                    🗑 Delete

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.error(error);

        alert("❌ Product Load Failed");

    }

};


// ==========================================
// Auto Load Products
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("productTable")) {

        loadProducts();

    }

});
