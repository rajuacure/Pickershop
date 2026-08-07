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
