/* =====================================
Picker Shop V10 Final
script.js - Part 1
===================================== */

// ==========================
// Loader
// ==========================

window.addEventListener("load", function () {

    const loader = document.getElementById("loader");

    if (loader) {

        loader.style.display = "none";

    }

});

// ==========================
// Scroll To Top
// ==========================

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", function () {

    if (!topBtn) return;

    if (window.scrollY > 300) {

        topBtn.style.display = "block";

    } else {

        topBtn.style.display = "none";

    }

});

function topFunction() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

// ==========================
// Toast Message
// ==========================

function showToast(message) {

    let toast = document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}

// ==========================
// Local Storage
// ==========================

function getCart() {

    return JSON.parse(localStorage.getItem("pickerCart")) || [];

}

function saveCart(cart) {

    localStorage.setItem("pickerCart", JSON.stringify(cart));

}

function getWishlist() {

    return JSON.parse(localStorage.getItem("wishlist")) || [];

}

function saveWishlist(list) {

    localStorage.setItem("wishlist", JSON.stringify(list));

}

// ==========================
// Cart Counter
// ==========================

function updateCartCount() {

    const count = document.getElementById("cartCount");

    if (!count) return;

    count.innerHTML = getCart().length;

}

updateCartCount();
/* =====================================
script.js - Part 2
Cart & Wishlist
===================================== */

// ==========================
// Add To Cart
// ==========================

function addToCart(name, price) {

    let cart = getCart();

    cart.push({

        name: name,

        price: price

    });

    saveCart(cart);

    updateCartCount();

    showToast("🛒 " + name + " কার্টে যোগ হয়েছে");

}

// ==========================
// Load Cart
// ==========================

function loadCart() {

    const cartBox = document.getElementById("cartItems");

    const totalPrice = document.getElementById("totalPrice");

    if (!cartBox || !totalPrice) return;

    let cart = getCart();

    let html = "";

    let total = 0;

    cart.forEach(function(item, index){

        total += Number(item.price);

        html += `

<div class="card" style="padding:20px;margin-bottom:15px;">

<h3>${item.name}</h3>

<p>৳${item.price}</p>

<button class="wish-btn"

onclick="removeItem(${index})">

❌ Remove

</button>

</div>

`;

    });

    if(cart.length===0){

        html="<h3>🛒 আপনার কার্ট খালি</h3>";

    }

    cartBox.innerHTML=html;

    totalPrice.innerHTML="মোট: ৳"+total;

}

// ==========================
// Remove Item
// ==========================

function removeItem(index){

    let cart=getCart();

    cart.splice(index,1);

    saveCart(cart);

    updateCartCount();

    loadCart();

    showToast("❌ পণ্য সরানো হয়েছে");

}

// ==========================
// WhatsApp Checkout
// ==========================

function checkoutWhatsApp(){

    let cart=getCart();

    if(cart.length===0){

        alert("কার্ট খালি");

        return;

    }

    let text="আসসালামু আলাইকুম,%0Aআমি নিচের পণ্যগুলো অর্ডার করতে চাই:%0A%0A";

    let total=0;

    cart.forEach(function(item){

        text+=item.name+" - ৳"+item.price+"%0A";

        total+=Number(item.price);

    });

    text+="%0Aমোট = ৳"+total;

    window.open(

"https://wa.me/8801400599748?text="+text,

"_blank"

);

}

// ==========================
// Wishlist
// ==========================

function addToWishlist(product){

    let wishlist=getWishlist();

    if(!wishlist.includes(product)){

        wishlist.push(product);

        saveWishlist(wishlist);

        showToast("❤️ Wishlist-এ যোগ হয়েছে");

    }else{

        showToast("✔ আগে থেকেই Wishlist-এ আছে");

    }

}

// ==========================
// Load Wishlist
// ==========================

function loadWishlist(){

    const box=document.getElementById("wishlistItems");

    if(!box) return;

    let wishlist=getWishlist();

    let html="";

    wishlist.forEach(function(item,index){

        html+=`

<div class="card" style="padding:20px;margin-bottom:15px;">

<h3>${item}</h3>

<button class="wish-btn"

onclick="removeWishlist(${index})">

🗑 Remove

</button>

</div>

`;

    });

    if(wishlist.length===0){

        html="<h3>❤️ Wishlist খালি</h3>";

    }

    box.innerHTML=html;

}

// ==========================
// Remove Wishlist
// ==========================

function removeWishlist(index){

    let wishlist=getWishlist();

    wishlist.splice(index,1);

    saveWishlist(wishlist);

    loadWishlist();

    showToast("🗑 Wishlist থেকে সরানো হয়েছে");

}
/* =====================================
script.js - Part 3
Search, Filter & Reviews
===================================== */

// ==========================
// Product Search
// ==========================

function searchProducts(){

    const input=document.getElementById("searchInput");

    if(!input) return;

    const value=input.value.toLowerCase();

    const cards=document.querySelectorAll(".product-card");

    cards.forEach(function(card){

        const title=card.querySelector("h3").innerText.toLowerCase();

        if(title.includes(value)){

            card.style.display="block";

        }else{

            card.style.display="none";

        }

    });

}

// ==========================
// Product Filter
// ==========================

function filterProducts(category){

    const cards=document.querySelectorAll(".product-card");

    cards.forEach(function(card){

        if(category==="all"){

            card.style.display="block";

        }else if(card.dataset.category===category){

            card.style.display="block";

        }else{

            card.style.display="none";

        }

    });

}

// ==========================
// Review Submit
// ==========================

function submitReview(){

    const name=document.getElementById("reviewName");

    const rating=document.getElementById("reviewRating");

    const review=document.getElementById("reviewText");

    const image=document.getElementById("reviewImage");

    if(!name || !rating || !review){

        return;

    }

    if(name.value.trim()==="" || review.value.trim()===""){

        alert("সব তথ্য পূরণ করুন");

        return;

    }

    const reader=new FileReader();

    reader.onload=function(){

        let reviews=JSON.parse(localStorage.getItem("pickerReviews"))||[];

        reviews.unshift({

            name:name.value,

            rating:Number(rating.value),

            review:review.value,

            image:image.files[0] ? reader.result : "",

            likes:0,

            verified:true,

            date:new Date().toLocaleDateString("bn-BD")

        });

        localStorage.setItem("pickerReviews",JSON.stringify(reviews));

        name.value="";
        review.value="";
        rating.value="5";

        if(image){

            image.value="";
        }

        loadReviews();

        showToast("⭐ রিভিউ সফলভাবে যোগ হয়েছে");

    };

    if(image && image.files.length>0){

        reader.readAsDataURL(image.files[0]);

    }else{

        reader.onload();

    }

}

// ==========================
// Load Reviews
// ==========================

function loadReviews(){

    const box=document.getElementById("reviewList");

    if(!box) return;

    let reviews=JSON.parse(localStorage.getItem("pickerReviews"))||[];

    box.innerHTML="";

    let total=0;

    reviews.forEach(function(item,index){

        total+=Number(item.rating);

        box.innerHTML+=`

<div class="review-item">

<h4>

${item.name}

${item.verified ? '<span class="verified">✔ Verified Buyer</span>' : ''}

</h4>

<div class="review-stars">

${"⭐".repeat(item.rating)}

</div>

<p>${item.review}</p>

${item.image ? `<img src="${item.image}" class="review-photo">` : ""}

<small>📅 ${item.date}</small>

<div class="review-actions">

<button class="like-btn"

onclick="likeReview(${index})">

❤️ ${item.likes}

</button>

<button class="delete-btn"

onclick="deleteReview(${index})">

🗑 Delete

</button>

</div>

</div>

`;

    });

    const avg=document.getElementById("averageRating");

    const totalReview=document.getElementById("totalReviews");

    if(avg){

        avg.innerHTML=reviews.length ?

        (total/reviews.length).toFixed(1) : "0.0";

    }

    if(totalReview){

        totalReview.innerHTML=reviews.length;

    }

}

// ==========================
// Like Review
// ==========================

function likeReview(index){

    let reviews=JSON.parse(localStorage.getItem("pickerReviews"))||[];

    reviews[index].likes++;

    localStorage.setItem("pickerReviews",JSON.stringify(reviews));

    loadReviews();

}

// ==========================
// Delete Review
// ==========================

function deleteReview(index){

    let reviews=JSON.parse(localStorage.getItem("pickerReviews"))||[];

    reviews.splice(index,1);

    localStorage.setItem("pickerReviews",JSON.stringify(reviews));

    loadReviews();

    showToast("🗑 রিভিউ মুছে ফেলা হয়েছে");

}

// Auto Load Reviews

loadReviews();

/* =====================================
script.js - Part 4 (Final)
Newsletter, Login, Tracking
===================================== */

// ==========================
// Newsletter
// ==========================

function subscribeNewsletter(){

    const email=document.getElementById("newsletterEmail");

    if(!email) return;

    if(email.value.trim()===""){

        alert("আপনার ইমেইল লিখুন");

        return;

    }

    localStorage.setItem(

        "newsletterEmail",

        email.value

    );

    showToast("📩 সাবস্ক্রাইব সফল হয়েছে");

    email.value="";

}

// ==========================
// Login
// ==========================

function loginUser(){

    const email=document.getElementById("loginEmail");

    const password=document.getElementById("loginPassword");

    if(!email || !password) return;

    if(email.value==="" || password.value===""){

        alert("সব তথ্য পূরণ করুন");

        return;

    }

    localStorage.setItem("pickerLogin","true");

    localStorage.setItem("pickerUser",email.value);

    showToast("✅ লগইন সফল");

    setTimeout(function(){

        window.location="profile.html";

    },800);

}

// ==========================
// Register
// ==========================

function registerUser(){

    const name=document.getElementById("registerName");

    const email=document.getElementById("registerEmail");

    const password=document.getElementById("registerPassword");

    if(!name || !email || !password) return;

    localStorage.setItem("pickerName",name.value);

    localStorage.setItem("pickerUser",email.value);

    localStorage.setItem("pickerPassword",password.value);

    showToast("🎉 রেজিস্ট্রেশন সফল");

    setTimeout(function(){

        window.location="login.html";

    },1000);

}

// ==========================
// Logout
// ==========================

function logoutUser(){

    localStorage.removeItem("pickerLogin");

    showToast("👋 লগআউট সফল");

    setTimeout(function(){

        window.location="login.html";

    },800);

}

// ==========================
// Profile
// ==========================

function loadProfile(){

    const profile=document.getElementById("profileName");

    if(profile){

        profile.innerHTML=

        localStorage.getItem("pickerName")

        ||

        "Guest User";

    }

}

// ==========================
// Order Tracking
// ==========================

function trackOrder(){

    const input=document.getElementById("trackingNumber");

    const result=document.getElementById("trackingResult");

    if(!input || !result) return;

    if(input.value.trim()===""){

        result.innerHTML="অর্ডার নম্বর লিখুন";

        return;

    }

    result.innerHTML=`

    <h3>📦 Order Found</h3>

    <p>Tracking ID : ${input.value}</p>

    <p>স্ট্যাটাস : 🚚 ডেলিভারির পথে</p>

    `;

}

// ==========================
// Auto Load
// ==========================

document.addEventListener("DOMContentLoaded",function(){

    updateCartCount();

    loadCart();

    loadWishlist();

    loadReviews();

    loadProfile();

});



