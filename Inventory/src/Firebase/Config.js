// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvIFZYBm068JLyKGFYI3f-bJgYjEm2F4w",
  authDomain: "tracksy-2ab77.firebaseapp.com",
  projectId: "tracksy-2ab77",
  storageBucket: "tracksy-2ab77.firebasestorage.app",
  messagingSenderId: "632118457817",
  appId: "1:632118457817:web:e22a524d388858040b95c8",
  measurementId: "G-2FSE0LJ7DL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, analytics, auth, provider };