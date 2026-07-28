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

    if (preview) {

        preview.src = "";

        preview.style.display = "none";

    }

    editingProductId = null;

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

<br>

${featuredBadge(product.featured)}

</td>
                <td>৳${product.price}</td>

                <td>${product.category}</td>

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
// ==========================================
// Edit Product
// ==========================================

window.editProduct = async function (id) {

    try {

        const snap = await getDoc(doc(db, "products", id));

        if (!snap.exists()) {

            alert("Product পাওয়া যায়নি");

            return;

        }

        const product = snap.data();

        document.getElementById("productName").value = product.name;

        document.getElementById("productPrice").value = product.price;

        document.getElementById("productCategory").value = product.category;

        document.getElementById("productImage").value = product.image;

        document.getElementById("productDescription").value = product.description;

        const preview = document.getElementById("previewImage");

        if (preview) {

            preview.src = product.image;

            preview.style.display = "block";

        }

        editingProductId = id;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    catch (error) {

        console.error(error);

        alert("❌ Product Load Failed");

    }

};

// ==========================================
// Update Product
// ==========================================

window.updateProduct = async function () {

    if (!editingProductId) {

        alert("প্রথমে Edit করুন");

        return;

    }

    try {

        await updateDoc(doc(db, "products", editingProductId), {

            name: document.getElementById("productName").value.trim(),

            price: Number(document.getElementById("productPrice").value),

            category: document.getElementById("productCategory").value.trim(),

            image: document.getElementById("productImage").value.trim(),

            description: document.getElementById("productDescription").value.trim()

        });

        alert("✅ Product Updated");

        editingProductId = null;

        resetProductForm();

        loadProducts();

    }

    catch (error) {

        console.error(error);

        alert("❌ Update Failed");

    }

};

// ==========================================
// Delete Product
// ==========================================

window.deleteProduct = async function (id) {

    if (!confirm("এই Product Delete করবেন?")) {

        return;

    }

    try {

        await deleteDoc(doc(db, "products", id));

        alert("✅ Product Deleted");

        loadProducts();

    }

    catch (error) {

        console.error(error);

        alert("❌ Delete Failed");

    }

};
// ==========================================
// Product Search
// ==========================================

window.searchProducts = function () {

    const keyword = document
        .getElementById("searchProduct")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll("#productTable tr");

    rows.forEach(row => {

        if (row.innerText.toLowerCase().includes(keyword)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

};

// ==========================================
// Load Product Count
// ==========================================

window.loadProductCount = async function () {

    const countBox = document.getElementById("productCount");

    if (!countBox) return;

    try {

        const snapshot = await getDocs(collection(db, "products"));

        countBox.innerHTML = `📦 Total Products: ${snapshot.size}`;

    }

    catch (error) {

        console.error(error);

    }

};

// ==========================================
// Load Categories
// ==========================================

window.loadCategories = async function () {

    const select = document.getElementById("categoryFilter");

    if (!select) return;

    const snapshot = await getDocs(collection(db, "products"));

    const categories = [];

    snapshot.forEach(docItem => {

        const product = docItem.data();

        if (
            product.category &&
            !categories.includes(product.category)
        ) {

            categories.push(product.category);

        }

    });

    select.innerHTML =
        '<option value="">সব Category</option>';

    categories.sort().forEach(cat => {

        select.innerHTML +=
            `<option value="${cat}">${cat}</option>`;

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

    const rows = document.querySelectorAll("#productTable tr");

    rows.forEach(row => {

        if (category === "") {

            row.style.display = "";

            return;

        }

        if (row.innerText.toLowerCase().includes(category)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

};

// ==========================================
// Refresh Product List
// ==========================================

window.refreshProducts = function () {

    loadProducts();

    loadProductCount();

    loadCategories();

};

// ==========================================
// Auto Load
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("productTable")) {

        loadProducts();

        loadProductCount();

        loadCategories();

    }

});
// ==========================================
// Export Products CSV
// ==========================================

window.exportProducts = async function () {

    try {

        const snapshot = await getDocs(collection(db, "products"));

        let csv = "Name,Price,Category,Stock,Featured\n";

        snapshot.forEach(docItem => {

            const p = docItem.data();

            csv += `"${p.name}",${p.price},"${p.category}",${p.stock},${p.featured}\n`;

        });

        const blob = new Blob([csv], { type: "text/csv" });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "PickerShopProducts.csv";

        a.click();

        URL.revokeObjectURL(url);

    }

    catch (error) {

        console.error(error);

        alert("❌ Export Failed");

    }

};

// ==========================================
// Delete All Products
// ==========================================

window.deleteAllProducts = async function () {

    if (!confirm("সব Product Delete করবেন?")) return;

    try {

        const snapshot = await getDocs(collection(db, "products"));

        for (const item of snapshot.docs) {

            await deleteDoc(doc(db, "products", item.id));

        }

        alert("✅ All Products Deleted");

        refreshProducts();

    }

    catch (error) {

        console.error(error);

        alert("❌ Delete Failed");

    }

};

// ==========================================
// Toggle Featured
// ==========================================

window.toggleFeatured = async function (id, value) {

    try {

        await updateDoc(doc(db, "products", id), {

            featured: value

        });

        loadProducts();

    }

    catch (error) {

        console.error(error);

    }

};

// ==========================================
// Update Stock
// ==========================================

window.updateStock = async function (id, stock) {

    try {

        await updateDoc(doc(db, "products", id), {

            stock: Number(stock)

        });

        loadProducts();

    }

    catch (error) {

        console.error(error);

    }

};
// ==========================================
// Image Preview
// ==========================================

window.previewImage = function () {

    const url = document.getElementById("productImage").value;

    const img = document.getElementById("previewImage");

    if (!img) return;

    if (url.trim() === "") {

        img.style.display = "none";

        img.src = "";

        return;

    }

    img.src = url;

    img.style.display = "block";

};

// ==========================================
// CSV Import
// ==========================================

window.importProducts = async function () {

    const file = document.getElementById("csvFile").files[0];

    if (!file) {

        alert("CSV File নির্বাচন করুন");

        return;

    }

    const reader = new FileReader();

    reader.onload = async function (e) {

        const rows = e.target.result.split("\n");

        rows.shift();

        for (const row of rows) {

            if (row.trim() === "") continue;

            const data = row.split(",");

            await addDoc(collection(db, "products"), {

                name: data[0].replace(/"/g, ""),

                price: Number(data[1]),

                category: data[2].replace(/"/g, ""),

                stock: Number(data[3]) || 100,

                featured: data[4] === "true",

                image: "",

                description: "",

                createdAt: new Date().toISOString()

            });

        }

        alert("✅ CSV Import সফল");

        refreshProducts();

    };

    reader.readAsText(file);

};

// ==========================================
// Low Stock Check
// ==========================================

window.stockBadge = function (stock) {

    if (stock <= 5) {

        return '<span style="color:red;font-weight:bold;">⚠ Low Stock</span>';

    }

    return '<span style="color:green;">✅ In Stock</span>';

};

// ==========================================
// Featured Badge
// ==========================================

window.featuredBadge = function (featured) {

    if (featured) {

        return '<span style="color:#ffc107;font-weight:bold;">⭐ Featured</span>';

    }

    return "";

};
// ==========================================
// Pagination
// ==========================================

let currentPage = 1;
const productsPerPage = 10;

// ==========================================
// Loading Spinner
// ==========================================

window.showLoading = function () {

    const table = document.getElementById("productTable");

    if (!table) return;

    table.innerHTML = `
    <tr>
        <td colspan="6" style="text-align:center;padding:20px;">
            ⏳ Loading Products...
        </td>
    </tr>
    `;

};

// ==========================================
// Refresh Products
// ==========================================

window.refreshProducts = function () {

    showLoading();

    setTimeout(() => {

        loadProducts();

        loadProductCount();

        loadCategories();

    }, 500);

};

// ==========================================
// Auto Refresh Every 60 Seconds
// ==========================================

setInterval(() => {

    if (document.getElementById("productTable")) {

        refreshProducts();

    }

}, 60000);

// ==========================================
// Responsive Table
// ==========================================

window.makeResponsiveTable = function () {

    const table = document.querySelector("table");

    if (!table) return;

    table.style.width = "100%";

    table.style.overflowX = "auto";

};

// ==========================================
// Page Loaded
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    makeResponsiveTable();

});
// ==========================================
// Dashboard Statistics
// ==========================================

window.loadDashboardStats = async function () {

    try {

        // Products
        const productSnap = await getDocs(collection(db, "products"));

        const totalProducts = productSnap.size;

        let featuredProducts = 0;

        let lowStockProducts = 0;

        productSnap.forEach(docItem => {

            const p = docItem.data();

            if (p.featured === true) {

                featuredProducts++;

            }

            if ((p.stock || 0) <= 5) {

                lowStockProducts++;

            }

        });

        // Orders
        const orderSnap = await getDocs(collection(db, "orders"));

        const totalOrders = orderSnap.size;

        // Users
        const userSnap = await getDocs(collection(db, "users"));

        const totalUsers = userSnap.size;

        // Dashboard Box
        const productsBox = document.getElementById("dashboardProducts");

        const ordersBox = document.getElementById("dashboardOrders");

        const usersBox = document.getElementById("dashboardUsers");

        const featuredBox = document.getElementById("dashboardFeatured");

        const stockBox = document.getElementById("dashboardLowStock");

        if (productsBox)
            productsBox.innerHTML = totalProducts;

        if (ordersBox)
            ordersBox.innerHTML = totalOrders;

        if (usersBox)
            usersBox.innerHTML = totalUsers;

        if (featuredBox)
            featuredBox.innerHTML = featuredProducts;

        if (stockBox)
            stockBox.innerHTML = lowStockProducts;

    }

    catch (error) {

        console.error(error);

    }

};

// ==========================================
// Auto Dashboard Load
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("dashboardProducts")) {

        loadDashboardStats();

    }

});
// ==========================================
// Orders Management
// ==========================================

window.loadOrders = async function () {

    const table = document.getElementById("orderTable");

    if (!table) return;

    table.innerHTML = `
    <tr>
        <td colspan="6" style="text-align:center;">
            Loading Orders...
        </td>
    </tr>`;

    try {

        const snapshot = await getDocs(collection(db, "orders"));

        if (snapshot.empty) {

            table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    কোনো Order পাওয়া যায়নি।
                </td>
            </tr>`;

            return;
        }

        table.innerHTML = "";

        snapshot.forEach((docItem) => {

            const order = docItem.data();

            table.innerHTML += `

            <tr>

                <td>${docItem.id}</td>

                <td>${order.customerName || "-"}</td>

                <td>${order.phone || "-"}</td>

                <td>৳${order.total || 0}</td>

                <td>

                    <select onchange="changeOrderStatus('${docItem.id}', this.value)">

                        <option value="Pending" ${order.status=="Pending"?"selected":""}>Pending</option>

                        <option value="Processing" ${order.status=="Processing"?"selected":""}>Processing</option>

                        <option value="Shipped" ${order.status=="Shipped"?"selected":""}>Shipped</option>

                        <option value="Delivered" ${order.status=="Delivered"?"selected":""}>Delivered</option>

                        <option value="Cancelled" ${order.status=="Cancelled"?"selected":""}>Cancelled</option>

                    </select>

                </td>

                <td>

                    <button
                    class="btn"
                    style="background:#dc3545;"
                    onclick="deleteOrder('${docItem.id}')">

                    🗑 Delete

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.error(error);

        alert("❌ Order Load Failed");

    }

};
// ==========================================
// Load Orders
// ==========================================

window.loadOrders = async function () {

    const table = document.getElementById("orderTable");

    if (!table) return;

    table.innerHTML = `
    <tr>
        <td colspan="6" style="text-align:center;">
            Loading Orders...
        </td>
    </tr>
    `;

    try {

        const snapshot = await getDocs(collection(db, "orders"));

        if (snapshot.empty) {

            table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    এখনো কোনো Order আসেনি।
                </td>
            </tr>
            `;

            return;

        }

        table.innerHTML = "";

        snapshot.forEach((docItem) => {

            const order = docItem.data();

            table.innerHTML += `

            <tr>

                <td>${docItem.id}</td>

                <td>${order.customerName || "-"}</td>

                <td>${order.phone || "-"}</td>

                <td>৳${order.total || 0}</td>

                <td>

                    <span style="
                    color:
                    ${order.status=="Pending"?"orange":
                    order.status=="Processing"?"blue":
                    order.status=="Shipped"?"purple":
                    order.status=="Delivered"?"green":"red"};
                    font-weight:bold;">

                    ${order.status || "Pending"}

                    </span>

                </td>

                <td>

                    <button
                    class="btn"
                    onclick="viewOrder('${docItem.id}')">

                    👁 View

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.error(error);

        alert("❌ Order Load Failed");

    }

};

// ==========================================
// Auto Load Orders
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("orderTable")) {

        loadOrders();

    }

});
// ==========================================
// View Order Details
// ==========================================

window.viewOrder = async function(id){

    try{

        const snap = await getDoc(doc(db,"orders",id));

        if(!snap.exists()){

            alert("Order পাওয়া যায়নি");

            return;

        }

        const order = snap.data();

        let items = "";

        if(order.items){

            order.items.forEach(item=>{

                items += `
                ${item.name} 
                x ${item.qty || 1}
                = ৳${item.price}
                \n`;

            });

        }


        alert(
`🛒 Order Details

Customer:
${order.customerName || "-"}

Phone:
${order.phone || "-"}

Address:
${order.address || "-"}

Total:
৳${order.total || 0}

Status:
${order.status || "Pending"}

Products:

${items}
`
        );


    }

    catch(error){

        console.error(error);

        alert("Order Details Load Failed");

    }

};



// ==========================================
// Change Order Status
// ==========================================

window.changeOrderStatus = async function(id,status){

    try{

        await updateDoc(
            doc(db,"orders",id),
            {
                status: status
            }
        );


        alert("✅ Order Status Updated");


        loadOrders();


    }

    catch(error){

        console.error(error);

        alert("❌ Status Update Failed");

    }

};



// ==========================================
// Delete Order
// ==========================================

window.deleteOrder = async function(id){


    if(!confirm("এই Order Delete করবেন?")){

        return;

    }


    try{


        await deleteDoc(
            doc(db,"orders",id)
        );


        alert("✅ Order Deleted");


        loadOrders();


    }

    catch(error){

        console.error(error);

        alert("❌ Delete Failed");

    }


};
// ===============================
// DASHBOARD ANALYTICS
// ===============================


async function loadDashboard(){


let total = 0;
let pending = 0;
let processing = 0;
let delivered = 0;
let sales = 0;



const snapshot = await db
.collection("orders")
.get();



snapshot.forEach(doc=>{


let order = doc.data();



total++;



if(order.status=="Pending"){
pending++;
}



if(order.status=="Processing"){
processing++;
}



if(order.status=="Delivered"){

delivered++;

sales += Number(order.total || 0);

}



});



document.getElementById("totalOrders").innerHTML = total;


document.getElementById("pendingOrders").innerHTML = pending;


document.getElementById("processingOrders").innerHTML = processing;


document.getElementById("deliveredOrders").innerHTML = delivered;


document.getElementById("totalSales").innerHTML =
sales + " ৳";


}
