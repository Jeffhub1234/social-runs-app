import { matchesPace } from "./pace";
import { distanceKm, isValidPoint } from "./location";

// Filtrene på "Find runs". Hvert filter har en liste af valgmuligheder (value + label),
// og matchesFilters afgør, om en løbetur passer til alle de valgte filtre.

// Gemmes som "social aktivitet", når arrangøren ikke har skrevet noget.
export const NO_AFTER_RUN = "Ingen planlagt aktivitet bagefter";

export const DEFAULT_FILTERS = {
  pace: "",
  distance: "all",
  day: "all",
  timeOfDay: "all",
  nearby: "all",
  socialOnly: false,
};

// Distance i km: en tur passer, hvis min < distance <= max.
export const distanceOptions = [
  { value: "all", label: "Alle" },
  { value: "short", label: "Op til 5 km", min: 0, max: 5 },
  { value: "medium", label: "5–10 km", min: 5, max: 10 },
  { value: "long", label: "10–21 km", min: 10, max: 21.1 },
  { value: "ultra", label: "Over 21 km", min: 21.1, max: Infinity },
];

export const dayOptions = [
  { value: "all", label: "Alle kommende" },
  { value: "today", label: "I dag" },
  { value: "tomorrow", label: "I morgen" },
  { value: "week", label: "Næste 7 dage" },
  { value: "weekend", label: "Weekend" },
];

export const timeOfDayOptions = [
  { value: "all", label: "Hele dagen" },
  { value: "morning", label: "Morgen (før kl. 10)" },
  { value: "day", label: "Dag (kl. 10–16)" },
  { value: "evening", label: "Aften (efter kl. 16)" },
];

// Afstand i luftlinje fra brugerens position til turens startsted.
export const nearbyOptions = [
  { value: "all", label: "Alle" },
  { value: "2", label: "Inden for 2 km" },
  { value: "5", label: "Inden for 5 km" },
  { value: "10", label: "Inden for 10 km" },
];

// Finder tallet i fx "5 km" eller "21,1 km". Returnerer null, hvis der ikke er et tal.
export function parseKm(text) {
  const match = String(text ?? "").replace(",", ".").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

export function hasSocialActivity(run) {
  const text = (run.afterRun ?? "").trim();
  return Boolean(text) && text !== NO_AFTER_RUN;
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

// Ture uden starttidspunkt (oprettet før datofeltet fandtes) passer kun, når der ikke er valgt dag.
function matchesDay(startsAt, day, now) {
  if (day === "all") return true;
  if (!startsAt) return false;
  // Antal dage fra i dag. Math.round håndterer skift til og fra sommertid.
  const daysAway = Math.round((startOfDay(startsAt) - startOfDay(now)) / 86400000);
  if (day === "today") return daysAway === 0;
  if (day === "tomorrow") return daysAway === 1;
  if (day === "week") return daysAway >= 0 && daysAway < 7;
  if (day === "weekend") return daysAway >= 0 && daysAway < 7 && [0, 6].includes(startsAt.getDay());
  return true;
}

function matchesTimeOfDay(startsAt, timeOfDay) {
  if (timeOfDay === "all") return true;
  if (!startsAt) return false;
  const hour = startsAt.getHours();
  if (timeOfDay === "morning") return hour < 10;
  if (timeOfDay === "day") return hour >= 10 && hour < 16;
  return hour >= 16;
}

export function matchesFilters(run, filters, { now = new Date(), userLocation = null } = {}) {
  if (!matchesPace(run.pace, filters.pace)) return false;

  const range = distanceOptions.find((option) => option.value === filters.distance);
  if (range?.max) {
    const km = parseKm(run.distance);
    if (km === null || km <= range.min || km > range.max) return false;
  }

  if (!matchesDay(run.startsAt, filters.day, now)) return false;
  if (!matchesTimeOfDay(run.startsAt, filters.timeOfDay)) return false;

  // Afstandsfilteret ignoreres, hvis vi ikke kender brugerens position.
  if (filters.nearby !== "all" && userLocation) {
    if (!isValidPoint(run.start) || distanceKm(userLocation, run.start) > Number(filters.nearby)) return false;
  }

  if (filters.socialOnly && !hasSocialActivity(run)) return false;
  return true;
}

export function countActiveFilters(filters) {
  return Object.keys(DEFAULT_FILTERS).filter((key) => filters[key] !== DEFAULT_FILTERS[key]).length;
}

// Skjuler ture, der allerede er gået i gang, og sorterer efter starttidspunkt (snarest først).
// Ældre ture uden starttidspunkt vises til sidst.
export function upcomingRuns(runs, now = new Date()) {
  const time = (run) => run.startsAt?.getTime?.() ?? Infinity;
  return runs
    .filter((run) => !run.startsAt || run.startsAt >= now)
    .sort((a, b) => (time(a) === time(b) ? 0 : time(a) - time(b)));
}
