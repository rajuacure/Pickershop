const demoProducts = [

{

name:"Premium Honey",

price:"৳850",

image:"images/product1.jpg"

},

{

name:"Organic Dry Fruits",

price:"৳1200",

image:"images/product2.jpg"

},

{

name:"Herbal Powder",

price:"৳450",

image:"images/product3.jpg"

},

{

name:"Natural Oil",

price:"৳650",

image:"images/product4.jpg"

}

];



function loadProducts(id){

const container=document.getElementById(id);

if(!container) return;

container.innerHTML="";

demoProducts.forEach(product=>{

container.innerHTML+=`

<div class="product-card">

<img src="${product.image}" alt="${product.name}">

<div class="product-info">

<div class="product-title">

${product.name}

</div>

<div class="product-price">

${product.price}

</div>

<a href="#" class="buy-btn">

Buy Now

</a>

</div>

</div>

`;

});

}

loadProducts("flashProducts");

loadProducts("featuredProducts");
