 // =====================================
// Picker Shop V3
// script.js - Part 1
// =====================================

// ---------- Cart ----------

let cart = JSON.parse(localStorage.getItem("pickerCart")) || [];

function saveCart() {
    localStorage.setItem("pickerCart", JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
        cartCount.innerText = cart.length;
    }
}

function addToCart(name, price) {

    cart.push({
        name: name,
        price: price
    });

    saveCart();

    updateCartCount();

    showToast("🛒 কার্টে যোগ হয়েছে");
}

// ---------- Wishlist ----------

let wishlist = JSON.parse(localStorage.getItem("pickerWishlist")) || [];

function saveWishlist() {
    localStorage.setItem("pickerWishlist", JSON.stringify(wishlist));
}

function addToWishlist(product) {

    if (!wishlist.includes(product)) {

        wishlist.push(product);

        saveWishlist();

        showToast("❤️ Wishlist-এ যোগ হয়েছে");

    } else {

        showToast("এই পণ্যটি আগে থেকেই Wishlist-এ আছে");

    }

}

// ---------- Toast ----------

function showToast(message) {

    let toast = document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(function () {

        toast.classList.add("show");

    }, 100);

    setTimeout(function () {

        toast.remove();

    }, 3000);

}

// ---------- Page Load ----------

window.onload = function () {

    updateCartCount();

};
// =====================================
// Picker Shop V3
// script.js - Part 2
// =====================================

// ---------- Product Search ----------

function searchProducts(){

const input=document.getElementById("searchInput");

if(!input) return;

const filter=input.value.toLowerCase();

const cards=document.querySelectorAll(".product-card");

cards.forEach(function(card){

const title=card.querySelector("h3").innerText.toLowerCase();

if(title.indexOf(filter)>-1){

card.style.display="block";

}else{

card.style.display="none";

}

});

}

// ---------- Category Filter ----------

function filterProducts(category){

const cards=document.querySelectorAll(".product-card");

cards.forEach(function(card){

if(category==="all"){

card.style.display="block";

return;

}

if(card.dataset.category===category){

card.style.display="block";

}else{

card.style.display="none";

}

});

}

// ---------- Back To Top ----------

const topBtn=document.getElementById("topBtn");

window.addEventListener("scroll",function(){

if(!topBtn) return;

if(document.documentElement.scrollTop>300){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

});

function topFunction(){

window.scrollTo({

top:0,

behavior:"smooth"

});

}

// ---------- Smooth Anchor ----------

document.querySelectorAll('a[href^="#"]').forEach(function(link){

link.addEventListener("click",function(e){

const target=document.querySelector(this.getAttribute("href"));

if(target){

e.preventDefault();

target.scrollIntoView({

behavior:"smooth"

});

}

});

});
// =====================================
// Picker Shop V3
// script.js - Part 3
// =====================================

// ---------- Load Cart ----------

function loadCart(){

const cartItems=document.getElementById("cartItems");

const totalPrice=document.getElementById("totalPrice");

if(!cartItems || !totalPrice) return;

cartItems.innerHTML="";

let total=0;

cart.forEach(function(item,index){

total+=item.price;

cartItems.innerHTML+=`

<div class="card" style="margin-bottom:20px;padding:20px;">

<h3>${item.name}</h3>

<p>৳${item.price}</p>

<button class="wish-btn"
onclick="removeItem(${index})">

❌ Remove

</button>

</div>

`;

});

totalPrice.innerHTML="মোট: ৳"+total;

updateCartCount();

}

// ---------- Remove Cart Item ----------

function removeItem(index){

cart.splice(index,1);

saveCart();

loadCart();

showToast("❌ পণ্য সরানো হয়েছে");

}

// ---------- WhatsApp Checkout ----------

function checkoutWhatsApp(){

if(cart.length===0){

alert("কার্ট খালি");

return;

}

let message="আসসালামু আলাইকুম,%0Aআমি নিচের পণ্যগুলো অর্ডার করতে চাই:%0A%0A";

let total=0;

cart.forEach(function(item){

message+="• "+item.name+" - ৳"+item.price+"%0A";

total+=item.price;

});

message+="%0Aমোট মূল্য: ৳"+total;

window.open(

"https://wa.me/8801400599748?text="+message,

"_blank"

);

}

// ---------- Wishlist Page ----------

function loadWishlist(){

const box=document.getElementById("wishlistItems");

if(!box) return;

box.innerHTML="";

if(wishlist.length===0){

box.innerHTML="<h3>❤️ Wishlist খালি</h3>";

return;

}

wishlist.forEach(function(item,index){

box.innerHTML+=`

<div class="card" style="margin-bottom:20px;padding:20px;">

<h3>${item}</h3>

<button class="wish-btn"
onclick="removeWishlist(${index})">

🗑️ Remove

</button>

</div>

`;

});

}

// ---------- Remove Wishlist ----------

function removeWishlist(index){

wishlist.splice(index,1);

saveWishlist();

loadWishlist();

showToast("❤️ Wishlist থেকে সরানো হয়েছে");

}

// ---------- Page Ready ----------

document.addEventListener("DOMContentLoaded",function(){

updateCartCount();

loadCart();

loadWishlist();

});
