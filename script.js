function showToast(message){

let toast=document.createElement("div");

toast.className="toast";

toast.innerHTML=message;

document.body.appendChild(toast);

setTimeout(()=>{

toast.classList.add("show");

},100);

setTimeout(()=>{

toast.remove();

},3000);
function updateCartCount(){

let cart=JSON.parse(localStorage.getItem("pickerCart"))||[];

let count=document.getElementById("cartCount");

if(count){

count.innerHTML=cart.length;

}

}

updateCartCount();
}
function loadCart(){

let cart=JSON.parse(localStorage.getItem("pickerCart"))||[];

let html="";
let total=0;

cart.forEach((item,index)=>{

total+=item.price;
updateCartCount();
html+=`
<div style="background:#fff;padding:15px;margin:10px 0;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,.1);">

<h3>${item.name}</h3>

<p>৳${item.price}</p>

<button onclick="removeItem(${index})">❌ Remove</button>

</div>
`;

});

let cartBox=document.getElementById("cartItems");

if(cartBox){

cartBox.innerHTML=html;

document.getElementById("totalPrice").innerHTML="মোট: ৳"+total;

}

}

function removeItem(index){

let cart=JSON.parse(localStorage.getItem("pickerCart"))||[];

cart.splice(index,1);

localStorage.setItem("pickerCart",JSON.stringify(cart));

loadCart();

}

function checkoutWhatsApp(){

let cart=JSON.parse(localStorage.getItem("pickerCart"))||[];

if(cart.length==0){

alert("কার্ট খালি");

return;

}

let text="আমি নিচের পণ্যগুলো অর্ডার করতে চাই:%0A%0A";

cart.forEach(item=>{

text+=item.name+" - ৳"+item.price+"%0A";

});

window.open("https://wa.me/8801400599748?text="+text);

}

loadCart();
function addToWishlist(product){

let wishlist=JSON.parse(localStorage.getItem("wishlist"))||[];

if(!wishlist.includes(product)){

wishlist.push(product);

localStorage.setItem("wishlist",JSON.stringify(wishlist));

alert(product+" Wishlist-এ যোগ হয়েছে ❤️");

}else{

alert("এই পণ্যটি আগে থেকেই Wishlist-এ আছে");

}

}
function searchProducts(){

let input=document.getElementById("searchInput").value.toLowerCase();

let cards=document.querySelectorAll(".product-card");

cards.forEach(function(card){

let name=card.querySelector("h3").innerText.toLowerCase();

if(name.includes(input)){

card.style.display="block";

}else{

card.style.display="none";

}

});

}
function filterProducts(category){

let cards=document.querySelectorAll(".product-card");

cards.forEach(card=>{

if(category==="all"){

card.style.display="block";

}else if(card.dataset.category===category){

card.style.display="block";

}else{

card.style.display="none";

}

});

}
window.onload=function(){

let loader=document.getElementById("loader");

if(loader){

loader.style.display="none";

}

}
