"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LoginComponent } from "./login-component";
import { SignupComponent } from "./signup-component";
import { useAppStore } from "@/lib/store";
import { login, signUp } from "@/lib/auth";

<<<<<<< Updated upstream
interface AuthPageProps {
  defaultView?: "login" | "signup";
  selectedRole: "farmer" | "buyer";
}

export default function AuthPage({
  defaultView = "login",
  selectedRole,
}: AuthPageProps) {
=======
export default function AuthPage({
  defaultView = "login",
}: {
  defaultView?: "login" | "signup";
}) {
>>>>>>> Stashed changes
  const [view, setView] = useState<"login" | "signup">(defaultView);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

<<<<<<< Updated upstream
=======
  const [selectedRole, setSelectedRole] = useState<"farmer" | "buyer">(
    "farmer",
  );

>>>>>>> Stashed changes
  const router = useRouter();
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const setHasOnboarded = useAppStore((state) => state.setHasOnboarded);
  const setUserName = useAppStore((state) => state.setUserName);
  const setUserLocation = useAppStore((state) => state.setUserLocation);
  const setUserEmail = useAppStore((state) => state.setUserEmail);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (window.innerWidth / 2 - e.pageX) / 60,
        y: (window.innerHeight / 2 - e.pageY) / 60,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

<<<<<<< Updated upstream
  const populateStore = (profile: any) => {
=======
  const handleLoginSuccess = (role: "farmer" | "buyer") => {
>>>>>>> Stashed changes
    setIsLoggedIn(true);
    setUserRole(profile.role as "farmer" | "buyer");
    setHasOnboarded(true);
    setUserName(profile.fullName);
    setUserLocation(profile.location);
    setUserEmail(profile.email);
  };

  const handleLoginSuccess = (role: "farmer" | "buyer") => {
    router.push(`/${role}`);
    router.refresh();
  };

  const handleLogin = async (
    role: "farmer" | "buyer",
    email: string,
    password: string,
  ) => {
    setLoginLoading(true);
    setLoginError("");
    try {
      const profile = await login(email, password);
<<<<<<< Updated upstream
      populateStore(profile);
      handleLoginSuccess(profile.role as "farmer" | "buyer");
    } catch (err: any) {
      const code = err?.code;
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        setLoginError("No account found. Please sign up first.");
      } else if (code === "auth/wrong-password") {
        setLoginError("Incorrect password.");
      } else if (code === "auth/too-many-requests") {
        setLoginError("Too many attempts. Please try again later.");
      } else {
        setLoginError("Login failed. Please check your details.");
=======
      handleLoginSuccess(profile.role);
    } catch (err: any) {
      const code = err?.code;
      if (
        code === "auth/user-not-found" ||
        code === "auth/invalid-credential"
      ) {
        setLoginError(
          "No account found with these details. Please sign up first.",
        );
      } else if (code === "auth/wrong-password") {
        setLoginError("Incorrect password. Please try again.");
      } else if (code === "auth/too-many-requests") {
        setLoginError("Too many attempts. Please try again later.");
      } else {
        setLoginError("Login failed. Please check your details and try again.");
>>>>>>> Stashed changes
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (data: any) => {
    setSignupLoading(true);
    setSignupError("");
    try {
      const profile = await signUp(data.email, data.password, {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        location: data.location,
<<<<<<< Updated upstream
        role: selectedRole,
        farmSize: data.farmSize,
        primaryCrop: data.cropType,
      });
      populateStore(profile);
      handleLoginSuccess(profile.role as "farmer" | "buyer");
    } catch (err: any) {
      const code = err?.code;
      if (code === "auth/email-already-in-use") {
        setSignupError("An account with this email already exists. Please log in.");
      } else if (code === "auth/weak-password") {
        setSignupError("Password is too weak. Use at least 6 characters.");
      } else {
        setSignupError(err?.message || "Signup failed. Please try again.");
=======
        role: data.role ?? "farmer",
        farmSize: data.farmSize,
        primaryCrop: data.cropType,
      });
      handleLoginSuccess(profile.role);
    } catch (err: any) {
      const code = err?.code;
      if (code === "auth/email-already-in-use") {
        setSignupError(
          "An account with this email already exists. Please log in.",
        );
      } else if (code === "auth/weak-password") {
        setSignupError("Password is too weak. Use at least 6 characters.");
      } else {
        setSignupError("Signup failed. Please try again.");
>>>>>>> Stashed changes
      }
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <motion.div
        animate={{ x: mousePos.x, y: mousePos.y, scale: 1.1 }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
        className="fixed inset-[-10%] w-[120%] h-[120%] -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      <div className="w-full min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          {view === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="w-full"
            >
              <LoginComponent
<<<<<<< Updated upstream
                role={selectedRole}
=======
>>>>>>> Stashed changes
                onSignupClick={() => setView("signup")}
                onLogin={handleLogin}
                mousePos={mousePos}
                error={loginError}
                loading={loginLoading}
<<<<<<< Updated upstream
                error={loginError}
                loading={loginLoading}
=======
>>>>>>> Stashed changes
              />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="w-full"
            >
              <SignupComponent
<<<<<<< Updated upstream
                role={selectedRole}
=======
                role="farmer"
>>>>>>> Stashed changes
                onLoginClick={() => setView("login")}
                onSignup={handleSignup}
                error={signupError}
                loading={signupLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

