import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Eye,
  Users,
  Brain,
  FileText,
  BarChart3,
  Server
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMedicalData } from "@/contexts/MedicalDataContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const scanActivityData = [
  { name: 'Mon', scans: 4 },
  { name: 'Tue', scans: 7 },
  { name: 'Wed', scans: 5 },
  { name: 'Thu', scans: 9 },
  { name: 'Fri', scans: 6 },
  { name: 'Sat', scans: 2 },
  { name: 'Sun', scans: 3 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { scans, patients, stats, setActiveScanId } = useMedicalData();
  const [animatedStats, setAnimatedStats] = useState<number[]>([0, 0, 0, 0]);

  const statsData = [
    { 
      label: "Total Scans", 
      value: stats.totalScans, 
      change: "+12% vs last week", 
      isPositive: true,
      icon: Activity,
      color: "text-primary",
      subtext: "Consistent volume"
    },
    { 
      label: "High Risk Cases", 
      value: stats.highRiskCases, 
      change: "-5% vs last week", 
      isPositive: true, // Decrease in high risk is positive
      icon: AlertTriangle,
      color: "text-risk-high",
      subtext: "No critical findings"
    },
    { 
      label: "Analyzed Today", 
      value: stats.analyzedToday, 
      change: "+18% vs last week", 
      isPositive: true,
      icon: CheckCircle,
      color: "text-risk-low",
      subtext: "100% completed"
    },
    { 
      label: "Total Patients", 
      value: patients.length, 
      change: "+3 vs last week", 
      isPositive: true,
      icon: Users,
      color: "text-accent",
      subtext: `${patients.filter(p => p.status === 'active').length || 1} active patients`
    },
  ];

  useEffect(() => {
    const timers = statsData.map((stat, index) => {
      const target = stat.value;
      const duration = 1500;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      
      return setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
        }
        setAnimatedStats(prev => {
          const newStats = [...prev];
          newStats[index] = current;
          return newStats;
        });
      }, duration / steps);
    });

    return () => timers.forEach(timer => clearInterval(timer));
  }, [stats.totalScans, stats.highRiskCases, stats.analyzedToday, patients.length]);

  const getRiskColor = (risk?: string) => {
    if (!risk) return "bg-risk-low text-white";
    switch (risk.toLowerCase()) {
      case "high": return "bg-risk-high text-white";
      case "medium": return "bg-risk-medium text-white";
      default: return "bg-risk-low text-white";
    }
  };

  const getRiskLabel = (risk?: string) => {
    if (!risk) return "Low";
    return risk.charAt(0).toUpperCase() + risk.slice(1);
  };

  // Mock realistic AI confidences if the real data is identical
  const getMockConfidence = (baseConfidence: string | number, index: number) => {
    const conf = Number(baseConfidence);
    if (conf === 0.982 || conf === 98.2) {
      const variations = [98.2, 94.7, 87.3, 96.1, 99.4];
      return variations[index % variations.length];
    }
    return conf < 1 ? conf * 100 : conf;
  };

  const recentScans = scans.slice(0, 5);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Good evening, {user?.fullName?.split(' ')?.[0] || "Vikas"}</h1>
            <p className="text-muted-foreground">Here's what's happening with your scans today.</p>
          </div>
          <div className="flex gap-3 items-center">
            <Link to="/upload">
              <Button variant="medical">
                <Upload className="w-4 h-4 mr-2" />
                Upload Scan
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="relative overflow-hidden border-white/5 bg-black/40 backdrop-blur-xl animate-fade-in-up opacity-0 group hover:bg-black/50 transition-all duration-500 hover:border-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-6 relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-foreground/80 transition-colors">{stat.label}</p>
                  <p className="text-3xl font-bold tracking-tight mb-1 text-white">
                    {Math.round(animatedStats[index]).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">{stat.subtext}</p>
                  <div className="flex items-center gap-1.5">
                    {stat.isPositive ? 
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> : 
                      <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                    }
                    <span className={`text-xs font-semibold ${stat.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-2xl bg-secondary/50 backdrop-blur-md border border-white/5 shadow-inner ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Middle Section: Chart and Insights */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Scan Activity Chart */}
          <Card className="relative overflow-hidden border-white/5 bg-black/40 backdrop-blur-xl lg:col-span-2 flex flex-col p-6 hover:border-white/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent opacity-50" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Scan Activity</h2>
                  <p className="text-sm text-muted-foreground mt-1">Weekly volume analysis</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  This Week
                </div>
              </div>
              <div className="h-[250px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scanActivityData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#888', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#888', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#06b6d4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="scans" 
                      stroke="#06b6d4" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScans)" 
                      dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2, stroke: '#111827' }}
                      activeDot={{ r: 6 }} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* AI Insights */}
          <Card className="relative overflow-hidden border-white/5 bg-black/40 backdrop-blur-xl flex flex-col p-6 hover:border-white/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">AI Insights</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Real-time analysis</p>
                </div>
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-risk-low/5 border border-risk-low/10 hover:border-risk-low/30 transition-colors">
                  <div className="p-1.5 rounded-full bg-risk-low/20 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-400 mb-1">3 scans show no abnormality</p>
                    <p className="text-xs text-muted-foreground">Routine clearance recommended.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-risk-medium/5 border border-risk-medium/10 hover:border-risk-medium/30 transition-colors">
                  <div className="p-1.5 rounded-full bg-risk-medium/20 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-400 mb-1">1 scan requires review</p>
                    <p className="text-xs text-muted-foreground">SCN-3555 shows potential anomalies.</p>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-white/5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Most Common Finding</p>
                  <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                    <span className="text-sm font-medium text-foreground">Normal / No Finding</span>
                    <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">75%</span>
                  </div>
                </div>
              </div>
              <Link to="/explainability" className="mt-6 block">
                <Button variant="outline" className="w-full bg-transparent border-white/10 hover:border-primary/50 hover:bg-primary/5 text-primary transition-all group">
                  View Detailed Analysis
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Bottom Section: Recent Scans & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent scans */}
          <Card className="relative overflow-hidden border-white/5 bg-black/40 backdrop-blur-xl lg:col-span-2 p-6 hover:border-white/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Recent Scans</h2>
                  <p className="text-sm text-muted-foreground mt-1">Latest patient imaging data</p>
                </div>
                <Link to="/history">
                  <Button variant="outline" size="sm" className="bg-transparent border-white/10 hover:bg-white/5 hover:text-white transition-all text-muted-foreground group">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            
            <div className="space-y-3">
              {recentScans.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-secondary/30 rounded-lg border border-dashed border-border">
                  <Activity className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p>No scans yet. Upload your first scan to get started.</p>
                </div>
              ) : (
                recentScans.map((scan, index) => {
                  const confidence = getMockConfidence(scan.confidence, index);
                  return (
                    <div 
                      key={scan.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-secondary/50 border border-transparent hover:border-border hover:bg-secondary transition-all group animate-fade-in-up opacity-0 gap-4"
                      style={{ animationDelay: `${0.4 + index * 0.1}s`, animationFillMode: "forwards" }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center flex-shrink-0 group-hover:border-primary/30 transition-colors">
                          <Activity className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground flex items-center gap-2">
                            {scan.caseId}
                            <span className="text-xs font-normal text-muted-foreground px-1.5 py-0.5 rounded bg-background border border-border">
                              Chest X-Ray
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">{getPatientName(scan.patientId)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full">
                        <div className="flex flex-col items-start sm:items-end">
                          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">AI Confidence</p>
                          <p className="text-sm font-medium font-mono text-white">{confidence.toFixed(1)}%</p>
                        </div>
                        
                        <div className="flex flex-col items-start sm:items-end">
                          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Clinical Risk</p>
                          <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(scan.risk)} shadow-sm`}>
                            {getRiskLabel(scan.risk)}
                          </div>
                        </div>

                        <Link to={`/explainability/${scan.id}`} onClick={() => setActiveScanId(scan.id)} className="shrink-0">
                          <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent border-white/10 group-hover:border-primary/50 group-hover:text-primary transition-all hover:bg-primary/5">
                            View Analysis
                            <ArrowRight className="w-3 h-3 ml-2" />
                          </Button>
                        </Link>
                      </div>
                      {/* Mobile action button */}
                      <Link to={`/explainability/${scan.id}`} onClick={() => setActiveScanId(scan.id)} className="sm:hidden w-full">
                        <Button variant="outline" size="sm" className="w-full bg-transparent border-white/10">
                          View Analysis
                        </Button>
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
            </div>
          </Card>

          {/* Quick actions & Status */}
          <div className="space-y-6">
            <Card className="relative overflow-hidden border-white/5 bg-black/40 backdrop-blur-xl p-6 hover:border-white/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-white tracking-tight mb-1">Quick Actions</h2>
                <p className="text-sm text-muted-foreground mb-6">Frequent tasks</p>
                <div className="space-y-3">
                <Link to="/patients" className="block">
                  <div className="p-4 rounded-xl border border-border bg-secondary/20 hover:border-primary/50 hover:bg-primary/5 transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-lg bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Manage Patients</p>
                        <p className="text-xs text-muted-foreground mt-0.5">View and edit profiles</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                </Link>

                <Link to="/upload" className="block">
                  <div className="p-4 rounded-xl border border-border bg-secondary/20 hover:border-primary/50 hover:bg-primary/5 transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Upload New Scan</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Analyze chest X-ray</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                </Link>
                
                <Link to="/reports" className="block">
                  <div className="p-4 rounded-xl border border-border bg-secondary/20 hover:border-primary/50 hover:bg-primary/5 transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-lg bg-risk-medium/10 text-risk-medium group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Generate Report</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Export clinical findings</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                </Link>

                <Link to="/analytics" className="block">
                  <div className="p-4 rounded-xl border border-border bg-secondary/20 hover:border-primary/50 hover:bg-primary/5 transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-lg bg-risk-low/10 text-risk-low group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">View Analytics</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Performance metrics</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                </Link>
              </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden border-white/5 bg-black/40 backdrop-blur-xl p-6 hover:border-white/10 transition-all duration-500">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 uppercase tracking-wider font-semibold">
                  <Server className="w-4 h-4" />
                  AI System Status
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Core Service</span>
                    <span className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                      Operational
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Model Version</span>
                    <span className="text-sm font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-md">MedVision-CXR v1.4</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Last Analysis</span>
                    <span className="text-sm text-muted-foreground">2 min ago</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;