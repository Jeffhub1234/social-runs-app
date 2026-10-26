import React, { useEffect, useMemo, useRef } from "react";
import { Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import styles, { colors } from "../styles";
import { distanceKm, isValidPoint, regionAround } from "../data/location";

// Lille kort med start (blå) og slut (rød) for en løbetur. Kortet kan ikke flyttes
// (pointerEvents="none"), så det ikke spærrer, når man scroller på skærmen.
export default function RoutePreview({ start, end }) {
  const mapRef = useRef(null);
  const hasStart = isValidPoint(start);
  const hasEnd = isValidPoint(end);
  // Udsnittet beregnes kun igen, når punkterne ændrer sig.
  const region = useMemo(
    () => regionAround([start, end]),
    [start?.latitude, start?.longitude, end?.latitude, end?.longitude],
  );

  // På iPhone ignoreres et udsnit, der sættes, før kortet har fået sin størrelse. Så viser
  // kortet næsten hele Danmark. Derfor zoomes der ind igen, når kortet er klar,
  // og når punkterne ændres (fx når man flytter start eller slut under "Opret").
  const zoomToRoute = () => mapRef.current?.animateToRegion(region, 0);
  useEffect(() => { zoomToRoute(); }, [region]);

  if (!hasStart && !hasEnd) return null;
  // Under 50 meter mellem start og slut regnes som samme sted (en rundtur).
  const roundTrip = hasStart && hasEnd && distanceKm(start, end) < 0.05;

  return (
    <View>
      <View style={styles.routePreview} pointerEvents="none">
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onMapReady={zoomToRoute}
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
      <Text style={styles.hintText}>{roundTrip ? "🔵 Start og slut samme sted (rundtur)" : "🔵 Start    🔴 Slut"}</Text>
    </View>
  );
}
