"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LoginComponentProps {
  role?: "farmer" | "buyer";
  onLogin: (role: "farmer" | "buyer") => void;
  onSignupClick: () => void;
  mousePos: { x: number; y: number };
}

export function LoginComponent({
  role = "farmer",
  onLogin,
  onSignupClick,
  mousePos,
}: LoginComponentProps) {
  // const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rememberMe, setRememberMe] = useState(false);

  // useEffect(() => {
  //   const handleMouseMove = (e: MouseEvent) => {
  //     setMousePos({
  //       x: (window.innerWidth / 2 - e.pageX) / 60,
  //       y: (window.innerHeight / 2 - e.pageY) / 60,
  //     });
  //   };
  //   window.addEventListener("mousemove", handleMouseMove);
  //   return () => window.removeEventListener("mousemove", handleMouseMove);
  // }, []);

  return (
    <motion.div
      className="relative w-full min-h-screen flex items-center justify-center font-sans overflow-hidden text-[#1a2419]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
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

      <div className="w-full max-w-[420px] px-6">
        {/* Logo */}
        <header className="text-center mb-6">
          <div className="text-4xl mb-2">🌿</div>
          <h1 className="font-serif text-[2.4rem] font-bold text-[#1a2419]">
            AgriLink
          </h1>
          <p className="text-sm text-[#1a2419]/70 mt-1">
            Empowering Farmers Digitally
          </p>
        </header>

        <main className="bg-white/20 backdrop-blur-[25px] border border-white/30 rounded-[28px] p-[30px_35px] shadow-xl">
          {/* Icons */}
          <div className="text-center text-2xl mb-2">🌾 🌽 🌱</div>
          <h2 className="text-center text-[1.7rem] font-bold mb-1 text-[#1a2419]">
            Welcome Back 👋
          </h2>
          <p className="text-center text-sm text-[#1a2419]/60 mb-6">
            Login to continue managing your crops
          </p>

          <form className="space-y-4">
            {/* Email or Phone */}
            <div>
              <label className="text-sm font-semibold text-[#1a2419] mb-1 block">
                Email or Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter your email or phone"
                className="w-full p-3 rounded-xl bg-white/70 border border-black/10 outline-none text-[#1a2419] placeholder-[#1a2419]/40"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-[#1a2419]">
                  Secure Password
                </label>
                <button
                  type="button"
                  className="text-sm text-[#1e4d2b] font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 rounded-xl bg-white/70 border border-black/10 outline-none text-[#1a2419]"
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#1e4d2b]"
              />
              <label htmlFor="remember" className="text-sm text-[#1a2419]">
                Remember me
              </label>
            </div>

            <button
              type="button"
              onClick={() => onLogin(role)}
              className="w-full p-4 rounded-xl bg-[#1e4d2b] text-white font-bold hover:bg-[#153a20] transition-colors"
            >
              Login
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[#1a2419]/20" />
              <span className="text-xs text-[#1a2419]/50 font-medium">OR</span>
              <div className="flex-1 h-px bg-[#1a2419]/20" />
            </div>

            <p className="text-center text-sm text-[#1a2419]">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSignupClick}
                className="font-bold text-[#1e4d2b] underline cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </form>
        </main>
      </div>
    </motion.div>
  );
}
