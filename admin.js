// ==========================================
// Picker Shop V14
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
// Admin Login
// ==========================================

window.adminLogin = async function () {

    const email = document.getElementById("adminEmail");

    const password = document.getElementById("adminPassword");

    if (!email || !password) return;

    if (
        email.value.trim() === "" ||
        password.value.trim() === ""
    ) {

        alert("ইমেইল এবং পাসওয়ার্ড লিখুন");

        return;

    }

    try {

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

        window.location.href =
            "admin-dashboard.html";

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

    localStorage.removeItem(

        "pickerAdmin"

    );

    window.location.href =
        "admin-login.html";

};
// ==========================================
// Image Upload (Firebase Storage)
// ==========================================

window.uploadImage = async function () {

    const fileInput = document.getElementById("productFile");

    if (!fileInput || fileInput.files.length === 0) {

        alert("প্রথমে একটি ছবি নির্বাচন করুন");

        return;

    }

    const file = fileInput.files[0];

    try {

        const fileName = Date.now() + "_" + file.name;

        const storageRef = ref(storage, "products/" + fileName);

        await uploadBytes(storageRef, file);

        const url = await getDownloadURL(storageRef);

        document.getElementById("productImage").value = url;

        const preview = document.getElementById("previewImage");

        preview.src = url;

        preview.style.display = "block";

        alert("✅ Image Upload Successful");

    }

    catch (error) {

        console.error(error);

        alert("❌ Image Upload Failed");

    }

};

// ==========================================
// Image Preview Before Upload
// ==========================================

const productFile = document.getElementById("productFile");

if (productFile) {

    productFile.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            const preview = document.getElementById("previewImage");

            preview.src = e.target.result;

            preview.style.display = "block";

        };

        reader.readAsDataURL(file);

    });

}
// ==========================================
// Add Product
// ==========================================

window.addProduct = async function () {

    const name = document.getElementById("productName").value.trim();

    const price = document.getElementById("productPrice").value;

    const category = document.getElementById("productCategory").value.trim();

    const image = document.getElementById("productImage").value;

    const description = document.getElementById("productDescription").value.trim();

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

    const preview = document.getElementById("previewImage");

    preview.src = "";

    preview.style.display = "none";

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

                <td>${product.name}</td>

                <td>৳${product.price}</td>

                <td>${product.category}</td>

                <td>

                    <button
                    class="btn"
                    onclick="editProduct('${docItem.id}')">

                    ✏️

                    </button>

                    <button
                    class="btn"
                    style="background:#dc3545;margin-left:5px;"
                    onclick="deleteProduct('${docItem.id}')">

                    🗑

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

};

// ==========================================
// Delete Product
// ==========================================

window.deleteProduct = async function(id){

    if(!confirm("এই Product Delete করবেন?"))
        return;

    try{

        await deleteDoc(doc(db,"products",id));

        alert("✅ Product Deleted");

        loadProducts();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

};

// ==========================================
// Edit Product
// ==========================================

window.editProduct = async function(id){

    try{

        const snap = await getDoc(doc(db,"products",id));

        if(!snap.exists()) return;

        const product = snap.data();

        document.getElementById("productName").value =
            product.name;

        document.getElementById("productPrice").value =
            product.price;

        document.getElementById("productCategory").value =
            product.category;

        document.getElementById("productImage").value =
            product.image;

        document.getElementById("productDescription").value =
            product.description;

        const preview =
            document.getElementById("previewImage");

        preview.src = product.image;

        preview.style.display = "block";

        window.editProductId = id;

    }

    catch(error){

        console.error(error);

    }

};

// ==========================================
// Auto Load Products
// ==========================================

document.addEventListener("DOMContentLoaded",()=>{

    if(document.getElementById("productTable")){

        loadProducts();

    }

});
// ==========================================
// Update Product
// ==========================================

window.updateProduct = async function () {

    if (!window.editProductId) {

        alert("প্রথমে Edit বাটনে ক্লিক করুন");

        return;

    }

    try {

        await updateDoc(doc(db, "products", window.editProductId), {

            name: document.getElementById("productName").value,

            price: Number(document.getElementById("productPrice").value),

            category: document.getElementById("productCategory").value,

            image: document.getElementById("productImage").value,

            description: document.getElementById("productDescription").value

        });

        alert("✅ Product Updated Successfully");

        window.editProductId = null;

        resetProductForm();

        loadProducts();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

};

// ==========================================
// Search Products
// ==========================================

window.searchProducts = function () {

    const keyword = document
        .getElementById("searchProduct")
        .value
        .toLowerCase();

    const rows = document
        .querySelectorAll("#productTable tr");

    rows.forEach(row => {

        if (row.innerText.toLowerCase().includes(keyword)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

};
// ==========================================
// Product Statistics
// ==========================================

window.loadProductStatistics = async function () {

    const countBox = document.getElementById("productCount");

    if (!countBox) return;

    try {

        const snapshot = await getDocs(collection(db, "products"));

        countBox.innerHTML =
            "📦 Total Products : " + snapshot.size;

    }

    catch (error) {

        console.log(error);

    }

};

// ==========================================
// Toggle Stock
// ==========================================

window.toggleStock = async function (id, status) {

    try {

        await updateDoc(doc(db, "products", id), {

            stock: status

        });

        loadProducts();

    }

    catch (error) {

        alert(error.message);

    }

};

// ==========================================
// Toggle Featured Product
// ==========================================

window.toggleFeatured = async function (id, value) {

    try {

        await updateDoc(doc(db, "products", id), {

            featured: value

        });

        loadProducts();

    }

    catch (error) {

        alert(error.message);

    }

};

// ==========================================
// Reload Dashboard Product Count
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadProductStatistics();

});
// ==========================================
// Load Categories
// ==========================================

window.loadCategories = async function () {

    const select = document.getElementById("categoryFilter");

    if (!select) return;

    const snapshot = await getDocs(collection(db, "products"));

    const categories = [];

    snapshot.forEach(doc => {

        const p = doc.data();

        if (p.category && !categories.includes(p.category)) {

            categories.push(p.category);

        }

    });

    select.innerHTML = '<option value="">সব Category</option>';

    categories.sort().forEach(cat => {

        select.innerHTML += `<option value="${cat}">${cat}</option>`;

    });

};

// ==========================================
// Filter Products
// ==========================================

window.filterProducts = function () {

    const category = document
        .getElementById("categoryFilter")
        .value
        .toLowerCase();

    const rows = document
        .querySelectorAll("#productTable tr");

    rows.forEach(row => {

        if (category === "") {

            row.style.display = "";

            return;

        }

        row.style.display =
            row.innerText.toLowerCase().includes(category)
            ? ""
            : "none";

    });

};

// ==========================================
// Export Products CSV
// ==========================================

window.exportProducts = async function () {

    const snapshot = await getDocs(collection(db, "products"));

    let csv =
"Name,Price,Category,Description\n";

    snapshot.forEach(doc => {

        const p = doc.data();

        csv += `"${p.name}",${p.price},"${p.category}","${p.description}"\n`;

    });

    const blob = new Blob([csv], {

        type: "text/csv"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "products.csv";

    a.click();

};

// ==========================================
// Auto Load Category
// ==========================================

document.addEventListener("DOMContentLoaded",()=>{

    loadCategories();

});
