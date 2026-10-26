import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import styles, { colors } from "../styles";
import RoutePreview from "./RoutePreview";
import { DEFAULT_REGION, isValidPoint, regionAround, toPoint, useUserLocation } from "../data/location";

// Felt på "Opret", hvor man vælger start- og slutsted på et kort i fuld skærm.
// Valgene gemmes først, når man trykker "Gem". "Annuller" smider ændringerne væk.
export default function LocationPickerField({ start, end, onChange }) {
  const mapRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(null);
  const [draftEnd, setDraftEnd] = useState(null);
  // Hvilken nål det næste tryk på kortet placerer: "start" eller "end".
  const [placing, setPlacing] = useState("start");
  // Lokationen hentes kun, mens kortet er åbent.
  const { location } = useUserLocation(open);

  const chosen = isValidPoint(start) && isValidPoint(end);
  const ready = isValidPoint(draftStart) && isValidPoint(draftEnd);

  const openPicker = () => {
    setDraftStart(start);
    setDraftEnd(end);
    setPlacing(isValidPoint(start) && !isValidPoint(end) ? "end" : "start");
    setOpen(true);
  };

  // Kortet starter ved de valgte punkter, ellers ved brugerens position eller København.
  const initialRegion = isValidPoint(draftStart) || isValidPoint(draftEnd)
    ? regionAround([draftStart, draftEnd])
    : location ? { ...location, latitudeDelta: 0.02, longitudeDelta: 0.02 } : DEFAULT_REGION;

  // Kommer brugerens position, efter at kortet er åbnet, flyttes kortet derhen,
  // så længe der ikke er sat nogen nåle endnu.
  useEffect(() => {
    if (open && location && !isValidPoint(draftStart) && !isValidPoint(draftEnd)) {
      mapRef.current?.animateToRegion({ ...location, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 500);
    }
  }, [open, location]);

  // Et tryk på kortet placerer den valgte nål. Efter start skifter vi automatisk til slut.
  const placePoint = (event) => {
    if (event.nativeEvent.action === "marker-press") return;
    const point = toPoint(event.nativeEvent.coordinate);
    if (placing === "start") {
      setDraftStart(point);
      if (!isValidPoint(draftEnd)) setPlacing("end");
    } else {
      setDraftEnd(point);
    }
  };

  const save = () => {
    onChange({ start: draftStart, end: draftEnd });
    setOpen(false);
  };

  const segments = [
    { key: "start", label: `🔵 Start${isValidPoint(draftStart) ? " ✓" : ""}` },
    { key: "end", label: `🔴 Slut${isValidPoint(draftEnd) ? " ✓" : ""}` },
  ];

  return (
    <>
      <Pressable style={styles.input} accessibilityRole="button" onPress={openPicker}>
        <Text style={styles.fieldText}>{chosen ? "Start og slut valgt ✓ (tryk for at ændre)" : "Vælg start og slut på kortet ▾"}</Text>
      </Pressable>
      {chosen && <RoutePreview start={start} end={end} />}

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <SafeAreaView style={styles.pickerScreen}>
          <View style={styles.pickerContent}>
            <Text style={styles.sheetTitle}>Vælg start og slut</Text>
            <Text style={styles.noteText}>Vælg nål herunder, og tryk på kortet for at placere den. Hold på en nål for at flytte den.</Text>

            <View style={[styles.segmented, styles.pickerSegmented]}>
              {segments.map((segment) => (
                <Pressable
                  key={segment.key}
                  style={[styles.segment, styles.segmentWide, placing === segment.key && styles.segmentSelected]}
                  onPress={() => setPlacing(segment.key)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: placing === segment.key }}
                >
                  <Text style={[styles.segmentText, placing === segment.key && styles.segmentTextSelected]}>{segment.label}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.mapContainer}>
              <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion} showsUserLocation={Boolean(location)} onPress={placePoint}>
                {isValidPoint(draftStart) && (
                  <Marker coordinate={draftStart} pinColor={colors.start} draggable onDragEnd={(event) => setDraftStart(toPoint(event.nativeEvent.coordinate))} />
                )}
                {isValidPoint(draftEnd) && (
                  <Marker coordinate={draftEnd} pinColor={colors.end} draggable onDragEnd={(event) => setDraftEnd(toPoint(event.nativeEvent.coordinate))} />
                )}
              </MapView>
            </View>

            {isValidPoint(draftStart) && (
              <Pressable style={styles.linkButton} onPress={() => setDraftEnd(draftStart)} accessibilityRole="button">
                <Text style={styles.linkText}>Slut samme sted som start (rundtur)</Text>
              </Pressable>
            )}

            <View style={styles.sheetButtons}>
              <Pressable style={[styles.secondaryButton, styles.sheetButton]} onPress={() => setOpen(false)} accessibilityRole="button">
                <Text style={styles.secondaryButtonText}>Annuller</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.sheetButton, !ready && styles.disabled]}
                onPress={save}
                disabled={!ready}
                accessibilityRole="button"
                accessibilityState={{ disabled: !ready }}
              >
                <Text style={styles.buttonText}>Gem</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
