import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedMedicalBackground from '@/components/auth/AnimatedMedicalBackground';
import AuthCard from '@/components/auth/AuthCard';
import PasswordInput from '@/components/auth/PasswordInput';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, AlertCircle, Activity, Mail, Lock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your email and password.');
      triggerShake();
      return;
    }

    const result = await signIn(email, password, rememberMe);
    
    if (result.error) {
      setError(result.error);
      triggerShake();
    } else {
      navigate(from, { replace: true });
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen w-full flex relative bg-black selection:bg-primary/30 overflow-hidden">
      {/* Full Screen Background Image */}
      <img 
        src="/login-bg.jpg" 
        alt="Medical AI Background" 
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-screen animate-breathe-pan" 
      />
      
      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent lg:to-background/20 z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 z-0" />

      {/* Left Content (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col justify-center relative z-10 w-1/2 p-12 xl:p-24">
        <div className="max-w-xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6 backdrop-blur-md animate-float" style={{ animationDuration: "4s" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            System Online
          </div>
          
          <h1 className="text-5xl xl:text-6xl font-bold leading-tight text-white mb-6 tracking-tight drop-shadow-xl">
            Next-Generation <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-none">Medical Intelligence.</span>
          </h1>
          
          <p className="text-lg xl:text-xl text-white/80 max-w-md font-light leading-relaxed drop-shadow-md">
            Empowering healthcare professionals with state-of-the-art AI explainability, real-time diagnostics, and predictive insights.
          </p>
          
          <div className="mt-12 flex gap-8">
            <div className="animate-float" style={{ animationDelay: "0s" }}>
              <div className="text-3xl font-bold text-white drop-shadow-md">99.2%</div>
              <div className="text-sm text-white/60 uppercase tracking-widest font-semibold mt-1">Accuracy</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="animate-float" style={{ animationDelay: "1s" }}>
              <div className="text-3xl font-bold text-white drop-shadow-md">&lt; 2s</div>
              <div className="text-sm text-white/60 uppercase tracking-widest font-semibold mt-1">Inference</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="animate-float" style={{ animationDelay: "2s" }}>
              <div className="text-3xl font-bold text-white drop-shadow-md">100%</div>
              <div className="text-sm text-white/60 uppercase tracking-widest font-semibold mt-1">Explainable</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content - Glassmorphic Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10 p-6">
        
        <div className="w-full max-w-md mx-auto relative z-10 animate-fade-in">
          {/* Glass Card Container */}
          <div className="p-8 lg:p-10 relative">
            
            <div className="mb-10 text-center flex flex-col items-center">
              <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl mb-5 border border-primary/20 shadow-glow-sm relative group">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Activity className="w-8 h-8 text-primary relative z-10" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Welcome Back</h2>
              <p className="text-muted-foreground font-medium">Secure access to MedVision AI</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-fade-in shadow-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2.5 relative group">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground/90 ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.org"
                    disabled={isLoading}
                    autoComplete="email"
                    className={cn(
                      "bg-background/60 backdrop-blur-sm border-white/10 h-14 pl-12 pr-4 rounded-xl transition-all duration-300 text-base",
                      "focus:bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-inner",
                      error && !email && "border-destructive focus:border-destructive"
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2.5 relative group">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground/90 ml-1">Password</Label>
                <div className="relative">
                  {/* Note: PasswordInput already has its own styling, but we wrap it for consistent spacing */}
                  <PasswordInput
                    id="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    error={!!error && !password}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    disabled={isLoading}
                    className="rounded-md data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-white/20"
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground font-medium cursor-pointer select-none">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/auth/forgot-password"
                  className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all duration-300 transform hover:-translate-y-0.5 mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
              New to MedVision AI?{' '}
              <Link to="/auth/signup" className="font-bold text-primary hover:underline hover:text-primary/80 transition-colors">
                Create an account
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-muted-foreground/60 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              Secure medical platform • HIPAA-aware design
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
