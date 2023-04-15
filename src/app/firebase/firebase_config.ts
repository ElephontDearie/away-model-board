// Import the functions you need from the SDKs you need

import { initializeApp, getApps } from "firebase/app";


// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAHR0ZP92OM0t2umZnLvkyGb-6Fu5rdR1g",
  authDomain: "board-5ed22.firebaseapp.com",
  projectId: "board-5ed22",
  storageBucket: "board-5ed22.appspot.com",
  messagingSenderId: "643081756409",
  appId: "1:643081756409:web:42e3487186cfd8c5e34c28",
  measurementId: "G-JTQB2MB7FF"
};

export const firebaseAdminConfig = {
  privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
	projectId: "board-5ed22"
}

// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);

export default firebase_app;