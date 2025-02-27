



// Firebase initialization (no changes needed here)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import { getDatabase, ref, set, get, child, push} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
// import { ROLLNO } from "./firebaseDatabase.js";




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
const db = getDatabase();
let customerOTP;

// Handle form submission (optional)
document.getElementById("rideForm").addEventListener("submit", function(event) {
    event.preventDefault();
    // You can add form submission logic here
    alert("Customer Registered Successfully");
});


// Function to insert data
function insertData(ROLLNO, NAME, MOBNUM, WHATSAPP, STOP, newProfileRef) {
    set(ref(db, "Customer Details/" + ROLLNO), {
        CustomerID: newProfileRef.key,
        NAME: NAME,
        ROLLNO: ROLLNO,
        MOBNUM: MOBNUM,
        WHATSAPP: WHATSAPP,
        STOP: STOP
    })
        .then(() => {
            // window.location.href = "findYourRide.html";
        })
        .catch((error) => {
            console.error("Unsuccessful, Error: ", error);
            alert("Unsuccessful, Error: " + error.message);
        });
}

window.onload = function() {
    // Retrieve data from localStorage
    const ownerId = localStorage.getItem('ownerId');

    // Use the retrieved data (e.g., display it or use it in your request logic)

    document.getElementById('rideForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get the customer details from the form
        const customerName = document.getElementById('name').value;
        const customerId = document.getElementById('id').value;
        const customerContact = document.getElementById('ContactNum').value;
        const WHATSAPP = document.getElementById("WhatsAppNum").value;
        const STOP = document.getElementById("yourStop").value;

        // Send the request using the ownerId
        sendRequestToOwner(ownerId, customerName, customerId, customerContact, WHATSAPP, STOP);
    });
};

function sendRequestToOwner(ownerId, customerName, customerId, customerContact, WHATSAPP, STOP) {
    const db = getDatabase();
    const requestsRef = ref(db, `Owner Details/${ownerId}/pendingRequests`);

    // Push the new request to the owner's pending requests
    push(requestsRef, {
        name: customerName,
        nu_id: customerId,
        contact: customerContact,
        whatsapp: WHATSAPP,
        stop: STOP
    }).then(() => {
        alert('Request sent successfully!');
        // Redirect back to the profile page or a confirmation page
        
    }).catch((error) => {
        console.error('Error sending request: ', error);
        alert('Failed to send request. Please try again later.');
    });
}




// Add event listener to the button
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("customerSubmit").addEventListener("click", () => {
        const CustomerROLLNO = document.getElementById("id").value;
        const NAME = document.getElementById("name").value;
        const MOBNUM = document.getElementById("ContactNum").value;
        const WHATSAPP = document.getElementById("WhatsAppNum").value;
        const STOP = document.getElementById("yourStop").value;
        const dbRef = ref(db, 'Customer Details');
        const newProfileRef = push(dbRef);

        


        if (
            CustomerROLLNO === '' ||
            NAME === '' ||
            MOBNUM === '' ||
            WHATSAPP === '' ||
            STOP === ''
        ) {
            alert("Please fill all fields !!!!");
        } else {
            
            insertData(CustomerROLLNO, NAME, MOBNUM, WHATSAPP, STOP, newProfileRef, customerOTP);
            // const ownerId = localStorage.getItem('ownerId');
            // localStorage.setItem(`requestMade_${ownerId}`, 'true');
            
        }
    });
});


