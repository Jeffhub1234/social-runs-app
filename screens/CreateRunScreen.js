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

function defaultRunDate() {
  const next = new Date(Date.now() + 60 * 60 * 1000);
  next.setSeconds(0, 0);
  return next;
}

const paceOptions = Array.from({ length: 12 }, (_, index) => {
  const seconds = 240 + index * 30;
  const format = (value) => `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
  return `${format(seconds)}–${format(seconds + 30)} min/km`;
});

export default function CreateRunScreen({ navigation, addRun }) {
  const headerHeight = useHeaderHeight();
  const [title, setTitle] = useState("");
  const [pace, setPace] = useState("");
  const [distance, setDistance] = useState("");
  const [date, setDate] = useState(defaultRunDate);
  const [location, setLocation] = useState("");
  const [afterRun, setAfterRun] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const createRun = async () => {
    if (saving) return;
    if (![title, pace, distance, location].every((value) => value.trim())) {
      Alert.alert(
        "Mangler oplysninger",
        "Udfyld navn, tempo, distance, tidspunkt og lokation."
      );
      return;
    }

    if (date.getTime() <= Date.now()) {
      Alert.alert("Ugyldigt tidspunkt", "Vælg en dato og et tidspunkt i fremtiden.");
      return;
    }

    const newRun = {
      title: title.trim(),
      pace: pace.trim(),
      distance: distance.trim(),
      date: `${date.toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" })} kl. ${date.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}`,
      location: location.trim(),
      participants: 1,
      afterRun: afterRun.trim() || "Ingen planlagt aktivitet bagefter",
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

    setTitle("");
    setPace("");
    setDistance("");
    setDate(defaultRunDate());
    setLocation("");
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
      style={{ flex: 1 }}
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

        <Text style={styles.label}>Distance</Text>
        <TextInput
          style={styles.input}
          placeholder="Fx 5 km"
          value={distance}
          onChangeText={setDistance}
          maxLength={100}
          accessibilityLabel="Distance"
        />

        <RunDateTimeField value={date} onChange={setDate} />

        <Text style={styles.label}>Lokation</Text>
        <TextInput
          style={styles.input}
          placeholder="Fx Nørrebroparken"
          value={location}
          onChangeText={setLocation}
          maxLength={300}
        />

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

        <Pressable style={[styles.button, saving && { opacity: 0.6 }]} onPress={createRun} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? "Gemmer…" : "Opret løbetur"}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
