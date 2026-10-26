import React from "react";
import { Text, View } from "react-native";
import styles from "../styles";

const localDate = (value) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
const inputStyle = { padding: 12, fontSize: 16, border: "1px solid #d5d5d5", borderRadius: 10, background: "white", width: "100%", boxSizing: "border-box" };

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
