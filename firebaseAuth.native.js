import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";

// På iOS/Android gemmes login i AsyncStorage, så brugeren forbliver logget ind, når appen lukkes.
// Hvis Auth allerede er startet (fx efter hot reload), genbruges den eksisterende instans.
export default function createAuth(app) {
  try {
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch (error) {
    if (error.code === "auth/already-initialized") return getAuth(app);
    throw error;
  }
}
