 // ==========================================
// Picker Shop V3
// coupon.js
// Complete File
// ==========================================

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

window.discount = 0;
window.currentCoupon = null;

// ==========================================
// Apply Coupon
// ==========================================

window.applyCoupon = async function () {

    const code = document
        .getElementById("couponCode")
        .value
        .trim()
        .toUpperCase();

    if (code === "") {

        alert("Coupon Code লিখুন");

        return;

    }

    try {

        const q = query(

            collection(db, "coupons"),

            where("code", "==", code)

        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            discount = 0;

            currentCoupon = null;

            calculateTotal();

            alert("❌ Invalid Coupon");

            return;

        }

        const coupon = snapshot.docs[0].data();

        if (!coupon.active) {

            alert("Coupon Disabled");

            return;

        }

        if (coupon.type === "percent") {

            discount =

                subTotal *

                (coupon.value / 100);

        }

        else {

            discount = coupon.value;

        }

        currentCoupon = coupon;

        calculateTotal();

        alert("✅ Coupon Applied");

    }

    catch (error) {

        console.error(error);

        alert("Coupon Failed");

    }

};
