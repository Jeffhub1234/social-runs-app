import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import createAuth from "./firebaseAuth";

// Forbindelse til Firebase. Nøglerne læses fra .env (EXPO_PUBLIC_...), så de ikke ligger i GitHub.
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Mangler .env, startes Firebase ikke, og login-skærmen viser i stedet en besked om opsætningen.
export const firebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);
const app = firebaseConfigured ? (getApps().length ? getApp() : initializeApp(config)) : null;
export const db = app ? getFirestore(app) : null;
export const auth = app ? createAuth(app) : null;

// Returnerer den indloggede bruger eller kaster en fejl, før vi skriver til databasen.
export function requireUser() {
  if (!auth) throw new Error("Følg FIREBASE_SETUP.md for at forbinde Firebase.");
  if (!auth.currentUser || auth.currentUser.isAnonymous) throw new Error("Log ind for at bruge appen.");
  return auth.currentUser;
}
