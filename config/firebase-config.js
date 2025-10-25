// ===================================
// Firebase Configuration
// ===================================

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc, 
    getDocs,
    setDoc, 
    updateDoc,
    deleteDoc,
    onSnapshot, 
    increment,
    query,
    where,
    orderBy,
    limit as limitQuery
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';

// Firebase project configuration
// From Firebase Console > Project Settings > Your apps
const firebaseConfig = {
    apiKey: "AIzaSyBG6H7X4An_vmqj0OeIqhad3r9sJI2rSrE",
    authDomain: "ba-na-hills-booking.firebaseapp.com",
    projectId: "ba-na-hills-booking",
    storageBucket: "ba-na-hills-booking.firebasestorage.app",
    messagingSenderId: "118022688047",
    appId: "1:118022688047:web:53c8b4144b58a0d14a25da",
    measurementId: "G-TG5B0YRWN1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export for use in other files
export { 
    db, 
    collection, 
    doc, 
    getDoc, 
    getDocs,
    setDoc, 
    updateDoc,
    deleteDoc,
    onSnapshot, 
    increment,
    query,
    where,
    orderBy,
    limitQuery
};
