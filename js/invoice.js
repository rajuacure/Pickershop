const order = JSON.parse(localStorage.getItem("lastInvoice"));

if(order){

document.getElementById("invoiceOrder").innerHTML =
order.orderNumber;

document.getElementById("invoiceName").innerHTML =
order.customerName;

document.getElementById("invoicePhone").innerHTML =
order.phone;

document.getElementById("invoiceAddress").innerHTML =
order.address;

document.getElementById("invoicePayment").innerHTML =
order.paymentMethod;

document.getElementById("invoiceTotal").innerHTML =
"৳"+order.total;

let html="";

order.products.forEach(item=>{

html += `

<p>

${item.name}

× ${item.qty}

= ৳${item.price*item.qty}

</p>

`;

});

document.getElementById("invoiceItems").innerHTML=html;

}
