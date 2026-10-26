import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../styles";

// Felt til dato og tidspunkt med telefonens egen vælger (iOS/Android).
// "mode" styrer, om dato- eller tidsvælgeren er åben (null = lukket).
export default function RunDateTimeField({ value, onChange }) {
  const [mode, setMode] = useState(null);
  // Android lukker selv vælgeren efter et valg. Kun den valgte del (dato eller tid) ændres.
  const change = (event, selected) => {
    if (Platform.OS === "android") setMode(null);
    if (event.type !== "set" || !selected) return;
    const next = new Date(value);
    if (mode === "date") next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    else next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    onChange(next);
  };
  return (
    <View>
      <Text style={styles.label}>Dato</Text>
      <Pressable style={styles.input} accessibilityRole="button" onPress={() => setMode("date")}>
        <Text style={styles.fieldText}>{value.toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" })} ▾</Text>
      </Pressable>
      {mode === "date" && <DateTimePicker value={value} mode="date" display={Platform.OS === "ios" ? "inline" : "default"} minimumDate={new Date()} onChange={change} />}
      {mode === "date" && Platform.OS === "ios" && <Pressable style={styles.secondaryButton} onPress={() => setMode(null)}><Text style={styles.secondaryButtonText}>Færdig</Text></Pressable>}
      <Text style={styles.label}>Tidspunkt</Text>
      <Pressable style={styles.input} accessibilityRole="button" onPress={() => setMode("time")}>
        <Text style={styles.fieldText}>{value.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })} ▾</Text>
      </Pressable>
      {mode === "time" && <DateTimePicker value={value} mode="time" display={Platform.OS === "ios" ? "spinner" : "default"} is24Hour onChange={change} />}
      {mode === "time" && Platform.OS === "ios" && <Pressable style={styles.secondaryButton} onPress={() => setMode(null)}><Text style={styles.secondaryButtonText}>Færdig</Text></Pressable>}
    </View>
  );
}
