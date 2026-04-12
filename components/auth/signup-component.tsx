"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SignupProps {
  role: "farmer" | "buyer";
  onLoginClick: () => void;
  onSignup: (data: any) => void;
  error?: string;
  loading?: boolean;
}

export function SignupComponent({ role, onLoginClick, onSignup, error, loading }: SignupProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    farmSize: "",
    cropType: "",
  });

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

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = "Required";
    if (!formData.phone || formData.phone.length < 10) newErrors.phone = "Invalid phone";
    if (formData.email && !formData.email.includes("@")) newErrors.email = "Invalid email";
    if (formData.password.length < 6) newErrors.password = "Min 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Doesn't match";
    if (!formData.location) newErrors.location = "Required";

    if (Object.keys(newErrors).length === 0) {
      onSignup({ ...formData, role });
    } else {
      setErrors(newErrors);
    }
  };

  const inputClass = (field: string) =>
    `w-full p-2.5 rounded-xl bg-white/70 border outline-none text-[#1a2419] text-sm placeholder-[#1a2419]/40 ${
      errors[field] ? "border-red-500" : "border-black/10"
    }`;

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

      <div className="w-full max-w-[500px] px-6 py-8">
        <header className="text-center mb-4">
          <div className="text-3xl mb-1">{role === "farmer" ? "🚜" : "🏢"}</div>
          <h1 className="font-serif text-[2rem] font-bold text-[#1a2419]">AgriLink</h1>
          <p className="text-xs text-[#1a2419]/70 mt-0.5">Empowering Bharat's Agriculture</p>
        </header>

        <main className="bg-white/20 backdrop-blur-[25px] border border-white/30 rounded-[28px] p-6 shadow-xl">
          <h2 className="text-center text-lg font-bold mb-0.5 text-[#1a2419]">Create Account</h2>
          <p className="text-center text-xs text-[#1a2419]/60 mb-4">
            {role === "farmer" ? "Join as a Farmer" : "Join as a Buyer"}
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-100 border border-red-300 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={validateAndSubmit} className="space-y-3">
            {/* Row 1: Full Name + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#1a2419] mb-1 block">Full Name *</label>
                <input
                  placeholder="Your name"
                  className={inputClass("fullName")}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-0.5">{errors.fullName}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1a2419] mb-1 block">Phone *</label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  className={inputClass("phone")}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone}</p>}
              </div>
            </div>

            {/* Row 2: Email + Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#1a2419] mb-1 block">
                  Email <span className="text-[#1a2419]/40 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="If you have one"
                  className={inputClass("email")}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1a2419] mb-1 block">Village / City *</label>
                <input
                  placeholder="Your location"
                  className={inputClass("location")}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
                {errors.location && <p className="text-red-500 text-xs mt-0.5">{errors.location}</p>}
              </div>
            </div>

            {/* Row 3: Password + Confirm */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#1a2419] mb-1 block">Password *</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={inputClass("password")}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
                {errors.password && <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1a2419] mb-1 block">Confirm Password *</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={inputClass("confirmPassword")}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-0.5">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Row 4: Farmer-only fields */}
            {role === "farmer" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1a2419] mb-1 block">
                    Farm Size <span className="text-[#1a2419]/40 font-normal">(optional)</span>
                  </label>
                  <select
                    className="w-full p-2.5 rounded-xl bg-white/70 border border-black/10 outline-none text-[#1a2419] text-sm"
                    onChange={(e) => handleChange("farmSize", e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Select size</option>
                    <option value="small">Under 2 acres</option>
                    <option value="medium">2 – 10 acres</option>
                    <option value="large">10 – 50 acres</option>
                    <option value="xlarge">50+ acres</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1a2419] mb-1 block">
                    Primary Crop <span className="text-[#1a2419]/40 font-normal">(optional)</span>
                  </label>
                  <select
                    className="w-full p-2.5 rounded-xl bg-white/70 border border-black/10 outline-none text-[#1a2419] text-sm"
                    onChange={(e) => handleChange("cropType", e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Select crop</option>
                    <option value="wheat">Wheat</option>
                    <option value="rice">Rice</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="pulses">Pulses / Legumes</option>
                    <option value="cotton">Cotton</option>
                    <option value="sugarcane">Sugarcane</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3.5 rounded-xl bg-[#1e4d2b] text-white font-bold hover:bg-[#153a20] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#1a2419]/20" />
              <span className="text-xs text-[#1a2419]/50 font-medium">OR</span>
              <div className="flex-1 h-px bg-[#1a2419]/20" />
            </div>

            <p className="text-center text-sm text-[#1a2419]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onLoginClick}
                className="font-bold text-[#1e4d2b] underline cursor-pointer"
              >
                Login
              </button>
            </p>
          </form>
        </main>
      </div>
    </motion.div>
  );
}