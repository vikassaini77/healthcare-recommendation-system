from locust import HttpUser, task, between
import json

class HealthcareAPIUser(HttpUser):
    wait_time = between(1, 5)

    def on_start(self):
        # Authenticate and get token
        response = self.client.post("/api/v1/auth/login", data={
            "username": "testuser",
            "password": "testpassword123"
        })
        if response.status_code == 200:
            self.token = response.json().get("access_token")
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            self.headers = {}

    @task(3)
    def test_symptom_prediction(self):
        payload = {
            "symptoms": ["itching", "skin_rash"],
            "patient_profile": {
                "age": 30,
                "gender": "male",
                "weight_kg": 75,
                "height_cm": 180,
                "pre_existing_conditions": [],
                "allergies": [],
                "current_medications": []
            }
        }
        self.client.post("/api/v1/predict_symptoms", json=payload, headers=self.headers)

    @task(1)
    def test_health_check(self):
        self.client.get("/api/v1/health")
