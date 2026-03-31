import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACNddr_BWRAoQpbzGUrPI7ize2UIqfAWo",
  authDomain: "skema-cdc3b.firebaseapp.com",
  projectId: "skema-cdc3b",
  storageBucket: "skema-cdc3b.firebasestorage.app",
  messagingSenderId: "481825976402",
  appId: "1:481825976402:web:cb172a046c4b74aaaa2f8b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
