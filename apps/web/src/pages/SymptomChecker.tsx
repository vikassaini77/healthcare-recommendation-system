import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Activity, Pill, Apple, ActivitySquare, AlertTriangle } from "lucide-react";

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

const Dashboard = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

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

  const [loadingText, setLoadingText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1").replace(/\/$/, "");
    fetch(`${baseUrl}/symptoms`)
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
    if (selectedSymptoms.length === 0 || !name || age === "" || weight === "" || height === "" || !conditions) return;
    setLoading(true);
    setLoadingText("Processing symptoms...");
    setErrorMsg("");
    setResult(null);
    
    // Simulate progressive loading text for better UX
    const loaderInterval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Processing symptoms...") return "Running ML Model...";
        if (prev === "Running ML Model...") return "Generating AI Summary...";
        return prev;
      });
    }, 1500);

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
      const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1").replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/predict_symptoms`, {
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
      
      if (!response.ok) {
        if (response.status === 429) {
            throw new Error("You are making too many requests. Please slow down and try again.");
        } else if (response.status === 422) {
            throw new Error("Validation Error: Please check your patient profile inputs.");
        } else if (response.status === 401 || response.status === 403) {
            throw new Error("Authentication error. Please login again.");
        } else {
            throw new Error(`Server Error (${response.status}). Please try again later.`);
        }
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      clearInterval(loaderInterval);
      setLoading(false);
      setLoadingText("");
    }
  };

  const filteredSymptoms = symptoms.filter((s) =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Health Dashboard</h1>
          <p className="text-muted-foreground">
            Select your symptoms to get an educational health analysis.
          </p>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm shadow-sm flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-1">MEDICAL DISCLAIMER:</strong>
              This application is for educational and research purposes ONLY. It is NOT a medical device. It must not be used in clinical, hospital, or diagnostic settings. The AI outputs do not constitute professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold mb-4">1. Patient Profile</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label htmlFor="patient-name" className="text-xs font-medium text-muted-foreground mb-1 block">Full Name *</label>
                  <input
                    id="patient-name"
                    type="text"
                    placeholder="e.g. John Doe"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="patient-age" className="text-xs font-medium text-muted-foreground mb-1 block">Age *</label>
                  <input
                    id="patient-age"
                    type="number"
                    placeholder="e.g. 35"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="patient-gender" className="text-xs font-medium text-muted-foreground mb-1 block">Gender *</label>
                  <select 
                    id="patient-gender"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    aria-required="true"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="patient-weight" className="text-xs font-medium text-muted-foreground mb-1 block">Weight (kg) *</label>
                  <input
                    id="patient-weight"
                    type="number"
                    placeholder="e.g. 70"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="patient-height" className="text-xs font-medium text-muted-foreground mb-1 block">Height (cm) *</label>
                  <input
                    id="patient-height"
                    type="number"
                    placeholder="e.g. 175"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    value={height}
                    onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : "")}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="patient-conditions" className="text-xs font-medium text-muted-foreground mb-1 block">Conditions *</label>
                  <input
                    id="patient-conditions"
                    type="text"
                    placeholder="e.g. Diabetes, or 'None'"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="patient-allergies" className="text-xs font-medium text-muted-foreground mb-1 block">Allergies</label>
                  <input
                    id="patient-allergies"
                    type="text"
                    placeholder="e.g. Penicillin, Peanuts (comma separated)"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="patient-medications" className="text-xs font-medium text-muted-foreground mb-1 block">Current Medications</label>
                  <input
                    id="patient-medications"
                    type="text"
                    placeholder="e.g. Lisinopril 10mg (comma separated)"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    value={currentMedications}
                    onChange={(e) => setCurrentMedications(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="patient-pregnancy" className="text-xs font-medium text-muted-foreground mb-1 block">Pregnancy Status</label>
                  <select 
                    id="patient-pregnancy"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    value={pregnancyStatus}
                    onChange={(e) => setPregnancyStatus(e.target.value)}
                  >
                    <option>Not Applicable</option>
                    <option>Pregnant</option>
                    <option>Nursing</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="patient-severity" className="text-xs font-medium text-muted-foreground mb-1 block">Disease Severity</label>
                  <select 
                    id="patient-severity"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    value={diseaseSeverity}
                    onChange={(e) => setDiseaseSeverity(e.target.value)}
                  >
                    <option>Mild</option>
                    <option>Moderate</option>
                    <option>Severe</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label htmlFor="patient-duration" className="text-xs font-medium text-muted-foreground mb-1 block">Symptom Duration</label>
                  <input
                    id="patient-duration"
                    type="text"
                    placeholder="e.g. 3 days, 2 weeks"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    value={symptomDuration}
                    onChange={(e) => setSymptomDuration(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold mb-4">2. Select Symptoms</h2>
              
              <input
                type="text"
                placeholder="Search symptoms..."
                className="w-full p-2 mb-4 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="h-64 overflow-y-auto pr-2 flex flex-col gap-2">
                {filteredSymptoms.map((symptom) => (
                  <div
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`cursor-pointer p-2 rounded-md transition-colors ${
                      selectedSymptoms.includes(symptom)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 hover:bg-secondary"
                    }`}
                  >
                    {symptom}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Selected ({selectedSymptoms.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((s) => (
                    <span key={s} className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                      {s}
                      <button onClick={() => toggleSymptom(s)} className="ml-1 hover:text-red-500">
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full mt-6" 
                onClick={handlePredict} 
                disabled={loading || selectedSymptoms.length === 0 || !name || age === "" || weight === "" || height === "" || !conditions}
              >
                {loading ? "Analyzing..." : "Get Educational Insights"}
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {errorMsg ? (
              <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center border-red-200 bg-red-50">
                <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-xl font-medium text-red-700 mb-2">Request Failed</h3>
                <p className="text-red-600 max-w-sm">{errorMsg}</p>
                <Button variant="outline" className="mt-4" onClick={() => setErrorMsg("")}>Dismiss</Button>
              </Card>
            ) : loading ? (
              <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <h3 className="text-xl font-medium text-foreground mb-2">{loadingText}</h3>
                <p className="text-muted-foreground max-w-sm text-sm">Please wait while the AI analyzes your profile and symptoms...</p>
              </Card>
            ) : result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" aria-live="polite">
                <Card className="p-6 border-l-4 border-l-primary bg-card/50 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-secondary/80 text-xs px-3 py-1 rounded-bl-lg font-medium tracking-wide shadow-sm">AI ESTIMATION</div>
                  <div className="flex items-center gap-3 mb-2 pt-2">
                    <Activity className="h-6 w-6 text-primary" aria-hidden="true" />
                    <h2 className="text-2xl font-bold">Possible Condition Match: <span className="text-primary">{result.prediction}</span></h2>
                  </div>
                  {result.confidence !== undefined && (
                    <div className="mb-4 bg-secondary/20 p-3 rounded-md inline-block">
                      <p className="text-sm font-medium text-muted-foreground">
                        AI Confidence Score: <span className={`font-bold text-lg ${result.confidence < 0.35 ? 'text-red-500' : 'text-green-500'}`}>{(result.confidence * 100).toFixed(1)}%</span>
                      </p>
                      {result.confidence < 0.35 && (
                        <p className="text-xs text-red-500 mt-1 font-semibold flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Warning: Low confidence. Results may be inaccurate.
                        </p>
                      )}
                    </div>
                  )}
                  
                  {result.top_predictions && result.top_predictions.length > 1 && (
                    <div className="mb-4 bg-secondary/30 p-3 rounded-md">
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Alternative Top Predictions</h4>
                      <div className="flex flex-col gap-1">
                        {result.top_predictions.map((p, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>{p.disease}</span>
                            <span className="font-medium">{(p.probability * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.important_symptoms && result.important_symptoms.length > 0 && (
                    <div className="mb-4 bg-primary/10 p-3 rounded-md">
                      <h4 className="text-xs font-semibold uppercase text-primary mb-2">Key Identifiers</h4>
                      <p className="text-sm mb-1 text-muted-foreground">The following symptoms strongly align with this condition:</p>
                      <ul className="list-none text-sm space-y-1" aria-label="Important symptoms">
                        {result.important_symptoms.map((s, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-primary" aria-hidden="true">✓</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{result.description}</p>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-0 overflow-hidden border-blue-200">
                    <div className="bg-blue-50/50 p-4 border-b border-blue-100 flex items-center gap-2">
                      <Pill className="h-5 w-5 text-blue-500" aria-hidden="true" />
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">Candidate Medications</h3>
                        <span className="text-xs font-bold text-red-600 tracking-wide uppercase">DO NOT PRESCRIBE - Consult a Doctor</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2" aria-label="Candidate Medications">
                        {result.medications.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>

                  <Card className="p-0 overflow-hidden border-green-200">
                    <div className="bg-green-50/50 p-4 border-b border-green-100 flex items-center gap-2">
                      <Apple className="h-5 w-5 text-green-500" aria-hidden="true" />
                      <h3 className="text-lg font-semibold text-green-900">Dietary Advice</h3>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2" aria-label="Dietary Advice">
                        {result.diets.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>

                  <Card className="p-0 overflow-hidden border-amber-200">
                    <div className="bg-amber-50/50 p-4 border-b border-amber-100 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
                      <h3 className="text-lg font-semibold text-amber-900">Precautions</h3>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2" aria-label="Precautions">
                        {result.precautions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>

                  <Card className="p-0 overflow-hidden border-purple-200">
                    <div className="bg-purple-50/50 p-4 border-b border-purple-100 flex items-center gap-2">
                      <ActivitySquare className="h-5 w-5 text-purple-500" aria-hidden="true" />
                      <h3 className="text-lg font-semibold text-purple-900">Workouts</h3>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2" aria-label="Workouts">
                        {result.workouts.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center border-dashed border-2">
                <Activity className="h-12 w-12 text-muted-foreground mb-4 opacity-50" aria-hidden="true" />
                <h3 className="text-xl font-medium text-foreground mb-2">No Data Yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  Select your symptoms on the left and click "Get Educational Insights" to see your personalized health analysis.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;


