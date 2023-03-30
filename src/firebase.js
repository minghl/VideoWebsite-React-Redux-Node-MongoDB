// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBhOdGYGIustxAVMnePgYRANREewzNliwU",
    authDomain: "video-e2c0b.firebaseapp.com",
    projectId: "video-e2c0b",
    storageBucket: "video-e2c0b.appspot.com",
    messagingSenderId: "610139322022",
    appId: "1:610139322022:web:a682be2b733e0d70a86667"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
// login with google button
export const provider = new GoogleAuthProvider();

export default app;