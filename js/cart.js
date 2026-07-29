// ==========================================
// Picker Shop Cart System
// ==========================================

let cart = JSON.parse(localStorage.getItem("pickerCart")) || [];

function saveCart() {
    localStorage.setItem("pickerCart", JSON.stringify(cart));
    updateCartCount();
}

window.addToCart = function(product) {

    const exists = cart.find(item => item.id === product.id);

    if (exists) {

        exists.qty++;

    } else {

        product.qty = 1;

        cart.push(product);

    }

    saveCart();

    alert("✅ Product Added To Cart");

}

window.updateCartCount = function() {

    const count = document.getElementById("cartCount");

    if (!count) return;

    let total = 0;

    cart.forEach(item => {

        total += item.qty;

    });

    count.innerHTML = total;

}

updateCartCount();
