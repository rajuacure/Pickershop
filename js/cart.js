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
