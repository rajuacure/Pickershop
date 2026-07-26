/* ==========================================
   Picker Shop V11
   script.js - Part 1
========================================== */

// ---------- Loader ----------
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "none";
    }

    updateCartCount();

    if (typeof loadCart === "function") loadCart();
    if (typeof loadWishlist === "function") loadWishlist();
    if (typeof loadReviews === "function") loadReviews();
    if (typeof loadProfile === "function") loadProfile();
});

// ---------- Toast ----------
function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    },100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },2500);

}

// ---------- Local Storage ----------

function getCart(){

    return JSON.parse(localStorage.getItem("pickerCart")) || [];

}

function saveCart(cart){

    localStorage.setItem("pickerCart",JSON.stringify(cart));

}

function getWishlist(){

    return JSON.parse(localStorage.getItem("wishlist")) || [];

}

function saveWishlist(list){

    localStorage.setItem("wishlist",JSON.stringify(list));

}

// ---------- Cart Counter ----------

function updateCartCount(){

    const count=document.getElementById("cartCount");

    if(count){

        count.innerHTML=getCart().length;

    }

}

// ---------- Scroll To Top ----------

window.addEventListener("scroll",()=>{

    const btn=document.getElementById("topBtn");

    if(!btn) return;

    if(window.scrollY>300){

        btn.style.display="block";

    }else{

        btn.style.display="none";

    }

});

function topFunction(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}
/* ==========================================
   Picker Shop V11
   script.js - Part 2
   Cart & Wishlist
========================================== */

// ---------- Add To Cart ----------

function addToCart(name, price){

    let cart = getCart();

    const found = cart.find(item => item.name === name);

    if(found){

        found.qty += 1;

    }else{

        cart.push({

            name:name,

            price:Number(price),

            qty:1

        });

    }

    saveCart(cart);

    updateCartCount();

    showToast("🛒 কার্টে যোগ হয়েছে");

}

// ---------- Remove Cart Item ----------

function removeItem(index){

    let cart = getCart();

    cart.splice(index,1);

    saveCart(cart);

    updateCartCount();

    loadCart();

    showToast("❌ পণ্য সরানো হয়েছে");

}

// ---------- Load Cart ----------

function loadCart(){

    const cartBox = document.getElementById("cartItems");

    const totalBox = document.getElementById("totalPrice");

    if(!cartBox || !totalBox) return;

    let cart = getCart();

    let html = "";

    let total = 0;

    if(cart.length===0){

        cartBox.innerHTML="<h3>🛒 আপনার কার্ট খালি</h3>";

        totalBox.innerHTML="মোট: ৳0";

        return;

    }

    cart.forEach((item,index)=>{

        total += item.price * item.qty;

        html += `

<div class="card" style="padding:20px;margin-bottom:15px;">

<h3>${item.name}</h3>

<p>দাম: ৳${item.price}</p>

<p>পরিমাণ: ${item.qty}</p>

<button class="wish-btn"
onclick="removeItem(${index})">

❌ Remove

</button>

</div>

`;

    });

    cartBox.innerHTML = html;

    totalBox.innerHTML = "মোট: ৳" + total;

}

// ---------- WhatsApp Checkout ----------

function checkoutWhatsApp(){

    let cart = getCart();

    if(cart.length===0){

        alert("কার্ট খালি");
              return;

    }

    let message="আসসালামু আলাইকুম,%0Aআমি নিচের পণ্যগুলো অর্ডার করতে চাই:%0A%0A";

    let total=0;

    cart.forEach(item=>{

        message += `${item.name} (${item.qty}টি) - ৳${item.price * item.qty}%0A`;

        total += item.price * item.qty;

    });

    message += `%0Aমোট মূল্য: ৳${total}`;

    window.open(

"https://wa.me/8801400599748?text="+message,

"_blank"

    );

}

// ---------- Wishlist ----------

function addToWishlist(name){

    let list = getWishlist();

    if(!list.includes(name)){

        list.push(name);

        saveWishlist(list);

        showToast("❤️ Wishlist-এ যোগ হয়েছে");

    }else{

        showToast("✔ আগে থেকেই Wishlist-এ আছে");

    }

}

// ---------- Load Wishlist ----------

function loadWishlist(){

    const box = document.getElementById("wishlistItems");

    if(!box) return;

    let list = getWishlist();

    if(list.length===0){

        box.innerHTML="<h3>❤️ Wishlist খালি</h3>";

        return;

    }

    let html="";

    list.forEach((item,index)=>{

        html += `

<div class="card" style="padding:20px;margin-bottom:15px;">

<h3>${item}</h3>

<button class="wish-btn"
onclick="removeWishlist(${index})">

🗑 Remove

</button>

</div>

`;

    });

    box.innerHTML = html;

}

// ---------- Remove Wishlist ----------

function removeWishlist(index){

    let list = getWishlist();

    list.splice(index,1);

    saveWishlist(list);

    loadWishlist();

    showToast("🗑 Wishlist থেকে সরানো হয়েছে");

}
/* ==========================================
   Picker Shop V11
   script.js - Part 3
   Search, Filter & Reviews
========================================== */

// ---------- Product Search ----------

function searchProducts(){

    const input=document.getElementById("searchInput");

    if(!input) return;

    const keyword=input.value.toLowerCase();

    const cards=document.querySelectorAll(".product-card");

    cards.forEach(card=>{

        const title=card.querySelector("h3").innerText.toLowerCase();

        if(title.indexOf(keyword)>-1){

            card.style.display="block";

        }else{

            card.style.display="none";

        }

    });

}

// ---------- Category Filter ----------

function filterProducts(category){

    const cards=document.querySelectorAll(".product-card");

    cards.forEach(card=>{

        if(category==="all"){

            card.style.display="block";

        }

        else if(card.dataset.category===category){

            card.style.display="block";

        }

        else{

            card.style.display="none";

        }

    });

}

// ---------- Reviews ----------

function getReviews(){

    return JSON.parse(localStorage.getItem("pickerReviews")) || [];

}

function saveReviews(reviews){

    localStorage.setItem("pickerReviews",JSON.stringify(reviews));

}

// ---------- Submit Review ----------

function submitReview(){

    const name=document.getElementById("reviewName");

    const rating=document.getElementById("reviewRating");

    const review=document.getElementById("reviewText");

    if(!name || !rating || !review){

        return;

    }

    if(name.value.trim()==="" || review.value.trim()===""){

        alert("সব তথ্য পূরণ করুন");

        return;

    }

    let reviews=getReviews();

    reviews.unshift({

        name:name.value,

        rating:Number(rating.value),

        review:review.value,

        likes:0,

        date:new Date().toLocaleDateString("bn-BD")

    });

    saveReviews(reviews);

    name.value="";

    review.value="";

    rating.value="5";

    loadReviews();

    showToast("⭐ রিভিউ সফলভাবে যোগ হয়েছে");

}

// ---------- Load Reviews ----------

function loadReviews(){

    const list=document.getElementById("reviewList");

    if(!list) return;

    const reviews=getReviews();

    let html="";

    let total=0;

    reviews.forEach((item,index)=>{

        total+=item.rating;

        html+=`

<div class="review-item">

<h4>${item.name}</h4>

<div class="review-stars">

${"⭐".repeat(item.rating)}

</div>

<p>${item.review}</p>

<small>${item.date}</small>

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

    list.innerHTML=html;

    const avg=document.getElementById("averageRating");

    const totalReview=document.getElementById("totalReviews");

    if(avg){

        avg.innerHTML=reviews.length ? (total/reviews.length).toFixed(1) : "0.0";

    }

    if(totalReview){

        totalReview.innerHTML=reviews.length;

    }

}

// ---------- Like Review ----------

function likeReview(index){

    let reviews=getReviews();

    reviews[index].likes++;

    saveReviews(reviews);

    loadReviews();

}

// ---------- Delete Review ----------

function deleteReview(index){

    let reviews=getReviews();

    reviews.splice(index,1);

    saveReviews(reviews);

    loadReviews();

    showToast("🗑 রিভিউ মুছে ফেলা হয়েছে");

}
/* ==========================================
   Picker Shop V11
   script.js - Part 4 (Final)
========================================== */

// ---------- Newsletter ----------

function subscribeNewsletter(){

    const email=document.getElementById("newsletterEmail");

    if(!email) return;

    if(email.value.trim()===""){

        alert("আপনার ইমেইল লিখুন");

        return;

    }

    localStorage.setItem("newsletterEmail",email.value);

    showToast("📩 সাবস্ক্রাইব সফল হয়েছে");

    email.value="";

}

// ---------- Login ----------

function loginUser(){

    const email=document.getElementById("loginEmail");

    const password=document.getElementById("loginPassword");

    if(!email || !password) return;

    if(email.value.trim()==="" || password.value.trim()===""){

        alert("ইমেইল ও পাসওয়ার্ড দিন");

        return;

    }

    localStorage.setItem("pickerLogin","true");

    localStorage.setItem("pickerUser",email.value);

    showToast("✅ লগইন সফল");

    setTimeout(()=>{

        window.location.href="profile.html";

    },800);

}

// ---------- Register ----------

function registerUser(){

    const name=document.getElementById("registerName");

    const email=document.getElementById("registerEmail");

    const password=document.getElementById("registerPassword");

    const confirm=document.getElementById("confirmPassword");

    if(!name || !email || !password || !confirm) return;

    if(name.value==="" || email.value==="" || password.value===""){

        alert("সব তথ্য পূরণ করুন");

        return;

    }

    if(password.value!==confirm.value){

        alert("পাসওয়ার্ড মিলছে না");

        return;

    }

    localStorage.setItem("pickerName",name.value);

    localStorage.setItem("pickerUser",email.value);

    localStorage.setItem("pickerPassword",password.value);

    showToast("🎉 রেজিস্ট্রেশন সফল");

    setTimeout(()=>{

        window.location.href="login.html";

    },1000);

}

// ---------- Logout ----------

function logoutUser(){

    localStorage.removeItem("pickerLogin");

    showToast("👋 লগআউট সফল");

    setTimeout(()=>{

        window.location.href="login.html";

    },800);

}

// ---------- Load Profile ----------

function loadProfile(){

    const profile=document.getElementById("profileName");

    const email=document.getElementById("profileEmail");

    if(profile){

        profile.innerHTML=localStorage.getItem("pickerName") || "Guest User";

    }

    if(email){

        email.innerHTML=localStorage.getItem("pickerUser") || "-";

    }

}

// ---------- Order Tracking ----------

function trackOrder(){

    const input=document.getElementById("trackingNumber");

    const result=document.getElementById("trackingResult");

    if(!input || !result) return;

    if(input.value.trim()===""){

        result.innerHTML="<p>অর্ডার নম্বর লিখুন</p>";

        return;

    }

    result.innerHTML=`

        <div class="card" style="padding:20px;">

            <h3>📦 Order Found</h3>

            <p><strong>Tracking ID:</strong> ${input.value}</p>

            <p><strong>Status:</strong> 🚚 ডেলিভারির পথে</p>

        </div>

    `;

}

// ---------- Auto Initialize ----------

document.addEventListener("DOMContentLoaded",()=>{

    updateCartCount();

    if(document.getElementById("cartItems")){

        loadCart();

    }

    if(document.getElementById("wishlistItems")){

        loadWishlist();

    }

    if(document.getElementById("reviewList")){

        loadReviews();

    }

    if(document.getElementById("profileName")){

        loadProfile();

    }

});
document.getElementById("cartItemCount").innerHTML = cart.length;
document.getElementById("subTotal").innerHTML = "৳" + total;
document.getElementById("grandTotal").innerHTML = "৳" + (total + 80);
