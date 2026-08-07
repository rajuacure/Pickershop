import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ===============================
// Current User
// ===============================

let currentUser = null;

// ===============================
// Auto Login Check
// ===============================

onAuthStateChanged(auth, (user) => {

  if (!user) {

    location.href = "login.html";

    return;

  }

  currentUser = user;

  loadWishlist();

});


// ===============================
// Load Wishlist
// ===============================

window.loadWishlist = async function () {

  const container = document.getElementById("wishlistContainer");

  if (!container) return;

  container.innerHTML = "<p>Loading...</p>";

  try {

    const snapshot = await getDocs(

      collection(db, "users", currentUser.uid, "wishlist")

    );

    if (snapshot.empty) {

      container.innerHTML = `

        <div style="text-align:center;padding:50px;">

          <h2>❤️ Wishlist Empty</h2>

          <p>এখনো কোনো পণ্য Wishlist-এ যোগ করা হয়নি।</p>

        </div>

      `;

      return;

    }

    container.innerHTML = "";

    snapshot.forEach((docItem) => {

      const product = docItem.data();

      container.innerHTML += `

        <div class="wishlist-card">

          <img src="${product.image}" alt="${product.name}">

          <h3>${product.name}</h3>

          <p class="price">৳${product.price}</p>

          <div class="actions">

            <button onclick="moveToCart('${docItem.id}')">

              🛒 Add To Cart

            </button>

            <button class="remove" onclick="removeWishlist('${docItem.id}')">

              ❌ Remove

            </button>

          </div>

        </div>

      `;

    });

  } catch (error) {

    console.error(error);

    container.innerHTML = "<p>Wishlist Load Failed</p>";

  }

};


// ===============================
// Add Wishlist
// ===============================

window.addWishlist = async function (product) {

  if (!currentUser) {

    location.href = "login.html";

    return;

  }

  try {

    await setDoc(

      doc(db, "users", currentUser.uid, "wishlist", product.id),

      product

    );

    alert("❤️ Added To Wishlist");

  } catch (error) {

    console.error(error);

  }

};


// ===============================
// Remove Wishlist
// ===============================

window.removeWishlist = async function (id) {

  try {

    await deleteDoc(

      doc(db, "users", currentUser.uid, "wishlist", id)

    );

    loadWishlist();

  } catch (error) {

    console.error(error);

  }

};


// ===============================
// Move To Cart
// ===============================

window.moveToCart = async function (id) {

  try {

    const snap = await getDoc(

      doc(db, "users", currentUser.uid, "wishlist", id)

    );

    if (!snap.exists()) return;

    const product = snap.data();

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));

    await removeWishlist(id);

    alert("🛒 Added To Cart");

  } catch (error) {

    console.error(error);

  }

};


// ===============================
// Search Wishlist
// ===============================

window.searchWishlist = function () {

  const keyword = document
    .getElementById("wishlistSearch")
    .value
    .toLowerCase();

  const cards = document.querySelectorAll(".wishlist-card");

  cards.forEach((card) => {

    const text = card.innerText.toLowerCase();

    card.style.display = text.includes(keyword) ? "block" : "none";

  });

};


// ===============================
// Empty Wishlist
// ===============================

window.clearWishlist = async function () {

  if (!confirm("Wishlist Empty করবেন?")) return;

  const snapshot = await getDocs(

    collection(db, "users", currentUser.uid, "wishlist")

  );

  for (const item of snapshot.docs) {

    await deleteDoc(item.ref);

  }

  loadWishlist();

};
