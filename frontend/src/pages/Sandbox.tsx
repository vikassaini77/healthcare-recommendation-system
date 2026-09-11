import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft,
  Play, 
  Upload as UploadIcon, 
  Activity, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  Brain,
  HeartPulse,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

// Pre-defined sample scans
const SAMPLE_SCANS = [
  {
    id: "chest_normal",
    name: "Chest X-Ray (Normal)",
    icon: HeartPulse,
    image: "/demo-scans/chest_normal.jpg",
    type: "X-Ray",
    mockResult: {
      finding: "No acute cardiopulmonary abnormalities.",
      confidence: 99.2,
      riskLevel: "Low",
      heatmapUrl: "/demo-scans/chest_normal.jpg" // Simulated
    }
  },
  {
    id: "chest_pneumonia",
    name: "Chest X-Ray (Pneumonia)",
    icon: HeartPulse,
    image: "/demo-scans/chest_pneumonia.jpg",
    type: "X-Ray",
    mockResult: {
      finding: "Patchy opacities in lower right lobe consistent with pneumonia.",
      confidence: 94.7,
      riskLevel: "High",
      heatmapUrl: "/demo-scans/chest_pneumonia.jpg"
    }
  },
  {
    id: "brain_mri",
    name: "Brain MRI (Anomalous)",
    icon: Brain,
    image: "/demo-scans/brain_mri.jpg",
    type: "MRI",
    mockResult: {
      finding: "Hyperintense lesion observed in the left frontal lobe.",
      confidence: 88.5,
      riskLevel: "Medium",
      heatmapUrl: "/demo-scans/brain_mri.jpg"
    }
  }
];

const Sandbox = () => {
  const navigate = useNavigate();
  const [selectedScan, setSelectedScan] = useState<typeof SAMPLE_SCANS[0] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectScan = (scan: typeof SAMPLE_SCANS[0]) => {
    setSelectedScan(scan);
    setShowResult(false);
    setProgress(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const customScan = {
        id: 'custom_upload_' + Date.now(),
        name: file.name,
        icon: ImageIcon,
        image: dataUrl,
        type: 'Custom Upload',
        mockResult: {
          finding: 'AI analysis complete. Anomalies detected requiring clinical correlation.',
          confidence: parseFloat((Math.random() * (99 - 85) + 85).toFixed(1)), // random between 85-99
          riskLevel: Math.random() > 0.5 ? 'Medium' : 'Low',
          heatmapUrl: dataUrl // The generic heatmap gradient will be overlaid on this
        }
      };

      setSelectedScan(customScan);
      setShowResult(false);
      setProgress(0);
      toast.success('Custom scan uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = () => {
    if (!selectedScan) {
      toast.error("Please select a sample scan first.");
      return;
    }

    setIsAnalyzing(true);
    setShowResult(false);
    setProgress(0);

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Complete analysis after 2 seconds
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsAnalyzing(false);
      setShowResult(true);
      toast.success("Analysis complete!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Minimal Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <div className="h-6 w-px bg-border/50"></div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg tracking-tight">MedVision<span className="text-primary">AI</span> Sandbox</span>
            </div>
          </div>
          <Button onClick={() => navigate('/auth/signup')} variant="medical" size="sm">
            Sign up for free
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12 flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary/80 to-blue-500">
            Experience the Future of Radiology
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Select a sample scan below and watch our explainable AI generate clinical insights with Grad-CAM visualization in seconds.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 rounded-full px-6 shadow-glow">
                <Play className="w-4 h-4 mr-2" />
                Watch Cinematic Video
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Input Selection */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> 1. Select a Sample Scan
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {SAMPLE_SCANS.map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => handleSelectScan(scan)}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-300 backdrop-blur-sm ${
                    selectedScan?.id === scan.id 
                      ? 'border-primary/60 bg-primary/10 shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-primary/30' 
                      : 'border-border/50 bg-card hover:border-primary/40 hover:bg-accent'
                  }`}

                >
                  <div className={`p-3 rounded-lg ${selectedScan?.id === scan.id ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    <scan.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{scan.name}</h3>
                    <p className="text-sm text-muted-foreground">Type: {scan.type}</p>
                  </div>
                  <div className="ml-auto">
                    <ChevronRight className={`w-5 h-5 ${selectedScan?.id === scan.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Card 
              className="medical-card border-dashed border-border p-8 text-center bg-card hover:bg-accent transition-colors cursor-pointer group backdrop-blur-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="w-16 h-16 rounded-full bg-muted group-hover:bg-primary/20 transition-colors flex items-center justify-center mx-auto mb-4 border border-border/50 group-hover:border-primary/30 shadow-inner">
                <UploadIcon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-medium text-foreground mb-1">Upload your own scan</h3>
              <p className="text-sm text-muted-foreground mb-4">
                JPG, PNG up to 10MB
              </p>
              <Button variant="outline" className="w-full group-hover:border-primary/50 group-hover:text-primary transition-colors">
                Browse Files
              </Button>
            </Card>
          </div>

          {/* Right Column: Preview and Analysis */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> 2. AI Analysis
              </h2>
              {selectedScan && !isAnalyzing && !showResult && (
                <Button onClick={runAnalysis} variant="medical" className="animate-pulse-glow">
                  Run Analysis <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            <Card className="medical-card overflow-hidden min-h-[400px] flex flex-col relative border-border bg-card backdrop-blur-md shadow-2xl">
              {!selectedScan ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-2 border-dashed border-border/50 m-4 rounded-xl bg-muted/50">
                  <Activity className="w-16 h-16 mb-4 text-primary/40 animate-pulse" />
                  <p className="text-lg">Select a scan from the left to preview it here.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  {/* Image Preview / Result */}
                  <div className="relative w-full h-64 bg-muted flex items-center justify-center overflow-hidden border-b border-border/50">
                    <img 
                      src={showResult ? selectedScan.mockResult.heatmapUrl : selectedScan.image} 
                      alt="Scan Preview" 
                      className="max-h-full object-contain mix-blend-screen transition-opacity duration-500"
                    />
                    
                    {/* Simulated Grad-CAM Overlay (Overlay colored gradient if showResult is true) */}
                    {showResult && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[rgba(255,50,50,0.2)] to-[rgba(50,255,50,0.1)] mix-blend-overlay animate-in fade-in duration-1000"></div>
                    )}

                    {/* Scanning Animation overlay */}
                    {isAnalyzing && (
                      <>
                        <div className="absolute inset-0 bg-primary/5"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_rgba(0,212,255,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                      </>
                    )}
                  </div>

                  {/* Status / Results Section */}
                  <div className="p-6 flex-1 bg-card/80">
                    {isAnalyzing ? (
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-primary font-medium animate-pulse">Processing via Neural Network...</span>
                          <span className="text-muted-foreground">{progress}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300 ease-out relative"
                            style={{ width: `${progress}%` }}
                          >
                            <div className="absolute inset-0 bg-white/30 w-full animate-[shimmer_1s_infinite]"></div>
                          </div>
                        </div>
                      </div>
                    ) : showResult ? (
                      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            <h3 className="font-semibold text-lg">Analysis Complete</h3>
                          </div>
                          <p className="text-muted-foreground">{selectedScan.mockResult.finding}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-secondary/50 p-4 rounded-xl border border-border/50">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Confidence</p>
                            <p className="text-2xl font-bold text-primary">{selectedScan.mockResult.confidence}%</p>
                          </div>
                          <div className="bg-secondary/50 p-4 rounded-xl border border-border/50">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Risk Level</p>
                            <p className={`text-2xl font-bold ${
                              selectedScan.mockResult.riskLevel === 'Low' ? 'text-emerald-400' :
                              selectedScan.mockResult.riskLevel === 'Medium' ? 'text-amber-400' : 'text-red-400'
                            }`}>{selectedScan.mockResult.riskLevel}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border/50 mt-4">
                           <Button onClick={() => navigate('/auth/signup')} className="w-full" variant="medical">
                             Unlock Full Report & Features
                           </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                        <p>Click "Run Analysis" to process this scan using our state-of-the-art diagnostic model.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// Add ArrowRight icon that was missing from imports
function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export default Sandbox;
