import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AssessmentResponse {
    id: number;
    patient_id: number;
    symptoms: string[];
    symptom_duration: string | null;
    predicted_condition: string;
    confidence: number;
    recommended_medications: string[];
    created_at: string;
}

const AssessmentHistory = () => {
  const { token } = useAuth();
  const [assessments, setAssessments] = useState<AssessmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      try {
        const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
        // First we'd need to get the user's patients, but for simplicity let's assume patient_id=1 exists
        // Actually, we need an endpoint to get all assessments for a user, or get patients first.
        const patRes = await fetch(`${baseUrl}/api/v1/patients/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (patRes.ok) {
            const patients = await patRes.json();
            if (patients.length > 0) {
                const asmtRes = await fetch(`${baseUrl}/api/v1/history/patient/${patients[0].id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (asmtRes.ok) {
                    const data = await asmtRes.json();
                    setAssessments(data);
                }
            }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Assessment History</h1>
          <p className="text-muted-foreground">View past predictions and recommendations</p>
        </div>

        <Card className="p-0 border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground animate-pulse">Loading history...</div>
          ) : assessments.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                No assessments found. Start a new assessment to see history here.
            </div>
          ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                        <tr>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Symptoms</th>
                            <th className="px-6 py-4 font-medium">Prediction</th>
                            <th className="px-6 py-4 font-medium">Confidence</th>
                            <th className="px-6 py-4 font-medium">Recommendations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {assessments.map((item) => (
                            <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {format(new Date(item.created_at), 'MMM d, yyyy HH:mm')}
                                </td>
                                <td className="px-6 py-4 max-w-[250px] truncate">
                                    {item.symptoms.map(s => s.replace(/_/g, " ")).join(", ")}
                                </td>
                                <td className="px-6 py-4 font-medium text-primary">
                                    {item.predicted_condition}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${item.confidence > 0.7 ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                        {(item.confidence * 100).toFixed(1)}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">
                                    {item.recommended_medications.length > 0 ? item.recommended_medications.join(", ") : "None"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default AssessmentHistory;
