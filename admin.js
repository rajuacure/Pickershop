// ==========================================
// Picker Shop V16
// admin.js
// Part 1
// ==========================================

// Firebase Config
console.log("admin.js loaded");
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
// ==========================================
// View Order Details
// ==========================================

window.viewOrder = async function(id){


    try{


        const snap =
        await getDoc(doc(db,"orders",id));


        if(!snap.exists()){

            alert("Order পাওয়া যায়নি");

            return;

        }


        const order =
        snap.data();



        let products = "";



        if(order.items){


            order.items.forEach(item=>{


                products +=
                `
                ${item.name}
                x ${item.qty || 1}
                = ৳${item.price}

                `;


            });


        }



        alert(

`
🛒 Order Details


Customer:
${order.customerName || "-"}


Phone:
${order.phone || "-"}


Address:
${order.address || "-"}


Payment:
${order.paymentMethod || "COD"}


Total:
৳${order.total || 0}


Status:
${order.status || "Pending"}



Products:

${products}

`

        );



    }


    catch(error){


        console.error(error);

        alert("❌ Order Details Failed");


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


        loadOrders();table.innerHTML += `

<tr>

...

<td>

<button
class="btn"
onclick="viewOrder('${docItem.id}')">

👁 View

</button>

<button
class="btn"
onclick="printInvoice('${docItem.id}')">

</td>

</tr>

`;



    }


    catch(error){


        console.error(error);


        alert("❌ Delete Failed");


    }


};



// ==========================================
// Search Orders
// ==========================================

window.searchOrders = function(){


    const keyword =

    document
    .getElementById("searchOrder")
    .value
    .toLowerCase();



    const rows =

    document
    .querySelectorAll("#orderTable tr");



    rows.forEach(row=>{


        const text =

        row.innerText.toLowerCase();



        row.style.display =

        text.includes(keyword)

        ?

        ""

        :

        "none";


    });


};
<td>

<button
class="btn"
onclick="viewOrder('${docItem.id}')">
👁 View
</button>

<button
class="btn"
style="background:#0d6efd;"
onclick="printInvoice('${docItem.id}')">
🧾 Invoice
</button>

<button
class="btn"
style="background:#dc3545;"
onclick="deleteOrder('${docItem.id}')">
🗑 Delete
</button>

</td>
// ==========================================
// Print Invoice
// ==========================================

window.printInvoice = async function(id){

    try{

        const snap = await getDoc(
            doc(db,"orders",id)
        );

        if(!snap.exists()){

            alert("Order পাওয়া যায়নি");

            return;

        }

        const order = snap.data();

        const invoice = `
        <html>
        <head>
        <title>Picker Shop Invoice</title>
        </head>

        <body style="font-family:Arial;padding:30px;">

        <h2>Picker Shop Invoice</h2>

        <hr>

        <p><strong>Customer:</strong> ${order.customerName}</p>

        <p><strong>Phone:</strong> ${order.phone}</p>

        <p><strong>Address:</strong> ${order.address || "-"}</p>

        <p><strong>Payment:</strong> ${order.paymentMethod || "COD"}</p>

        <p><strong>Status:</strong> ${order.status}</p>

        <h3>Total : ৳${order.total}</h3>

        </body>

        </html>
        `;

        const win = window.open("");

        win.document.write(invoice);

        win.document.close();

        win.print();

    }

    catch(error){

        console.error(error);

        alert("❌ Invoice Print Failed");

    }

};

    catch(error){


        console.error(error);


    }


};
// ==========================================
// Load Users
// ==========================================

window.loadUsers = async function(){

    const table =
    document.getElementById("userTable");


    if(!table) return;



    table.innerHTML = `

    <tr>

    <td colspan="5"
    style="text-align:center;">

    ⏳ Loading Users...

    </td>

    </tr>

    `;



    try{


        const snapshot =
        await getDocs(collection(db,"users"));



        if(snapshot.empty){


            table.innerHTML = `

            <tr>

            <td colspan="5"
            style="text-align:center;">

            কোনো User পাওয়া যায়নি।

            </td>

            </tr>

            `;


            return;

        }



        table.innerHTML = "";



        snapshot.forEach(docItem=>{


            const user =
            docItem.data();



            table.innerHTML += `


            <tr>


            <td>

            ${docItem.id}

            </td>



            <td>

            ${user.name || "-"}

            </td>



            <td>

            ${user.email || "-"}

            </td>



            <td>

            ${user.phone || "-"}

            </td>



            <td>


            <button

            class="btn"

            style="background:#dc3545;"

            onclick="deleteUser('${docItem.id}')">


            🗑 Delete


            </button>


            </td>



            </tr>


            `;



        });



    }


    catch(error){


        console.error(error);


        alert("❌ User Load Failed");


    }


};



// ==========================================
// Delete User
// ==========================================

window.deleteUser = async function(id){


    if(!confirm("এই User Delete করবেন?")){


        return;


    }



    try{


        await deleteDoc(

            doc(db,"users",id)

        );



        alert("✅ User Deleted");



        loadUsers();



    }


    catch(error){


        console.error(error);


        alert("❌ User Delete Failed");


    }


};



// ==========================================
// Search Users
// ==========================================

window.searchUsers = function(){


    const keyword =

    document
    .getElementById("searchUser")
    .value
    .toLowerCase();



    const rows =

    document
    .querySelectorAll("#userTable tr");



    rows.forEach(row=>{


        const text =

        row.innerText.toLowerCase();



        row.style.display =

        text.includes(keyword)

        ?

        ""

        :

        "none";


    });


};



// ==========================================
// Auto Load Users
// ==========================================

document.addEventListener("DOMContentLoaded",()=>{


    if(document.getElementById("userTable")){


        loadUsers();


    }


});
// ==========================================
// Website Settings
// Phase 2 - Part 2
// ==========================================


// Load Settings
// ==========================================

window.loadSettings = async function(){


    try{


        const snap = await getDoc(
            doc(db,"settings","website")
        );


        if(!snap.exists()){

            return;

        }


        const data = snap.data();



        document.getElementById("websiteName").value =
        data.websiteName || "";


        document.getElementById("websitePhone").value =
        data.phone || "";


        document.getElementById("websiteEmail").value =
        data.email || "";


        document.getElementById("websiteAddress").value =
        data.address || "";


        document.getElementById("facebook").value =
        data.facebook || "";


        document.getElementById("youtube").value =
        data.youtube || "";


        document.getElementById("whatsapp").value =
        data.whatsapp || "";


        document.getElementById("footerText").value =
        data.footerText || "";


    }


    catch(error){


        console.error(error);


        alert("❌ Settings Load Failed");


    }


};





// Save Settings
// ==========================================

window.saveSettings = async function(){


    try{


        await updateDoc(

            doc(db,"settings","website"),

            {


            websiteName:
            document.getElementById("websiteName").value,


            phone:
            document.getElementById("websitePhone").value,


            email:
            document.getElementById("websiteEmail").value,


            address:
            document.getElementById("websiteAddress").value,


            facebook:
            document.getElementById("facebook").value,


            youtube:
            document.getElementById("youtube").value,


            whatsapp:
            document.getElementById("whatsapp").value,


            footerText:
            document.getElementById("footerText").value,


            updatedAt:
            new Date().toISOString()


            }

        );


        alert("✅ Settings Saved Successfully");


    }


    catch(error){


        console.error(error);


        alert("❌ Settings Save Failed");


    }


};





// Auto Load Settings
// ==========================================

document.addEventListener("DOMContentLoaded",()=>{


    if(document.getElementById("websiteName")){


        loadSettings();


    }


});
// ==========================================
// Upload Website Logo
// Phase 2 - Part 3
// ==========================================


window.uploadLogo = async function(){


    const file =
    document.getElementById("logoFile").files[0];


    if(!file){

        alert("Logo Image নির্বাচন করুন");

        return;

    }



    try{


        const fileName =
        "logo_" + Date.now();



        const storageRef =
        ref(storage,"website/"+fileName);



        await uploadBytes(
            storageRef,
            file
        );



        const imageURL =
        await getDownloadURL(storageRef);



        await updateDoc(

            doc(db,"settings","website"),

            {

                logo:imageURL

            }

        );



        document.getElementById("logoPreview").src =
        imageURL;



        alert("✅ Logo Uploaded");


    }


    catch(error){


        console.error(error);


        alert("❌ Logo Upload Failed");


    }


};





// ==========================================
// Upload Banner
// ==========================================


window.uploadBanner = async function(){


    const file =
    document.getElementById("bannerFile").files[0];



    if(!file){


        alert("Banner Image নির্বাচন করুন");


        return;


    }



    try{


        const fileName =
        "banner_" + Date.now();



        const storageRef =
        ref(storage,"website/"+fileName);



        await uploadBytes(
            storageRef,
            file
        );



        const imageURL =
        await getDownloadURL(storageRef);



        await updateDoc(

            doc(db,"settings","website"),

            {

                banner:imageURL

            }

        );



        document.getElementById("bannerPreview").src =
        imageURL;



        alert("✅ Banner Uploaded");


    }


    catch(error){


        console.error(error);


        alert("❌ Banner Upload Failed");


    }


};
