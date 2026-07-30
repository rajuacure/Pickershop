// ==========================================
// Picker Shop V2
// cart.js
// Part 5.1
// ==========================================

// -----------------------------
// Local Cart
// -----------------------------

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// -----------------------------
// Save Cart
// -----------------------------

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}

// -----------------------------
// Cart Count
// -----------------------------

export function updateCartCount() {

    const badge =
        document.getElementById("cartCount");

    if (!badge) return;

    let total = 0;

    cart.forEach(item => {

        total += item.qty;

    });

    badge.innerHTML = total;

}

// -----------------------------
// Add To Cart
// -----------------------------

window.addToCart = function (product) {

    const index =
        cart.findIndex(i => i.id === product.id);

    if (index > -1) {

        cart[index].qty++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: Number(product.price),

            image: product.image,

            qty: 1

        });

    }

    saveCart();

    updateCartCount();

    alert("✅ কার্টে যোগ হয়েছে");

};

// -----------------------------
// Remove Item
// -----------------------------

window.removeCartItem = function (id) {

    cart =
        cart.filter(item => item.id !== id);

    saveCart();

    renderCart();

};

// -----------------------------
// Increase Qty
// -----------------------------

window.increaseQty = function (id) {

    cart.forEach(item => {

        if (item.id === id) {

            item.qty++;

        }

    });

    saveCart();

    renderCart();

};

// -----------------------------
// Decrease Qty
// -----------------------------

window.decreaseQty = function (id) {

    cart.forEach(item => {

        if (item.id === id) {

            item.qty--;

            if (item.qty < 1) {

                item.qty = 1;

            }

        }

    });

    saveCart();

    renderCart();

};
// ==========================================
// Render Cart
// Part 5.2
// ==========================================

window.renderCart = function () {

    const container = document.getElementById("cartItems");

    if (!container) return;

    if (cart.length === 0) {

        container.innerHTML = `

        <div class="empty-cart">

            <h2>🛒 আপনার কার্ট খালি</h2>

            <a href="products.html" class="btn">

                কেনাকাটা শুরু করুন

            </a>

        </div>

        `;

        updateSummary();

        return;

    }

    let html = "";

    cart.forEach(item => {

        html += `

        <div class="cart-item">

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-info">

                <h3>${item.name}</h3>

                <p>৳${item.price}</p>

            </div>

            <div class="cart-qty">

                <button onclick="decreaseQty('${item.id}')">−</button>

                <span>${item.qty}</span>

                <button onclick="increaseQty('${item.id}')">+</button>

            </div>

            <div class="cart-total">

                ৳${item.price * item.qty}

            </div>

            <button class="remove-btn"

            onclick="removeCartItem('${item.id}')">

                🗑

            </button>

        </div>

        `;

    });

    container.innerHTML = html;

    updateSummary();

};

// ==========================================
// Coupon
// ==========================================

let discount = 0;

window.applyCoupon = function () {

    const code =

        document.getElementById("couponCode")?.value

        .trim()

        .toUpperCase();

    if (code === "PICKER10") {

        discount = 10;

        alert("✅ 10% Discount Applied");

    }

    else if (code === "PICKER20") {

        discount = 20;

        alert("✅ 20% Discount Applied");

    }

    else {

        discount = 0;

        alert("❌ Invalid Coupon");

    }

    updateSummary();

};

// ==========================================
// Order Summary
// ==========================================

window.updateSummary = function () {

    let subtotal = 0;

    cart.forEach(item => {

        subtotal += item.price * item.qty;

    });

    const discountAmount =

        subtotal * discount / 100;

    const delivery =

        subtotal > 1000 ? 0 : 80;

    const total =

        subtotal - discountAmount + delivery;

    const itemCount =

        cart.reduce((sum, item) => sum + item.qty, 0);

    if (document.getElementById("cartItemCount"))

        document.getElementById("cartItemCount").innerHTML = itemCount;

    if (document.getElementById("subTotal"))

        document.getElementById("subTotal").innerHTML =

            "৳" + subtotal;

    if (document.getElementById("discount"))

        document.getElementById("discount").innerHTML =

            "৳" + discountAmount;

    if (document.getElementById("deliveryCharge"))

        document.getElementById("deliveryCharge").innerHTML =

            "৳" + delivery;

    if (document.getElementById("grandTotal"))

        document.getElementById("grandTotal").innerHTML =

            "৳" + total;

    localStorage.setItem("orderSummary",

        JSON.stringify({

            subtotal,

            discount: discountAmount,

            delivery,

            total

        })

    );

};

// ==========================================
// Auto Load
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    renderCart();

    updateCartCount();

});
