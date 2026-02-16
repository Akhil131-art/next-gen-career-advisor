
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// TODO: Replace this object with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCQU7Fn7yj6IVGp-g65Fr8C4izn2P1aiSc",
  authDomain: "next-gen-career-advisor.firebaseapp.com",
  projectId: "next-gen-career-advisor",
  storageBucket: "next-gen-career-advisor.firebasestorage.app",
  messagingSenderId: "1055707428968",
  appId: "1:1055707428968:web:e2594670673907b4d963dd",
  measurementId: "G-1DG6E661RJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
