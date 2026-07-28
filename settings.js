// ==========================================
// Website Dynamic Settings
// ==========================================


import {
    db
} from "./firebase.js";


import {

    doc,
    getDoc

}
from
"https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";





window.loadWebsiteSettings = async function(){


    try{


        const snap =
        await getDoc(

            doc(db,"settings","website")

        );



        if(!snap.exists()){

            return;

        }



        const data =
        snap.data();



        // Website Name

        const nameElements =
        document.querySelectorAll(".websiteName");


        nameElements.forEach(el=>{

            el.innerHTML =
            data.websiteName || "Picker Shop";

        });




        // Logo

        const logo =
        document.getElementById("websiteLogo");


        if(logo && data.logo){

            logo.src =
            data.logo;

        }




        // Banner

        const banner =
        document.getElementById("websiteBanner");


        if(banner && data.banner){

            banner.src =
            data.banner;

        }




        // Phone

        const phone =
        document.getElementById("websitePhone");


        if(phone){

            phone.innerHTML =
            data.phone || "";

        }





        // Email

        const email =
        document.getElementById("websiteEmail");


        if(email){

            email.innerHTML =
            data.email || "";

        }





        // Address

        const address =
        document.getElementById("websiteAddress");


        if(address){

            address.innerHTML =
            data.address || "";

        }




        // Footer

        const footer =
        document.getElementById("footerText");


        if(footer){

            footer.innerHTML =
            data.footerText || "";

        }



    }


    catch(error){


        console.error(error);


    }


};




document.addEventListener(
"DOMContentLoaded",
()=>{


    loadWebsiteSettings();


});
