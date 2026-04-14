"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface LoginComponentProps {
  role: "farmer" | "buyer";
  onLogin: (role: "farmer" | "buyer", email: string, password: string) => void;
  onSignupClick: () => void;
  mousePos: { x: number; y: number };
  error?: string;
  loading?: boolean;
}

export function LoginComponent({
  role,
  onLogin,
  onSignupClick,
  mousePos,
  error,
  loading,
}: LoginComponentProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="w-full max-w-[420px] px-6 mx-auto">
      {/* Dynamic Header based on Role */}
      <header className="text-center mb-6">
        <div className="text-4xl mb-2">{role === "farmer" ? "🚜" : "🏢"}</div>
        <h1 className="font-serif text-[2.4rem] font-bold text-[#1a2419]">AgriLink</h1>
        <p className="text-sm text-[#1a2419]/70 mt-1">
          {role === "farmer" ? "Empowering Farmers Digitally" : "Strategic Enterprise Procurement"}
        </p>
      </header>

      <main className="bg-white/20 backdrop-blur-[25px] border border-white/30 rounded-[28px] p-[30px_35px] shadow-xl">
        <h2 className="text-center text-[1.7rem] font-bold mb-1 text-[#1a2419]">Welcome Back</h2>
        <p className="text-center text-sm text-[#1a2419]/60 mb-6 italic">
          Managing {role === "farmer" ? "crops & yields" : "procurement & bids"}
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs text-center font-bold">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(role, email, password);
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-sm font-semibold text-[#1a2419] mb-1 block">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-white/70 border border-black/10 outline-none text-[#1a2419]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#1a2419] mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-white/70 border border-black/10 outline-none text-[#1a2419]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-xl bg-[#1e4d2b] text-white font-bold hover:bg-[#153a20] transition-colors disabled:opacity-60"
          >
            {loading ? "Authenticating..." : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>

          <p className="text-center text-sm text-[#1a2419] mt-4">
            Don't have an account?{" "}
            <button type="button" onClick={onSignupClick} className="font-bold text-[#1e4d2b] underline">
              Sign up
            </button>
          </p>
        </form>
      </main>
    </div>
  );
}