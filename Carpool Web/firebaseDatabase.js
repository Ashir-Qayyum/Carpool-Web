// Firebase initialization (no changes needed here)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import { getDatabase, ref, set, get, child, push} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
// export { ROLLNO };


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
let profileOTP;



// Function to insert data
function insertData(ROLLNO, NAME, VEHICLE, MODEL, SEATS, WAQT, ROKRA, ROUT, MOBNUM, WHATSAPP, PLATE, COLOR, newProfileRef) {
    set(ref(db, "Owner Details/" + ROLLNO), {
        profileID: newProfileRef.key,
        NAME: NAME,
        ROLLNO: ROLLNO,
        pendingRequests: {},
        VEHICLE: VEHICLE,
        MODEL: MODEL,
        SEATS: SEATS,
        WAQT: WAQT,
        ROKRA: ROKRA,
        ROUT: ROUT,
        MOBNUM: MOBNUM,
        WHATSAPP: WHATSAPP,
        PLATE: PLATE,
        COLOR: COLOR
    })
        .then(() => {
            alert("Owner Registered Successfully");
        })
        .catch((error) => {
            console.error("Unsuccessful, Error: ", error);
            alert("Unsuccessful, Error: " + error.message);
        });
}

// Add event listener to the button
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("subb").addEventListener("click", () => {
        const ROLLNO = document.getElementById("nu_id").value;
        const NAME = document.getElementById("name").value;
        const VEHICLE = document.getElementById("vehicle").value;
        const MODEL = document.getElementById("model").value;
        const SEATS = document.getElementById("seats").value;
        const WAQT = document.getElementById("waqt").value;
        const ROKRA = document.getElementById("fair").value;
        const ROUT = document.getElementById("rts").textContent;
        const MOBNUM = document.getElementById("phone").value;
        const WHATSAPP = document.getElementById("whats").value;
        const PLATE = document.getElementById("plate").value;
        const COLOR = document.getElementById("colour").value;
        const dbRef = ref(db, 'Owner Details');
        const newProfileRef = push(dbRef);



        if (
            ROLLNO === '' ||
            NAME === '' ||
            VEHICLE === '' ||
            MODEL === '' ||
            SEATS === '' ||
            WAQT === '' ||
            ROKRA === '' ||
            ROUT === '' ||
            MOBNUM === '' ||
            WHATSAPP === ''
        ) {
            alert("Please fill all fields !!!!");
        } else {
            insertData(ROLLNO, NAME, VEHICLE, MODEL, SEATS, WAQT, ROKRA, ROUT, MOBNUM, WHATSAPP, PLATE, COLOR, newProfileRef);
        }

        

    });
});



