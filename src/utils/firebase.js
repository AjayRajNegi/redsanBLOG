// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "redsanblog.firebaseapp.com",
  projectId: "redsanblog",
  storageBucket: "redsanblog.firebasestorage.app",
  messagingSenderId: "378583555169",
  appId: "1:378583555169:web:228851f07b4f7614a51e20",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
