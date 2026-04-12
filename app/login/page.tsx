"use client";

import AuthPage from "@/components/auth/auth-page";
import { useAppStore } from "@/lib/store";

export default function LoginPage() {
  // 🚀 Grab the role that was saved during onboarding
  const userRole = useAppStore((state) => state.userRole);

  // Fallback to farmer if for some reason the store is empty
  const role = userRole || "farmer";

  return <AuthPage defaultView="login" selectedRole={role} />;
}