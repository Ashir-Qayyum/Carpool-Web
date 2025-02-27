
// Firebase initialization (no changes needed here)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import { getDatabase, ref, set, get, child, update, push} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, updatePassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";


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
const db = getDatabase();
const auth = getAuth(app);

// Expose functions globally
window.loadSignup = loadSignup;
window.loadLoginForm = loadLoginForm;
window.loginFinally = loginFinally;
window.changePassword = changePassword;
window.SignupFinally = SignupFinally;

// Variables for form fields
let loginID, loginPass, chMail, chName, chOpass, chNpass, chCpass;
let signMail, signName, signpass, signCpass;
let isBlurActive  = false;


const con = document.getElementsByClassName("container")[0];

// Load login form
function loadLoginForm() {
    con.innerHTML = `
        <h2 class="l">LOGIN</h2>
        <label class="ro">NU ID:</label>
        <input id="roll" type="text" class="in" placeholder="e.g. 22K-4504">
        <label class="pa">PASSWORD:</label>
        <input id="password" type="password" class="in">
        <p id="ch"><u>Change my password</u></p>
        <button id="go" onclick="loginFinally()">Go</button>
        <p id="signup" class="signup2"><u>Have'nt made an account yet!</u></p>
    `;
    
    document.getElementById("signup").addEventListener("click", loadSignup);
    document.getElementById("ch").addEventListener("click", loadChangePasswordForm);

    // Roll number input validation
    document.getElementById("roll").addEventListener("input", function(event) {
        let q = event.target.value;
        let m = Number(q[0]) * 10 + Number(q[1]);
    
        if (q[q.length - 1] === ' ') {
            event.target.value = q.slice(0, -1);
            alert("Type proper ID");
            return;
        }
    
        if (q.length == 2) {
            if (m >= 18 && m <= 24) {
                event.target.value += "K" + "-";
            } else {
                alert("Invalid year");
                event.target.value = "";
            }
        }
    
        if (q[2] == "K" && q[3] != "-") {
            event.target.value += "-";
        }
        if (q[2] == "-") {
            event.target.value = "";
        }
        if (q.length > 3 && q[3] != "-") {
            event.target.value = "";
        }
    
        for (let s = 4; s < 8; s++) {
            if (q[0] != null && q[1] != null && q[2] != null && q[3] != null && !(q[s] >= 0 && q[s] <= 9) && q[s] != null) {
                alert("Invalid characters");
                event.target.value = event.target.value.slice(0, -1);
            }
        }
        if (q[8] != null) {
            event.target.value = event.target.value.slice(0, -1);
        }
    });
}

// Load change password form
function loadChangePasswordForm() {
    con.innerHTML = `
        <label class="em chem">NU Email:</label>
        <input id="email" type="email" class="in">
        <label class="name">Full Username:</label>
        <input id="fullName" type="text" class="in">
        <label class="old">Old Password:</label>
        <input id="oldPassword" type="text" class="in">
        <label class="npa">New Password:</label>
        <input id="newPassword" type="password" class="in">
        <label class="cpa">Confirm Password:</label>
        <input id="confirmPassword" type="password" class="in">
        <button id="CHANGE" onclick="changePassword()">CHANGE</button>
        <button id="back">BACK</button>
    `;

    document.getElementById("back").addEventListener("click", loadLoginForm);
}

// Load signup form
function loadSignup() {
    con.innerHTML = `
        <h2 class="s">SIGNUP</h2>
        <label class="em">NU Email:</label>
        <input id="signemail" type="email" class="in">
        <label class="name">Full Username:</label>
        <input id="signfullName" type="text" class="in" placeholder="Note: It can not be changed later.">
        <label class="spa">Create Password:</label>
        <input id="signPassword" type="password" class="in">
        <label class="cpa">Confirm Password:</label>
        <input id="signconfirmPassword" type="password" class="in">
        <button id="sign" onclick="SignupFinally()">SIGNUP</button>
        <p id="login3"><u>Already have an account!</u></p>
    `;

    document.getElementById("login3").addEventListener("click", loadLoginForm);

    document.getElementById("signfullName").addEventListener("input", function(event) {
        // Remove all non-alphabetic characters
        event.target.value = event.target.value.replace(/[^a-zA-Z\s]/g, '')
    })


}

// Function to handle user login
function handleUserLogin(currentUserId) {
    // Get stored user ID from local storage
    const storedUserId = localStorage.getItem('ownerId');
  
    // Check if it's a new user
    if (storedUserId !== currentUserId) {
        // Clear all previous user's request data from local storage
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('requestMade_')) {
                localStorage.removeItem(key);
            }
        });
        
        // Update local storage with the new user ID
        localStorage.setItem('ownerId', currentUserId);
    }
}
  

// Handle login
function loginFinally() {
    loginID = document.getElementById("roll").value;
    loginPass = document.getElementById("password").value;

    if (loginID == "" || loginPass == "") {
        alert("Please fill the required field!");
        return;
    }

    let EM = getEmailFromRollNumber(loginID);



    signInWithEmailAndPassword(auth, EM, loginPass)
    .then((userCredential)=>{

        const user = userCredential.user;
        let dt = new Date();
        
        update(ref(db , 'ALLUSERS/' + loginID),{
            last_login: dt
        });

        messageforuser("Logging in...")
        messageforuser("Logging in...")
        document.getElementById("roll").value = "";
        document.getElementById("password").value = "";
        localStorage.setItem('chaabi', loginID);
        handleLoginSuccess();
        window.location.replace('index.html');
        handleUserLogin(loginID);


        // Replace the current history entry with the homepage
        history.replaceState(null, null, 'index.html');

    })
    .catch((error) =>{
        const errorCode = error.code;
        const errorMessage = error.message;


        alert(errorMessage);
        messageforuser("Invalid ID or Password");
    })

}

// Handle password change
async function changePassword() {
    chMail = document.getElementById("email").value;
    chName = document.getElementById("fullName").value;
    chOpass = document.getElementById("oldPassword").value;
    chNpass = document.getElementById("newPassword").value;
    chCpass = document.getElementById("confirmPassword").value;

    messageforuser("loading...")
    messageforuser("loading..")
    
    if (chMail == "" || chName == "" || chOpass == "" || chNpass == "" || chCpass == "") {
        alert("Please fill the required field!");
        return;
    }

    if (chNpass != chCpass) {
        alert("Passwords do not match!");
        return;
    }


    let rolln = getRollNumberFromEmail(chMail)
    if(rolln == "Invalid email format"){
        return;
    }

    let checkName;
    let checkPass;

    //matching?
    async function fetchData(rolln, datatyp) {
        
        const userRef = ref(db, `ALLUSERS/${rolln}/${datatyp}`); // Reference to the name key in ALLUSERS
      
        try {
          // Fetch the 'name' value using await
          const snapshot = await get(userRef);
      
          if (snapshot.exists()) {
            return snapshot.val(); // Extract the value
           
          } else {
            alert(`No ${datatyp} found for this Email.`);
          }
        } catch (error) {
          console.error(`Error fetching &{datatyp}:`, error); // Catch and log any errors
        }
      }

     checkName = await fetchData(rolln, "name");
     checkPass = await fetchData(rolln, "password");
    
     if(checkName != chName){
         //alert("Your provided credential is incorrect!")
         messageforuser("Your provided credential is incorrect!")
         return;
     }

     if(chOpass != checkPass){
        messageforuser("Your provided credential is incorrect!")
        return;
    }



    let otp = generateOTP();
   
    await sendOTPEmail(otp, chMail);
    
    let makeacc = await showOtpPopup(otp);

    if (makeacc === "yes") 
    {
    //changing password
    signInWithEmailAndPassword(auth, chMail, chOpass)
        .then((userCredential) => {
             
            const user = userCredential.user;

            // Update the password
            updatePassword(user, chNpass)
                .then(() => {
                    messageforuser("Password updated succesfully!")
                    update(ref(db , 'ALLUSERS/' + rolln),{
                        password: chNpass
                    });
                    document.getElementById("email").value = "";
                    document.getElementById("fullName").value = "";
                    document.getElementById("oldPassword").value = "";
                    document.getElementById("newPassword").value = "";
                    document.getElementById("confirmPassword").value = "";



                })
                .catch((error) => {
                    console.error("Error updating password:", error.message);
                    alert("Failed to update password. Please try again.");
                });

            
        })
        .catch((error) => {
            console.error("Error re-authenticating:", error.message);
            alert("Old password is incorrect or re-authentication failed.");
            messageforuser("Old password is incorrect or re-authentication failed.")
        });

    }else {
        alert('Password changing failed. Please try again.');
    }



}

    
// Handle signup
async function SignupFinally() {
    signMail = document.getElementById("signemail").value;
    signName = document.getElementById("signfullName").value;
    signpass = document.getElementById("signPassword").value;
    signCpass = document.getElementById("signconfirmPassword").value;
    let rollnum;

    if (signMail == "" || signName == "" || signpass == "" || signCpass == "") {
        alert("Please fill the required field!");
        return;
    }

    if (!validateEmail(signMail)) {
        alert("Invalid Email! Please type in your correct NU email.");
        return;
    }

    rollnum = getRollNumberFromEmail(signMail);

    if(signpass.length < 6){
        alert("Password length must be >= 6");
        return;
    }

    if (signpass != signCpass) {
        alert("Passwords do not match!");
        return;
    }

    let otp = generateOTP();
   
    await sendOTPEmail(otp, signMail);
    await messageforuser("OTP sent to your provided mail.")
    let makeacc = await showOtpPopup(otp);

    if (makeacc === "yes") {
        createUserWithEmailAndPassword(auth, signMail, signpass)
        .then((userCredential) => {
            const user = userCredential.user;

            set(ref(db, 'ALLUSERS/' + rollnum), {
                name: signName,
                mail: signMail,
                password: signpass,
                Rollnumber: rollnum
            });
            messageforuser("User created successfully!")
            document.getElementById("signemail").value = "";
            document.getElementById("signfullName").value = "";
            document.getElementById("signPassword").value = "";
            document.getElementById("signconfirmPassword").value = "";


        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if(errorMessage=="Firebase: Error (auth/email-already-in-use)."){
                messageforuser(`This Email already in use!`)
                messageforuser(`This Email already in use!`)
                alert("This Email already in use!")
            }
            else{
            messageforuser(`Error: ${errorMessage}`)
            alert(`Error: ${errorMessage}`)
            }
            document.getElementById("signemail").value = "";
            document.getElementById("signfullName").value = "";
            document.getElementById("signPassword").value = "";
            document.getElementById("signconfirmPassword").value = "";
        });
    } else {
        alert('Signup failed. Please try again.');
    }
}





// Validate email format
function validateEmail(email) {
    const regex = /^k(1[8-9]|2[0-4])\d{4}@nu\.edu\.pk$/;
    return regex.test(email);
}

// Extract roll number from email
function getRollNumberFromEmail(email) {
    const regex = /^k(1[8-9]|2[0-4])(\d{4})@nu\.edu\.pk$/;
    const match = email.match(regex);

    if (match) {
        const year = match[1];
        const number = match[2];
        return `${year}K-${number}`;
    } else {
        messageforuser("Invalid email format")
        return "Invalid email format";
    }
}


function getEmailFromRollNumber(rollNumber) {
    // Define the regular expression to match the roll number format
    const regex = /^(\d{2})K-(\d{4})$/;

    // Test the roll number against the regular expression
    const match = rollNumber.match(regex);

    if (match) {
        // Extract the year and number from the matched groups
        const year = match[1];  // Extracts the year part (e.g., 22, 19)
        const number = match[2]; // Extracts the 4 digits (e.g., 3456, 1234)

        // Construct the email address
        return `k${year}${number}@nu.edu.pk`;
    } else {
        return "Invalid roll number format";
    }
}



function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}


function sendOTPEmail(otp , mail){
    var params = {
        message:  otp,
        email:  mail
    }

    const serviceID = ""
    const templateID = ""

    emailjs.send(serviceID, templateID, params)
    .then((res) => {
        messageforuser("OTP sent to your provided mail. Please verify!")
    })
    .catch((err) => alert(err));


}


// otp verfication
function showOtpPopup(realotp) {
    return new Promise((resolve) => {
        isBlurActive = true;
        // Get the container to blur
        let container = document.querySelector('.container');

        // Blur the background content
        if (container) {
            container.style.filter = 'blur(5px)';
            container.style.transition = 'filter 0.3s ease';
        }

        // Create a popup container
        let popup = document.createElement('div');
        popup.id = 'otpPopup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#fefefe'; // Slightly off-white background
        popup.style.padding = '20px';
        popup.style.borderRadius = '12px'; // Slightly more rounded
        popup.style.boxShadow = '0px 8px 16px rgba(0, 0, 0, 0.2)'; // More pronounced shadow
        popup.style.zIndex = '1000';
        popup.style.width = '350px'; // Slightly wider for better spacing
        popup.style.maxWidth = '90%'; // Responsive width
        popup.style.textAlign = 'center'; // Center-align text

        // Add a title to the popup
        let title = document.createElement('h3');
        title.innerText = 'OTP Verification';
        title.style.marginBottom = '15px';
        title.style.color = '#333'; // Darker text color for better readability
        popup.appendChild(title);

        // Add a message to the popup
        let message = document.createElement('p');
        message.innerText = 'Please enter the OTP sent to your email:';
        message.style.marginBottom = '20px';
        message.style.color = '#555'; // Slightly lighter text color
        popup.appendChild(message);

        // Create an input field for the OTP
        let otpInput = document.createElement('input');
        otpInput.type = 'text';
        otpInput.placeholder = 'Enter OTP';
        otpInput.style.padding = '10px';
        otpInput.style.marginBottom = '20px';
        otpInput.style.width = '100%';
        otpInput.style.boxSizing = 'border-box';
        otpInput.style.fontSize = '16px';
        otpInput.style.border = '1px solid #ccc'; // Light border
        otpInput.style.borderRadius = '6px'; // Rounded corners
        otpInput.style.outline = 'none'; // Remove default outline
        otpInput.style.transition = 'border-color 0.3s ease'; // Smooth border color transition
        otpInput.addEventListener('focus', () => {
            otpInput.style.borderColor = '#007BFF'; // Highlight border on focus
        });
        otpInput.addEventListener('blur', () => {
            otpInput.style.borderColor = '#ccc'; // Default border color
        });
        popup.appendChild(otpInput);

        // Create a submit button
        let submitButton = document.createElement('button');
        submitButton.innerText = 'Submit';
        submitButton.style.padding = '10px 20px';
        submitButton.style.border = 'none';
        submitButton.style.borderRadius = '6px';
        submitButton.style.backgroundColor = '#007BFF'; // Primary button color
        submitButton.style.color = 'white';
        submitButton.style.fontSize = '16px';
        submitButton.style.cursor = 'pointer';
        submitButton.style.transition = 'background-color 0.3s ease'; // Smooth background color transition
        submitButton.addEventListener('mouseover', () => {
            submitButton.style.backgroundColor = '#0056b3'; // Darker shade on hover
        });
        submitButton.addEventListener('mouseout', () => {
            submitButton.style.backgroundColor = '#007BFF'; // Default color
        });
        popup.appendChild(submitButton);

        // Append popup to the body
        document.body.appendChild(popup);

        // Focus on the OTP input field
        otpInput.focus();

        // Event listener for the Submit button
        submitButton.addEventListener('click', function() {
            let otp = otpInput.value;
            if (otp === realotp) {
                // Remove the popup after getting input
                document.body.removeChild(popup);

                // Reset the blur effect
                if (container) {
                    container.style.filter = 'none';
                }

                // Resolve the promise with 'yes'
                messageforuser("OTP PASSED!");
                isBlurActive = false;
                resolve("yes");
            } else {
                alert('Please enter a valid OTP!');
            }
        });

        // Event listener for the Enter key
        otpInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                submitButton.click(); // Trigger button click event
            }
        });
    });
}




async function messageforuser(message) {
    // Call the popup
  
    await showGeneralPopup(message);
    
}



function showGeneralPopup(message) {
    return new Promise((resolve) => {
        // Get the container to blur
        let container = document.querySelector('.container');

        // Blur the background content if not already blurred
        if (container && !isBlurActive) {
            container.style.filter = 'blur(5px)';
            container.style.transition = 'filter 0.3s ease';
            isBlurActive = true;
        }

        // Create a popup container
        let popup = document.createElement('div');
        popup.className = 'popup'; // Add a class to identify this popup
        popup.style.display = 'flex';
        popup.style.alignContent = 'center';
        popup.style.justifyContent = 'center';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.padding = '20px';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';
        popup.style.zIndex = '1000';
        popup.style.width = '300px'; // Define width for better layout

        // Add a message to the popup
        let messageElement = document.createElement('p');
        messageElement.innerText = message;
        popup.appendChild(messageElement);

        // Append popup to the body
        document.body.appendChild(popup);

        // Set timeout to remove the popup
        setTimeout(() => {
            // Remove the popup
            document.body.removeChild(popup);

            // Check if any other popups are still present
            if (!document.querySelector('.popup')) {
                // Reset the blur effect
                if (container) {
                    container.style.filter = 'none';
                }
                isBlurActive = false; // Update the blur state
            }

            // Resolve the promise
            resolve();
        }, 3000); // 3 seconds
    });
}


async function CHsendOTPEmail(otp, chMail)
{   
    await sendOTPEmail(otp, chMail);

}


async function CHshowOtpPopup(otp)
{
    return await showOtpPopup(otp);
}


function handleLoginSuccess() {
    // Redirect to the new HTML page
    window.location.href = 'index.html'; // Change 'newPage.html' to your actual file name
}