// ===============================
// Picker Shop Script - Part 1
// ===============================

// Cart
let cart = JSON.parse(localStorage.getItem("pickerCart")) || [];

// Wishlist
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];


// ---------- Toast ----------

function showToast(message){

const toast=document.createElement("div");

toast.className="toast";

toast.innerHTML=message;

document.body.appendChild(toast);

setTimeout(()=>{
toast.classList.add("show");
},100);

setTimeout(()=>{
toast.remove();
},3000);

}


// ---------- Cart Counter ----------

function updateCartCount(){

const count=document.getElementById("cartCount");

if(count){

count.innerHTML=cart.length;

}

}


// ---------- Add To Cart ----------

function addToCart(name,price){

cart.push({

name:name,

price:price

});

localStorage.setItem("pickerCart",JSON.stringify(cart));

updateCartCount();

showToast(name+" কার্টে যোগ হয়েছে 🛒");

}


// ---------- Wishlist ----------

function addToWishlist(product){

if(!wishlist.includes(product)){

wishlist.push(product);

localStorage.setItem("wishlist",JSON.stringify(wishlist));

showToast(product+" Wishlist-এ যোগ হয়েছে ❤️");

}else{

showToast("এই পণ্যটি আগে থেকেই Wishlist-এ আছে");

}

}
// ===============================
// Picker Shop Script - Part 2
// ===============================


// ---------- Product Search ----------

function searchProducts(){

const input=document.getElementById("searchInput");

if(!input) return;

const keyword=input.value.toLowerCase();

const cards=document.querySelectorAll(".product-card");

cards.forEach(card=>{

const title=card.querySelector("h3").innerText.toLowerCase();

if(title.includes(keyword)){

card.style.display="block";

}else{

card.style.display="none";

}

});

}


// ---------- Category Filter ----------

function filterProducts(category){

const cards=document.querySelectorAll(".product-card");

cards.forEach(card=>{

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


// ---------- Scroll To Top ----------

const topBtn=document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

if(!topBtn) return;

if(window.scrollY>300){

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


// ---------- Loader ----------




// ---------- Newsletter ----------

function subscribeNewsletter(){

const email=document.querySelector(".newsletter input");

if(!email) return;

if(email.value.trim()===""){

showToast("ইমেইল লিখুন
          // ===============================
// Picker Shop Script - Part 3
// Cart Page & Wishlist
// ===============================


// ---------- Load Cart ----------

function loadCart(){

const cartItems=document.getElementById("cartItems");

const totalPrice=document.getElementById("totalPrice");

if(!cartItems) return;

cartItems.innerHTML="";

let total=0;

cart.forEach((item,index)=>{

total+=item.price;

cartItems.innerHTML+=`

<div class="cart-item">

<h3>${item.name}</h3>

<p>৳${item.price}</p>

<button onclick="removeItem(${index})">

❌ Remove

</button>

</div>

`;

});

if(totalPrice){

totalPrice.innerHTML="মোট মূল্য: ৳"+total;

}

updateCartCount();

}



// ---------- Remove Item ----------

function removeItem(index){

cart.splice(index,1);

localStorage.setItem(

"pickerCart",

JSON.stringify(cart)

);

loadCart();

updateCartCount();

showToast("পণ্যটি কার্ট থেকে সরানো হয়েছে");

}



// ---------- Clear Cart ----------

function clearCart(){

if(cart.length===0){

showToast("কার্ট খালি");

return;

}

if(confirm("সব পণ্য মুছে ফেলবেন?")){

cart=[];

localStorage.setItem(

"pickerCart",

JSON.stringify(cart)

);

loadCart();

updateCartCount();

showToast("কার্ট খালি করা হয়েছে");

}

}



// ---------- WhatsApp Checkout ----------

function checkoutWhatsApp(){

if(cart.length===0){

showToast("কার্ট খালি");

return;

}

let text="আসসালামু আলাইকুম,%0A";

text+="আমি নিচের পণ্যগুলো অর্ডার করতে চাই:%0A%0A";

let total=0;

cart.forEach(item=>{

text+=`${item.name} - ৳${item.price}%0A`;

total+=item.price;

});

text+=`%0Aমোট = ৳${total}`;

window.open(

"https://wa.me/8801400599748?text="+text,

"_blank"

);

}



// ---------- Load Wishlist ----------

function loadWishlist(){

const list=document.getElementById("wishlistItems");

if(!list) return;

list.innerHTML="";

wishlist.forEach((item,index)=>{

list.innerHTML+=`

<div class="wish-item">

<h3>${item}</h3>

<button onclick="removeWishlistItem(${index})">

❌ Remove

</button>

</div>

`;

});

}



// ---------- Remove Wishlist ----------

function removeWishlistItem(index){

wishlist.splice(index,1);

localStorage.setItem(

"wishlist",

JSON.stringify(wishlist)

);

loadWishlist();

showToast("Wishlist থেকে সরানো হয়েছে");

}



// ---------- Auto Load ----------

document.addEventListener("DOMContentLoaded",()=>{

updateCartCount();

loadCart();

loadWishlist();

});
// ==========================
// Product Review
// ==========================

function submitReview(){

const name=document.getElementById("reviewName");

const review=document.getElementById("reviewText");

const list=document.getElementById("reviewList");

if(!name || !review || !list) return;

if(name.value.trim()==="" || review.value.trim()===""){

showToast("নাম ও রিভিউ লিখুন");

return;

}

list.innerHTML += `
<div class="review-card">
<h4>${name.value}</h4>
<p>${review.value}</p>
</div>
`;

name.value="";
review.value="";

showToast("রিভিউ যোগ হয়েছে ⭐");

}


// ==========================
// Like Button
// ==========================

let likes=0;

function likeProduct(){

likes++;

const count=document.getElementById("likeCount");

if(count){

count.innerHTML=likes;

}

showToast("ধন্যবাদ ❤️");

}


// ==========================
// WhatsApp Share
// ==========================

function shareWhatsApp(){

const url=encodeURIComponent(window.location.href);

window.open(
"https://wa.me/?text="+url,
"_blank"
);

}


// ==========================
// Copy Link
// ==========================

function copyLink(){

navigator.clipboard.writeText(window.location.href);

showToast("লিংক কপি হয়েছে 🔗");

}
window.addEventListener("load", function () {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "none";
    }
});
