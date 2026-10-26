import { getAuth } from "firebase/auth";

export default function createAuth(app) {
  return getAuth(app);
}
