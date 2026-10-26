import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
const dependencyRoot = new URL('../.expo/rules-tests/node_modules/', import.meta.url);
const { initializeTestEnvironment, assertFails, assertSucceeds } = await import(new URL('@firebase/rules-unit-testing/dist/esm/index.esm.js', dependencyRoot));
const sdkUrl = new URL('firebase/firestore/dist/index.mjs', dependencyRoot).href;
const { collection, doc, getDoc, getDocs, setDoc, updateDoc, writeBatch, serverTimestamp, Timestamp } = await import(sdkUrl);

const env = await initializeTestEnvironment({
  projectId: 'demo-social-runs-tests',
  firestore: { host: '127.0.0.1', port: 8088, rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8') },
});
const authDb = (uid) => env.authenticatedContext(uid, { firebase: { sign_in_provider: 'password' } }).firestore();
const A = authDb('A');
const B = authDb('B');
const C = authDb('C');
const unsigned = env.unauthenticatedContext().firestore();
const anonymous = env.authenticatedContext('anonymous', { firebase: { sign_in_provider: 'anonymous' } }).firestore();
const runId = 'test-run';
const runRef = (database) => doc(database, 'runs', runId);
const memberRef = (database, uid, id = runId) => doc(database, 'users', uid, 'joinedRuns', id);
const validRun = () => ({
  title: 'Fælles løbetur', pace: '5:30–6:00', distance: '5 km', date: '15. oktober kl. 17:30',
  location: 'Parken', participants: 1, afterRun: 'Kaffe', organizer: 'Alice', description: 'Rolig løbetur',
  organizerId: 'A', createdAt: serverTimestamp(),
});
async function baseline() {
  await env.clearFirestore();
  await assertSucceeds(setDoc(runRef(A), validRun()));
}
async function count(expected, id = runId) {
  assert.equal((await getDoc(doc(A, 'runs', id))).data().participants, expected);
}
function join(database, uid, participants, member = { runId, joinedAt: serverTimestamp() }, extraRunFields = {}) {
  const batch = writeBatch(database);
  batch.set(memberRef(database, uid), member);
  batch.update(runRef(database), { participants, ...extraRunFields });
  return batch.commit();
}
function leave(database, uid, participants) {
  const batch = writeBatch(database);
  batch.delete(memberRef(database, uid));
  batch.update(runRef(database), { participants });
  return batch.commit();
}

await test('Valid authenticated creation succeeds; unsigned and anonymous access is denied', async () => {
  await baseline();
  await assertSucceeds(getDocs(collection(B, 'runs')));
  for (const database of [unsigned, anonymous]) {
    await assertFails(getDoc(runRef(database)));
    await assertFails(getDocs(collection(database, 'runs')));
    await assertFails(setDoc(doc(database, 'runs', 'forbidden'), validRun()));
    await assertFails(getDocs(collection(database, 'users', 'A', 'joinedRuns')));
  }
});

await test('Forged organizer and malformed run creation are denied', async () => {
  await baseline();
  await assertFails(setDoc(doc(B, 'runs', 'forged-organizer'), validRun()));
  for (const invalid of [{ participants: 2 }, { title: '' }, { createdAt: Timestamp.fromMillis(0) }, { unexpected: true }]) {
    await assertFails(setDoc(doc(A, 'runs', 'malformed'), { ...validRun(), ...invalid }));
  }
});

await test('Membership and counter changes must be atomic and preserve other run fields', async () => {
  await baseline();
  await assertFails(setDoc(memberRef(B, 'B'), { runId, joinedAt: serverTimestamp() }));
  await assertFails(updateDoc(runRef(B), { participants: 2 }));
  await assertFails(join(B, 'B', 11));
  await assertFails(join(B, 'B', 2, undefined, { title: 'Replaced title' }));
  await count(1);
  assert.equal((await getDoc(memberRef(B, 'B'))).exists(), false);
  await assertSucceeds(join(B, 'B', 2));
  await count(2);
  await assertFails(updateDoc(memberRef(B, 'B'), { joinedAt: serverTimestamp() }));
  await assertFails(leave(B, 'B', 1.5));
  await count(2);
});

await test('Memberships are private to their user', async () => {
  await baseline();
  await assertSucceeds(join(B, 'B', 2));
  await assertSucceeds(getDoc(memberRef(B, 'B')));
  await assertSucceeds(getDocs(collection(B, 'users', 'B', 'joinedRuns')));
  for (const database of [A, C, unsigned, anonymous]) {
    await assertFails(getDoc(memberRef(database, 'B')));
    await assertFails(getDocs(collection(database, 'users', 'B', 'joinedRuns')));
  }
  await assertFails(join(C, 'A', 3));
  await assertFails(leave(C, 'B', 1));
  await count(2);
});

await test('Two users may join and leave with consistent counters; organizer cannot join', async () => {
  await baseline();
  await assertFails(join(A, 'A', 2));
  await assertSucceeds(join(B, 'B', 2));
  await assertSucceeds(join(C, 'C', 3));
  await count(3);
  await assertSucceeds(leave(C, 'C', 2));
  await count(2);
  await assertSucceeds(leave(B, 'B', 1));
  await count(1);
});

await test('Malformed or missing-run membership is denied', async () => {
  await baseline();
  const invalidMembers = [
    { runId: 'different-run', joinedAt: serverTimestamp() },
    { runId, joinedAt: Timestamp.fromMillis(0) },
    { runId, joinedAt: serverTimestamp(), extra: true },
    { runId },
  ];
  for (const membership of invalidMembers) await assertFails(join(B, 'B', 2, membership));
  await assertFails(setDoc(memberRef(B, 'B', 'missing-run'), { runId: 'missing-run', joinedAt: serverTimestamp() }));
  await count(1);
});

// Execute the app's repository source unchanged except its Firebase import,
// injected into isolated, authenticated emulator contexts for each test user.
const repositorySource = readFileSync(new URL('../data/runRepository.js', import.meta.url), 'utf8');
const sdkImport = /from\s+["']firebase\/firestore["']/;
const appImport = /import\s*\{\s*requireUser\s*,\s*db\s*\}\s*from\s*["']\.\.\/firebase["'];?/;
assert.ok(sdkImport.test(repositorySource), 'Repository Firebase SDK import must match the tested injection');
assert.ok(appImport.test(repositorySource), 'Repository app Firebase import must match the tested injection');
globalThis.__socialRunRepositoryTests = new Map();
async function repository(uid, database, user = {}) {
  globalThis.__socialRunRepositoryTests.set(uid, { db: database, requireUser: () => ({ uid, displayName: uid === 'A' ? 'Alice' : null, email: `${uid}@example.test`, ...user }) });
  const injected = repositorySource
    .replace(sdkImport, `from ${JSON.stringify(sdkUrl)}`)
    .replace(appImport, `const { requireUser, db } = globalThis.__socialRunRepositoryTests.get(${JSON.stringify(uid)});`);
  return import(`data:text/javascript;base64,${Buffer.from(injected).toString('base64')}`);
}
const repoA = await repository('A', A);
const repoB = await repository('B', B);
const repoC = await repository('C', C);

function observeJoined(repositoryApi, userId, expectedIds) {
  return new Promise((resolve, reject) => {
    let unsubscribe;
    const timeout = setTimeout(() => { unsubscribe?.(); reject(new Error('Membership subscription timed out')); }, 5000);
    unsubscribe = repositoryApi.subscribeToJoinedRuns(userId, (ids) => {
      if (JSON.stringify([...ids].sort()) === JSON.stringify([...expectedIds].sort())) {
        clearTimeout(timeout);
        unsubscribe?.();
        resolve(ids);
      }
    }, (error) => { clearTimeout(timeout); unsubscribe?.(); reject(error); });
  });
}

await test('Actual repository saves authenticated organizer and makes repeated joins/leaves idempotent', async () => {
  await env.clearFirestore();
  const created = await repoA.saveRun({ ...validRun(), id: 'discard-me', organizerId: 'forged', organizer: 'Forged' });
  const saved = (await getDoc(doc(A, 'runs', created.id))).data();
  assert.equal(saved.organizerId, 'A');
  assert.equal(saved.organizer, 'Alice');
  assert.equal(saved.id, undefined);
  assert.ok(saved.createdAt instanceof Timestamp);
  await repoB.setRunParticipation(created.id, true);
  await repoB.setRunParticipation(created.id, true);
  await count(2, created.id);
  await observeJoined(repoB, 'B', [created.id]);
  await observeJoined(repoC, 'C', []);
  await repoB.setRunParticipation(created.id, false);
  await repoB.setRunParticipation(created.id, false);
  await count(1, created.id);
  await observeJoined(repoB, 'B', []);
  await assert.rejects(repoA.setRunParticipation(created.id, true), /arrangør/);
  await assert.rejects(repoB.setRunParticipation('missing-run', true), /findes ikke/);
});

await test('Actual repository handles concurrent joins/leaves without losing participants', async () => {
  await env.clearFirestore();
  const created = await repoA.saveRun(validRun());
  await Promise.all([repoB.setRunParticipation(created.id, true), repoC.setRunParticipation(created.id, true)]);
  await count(3, created.id);
  await observeJoined(repoB, 'B', [created.id]);
  await observeJoined(repoC, 'C', [created.id]);
  await Promise.all([repoB.setRunParticipation(created.id, false), repoC.setRunParticipation(created.id, false)]);
  await count(1, created.id);
  await observeJoined(repoB, 'B', []);
  await observeJoined(repoC, 'C', []);
});
await env.cleanup();
