// ==========================================
// Picker Shop V2
// products.js
// Phase 2 - Part 6.1
// ==========================================

import { db } from "./firebase.js";

import {
collection,
getDocs,
query,
orderBy,
limit
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ==========================================
// Load Featured Products
// ==========================================

window.loadFeaturedProducts = async function(){

const container =
document.getElementById("featuredProducts");

if(!container) return;

container.innerHTML="<h3>Loading...</h3>";

try{

const q =
query(
collection(db,"products"),
orderBy("createdAt","desc"),
limit(8)
);

const snapshot =
await getDocs(q);

let html="";

snapshot.forEach(docItem=>{

const p=docItem.data();

html+=`

<div class="product-card">

<img src="${p.image}" alt="${p.name}">

<h3>${p.name}</h3>

<p class="price">

৳${p.price}

</p>

<div class="product-buttons">

<button
class="btn"
onclick="addToCart({

id:'${docItem.id}',

name:'${p.name}',

price:${p.price},

image:'${p.image}',

stock:${p.stock}

})">

🛒 কার্টে যোগ করুন

</button>

<button
class="wish-btn"
onclick="addToWishlist({

id:'${docItem.id}',

name:'${p.name}',

price:${p.price},

image:'${p.image}',

stock:${p.stock}

})">

❤️

</button>

</div>

</div>

`;

});

container.innerHTML=html;

}

catch(error){

console.error(error);

container.innerHTML="<h3>Product Load Failed</h3>";

}

};

// ==========================================
// Auto Load
// ==========================================

document.addEventListener("DOMContentLoaded",()=>{

loadFeaturedProducts();

});
// ==========================================
// Picker Shop V2
// Phase 2 - Part 6.3
// Best Seller + Badge + Quick View
// ==========================================

// ------------------------------
// Best Seller
// ------------------------------

window.showBestSeller = function () {

    const best = allProducts.filter(p => p.bestSeller === true);

    currentPage = 1;

    renderProducts(best);

};

// ------------------------------
// New Arrival
// ------------------------------

window.showNewArrival = function () {

    const latest = [...allProducts].sort((a, b) => {

        return new Date(b.createdAt) - new Date(a.createdAt);

    });

    currentPage = 1;

    renderProducts(latest);

};

// ------------------------------
// Discount Badge
// ------------------------------

window.getDiscountBadge = function (product) {

    if (!product.discount || product.discount <= 0) {

        return "";

    }

    return `<span class="discount-badge">

-${product.discount}%

</span>`;

};

// ------------------------------
// Stock Badge
// ------------------------------

window.getStockBadge = function (product) {

    if (product.stock <= 0) {

        return `<span class="stock-badge out">

Out Of Stock

</span>`;

    }

    if (product.stock <= 5) {

        return `<span class="stock-badge low">

Low Stock

</span>`;

    }

    return "";

};

// ------------------------------
// Quick View
// ------------------------------

window.quickView = function (id) {

    const product =

        allProducts.find(p => p.id === id);

    if (!product) return;

    document.getElementById("quickImage").src = product.image;

    document.getElementById("quickName").innerHTML = product.name;

    document.getElementById("quickPrice").innerHTML =

        "৳" + product.price;

    document.getElementById("quickDescription").innerHTML =

        product.description || "";

    document.getElementById("quickModal").style.display = "flex";

};

// ------------------------------
// Close Quick View
// ------------------------------

window.closeQuickView = function () {

    document.getElementById("quickModal").style.display = "none";

};
