// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

import { getDatabase, ref, child, get, update } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";



// Function to display profile based on data from Firebase
function displayProfile(profileData) {
    const cntr = document.getElementById("container");
    cntr.innerHTML = `
        <div class="border">
                <div class="n">
                <h4>NU-ID: </h4><h4 id="nu_id" class="d">${profileData.ROLLNO}</h4>
            </div>
            <div class="n">
                <h4>Name: </h4><h4 id="name" class="d">${profileData.NAME}</h4>
            </div>
            <div class="n">
                <h4>Vehicle: </h4><h4 id="veh" class="d">${profileData.VEHICLE}</h4>
            </div>
            <div class="n">
                <h4>Model: </h4><h4 id="mod" class="d">${profileData.MODEL}</h4>
            </div>
            <div class="n">
                <h4>License No: </h4><h4 id="plt" class="d">${profileData.PLATE}</h4>
            </div>
            <div class="n">
                <h4>Vehicle Color: </h4><h4 id="colour" class="d">${profileData.COLOR}</h4>
            </div>
            <div class="n">
                <h4>Seats Available: </h4><h4 id="sts" class="d">${profileData.SEATS}</h4>
                <button class="btn" id="btn">Change</button>
            </div>
            <div class="n">
                <h4>Fair: </h4><h4 id="rokra" class="d">Rs. ${profileData.ROKRA}</h4>
            </div>
            <div class="n">
                <h4>Departure: </h4><h4 id="time" class="d">${profileData.WAQT}</h4>
            </div>
            <div class="n">
                <h4>Your Route: </h4>
                <button class="btnRT" id="btnRT">Change</button>
            </div>
            <div class="n route">
                <h4 id="rt" class="d">${profileData.ROUT}</h4>
            </div>
            <div class="n">
                <h4>Contact No: </h4><h4 id="num" class="d">${profileData.MOBNUM}</h4>
            </div>
            <div class="n">
                <h4>Whatsapp: </h4><h4 id="wtap" class="d">${profileData.WHATSAPP}</h4>
            </div>

            <div id="modal-overlay1" class="modal-overlay1">
                <div class="modal-content1">
                    <h3>Enter the number of seats available now</h3>
                    <input type="number" id="seatInput" placeholder="Number of Seats">
                    <button id="confirmBtn1">Confirm</button>
                </div>
            </div>

            <div id="modal-overlay2" class="modal-overlay2">
                <div class="modal-content2">
                    <h3>Edit your Existing Route</h3>
                    <h5>Please Enter the route with proper structure</h5>
                    <input type="text" id="routeInput" placeholder="e.g Route1 ---> Route2 ---> Route3">
                    <button id="confirmBtn2">Confirm</button>
                </div>
            </div>

            <div id="modal-overlay3" class="modal-overlay3">
                <div class="modal-content3">
                    <h3>Pending Request</h3>
                    <div class="displayReqs">
                        
                    </div>

                </div>
            </div>

            <div class="btncont">
                <button id="Req" class="reqbtn">Request Pending</button>
                <button id="acc" class="reqbtn">Customer booked</button>
            </div>
        </div>
    `;

    // Modal functionality (same as before)
    const modalOverlay1 = document.getElementById("modal-overlay1");
    const modalOverlay2 = document.getElementById("modal-overlay2");
    const modalOverlay3 = document.getElementById("modal-overlay3");


    const btn = document.getElementById("btn");
    const btnRT = document.getElementById("btnRT");
    const confirmBtn1 = document.getElementById("confirmBtn1");
    const confirmBtn2 = document.getElementById("confirmBtn2");
    const req = document.getElementById("Req");


    const seatInput = document.getElementById("seatInput");
    const routeInput = document.getElementById("routeInput");

    const seatDisplay = document.getElementById("sts");
    const routeDisplay = document.getElementById("rt");


    btn.addEventListener("click", () => {
        modalOverlay1.classList.add("active");
    });

    btnRT.addEventListener("click", () => {
        modalOverlay2.classList.add("active");
    });

    req.addEventListener("click", () => {
        modalOverlay3.classList.add("active");
        fetchCustomer(profileData.ROLLNO);
    });
    

    confirmBtn1.addEventListener("click", () => {
        const newSeats = seatInput.value;
        if (newSeats) {
            seatDisplay.textContent = newSeats; // Correctly update the seat display
            updateDataInFirebase(profileData.ROLLNO, { SEATS: newSeats });
            
        }
        modalOverlay1.classList.remove("active");
        seatInput.value = ''; // Clear the input field
    });
    confirmBtn2.addEventListener("click", () => {
        const newRoute = routeInput.value
        if(newRoute){
            routeDisplay.textContent = newRoute;
            updateDataInFirebase(profileData.ROLLNO, { ROUT: newRoute });
            
        }
        modalOverlay2.classList.remove("active");
        routeInput.value = '';
    });

    

    modalOverlay1.addEventListener("click", (e) => {
        if (e.target === modalOverlay1) {
            modalOverlay1.classList.remove("active");
        }
    });
    modalOverlay2.addEventListener("click", (e) => {
        if (e.target === modalOverlay2) {
            modalOverlay2.classList.remove("active");
        }
    });
    modalOverlay3.addEventListener("click", (e) => {
        if (e.target === modalOverlay3) {
            modalOverlay3.classList.remove("active");
        }
    });

    
}


function fetchCustomer(rollNo) {
    const db = getDatabase();
    const reqRef = ref(db, `Owner Details/${rollNo}/pendingRequests`);

    get(reqRef).then((snapshot) => {
        const modalOverlay3 = document.getElementById("modal-overlay3");
        const displayReqs = document.querySelector(".displayReqs");

        if (snapshot.exists()) {
            displayReqs.innerHTML = ''; // Clear previous content

            snapshot.forEach((childSnapshot) => {
                const requestData = childSnapshot.val();
                const customerName = requestData.name; // Assuming you have this field in your database
                const customerID = requestData.nu_id;
                const customerContact = requestData.contact;
                const customerStop = requestData.stop;
                const customerWhatsapp = requestData.whatsapp;


                const requestKey = childSnapshot.key; // Get the key for the request

                const requestDiv = document.createElement('div');
                requestDiv.classList.add('flex-container');

                requestDiv.innerHTML = `
                    <p>${customerName} | ${customerID} | ${customerContact} | ${customerWhatsapp} | ${customerStop}</p>
                    <div>
                        <button id="accept" class="accept-btn" data-key="${requestKey}">Accept</button>
                        <button id="reject" class="reject-btn" data-key="${requestKey}">Reject</button>
                    </div>
                    <p>--------------------------------------------------------------------------------------</p>
                `;

                displayReqs.appendChild(requestDiv);
            });

            document.querySelectorAll(".accept-btn").forEach((button) => {
                button.addEventListener("click", (e) => {
                    const requestKey = e.target.dataset.key;
                    updateRequestStatus(rollNo, requestKey, 'accepted');
                    
                });
            });

            document.querySelectorAll(".reject-btn").forEach((button) => {
                button.addEventListener("click", (e) => {
                    const requestKey = e.target.dataset.key;
                    updateRequestStatus(rollNo, requestKey, 'rejected');
                });
            });

            modalOverlay3.classList.add("active");
        } else {
            displayReqs.innerHTML = `<p>No pending requests found.</p>`;
            modalOverlay3.classList.add("active");
        }
    }).catch((error) => {
        console.error("Error fetching pending requests: ", error);
    });
}





// Function to fetch and verify OTP
function verifyOtp(hostcodeInput) {
    const db = getDatabase();
    const dfRef = ref(db, "Owner Details");

    get(child(dfRef, "/")).then((snapshot) => {
        let matchFound = false;

        snapshot.forEach((childSnapshot) => {
            const profileData = childSnapshot.val();
            // console.log(profileData);
            // console.log(profileData.profileOTP.toString());
            // console.log(hostcodeInput);
            if (profileData.profileOTP.toString() === hostcodeInput) {
                matchFound = true;
                displayProfile(profileData);
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




function updateRequestStatus(rollNo, requestKey, status) {
    const db = getDatabase();
    const requestRef = ref(db, `Owner Details/${rollNo}/pendingRequests/${requestKey}`);

    update(requestRef, { status: status })
        .then(() => {
            alert(`Request has been ${status}.`);
            // Optionally, you can remove the request from the list or refresh the pending requests
            fetchCustomer(rollNo);
        })
        .catch((error) => {
            console.error(`Error updating request status: ${error}`);
            alert(`Failed to update request status: ${error.message}`);
        });
}


// Function to update data in Firebase
function updateDataInFirebase(rollNo, updatedData) {
    const db = getDatabase();
    const dataRef = ref(db, 'Owner Details/' + rollNo);

    update(dataRef, updatedData)
        .then(() => {
            alert("Data Updated Successfully");
        })
        .catch((error) => {
            console.error("Update Unsuccessful, Error: ", error);
            alert("Update Unsuccessful, Error: " + error.message);
        });
}








document.getElementById("go").addEventListener("click", function () {
    const hostcodeInput = document.getElementById("hostcode").value;
    verifyOtp(hostcodeInput);
});

const lightIcon = document.getElementById("light-icon");
const darkIcon = document.getElementById("dark-icon");

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
let darkMode = darkModeMediaQuery.matches;
const border = document.getElementsByClassName("border");

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
        if (border.length > 0) { // Check if there are enough containers
            border[0].style.border = "3px solid #fff"
        }
    } else {
        lightIcon.style.display = "none";
        darkIcon.style.display = "block";
        if (border.length > 0) { // Check if there are enough containers
            border[0].style.border = "3px solid #000"
        }

    }
});