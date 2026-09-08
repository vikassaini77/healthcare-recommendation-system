import { useParams, Link, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, Printer, Share2, Activity, CheckCircle, AlertTriangle, ChevronLeft, 
  User, QrCode, Building, Stethoscope, FileText, Calendar, Pill, Apple, ShieldAlert
} from "lucide-react";
import { useMedicalData } from "@/contexts/MedicalDataContext";
import { format } from "date-fns";
import { toast } from "sonner";

const Reports = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { scans, getScan, getPatient, activeScanId } = useMedicalData();
  
  const currentScanId = scanId === 'latest' ? scans[0]?.id : (scanId || activeScanId);
  const scan = currentScanId ? getScan(currentScanId) : scans[0];
  const patient = scan ? getPatient(scan.patientId) : null;

  const handleDownload = () => toast.success("Generating PDF report...");
  const handlePrint = () => window.print();
  const handleShare = () => toast.success("Share link copied to clipboard");

  if (!scan) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh]">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Report Found</h2>
          <p className="text-muted-foreground mb-6">Please run an analysis first.</p>
          <Button variant="medical" onClick={() => navigate('/advanced')}>Go to Advanced Diagnosis</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* 
        The top-level container has specific print margins to ensure 
        it fits well on an A4 page without cutting off.
      */}
      <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6 print:p-0 print:m-0 print:max-w-none bg-zinc-50 dark:bg-zinc-900/20 rounded-xl print:bg-white">
        
        {/* Controls - Hidden during print */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Medical Report Viewer</h1>
              <p className="text-muted-foreground">Print-Optimized Format</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePrint} className="bg-white">
              <Printer className="w-4 h-4 mr-2" /> Print Official Report
            </Button>
            <Button variant="medical" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </div>
        </div>

        {/* --- OFFICIAL REPORT DOCUMENT --- */}
        <Card className="medical-card print:border-0 print:shadow-none bg-white text-zinc-900 overflow-hidden relative">
          
          {/* Top Border Accent */}
          <div className="h-4 w-full bg-indigo-900 absolute top-0 left-0 print:bg-indigo-900 !print:block"></div>
          
          <div className="p-8 md:p-12 pt-12">
            {/* Header: Branding & Clinic Info */}
            <div className="flex items-start justify-between border-b-2 border-zinc-200 pb-8 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-900 text-white rounded-xl">
                  <Activity className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-serif font-bold text-indigo-900 tracking-tight">MedVision Medical Center</h1>
                  <p className="text-zinc-500 font-medium flex items-center gap-1 mt-1">
                    <Building className="w-4 h-4" /> 123 Healthcare Blvd, AI Tech Park
                  </p>
                  <p className="text-zinc-500 font-medium flex items-center gap-1">
                    <Stethoscope className="w-4 h-4" /> +1 (800) 555-0199 | contact@medvision.ai
                  </p>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end">
                <QrCode className="w-20 h-20 text-zinc-800" />
                <p className="text-xs text-zinc-500 font-mono mt-1 text-center w-20 tracking-tighter">
                  {scan.caseId}
                </p>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-300 inline-block pb-2 px-12">
                Comprehensive Diagnostic Report
              </h2>
            </div>

            {/* Patient Demographics Grid */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 mb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Patient Name</p>
                <p className="font-semibold text-lg">{patient ? \\ \\ : 'Anonymous / Guest'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Patient ID</p>
                <p className="font-semibold font-mono text-zinc-700">{patient?.patientId || 'PT-GUEST'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Date of Birth</p>
                <p className="font-semibold">{patient?.dateOfBirth ? format(new Date(patient.dateOfBirth), 'MM/dd/yyyy') : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Gender</p>
                <p className="font-semibold capitalize">{patient?.gender || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Report Date</p>
                <p className="font-semibold flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-zinc-400" /> {format(new Date(scan.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Case Number</p>
                <p className="font-semibold font-mono">{scan.caseId}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Attending Physician</p>
                <p className="font-semibold flex items-center gap-1">
                  <User className="w-4 h-4 text-zinc-400" /> Dr. AI Diagnostic System
                </p>
              </div>
            </div>

            {/* --- MULTI-MODAL CONTENT SECTION --- */}
            
            {/* 1. Holistic AI Synthesis (If available) */}
            {scan.holisticSummary && (
              <div className="mb-10">
                <h3 className="flex items-center gap-2 text-xl font-bold text-indigo-900 border-b-2 border-indigo-100 pb-2 mb-4">
                  <Activity className="w-6 h-6" /> Executive Medical Synthesis
                </h3>
                <div className="bg-indigo-50/50 border-l-4 border-indigo-600 p-6 rounded-r-xl">
                  <p className="text-zinc-800 leading-relaxed font-medium">
                    {scan.holisticSummary}
                  </p>
                </div>
              </div>
            )}

            {/* 2. Clinical Impression (Symptoms & Diseases) */}
            {(scan.symptomPrediction || scan.prediction) && (
              <div className="mb-10 page-break-inside-avoid">
                <h3 className="flex items-center gap-2 text-xl font-bold text-indigo-900 border-b-2 border-indigo-100 pb-2 mb-4">
                  <FileText className="w-6 h-6" /> Clinical Findings & Impression
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left: Symptoms & Disease */}
                  <div>
                    {scan.symptomPrediction && (
                      <div className="mb-6">
                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Primary Diagnosis (Symptoms)</p>
                        <p className="text-2xl font-bold text-zinc-900">{scan.symptomPrediction}</p>
                        {scan.findings && scan.findings.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-bold text-zinc-500 mb-1">Reported Symptoms/Complaints:</p>
                            <div className="flex flex-wrap gap-2">
                              {scan.findings.map((f, i) => (
                                <span key={i} className="bg-zinc-100 px-2 py-1 rounded text-sm text-zinc-700">{f}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* X-Ray Status */}
                    {scan.prediction && scan.prediction !== "Pending X-Ray" && (
                      <div>
                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Radiological Assessment</p>
                        <div className="flex items-center gap-3">
                          {scan.risk === 'high' ? <AlertTriangle className="text-red-500" /> : <CheckCircle className="text-emerald-500" />}
                          <div>
                            <p className="text-lg font-bold text-zinc-900">{scan.prediction}</p>
                            <p className="text-sm text-zinc-500">Confidence Model: {(scan.confidence * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: X-Ray Image */}
                  {scan.imageData && (
                    <div className="border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50 p-2">
                      <p className="text-xs font-bold text-zinc-400 text-center uppercase tracking-wider mb-2 mt-1">Chest Radiograph (Grad-CAM)</p>
                      <img src={scan.imageData} alt="Scan Result" className="w-full h-auto rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Treatment Plan & Recommendations */}
            {(scan.medications || scan.diets || scan.precautions) && (
              <div className="mb-10 page-break-inside-avoid">
                <h3 className="flex items-center gap-2 text-xl font-bold text-indigo-900 border-b-2 border-indigo-100 pb-2 mb-4">
                  <ShieldAlert className="w-6 h-6" /> Recommended Treatment Plan
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {scan.medications && scan.medications.length > 0 && (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                      <p className="flex items-center gap-2 text-blue-800 font-bold mb-3"><Pill className="w-5 h-5"/> Medications</p>
                      <ul className="space-y-2">
                        {scan.medications.map((m, i) => (
                          <li key={i} className="flex items-start gap-2 text-zinc-800 text-sm">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span dangerouslySetInnerHTML={{ __html: m.replace('⭐', '<strong class="text-amber-500">⭐</strong>') }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {scan.diets && scan.diets.length > 0 && (
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
                      <p className="flex items-center gap-2 text-emerald-800 font-bold mb-3"><Apple className="w-5 h-5"/> Nutritional Plan</p>
                      <ul className="space-y-2">
                        {scan.diets.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-zinc-800 text-sm">
                            <span className="text-emerald-500 mt-0.5">•</span> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {scan.precautions && scan.precautions.length > 0 && (
                    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5 md:col-span-2">
                      <p className="flex items-center gap-2 text-amber-800 font-bold mb-3"><AlertTriangle className="w-5 h-5"/> Precautions & Lifestyle</p>
                      <div className="flex flex-wrap gap-4">
                        {scan.precautions.map((p, i) => (
                          <span key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm border border-amber-200 text-amber-900 shadow-sm">
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
            <div className="pt-8 border-t-2 border-zinc-200 page-break-inside-avoid">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-8">Attending Physician</p>
                  <div className="border-b border-zinc-400 w-full mb-2"></div>
                  <p className="font-bold text-zinc-900">Dr. Vikas Saini</p>
                  <p className="text-sm text-zinc-500">Chief Medical Officer, AI Division</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-8">Patient Signature</p>
                  <div className="border-b border-zinc-400 w-full mb-2"></div>
                  <p className="font-bold text-zinc-900">________________________</p>
                  <p className="text-sm text-zinc-500">Acknowledges receipt of plan</p>
                </div>
              </div>
              
              <div className="mt-12 text-center text-xs text-zinc-400 max-w-3xl mx-auto leading-relaxed">
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
