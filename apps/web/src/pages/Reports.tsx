import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMedicalData } from '@/contexts/MedicalDataContext';
import { 
  ChevronLeft, 
  Printer, 
  Download, 
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle,
  Building,
  Stethoscope,
  QrCode,
  Calendar,
  User,
  ShieldAlert,
  Pill,
  Apple
} from 'lucide-react';
import { format } from 'date-fns';

const Reports = () => {
  const { scanId: id } = useParams();
  const navigate = useNavigate();
  const { scans, patients } = useMedicalData();
  
  const scan = (!id || id === 'latest') 
    ? [...scans].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : scans.find(s => s.id === id);
    
  const patient = scan ? patients.find(p => p.id === scan.patientId) : null;
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    toast.info('Generating PDF... This feature will be available in production.');
  };

  if (!scan) {
    return (
      <AppLayout>
        <div className="p-8 text-center max-w-md mx-auto mt-20">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The medical report you are looking for does not exist or has been removed.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => navigate('/history')}>
              View History
            </Button>
            <Button variant="medical" onClick={() => navigate('/upload')}>
              New Scan
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6 print:p-0 print:m-0 print:max-w-full">
        {/* Navigation & Actions (Hidden in print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Medical Report Viewer</h1>
              <p className="text-muted-foreground">Clinical Diagnostic Format</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePrint} className="bg-secondary">
              <Printer className="w-4 h-4 mr-2" /> Print Official Report
            </Button>
            <Button variant="medical" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </div>
        </div>

        {/* --- OFFICIAL REPORT DOCUMENT --- */}
        <Card className="medical-card print:border-0 print:shadow-none overflow-hidden relative">
          
          {/* Top Border Accent */}
          <div className="h-4 w-full bg-primary absolute top-0 left-0 print:bg-primary !print:block"></div>
          
          <div className="p-8 md:p-12 pt-12">
            {/* Header: Branding & Clinic Info */}
            <div className="flex flex-col md:flex-row items-start justify-between border-b-2 border-border pb-8 mb-8 gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-xl">
                  <Activity className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">MedVision Medical Center</h1>
                  <p className="text-muted-foreground font-medium flex items-center gap-1 mt-1">
                    <Building className="w-4 h-4" /> 123 Healthcare Blvd, AI Tech Park
                  </p>
                  <p className="text-muted-foreground font-medium flex items-center gap-1">
                    <Stethoscope className="w-4 h-4" /> +1 (800) 555-0199 | contact@medvision.ai
                  </p>
                </div>
              </div>
              
              <div className="text-left md:text-right flex flex-col md:items-end">
                <QrCode className="w-20 h-20 text-muted-foreground opacity-50 hidden md:block" />
                <p className="text-xs text-muted-foreground font-mono mt-1 text-center w-20 tracking-tighter">
                  {scan.caseId}
                </p>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-foreground border-b border-border inline-block pb-2 px-12">
                Comprehensive Diagnostic Report
              </h2>
            </div>

            {/* Patient Demographics Grid */}
            <div className="bg-secondary/30 border border-border rounded-xl p-6 mb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Patient Name</p>
                <p className="font-semibold text-lg text-foreground">{patient ? `${patient.firstName} ${patient.lastName}` : 'Anonymous / Guest'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Patient ID</p>
                <p className="font-semibold font-mono text-foreground">{patient?.patientId || 'PT-GUEST'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Date of Birth</p>
                <p className="font-semibold text-foreground">{patient?.dateOfBirth ? format(new Date(patient.dateOfBirth), 'MM/dd/yyyy') : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Gender</p>
                <p className="font-semibold capitalize text-foreground">{patient?.gender || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Report Date</p>
                <p className="font-semibold flex items-center gap-1 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" /> {format(new Date(scan.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Case Number</p>
                <p className="font-semibold font-mono text-foreground">{scan.caseId}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Attending Physician</p>
                <p className="font-semibold flex items-center gap-1 text-foreground">
                  <User className="w-4 h-4 text-muted-foreground" /> Dr. AI Diagnostic System
                </p>
              </div>
            </div>

            {/* --- MULTI-MODAL CONTENT SECTION --- */}
            
            {/* 1. Holistic AI Synthesis (If available) */}
            {scan.holisticSummary && (
              <div className="mb-10">
                <h3 className="flex items-center gap-2 text-xl font-bold text-primary border-b-2 border-primary/20 pb-2 mb-4">
                  <Activity className="w-6 h-6" /> Executive Medical Synthesis
                </h3>
                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                  <p className="text-foreground leading-relaxed font-medium">
                    {scan.holisticSummary}
                  </p>
                </div>
              </div>
            )}

            {/* 2. Clinical Impression (Symptoms & Diseases) */}
            {(scan.symptomPrediction || scan.prediction) && (
              <div className="mb-10 page-break-inside-avoid">
                <h3 className="flex items-center gap-2 text-xl font-bold text-primary border-b-2 border-primary/20 pb-2 mb-4">
                  <FileText className="w-6 h-6" /> Clinical Findings & Impression
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left: Symptoms & Disease */}
                  <div>
                    {scan.symptomPrediction && (
                      <div className="mb-6">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Primary Diagnosis (Symptoms)</p>
                        <p className="text-2xl font-bold text-foreground">{scan.symptomPrediction}</p>
                        {scan.findings && scan.findings.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-bold text-muted-foreground mb-1">Reported Symptoms/Complaints:</p>
                            <div className="flex flex-wrap gap-2">
                              {scan.findings.map((f, i) => (
                                <span key={i} className="bg-secondary px-2 py-1 rounded text-sm text-foreground">{f}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* X-Ray Status */}
                    {scan.prediction && scan.prediction !== "Pending X-Ray" && (
                      <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Radiological Assessment</p>
                        <div className="flex items-center gap-3">
                          {scan.risk === 'high' ? <AlertTriangle className="text-destructive" /> : <CheckCircle className="text-emerald-500" />}
                          <div>
                            <p className="text-lg font-bold text-foreground">{scan.prediction}</p>
                            <p className="text-sm text-muted-foreground">Confidence Model: {(scan.confidence * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: X-Ray Image */}
                  {scan.imageData && (
                    <div className="border border-border rounded-xl overflow-hidden bg-secondary/30 p-2">
                      <p className="text-xs font-bold text-muted-foreground text-center uppercase tracking-wider mb-2 mt-1">Chest Radiograph (Grad-CAM)</p>
                      <div className="relative w-full rounded-lg overflow-hidden bg-black">
                        <img 
                          src={scan.imageData} 
                          alt="Original X-Ray" 
                          className="w-full h-auto object-contain"
                        />
                        {scan.gradcamData && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <img 
                              src={scan.gradcamData} 
                              alt="Grad-CAM Overlay" 
                              className="w-full h-full object-cover mix-blend-screen opacity-80"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Treatment Plan & Recommendations */}
            {(scan.medications || scan.diets || scan.precautions) && (
              <div className="mb-10 page-break-inside-avoid">
                <h3 className="flex items-center gap-2 text-xl font-bold text-primary border-b-2 border-primary/20 pb-2 mb-4">
                  <ShieldAlert className="w-6 h-6" /> Recommended Treatment Plan
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {scan.medications && scan.medications.length > 0 && (
                    <div className="bg-blue-950/20 border border-blue-900/40 rounded-xl p-5">
                      <p className="flex items-center gap-2 text-blue-400 font-bold mb-3"><Pill className="w-5 h-5"/> Medications</p>
                      <ul className="space-y-2">
                        {scan.medications.map((m, i) => (
                          <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                            <span className="text-blue-500 mt-0.5">●</span>
                            <span dangerouslySetInnerHTML={{ __html: m.replace('?', '<strong class="text-amber-500">?</strong>') }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {scan.diets && scan.diets.length > 0 && (
                    <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-5">
                      <p className="flex items-center gap-2 text-emerald-400 font-bold mb-3"><Apple className="w-5 h-5"/> Nutritional Plan</p>
                      <ul className="space-y-2">
                        {scan.diets.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                            <span className="text-emerald-500 mt-0.5">●</span> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {scan.precautions && scan.precautions.length > 0 && (
                    <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-5 md:col-span-2">
                      <p className="flex items-center gap-2 text-amber-400 font-bold mb-3"><AlertTriangle className="w-5 h-5"/> Precautions & Lifestyle</p>
                      <div className="flex flex-wrap gap-3">
                        {scan.precautions.map((p, i) => (
                          <span key={i} className="flex items-center gap-2 bg-secondary/80 px-3 py-1.5 rounded-full text-sm border border-border text-foreground shadow-sm">
                            <ShieldAlert className="w-4 h-4 text-amber-500" /> {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Spacer to push signatures to the bottom if short */}
            <div className="mt-20"></div>

            {/* --- SIGNATURES & FOOTER --- */}
            <div className="pt-8 border-t-2 border-border page-break-inside-avoid">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-8">Attending Physician</p>
                  <div className="border-b border-border w-full mb-2"></div>
                  <p className="font-bold text-foreground">Dr. AI Diagnostic System</p>
                  <p className="text-sm text-muted-foreground">Chief Medical Officer, AI Division</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-8">Patient Signature</p>
                  <div className="border-b border-border w-full mb-2"></div>
                  <p className="font-bold text-foreground">________________________</p>
                  <p className="text-sm text-muted-foreground">Acknowledges receipt of plan</p>
                </div>
              </div>
              
              <div className="mt-12 text-center text-xs text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                <p className="mb-2 uppercase font-bold tracking-wider">Confidentiality Notice</p>
                <p>
                  This document contains confidential health information legally privileged under healthcare compliance laws. 
                  It is intended only for the use of the individual named above. The predictive models ("MedVision AI") are provided 
                  for informational augmentation and should not independently override professional medical judgment. 
                  If you have received this document in error, please immediately notify the facility.
                </p>
              </div>
            </div>

          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reports;
