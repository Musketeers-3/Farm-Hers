// hooks/useCurrentUser.ts
"use client";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import app from "@/lib/firebase";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false); // ADD

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true); // ADD — fires once Firebase resolves
    });
    return () => unsub();
  }, []);

  return { user, authReady }; // CHANGED — return object
}