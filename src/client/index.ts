import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import { GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const config = {
  apiKey: "AIzaSyCv4vo4pQkgrjg-0glNuXLQp_bstLZsARM",
  authDomain: "fifahl.firebaseapp.com",
  databaseURL: "https://fifahl.firebaseio.com",
  projectId: "fifahl",
  storageBucket: "fifahl.appspot.com",
  messagingSenderId: "579671048965",
  appId: "1:579671048965:web:a1bea51117507bcb80ad6c",
  measurementId: "G-93PHBJNEGN"
}

export const app = initializeApp(config);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);