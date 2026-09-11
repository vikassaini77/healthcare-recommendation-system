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

  return (
    <AppLayout>
      <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in-up">
        
        {/* Top Header / Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4 flex flex-col justify-between border-border bg-card shadow-sm hover:shadow-md transition-shadow">
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

          <Card className="p-4 flex flex-col justify-between border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
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

          <Card className="p-4 flex flex-col justify-center items-center border-border bg-card shadow-sm text-center">
            <CalendarIcon className="w-6 h-6 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-muted-foreground">{format(currentTime, "MMM dd, yyyy")}</p>
            <h3 className="text-2xl font-bold text-foreground">{format(currentTime, "hh:mm a")}</h3>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-1">
            {/* Patient Info Card */}
            <Card className="p-5 border-border bg-card shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Patient Information</h3>
                <Button variant="ghost" size="sm" className="h-8 text-primary">Edit</Button>
              </div>
              {primaryScan ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Patient ID</span>
                    <span className="font-medium">{primaryScan.patientId}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{primaryScan.patientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Age</span>
                    <span className="font-medium">{primaryScan.patientAge}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Gender</span>
                    <span className="font-medium">{primaryScan.patientGender}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Modality</span>
                    <span className="font-medium">{primaryScan.modality}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{new Date(primaryScan.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-6">No patient data available.</div>
              )}
            </Card>

            {/* Motivational Image Card */}
            <Card className="overflow-hidden border-border bg-primary/5 shadow-sm relative">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?q=80&w=600&auto=format&fit=crop" 
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
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-6 border-border bg-card shadow-sm h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  AI Prediction & Explainability
                </h3>
                {primaryScan && (
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5 border ${getRiskBg(primaryScan.riskLevel)} ${getRiskColor(primaryScan.riskLevel)} border-${primaryScan.riskLevel === 'high' ? 'red' : 'emerald'}-200`}>
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${primaryScan.riskLevel === 'high' ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${primaryScan.riskLevel === 'high' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                    </span>
                    {primaryScan.diagnosis} Detected ({primaryScan.confidence}%)
                  </div>
                )}
              </div>

              {primaryScan ? (
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="flex flex-col">
                    <p className="text-xs font-medium text-muted-foreground mb-2 text-center uppercase tracking-wider">Original X-Ray</p>
                    <div className="relative flex-1 rounded-xl overflow-hidden bg-black/5 border border-border min-h-[250px]">
                      <img src={primaryScan.imageUrl} alt="Original" className="w-full h-full object-contain" />
                      <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">R</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-medium text-primary mb-2 text-center uppercase tracking-wider">Grad-CAM Heatmap</p>
                    <div className="relative flex-1 rounded-xl overflow-hidden bg-black/5 border border-primary/30 min-h-[250px]">
                      {/* Combine original and heatmap for overlay effect */}
                      <img src={primaryScan.imageUrl} alt="Base" className="absolute inset-0 w-full h-full object-contain opacity-80" />
                      {primaryScan.heatmapUrl && (
                        <img src={primaryScan.heatmapUrl} alt="Heatmap" className="absolute inset-0 w-full h-full object-contain mix-blend-screen opacity-90" />
                      )}
                      
                      {/* Heatmap Legend */}
                      <div className="absolute right-3 top-3 bottom-3 w-4 rounded-full bg-gradient-to-b from-red-600 via-yellow-400 to-blue-600 border border-black/20" />
                      <span className="absolute right-8 top-3 text-[10px] font-bold text-foreground bg-background/80 px-1 rounded">High</span>
                      <span className="absolute right-8 bottom-3 text-[10px] font-bold text-foreground bg-background/80 px-1 rounded">Low</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
                  <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                  <p>Upload a scan to view AI analysis.</p>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                <p className="text-sm text-muted-foreground">The highlighted regions indicate the areas in the image that most influenced the model's prediction.</p>
                {primaryScan && (
                  <Link to={`/explainability/${primaryScan.id}`}>
                    <Button size="sm">Full Report</Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="p-5 border-border bg-card shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Top Predictions</h3>
              <div className="space-y-4">
                {CHART_DATA.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 border-border bg-card shadow-sm h-[320px] flex flex-col">
              <h3 className="font-semibold text-lg mb-1">Prediction Distribution</h3>
              <p className="text-xs text-muted-foreground mb-4">Analysis breakdown over last 30 days</p>
              <div className="flex-1 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CHART_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
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
                  <span className="text-2xl font-bold">1,248</span>
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Row - Recent Analyses Table */}
        <Card className="mt-6 p-6 border-border bg-card shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Analyses</h3>
            <Link to="/history">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View All</Button>
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-y border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Date & Time</th>
                  <th className="px-4 py-3 font-medium">Patient ID</th>
                  <th className="px-4 py-3 font-medium">Prediction</th>
                  <th className="px-4 py-3 font-medium">Confidence</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {scans.slice(0, 5).map((scan) => (
                  <tr key={scan.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(scan.date).toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium">{scan.patientId}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1.5 font-medium ${getRiskColor(scan.riskLevel)}`}>
                        <div className={`w-2 h-2 rounded-full ${scan.riskLevel === 'high' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        {scan.diagnosis}
                      </span>
                    </td>
                    <td className="px-4 py-3">{scan.confidence}%</td>
                    <td className="px-4 py-3">
                      <Link to={`/explainability/${scan.id}`} onClick={() => setActiveScanId(scan.id)}>
                        <Button variant="outline" size="sm" className="h-8">View</Button>
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
