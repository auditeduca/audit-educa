// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFunctions } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-functions.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBQUN5nlvlol_fAxja1-O21gprQZNCkVM",
  authDomain: "audit-educa-system.firebaseapp.com",
  projectId: "audit-educa-system",
  storageBucket: "audit-educa-system.firebasestorage.app",
  messagingSenderId: "491204425302",
  appId: "1:491204425302:web:3b0edcc719a1110640adf7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services to be used in other files
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
export default app;