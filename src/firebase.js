import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";   // <-- REQUIRED FOR MEDIA UPLOADS

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBn25dxiCMj5bJdZRL8ckOOnQ6BJgfyHjE",
  authDomain: "buzzysdatabase.firebaseapp.com",
  databaseURL: "https://buzzysdatabase-default-rtdb.firebaseio.com",
  projectId: "buzzysdatabase",
  storageBucket: "buzzysdatabase.firebasestorage.app",
  messagingSenderId: "787932915752",
  appId: "1:787932915752:web:28c733ac6d22a3ebabad1d",
  measurementId: "G-5982N2YM47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// ⭐ Initialize Storage (THIS IS WHAT THE MEDIA MANAGER NEEDS)
export const storage = getStorage(app);
