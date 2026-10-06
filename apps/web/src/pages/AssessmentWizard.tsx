import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Activity, Pill, Apple, ActivitySquare, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface PredictionResult {
  prediction: string;
  description: string;
  precautions: string[];
  medications: string[];
  diets: string[];
  workouts: string[];
  confidence?: number;
  top_predictions?: {disease: string, probability: number}[];
  important_symptoms?: string[];
}

export default function AssessmentWizard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("Male");
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [conditions, setConditions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [pregnancyStatus, setPregnancyStatus] = useState("Not Applicable");
  const [currentMedications, setCurrentMedications] = useState("");
  const [diseaseSeverity, setDiseaseSeverity] = useState("Moderate");
  const [symptomDuration, setSymptomDuration] = useState("");

  useEffect(() => {
    const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
    fetch(`${baseUrl}/api/v1/symptoms`)
      .then((res) => res.json())
      .then((data) => setSymptoms(data.symptoms))
      .catch((err) => console.error("Error fetching symptoms:", err));
  }, []);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    setStep(3); // Loading screen
    
    const profile = {
      name: name,
      age: Number(age),
      gender: gender,
      weight: Number(weight),
      height: Number(height),
      conditions: conditions.split(",").map(c => c.trim()).filter(c => c.length > 0),
      allergies: allergies.split(",").map(c => c.trim()).filter(c => c.length > 0),
      pregnancy_status: pregnancyStatus !== "Not Applicable" ? pregnancyStatus : null,
      current_medications: currentMedications.split(",").map(c => c.trim()).filter(c => c.length > 0),
      disease_severity: diseaseSeverity,
      symptom_duration: symptomDuration || "Unknown"
    };

    try {
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/api/v1/predict_symptoms`, {
        method: "POST",
        headers: {
          "bypass-tunnel-reminder": "true",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          symptoms: selectedSymptoms,
          patient_profile: profile
        }),
      });
      const data = await response.json();
      setResult(data);
      setStep(4); // Results screen

      // Save History if authenticated
      if (token) {
        // First create or get patient id
        // This is simplified, ideally patient selection happens in step 1
        const patientRes = await fetch(`${baseUrl}/api/v1/patients/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                first_name: name.split(' ')[0] || name,
                last_name: name.split(' ')[1] || "Unknown",
                gender: gender,
                weight_kg: Number(weight),
                height_cm: Number(height),
                known_conditions: profile.conditions,
                allergies: profile.allergies,
                current_medications: profile.current_medications,
                pregnancy_status: profile.pregnancy_status
            })
        });

        if (patientRes.ok) {
            const patientData = await patientRes.json();
            await fetch(`${baseUrl}/api/v1/history/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    patient_id: patientData.id,
                    symptoms: selectedSymptoms,
                    symptom_duration: symptomDuration,
                    predicted_condition: data.prediction,
                    confidence: data.confidence,
                    top_predictions: data.top_predictions,
                    important_symptoms: data.important_symptoms,
                    recommended_medications: data.medications,
                    recommended_diets: data.diets,
                    precautions: data.precautions
                })
            });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during prediction.");
      setStep(2);
    }
    setLoading(false);
  };

  const filteredSymptoms = symptoms.filter((s) =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">New Assessment</h1>
          <p className="text-muted-foreground">
            Follow the steps to get personalized health insights and safety-checked recommendations.
          </p>
        </div>

        {/* Wizard Steps indicator */}
        <div className="flex justify-center items-center space-x-4 mb-8">
            {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === s ? 'bg-primary text-primary-foreground' : step > s ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                        {s}
                    </div>
                    {s !== 4 && <div className={`h-1 w-12 mx-2 ${step > s ? 'bg-primary/50' : 'bg-secondary'}`} />}
                </div>
            ))}
        </div>

        {/* Step 1: Profile */}
        {step === 1 && (
          <Card className="p-8 bg-card border-border shadow-lg animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
               Patient Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    className="w-full p-2 bg-background border border-border rounded-md"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Age *</label>
                  <input
                    type="number"
                    className="w-full p-2 bg-background border border-border rounded-md"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Gender *</label>
                  <select 
                    className="w-full p-2 bg-background border border-border rounded-md"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Weight (kg) *</label>
                  <input
                    type="number"
                    className="w-full p-2 bg-background border border-border rounded-md"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Height (cm) *</label>
                  <input
                    type="number"
                    className="w-full p-2 bg-background border border-border rounded-md"
                    value={height}
                    onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : "")}
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Pre-existing Conditions</label>
                  <input
                    type="text"
                    placeholder="e.g. Diabetes, Hypertension"
                    className="w-full p-2 bg-background border border-border rounded-md"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Allergies (Critical for Safety)</label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Peanuts"
                    className="w-full p-2 bg-background border border-border rounded-md border-destructive/50"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Current Medications</label>
                  <input
                    type="text"
                    placeholder="e.g. Lisinopril 10mg"
                    className="w-full p-2 bg-background border border-border rounded-md"
                    value={currentMedications}
                    onChange={(e) => setCurrentMedications(e.target.value)}
                  />
                </div>
            </div>
            
            <div className="mt-8 flex justify-end">
                <Button 
                    size="lg" 
                    onClick={() => {
                        if (!name || age === "" || weight === "" || height === "") {
                            toast.error("Please fill all required (*) fields");
                            return;
                        }
                        setStep(2);
                    }}
                    className="gap-2"
                >
                    Next: Add Symptoms <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Symptoms */}
        {step === 2 && (
          <Card className="p-8 bg-card border-border shadow-lg animate-in fade-in slide-in-from-right-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                What are your symptoms?
                </h2>
                <span className="text-primary font-medium">{selectedSymptoms.length} selected</span>
            </div>
            
            <input
              type="text"
              placeholder="Search symptoms..."
              className="w-full p-3 bg-background border border-border rounded-md mb-4 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="h-[300px] overflow-y-auto border border-border rounded-md p-4 bg-background">
              <div className="flex flex-wrap gap-2">
                {filteredSymptoms.map((symptom, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedSymptoms.includes(symptom)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {symptom.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-between">
                <Button variant="outline" size="lg" onClick={() => setStep(1)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Profile
                </Button>
                <Button 
                    size="lg" 
                    onClick={() => {
                        if (selectedSymptoms.length === 0) {
                            toast.error("Please select at least one symptom");
                            return;
                        }
                        handlePredict();
                    }}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                >
                    Run Safety & Prediction Engine <Activity className="w-4 h-4" />
                </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Loading */}
        {step === 3 && (
            <Card className="p-12 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in-95">
                <div className="relative">
                    <div className="p-6 rounded-full bg-primary/10">
                        <Activity className="w-16 h-16 text-primary animate-pulse" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold">Analyzing Medical Data</h3>
                    <p className="text-muted-foreground animate-pulse">Running symptoms against condition models...</p>
                    <p className="text-muted-foreground animate-pulse delay-150">Checking contraindications and allergies...</p>
                    <p className="text-muted-foreground animate-pulse delay-300">Generating personalized safety recommendations...</p>
                </div>
            </Card>
        )}

        {/* Step 4: Results */}
        {step === 4 && result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8">
                {/* Condition & Confidence */}
                <Card className="p-6 border-primary/20 bg-primary/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Predicted Condition</h2>
                            <div className="text-3xl font-bold">{result.prediction}</div>
                            {result.confidence && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                    Confidence Score: <span className="font-bold text-foreground">{(result.confidence * 100).toFixed(1)}%</span>
                                </div>
                            )}
                        </div>
                        {result.confidence && result.confidence < 0.7 && (
                            <div className="flex items-center gap-2 bg-destructive/10 text-destructive p-3 rounded-md">
                                <AlertTriangle className="h-5 w-5" />
                                <span className="text-sm font-medium">Low confidence. Consult a doctor.</span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Explanation */}
                <Card className="p-6 border-border">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                        <ActivitySquare className="h-5 w-5 text-blue-500" /> Explanation
                    </h3>
                    <p className="text-muted-foreground">{result.description}</p>
                    
                    {result.important_symptoms && result.important_symptoms.length > 0 && (
                        <div className="mt-4 p-4 bg-secondary/50 rounded-md">
                            <h4 className="text-sm font-medium mb-2">Key Symptoms Identified:</h4>
                            <div className="flex flex-wrap gap-2">
                                {result.important_symptoms.map((s, i) => (
                                    <span key={i} className="px-2 py-1 bg-background rounded border text-xs">{s.replace(/_/g, " ")}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>

                {/* Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border-border">
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                            <Pill className="h-5 w-5 text-primary" /> Personalized Medicines
                        </h3>
                        {result.medications.length > 0 ? (
                            <ul className="space-y-2">
                                {result.medications.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">No safe medications found based on your profile and allergies.</p>
                        )}
                    </Card>

                    <Card className="p-6 border-border">
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                            <AlertTriangle className="h-5 w-5 text-orange-500" /> Precautions
                        </h3>
                        <ul className="space-y-2">
                            {result.precautions.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 p-4 bg-muted text-muted-foreground text-xs text-center rounded-lg border border-border">
                    <strong>Medical Disclaimer:</strong> This system provides healthcare decision support based on the data provided. It is <strong>NOT</strong> a replacement for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </div>

                <div className="flex justify-center mt-6">
                    <Button variant="outline" onClick={() => {
                        setStep(1);
                        setResult(null);
                        setSelectedSymptoms([]);
                    }}>
                        Start New Assessment
                    </Button>
                </div>
            </div>
        )}
      </div>
    </AppLayout>
  );
}
