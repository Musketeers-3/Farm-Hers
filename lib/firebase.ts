import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrQgmPMr5QvLO94CS32r-k0tMmIAq-FWo",
  authDomain: "agrilink-fad4f.firebaseapp.com",
  projectId: "agrilink-fad4f",
  storageBucket: "agrilink-fad4f.firebasestorage.app",
  messagingSenderId: "158239444366",
  appId: "1:158239444366:web:25ef7556a68af7ea8528df",
};

// Prevent re-initializing on hot reload
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
