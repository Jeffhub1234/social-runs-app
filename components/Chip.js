import React from "react";
import { Pressable, Text } from "react-native";

import styles from "../styles";

// Én valgmulighed i en række af chips (fx i filtrene og under "Opret").
// Den valgte vises med blå baggrund.
export default function Chip({ label, selected, disabled, onPress }) {
  return (
    <Pressable
      style={[styles.chip, selected && styles.chipSelected, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}
