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
