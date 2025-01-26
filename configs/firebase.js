import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, onValue } from 'firebase/database';
const firebaseConfig = {
    apiKey: "AIzaSyATwEaJ_VDjwob0QuaJA-qzf0-2GqXmfxE",
    authDomain: "socialapp-180f2.firebaseapp.com",
    databaseURL: "https://socialapp-180f2-default-rtdb.firebaseio.com",
    projectId: "socialapp-180f2",
    storageBucket: "socialapp-180f2.firebasestorage.app",
    messagingSenderId: "997753695231",
    appId: "1:997753695231:web:3e752ccb890fccb8da55ca",
    measurementId: "G-3WMEDY8GQ7"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const database = getFirestore();
  export { database, ref, set, onValue };