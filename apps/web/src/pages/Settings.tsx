import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Save,
  CreditCard,
  Camera,
  Upload,
  Monitor,
  Smartphone,
  Download,
  Laptop,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { useSearchParams, useNavigate } from "react-router-dom";
import React from "react";

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get("tab") || "profile";

  const [compactMode, setCompactMode] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const handleTabChange = (value: string) => {
    navigate(`/settings?tab=${value}`, { replace: true });
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
          <Button variant="medical" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs key={currentTab} value={currentTab} onValueChange={handleTabChange} className="flex flex-col md:flex-row gap-8 w-full">
          {/* Vertical Sidebar Navigation */}
          <TabsList className="flex flex-row overflow-x-auto md:flex-col justify-start items-stretch bg-transparent md:space-y-2 w-full md:w-56 h-auto p-0 flex-shrink-0 hide-scrollbar">
            <TabsTrigger 
              value="profile" 
              className="flex w-full data-[state=active]:bg-secondary/80 data-[state=active]:text-primary justify-start py-3 px-4 rounded-lg font-medium text-muted-foreground hover:bg-secondary/40 transition-all text-sm"
            >
              <User className="w-4 h-4 mr-3" /> Profile
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="flex w-full data-[state=active]:bg-secondary/80 data-[state=active]:text-primary justify-start py-3 px-4 rounded-lg font-medium text-muted-foreground hover:bg-secondary/40 transition-all text-sm"
            >
              <CreditCard className="w-4 h-4 mr-3" /> Billing
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex w-full data-[state=active]:bg-secondary/80 data-[state=active]:text-primary justify-start py-3 px-4 rounded-lg font-medium text-muted-foreground hover:bg-secondary/40 transition-all text-sm"
            >
              <Bell className="w-4 h-4 mr-3" /> Alerts
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="flex w-full data-[state=active]:bg-secondary/80 data-[state=active]:text-primary justify-start py-3 px-4 rounded-lg font-medium text-muted-foreground hover:bg-secondary/40 transition-all text-sm"
            >
              <Database className="w-4 h-4 mr-3" /> Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="flex w-full data-[state=active]:bg-secondary/80 data-[state=active]:text-primary justify-start py-3 px-4 rounded-lg font-medium text-muted-foreground hover:bg-secondary/40 transition-all text-sm"
            >
              <Shield className="w-4 h-4 mr-3" /> Security
            </TabsTrigger>
            <TabsTrigger 
              value="display" 
              className="flex w-full data-[state=active]:bg-secondary/80 data-[state=active]:text-primary justify-start py-3 px-4 rounded-lg font-medium text-muted-foreground hover:bg-secondary/40 transition-all text-sm"
            >
              <Palette className="w-4 h-4 mr-3" /> Display
            </TabsTrigger>
          </TabsList>

        {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <TabsContent value="profile" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="medical-card border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-card/50">
                  <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
                  <p className="text-sm text-muted-foreground mt-1">Manage your basic profile details and medical credentials.</p>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-2xl relative group overflow-hidden shrink-0">
                      {user?.fullName?.substring(0, 2)?.toUpperCase() || 'MD'}
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-foreground">
                        <Camera className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="h-8 relative overflow-hidden">
                          <Upload className="w-3 h-3 mr-2" /> Upload new picture
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">Remove</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">At least 256x256px. PNG or JPG format.</p>
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                      <Input id="name" defaultValue={user?.fullName || ''} className="bg-secondary/50 border-border focus-visible:ring-primary/30" />
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                      <Input id="email" type="email" defaultValue={user?.email || ''} className="bg-secondary/50 border-border focus-visible:ring-primary/30" />
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                      <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="bg-secondary/50 border-border focus-visible:ring-primary/30" />
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="specialty" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Primary Specialty</Label>
                      <Select defaultValue="radiology">
                        <SelectTrigger id="specialty" className="bg-secondary/50 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="radiology">Radiology</SelectItem>
                          <SelectItem value="oncology">Oncology</SelectItem>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="department" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department / Hospital</Label>
                      <Input id="department" defaultValue="Central General Hospital" className="bg-secondary/50 border-border focus-visible:ring-primary/30" />
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="license" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Medical License</Label>
                      <Input id="license" defaultValue="MD-2024-XXXX" className="bg-secondary/50 border-border focus-visible:ring-primary/30" />
                    </div>
                    <div className="space-y-2.5 md:col-span-2">
                      <Label htmlFor="bio" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Professional Bio</Label>
                      <Textarea id="bio" placeholder="Brief professional background..." className="bg-secondary/50 border-border focus-visible:ring-primary/30 min-h-[100px] resize-y" defaultValue="Senior Radiologist specializing in thoracic imaging and AI-assisted diagnostics with over 15 years of clinical experience." />
                      <p className="text-xs text-muted-foreground text-right">132 / 500 characters used</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary/30 p-4 border-t border-border/50 flex justify-end">
                  <Button variant="medical" size="sm" onClick={handleSave}>Save Changes</Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="border border-border/50 shadow-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                <div className="p-6 border-b border-border/50 relative z-10">
                  <h2 className="text-lg font-semibold text-foreground">Current Plan</h2>
                  <p className="text-sm text-muted-foreground mt-1">You are currently on the Pro Clinical Plan.</p>
                </div>
                
                <div className="p-6 space-y-8 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-foreground">Pro Clinical</h3>
                        <span className="bg-primary/20 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Unlimited AI Scans • 5 Users • Priority Support</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-bold text-3xl text-foreground">$499<span className="text-lg text-muted-foreground font-normal"> / mo</span></p>
                      <p className="text-sm text-muted-foreground mt-1">Renews on Oct 1, 2026</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">AI Scans Usage</p>
                        <p className="text-xs text-muted-foreground">423 / 500 scans processed this month</p>
                      </div>
                      <p className="text-sm font-semibold text-primary">84%</p>
                    </div>
                    <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: '84%' }} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary/30 p-4 border-t border-border/50 flex justify-between items-center relative z-10">
                  <Button variant="outline" size="sm">Cancel Plan</Button>
                  <Button variant="medical" size="sm">Upgrade to Enterprise</Button>
                </div>
              </Card>

              <Card className="medical-card border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-card/50">
                  <h2 className="text-lg font-semibold text-foreground">Payment Method</h2>
                  <p className="text-sm text-muted-foreground mt-1">Manage how you pay for your subscription.</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between p-4 border border-border/80 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-white rounded-md flex items-center justify-center text-[#1434CB] font-bold text-sm shadow-sm border border-gray-200">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">Visa ending in 4242</p>
                        <p className="text-xs text-muted-foreground">Expires 12/28</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">Edit</Button>
                  </div>
                </div>
              </Card>

              <Card className="medical-card border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-card/50 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Billing History</h2>
                    <p className="text-sm text-muted-foreground mt-1">View and download your previous invoices.</p>
                  </div>
                  <Button variant="outline" size="sm" className="hidden sm:flex"><Download className="w-4 h-4 mr-2" /> Download All</Button>
                </div>
                <div className="divide-y divide-border/50">
                  {[
                    { id: "inv-001", date: "Sep 1, 2026", amount: "$499.00", status: "Paid" },
                    { id: "inv-002", date: "Aug 1, 2026", amount: "$499.00", status: "Paid" },
                    { id: "inv-003", date: "Jul 1, 2026", amount: "$499.00", status: "Paid" },
                  ].map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-secondary/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-secondary/50 p-2 rounded-md">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{inv.amount}</p>
                          <p className="text-xs text-muted-foreground">{inv.date} • {inv.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-md hidden sm:block">{inv.status}</span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Download className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="medical-card border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-card/50">
                  <h2 className="text-lg font-semibold text-foreground">Email Notifications</h2>
                  <p className="text-sm text-muted-foreground mt-1">Choose what updates you want to receive via email.</p>
                </div>
                
                <div className="divide-y divide-border/50">
                  {[
                    { id: "high-risk", label: "High Risk Alerts", desc: "Immediate notification for high-risk findings in your patients.", defaultChecked: true },
                    { id: "analysis-complete", label: "Analysis Complete", desc: "Notify when a background scan analysis is finished processing.", defaultChecked: true },
                    { id: "weekly-report", label: "Weekly Reports", desc: "Receive a weekly performance and analytics summary.", defaultChecked: false },
                    { id: "system-updates", label: "System Updates", desc: "Important notifications about AI model updates and maintenance.", defaultChecked: true },
                  ].map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-secondary/10 transition-colors">
                      <div className="flex-1 pr-4">
                        <Label htmlFor={item.id} className="text-sm font-medium text-foreground cursor-pointer">{item.label}</Label>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
                      </div>
                      <Switch id={item.id} defaultChecked={item.defaultChecked} className="data-[state=checked]:bg-primary" />
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="medical-card border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-card/50">
                  <h2 className="text-lg font-semibold text-foreground">AI Analysis Models</h2>
                  <p className="text-sm text-muted-foreground mt-1">Configure the core behavior of the AI engine.</p>
                </div>
                
                <div className="p-6 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Default Model Engine</Label>
                      <Select defaultValue="v2.4.1">
                        <SelectTrigger className="bg-secondary/50 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="v2.4.1">MedVision v2.4.1 (Latest • Fast)</SelectItem>
                          <SelectItem value="v2.3.0">MedVision v2.3.0 (Stable)</SelectItem>
                          <SelectItem value="v2.2.5">MedVision v2.2.5 (Legacy)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Select the neural network used for new scans.</p>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confidence Threshold</Label>
                      <Select defaultValue="90">
                        <SelectTrigger className="bg-secondary/50 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="85">85% (High Sensitivity)</SelectItem>
                          <SelectItem value="90">90% (Balanced Default)</SelectItem>
                          <SelectItem value="95">95% (High Precision)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Minimum AI confidence required to flag anomalies.</p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-border/50 border-t border-border/50 bg-card">
                  {[
                    { id: "auto-gradcam", label: "Auto-generate Explainability (Grad-CAM)", desc: "Automatically create heatmaps for every positive finding.", defaultChecked: true },
                    { id: "multi-findings", label: "Detect Secondary Findings", desc: "Report minor or incidental abnormalities alongside primary findings.", defaultChecked: true },
                    { id: "comparison", label: "Historical Comparison (Beta)", desc: "Automatically compare new scans with the patient's previous scans.", defaultChecked: false },
                  ].map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-secondary/10 transition-colors">
                      <div className="flex-1 pr-4">
                        <Label htmlFor={item.id} className="text-sm font-medium text-foreground cursor-pointer">{item.label}</Label>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
                      </div>
                      <Switch id={item.id} defaultChecked={item.defaultChecked} className="data-[state=checked]:bg-primary" />
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="medical-card border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-card/50">
                  <h2 className="text-lg font-semibold text-foreground">Privacy & Security</h2>
                  <p className="text-sm text-muted-foreground mt-1">Manage data protection and HIPAA compliance settings.</p>
                </div>

                <div className="divide-y divide-border/50">
                  {[
                    { id: "anonymize", label: "Auto-anonymize Patient Data", desc: "Strip all PHI (Protected Health Information) before sending scans to external models.", defaultChecked: true },
                    { id: "audit-log", label: "Strict Audit Logging", desc: "Keep a permanent immutable record of all view and edit actions on patient files.", defaultChecked: true },
                    { id: "2fa", label: "Two-Factor Authentication (2FA)", desc: "Require a security key or authenticator app during sign-in.", defaultChecked: false },
                  ].map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-secondary/10 transition-colors">
                      <div className="flex-1 pr-4">
                        <Label htmlFor={item.id} className="text-sm font-medium text-foreground cursor-pointer">{item.label}</Label>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
                      </div>
                      <Switch id={item.id} defaultChecked={item.defaultChecked} className="data-[state=checked]:bg-primary" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="medical-card border-border/50 shadow-sm overflow-hidden mt-6">
                <div className="p-6 border-b border-border/50 bg-card/50">
                  <h2 className="text-lg font-semibold text-foreground">Active Sessions</h2>
                  <p className="text-sm text-muted-foreground mt-1">Manage devices that are currently logged into your account.</p>
                </div>
                <div className="divide-y divide-border/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-secondary/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2.5 rounded-full text-primary">
                        <Laptop className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                          MacBook Pro (Chrome) <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Current</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">San Francisco, CA • IP: 192.168.1.1</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-secondary/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-secondary p-2.5 rounded-full text-muted-foreground">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">iPhone 14 Pro (Safari)</p>
                        <p className="text-xs text-muted-foreground mt-0.5">San Francisco, CA • Active 2 hours ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20">Revoke</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="display" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="medical-card border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-card/50">
                  <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
                  <p className="text-sm text-muted-foreground mt-1">Customize the look and feel of the platform.</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div 
                      onClick={() => setTheme("dark")}
                      className={`border-2 rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer relative transition-all ${theme === 'dark' ? 'border-primary bg-secondary/20' : 'border-border hover:border-border/80 hover:bg-secondary/10 opacity-70'}`}
                    >
                      {theme === 'dark' && (
                        <div className="absolute top-2 right-2 bg-primary text-background rounded-full p-0.5 animate-in zoom-in">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      <div className="w-full h-24 bg-background rounded-md border border-border shadow-sm flex flex-col p-2 gap-1.5 overflow-hidden pointer-events-none">
                        <div className="w-full h-3 bg-secondary rounded-sm" />
                        <div className="w-2/3 h-2 bg-secondary rounded-sm" />
                        <div className="flex-1" />
                        <div className="w-full h-8 bg-secondary/50 rounded-sm" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Dark Theme</span>
                    </div>
                    
                    <div 
                      onClick={() => setTheme("light")}
                      className={`border-2 rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer relative transition-all ${theme === 'light' ? 'border-primary bg-secondary/20' : 'border-border hover:border-border/80 hover:bg-secondary/10 opacity-70'}`}
                    >
                      {theme === 'light' && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5 animate-in zoom-in">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      <div className="w-full h-24 bg-white rounded-md border border-gray-200 shadow-sm flex flex-col p-2 gap-1.5 overflow-hidden pointer-events-none">
                        <div className="w-full h-3 bg-gray-100 rounded-sm" />
                        <div className="w-2/3 h-2 bg-gray-100 rounded-sm" />
                        <div className="flex-1" />
                        <div className="w-full h-8 bg-gray-50 rounded-sm" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Light Theme</span>
                    </div>
                    
                    <div 
                      onClick={() => setTheme("system")}
                      className={`border-2 rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer relative transition-all ${theme === 'system' ? 'border-primary bg-secondary/20' : 'border-border hover:border-border/80 hover:bg-secondary/10 opacity-70'}`}
                    >
                      {theme === 'system' && (
                        <div className="absolute top-2 right-2 bg-primary text-background rounded-full p-0.5 animate-in zoom-in">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      <div className="w-full h-24 bg-gradient-to-br from-gray-900 to-gray-100 rounded-md border border-border shadow-sm flex flex-col p-2 gap-1.5 overflow-hidden pointer-events-none">
                        <div className="w-full h-3 bg-gray-800 rounded-sm" />
                        <div className="w-2/3 h-2 bg-gray-800 rounded-sm" />
                        <div className="flex-1" />
                        <div className="w-full h-8 bg-gray-300 rounded-sm" />
                      </div>
                      <span className="text-sm font-medium text-foreground">System Default</span>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-border/50 border-t border-border/50 bg-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-secondary/10 transition-colors">
                    <div className="flex-1 pr-4">
                      <Label htmlFor="compact-mode" className="text-sm font-medium text-foreground cursor-pointer">Compact Mode</Label>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">Reduce padding and margins to fit more data on the screen. Ideal for 13" laptops.</p>
                    </div>
                    <Switch id="compact-mode" checked={compactMode} onCheckedChange={setCompactMode} className="data-[state=checked]:bg-primary" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-secondary/10 transition-colors">
                    <div className="flex-1 pr-4">
                      <Label htmlFor="high-contrast" className="text-sm font-medium text-foreground cursor-pointer">High Contrast Colors</Label>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">Increase contrast of bounding boxes and heatmaps in the sandbox for better visibility.</p>
                    </div>
                    <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} className="data-[state=checked]:bg-primary" />
                  </div>
                </div>
              </Card>

              <Card className="medical-card border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-card/50">
                  <h2 className="text-lg font-semibold text-foreground">Localization & Display</h2>
                  <p className="text-sm text-muted-foreground mt-1">Customize how dates, times, and measurements are shown.</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date Format</Label>
                      <Select defaultValue="mdy">
                        <SelectTrigger className="bg-secondary/50 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time Format</Label>
                      <Select defaultValue="12h">
                        <SelectTrigger className="bg-secondary/50 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                          <SelectItem value="24h">24-hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
