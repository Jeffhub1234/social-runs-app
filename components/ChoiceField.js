import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import styles from "../styles";

// Genbrugeligt valgfelt: et tryk åbner et ark nedefra med faste valgmuligheder.
// Bruges til tempo både på "Opret" og i filteret på "Find runs".
export default function ChoiceField({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable style={styles.input} accessibilityRole="button" accessibilityLabel={`${label}: ${value || "Vælg"}`} onPress={() => setOpen(true)}>
        <Text style={styles.fieldText}>{value || `Vælg ${label.toLowerCase()}`} ▾</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.selectionSheet}>
            <Text style={styles.cardTitle}>{label}</Text>
            <ScrollView>
              {options.map((option) => (
                <Pressable key={option} style={styles.choiceOption} accessibilityRole="radio" accessibilityState={{ checked: value === option }} onPress={() => { onChange(option); setOpen(false); }}>
                  <Text style={styles.fieldText}>{option}{value === option ? " ✓" : ""}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable style={styles.secondaryButton} onPress={() => setOpen(false)}><Text style={styles.secondaryButtonText}>Annuller</Text></Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
