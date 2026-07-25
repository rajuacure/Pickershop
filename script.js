let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem("pickerCart", JSON.stringify(cart));
  alert(name + " কার্টে যোগ হয়েছে!");
}
