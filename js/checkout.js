// ==========================================
// Picker Shop V3
// checkout.js
// Part 1
// ==========================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ==========================================
// Global Variables
// ==========================================

let currentUser = null;

let cart = [];

let subTotal = 0;

let discount = 0;

let deliveryCharge = 80;

let grandTotal = 0;

// ==========================================
// Auth Check
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        location.href = "login.html";

        return;

    }

    currentUser = user;

    loadCheckout();

});

// ==========================================
// Load Checkout
// ==========================================

window.loadCheckout = function () {

    cart = JSON.parse(localStorage.getItem("cart")) || [];

    const items =
        document.getElementById("checkoutItems");

    items.innerHTML = "";

    subTotal = 0;

    if (cart.length === 0) {

        items.innerHTML = `
        <p>Your cart is empty.</p>
        `;

        calculateTotal();

        return;

    }

    cart.forEach((product) => {

        const qty = product.qty || 1;

        const total = product.price * qty;

        subTotal += total;

        items.innerHTML += `

        <div class="checkout-item">

            <strong>${product.name}</strong>

            <br>

            Qty : ${qty}

            <br>

            ৳${product.price} × ${qty}

            <hr>

        </div>

        `;

    });

    calculateTotal();

};

// ==========================================
// Calculate Total
// ==========================================

window.calculateTotal = function () {

    grandTotal =
        subTotal +
        deliveryCharge -
        discount;

    document.getElementById("subTotal").innerHTML =
        "৳" + subTotal;

    document.getElementById("deliveryCharge").innerHTML =
        "৳" + deliveryCharge;

    document.getElementById("discount").innerHTML =
        "৳" + discount;

    document.getElementById("grandTotal").innerHTML =
        "৳" + grandTotal;

};
// ==========================================
// Apply Coupon
// ==========================================

window.applyCoupon = function () {

    const code =
        document.getElementById("couponCode")
        .value
        .trim()
        .toUpperCase();

    if (code === "PICKER10") {

        discount = subTotal * 0.10;

        alert("✅ 10% Discount Applied");

    }

    else if (code === "PICKER20") {

        discount = subTotal * 0.20;

        alert("✅ 20% Discount Applied");

    }

    else {

        discount = 0;

        alert("❌ Invalid Coupon");

    }

    calculateTotal();

};


// ==========================================
// Place Order
// ==========================================

window.placeOrder = async function () {

    const customerName =
        document.getElementById("customerName").value.trim();

    const customerPhone =
        document.getElementById("customerPhone").value.trim();

    const district =
        document.getElementById("customerDistrict").value.trim();

    const upazila =
        document.getElementById("customerUpazila").value.trim();

    const address =
        document.getElementById("customerAddress").value.trim();

    const paymentMethod =
        document.getElementById("paymentMethod").value;

    if (
        customerName === "" ||
        customerPhone === "" ||
        district === "" ||
        upazila === "" ||
        address === ""
    ) {

        alert("সব তথ্য পূরণ করুন");

        return;

    }

    if (cart.length === 0) {

        alert("Cart Empty");

        return;

    }

    try {

        await addDoc(

            collection(db, "orders"),

            {

                userId: currentUser.uid,

                customerName,

                phone: customerPhone,

                district,

                upazila,

                address,

                paymentMethod,

                items: cart,

                subtotal: subTotal,

                delivery: deliveryCharge,

                discount: discount,

                total: grandTotal,

                status: "Pending",

                orderDate: serverTimestamp()

            }

        );

        localStorage.removeItem("cart");

        alert("🎉 Order Placed Successfully");

        window.location.href =
            "order-success.html";

    }

    catch (error) {

        console.error(error);

        alert("❌ Order Failed");

    }

};
