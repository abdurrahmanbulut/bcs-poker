import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  getDatabase,
  ref,
  push,
  onValue,
  onDisconnect,
  remove,
} from "firebase/database";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };
const firebaseConfig = {
  apiKey: "AIzaSyBVS6A7amOkgQXGHoE-uVU6pPl41eFM6to",
  authDomain: "bcs-poker.firebaseapp.com",
  projectId: "bcs-poker",
  storageBucket: "bcs-poker.appspot.com",
  messagingSenderId: "939332526335",
  appId: "1:939332526335:web:a9c0c65d49c96191416cca",
  measurementId: "G-NQVS5JBESR",
};



const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const database = getDatabase(app);

export { auth, googleProvider, database };
