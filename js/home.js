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
const bestSellerContainer =
document.getElementById("bestSellerProducts");

const newArrivalContainer =
document.getElementById("newArrivalProducts");
loadHomeProducts();
// ==========================================
// Auto Slider
// ==========================================

const sliderImages = [

"images/slider1.jpg",

"images/slider2.jpg",

"images/slider3.jpg"

];

let currentSlide = 0;

setInterval(()=>{

const image = document.getElementById("sliderImage");

if(!image) return;

currentSlide++;

if(currentSlide>=sliderImages.length){

currentSlide=0;

}

image.src = sliderImages[currentSlide];

},4000);
