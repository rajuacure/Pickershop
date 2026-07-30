// ==========================================
// Picker Shop V3
// admin-coupons.js
// Complete File
// ==========================================

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

let editingCouponId = null;


// ==========================================
// Load Coupons
// ==========================================

window.loadCoupons = async function () {

    const table = document.getElementById("couponTable");

    if (!table) return;

    table.innerHTML = `
    <tr>
        <td colspan="5" style="text-align:center;">
            Loading...
        </td>
    </tr>
    `;

    try {

        const snapshot =
            await getDocs(collection(db, "coupons"));

        if (snapshot.empty) {

            table.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No Coupon Found
                </td>
            </tr>
            `;

            return;

        }

        table.innerHTML = "";

        snapshot.forEach((docItem) => {

            const coupon = docItem.data();

            table.innerHTML += `

            <tr>

                <td>${coupon.code}</td>

                <td>${coupon.type}</td>

                <td>${coupon.value}</td>

                <td>

                    ${coupon.active
                        ? "🟢 Active"
                        : "🔴 Inactive"}

                </td>

                <td>

                    <button
                    class="btn"
                    onclick="editCoupon('${docItem.id}')">

                    ✏️

                    </button>

                    <button
                    class="btn"
                    style="background:#dc3545;"
                    onclick="deleteCoupon('${docItem.id}')">

                    🗑

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.error(error);

        alert("Coupon Load Failed");

    }

};


// ==========================================
// Save Coupon
// ==========================================

window.saveCoupon = async function () {

    const code =
        document.getElementById("couponCode").value
        .trim()
        .toUpperCase();

    const type =
        document.getElementById("couponType").value;

    const value =
        Number(document.getElementById("couponValue").value);

    const active =
        document.getElementById("couponActive").checked;

    const expiry =
        document.getElementById("couponExpiry").value;

    const usageLimit =
        Number(document.getElementById("couponLimit").value);

    const minimumOrder =
        Number(document.getElementById("minimumOrder").value);

    if (
        code === "" ||
        value <= 0
    ) {

        alert("সব তথ্য পূরণ করুন");

        return;

    }

    const data = {

        code,

        type,

        value,

        active,

        expiry,

        usageLimit,

        minimumOrder,

        usedCount: 0

    };

    try {

        if (editingCouponId) {

            await updateDoc(

                doc(db, "coupons", editingCouponId),

                data

            );

            alert("Coupon Updated");

        }

        else {

            await addDoc(

                collection(db, "coupons"),

                data

            );

            alert("Coupon Added");

        }

        resetCouponForm();

        loadCoupons();

    }

    catch (error) {

        console.error(error);

        alert("Save Failed");

    }

};

// ==========================================
// Edit Coupon
// ==========================================

window.editCoupon = async function (id) {

    const snapshot =
        await getDocs(collection(db, "coupons"));

    snapshot.forEach((item) => {

        if (item.id === id) {

            const coupon = item.data();

            editingCouponId = id;

            document.getElementById("couponCode").value =
                coupon.code;

            document.getElementById("couponType").value =
                coupon.type;

            document.getElementById("couponValue").value =
                coupon.value;

            document.getElementById("couponActive").checked =
                coupon.active;

        }

    });

};


// ==========================================
// Delete Coupon
// ==========================================

window.deleteCoupon = async function (id) {

    if (!confirm("Delete Coupon?")) return;

    try {

        await deleteDoc(
            doc(db, "coupons", id)
        );

        loadCoupons();

    }

    catch (error) {

        console.error(error);

    }

};


// ==========================================
// Reset Form
// ==========================================

window.resetCouponForm = function () {

    editingCouponId = null;

    document.getElementById("couponCode").value = "";

    document.getElementById("couponValue").value = "";

    document.getElementById("couponType").value = "percent";

    document.getElementById("couponActive").checked = true;

};


// ==========================================
// Search Coupon
// ==========================================

window.searchCoupons = function () {

    const keyword =

        document
        .getElementById("searchCoupon")
        .value
        .toLowerCase();

    const rows =

        document
        .querySelectorAll("#couponTable tr");

    rows.forEach((row) => {

        row.style.display =
            row.innerText.toLowerCase().includes(keyword)

                ? ""

                : "none";

    });

};


// ==========================================
// Auto Load
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadCoupons();

});
