// firebaseGoogleConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const googleConfig = {
  apiKey: "GOOGLE_API_KEY",
  authDomain: "google-app.firebaseapp.com",
  projectId: "google-app",
  appId: "GOOGLE_APP_ID",
};

const googleApp = initializeApp(googleConfig, "googleApp");
export const googleAuth = getAuth(googleApp);
