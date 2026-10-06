import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { HeartPulse, Mail, Eye, EyeOff, User } from "lucide-react";
import { toast } from "sonner";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (loginRes.ok) {
        const data = await loginRes.json();
        login(data.access_token, email);
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        toast.success("Account created! Please login.");
        navigate("/auth/login");
      }
    } catch (err) {
      toast.error("Failed to create account. Email might already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden">
      {/* Full Screen Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 animate-breathe-pan" 
        style={{ backgroundImage: 'url("/signup-bg.jpg")' }} 
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Main Content Container */}
      <div className="relative z-20 flex w-full">
        {/* Left Column (Image & Marketing) */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 lg:p-16">
          <div className="flex items-center gap-2">
            <span className="bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
              Join the Network
            </span>
          </div>

          <div className="max-w-md mt-auto mb-auto">
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-white">
              Accelerate <br />
              <span className="text-[#38bdf8]">Clinical Research.</span>
            </h1>
            <p className="text-zinc-300 text-lg mb-12">
              Join thousands of global medical professionals and researchers analyzing complex genomic and radiological datasets in real-time.
            </p>

            <div className="flex items-center gap-8 text-white">
              <div>
                <p className="text-2xl font-bold">15k+</p>
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-1">Specialists</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <p className="text-2xl font-bold">50M+</p>
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-1">Scans Analyzed</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-1">Support</p>
              </div>
            </div>
          </div>
          <div /> {/* Spacer */}
        </div>

        {/* Right Column (Transparent Form) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative z-20">
          
          <div className="w-full max-w-md">
            
            <div className="flex flex-col items-center mb-8">
              <div className="h-16 w-16 bg-[#0f172a]/50 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                <HeartPulse className="h-8 w-8 text-[#38bdf8]" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
              <p className="text-zinc-400 mt-2 text-sm">Join MedVision AI for advanced diagnostics</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block text-white">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="Dr. Jane Doe"
                    className="w-full pl-12 pr-4 py-3 bg-[#0f172a]/40 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] transition-all outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-white">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="doctor@hospital.org"
                    className="w-full pl-12 pr-4 py-3 bg-[#0f172a]/40 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] transition-all outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-white">Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create a strong password"
                    className="w-full pl-4 pr-12 py-3 bg-[#0f172a]/40 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] transition-all outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-white">Confirm Password</label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Confirm your password"
                    className="w-full pl-4 pr-12 py-3 bg-[#0f172a]/40 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] transition-all outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center mt-2 mb-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" required className="w-4 h-4 rounded border-white/20 bg-transparent text-[#38bdf8] focus:ring-[#38bdf8] accent-[#38bdf8]" />
                  <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
                    I accept the <Link to="#" className="text-[#38bdf8] hover:underline">Terms of Service</Link> and <Link to="#" className="text-[#38bdf8] hover:underline">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-base font-bold bg-gradient-to-r from-[#0ea5e9] to-[#3b82f6] text-white hover:opacity-90 rounded-xl transition-all mt-4 border-0" 
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-[#38bdf8] hover:underline font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
