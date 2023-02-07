import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDnnL3dbZkwnp_2eCoI8tfn-PPeo-K3oL4",
  authDomain: "taxi-urk.firebaseapp.com",
  databaseURL:
    "https://taxi-urk-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "taxi-urk",
  storageBucket: "taxi-urk.appspot.com",
  messagingSenderId: "619803954",
  appId: "1:619803954:web:569a6f6ca99b56b906532b",
  measurementId: "G-QR61D7RFH0",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
