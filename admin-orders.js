import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

async function loadOrders() {

    const table = document.getElementById("ordersTable");
<script type="module" src="admin-orders.js"></script>
    if (!table) return;

    table.innerHTML = `
    <tr>
        <td colspan="6" style="text-align:center;">
            Loading...
        </td>
    </tr>`;

    try {

        const snapshot = await getDocs(collection(db, "orders"));

        if (snapshot.empty) {

            table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    কোনো Order পাওয়া যায়নি।
                </td>
            </tr>`;

            return;

        }

        let html = "";

        snapshot.forEach((order) => {

            const data = order.data();

            html += `
            <tr>
                <td>${data.customerName}</td>
                <td>${data.phone}</td>
                <td>${data.address}</td>
                <td>${data.status}</td>

<td>

<button class="btn"
onclick="updateOrderStatus('${order.id}')">

Update

</button>

<button class="wish-btn"
onclick="deleteOrder('${order.id}')">

Delete

</button>

</td>
            </tr>`;
        });

        table.innerHTML = html;

    } catch (err) {

        console.error(err);

        table.innerHTML = `
        <tr>
            <td colspan="6">Order Load Failed</td>
        </tr>`;
    }

}

document.addEventListener("DOMContentLoaded", loadOrders);
<tbody id="ordersTable">

<tr>

<td colspan="6" style="text-align:center;">

Loading...

</td>

</tr>

</tbody>
import {
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ==========================================
// Update Order Status
// ==========================================

window.updateOrderStatus = async function(id){

    const status = prompt(
        "নতুন Status লিখুন:\n\nPending\nProcessing\nDelivered"
    );

    if(!status) return;

    try{

        await updateDoc(doc(db,"orders",id),{

            status:status

        });

        alert("✅ Status Updated");

        loadOrders();

    }

    catch(error){

        console.error(error);

        alert("Status Update Failed");

    }

};

// ==========================================
// Delete Order
// ==========================================

window.deleteOrder = async function(id){

    if(!confirm("এই Order Delete করবেন?")){

        return;

    }

    try{

        await deleteDoc(doc(db,"orders",id));

        alert("🗑 Order Deleted");

        loadOrders();

    }

    catch(error){

        console.error(error);

        alert("Delete Failed");

    }

};
