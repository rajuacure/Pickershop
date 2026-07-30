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
// Apply Coupon (Professional Version)
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

        const couponDoc = snapshot.docs[0];

        const coupon = couponDoc.data();

        // Active Check
        if (!coupon.active) {

            alert("❌ Coupon Disabled");

            return;

        }

        // Expiry Check
        if (coupon.expiry) {

            const today = new Date();

            const expiry = new Date(coupon.expiry);

            if (today > expiry) {

                alert("❌ Coupon Expired");

                return;

            }

        }

        // Usage Limit Check
        if (
            coupon.usageLimit &&
            coupon.usedCount >= coupon.usageLimit
        ) {

            alert("❌ Coupon Usage শেষ");

            return;

        }

        // Minimum Order Check
        if (
            coupon.minimumOrder &&
            subTotal < coupon.minimumOrder
        ) {

            alert(
                "Minimum Order ৳" +
                coupon.minimumOrder +
                " হতে হবে"
            );

            return;

        }

        // Discount Calculate
        if (coupon.type === "percent") {

            discount =
                subTotal *
                (coupon.value / 100);

        }

        else {

            discount = coupon.value;

        }

        // Discount বেশি হলে Limit
        if (discount > subTotal) {

            discount = subTotal;

        }

        currentCoupon = {

            id: couponDoc.id,

            ...coupon

        };

        calculateTotal();

        alert("✅ Coupon Applied Successfully");

    }

    catch (error) {

        console.error(error);

        alert("Coupon Apply Failed");

    }

};
