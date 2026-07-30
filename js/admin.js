import { auth } from "./firebase.js";

import {

signInWithEmailAndPassword,
signOut,
onAuthStateChanged

}

from

"https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


// ===============================
// Admin Login
// ===============================

window.adminLogin = async function () {

const email =
document.getElementById("adminEmail").value.trim();

const password =
document.getElementById("adminPassword").value;

if(email==="" || password===""){

alert("Email এবং Password দিন");

return;

}

try{

await signInWithEmailAndPassword(

auth,

email,

password

);

alert("Login Success");

location.href="admin-dashboard.html";

}

catch(error){

console.error(error);

alert(error.message);

}

};


// ===============================
// Logout
// ===============================

window.adminLogout = async function(){

await signOut(auth);

location.href="admin-login.html";

};


// ===============================
// Protect Admin Pages
// ===============================

onAuthStateChanged(auth,(user)=>{

if(!user){

if(location.pathname.includes("admin-dashboard")){

location.href="admin-login.html";

}

}

});
