// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getDatabase, ref, child, get, update, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const lightIcon = document.getElementById("light-icon");
const darkIcon = document.getElementById("dark-icon");

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
let darkMode = darkModeMediaQuery.matches;

// Set initial dark mode state
if (darkMode) {
    document.body.classList.add("dark-mode");
    darkIcon.style.display = "none";
    lightIcon.style.display = "block";
} else {
    darkIcon.style.display = "block";
    lightIcon.style.display = "none";
}

document.getElementById("togglebtn").addEventListener("click", function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle("dark-mode");

    // Toggle light and dark icons
    if (darkMode) {
        lightIcon.style.display = "block";
        darkIcon.style.display = "none";
    } else {
        lightIcon.style.display = "none";
        darkIcon.style.display = "block";
    }
});

// Function to display profile based on data from Firebase
function displayCustomerProfile(ownerData, profileData, status) {
    const cntr = document.getElementById("container");
            cntr.innerHTML = `
            
            <div class="n">
            <h5 class="sp">Your Host: </h5><h5 id="hstname">${ownerData.NAME}</h5>
        </div> 
        
        <div class="separate">
            <div class="sep1">
                <h5 class="sp">NU ID: </h5><h5 id="hstid">${ownerData.ROLLNO}</h5>
            </div>
            <div class="sep2">
                <h5 class="sp">Fare: </h5><h5 id="model">Rs. ${ownerData.ROKRA}</h5>
            </div>
        </div>
        <div class="separate">
            <div class="sep1">
                
                <h5 class="sp">Vehicle: </h5><h5 if="veh">${ownerData.VEHICLE}</h5>
            </div>
            <div class="sep2">
                <h5 class="sp">Color: </h5><h5 id="clr">${ownerData.COLOR}</h5>
            </div>
        </div>
        <div class="separate">
            <div class="sep1">
                
                <h5 class="sp">Model: </h5><h5 id="model">${ownerData.MODEL}</h5>
            </div>
            <div class="sep2">
                <h5 class="sp">No. Plate: </h5><h5 id="numplt">${ownerData.PLATE}</h5>
            </div>
        </div>
        <div class="n">
                <h5 class="sp">Contact: </h5><h5 id="contact">${ownerData.MOBNUM}</h5>
        </div>
        <div class="n w">
            <button class="wh" id="whtpp">
                WhatsApp:  ${ownerData.WHATSAPP}
            </button>
        </div>
        <div class="n">
            <h5 class="sp">Departure: </h5><h5 id="dep">${ownerData.WAQT}</h5>
        </div>
        <div class="n">
            <h5 class="sp">ROUTE: </h5>
        </div>
        <div class="r">
            <h5 class="sp" id="rt">${ownerData.ROUT}</h5>
        </div>
            <div class="n">
                        <h5 class="sp">Your Stop: </h5><h5 id="stop">${profileData.STOP}</h5>
                    </div>
                    <div class="n">
                        <h5 class="sp">Name: </h5><h5 id="custname">${profileData.NAME}</h5>
                    </div>
                    <div class="n">
                        <h5 class="sp">NU ID: </h5><h5 id="custid">${profileData.ROLLNO}</h5>
                        
                    </div>
                    <div class="n">
                        <h5 class="sp">Status: </h5><h5 id="status">${status ? status : 'Pending'}</h5>
                    </div>
                
        <button id="btncancel" class="cncl">CANCEL RIDE</button>
            `;

            document.getElementById("whtpp").addEventListener("click", function() {
                const contactNumber = ownerData.WHATSAPP
                
                // Remove any spaces, dashes, or other characters from the number if necessary
                const cleanNumber = contactNumber.replace(/\D/g, '');
            
                // Construct the WhatsApp URL
                const whatsappUrl = `https://wa.me/${cleanNumber}`;
            
                // Open the WhatsApp chat in a new tab
                window.open(whatsappUrl, '_blank');
            });

            document.getElementById("btncancel").addEventListener("click", function() {
                // Show the modal
                document.getElementById("confirmation-modal").style.display = "flex";
            });
            
            document.getElementById("confirm-yes").addEventListener("click", function() {
                // Redirect to the customer code page
                window.location.href = "book.html"; // Update with actual URL
            });
            
            document.getElementById("confirm-no").addEventListener("click", function() {
                // Hide the modal
                document.getElementById("confirmation-modal").style.display = "none";
            });
            
            // Close the modal when clicking outside of it
            window.addEventListener("click", function(event) {
                const modal = document.getElementById("confirmation-modal");
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            });
}



// Function to fetch and verify OTP
function verifyOtp(custcodeInput) {
    const db = getDatabase();
    const ownerId = localStorage.getItem('ownerId');
    const dfRefCust = ref(db, "Customer Details");
    const ownerRef = ref(db, `Owner Details/${ownerId}`);





    get(child(dfRefCust, "/")).then((snapshot) => {
       

        let matchFound = false;

        snapshot.forEach((childSnapshot) => {
            const profileData = childSnapshot.val();
            // console.log(profileData);
            // console.log(profileData.profileOTP.toString());
            // console.log(hostcodeInput);

            if (profileData.customerOTP.toString() === custcodeInput) {
                matchFound = true;
                // alert(profileData.customerOTP.toString());
                
                get(ownerRef).then((snapshot) => {
                    if(snapshot.exists()){
                        const ownerData = snapshot.val();
                        // const getStatus = listenForRequestStatus(ownerData.ROLLNO);
                        // updateDataInFirebase(profileData.ROLLNO, {status: getStatus})
                        listenForRequestStatus(ownerData.ROLLNO).then(status => {
                            
                            displayCustomerProfile(ownerData, profileData, status);
                            updateDataInFirebase(profileData.ROLLNO, { status: status });
                            
                        });
                    }
                    else{
                        alert("No such owner exists with repect to this customer code");
                    }
                });
            }
        });

        if (!matchFound) {
            const cntr = document.getElementById("container");
            cntr.innerHTML = `
                <div class="invalid-code">
                    <h2>Invalid Host Code</h2>
                    <p>Please enter a valid host code to view the details.</p>
                </div>
            `;
            setTimeout(() => {
                cntr.innerHTML = ``;
            }, 3000);
        }
    }).catch((error) => {
        console.error("Error fetching data: ", error);
    });
}



// ****************************INTEHAI KAREEEB THA LOGIC KE*************************

// function listenForRequestStatus(ROLLNO) {
//     const db = getDatabase();
//     const dataRef = ref(db, 'Owner Details/' + ROLLNO + '/pendingRequests');

//     get(dataRef).then((snapshot) => {
//         if(snapshot.exists()){
//             const requestKey = childSnapshot.key;
//             const dataRefValue = ref(db, 'Owner Details/' + ROLLNO + '/pendingRequests/' + requestKey);
//             get(dataRefValue).then((snapshot) => {
//                 if(snapshot.exists()){
//                     const getDatafromOwner = snapshot.val();
//                     //to debug
//                     let statusValue = getDatafromOwner.status.toString();
//                     console.log(statusValue);
//                     return getDatafromOwner.status.toString();
//                 }
//                 else{
//                     console.log("request key is not available")
//                 }
//             });
//         }
//         else{
//             alert("No key here");
//         }
//     });
// }


// ********************************MAGR YE LOGIC SAHI LAG GYI AKHIR ************************************

function listenForRequestStatus(ROLLNO) {
    const db = getDatabase();
    const dataRef = ref(db, 'Owner Details/' + ROLLNO + '/pendingRequests');

    return get(dataRef).then((snapshot) => {
        if (snapshot.exists()) {
            let statusValue = null;
            snapshot.forEach((childSnapshot) => {
                const getDatafromOwner = childSnapshot.val();
                statusValue = getDatafromOwner.status; // Collect status
                console.log(statusValue);
            });
            return statusValue;
        } else {
            console.log("No requests found");
            return null;
        }
    });
}


function updateDataInFirebase(rollNo, updatedData) {
    const db = getDatabase();
    const dataRef = ref(db, 'Customer Details/' + rollNo + '/status');

    update(dataRef, updatedData)
        .then(() => {
            // alert("Data Updated Successfully");
        })
        .catch((error) => {
            console.error("Update Unsuccessful, Error: ", error);
            alert("Update Unsuccessful, Error: " + error.message);
        });
}

document.getElementById("go").addEventListener("click", function() {
    const custcodeInput = document.getElementById("custcode").value;

    verifyOtp(custcodeInput);
});
