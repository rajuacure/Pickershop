// ==========================================
// Picker Shop V16
// admin.js
// Part 1
// ==========================================

// Firebase Config
import {
    auth,
    db,
    storage
} from "./firebase.js";

// Firebase Auth
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Firestore
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Storage
import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";


// ==========================================
// Global Variables
// ==========================================

let editingProductId = null;
let uploadedImageURL = "";


// ==========================================
// Admin Login
// ==========================================

window.adminLogin = async function () {

    const email =
        document.getElementById("adminEmail").value.trim();

    const password =
        document.getElementById("adminPassword").value;

    if (email === "" || password === "") {

        alert("Email এবং Password দিন");

        return;

    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("✅ Login Successful");

        window.location.href =
            "admin-dashboard.html";

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

};


// ==========================================
// Logout
// ==========================================

window.adminLogout = async function () {

    try {

        await signOut(auth);

        window.location.href =
            "admin-login.html";

    }

    catch (error) {

        console.error(error);

    }

};


// ==========================================
// Protect Admin Pages
// ==========================================

onAuthStateChanged(auth, (user) => {

    const isLoginPage =
        location.pathname.includes("admin-login.html");

    if (!user && !isLoginPage) {

        window.location.href =
            "admin-login.html";

    }

});
// ==========================================
// Dashboard Statistics
// ==========================================

window.loadDashboard = async function () {

    try {

        // Products
        const productSnap = await getDocs(collection(db, "products"));

        // Orders
        const orderSnap = await getDocs(collection(db, "orders"));

        // Users
        const userSnap = await getDocs(collection(db, "users"));

        let totalSales = 0;
        let pendingOrders = 0;
        let completedOrders = 0;

        orderSnap.forEach((docItem) => {

            const order = docItem.data();

            totalSales += Number(order.total || 0);

            if (order.status === "Pending") {
                pendingOrders++;
            }

            if (order.status === "Delivered") {
                completedOrders++;
            }

        });

        // Dashboard Cards
        const totalProducts = document.getElementById("totalProducts");
        const totalOrders = document.getElementById("totalOrders");
        const totalUsers = document.getElementById("totalUsers");
        const totalRevenue = document.getElementById("totalRevenue");
        const pending = document.getElementById("pendingOrders");
        const delivered = document.getElementById("completedOrders");

        if (totalProducts)
            totalProducts.innerHTML = productSnap.size;

        if (totalOrders)
            totalOrders.innerHTML = orderSnap.size;

        if (totalUsers)
            totalUsers.innerHTML = userSnap.size;

        if (totalRevenue)
            totalRevenue.innerHTML = "৳ " + totalSales;

        if (pending)
            pending.innerHTML = pendingOrders;

        if (delivered)
            delivered.innerHTML = completedOrders;

    }

    catch (error) {

        console.error(error);

    }

};


// ==========================================
// Auto Load Dashboard
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("totalProducts")) {

        loadDashboard();

    }

});
// ==========================================
// Load Products
// ==========================================

window.loadProducts = async function () {

    const table = document.getElementById("productTable");

    if (!table) return;

    table.innerHTML = `
    <tr>
        <td colspan="6" style="text-align:center;">
            Loading Products...
        </td>
    </tr>
    `;

    try {

        const snapshot = await getDocs(collection(db, "products"));

        if (snapshot.empty) {

            table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    কোনো Product পাওয়া যায়নি।
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
                    style="
                    border-radius:8px;
                    border:1px solid #ddd;">

                </td>

                <td>

                    ${product.name}

                </td>

                <td>

                    ৳${product.price}

                </td>

                <td>

                    ${product.category}

                </td>

                <td>

                    ${product.stock || 0}

                </td>

                <td>

                    <button
                    class="btn"
                    onclick="editProduct('${docItem.id}')">

                    ✏️

                    </button>

                    <button
                    class="btn"
                    style="background:#dc3545;"
                    onclick="deleteProduct('${docItem.id}')">

                    🗑

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
// Upload Product Image
// ==========================================

window.uploadImage = async function () {

    const file = document.getElementById("productFile").files[0];

    if (!file) {

        alert("একটি ছবি নির্বাচন করুন");

        return;

    }

    try {

        const fileName = Date.now() + "_" + file.name;

        const storageRef = ref(storage, "products/" + fileName);

        await uploadBytes(storageRef, file);

        uploadedImageURL = await getDownloadURL(storageRef);

        document.getElementById("previewImage").src = uploadedImageURL;

        document.getElementById("previewImage").style.display = "block";

        alert("✅ Image Uploaded Successfully");

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

    const name =
        document.getElementById("productName").value.trim();

    const price =
        document.getElementById("productPrice").value;

    const category =
        document.getElementById("productCategory").value.trim();

    const description =
        document.getElementById("productDescription").value.trim();

    if (
        name === "" ||
        price === "" ||
        category === ""
    ) {

        alert("সব তথ্য পূরণ করুন");

        return;

    }

    try {

        await addDoc(collection(db, "products"), {

            name: name,

            price: Number(price),

            category: category,

            description: description,

            image: uploadedImageURL,

            stock: 100,

            featured: false,

            createdAt: new Date().toISOString()

        });

        alert("✅ Product Added Successfully");

        resetProductForm();

        loadProducts();

        loadDashboard();

    }

    catch (error) {

        console.error(error);

        alert("❌ Product Add Failed");

    }

};
// ==========================================
// Edit Product
// ==========================================

window.editProduct = async function (id) {

    try {

        const snap = await getDoc(doc(db, "products", id));

        if (!snap.exists()) {

            alert("❌ Product পাওয়া যায়নি");

            return;

        }

        const product = snap.data();

        editingProductId = id;

        document.getElementById("productName").value = product.name || "";

        document.getElementById("productPrice").value = product.price || "";

        document.getElementById("productCategory").value = product.category || "";

        document.getElementById("productDescription").value = product.description || "";

        uploadedImageURL = product.image || "";

        if (uploadedImageURL !== "") {

            const preview = document.getElementById("previewImage");

            preview.src = uploadedImageURL;

            preview.style.display = "block";

        }

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

        alert("আগে একটি Product Edit করুন");

        return;

    }

    try {

        await updateDoc(doc(db, "products", editingProductId), {

            name: document.getElementById("productName").value.trim(),

            price: Number(document.getElementById("productPrice").value),

            category: document.getElementById("productCategory").value.trim(),

            description: document.getElementById("productDescription").value.trim(),

            image: uploadedImageURL

        });

        alert("✅ Product Updated Successfully");

        editingProductId = null;

        resetProductForm();

        loadProducts();

        loadDashboard();

    }

    catch (error) {

        console.error(error);

        alert("❌ Product Update Failed");

    }

};


// ==========================================
// Reset Product Form
// ==========================================

window.resetProductForm = function () {

    editingProductId = null;

    uploadedImageURL = "";

    document.getElementById("productName").value = "";

    document.getElementById("productPrice").value = "";

    document.getElementById("productCategory").value = "";

    document.getElementById("productDescription").value = "";

    document.getElementById("productFile").value = "";

    const preview = document.getElementById("previewImage");

    preview.src = "";

    preview.style.display = "none";

};
// ==========================================
// Delete Product
// ==========================================

window.deleteProduct = async function (id) {

    if (!confirm("আপনি কি এই Product Delete করতে চান?")) {

        return;

    }

    try {

        await deleteDoc(doc(db, "products", id));

        alert("✅ Product Deleted Successfully");

        loadProducts();

        loadDashboard();

    }

    catch (error) {

        console.error(error);

        alert("❌ Product Delete Failed");

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

    const rows =
        document.querySelectorAll("#productTable tr");

    rows.forEach((row) => {

        const text =
            row.innerText.toLowerCase();

        row.style.display =
            text.includes(keyword)
                ? ""
                : "none";

    });

};


// ==========================================
// Toggle Featured Product
// ==========================================

window.toggleFeatured = async function (id, currentValue) {

    try {

        await updateDoc(doc(db, "products", id), {

            featured: !currentValue

        });

        loadProducts();

    }

    catch (error) {

        console.error(error);

        alert("❌ Featured Update Failed");

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
// Category Filter
// ==========================================

window.filterCategory = function(){

    const category =
    document.getElementById("categoryFilter")
    .value
    .toLowerCase();


    const rows =
    document.querySelectorAll("#productTable tr");


    rows.forEach(row=>{

        const text =
        row.innerText.toLowerCase();


        if(category === "" || text.includes(category)){

            row.style.display = "";

        }
        else{

            row.style.display = "none";

        }

    });

};



// ==========================================
// Pagination
// ==========================================

let currentProductPage = 1;

const productsPerPage = 10;



window.productPagination = function(page){


    currentProductPage = page;


    loadProducts();


};



// ==========================================
// Export Product CSV
// ==========================================

window.exportProductsCSV = async function(){


    try{


        const snapshot =
        await getDocs(collection(db,"products"));


        let csv =
        "Name,Price,Category,Stock\n";


        snapshot.forEach(docItem=>{


            const product =
            docItem.data();


            csv +=
            `${product.name},${product.price},${product.category},${product.stock || 0}\n`;


        });



        const blob =
        new Blob([csv],
        {
            type:"text/csv"
        });



        const url =
        URL.createObjectURL(blob);



        const link =
        document.createElement("a");


        link.href = url;


        link.download =
        "products.csv";


        link.click();



        URL.revokeObjectURL(url);



    }


    catch(error){

        console.error(error);

        alert("CSV Export Failed");

    }


};



// ==========================================
// Print Product List
// ==========================================

window.printProducts = function(){


    const content =
    document.querySelector(".card").innerHTML;


    const printWindow =
    window.open("");


    printWindow.document.write(`

    <html>

    <head>

    <title>
    Product List
    </title>

    </head>


    <body>

    <h2>
    Product List
    </h2>


    ${content}


    </body>


    </html>

    `);



    printWindow.print();


};
// ==========================================
// Load Orders
// ==========================================

window.loadOrders = async function(){

    const table =
    document.getElementById("orderTable");


    if(!table) return;


    table.innerHTML = `

    <tr>

    <td colspan="7"
    style="text-align:center;">

    ⏳ Loading Orders...

    </td>

    </tr>

    `;


    try{


        const snapshot =
        await getDocs(collection(db,"orders"));



        if(snapshot.empty){


            table.innerHTML = `

            <tr>

            <td colspan="7"
            style="text-align:center;">

            কোনো Order পাওয়া যায়নি।

            </td>

            </tr>

            `;


            return;

        }



        table.innerHTML = "";



        snapshot.forEach(docItem=>{


            const order =
            docItem.data();



            table.innerHTML += `


            <tr>


            <td>

            ${docItem.id}

            </td>



            <td>

            ${order.customerName || "-"}

            </td>



            <td>

            ${order.phone || "-"}

            </td>



            <td>

            ৳${order.total || 0}

            </td>



            <td>


            <select

            onchange="updateOrderStatus('${docItem.id}',this.value)">


            <option

            value="Pending"

            ${order.status=="Pending"?"selected":""}>

            Pending

            </option>



            <option

            value="Processing"

            ${order.status=="Processing"?"selected":""}>

            Processing

            </option>



            <option

            value="Shipped"

            ${order.status=="Shipped"?"selected":""}>

            Shipped

            </option>



            <option

            value="Delivered"

            ${order.status=="Delivered"?"selected":""}>

            Delivered

            </option>



            <option

            value="Cancelled"

            ${order.status=="Cancelled"?"selected":""}>

            Cancelled

            </option>



            </select>


            </td>



            <td>


            <button

            class="btn"

            onclick="viewOrder('${docItem.id}')">


            👁 View


            </button>


            </td>



            <td>


            <button

            class="btn"

            style="background:red;"

            onclick="deleteOrder('${docItem.id}')">


            🗑 Delete


            </button>


            </td>



            </tr>


            `;


        });


    }


    catch(error){


        console.error(error);


        alert("❌ Order Load Failed");


    }


};



// ==========================================
// Update Order Status
// ==========================================

window.updateOrderStatus = async function(id,status){


    try{


        await updateDoc(

            doc(db,"orders",id),

            {

                status:status

            }

        );



        alert("✅ Order Status Updated");


    }


    catch(error){


        console.error(error);


        alert("❌ Status Update Failed");


    }


};



// ==========================================
// Auto Load Orders
// ==========================================

document.addEventListener("DOMContentLoaded",()=>{


    if(document.getElementById("orderTable")){


        loadOrders();


    }


});
