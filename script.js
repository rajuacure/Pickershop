let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem("pickerCart", JSON.stringify(cart));
  alert(name + " কার্টে যোগ হয়েছে!");
}
function loadCart(){

let cart=JSON.parse(localStorage.getItem("pickerCart"))||[];

let html="";
let total=0;

cart.forEach((item,index)=>{

total+=item.price;

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
