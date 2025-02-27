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
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import {getDatabase, ref, child, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const db = getDatabase();

const lightIcon = document.getElementById("light-icon");
const darkIcon = document.getElementById("dark-icon");

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
let darkMode = darkModeMediaQuery.matches;

const heading = document.querySelector('h1');
const b = document.getElementById('togglebtn')
//const p = document.querySelector('.profile-card')

// Set dark-mode class on body if darkMode is true and pick icon
if (darkMode) {
  document.body.classList.add("dark-mode");
  darkIcon.style.display = "none"; // Use style.display instead of setAttribute
} else {
  lightIcon.style.display = "none"; // Use style.display instead of setAttribute
}

document.getElementById("togglebtn").addEventListener("click", function toggleDarkMode() {
  // Toggle darkMode variable
  darkMode = !darkMode;

  // Toggle dark-mode class on body
  document.body.classList.toggle("dark-mode");

  // Toggle light and dark icons
  if (darkMode) {
    lightIcon.style.display = "block"; // Use style.display instead of setAttribute
    darkIcon.style.display = "none"; // Use style.display instead of setAttribute
    heading.style.color = "white";
    b.style.color = "white";

    document.querySelectorAll('.route-text').forEach(el => {
      el.style.color = 'yellow';
  });
    
      
      
    
  } else {
    lightIcon.style.display = "none"; // Use style.display instead of setAttribute
    darkIcon.style.display = "block"; // Use style.display instead of setAttribute
    heading.style.color = "black";
    b.style.color = "black"
    document.querySelectorAll('.route-text').forEach(el => {
      el.style.color = 'black';
  });
   //p.style.color = "yellow"
     
  }
});


let profileCount = 1;

function populateDiv(ROLLNO, NAME, VEHICLE, SEATS, MODEL, ROKRA, ROUT, WAQT, MOBNUM, WHATSAPP) {
    if (profileCount >= 500) {
        alert("You have reached the maximum number of profiles (500).");
        return;
    }
    const profileGrid = document.getElementById('profileGrid');
    const profileCard = document.createElement('div');
    profileCard.classList.add('profile-card');
    profileCard.setAttribute('data-owner-id', ROLLNO);
    //alert('data-owner-id', ROLLNO)

    // console.log(ROLLNO);

    function formatDateTime(inputString) {
      if (!inputString || !inputString.includes('T')) {
        // Handle invalid format or empty input
        return inputString; // Return as-is or provide a default value
    }

    // Split the input string into date and time parts
    const [datePart, timePart] = inputString.split('T');
  
      // Convert time part from 24-hour format to 12-hour format with AM/PM
      const [hours, minutes] = timePart.split(':');
      const ampm = +hours >= 12 ? 'pm' : 'am';
      const formattedHours = (+hours % 12) || 12;
      const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes}${ampm}`;
  
      // Combine the date part with the modified time part
      const formattedDateTime = `${datePart} | ${formattedTime}`;
  
      return formattedDateTime;
    }


    // Check if a request has already been made
    const requestMade = localStorage.getItem(`requestMade_${localStorage.getItem('chaabi')}_${ROLLNO}`);
    
    const requestButtonHTML = requestMade ? 
        `<button id="ReqBtn" style="background-color: red;" disabled>Request Sent</button>` : 
        `<button id="ReqBtn">Request a Ride</button>`;
    
    profileCard.innerHTML = `
        ${requestButtonHTML}
        <h3><strong>Profile No : </strong>${profileCount}</h3>
        <p><strong>NU ID:</strong> ${ROLLNO}</p>
        <p><strong>Name:</strong> ${NAME}</p>
        <p><strong>Vehicle:</strong> ${VEHICLE}</p>
        <p><strong>Seats Available:</strong> ${SEATS}</p>
        <p><strong>Model:</strong> ${MODEL}</p>
        <p><strong>Fair:</strong> ${ROKRA}</p>
        <p><strong>Route:</strong></p>
        <div class="route-text"><p> ${ROUT}</p></div>
        <p><strong>Departure:</strong> ${formatDateTime(WAQT)}</p>
        <p><strong>Cell No.:</strong> ${MOBNUM}</p>
        <p><strong>WhatsApp:</strong> ${WHATSAPP}</p>
    `;

    profileGrid.appendChild(profileCard);
    profileCount++;    
}




// Function to handle button clicks using event delegation
document.getElementById('profileGrid').addEventListener('click', (event) => { 
  // Check if the clicked target or any of its ancestors is the "Request a Ride" button
  if (event.target && event.target.matches('#ReqBtn')) {
      const profileCard = event.target.closest('.profile-card'); // Ensure to find the nearest profile card
      if (profileCard) {
          const ownerId = profileCard.getAttribute('data-owner-id'); // Get owner ID

          const currentUserId = localStorage.getItem('chaabi');

          // Store data in localStorage with current user ID
          localStorage.setItem(`requestMade_${currentUserId}_${ownerId}`, 'true');
            
          // Disable the button and change its color
          event.target.style.backgroundColor = 'red';
          event.target.textContent = 'Requested';
          event.target.disabled = true;
          event.target.style.cursor = 'not-allowed';
          // Redirect to the request page
          window.location.href = 'customerDetails.html'; // Replace with your actual request page URL
      }
  }
});













function getValues(ListOfOwners){
  const profileCard = document.createElement('div');
  profileCard.classList.add('profile-card');
  profileCard.innerHTML = "";
  ListOfOwners.forEach(element => {
    populateDiv(
      element.ROLLNO, element.NAME, element.VEHICLE, element.SEATS, element.MODEL, element.ROKRA, element.ROUT,
      element.WAQT, element.MOBNUM, element.WHATSAPP
    )
  });
}

function getData(){
  const dfRef = ref(db);

  get(child(dfRef, "Owner Details"))
  .then((snapshot) => {
    var getOwnerDetails = [];
    snapshot.forEach(childSnapshot => {
      getOwnerDetails.push(childSnapshot.val());
    });
    getValues(getOwnerDetails);
  })
}

function getDataRealTime(){
  const dfRef = ref(db, "Owner Details");

  onValue(dfRef, (snapshot) => {
    var getOwnerDetails = [];
    snapshot.forEach(childSnapshot => {
      getOwnerDetails.push(childSnapshot.val());
    });
    //alert(getOwnerDetails);
    getValues(getOwnerDetails);
  });
}

// Capture the search bar input
const searchInput = document.querySelector('.searchbar input');

searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase(); // Get the input and convert to lowercase
    filterProfiles(searchTerm); // Call the function to filter profiles
});


function highlightText(text, searchTerm) {
  if (!searchTerm) return text; // Return original text if searchTerm is empty
  const regex = new RegExp(`(${searchTerm})`, 'gi'); // Case-insensitive match
  return text.replace(regex, '<span class="highlight">$1</span>'); // Wrap matching text in <span>
}



function filterProfiles(searchTerm) {
  const profileGrid = document.getElementById('profileGrid');
  profileGrid.innerHTML = ""; // Clear the current profiles
  profileCount = 0;

  const dfRef = ref(db, "Owner Details");

  onValue(dfRef, (snapshot) => {
      var filteredProfiles = [];
      snapshot.forEach(childSnapshot => {
          const profileData = childSnapshot.val();
          if (profileData.ROUT.toLowerCase().includes(searchTerm)) {
              filteredProfiles.push(profileData);
          }
      });
      getValuesByInput(filteredProfiles, searchTerm); // Pass searchTerm to the function
  });
}


// Modify getValues function to display the filtered profiles
function getValuesByInput(ListOfOwners, searchTerm) {
  ListOfOwners.forEach(element => {
      const highlightedRoute = highlightText(element.ROUT, searchTerm); // Highlight text

      populateDiv(
          element.ROLLNO, element.NAME, element.VEHICLE, element.SEATS, element.MODEL, element.ROKRA, highlightedRoute,
          element.WAQT, element.MOBNUM, element.WHATSAPP
      );
  });
}



window.onload = getDataRealTime;



