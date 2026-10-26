import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import styles from "../styles";
import { paceOptions } from "../data/pace";
import { DEFAULT_FILTERS, dayOptions, distanceOptions, nearbyOptions, timeOfDayOptions } from "../data/filters";

// Én valgmulighed i filteret. Den valgte vises med mørk baggrund.
function Chip({ label, selected, disabled, onPress }) {
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

// En overskrift med en række chips, hvor man vælger én.
function ChipGroup({ title, note, options, value, onChange, disabled }) {
  return (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      {!!note && <Text style={styles.noteText}>{note}</Text>}
      <View style={styles.chipRow}>
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={value === option.value}
            disabled={disabled}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>
    </View>
  );
}

// Tempointervallerne fra "Opret" uden "min/km", så chipsene er korte.
const paceChoices = [
  { value: "", label: "Alle" },
  ...paceOptions.map((pace) => ({ value: pace, label: pace.replace(" min/km", "") })),
];

// Arket med alle filtre på "Find runs". Ændringer slår igennem med det samme,
// og knappen nederst viser, hvor mange løbeture der passer.
export default function FilterSheet({ visible, filters, onChange, onClose, resultCount, locationAvailable }) {
  const set = (key) => (value) => onChange({ ...filters, [key]: value });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.selectionSheet, styles.filterSheet]}>
          <Text style={styles.cardTitle}>Filtrér løbeture</Text>
          <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
            <ChipGroup
              title="Dit tempo (min/km)"
              note="Viser ture i dit tempo og ét interval hurtigere eller langsommere."
              options={paceChoices}
              value={filters.pace}
              onChange={set("pace")}
            />
            <ChipGroup title="Distance" options={distanceOptions} value={filters.distance} onChange={set("distance")} />
            <ChipGroup title="Hvornår" options={dayOptions} value={filters.day} onChange={set("day")} />
            <ChipGroup title="Tidspunkt" options={timeOfDayOptions} value={filters.timeOfDay} onChange={set("timeOfDay")} />
            <ChipGroup
              title="Afstand fra dig"
              note={locationAvailable
                ? "Måles i luftlinje til turens startsted."
                : "Giv appen adgang til din lokation for at bruge dette filter."}
              options={nearbyOptions}
              value={filters.nearby}
              onChange={set("nearby")}
              disabled={!locationAvailable}
            />
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Socialt</Text>
              <View style={styles.chipRow}>
                <Chip
                  label="☕ Kun ture med social aktivitet bagefter"
                  selected={filters.socialOnly}
                  onPress={() => onChange({ ...filters, socialOnly: !filters.socialOnly })}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.sheetButtons}>
            <Pressable style={[styles.secondaryButton, styles.sheetButton]} onPress={() => onChange(DEFAULT_FILTERS)} accessibilityRole="button">
              <Text style={styles.secondaryButtonText}>Nulstil</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.sheetButton]} onPress={onClose} accessibilityRole="button">
              <Text style={styles.buttonText}>Vis {resultCount} {resultCount === 1 ? "tur" : "ture"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
