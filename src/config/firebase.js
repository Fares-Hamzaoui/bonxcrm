import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyARv6gu8G6Q8PVtrJXUq29REq-wNAb9L2I",
  authDomain: "bonxcrm.firebaseapp.com",
  projectId: "bonxcrm",
  storageBucket: "bonxcrm.firebasestorage.app",
  messagingSenderId: "432224990291",
  appId: "1:432224990291:web:b9b9dee846beb4f10242a6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
