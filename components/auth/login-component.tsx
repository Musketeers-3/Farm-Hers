// components/auth/login-component.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface LoginComponentProps {
  role?: "farmer" | "buyer";
  onBack?: () => void;
  onLogin: (role: "farmer" | "buyer") => void;
}

export function LoginComponent({
  role = "farmer",
  onBack,
  onLogin,
}: LoginComponentProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Replaces the vanilla JS requestAnimationFrame script
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role);
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center font-sans overflow-hidden text-[#1a2419] z-50">
      {/* Fixed Parallax Background */}
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

      <div className="w-full max-w-[400px] px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#1a2419] hover:text-[#1e4d2b] font-bold mb-4 drop-shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}

        {/* Brand Header */}
        <header className="text-center mb-[25px]">
          <div className="text-[2.5rem] mb-[5px]">🌿</div>
          <h1 className="font-serif text-[2.4rem] font-bold text-[#1a2419] leading-tight">
            AgriLink
          </h1>
          <p className="text-[0.85rem] opacity-80 tracking-[0.5px]">
            Empowering Farmers Digitally
          </p>
        </header>

        {/* Login Card */}
        <main className="bg-white/20 backdrop-blur-[25px] border border-white/30 rounded-[28px] p-[30px_35px] shadow-[0_25px_50px_rgba(0,0,0,0.1)]">
          <div className="text-[1.5rem] text-center mb-[10px]">🌾 🌽 🌱</div>
          <h2 className="font-serif text-[1.7rem] font-bold text-center mb-[5px]">
            Welcome Back 👋
          </h2>
          <p className="text-[0.8rem] text-[#333] text-center mb-[25px]">
            Login to continue managing your crops
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email / Phone Input */}
            <div className="mb-[18px]">
              <label className="block text-[0.75rem] font-semibold text-[#2d382c] mb-[6px]">
                Email or Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter your email or phone"
                className="w-full p-[13px] rounded-[10px] border border-black/10 bg-white/70 outline-none text-[0.9rem] text-black focus:border-[#1e4d2b] transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-[18px]">
              <div className="flex justify-between items-center mb-[6px]">
                <label className="text-[0.75rem] font-semibold text-[#2d382c]">
                  Secure Password
                </label>
                <a
                  href="#"
                  className="text-[0.8rem] font-bold text-[#1e4d2b] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-[13px] rounded-[10px] border border-black/10 bg-white/70 outline-none text-[0.9rem] text-black focus:border-[#1e4d2b] transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me */}
            <div className="flex justify-start mb-[20px]">
              <div className="flex items-center gap-[8px] text-[0.85rem] text-[#2d382c]">
                <input
                  type="checkbox"
                  id="rem"
                  className="m-0 cursor-pointer w-4 h-4 accent-[#1e4d2b]"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rem" className="cursor-pointer">
                  Remember me
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-[15px] rounded-[12px] border-none bg-[#1e4d2b] text-white font-semibold text-[1rem] cursor-pointer transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_10px_20px_rgba(30,77,43,0.2)] active:translate-y-0"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center my-[20px]">
              <span className="flex-1 h-[1px] bg-black/10"></span>
              <span className="px-[10px] py-[4px] border border-black/10 text-[0.65rem] font-extrabold mx-[12px] rounded-[4px] bg-white/40">
                OR
              </span>
              <span className="flex-1 h-[1px] bg-black/10"></span>
            </div>

            {/* Footer Note */}
            <p className="text-[0.85rem] text-center mt-[10px]">
              Don't have an account?{" "}
              <a href="#" className="text-[#1e4d2b] font-bold hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}
