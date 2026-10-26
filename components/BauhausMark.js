import React from "react";
import { View } from "react-native";

import styles from "../styles";

// Appens Bauhaus-mærke: en rød cirkel, et blåt kvadrat og en gul trekant.
// size="large" bruges på login-skærmen. Mærket er kun pynt og skjules for skærmlæsere.
export default function BauhausMark({ size = "small" }) {
  const large = size === "large";
  return (
    <View style={[styles.markRow, large && styles.markRowLarge]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[styles.markCircle, large && styles.markCircleLarge]} />
      <View style={[styles.markSquare, large && styles.markSquareLarge]} />
      <View style={[styles.markTriangle, large && styles.markTriangleLarge]} />
    </View>
  );
}
