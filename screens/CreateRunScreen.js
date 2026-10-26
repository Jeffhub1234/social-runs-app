import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  InputAccessoryView,
  Keyboard,
  View,
} from "react-native";

import styles from "../styles";
import { useHeaderHeight } from "@react-navigation/elements";
import ChoiceField from "../components/ChoiceField";
import Chip from "../components/Chip";
import RunDateTimeField from "../components/RunDateTimeField";
import LocationPickerField from "../components/LocationPickerField";
import ScreenHeading from "../components/ScreenHeading";
import { paceOptions } from "../data/pace";
import { NO_AFTER_RUN } from "../data/filters";
import { isValidPoint } from "../data/location";

// Id, der kobler distancefeltet til "Færdig"-bjælken over iPhonens taltastatur.
const DISTANCE_KEYBOARD_ID = "distanceKeyboard";

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
  // Social aktivitet er et aktivt valg: "Ingen" eller "Ja" med egen beskrivelse.
  // Så skriver ingen "ingen" i et tekstfelt, og filteret "kun ture med social aktivitet" bliver pålideligt.
  const [hasAfterRun, setHasAfterRun] = useState(false);
  const [afterRunText, setAfterRunText] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  // Felterne nederst (social aktivitet og beskrivelse) ender ellers bag tastaturet.
  // Når et af dem er i fokus, scroller vi helt ned, så feltet ligger lige over tastaturet.
  const scrollRef = useRef(null);
  const bottomFieldFocused = useRef(false);
  const scrollToBottom = () => scrollRef.current?.scrollToEnd({ animated: true });

  // Tastaturet er først helt fremme efter fokus, så vi scroller igen, når det er vist.
  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidShow", () => {
      if (bottomFieldFocused.current) scrollToBottom();
    });
    return () => subscription.remove();
  }, []);

  const bottomFieldProps = {
    onFocus: () => {
      bottomFieldFocused.current = true;
      setTimeout(scrollToBottom, 250);
    },
    onBlur: () => {
      bottomFieldFocused.current = false;
    },
    // Når feltet bliver højere, fordi man skriver flere linjer, følger skærmen med.
    onContentSizeChange: () => {
      if (bottomFieldFocused.current) scrollToBottom();
    },
  };

  const createRun = async () => {
    if (saving) return;
    Keyboard.dismiss();
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

    // Har man valgt "Ja", skal aktiviteten beskrives. Ellers gemmes den faste "ingen"-tekst.
    const afterRun = hasAfterRun ? afterRunText.trim() : NO_AFTER_RUN;
    if (!afterRun) {
      Alert.alert("Beskriv den sociale aktivitet", "Skriv, hvad I skal efter løbet, eller vælg \"Ingen\".");
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
      afterRun,
      description:
        description || "En social løbetur oprettet af en bruger.",
    };

    setSaving(true);
    try {
      await addRun(newRun);
    } catch {
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
    setHasAfterRun(false);
    setAfterRunText("");
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
      {/* Tastaturet lukker, når man scroller eller trykker et tomt sted i formularen. */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeading
          color="black"
          title="Opret en løbetur"
          subtitle="Gør tempoet tydeligt, så andre løbere kan se, om turen passer til dem."
        />

        <Text style={styles.label}>Navn på løbetur</Text>
        <TextInput
          style={styles.input}
          placeholder="Fx Nørrebro Social Run"
          value={title}
          onChangeText={setTitle}
          returnKeyType="done"
          maxLength={200}
        />

        <Text style={styles.label}>Tempo</Text>
        <ChoiceField label="Tempo" value={pace} options={paceOptions} onChange={setPace} />

        <Text style={styles.label}>Distance (km)</Text>
        {/* Taltastaturet på iPhone har ingen "Færdig"-knap, så vi tilføjer en bjælke med en. */}
        <TextInput
          style={styles.input}
          placeholder="Fx 5"
          value={distance}
          onChangeText={setDistance}
          keyboardType="decimal-pad"
          returnKeyType="done"
          inputAccessoryViewID={DISTANCE_KEYBOARD_ID}
          maxLength={6}
          accessibilityLabel="Distance i kilometer"
        />
        {Platform.OS === "ios" && (
          <InputAccessoryView nativeID={DISTANCE_KEYBOARD_ID}>
            <View style={styles.keyboardAccessory}>
              <Pressable onPress={Keyboard.dismiss} hitSlop={10} accessibilityRole="button">
                <Text style={styles.keyboardAccessoryText}>Færdig</Text>
              </Pressable>
            </View>
          </InputAccessoryView>
        )}

        <RunDateTimeField value={date} onChange={setDate} />

        <Text style={styles.label}>Mødested</Text>
        <TextInput
          style={styles.input}
          placeholder="Fx hovedindgangen til Fælledparken"
          accessibilityLabel="Mødested"
          value={location}
          onChangeText={setLocation}
          returnKeyType="done"
          maxLength={300}
        />

        <Text style={styles.label}>Rute: start og slut</Text>
        <LocationPickerField start={route.start} end={route.end} onChange={setRoute} />

        <Text style={styles.label}>Social aktivitet efter løbet</Text>
        <View style={styles.chipRow}>
          <Chip label="Ingen" selected={!hasAfterRun} onPress={() => setHasAfterRun(false)} />
          <Chip label="Ja, beskriv den" selected={hasAfterRun} onPress={() => setHasAfterRun(true)} />
        </View>
        {hasAfterRun && (
          <TextInput
            style={[styles.input, styles.feedbackText]}
            placeholder="Fx kaffe på Café Fælles bagefter"
            accessibilityLabel="Beskriv den sociale aktivitet efter løbet"
            value={afterRunText}
            onChangeText={setAfterRunText}
            returnKeyType="done"
            maxLength={500}
            autoFocus
            {...bottomFieldProps}
          />
        )}

        <Text style={styles.label}>Beskrivelse</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Beskriv løbeturen og hvem den passer til"
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={5000}
          {...bottomFieldProps}
        />

        <Pressable style={[styles.button, saving && styles.disabled]} onPress={createRun} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? "Gemmer…" : "Opret løbetur"}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
