/* ==========================================
Picker Shop V13
admin.js
Part 1
========================================== */
import {
    auth,
    db,
    signInWithEmailAndPassword,
    signOut
} from "./firebase.js";
import { storage } from "./firebase.js";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ==========================================
// Admin Login
// ==========================================

window.adminLogin = async function () {
alert("Login Clicked");
    const email = document.getElementById("adminEmail");
    const password = document.getElementById("adminPassword");

    if (!email || !password) return;

    if (email.value.trim() === "" || password.value.trim() === "") {

        alert("ইমেইল এবং পাসওয়ার্ড লিখুন");

        return;

    }

    try {

        await signInWithEmailAndPassword(

            auth,

            email.value,

            password.value

        );

        localStorage.setItem("pickerAdmin", "true");

        alert("✅ Admin Login Successful");

        window.location.href = "admin-dashboard.html";

    }

    catch (error) {
    console.log(error);
    alert(error.code + "\n\n" + error.message);
 
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
// Load Products From Firestore
// ==========================================
 import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";     
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

        let html = "";

        snapshot.forEach((product) => {

            const data = product.data();

            html += `

            <tr>

                <td>

                    <img
                    src="${data.image}"
             
// ==========================================
// Add Product
// ==========================================

window.addProduct = async function () {

    const name = document.getElementById("productName");
    const price = document.getElementById("productPrice");
    const category = document.getElementById("productCategory");
    const image = document.getElementById("productImage");
    const description = document.getElementById("productDescription");

    if (!name || !price || !category || !image) return;

    if (
        name.value.trim() === "" ||
        price.value.trim() === "" ||
        category.value.trim() === "" ||
        image.value.trim() === ""
    ) {

        alert("সব তথ্য পূরণ করুন");

        return;

    }

    try {

        await addDoc(collection(db, "products"), {

            name: name.value.trim(),
            price: Number(price.value),
            category: category.value.trim(),
            image: image.value.trim(),
            description: description ? description.value.trim() : "",
            stock: 100,
            createdAt: new Date()

        });

        alert("✅ Product সফলভাবে যোগ হয়েছে");

        name.value = "";
        price.value = "";
        category.value = "";
        image.value = "";

        if (description) {

            description.value = "";

        }

        loadProducts();

    }

    catch (error) {

        console.error(error);

        alert("❌ Product Save Failed");

    }

};

// ==========================================
// Reset Form
// ==========================================

window.resetProductForm = function () {

    document.getElementById("productName").value = "";

    document.getElementById("productPrice").value = "";

    document.getElementById("productCategory").value = "";

    document.getElementById("productImage").value = "";

    const description = document.getElementById("productDescription");

    if (description) {

        description.value = "";

    }

};
// ==========================================
// Edit Product
// ==========================================

let editingProductId = null;

window.editProduct = async function(id){

    try{

        const ref = doc(db,"products",id);

        const snap = await getDoc(ref);

        if(!snap.exists()){

            alert("Product পাওয়া যায়নি");

            return;

        }

        const data = snap.data();

        editingProductId = id;

        document.getElementById("productName").value = data.name || "";

        document.getElementById("productPrice").value = data.price || "";

        document.getElementById("productCategory").value = data.category || "";

        document.getElementById("productImage").value = data.image || "";

        const description =
            document.getElementById("productDescription");

        if(description){

            description.value = data.description || "";

        }

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

    catch(error){

        console.error(error);

        alert("Product Load Failed");

    }

};

// ==========================================
// Update Product
// ==========================================

window.updateProduct = async function(){

    if(!editingProductId){

        alert("প্রথমে একটি Product Edit করুন");

        return;

    }

    try{

        await updateDoc(

            doc(db,"products",editingProductId),

            {

                name:document.getElementById("productName").value,

                price:Number(document.getElementById("productPrice").value),

                category:document.getElementById("productCategory").value,

                image:document.getElementById("productImage").value,

                description:
                document.getElementById("productDescription")
                ? document.getElementById("productDescription").value
                : ""

            }

        );

        alert("✅ Product Updated");

        editingProductId = null;

        resetProductForm();

        loadProducts();

    }

    catch(error){

        console.error(error);

        alert("Update Failed");

    }

};

// ==========================================
// Delete Product
// ==========================================

window.deleteProduct = async function(id){

    if(!confirm("এই Product Delete করবেন?")){

        return;

    }

    try{

        await deleteDoc(doc(db,"products",id));

        alert("🗑 Product Deleted");

        loadProducts();

    }

    catch(error){

        console.error(error);

        alert("Delete Failed");

    }

};
// ==========================================
// Product Search
// ==========================================

window.searchProducts = async function () {

    const keyword = document
        .getElementById("searchProduct")
        .value
        .toLowerCase();

    const table = document.getElementById("productTable");

    if (!table) return;

    const snapshot = await getDocs(collection(db, "products"));

    let html = "";

    snapshot.forEach((product) => {

        const data = product.data();

        if (
            data.name.toLowerCase().includes(keyword) ||
            data.category.toLowerCase().includes(keyword)
        ) {

            html += `

            <tr>

                <td>
                    <img src="${data.image}"
                    width="60"
                    height="60"
                    style="border-radius:8px;">
                </td>

                <td>${data.name}</td>

                <td>৳${data.price}</td>

                <td>${data.category}</td>

                <td>

                    <button
                    class="btn"
                    onclick="editProduct('${product.id}')">

                    Edit

                    </button>

                    <button
                    class="wish-btn"
                    onclick="deleteProduct('${product.id}')">

                    Delete

                    </button>

                </td>

            </tr>

            `;

        }

    });

    table.innerHTML = html;

};

// ==========================================
// Dashboard Statistics
// ==========================================

window.loadStatistics = async function () {

    const totalProduct =
        document.getElementById("totalProducts");

    const totalValue =
        document.getElementById("inventoryValue");

    if (!totalProduct || !totalValue) return;

    const snapshot =
        await getDocs(collection(db, "products"));

    let count = 0;

    let value = 0;

    snapshot.forEach((doc) => {

        const p = doc.data();

        count++;

        value += Number(p.price);

    });

    totalProduct.innerHTML = count;

    totalValue.innerHTML = "৳" + value;

};

// ==========================================
// Auto Dashboard
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadStatistics();

});
// ==========================================
// Image Preview
// ==========================================

window.previewImage = function () {

    const input = document.getElementById("productImage");
    const preview = document.getElementById("imagePreview");

    if (!input || !preview) return;

    const url = input.value.trim();

    if (url === "") {

        preview.src = "";
        preview.style.display = "none";
        return;

    }

    preview.src = url;
    preview.style.display = "block";

};

// ==========================================
// Product Validation
// ==========================================

window.validateProduct = function () {

    const name = document.getElementById("productName").value.trim();
    const price = document.getElementById("productPrice").value.trim();
    const category = document.getElementById("productCategory").value.trim();
    const image = document.getElementById("productImage").value.trim();

    if (!name || !price || !category || !image) {

        alert("সব তথ্য পূরণ করুন");

        return false;

    }

    return true;

};
// ==========================================
// Upload Image To Firebase Storage
// ==========================================

window.uploadImage = async function () {

    const fileInput = document.getElementById("productFile");

    if (!fileInput.files.length) {

        alert("একটি ছবি নির্বাচন করুন");

        return;

    }

    const file = fileInput.files[0];

    const imageRef = ref(
        storage,
        "products/" + Date.now() + "_" + file.name
    );

    try {

        await uploadBytes(imageRef, file);

        const url = await getDownloadURL(imageRef);

        document.getElementById("productImage").value = url;

        previewImage();

        alert("✅ Image Upload সফল হয়েছে");

    }

    catch (error) {

        console.error(error);

        alert("❌ Image Upload Failed");

    }

};
