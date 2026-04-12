"use client";

import AuthPage from "@/components/auth/auth-page";
import { useAppStore } from "@/lib/store";

export default function SignupPage() {
  // 🚀 Grab the role that was saved during onboarding
  const userRole = useAppStore((state) => state.userRole);

  const role = userRole || "farmer";

  return <AuthPage defaultView="signup" selectedRole={role} />;
}