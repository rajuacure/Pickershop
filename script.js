// ==========================================
// Picker Shop V2
// script.js
// ==========================================

// ===============================
// Sticky Header
// ===============================

window.addEventListener("scroll",()=>{

const header=document.querySelector(".header");

if(!header) return;

if(window.scrollY>80){

header.classList.add("sticky");

}else{

header.classList.remove("sticky");

}

});

// ===============================
// Back To Top
// ===============================

const topButton=document.createElement("button");

topButton.id="topButton";

topButton.innerHTML="⬆";

document.body.appendChild(topButton);

topButton.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

window.addEventListener("scroll",()=>{

if(window.scrollY>300){

topButton.style.display="block";

}else{

topButton.style.display="none";

}

});

// ===============================
// Loading Animation
// ===============================

window.addEventListener("load",()=>{

const loader=document.getElementById("loader");

if(loader){

loader.style.display="none";

}

});

// ===============================
// Search Product
// ===============================

window.searchProduct=function(){

const keyword=document
.getElementById("searchInput")
.value
.toLowerCase();

const cards=document.querySelectorAll(".product-card");

cards.forEach(card=>{

const text=card.innerText.toLowerCase();

card.style.display=text.includes(keyword)

?

"block"

:

"none";

});

};

// ===============================
// Newsletter
// ===============================

window.subscribeNews=function(){

const email=document
.getElementById("newsletterEmail")
.value;

if(email===""){

alert("Email লিখুন");

return;

}

alert("ধন্যবাদ! Newsletter Subscribe হয়েছে।");

};

// ===============================
// Dark Mode
// ===============================

window.toggleDarkMode=function(){

document.body.classList.toggle("dark");

localStorage.setItem(

"darkmode",

document.body.classList.contains("dark")

);

};

if(localStorage.getItem("darkmode")=="true"){

document.body.classList.add("dark");

}

// ===============================
// Wishlist Count
// ===============================

function updateWishlistCount(){

const wishlist=

JSON.parse(

localStorage.getItem("wishlist")

||"[]"

);

const badge=

document.getElementById("wishlistCount");

if(badge){

badge.innerHTML=wishlist.length;

}

}

// ===============================
// Cart Count
// ===============================

function updateCartCount(){

const cart=

JSON.parse(

localStorage.getItem("cart")

||"[]"

);

const badge=

document.getElementById("cartCount");

if(badge){

badge.innerHTML=cart.length;

}

}

updateCartCount();

updateWishlistCount();
