import { db } from "./firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

let cart =
JSON.parse(localStorage.getItem("pickerCart")) || [];

const items =
document.getElementById("checkoutItems");

let subTotal = 0;
let delivery = 80;
let discount = 0;

cart.forEach(item => {

    subTotal += item.price * item.qty;

    items.innerHTML += `

    <p>

    ${item.name}

    × ${item.qty}

    = ৳${item.price * item.qty}

    </p>

    `;

});

document.getElementById("subTotal").innerHTML =
"৳" + subTotal;

document.getElementById("discount").innerHTML =
"৳" + discount;

document.getElementById("deliveryCharge").innerHTML =
"৳" + delivery;

document.getElementById("finalTotal").innerHTML =
"৳" + (subTotal + delivery - discount);

window.applyCoupon = function () {

    const code =
    document.getElementById("couponCode").value;

    if (code == "PICKER10") {

        discount = 100;

        alert("✅ Coupon Applied");

    } else {

        discount = 0;

        alert("❌ Invalid Coupon");

    }

    document.getElementById("discount").innerHTML =
    "৳" + discount;

    document.getElementById("finalTotal").innerHTML =
    "৳" + (subTotal + delivery - discount);

};

window.placeOrder = async function () {

    const customerName =
    document.getElementById("customerName").value.trim();

    const customerPhone =
    document.getElementById("customerPhone").value.trim();

    const customerAddress =
    document.getElementById("customerAddress").value.trim();

    const paymentMethod =
    document.getElementById("paymentMethod").value;

    if (
        customerName == "" ||
        customerPhone == "" ||
        customerAddress == ""
    ) {

        alert("সব তথ্য পূরণ করুন");

        return;

    }

    try {

        await addDoc(collection(db, "orders"), {

            customerName,

            phone: customerPhone,

            address: customerAddress,

            paymentMethod,

            products: cart,

            subtotal: subTotal,

            delivery,

            discount,

            total: subTotal + delivery - discount,

            status: "Pending",

            createdAt: new Date().toISOString()

        });

        localStorage.removeItem("pickerCart");

        alert("✅ Order Placed Successfully");

        window.location.href = "index.html";

    }

    catch (error) {

        console.error(error);

        alert("❌ Order Failed");

    }

};
