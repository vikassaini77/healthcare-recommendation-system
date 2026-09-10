import gradio as gr
from src.main import app as fastapi_app

# Create a dummy Gradio interface so Hugging Face is happy
def greet(name):
    return "MedVision API is running successfully!"

demo = gr.Interface(
    fn=greet, 
    inputs="text", 
    outputs="text",
    title="MedVision API Server",
    description="This is the backend server for MedVision. The API endpoints are running perfectly underneath!"
)

# Mount the FastAPI app. Hugging Face will run the 'app' variable.
app = gr.mount_gradio_app(fastapi_app, demo, path="/")
