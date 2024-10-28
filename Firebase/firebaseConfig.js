// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdt_4Ewu3ns4PECWaYBU6DHPOmap1MQLs",
  authDomain: "passmanager-ea6d3.firebaseapp.com",
  projectId: "passmanager-ea6d3",
  storageBucket: "passmanager-ea6d3.appspot.com",
  messagingSenderId: "301662144042",
  appId: "1:301662144042:web:da08e15f8ac5cb9b4e6553"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, auth, db };