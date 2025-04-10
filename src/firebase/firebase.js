import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjZsMjSWVxYlCF6KfWeub7lT6oyieg_88",
  authDomain: "jazbaat-2d4b4.firebaseapp.com",
  projectId: "jazbaat-2d4b4",
  storageBucket: "jazbaat-2d4b4.firebasestorage.app",
  messagingSenderId: "249851907747",
  appId: "1:249851907747:web:6d56257986c29c7b49b916",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
