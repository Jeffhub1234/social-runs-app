import { addDoc, collection, doc, increment, onSnapshot, orderBy, query, runTransaction, serverTimestamp } from "firebase/firestore";
import { requireUser, db } from "../firebase";

export function subscribeToRuns(onRuns, onError) {
  return onSnapshot(query(collection(db, "runs"), orderBy("createdAt", "desc")),
    (snapshot) => onRuns(snapshot.docs.map((document) => ({ ...document.data(), id: document.id }))),
    onError);
}

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

export function subscribeToJoinedRuns(userId, onIds, onError) {
  return onSnapshot(collection(db, "users", userId, "joinedRuns"),
    (snapshot) => onIds(snapshot.docs.map((document) => document.id)), onError);
}

// One membership document per user/run makes repeat taps idempotent.
// The membership and public count must change in the same transaction.
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
