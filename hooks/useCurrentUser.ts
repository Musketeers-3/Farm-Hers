// hooks/useCurrentUser.ts
"use client";
import { useEffect, useState } from "react";
import { getToken, getStoredUserProfile, setUserProfile, removeToken, clearUserProfile, type UserProfile } from "@/lib/auth";

export function useCurrentUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Check for token and user profile in localStorage
    const token = getToken();
    const storedProfile = getStoredUserProfile();

    if (token && storedProfile) {
      setUser(storedProfile);
    }
    setAuthReady(true);
  }, []);

  // Function to update user state
  const setUserData = (profile: UserProfile | null) => {
    if (profile) {
      setUserProfile(profile);
    } else {
      clearUserProfile();
      removeToken();
    }
    setUser(profile);
  };

  return { user, authReady, setUserData };
}