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
                    onclick="deleteProduct('${product.id}')">

                    Delete

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
