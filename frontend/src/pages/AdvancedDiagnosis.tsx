import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMedicalData } from "@/contexts/MedicalDataContext";
import { Activity, Pill, Apple, ActivitySquare, AlertTriangle, UploadCloud, Stethoscope } from "lucide-react";

interface PredictionResult {
  prediction: string;
  description: string;
  precautions: string[];
  medications: string[];
  diets: string[];
  workouts: string[];
}

interface XRayResult {
  prediction: string;
  confidence: number;
  risk_level: string;
  gradcam: string;
}

interface HolisticResult {
  xray_result: XRayResult | null;
  symptom_result: PredictionResult;
  holistic_summary: string;
}

const AdvancedDiagnosis = () => {
  // X-Ray States
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Symptom States
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Patient Profile States
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("Male");
  const [weight, setWeight] = useState<number | "">("");
  const [conditions, setConditions] = useState("");

  // Global States
  const [result, setResult] = useState<HolisticResult | null>(null);
  const [loading, setLoading] = useState(false);

  const { addScan, setActiveScanId } = useMedicalData();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/symptoms")
      .then((res) => res.json())
      .then((data) => setSymptoms(data.symptoms))
      .catch((err) => console.error("Error fetching symptoms:", err));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleHolisticPredict = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom.");
      return;
    }
    setLoading(true);
    
    const profile = (age && weight) ? {
      age: Number(age),
      gender: gender,
      weight: Number(weight),
      conditions: conditions.split(",").map(c => c.trim()).filter(c => c.length > 0)
    } : null;

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("data", JSON.stringify({ 
      symptoms: selectedSymptoms,
      patient_profile: profile
    }));

    try {
      const response = await fetch("/api/predict_holistic", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);

      // Save to medical history
      const savedScan = addScan({
        patientId: "PT-000000", // Default anonymous patient
        fileName: file ? file.name : "Symptom_Analysis_Only",
        fileSize: file ? file.size : 0,
        modality: file ? "X-Ray + Symptoms" : "Symptoms Only",
        prediction: data.xray_result ? data.xray_result.prediction : "Pending X-Ray",
        confidence: data.xray_result ? data.xray_result.confidence : 0.95,
        risk: data.xray_result ? data.xray_result.risk_level : "low",
        findings: data.symptom_result.precautions,
        status: "complete",
        analyzedAt: new Date().toISOString(),
        symptomPrediction: data.symptom_result.prediction,
        holisticSummary: data.holistic_summary,
        medications: data.symptom_result.medications,
        diets: data.symptom_result.diets,
        precautions: data.symptom_result.precautions,
        imageData: preview || undefined,
        gradcamData: data.xray_result ? `data:image/png;base64,${data.xray_result.gradcam}` : undefined
      });
      setActiveScanId(savedScan.id);

    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredSymptoms = symptoms.filter((s) =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Holistic AI Diagnosis</h1>
          <p className="text-muted-foreground">
            Combine Chest X-Rays, Patient Profiles, and Symptoms for an advanced multi-modal prediction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN: INPUTS */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-primary" /> 1. Upload Chest X-Ray (Optional)
              </h2>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-md" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UploadCloud className="h-10 w-10 opacity-50" />
                    <p>Click to upload Chest X-Ray</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold mb-4">2. Patient Profile</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Age</label>
                  <input type="number" placeholder="e.g. 35" className="w-full p-2 bg-background border border-border rounded-md text-sm" value={age} onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Gender</label>
                  <select className="w-full p-2 bg-background border border-border rounded-md text-sm" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Weight (kg)</label>
                  <input type="number" placeholder="e.g. 70" className="w-full p-2 bg-background border border-border rounded-md text-sm" value={weight} onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Conditions</label>
                  <input type="text" placeholder="e.g. Diabetes" className="w-full p-2 bg-background border border-border rounded-md text-sm" value={conditions} onChange={(e) => setConditions(e.target.value)} />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" /> 3. Select Symptoms
              </h2>
              <input type="text" placeholder="Search symptoms..." className="w-full p-2 mb-4 bg-background border border-border rounded-md focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <div className="h-48 overflow-y-auto pr-2 flex flex-col gap-2">
                {filteredSymptoms.map((symptom) => (
                  <div key={symptom} onClick={() => toggleSymptom(symptom)} className={`cursor-pointer p-2 rounded-md transition-colors ${selectedSymptoms.includes(symptom) ? "bg-primary text-primary-foreground" : "bg-secondary/50 hover:bg-secondary"}`}>
                    {symptom}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedSymptoms.map((s) => (
                  <span key={s} className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">{s} <button onClick={() => toggleSymptom(s)} className="ml-1">&times;</button></span>
                ))}
              </div>
            </Card>

            <Button className="w-full py-6 text-lg" onClick={handleHolisticPredict} disabled={loading || selectedSymptoms.length === 0}>
              {loading ? "Running Multi-Modal Analysis..." : "Analyze Patient"}
            </Button>
          </div>

          {/* RIGHT COLUMN: OUTPUTS */}
          <div>
            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 sticky top-6">
                
                <Card className="p-6 border-l-4 border-l-purple-500 bg-purple-500/10">
                  <h2 className="text-lg font-bold text-purple-600 mb-2">Holistic AI Summary</h2>
                  <p className="text-sm font-medium">{result.holistic_summary}</p>
                </Card>

                {result.xray_result && (
                  <Card className="p-6 bg-card">
                    <h2 className="text-lg font-semibold mb-4">X-Ray Analysis</h2>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Prediction</p>
                        <p className="text-xl font-bold">{result.xray_result.prediction}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="text-xl font-bold text-primary">{(result.xray_result.confidence * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="relative w-full mt-4 rounded-md overflow-hidden bg-black">
                      <img 
                        src={preview!} 
                        alt="Original X-Ray" 
                        className="w-full h-auto object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <img 
                          src={`data:image/png;base64,${result.xray_result.gradcam}`} 
                          alt="GradCAM Overlay" 
                          className="w-full h-full object-cover mix-blend-screen opacity-80"
                        />
                      </div>
                    </div>
                  </Card>
                )}

                <Card className="p-6 border-l-4 border-l-primary bg-card/50">
                  <h2 className="text-2xl font-bold mb-4">Predicted Condition: <span className="text-primary">{result.symptom_result.prediction}</span></h2>
                  <p className="text-muted-foreground">{result.symptom_result.description}</p>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4"><h3 className="font-semibold text-blue-500 flex items-center gap-2 mb-2"><Pill className="h-4 w-4"/> Meds</h3><ul className="text-sm space-y-1">{result.symptom_result.medications.map(m => <li key={m}>• {m}</li>)}</ul></Card>
                  <Card className="p-4"><h3 className="font-semibold text-green-500 flex items-center gap-2 mb-2"><Apple className="h-4 w-4"/> Diet</h3><ul className="text-sm space-y-1">{result.symptom_result.diets.map(d => <li key={d}>• {d}</li>)}</ul></Card>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white" 
                  size="lg"
                  onClick={() => navigate('/reports/latest')}
                >
                  Generate World-Class Medical Report
                </Button>
              </div>
            ) : (
              <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center border-dashed border-2 sticky top-6">
                <ActivitySquare className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-foreground mb-2">Awaiting Analysis</h3>
                <p className="text-muted-foreground max-w-sm">
                  Provide patient data on the left to see the holistic multi-modal AI recommendation.
                </p>
              </Card>
            )}
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default AdvancedDiagnosis;

