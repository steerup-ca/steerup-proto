import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBeEAoWWuOFEYryH8qO3PRLwaIHg5vMC_o",
  authDomain: "steerup-7780c.firebaseapp.com",
  projectId: "steerup-7780c",
  storageBucket: "steerup-7780c.appspot.com",
  messagingSenderId: "926136775580",
  appId: "1:926136775580:web:82d29e828ff9e83a500e59",
  measurementId: "G-EMEZBK2X2L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };