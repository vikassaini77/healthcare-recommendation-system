import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import AnimatedMedicalBackground from '@/components/auth/AnimatedMedicalBackground';
import AuthCard from '@/components/auth/AuthCard';
import PasswordInput from '@/components/auth/PasswordInput';
import PasswordStrengthIndicator, { isPasswordValid } from '@/components/auth/PasswordStrengthIndicator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertCircle, CheckCircle2, Activity, Mail, Lock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles: { value: UserRole; label: string }[] = [
  { value: 'radiologist', label: 'Radiologist' },
  { value: 'physician', label: 'Physician' },
  { value: 'researcher', label: 'Medical Researcher' },
  { value: 'admin', label: 'Hospital Admin' },
];

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, isLoading } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('radiologist');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const isFormValid = fullName && email && isPasswordValid(password) && passwordsMatch && acceptTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email) {
      setError('Please fill in all required fields.');
      triggerShake();
      return;
    }

    if (!isPasswordValid(password)) {
      setError('Please ensure your password meets all requirements.');
      triggerShake();
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      triggerShake();
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the Terms of Service and Privacy Policy.');
      triggerShake();
      return;
    }

    const result = await signUp(email, password, fullName, role);
    
    if (result.error) {
      setError(result.error);
      triggerShake();
    } else {
      navigate('/dashboard', { replace: true });
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
        src="/signup-bg.jpg" 
        alt="Medical AI Background" 
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-screen animate-breathe-pan" 
      />
      
      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent lg:to-background/20 z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 z-0" />

      {/* Left Content (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col justify-center relative z-10 w-1/2 p-12 xl:p-24">
        <div className="max-w-xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 backdrop-blur-md animate-float" style={{ animationDuration: "4s" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
            </span>
            Join the Network
          </div>
          
          <h1 className="text-5xl xl:text-6xl font-bold leading-tight text-white mb-6 tracking-tight drop-shadow-xl">
            Accelerate <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-none">Clinical Research.</span>
          </h1>
          
          <p className="text-lg xl:text-xl text-white/80 max-w-md font-light leading-relaxed drop-shadow-md">
            Join thousands of global medical professionals and researchers analyzing complex genomic and radiological datasets in real-time.
          </p>
          
          <div className="mt-12 flex gap-8">
            <div className="animate-float" style={{ animationDelay: "0s" }}>
              <div className="text-3xl font-bold text-white drop-shadow-md">15k+</div>
              <div className="text-sm text-white/60 uppercase tracking-widest font-semibold mt-1">Specialists</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="animate-float" style={{ animationDelay: "1s" }}>
              <div className="text-3xl font-bold text-white drop-shadow-md">50M+</div>
              <div className="text-sm text-white/60 uppercase tracking-widest font-semibold mt-1">Scans Analyzed</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="animate-float" style={{ animationDelay: "2s" }}>
              <div className="text-3xl font-bold text-white drop-shadow-md">24/7</div>
              <div className="text-sm text-white/60 uppercase tracking-widest font-semibold mt-1">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content - Glassmorphic Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10 p-6">
        
        <div className="w-full max-w-lg mx-auto relative z-10 animate-fade-in">
          {/* Glass Card Container */}
          <div className="p-8 lg:p-10 relative">
            
            <div className="mb-8 text-center flex flex-col items-center">
              <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl mb-4 border border-primary/20 shadow-glow-sm relative group">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Activity className="w-8 h-8 text-primary relative z-10" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Create Account</h2>
              <p className="text-muted-foreground font-medium">Join MedVision AI for advanced diagnostics</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-fade-in shadow-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2.5 relative group">
                <Label htmlFor="fullName" className="text-sm font-semibold text-foreground/90 ml-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Jane Doe"
                    disabled={isLoading}
                    className={cn(
                      "bg-background/60 backdrop-blur-sm border-white/10 h-12 pl-12 pr-4 rounded-xl transition-all duration-300",
                      "focus:bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-inner"
                    )}
                  />
                </div>
              </div>

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
                    className={cn(
                      "bg-background/60 backdrop-blur-sm border-white/10 h-12 pl-12 pr-4 rounded-xl transition-all duration-300",
                      "focus:bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-inner",
                      error && !email && "border-destructive focus:border-destructive"
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground/90 ml-1">Password</Label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                  error={!!error && !password}
                />
              </div>
              
              <div className="space-y-2.5">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground/90 ml-1">Confirm Password</Label>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  error={!!error && !confirmPassword}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-xl mt-6 text-lg font-bold bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
              Already have an account?{' '}
              <Link to="/auth/login" className="font-bold text-primary hover:underline hover:text-primary/80 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
