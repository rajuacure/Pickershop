import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

window.placeOrder = async function () {

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();

    if (!name || !phone || !address) {
        alert("সব তথ্য পূরণ করুন");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("pickerCart")) || [];

    if (cart.length === 0) {
        alert("কার্ট খালি");
        return;
    }

    try {

        await addDoc(collection(db, "orders"), {
const orderNumber =
"PKS-" +
Date.now();

localStorage.setItem(
"lastOrder",
orderNumber
);
            customerName: name,
            phone: phone,
            address: address,
            items: cart,
            status: "Pending",
            createdAt: Timestamp.now()

        });

        localStorage.removeItem("pickerCart");

        alert("✅ Order সফলভাবে গ্রহণ করা হয়েছে");

        window.location.href = "success.html";

    } catch (err) {

        console.error(err);

        alert("❌ Order Save Failed");

    }

};
