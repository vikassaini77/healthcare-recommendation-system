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

  useEffect(() => {
    const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
    fetch(`${baseUrl}/api/symptoms`)
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
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Age *</label>
                  <input
                    type="number"
                    placeholder="e.g. 35"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Gender *</label>
                  <select 
                    className="w-full p-2 bg-background border border-border rounded-md text-sm"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Weight (kg) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 70"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Height (cm) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 175"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm"
                    value={height}
                    onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : "")}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Conditions *</label>
                  <input
                    type="text"
                    placeholder="e.g. Diabetes, or 'None'"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Allergies</label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Peanuts (comma separated)"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Current Medications</label>
                  <input
                    type="text"
                    placeholder="e.g. Lisinopril 10mg (comma separated)"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm"
                    value={currentMedications}
                    onChange={(e) => setCurrentMedications(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Pregnancy Status</label>
                  <select 
                    className="w-full p-2 bg-background border border-border rounded-md text-sm"
                    value={pregnancyStatus}
                    onChange={(e) => setPregnancyStatus(e.target.value)}
                  >
                    <option>Not Applicable</option>
                    <option>Pregnant</option>
                    <option>Nursing</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Disease Severity</label>
                  <select 
                    className="w-full p-2 bg-background border border-border rounded-md text-sm"
                    value={diseaseSeverity}
                    onChange={(e) => setDiseaseSeverity(e.target.value)}
                  >
                    <option>Mild</option>
                    <option>Moderate</option>
                    <option>Severe</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Symptom Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 days, 2 weeks"
                    className="w-full p-2 bg-background border border-border rounded-md text-sm"
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
            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-6 border-l-4 border-l-primary bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Possible Condition Match: <span className="text-primary">{result.prediction}</span></h2>
                  </div>
                  {result.confidence !== undefined && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-muted-foreground">
                        Confidence: <span className={`font-bold ${result.confidence < 0.3 ? 'text-red-500' : 'text-green-500'}`}>{(result.confidence * 100).toFixed(1)}%</span>
                      </p>
                      {result.confidence < 0.3 && (
                        <p className="text-xs text-red-500 mt-1">⚠️ Prediction confidence is low. Please consult a healthcare professional.</p>
                      )}
                    </div>
                  )}
                  
                  {result.top_predictions && result.top_predictions.length > 1 && (
                    <div className="mb-4 bg-secondary/30 p-3 rounded-md">
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Top Predictions</h4>
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
                      <h4 className="text-xs font-semibold uppercase text-primary mb-2">Why this prediction?</h4>
                      <p className="text-sm mb-1 text-muted-foreground">Important symptoms detected:</p>
                      <ul className="list-none text-sm space-y-1">
                        {result.important_symptoms.map((s, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-primary">✓</span> {s}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs mt-2 text-muted-foreground">These symptoms contributed strongly to the prediction.</p>
                    </div>
                  )}

                  <p className="text-muted-foreground mt-4">{result.description}</p>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Pill className="h-5 w-5 text-blue-500" />
                      <h3 className="text-lg font-semibold">Candidate Medications <span className="text-xs text-red-500 block">DO NOT PRESCRIBE - Consult a Doctor</span></h3>
                    </div>
                    <ul className="space-y-2">
                      {result.medications.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Apple className="h-5 w-5 text-green-500" />
                      <h3 className="text-lg font-semibold">Dietary Advice</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.diets.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <h3 className="text-lg font-semibold">Precautions</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.precautions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ActivitySquare className="h-5 w-5 text-purple-500" />
                      <h3 className="text-lg font-semibold">Workouts</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.workouts.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center border-dashed border-2">
                <Activity className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
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


