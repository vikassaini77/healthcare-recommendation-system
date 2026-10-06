import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMedicalData } from "@/contexts/MedicalDataContext";
import { 
  Activity, Users, FileText, ArrowRight, Upload, 
  BarChart3, Image as ImageIcon, Crosshair, Zap, Calendar as CalendarIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { format } from "date-fns";

const CHART_DATA = [
  { name: 'Normal', value: 43.5, color: '#10b981' },
  { name: 'Pneumonia', value: 32.4, color: '#ef4444' },
  { name: 'Tuberculosis', value: 15.6, color: '#f59e0b' },
  { name: 'COVID-19', value: 4.7, color: '#3b82f6' },
  { name: 'Other', value: 3.8, color: '#8b5cf6' },
];

const Dashboard = () => {
  const { scans, setActiveScanId, patients } = useMedicalData();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case "low": return "text-emerald-500";
      case "high": return "text-red-500";
      case "medium": return "text-amber-500";
      default: return "text-emerald-500";
    }
  };

  const getRiskBg = (risk: string) => {
    switch(risk) {
      case "low": return "bg-emerald-500/10";
      case "high": return "bg-red-500/10";
      case "medium": return "bg-amber-500/10";
      default: return "bg-emerald-500/10";
    }
  };


  // Select a primary scan for the center view
  const primaryScan = scans.length > 0 ? scans[0] : null;
  const primaryPatient = primaryScan ? patients.find(p => p.patientId === primaryScan.patientId || p.id === primaryScan.patientId) : null;


  return (
    <AppLayout>
      <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 lg:p-10 lg:pb-16 animate-fade-in-up">
        
        {/* Top Header / Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
          <Card className="p-6 flex flex-col justify-between border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Images Analyzed</p>
                <h3 className="text-2xl font-bold">1,248</h3>
              </div>
            </div>
            <div className="text-xs text-emerald-500 font-medium flex items-center mt-2">
              <Activity className="w-3 h-3 mr-1" /> +12% vs last month
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patients Assisted</p>
                <h3 className="text-2xl font-bold">320</h3>
              </div>
            </div>
            <div className="text-xs text-emerald-500 font-medium flex items-center mt-2">
              <Activity className="w-3 h-3 mr-1" /> +18% vs last month
            </div>
          </Card>

          <Card className="p-4 flex flex-col justify-between border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Crosshair className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Model Accuracy</p>
                <h3 className="text-2xl font-bold">96.3%</h3>
              </div>
            </div>
            <div className="text-xs text-emerald-500 font-medium flex items-center mt-2">
              <Activity className="w-3 h-3 mr-1" /> +2.1% vs last month
            </div>
          </Card>

          <Card className="p-4 flex flex-col justify-between border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Inference</p>
                <h3 className="text-2xl font-bold">2.4s</h3>
              </div>
            </div>
            <div className="text-xs text-emerald-500 font-medium flex items-center mt-2">
              <Activity className="w-3 h-3 mr-1" /> -10% vs last month
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-center items-center border-border bg-card shadow-sm text-center">
            <CalendarIcon className="w-6 h-6 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-muted-foreground">{format(currentTime, "MMM dd, yyyy")}</p>
            <h3 className="text-2xl font-bold text-foreground">{format(currentTime, "hh:mm a")}</h3>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-1">
            {/* Patient Info Card */}
            <Card className="p-6 border-border bg-card shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Patient Information</h3>
                <Button variant="ghost" size="sm" className="h-8 text-primary">Edit</Button>
              </div>
              {primaryScan ? (
                <div className="space-y-4 text-sm mt-2">
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Patient ID</span>
                    <span className="font-medium">{primaryScan.patientId}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{primaryPatient ? `${primaryPatient.firstName} ${primaryPatient.lastName}` : 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Age</span>
                    <span className="font-medium">{primaryPatient ? new Date().getFullYear() - new Date(primaryPatient.dateOfBirth).getFullYear() : '--'}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Gender</span>
                    <span className="font-medium">{primaryPatient?.gender || '--'}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Modality</span>
                    <span className="font-medium">{primaryScan.modality}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{new Date(primaryScan.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-6">No patient data available.</div>
              )}
            </Card>

            {/* Motivational Image Card */}
            <Card className="overflow-hidden border-border bg-primary/5 shadow-sm relative">
              <img 
                src="/doctors_collaborating.jpg" 
                alt="Doctors collaborating" 
                className="w-full h-40 object-cover opacity-90"
              />
              <div className="p-5 bg-gradient-to-t from-background to-background/60 absolute bottom-0 w-full">
                <h4 className="font-bold text-lg text-foreground leading-tight mb-1">Together for Better Diagnosis</h4>
                <p className="text-xs text-muted-foreground">AI that supports. People who care.</p>
              </div>
            </Card>
          </div>

                    {/* Center Column - Analysis */}
          <div className="space-y-8 lg:col-span-2">
            <Card className="p-8 border-border bg-card shadow-sm h-full flex flex-col relative overflow-hidden">
              {/* Subtle background glow effect */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="font-semibold text-xl flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  AI Prediction & Explainability
                </h3>
                {primaryScan && (
                  <div className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border ${getRiskBg(primaryScan.risk)} ${getRiskColor(primaryScan.risk)} border-${primaryScan.risk === 'high' ? 'red' : 'emerald'}-500/30 shadow-sm backdrop-blur-sm`}>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${primaryScan.risk === 'high' ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${primaryScan.risk === 'high' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                    </span>
                    <span>{primaryScan.prediction} Detected</span>
                    <span className="opacity-70 font-normal">|</span>
                    <span className="font-bold">
                      {(Number(primaryScan.confidence) <= 1 ? Number(primaryScan.confidence) * 100 : Number(primaryScan.confidence)).toFixed(1)}% Confidence
                    </span>
                  </div>
                )}
              </div>

              {primaryScan ? (
                <div className="grid grid-cols-2 gap-8 flex-1 relative z-10 mb-8 mt-4">
                  <div className="flex flex-col group">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        Original X-Ray
                      </p>
                    </div>
                    <div className="relative flex-1 rounded-2xl overflow-hidden bg-black/40 border border-border/50 min-h-[400px] shadow-inner group-hover:border-primary/30 transition-colors">
                      <img src={primaryScan.imageData} alt="Original" className="absolute inset-0 w-full h-full object-contain p-2" />
                      <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md text-foreground text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-border/50">R</div>
                    </div>
                  </div>
                  <div className="flex flex-col group">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-primary flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Grad-CAM Heatmap
                      </p>
                    </div>
                    <div className="relative flex-1 rounded-2xl overflow-hidden bg-black/40 border border-primary/30 min-h-[400px] shadow-[0_0_15px_rgba(var(--primary),0.1)] group-hover:shadow-[0_0_20px_rgba(var(--primary),0.2)] transition-all">
                      <img src={primaryScan.imageData} alt="Base" className="absolute inset-0 w-full h-full object-contain p-2 opacity-70" />
                      {primaryScan.gradcamData && (
                        <img src={primaryScan.gradcamData} alt="Heatmap" className="absolute inset-0 w-full h-full object-contain p-2 mix-blend-screen opacity-100" />
                      )}
                      
                      {/* Elegant Heatmap Legend */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 bg-background/60 backdrop-blur-md p-1.5 rounded-full border border-border/50 shadow-sm">
                        <span className="text-[9px] font-bold text-foreground uppercase tracking-wider">High</span>
                        <div className="w-1.5 h-24 rounded-full bg-gradient-to-b from-red-500 via-yellow-400 to-blue-500" />
                        <span className="text-[9px] font-bold text-foreground uppercase tracking-wider">Low</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground min-h-[300px] bg-secondary/20 rounded-xl border border-dashed border-border/60 m-2">
                  <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                  <p>Upload a scan to view AI analysis.</p>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-border/60 flex justify-between items-center relative z-10 bg-secondary/10 -mx-8 -mb-8 px-8 pb-8 rounded-b-xl">
                <p className="text-sm text-muted-foreground flex items-center gap-3">
                  <Activity className="w-4 h-4 text-primary/70" />
                  Highlighted regions indicate the areas that most influenced the AI's prediction.
                </p>
                {primaryScan && (
                  <Link to={`/explainability/${primaryScan.id}`}>
                    <Button size="sm" className="shadow-sm group">
                      Full Explainability Report
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-8 lg:col-span-1">
            <Card className="p-6 border-border bg-card shadow-sm">
              <h3 className="font-semibold text-lg mb-6">Top Predictions</h3>
              <div className="space-y-5">
                {CHART_DATA.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <span className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-medium text-base">{item.value}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-border bg-card shadow-sm h-[380px] flex flex-col">
              <h3 className="font-semibold text-lg mb-2">Prediction Distribution</h3>
              <p className="text-sm text-muted-foreground mb-6">Analysis breakdown over last 30 days</p>
              <div className="flex-1 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CHART_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {CHART_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text for Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
                  <span className="text-3xl font-bold">1,248</span>
                  <span className="text-sm text-muted-foreground mt-1">Total Scans</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Row - Recent Analyses Table */}
        <Card className="mt-10 mb-10 p-8 border-border bg-card shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-xl">Recent Analyses</h3>
            <Link to="/history">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View All</Button>
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-sm text-muted-foreground uppercase bg-secondary/50 border-y border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Patient ID</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Prediction</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Confidence</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {scans.slice(0, 5).map((scan) => (
                  <tr key={scan.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-300">{new Date(scan.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-white">{scan.patientId}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 font-medium ${getRiskColor(scan.risk)}`}>
                        <div className={`w-2 h-2 rounded-full ${scan.risk === 'high' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        {scan.prediction}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">{scan.confidence}%</td>
                    <td className="px-6 py-4">
                      <Link to={`/explainability/${scan.id}`} onClick={() => setActiveScanId(scan.id)}>
                        <Button variant="outline" size="sm" className="h-9 px-4">View Report</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </AppLayout>
  );
};

export default Dashboard;
