import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);



// TO INTEGRATE DATADOG: 
// Run command : npm install @datadog/browser-logs @datadog/browser-rum

// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { datadogRum } from "@datadog/browser-rum";
// import { datadogLogs } from "@datadog/browser-logs";
// import App from './App.tsx';
// import './index.css';

// // Initialize Datadog RUM (Real User Monitoring)
// datadogRum.init({
//   applicationId: "YOUR_APPLICATION_ID",
//   clientToken: "YOUR_CLIENT_TOKEN",
//   site: "datadoghq.com", // Use 'datadoghq.eu' if you're in the EU
//   service: "snake-game", // Change this to match your app
//   env: "production",
//   version: "1.0.0",
//   sessionSampleRate: 100, // Capture all sessions
//   sessionReplaySampleRate: 20, // Record 20% of sessions
//   trackInteractions: true, // Track clicks & inputs
//   trackResources: true, // Monitor API requests
//   trackLongTasks: true, // Detect performance issues
//   defaultPrivacyLevel: "mask-user-input",
// });

// // Start logging errors and user actions
// datadogLogs.init({
//   clientToken: "YOUR_CLIENT_TOKEN",
//   site: "datadoghq.com",
//   forwardErrorsToLogs: true,
//   sessionSampleRate: 100, // Capture all logs
// });

// // Start RUM session recording
// datadogRum.startSessionReplayRecording();

// console.log("Datadog monitoring initialized!");

// // Render the React App
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

