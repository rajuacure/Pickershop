import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// ==========================================
// Load Homepage Products
// ==========================================

async function loadHomeProducts() {

    const flashContainer =
        document.getElementById("flashProducts");

    const featuredContainer =
        document.getElementById("featuredProducts");

    if (!flashContainer || !featuredContainer) return;

    flashContainer.innerHTML = "";
    featuredContainer.innerHTML = "";

    try {

        const snapshot =
            await getDocs(collection(db, "products"));

        snapshot.forEach(docItem => {

            const product = docItem.data();

            const card = `

<div class="product-card">

<img src="${product.image}" alt="${product.name}">

<div class="product-info">

<h3 class="product-title">
${product.name}
</h3>

<p class="product-price">
৳${product.price}
</p>

<a
href="product.html?id=${docItem.id}"
class="buy-btn">

View Details

</a>

</div>

</div>

`;

            // প্রথম ৮টি Product Flash Sale-এ
            if (flashContainer.children.length < 8) {
                flashContainer.innerHTML += card;
            }

            // Featured Product
            if (product.featured === true) {
                featuredContainer.innerHTML += card;
            }

        });

    }

    catch (error) {

        console.error(error);

    }

}

loadHomeProducts();
