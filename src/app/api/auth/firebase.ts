// Import the functions you need from the SDKs you need

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/app"


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


// Initialize Firebase
let analytics;
// const app = initializeApp(firebaseConfig);
const firebase_app = initializeApp(firebaseConfig);


// const analytics = getAnalytics(app);

// if (app.name && typeof window !== 'undefined') {
//   analytics = getAnalytics(app);
// }

// Initialize Firebase
// let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// // let firebase_app = getFirestore();
export default firebase_app;