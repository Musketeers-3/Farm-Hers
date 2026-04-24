import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserProfile {
  uid: string;
  fullName: string;
  phone: string;
  email: string;
  location: string;
  role: "farmer" | "buyer";
  farmSize?: string;
  primaryCrop?: string;
  createdAt: string;
}

// Sign up — creates Firebase Auth user + saves profile to Firestore
export async function signUp(
  email: string,
  password: string,
  profile: Omit<UserProfile, "uid" | "createdAt">
): Promise<UserProfile> {
  // Use phone as email if no email provided (Firebase requires email)
  const authEmail = email || `${profile.phone}@agrilink.app`;

  const userCredential = await createUserWithEmailAndPassword(auth, authEmail, password);
  const uid = userCredential.user.uid;

  const userProfile: UserProfile = {
    ...profile,
    uid,
    email: authEmail,
    createdAt: new Date().toISOString(),
  };

  // Save profile to Firestore under users/{uid}
  await setDoc(doc(db, "users", uid), userProfile);

  return userProfile;
}

// Login — signs in with Firebase Auth + fetches profile from Firestore
export async function login(
  emailOrPhone: string,
  password: string
): Promise<UserProfile> {
  // Handle phone login by converting to the same format used at signup
  const authEmail = emailOrPhone.includes("@")
    ? emailOrPhone
    : `${emailOrPhone}@agrilink.app`;

  const userCredential = await signInWithEmailAndPassword(auth, authEmail, password);
  const uid = userCredential.user.uid;

  // Fetch profile from Firestore
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) {
    throw new Error("User profile not found");
  }

  return { ...userDoc.data(), uid } as UserProfile;
}

// Logout
export async function logout(): Promise<void> {
  await signOut(auth);
}

// Listen to auth state changes
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Fetch user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return null;
  return { ...userDoc.data(), uid } as UserProfile;
}