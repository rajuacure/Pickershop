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
