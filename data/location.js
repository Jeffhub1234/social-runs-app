import { useEffect, useState } from "react";
import * as Location from "expo-location";

// Hjælpefunktioner til kort og lokation.

// Bruges, når vi ikke kender brugerens position: det centrale København.
export const DEFAULT_REGION = { latitude: 55.6761, longitude: 12.5683, latitudeDelta: 0.08, longitudeDelta: 0.08 };

// Tjekker, at et punkt har gyldige koordinater. Ældre løbeture har ingen start eller slut.
export function isValidPoint(point) {
  return Number.isFinite(point?.latitude) && Number.isFinite(point?.longitude);
}

// Gemmer kun bredde- og længdegrad, fordi Firestore-reglerne ikke tillader andre felter i et punkt.
export function toPoint({ latitude, longitude }) {
  return { latitude, longitude };
}

// Afstand i km i luftlinje mellem to punkter (haversine-formlen).
export function distanceKm(a, b) {
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

// Viser fx 1.234 som "1,2 km".
export function formatKm(km) {
  return `${String(Math.round(km * 10) / 10).replace(".", ",")} km`;
}

// Beregner et kortudsnit, der viser alle punkterne med lidt luft omkring.
export function regionAround(points, fallback = DEFAULT_REGION) {
  const valid = points.filter(isValidPoint);
  if (!valid.length) return fallback;
  const latitudes = valid.map((point) => point.latitude);
  const longitudes = valid.map((point) => point.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.6, 0.01),
    longitudeDelta: Math.max((maxLng - minLng) * 1.6, 0.01),
  };
}

// Spørger om adgang til telefonens lokation og returnerer { location, status }.
// status er "idle", "loading", "granted", "denied" eller "unavailable". Siger brugeren nej,
// virker appen stadig, men uden "km fra dig" og afstandsfilteret.
export function useUserLocation(enabled = true) {
  const [state, setState] = useState({ location: null, status: "idle" });

  useEffect(() => {
    if (!enabled) return undefined;
    let active = true;
    (async () => {
      setState((current) => (current.location ? current : { ...current, status: "loading" }));
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== "granted") {
          if (active) setState({ location: null, status: "denied" });
          return;
        }
        // Den sidst kendte position er hurtig at få. Findes den ikke, henter vi en ny.
        const position = (await Location.getLastKnownPositionAsync())
          ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
        if (!active) return;
        setState(position
          ? { location: { latitude: position.coords.latitude, longitude: position.coords.longitude }, status: "granted" }
          : { location: null, status: "unavailable" });
      } catch {
        if (active) setState({ location: null, status: "unavailable" });
      }
    })();
    return () => { active = false; };
  }, [enabled]);

  return state;
}
