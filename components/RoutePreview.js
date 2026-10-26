import React, { useMemo } from "react";
import { Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import styles, { colors } from "../styles";
import { distanceKm, isValidPoint, regionAround } from "../data/location";

// Lille kort med start (grøn) og slut (rød) for en løbetur. Kortet kan ikke flyttes
// (pointerEvents="none"), så det ikke spærrer, når man scroller på skærmen.
export default function RoutePreview({ start, end }) {
  const hasStart = isValidPoint(start);
  const hasEnd = isValidPoint(end);
  // Udsnittet beregnes kun igen, når punkterne ændrer sig.
  const region = useMemo(
    () => regionAround([start, end]),
    [start?.latitude, start?.longitude, end?.latitude, end?.longitude],
  );
  if (!hasStart && !hasEnd) return null;
  // Under 50 meter mellem start og slut regnes som samme sted (en rundtur).
  const roundTrip = hasStart && hasEnd && distanceKm(start, end) < 0.05;

  return (
    <View>
      <View style={styles.routePreview} pointerEvents="none">
        <MapView
          style={styles.map}
          region={region}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          toolbarEnabled={false}
          liteMode
        >
          {hasStart && <Marker coordinate={start} pinColor={colors.start} />}
          {hasEnd && !roundTrip && <Marker coordinate={end} pinColor={colors.end} />}
        </MapView>
      </View>
      <Text style={styles.hintText}>{roundTrip ? "🟢 Start og slut samme sted (rundtur)" : "🟢 Start    🔴 Slut"}</Text>
    </View>
  );
}
