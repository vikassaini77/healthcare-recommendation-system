import React from 'react';

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-background" />
      
      {/* Subtle animated grid */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      
      {/* Animated glowing orbs */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-float mix-blend-screen dark:opacity-50 opacity-100" />
      <div className="absolute bottom-[20%] right-[15%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-float mix-blend-screen dark:opacity-50 opacity-100" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-medical-cyan-glow/10 rounded-full blur-3xl animate-float mix-blend-screen dark:opacity-40 opacity-80" style={{ animationDelay: "4s" }} />
    </div>
  );
};

export default BackgroundAnimation;
