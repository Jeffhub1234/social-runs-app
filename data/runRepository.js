import { addDoc, collection, doc, increment, onSnapshot, orderBy, query, runTransaction, serverTimestamp } from "firebase/firestore";
import { requireUser, db } from "../firebase";

// Al kommunikation med Firestore-databasen ligger her, så skærmene ikke taler direkte med Firebase.

// Lytter live på alle løbeture (nyeste først). onSnapshot kalder onRuns igen, hver gang data ændres.
// Returnerer en funktion, der stopper lytningen.
export function subscribeToRuns(onRuns, onError) {
  return onSnapshot(query(collection(db, "runs"), orderBy("createdAt", "desc")),
    (snapshot) => onRuns(snapshot.docs.map((document) => {
      const data = document.data();
      // Firestore gemmer starttidspunktet som en Timestamp. Skærmene bruger en almindelig Date.
      return { ...data, id: document.id, startsAt: data.startsAt?.toDate?.() ?? null };
    })),
    onError);
}

// Gemmer en ny løbetur. Arrangør og tidspunkt sættes her, så de ikke kan forfalskes fra formularen
// (Firestore-reglerne tjekker også, at organizerId er den indloggede bruger).
export async function saveRun(run) {
  const user = requireUser();
  const { id, ...data } = run;
  return addDoc(collection(db, "runs"), {
    ...data,
    organizer: user.displayName || "Løber",
    organizerId: user.uid,
    createdAt: serverTimestamp(),
  });
}

// Lytter på brugerens tilmeldinger. Hver tilmelding er et dokument i users/{uid}/joinedRuns med turens id.
export function subscribeToJoinedRuns(userId, onIds, onError) {
  return onSnapshot(collection(db, "users", userId, "joinedRuns"),
    (snapshot) => onIds(snapshot.docs.map((document) => document.id)), onError);
}

// Melder brugeren til (joined = true) eller fra (joined = false) en løbetur.
// Ét tilmeldingsdokument pr. bruger og tur gør, at gentagne tryk ikke tæller dobbelt.
// Tilmeldingen og det offentlige deltagerantal ændres i samme transaktion, så de altid passer sammen.
export async function setRunParticipation(runId, joined) {
  const user = requireUser();
  const runRef = doc(db, "runs", runId);
  const memberRef = doc(db, "users", user.uid, "joinedRuns", runId);
  return runTransaction(db, async (transaction) => {
    const runSnapshot = await transaction.get(runRef);
    const membership = await transaction.get(memberRef);
    if (!runSnapshot.exists()) throw new Error("Løbeturen findes ikke længere.");
    const run = runSnapshot.data();
    if (run.organizerId === user.uid) throw new Error("Du er allerede arrangør af denne løbetur.");
    if (membership.exists() === joined) return;
    if (joined) transaction.set(memberRef, { runId, joinedAt: serverTimestamp() });
    else transaction.delete(memberRef);
    transaction.update(runRef, { participants: increment(joined ? 1 : -1) });
  });
}
