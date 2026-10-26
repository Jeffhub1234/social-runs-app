import { getAuth } from "firebase/auth";

// Webversionen: Firebase gemmer selv login i browseren. Telefonversionen ligger i firebaseAuth.native.js.
export default function createAuth(app) {
  return getAuth(app);
}
