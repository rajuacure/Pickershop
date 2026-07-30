import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user)=>{

if(!user){

location.href="login.html";

return;

}

let totalOrders=0;
let totalSpent=0;

const q=query(
collection(db,"orders"),
where("userId","==",user.uid)
);

const snapshot=await getDocs(q);

snapshot.forEach(doc=>{

totalOrders++;

totalSpent+=Number(doc.data().total||0);

});

document.getElementById("totalOrders").innerHTML=totalOrders;

document.getElementById("totalSpent").innerHTML="৳"+totalSpent;

const wish=await getDocs(
collection(db,"users",user.uid,"wishlist")
);

document.getElementById("wishlistCount").innerHTML=wish.size;

const cart=JSON.parse(localStorage.getItem("cart"))||[];

document.getElementById("cartCount").innerHTML=cart.length;

});
