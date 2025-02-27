# Carpool Web for University Students  

## Overview  
This project is a web-based carpooling system designed for university students to share rides efficiently. Students can host rides by specifying their route, time, and fare, while others can find and book available rides. The platform ensures secure authentication and smooth ride management using **HTML, CSS, JavaScript, and Firebase**.  

### Project Status  
This project is currently **in progress**, with **60% completed**. Approximately **40% of the work remains**, including additional features and improvements.  

## Features  

### User Authentication  
- **Signup/Login:** Users can create an account and log in securely.  
- **OTP-Based Registration:** Registration requires verification via an OTP sent to a university domain email ID.  

### Ride Management  
- **Host a Ride:** Users can post ride details, including route, time, fare, car details, and available seats.  
- **Find a Ride:** A search feature helps passengers find rides based on route and time.  
- **Book a Ride:** Passengers can book a ride, and seat availability updates dynamically.  
- **Track Booked Rides:** Both passengers and hosts can track ride status.  

### Ride Requests and Actions  
- **Passenger Ride Request:** Passengers can request to join a ride.  
- **Host Approval:** Hosts can accept or decline ride requests.  
- **Ride Cancellation:** Both hosts and passengers have the option to cancel a ride.  

### Additional Functionalities  
- **WhatsApp API Integration:** Enables direct messaging between passengers and hosts for quick coordination.  
- **Passenger Details:** Name, stop, and selected route are recorded.  
- **Host Details:** Includes bio, number of available seats, and car color.  
- **Dynamic Seat Management:** The number of available seats updates automatically when a ride is booked or canceled.  

## Technologies Used  
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Firebase Authentication, Firestore Database  
- **API:** WhatsApp API for messaging integration  
