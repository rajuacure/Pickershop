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
