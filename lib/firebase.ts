import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "A_REMPLACER",
  authDomain: "A_REMPLACER",
  projectId: "A_REMPLACER",
  storageBucket: "A_REMPLACER",
  messagingSenderId: "A_REMPLACER",
  appId: "A_REMPLACER"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
