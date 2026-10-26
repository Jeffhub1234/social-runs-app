import React, { useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import styles from "../styles";
import { useHeaderHeight } from "@react-navigation/elements";
import ChoiceField from "../components/ChoiceField";
import RunDateTimeField from "../components/RunDateTimeField";
import LocationPickerField from "../components/LocationPickerField";
import { paceOptions } from "../data/pace";
import { NO_AFTER_RUN } from "../data/filters";
import { isValidPoint } from "../data/location";

// Standardtidspunkt for en ny tur: om en time, afrundet til hele minutter.
function defaultRunDate() {
  const next = new Date(Date.now() + 60 * 60 * 1000);
  next.setSeconds(0, 0);
  return next;
}

// "Opret": formular til at oprette en ny social løbetur, som gemmes i Firestore.
// Tempo vælges fra faste intervaller, så det altid er tydeligt, og så tempofilteret på "Find runs" virker.
export default function CreateRunScreen({ navigation, addRun }) {
  const headerHeight = useHeaderHeight();
  const [title, setTitle] = useState("");
  const [pace, setPace] = useState("");
  const [distance, setDistance] = useState("");
  const [date, setDate] = useState(defaultRunDate);
  const [location, setLocation] = useState("");
  // Start- og slutpunkt fra kortet: { latitude, longitude } eller null.
  const [route, setRoute] = useState({ start: null, end: null });
  const [afterRun, setAfterRun] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const createRun = async () => {
    if (saving) return;
    // Navn, tempo, distance, mødested og rute skal udfyldes. Resten er valgfrit.
    if (![title, pace, distance, location].every((value) => value.trim()) || !isValidPoint(route.start) || !isValidPoint(route.end)) {
      Alert.alert(
        "Mangler oplysninger",
        "Udfyld navn, tempo, distance og mødested, og vælg start og slut på kortet."
      );
      return;
    }

    // Distancen skrives som et tal i km. Komma og punktum er begge tilladt.
    const km = Number(distance.trim().replace(",", "."));
    if (!(km > 0 && km <= 200)) {
      Alert.alert("Ugyldig distance", "Skriv distancen i km, fx 5 eller 7,5.");
      return;
    }

    if (date.getTime() <= Date.now()) {
      Alert.alert("Ugyldigt tidspunkt", "Vælg en dato og et tidspunkt i fremtiden.");
      return;
    }

    // Arrangørens navn og id sættes af saveRun ud fra den indloggede bruger.
    const newRun = {
      title: title.trim(),
      pace: pace.trim(),
      distance: `${String(km).replace(".", ",")} km`,
      // "date" er teksten, der vises. "startsAt" er det rigtige tidspunkt, som filtrene bruger.
      date: `${date.toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" })} kl. ${date.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}`,
      startsAt: date,
      location: location.trim(),
      start: route.start,
      end: route.end,
      participants: 1,
      afterRun: afterRun.trim() || NO_AFTER_RUN,
      organizer: "Dig",
      description:
        description || "En social løbetur oprettet af en bruger.",
    };

    setSaving(true);
    try {
      await addRun(newRun);
    } catch (error) {
      Alert.alert("Kunne ikke gemme løbeturen", "Kontrollér Firebase-opsætningen og din internetforbindelse, og prøv igen.");
      return;
    } finally {
      setSaving(false);
    }

    // Nulstil formularen, så den er klar til en ny tur.
    setTitle("");
    setPace("");
    setDistance("");
    setDate(defaultRunDate());
    setLocation("");
    setRoute({ start: null, end: null });
    setAfterRun("");
    setDescription("");

    Alert.alert(
      "Løbetur oprettet",
      "Din løbetur er nu tilføjet til oversigten.",
      [
        {
          text: "Se løbeturen",
          onPress: () => navigation.navigate("FindRuns"),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={headerHeight + 48}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Opret en social løbetur</Text>
        <Text style={styles.subheading}>
          Gør tempoet tydeligt, så andre løbere kan se, om turen passer til dem.
        </Text>

        <Text style={styles.label}>Navn på løbetur</Text>
        <TextInput
          style={styles.input}
          placeholder="Fx Nørrebro Social Run"
          value={title}
          onChangeText={setTitle}
          maxLength={200}
        />

        <Text style={styles.label}>Tempo</Text>
        <ChoiceField label="Tempo" value={pace} options={paceOptions} onChange={setPace} />

        <Text style={styles.label}>Distance (km)</Text>
        <TextInput
          style={styles.input}
          placeholder="Fx 5"
          value={distance}
          onChangeText={setDistance}
          keyboardType="decimal-pad"
          maxLength={6}
          accessibilityLabel="Distance i kilometer"
        />

        <RunDateTimeField value={date} onChange={setDate} />

        <Text style={styles.label}>Mødested</Text>
        <TextInput
          style={styles.input}
          placeholder="Fx hovedindgangen til Fælledparken"
          accessibilityLabel="Mødested"
          value={location}
          onChangeText={setLocation}
          maxLength={300}
        />

        <Text style={styles.label}>Rute: start og slut</Text>
        <LocationPickerField start={route.start} end={route.end} onChange={setRoute} />

        <Text style={styles.label}>Social aktivitet efter løbet</Text>
        <TextInput
          style={styles.input}
          placeholder="Fx kaffe eller kage"
          accessibilityLabel="Social aktivitet efter løbet"
          value={afterRun}
          onChangeText={setAfterRun}
          maxLength={500}
        />

        <Text style={styles.label}>Beskrivelse</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Beskriv løbeturen og hvem den passer til"
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={5000}
        />

        <Pressable style={[styles.button, saving && styles.disabled]} onPress={createRun} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? "Gemmer…" : "Opret løbetur"}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
