
window.addEventListener('error', (event) => {
  document.body.innerHTML = `
    <div style="background: red; color: white; padding: 20px; font-family: sans-serif; font-size: 18px; margin: 20px; border-radius: 8px;">
      <h2>Application Crashed!</h2>
      <pre style="white-space: pre-wrap; font-size: 14px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px;">${event.error ? event.error.stack : event.message}</pre>
    </div>
  `;
});
window.addEventListener('unhandledrejection', (event) => {
  document.body.innerHTML = `
    <div style="background: red; color: white; padding: 20px; font-family: sans-serif; font-size: 18px; margin: 20px; border-radius: 8px;">
      <h2>Unhandled Promise Rejection!</h2>
      <pre style="white-space: pre-wrap; font-size: 14px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px;">${event.reason ? event.reason.stack : event.reason}</pre>
    </div>
  `;
});

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
