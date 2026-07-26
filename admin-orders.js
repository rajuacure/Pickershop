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
                <td>${data.items ? data.items.length : 0}</td>
                <td>${order.id}</td>
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
