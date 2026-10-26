import React from "react";
import { Text, View } from "react-native";
import styles, { webInputStyle as inputStyle } from "../styles";

// Webversionen af dato/tid-vælgeren. Expo bruger automatisk denne fil i browseren (.web.js),
// fordi den native DateTimePicker ikke virker på web. Her bruges browserens egne <input>-felter.

// Formaterer en dato som "ÅÅÅÅ-MM-DD", som <input type="date"> forventer.
const localDate = (value) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;

export default function RunDateTimeField({ value, onChange }) {
  return <View>
    <Text style={styles.label}>Dato</Text>
    <input aria-label="Dato" type="date" style={inputStyle} min={localDate(new Date())} value={localDate(value)} onChange={(event) => {
      if (!event.target.value) return;
      const [year, month, day] = event.target.value.split("-").map(Number);
      const next = new Date(value); next.setFullYear(year, month - 1, day); onChange(next);
    }} />
    <Text style={styles.label}>Tidspunkt</Text>
    <input aria-label="Tidspunkt" type="time" style={inputStyle} value={`${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`} onChange={(event) => {
      if (!event.target.value) return;
      const [hour, minute] = event.target.value.split(":").map(Number);
      const next = new Date(value); next.setHours(hour, minute, 0, 0); onChange(next);
    }} />
  </View>;
}
