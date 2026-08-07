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
// =====================================
// Picker Shop V3
// script.js - Part 4
// =====================================

// ---------- Dark Mode ----------

function toggleDarkMode(){

document.body.classList.toggle("dark-mode");

if(document.body.classList.contains("dark-mode")){

localStorage.setItem("theme","dark");

showToast("🌙 Dark Mode চালু হয়েছে");

}else{

localStorage.setItem("theme","light");

showToast("☀️ Light Mode চালু হয়েছে");

}

}

if(localStorage.getItem("theme")==="dark"){

document.body.classList.add("dark-mode");

}

// ---------- Product Sort ----------

function sortProducts(){

const container=document.querySelector(".products");

if(!container) return;

const cards=Array.from(container.querySelectorAll(".product-card"));

cards.sort(function(a,b){

const priceA=parseInt(a.querySelector("p").innerText.replace(/[^\d]/g,""));

const priceB=parseInt(b.querySelector("p").innerText.replace(/[^\d]/g,""));

return priceA-priceB;

});

cards.forEach(card=>container.appendChild(card));

showToast("💰 কম দাম অনুযায়ী সাজানো হয়েছে");

}

// ---------- Newsletter ----------

function subscribeNewsletter(){

const email=document.querySelector(".newsletter input");

if(!email) return;

if(email.value.trim()===""){

alert("আপনার ইমেইল লিখুন");

return;

}

showToast("📩 সাবস্ক্রাইব সফল হয়েছে");

email.value="";

}

// ---------- Page Ready ----------

document.addEventListener("DOMContentLoaded",function(){

const btn=document.querySelector(".newsletter button");

if(btn){

btn.addEventListener("click",function(e){

e.preventDefault();

subscribeNewsletter();

});

}

});
// =====================================
// Picker Shop V3
// script.js - Part 5
// =====================================

// ---------- Copy Coupon ----------

function copyCoupon(){

const coupon="PICKER10";

navigator.clipboard.writeText(coupon);

showToast("🎉 Coupon Code কপি হয়েছে: " + coupon);

}

// ---------- Share Website ----------

function shareWebsite(){

const url=window.location.href;

if(navigator.share){

navigator.share({

title:"Picker Shop",

text:"হারবাল ও প্রাকৃতিক পণ্যের বিশ্বস্ত অনলাইন শপ",

url:url

});

}else{

navigator.clipboard.writeText(url);

showToast("🔗 Website Link কপি হয়েছে");

}

}

// ---------- Live Date ----------

function updateDate(){

const box=document.getElementById("todayDate");

if(box){

const d=new Date();

box.innerHTML=d.toLocaleDateString("bn-BD");

}

}

updateDate();

// ---------- Product Counter ----------

function productCounter(){

const count=document.querySelectorAll(".product-card").length;

const box=document.getElementById("productCount");

if(box){

box.innerHTML=count;

}

}

productCounter();

// ---------- Welcome Message ----------

setTimeout(function(){

showToast("🌿 Picker Shop-এ আপনাকে স্বাগতম");

},1500);
// =====================================
// Picker Shop V4
// Product Modal
// =====================================

function openModal(title, price, description, image, realPrice){

const modal=document.getElementById("productModal");

document.getElementById("modalTitle").innerText=title;

document.getElementById("modalPrice").innerText=price;

document.getElementById("modalDescription").innerText=description;

document.getElementById("modalImage").src=image;

document.getElementById("modalCartBtn").onclick=function(){

addToCart(title, realPrice);

closeModal();

};

modal.style.display="flex";

}

function closeModal(){

document.getElementById("productModal").style.display="none";

}

// Modal-এর বাইরে ক্লিক করলে বন্ধ হবে

window.onclick=function(event){

const modal=document.getElementById("productModal");

if(event.target===modal){

closeModal();

}

}

// ESC চাপলে বন্ধ হবে

document.addEventListener("keydown",function(e){

if(e.key==="Escape"){

closeModal();

}

});
// ==========================
// Product Gallery
// ==========================

function changeImage(image){

let card=image.closest(".card");

let mainImage=card.querySelector("img");

mainImage.src=image.src;

}
// ==========================
// Wishlist Counter
// ==========================

function updateWishlistCount(){

const count=document.getElementById("wishlistCount");

if(count){

count.innerText=wishlist.length;

}

}

// পুরনো addToWishlist() এর শেষে এই লাইনটি যোগ করুন:
// updateWishlistCount();

// Page Load

document.addEventListener("DOMContentLoaded",function(){

updateWishlistCount();

});

// ==========================
// Recently Viewed
// ==========================

function saveRecentlyViewed(product){

let viewed=JSON.parse(localStorage.getItem("recentProducts"))||[];

viewed=viewed.filter(item=>item!==product);

viewed.unshift(product);

viewed=viewed.slice(0,5);

localStorage.setItem("recentProducts",JSON.stringify(viewed));

}
// =====================================
// Picker Shop V6
// Checkout
// =====================================

function submitOrder(){

const name=document.getElementById("customerName").value.trim();

const phone=document.getElementById("customerPhone").value.trim();

const address=document.getElementById("customerAddress").value.trim();

const payment=document.getElementById("paymentMethod").value;

if(name==="" || phone==="" || address===""){

alert("অনুগ্রহ করে সব তথ্য পূরণ করুন।");

return;

}

let cart=JSON.parse(localStorage.getItem("pickerCart")) || [];

if(cart.length===0){

alert("আপনার কার্ট খালি।");

return;

}

let message="🛒 Picker Shop Order%0A%0A";

message+="👤 নাম: "+name+"%0A";

message+="📞 মোবাইল: "+phone+"%0A";

message+="📍 ঠিকানা: "+address+"%0A";

message+="💳 পেমেন্ট: "+payment+"%0A%0A";

message+="📦 অর্ডারের পণ্যসমূহ:%0A";

let total=0;

cart.forEach(function(item,index){

message+=(index+1)+". "+item.name+" - ৳"+item.price+"%0A";

total+=item.price;

});

message+="%0A💰 মোট মূল্য: ৳"+total;

window.open(

"https://wa.me/8801400599748?text="+message,

"_blank"

);

// Order শেষ হলে Cart খালি করা

localStorage.removeItem("pickerCart");

cart=[];

updateCartCount();

alert("আপনার অর্ডার সফলভাবে প্রস্তুত হয়েছে।");

window.location.href="index.html";

}
