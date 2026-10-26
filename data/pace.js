// Hjælpefunktioner til tempo (min/km), som bruges af både "Opret" og filteret på "Find runs".
// Tempo gemmes som tekst i Firestore, fx "6:00–6:30 min/km", så vi omregner det til sekunder
// pr. km, når to tempi skal sammenlignes.

const formatPace = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

// 12 faste tempointervaller på 30 sekunder fra 4:00 til 10:00 min/km.
// Faste intervaller gør tempoet tydeligt og ens for alle løbeture.
export const paceOptions = Array.from({ length: 12 }, (_, index) => {
  const seconds = 240 + index * 30;
  return `${formatPace(seconds)}–${formatPace(seconds + 30)} min/km`;
});

// Læser fx "6:00–6:30 min/km" og returnerer { min: 360, max: 390 } i sekunder pr. km.
// Returnerer null, hvis teksten ikke indeholder et tempo, vi kan forstå.
export function parsePace(text = "") {
  const times = String(text).match(/\d{1,2}:\d{2}/g);
  if (!times) return null;
  const [min, max = min] = times.map((time) => {
    const [minutes, seconds] = time.split(":").map(Number);
    return minutes * 60 + seconds;
  });
  return { min, max };
}

// Margin, så man også ser ture ét interval hurtigere eller langsommere end sit eget tempo.
const PACE_MARGIN_SECONDS = 30;

// En løbetur passer til brugeren, hvis turens tempointerval overlapper brugerens interval (plus margin).
// Uden valgt tempo passer alle ture.
export function matchesPace(runPace, preferredPace) {
  if (!preferredPace) return true;
  const run = parsePace(runPace);
  const preferred = parsePace(preferredPace);
  if (!run || !preferred) return false;
  return run.min < preferred.max + PACE_MARGIN_SECONDS && preferred.min - PACE_MARGIN_SECONDS < run.max;
}
