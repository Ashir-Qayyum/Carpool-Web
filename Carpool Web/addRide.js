

const roll = document.getElementById("nu_id")
let ROLLNO = roll.value
const name = document.getElementById("name")
let NAME = name.value
const veh = document.getElementById("vehicle")
let VEHICLE = veh.value
const mod = document.getElementById("model")
let MODEL = mod.value
const seat = document.getElementById("seats")
let SEATS = seat.value
const deptime = document.getElementById("waqt")
let WAQT = deptime.value
const rokra = document.getElementById("fair")
let ROKRA = rokra.value
const rout = document.getElementById("route")
let ROUT = document.getElementById("rts").textContent
const mobnum = document.getElementById("phone")
let MOBNUM = mobnum.value
const whatsapp = document.getElementById("whats")
let WHATSAPP = whatsapp.value
const PLATE = document.getElementById("plate")
let numplate = PLATE.value




const lightIcon = document.getElementById("light-icon");
const darkIcon = document.getElementById("dark-icon");

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
let darkMode = darkModeMediaQuery.matches;

const heading = document.querySelector('h1');
const heading5 = document.querySelector('h5');
const allLabels = document.getElementsByClassName('c');



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
      heading5.style.color = "white";
      
      if (allLabels.length > 0) { // Check if there are enough containers
        allLabels[0].style.color = "white";

      }
    } else {
      lightIcon.style.display = "none"; // Use style.display instead of setAttribute
      darkIcon.style.display = "block"; // Use style.display instead of setAttribute
      heading.style.color = "black";
      heading5.style.color = "black";


      if (allLabels.length > 0) { // Check if there are enough containers
        allLabels[0].style.color = "black";
      }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const vehicleSelect = document.getElementById('carlist');

    // Function to fetch car names from the API
    async function fetchCarNames() {
        try {
            const response = await fetch('https://freetestapi.com/api/v1/cars'); // Replace with your API URL
            // console.log(response);
            const data = await response.json();
            // console.log(data);
            for(let i=0; i<30; i++){
                // console.log(data[i].make + ' ' + data[i].model);
                const option = document.createElement('option');
                option.value = data[i].make + ' ' + data[i].model;
                option.textContent = data[i].make + data[i].model;
                vehicleSelect.appendChild(option);
            }
        } catch (error) {
            console.error('Error fetching car names:', error);
        }
    }

    // Call the function to fetch and populate the car names
    fetchCarNames();
});




roll.addEventListener("input", function(event){
    let q = event.target.value
    let m = Number(q[0])*10
    m += Number(q[1])
    
    if(q[q.length - 1] === ' '){
        event.target.value = q.slice(0, -1);
        alert("Type proper ID");
        return;
    }
    
    if(q.length==2){
    if(m>=18 && m<=24){
        event.target.value += "K" + "-"
    }else{
        alert("goli beta masti nhi")
        event.target.value=""
    }
}

if(q[1]=="K"){
    event.target.value=""
}


if(q[2]=="K"&&q[3]!="-"){
    event.target.value += "-"
}
if(q[2]=="-"){
    event.target.value = ""
    
}
if(q.length>3 && q[3]!="-"){
    event.target.value = ""
}

    
for(let s=4; s<8; s++){
if( q[0]!=null&&q[1]!=null&&q[2]!=null&&q[3]!=null&& !(q[s]>=0&&q[s]<=9) && q[s]!=null ){
    alert("hi")
    event.target.value = event.target.value.slice(0, -1)
}
}
if(q[8]!=null){
    event.target.value = event.target.value.slice(0, -1)
}

})

// plate function done by ashir bhoi
PLATE.addEventListener("input", function(event) {
    // Get the current value of the input field
    let inputValue = event.target.value;
    
    // Convert the input value to uppercase
    let uppercasedValue = inputValue.toUpperCase();
    
    // Update the input field with the uppercase value
    event.target.value = uppercasedValue;
});




name.addEventListener("input", function(event) {
    // Remove all non-alphabetic characters
    event.target.value = event.target.value.replace(/[^a-zA-Z\s]/g, '')
})


let q = false
const rt = document.getElementById("rtsub")
const dele = document.getElementById("rtdel")



rt.addEventListener("click" , function(){
    const inpp = document.getElementById("route")
    const rtts = document.getElementById("rts")

    

    

    if(rtts.textContent!="")
    {

        //alert(rtts.textContent.trim().split(" "))

        if(rtts.textContent.trim().split(" ")[0]=="Fast"){
            rtts.textContent += " --> " + inpp.value

        }

    


    else if(rtts.textContent!="Fast NU" && q==false)
    {for(let i=0; i<3; i++){
    var lastIndex = rtts.textContent.lastIndexOf(" ");
    rtts.textContent = rtts.textContent.substring(0, lastIndex);}

    rtts.textContent = rtts.textContent + " ---> " + inpp.value + " ---> Fast NU"}
    

}
    else{
        if(inpp.value!="Fast NU"){
        rtts.textContent = inpp.value + " ---> Fast NU"}
        else{
            rtts.textContent = inpp.value
        }
        
    }
})

dele.addEventListener("click", function(){
    const sdf = document.getElementById("rts")

    if(sdf.textContent!=""){


            

            if(sdf.textContent.trim().split(" ")[0]!="Fast")
            {
            for(let i=0; i<2; i++){
            var lastIndex = sdf.textContent.lastIndexOf(">");
            sdf.textContent = sdf.textContent.substring(0, lastIndex);}

            sdf.textContent += "> Fast NU"
                
            if(sdf.textContent=="> Fast NU"){
                sdf.textContent="Fast NU"
            }
             

        
        

            
            }
            else{
                
                    var lastIndex = sdf.textContent.lastIndexOf(">");
                    sdf.textContent = sdf.textContent.substring(0, lastIndex);
                    lastIndex = sdf.textContent.lastIndexOf(" ");
                    sdf.textContent = sdf.textContent.substring(0, lastIndex);

            }

        }

})

// **********TEMPORARY USELESS CODE BLOCK BELOW****************

// document.getElementById("subb").addEventListener("click", function(){
//     let ROLLNO = roll.value;
//     let NAME = name.value;
//     let VEHICLE = veh.value;
//     let MODEL = mod.value;
//     let SEATS = seat.value;
//     let WAQT = deptime.value;
//     let ROKRA = rokra.value;
//     let ROUT = document.getElementById("rts").textContent;
//     let MOBNUM = mobnum.value;
//     let WHATSAPP = whatsapp.value;
    

//     if(
//         ROLLNO === '' ||
//         NAME === '' ||
//         VEHICLE === '' ||
//         MODEL === '' ||
//         SEATS === '' ||
//         WAQT === '' ||
//         ROKRA === '' ||
//         ROUT === '' ||
//         MOBNUM === '' ||
//         WHATSAPP === ''
//     ){
//         alert("Please fill all fields !!!!");
//     }
//     else{
//         alert(
//             "ROLLNO: " + ROLLNO + "\n" +
//             "NAME: " + NAME + "\n" +
//             "VEHICLE: " + VEHICLE + "\n" +
//             "MODEL: " + MODEL + "\n" +
//             "SEATS: " + SEATS + "\n" +
//             "WAQT: " + WAQT + "\n" +
//             "ROKRA: " + ROKRA + "\n" +
//             "ROUT: " + ROUT + "\n" +
//             "MOBNUM: " + MOBNUM + "\n" +
//             "WHATSAPP: " + WHATSAPP
//         );
//     }

//     // console.log(
//     //     "ROLLNO: " + ROLLNO + "\n" +
//     //     "NAME: " + NAME + "\n" +
//     //     "VEHICLE: " + VEHICLE + "\n" +
//     //     "MODEL: " + MODEL + "\n" +
//     //     "SEATS: " + SEATS + "\n" +
//     //     "WAQT: " + WAQT + "\n" +
//     //     "ROKRA: " + ROKRA + "\n" +
//     //     "ROUT: " + ROUT + "\n" +
//     //     "MOBNUM: " + MOBNUM + "\n" +
//     //     "WHATSAPP: " + WHATSAPP
//     // )

    
      

// })


