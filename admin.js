 /* ==========================================
Picker Shop V14
Admin Panel
admin.js
========================================== */

// Firebase
import {
    auth,
    db,
    storage,
    signInWithEmailAndPassword,
    signOut
} from "./firebase.js";

// Firestore
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Storage
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

    if (!email || !password) {
        alert("Login Form পাওয়া যায়নি");
        return;
    }

    if (email.value.trim() === "" || password.value.trim() === "") {
        alert("ইমেইল এবং পাসওয়ার্ড লিখুন");
        return;
    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email.value.trim(),
            password.value
        );

        localStorage.setItem("pickerAdmin", "true");

        alert("✅ Admin Login Successful");

        window.location.href = "admin-dashboard.html";

    } catch (error) {

        console.error(error);

        alert(
            "Login Failed\n\n" +
            error.code +
            "\n\n" +
            error.message
        );

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
// Load Products From Firestore
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

        let html = "";

        snapshot.forEach((product) => {

            const data = product.data();

            html += `
            <tr>

                <td>
                    <img
                    src="${data.image}"
                    width="60"
                    height="60"
                    style="border-radius:8px;object-fit:cover;">
                </td>

                <td>${data.name}</td>

                <td>৳ ${data.price}</td>

                <td>${data.category}</td>

                <td>

<button
class="btn"
onclick="editProduct('${product.id}')">

✏️ Edit

</button>

<button
class="btn"
style="background:red;margin-left:5px;"
onclick="deleteProduct('${product.id}')">

🗑 Delete

</button>

</td>
            </tr>
            `;

        });

        table.innerHTML = html;

    }

    catch (error) {

        console.error(error);

        table.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;color:red;">
                Product Load Failed
            </td>
        </tr>
        `;

    }

};

// Dashboard বা Product Page খুললেই Product Load হবে
window.addEventListener("DOMContentLoaded", () => {

    loadProducts();

});
// ==========================================
// Add Product
// ==========================================

window.addProduct = async function () {

    const name = document.getElementById("productName");
    const price = document.getElementById("productPrice");
    const category = document.getElementById("productCategory");
    const image = document.getElementById("productImage");
    const description = document.getElementById("productDescription");

    if (!name || !price || !category || !image) {
        alert("Product Form পাওয়া যায়নি");
        return;
    }

    if (
        name.value.trim() === "" ||
        price.value.trim() === "" ||
        category.value.trim() === "" ||
        image.value.trim() === ""
    ) {
        alert("সব তথ্য পূরণ করুন");
       try {

    let imageURL = document.getElementById("productImage").value;

    if (!imageURL) {
        imageURL = await uploadProductImage();
    }

    await addDoc(collection(db, "products"), {

        name: name.value.trim(),
        price: Number(price.value),
        category: category.value.trim(),
        image: imageURL,
        description: description.value.trim(),
        createdAt: new Date()

    });

    alert("✅ Product সফলভাবে যোগ হয়েছে");

    name.value = "";
    price.value = "";
    category.value = "";
    image.value = "";
    description.value = "";

    loadProducts();

} catch (error) {

    console.error(error);

    alert("❌ Product Save Failed\n\n" + error.message);

}

// ==========================================
// Delete Product
// ==========================================

window.deleteProduct = async function (id) {

    if (!confirm("এই Product Delete করবেন?")) return;

    try {

        await deleteDoc(doc(db, "products", id));

        alert("🗑 Product Deleted");

        loadProducts();

    } catch (error) {

        console.error(error);

        alert("Delete Failed");

    }

};
// ==========================================
// Upload Image To Firebase Storage
// ==========================================

window.uploadProductImage = async function () {

    const fileInput = document.getElementById("productImageFile");

    if (!fileInput.files.length) {

        alert("ছবি নির্বাচন করুন");

        return null;

    }

    const file = fileInput.files[0];

    const fileName = Date.now() + "_" + file.name;

    const storageRef = ref(storage, "products/" + fileName);

    await uploadBytes(storageRef, file);

    const imageURL = await getDownloadURL(storageRef);

    document.getElementById("productImage").value = imageURL;

    return imageURL;

};
// ==========================================
// Edit Product
// ==========================================

window.editProduct = async function(id){

    try{

        const snap = await getDoc(doc(db,"products",id));

        if(!snap.exists()){

            alert("Product পাওয়া যায়নি");

            return;

        }

        const data = snap.data();

        document.getElementById("productName").value = data.name;
        document.getElementById("productPrice").value = data.price;
        document.getElementById("productCategory").value = data.category;
        document.getElementById("productImage").value = data.image;
        document.getElementById("productDescription").value = data.description || "";

        const saveBtn=document.querySelector(".btn");

        saveBtn.innerHTML="💾 Update Product";

        saveBtn.onclick=function(){

            updateProduct(id);

        };

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

};

// ==========================================
// Update Product
// ==========================================

window.updateProduct = async function(id){

    try{

        await updateDoc(doc(db,"products",id),{

            name:document.getElementById("productName").value,

            price:Number(document.getElementById("productPrice").value),

            category:document.getElementById("productCategory").value,

            image:document.getElementById("productImage").value,

            description:document.getElementById("productDescription").value

        });

        alert("✅ Product Updated");

        location.reload();

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }
table.innerHTML += `
<tr>

<td>
<img src="${product.image}"
width="60">
</td>

<td>${product.name}</td>

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
style="background:red;margin-left:5px;"
onclick="deleteProduct('${docItem.id}')">

🗑 Delete

</button>

</td>

</tr>
`;
};
// ==========================================
// Image Preview
// ==========================================

const imageInput = document.getElementById("productImageFile");

if (imageInput) {

    imageInput.addEventListener("change", function () {

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
// Load Users From Firestore
// ==========================================

window.loadUsers = async function () {

    const table = document.getElementById("userTable");

    if (!table) return;

    table.innerHTML = `
    <tr>
        <td colspan="3" style="text-align:center;">
            Loading...
        </td>
    </tr>
    `;

    try {

        const snapshot = await getDocs(collection(db, "users"));

        if (snapshot.empty) {

            table.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center;">
                    কোনো User পাওয়া যায়নি।
                </td>
            </tr>
            `;

            return;

        }

        table.innerHTML = "";

        snapshot.forEach((docItem) => {

            const user = docItem.data();

            table.innerHTML += `
            <tr>

                <td>${user.email || "-"}</td>

                <td>${docItem.id}</td>

                <td>${user.createdAt || "-"}</td>

            </tr>
            `;

        });

    }

    catch (error) {

        console.error(error);

        table.innerHTML = `
        <tr>
            <td colspan="3" style="text-align:center;color:red;">
                Users Load Failed
            </td>
        </tr>
        `;

    }

};

// ==========================================
// Auto Load Users
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadUsers();

});
// ==========================================
// Save Website Settings
// ==========================================

window.saveSettings = async function () {

    try {

        await updateDoc(doc(db, "settings", "website"), {

            siteName: document.getElementById("siteName").value,

            phone: document.getElementById("phone").value,

            email: document.getElementById("email").value,

            address: document.getElementById("address").value,

            deliveryCharge: Number(document.getElementById("deliveryCharge").value),

            bkash: document.getElementById("bkash").value,

            nagad: document.getElementById("nagad").value

        });

        alert("✅ Settings Saved Successfully");

    }

    catch (error) {

        console.log(error);

        alert("❌ Save Failed");

    }

};

// ==========================================
// Load Website Settings
// ==========================================

window.loadSettings = async function () {

    if (!document.getElementById("siteName")) return;

    try {

        const snap = await getDoc(doc(db, "settings", "website"));

        if (!snap.exists()) return;

        const data = snap.data();

        document.getElementById("siteName").value = data.siteName || "";

        document.getElementById("phone").value = data.phone || "";

        document.getElementById("email").value = data.email || "";

        document.getElementById("address").value = data.address || "";

        document.getElementById("deliveryCharge").value = data.deliveryCharge || "";

        document.getElementById("bkash").value = data.bkash || "";

        document.getElementById("nagad").value = data.nagad || "";

    }

    catch (error) {

        console.log(error);

    }

};

document.addEventListener("DOMContentLoaded", () => {

    loadSettings();

});
// ==========================================
// Dashboard Statistics
// ==========================================

window.loadDashboard = async function () {

    try {

        const productSnap = await getDocs(collection(db, "products"));

        const orderSnap = await getDocs(collection(db, "orders"));

        const userSnap = await getDocs(collection(db, "users"));

        document.getElementById("totalProducts").innerText =
            productSnap.size;

        document.getElementById("totalOrders").innerText =
            orderSnap.size;

        document.getElementById("totalUsers").innerText =
            userSnap.size;

        let total = 0;

        orderSnap.forEach(docItem => {

            const order = docItem.data();

            total += Number(order.total || 0);

        });

        document.getElementById("totalSales").innerText =
            "৳" + total;

    }

    catch(error){

        console.log(error);

    }

}

document.addEventListener("DOMContentLoaded",()=>{

    if(document.getElementById("totalProducts")){

        loadDashboard();

    }

});
