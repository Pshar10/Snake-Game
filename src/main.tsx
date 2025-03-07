import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { datadogRum } from "@datadog/browser-rum";
import { datadogLogs } from "@datadog/browser-logs";
import App from './App.tsx';
import './index.css';


datadogRum.init({
    applicationId: import.meta.env.VITE_DATADOG_APPLICATION_ID,
    clientToken: import.meta.env.VITE_DATADOG_CLIENT_TOKEN,
    // `site` refers to the Datadog site parameter of your organization
    // see https://docs.datadoghq.com/getting_started/site/
    site: 'datadoghq.eu',
    service: 'game',
    env: 'game',
    // Specify a version number to identify the deployed version of your application in Datadog
    version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    defaultPrivacyLevel: 'mask-user-input',
});


// Start logging errors and user actions
datadogLogs.init({
  clientToken: import.meta.env.VITE_DATADOG_LOGS_CLIENT_TOKEN,
  site: "datadoghq.eu",
  forwardErrorsToLogs: true,
  sessionSampleRate: 100, // Capture all logs
});

// Start RUM session recording
datadogRum.startSessionReplayRecording();

console.log("Datadog monitoring initialized!");

// Render the React App
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

