let allProducts = [];
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
import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

async function loadProducts() {

    const container = document.getElementById("productContainer");

    if (!container) return;

    container.innerHTML = "<h3 style='text-align:center;'>⏳ Product Loading...</h3>";

    try {

        const snapshot = await getDocs(collection(db, "products"));

        if (snapshot.empty) {

            container.innerHTML = "<h3 style='text-align:center;'>কোনো Product পাওয়া যায়নি।</h3>";

            return;

        }

        let html = "";
let allProducts = [];
        snapshot.forEach((docItem) => {
allProducts.push({

id: docItem.id,

...p

});
            const p = docItem.data();

            html += `

            <div class="product-card">

                ${p.featured ? '<span class="product-badge">⭐ Featured</span>' : ""}

                <img src="${p.image}" alt="${p.name}">

                <div class="product-info">

                    <h3>${p.name}</h3>

                    <p class="price">৳${p.price}</p>

                    <div class="product-buttons">

                        <a href="product.html?id=${docItem.id}" class="btn">
                            👁 বিস্তারিত
                        </a>

                        <button class="btn cart-btn">
                            🛒 কার্টে যোগ করুন
                        </button>

                    </div>

                </div>

            </div>

            `;

        });

        container.innerHTML = html;

    } catch (error) {

        console.error(error);

        container.innerHTML = "<h3 style='text-align:center;color:red;'>❌ Product Load Failed</h3>";

    }

}

loadProducts();
// ==========================================
// Search + Filter + Sort
// ==========================================

function renderProducts(products){

const container =
document.getElementById("productContainer");

container.innerHTML="";

products.forEach(product=>{

container.innerHTML += `

<div class="product-card">

${product.featured
? '<span class="product-badge">⭐ Featured</span>'
: ""}

<img src="${product.image}" alt="${product.name}">

<div class="product-info">

<h3>${product.name}</h3>

<p class="price">

৳${product.price}

</p>

<div class="product-buttons">

<a
href="product.html?id=${product.id}"
class="btn">

👁 বিস্তারিত

</a>

<button class="btn">

🛒 কার্টে যোগ করুন

</button>

</div>

</div>

</div>

`;

});

}
document.getElementById("searchInput")
?.addEventListener("input",(e)=>{

const keyword =
e.target.value.toLowerCase();

const filtered =
allProducts.filter(p=>

p.name.toLowerCase().includes(keyword)

);

renderProducts(filtered);

});
document.getElementById("categoryFilter")
?.addEventListener("change",(e)=>{

const category =
e.target.value;

if(category==""){

renderProducts(allProducts);

return;

}

const filtered =
allProducts.filter(p=>

p.category===category

);

renderProducts(filtered);

});
document.getElementById("sortProducts")
?.addEventListener("change",(e)=>{

let products=[...allProducts];

if(e.target.value=="low"){

products.sort((a,b)=>a.price-b.price);

}

if(e.target.value=="high"){

products.sort((a,b)=>b.price-a.price);

}

renderProducts(products);

});
