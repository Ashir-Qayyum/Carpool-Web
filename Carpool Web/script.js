import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";


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
 
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);





const lightIcon = document.getElementById("light-icon");
const darkIcon = document.getElementById("dark-icon");

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
let darkMode = darkModeMediaQuery.matches;

const heading = document.querySelector('h1');
const container = document.getElementsByClassName('container');
const btn1 = document.querySelector('#btn1');
const btn2 = document.querySelector('#btn2');
const btn3 = document.querySelector('#btn3');
const btn4 = document.querySelector('#btn4');


// Set dark-mode class on body if darkMode is true and pick icon
if (darkMode) {
  document.body.classList.add("dark-mode");
  darkIcon.style.display = "none"; // Use style.display instead of setAttribute
  
} else {
  lightIcon.style.display = "none"; // Use style.display instead of setAttribute
}

function toggleDarkMode() {
    // Toggle darkMode variable
    darkMode = !darkMode;
  
    // Toggle dark-mode class on body
    document.body.classList.toggle("dark-mode");
  
    // Toggle light and dark icons
    if (darkMode) {
      lightIcon.style.display = "block"; // Use style.display instead of setAttribute
      darkIcon.style.display = "none"; // Use style.display instead of setAttribute
      heading.style.color = "white";
      
      
      if (container.length > 0) { // Check if there are enough containers
        container[0].style.backgroundColor = "black";
        container[0].style.boxShadow = "0 0 100px rgba(255, 255, 255, 0.5)";

      }
    } else {
      lightIcon.style.display = "none"; // Use style.display instead of setAttribute
      darkIcon.style.display = "block"; // Use style.display instead of setAttribute
      heading.style.color = "black";
      btn1.style.border = "solid #ffff"
      btn2.style.border = "solid #ffff";
      btn3.style.border = "solid #ffff";
      btn4.style.border = "solid #ffff";

      if (container.length > 0) { // Check if there are enough containers
        container[0].style.backgroundColor = "whitesmoke";
        container[0].style.boxShadow = "0 0 600px rgba(0, 0, 0, 1)";


      }
    }
}




onAuthStateChanged(auth, (user) => {
  if (user) {
    // If the user is already logged in, redirect them away from the login page
    const head = document.querySelector("h2");
    head.innerText = "Welcome To Carpool, " + user.email;
    console.log(user.email);
    // console.log(user.id);


  }
  else{
    console.log('not fecting');
  }
});

document.querySelector("#logout").addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth).then(() => {
      // Sign-out successful.
      AmagiLoader.show();
      setTimeout(() => {
         AmagiLoader.hide();
      }, 5000);
      window.location.replace('signup.html');


      // Replace the current history entry
      history.replaceState(null, null, window.location.href);
    }).catch((error) => {
      // An error happened.
      alert(error);
    });
});