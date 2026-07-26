import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

async function loadProducts() {

    const container = document.getElementById("productContainer");

    if (!container) return;

    container.innerHTML = "<h3>লোড হচ্ছে...</h3>";

    const snapshot = await getDocs(collection(db, "products"));

    let html = "";

    snapshot.forEach((doc) => {

        const p = doc.data();

        html += `

        <div class="product-card">

            <img src="${p.image}" alt="${p.name}">

            <h3>${p.name}</h3>

            <p>৳${p.price}</p>

            <button class="btn">

                🛒 কার্টে যোগ করুন

            </button>

        </div>

        `;

    });

    container.innerHTML = html;

}

loadProducts();
