import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";


const HeroSection = () => {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-dark" />
      
      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Data Science & ML Powered
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
                <span className="text-foreground">Personalized Healthcare &</span>
                <br />
                <span className="bg-gradient-medical bg-clip-text text-transparent">Medicine Recommendation System</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                Predict diseases from symptoms and generate personalized medicine recommendations using advanced Machine Learning filtering techniques.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
              <Link to="/demo">
                <Button variant="hero" className="w-full sm:w-auto">
                  Try Live Demo
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="hero-outline" className="w-full sm:w-auto">
                    <Play className="w-5 h-5" />
                    Watch Cinematic Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/90 border-primary/20">
                  <video 
                    src="/demo_video.mp4" 
                    controls 
                    autoPlay 
                    className="w-full h-auto aspect-video rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-in-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              {[
                { value: "99.2%", label: "Accuracy" },
                { value: "< 2s", label: "Inference Time" },
                { value: "100%", label: "Personalized" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

                    {/* Right content - Animated Medical Visual */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in opacity-0" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
            <div className="relative w-full max-w-lg aspect-square">
              {/* Main container with glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-card to-secondary/50 border border-border shadow-glow-lg overflow-hidden group">
                
                {/* Hero Image */}
                <img src="/hero-xray.jpg" alt="AI Medical Analysis" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                
                {/* Scan line effect */}
                <div className="absolute inset-0 scan-line mix-blend-overlay opacity-50" />
                
                {/* Floating data points */}
                <div className="absolute top-6 right-6 bg-card/80 backdrop-blur-md border border-border/50 rounded-lg p-3 shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">AI Confidence</div>
                  <div className="text-xl font-bold text-primary">94.7%</div>
                </div>
                
                <div className="absolute bottom-6 left-6 bg-card/80 backdrop-blur-md border border-border/50 rounded-lg p-3 shadow-lg animate-float" style={{ animationDelay: "1s" }}>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Risk Level</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                    <span className="text-sm font-bold text-foreground">Moderate</span>
                  </div>
                </div>
              </div>

              {/* Decorative rings */}
              <div className="absolute -inset-4 rounded-3xl border border-primary/20 animate-pulse" style={{ animationDuration: "4s" }} />
              <div className="absolute -inset-8 rounded-3xl border border-primary/5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
