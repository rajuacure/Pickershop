// ==========================================
// Picker Shop V3
// orders.js
// Complete File
// ==========================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// ==========================================
// Load My Orders
// ==========================================

window.loadMyOrders = async function () {

    const table =
        document.getElementById("myOrderTable");

    if (!table) return;

    onAuthStateChanged(auth, async (user) => {

        if (!user) {

            location.href = "login.html";

            return;

        }

        table.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;">
                Loading...
            </td>
        </tr>
        `;

        try {

            const q = query(

                collection(db, "orders"),

                where("userId", "==", user.uid)

            );

            const snapshot = await getDocs(q);

            if (snapshot.empty) {

                table.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">
                        কোনো Order পাওয়া যায়নি।
                    </td>
                </tr>
                `;

                return;

            }

            table.innerHTML = "";

            snapshot.forEach((docItem) => {

                const order = docItem.data();

                table.innerHTML += `

                <tr>

                    <td>${docItem.id}</td>

                    <td>${order.date || "-"}</td>

                    <td>৳${order.total || 0}</td>

                    <td>${order.status || "Pending"}</td>

                    <td>

                        <button
                        class="btn"
                        onclick="viewMyOrder('${docItem.id}')">

                        👁 View

                        </button>

                    </td>

                </tr>

                `;

            });

        }

        catch (error) {

            console.error(error);

            alert("Order Load Failed");

        }

    });

};


// ==========================================
// View Order
// ==========================================

window.viewMyOrder = async function (id) {

    try {

        const snap =
            await getDoc(doc(db, "orders", id));

        if (!snap.exists()) {

            alert("Order পাওয়া যায়নি");

            return;

        }

        const order = snap.data();

        let items = "";

        if (order.items) {

            order.items.forEach(item => {

                items +=
                    `${item.name} × ${item.qty} = ৳${item.price}\n`;

            });

        }

        alert(

`Order ID:
${id}

Customer:
${order.customerName}

Phone:
${order.phone}

Address:
${order.address}

Payment:
${order.paymentMethod}

Status:
${order.status}

Total:
৳${order.total}

Products:

${items}`

        );

    }

    catch (error) {

        console.error(error);

    }

};


// ==========================================
// Cancel Order
// ==========================================

window.cancelMyOrder = async function (id) {

    if (!confirm("এই Order Cancel করবেন?")) {

        return;

    }

    try {

        await updateDoc(

            doc(db, "orders", id),

            {

                status: "Cancelled"

            }

        );

        alert("Order Cancelled");

        loadMyOrders();

    }

    catch (error) {

        console.error(error);

    }

};


// ==========================================
// Search Orders
// ==========================================

window.searchMyOrders = function () {

    const keyword =

        document
        .getElementById("searchOrder")
        .value
        .toLowerCase();

    const rows =

        document
        .querySelectorAll("#myOrderTable tr");

    rows.forEach(row => {

        const text =
            row.innerText.toLowerCase();

        row.style.display =

            text.includes(keyword)

                ? ""

                : "none";

    });

};


// ==========================================
// Auto Load
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadMyOrders();

});
