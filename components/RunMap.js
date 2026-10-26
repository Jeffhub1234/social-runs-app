import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import styles, { colors } from "../styles";
import { MetaLine } from "./RunList";
import { distanceKm, formatKm, isValidPoint, regionAround } from "../data/location";

// Kortet på "Find runs": en blå nål for hver løbeturs startsted.
// Tryk på en nål for at se turen nederst, og tryk på kortet med turen for at åbne detaljerne.
export default function RunMap({ runs, userLocation, onOpenRun }) {
  const mapRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const mappedRuns = runs.filter((run) => isValidPoint(run.start));
  const selected = mappedRuns.find((run) => run.id === selectedId);

  // Kortet starter ved brugerens position, ellers så alle ture kan ses (eller København).
  const [initialRegion] = useState(() => (userLocation
    ? { ...userLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : regionAround(mappedRuns.map((run) => run.start))));

  // Kommer brugerens position først efter, at kortet er vist, flyttes kortet derhen én gang.
  const centeredOnUser = useRef(Boolean(userLocation));
  useEffect(() => {
    if (!userLocation || centeredOnUser.current) return;
    centeredOnUser.current = true;
    mapRef.current?.animateToRegion({ ...userLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 }, 600);
  }, [userLocation]);

  return (
    <View style={styles.mapContainer}>
      <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion} showsUserLocation={Boolean(userLocation)}>
        {mappedRuns.map((run) => (
          <Marker key={run.id} coordinate={run.start} pinColor={colors.start} onPress={() => setSelectedId(run.id)} />
        ))}
      </MapView>

      {mappedRuns.length === 0 && (
        <View style={styles.mapNotice}>
          <Text style={styles.cardText}>Ingen løbeture med startsted på kortet matcher dine filtre.</Text>
        </View>
      )}

      {selected && (
        <View style={styles.mapCard}>
          <Pressable accessibilityRole="button" onPress={() => onOpenRun(selected.id)}>
            <Text style={styles.cardTitle}>{selected.title}</Text>
            <MetaLine label="tempo">{selected.pace}</MetaLine>
            <MetaLine label="distance">{selected.distance}</MetaLine>
            <MetaLine label="tid">{selected.date}</MetaLine>
            <MetaLine label="mødested">
              {selected.location}
              {userLocation ? ` · ${formatKm(distanceKm(userLocation, selected.start))} fra dig` : ""}
            </MetaLine>
            <Text style={[styles.linkText, styles.mapCardLink]}>Se detaljer og tilmeld dig ›</Text>
          </Pressable>
          <Pressable style={styles.mapCardClose} onPress={() => setSelectedId(null)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Luk">
            <Text style={styles.cardTitle}>✕</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
