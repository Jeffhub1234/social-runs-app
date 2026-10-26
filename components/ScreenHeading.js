import React from "react";
import { Text, View } from "react-native";

import styles from "../styles";
import BauhausMark from "./BauhausMark";

// Fælles overskrift til skærmene: Bauhaus-mærke, titel med versaler,
// en stribe i rød, gul og blå og en kort undertekst.
export default function ScreenHeading({ title, subtitle, mark = true }) {
  return (
    <View style={styles.headingBlock}>
      {mark && <BauhausMark />}
      <Text style={styles.heading} accessibilityRole="header">{title}</Text>
      <View style={styles.colorRule}>
        <View style={styles.ruleRed} />
        <View style={styles.ruleYellow} />
        <View style={styles.ruleBlue} />
      </View>
      {!!subtitle && <Text style={styles.subheading}>{subtitle}</Text>}
    </View>
  );
}
