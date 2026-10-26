import React from "react";
import { Text, View } from "react-native";

import styles, { posterThemes } from "../styles";

// Overskrift som en lille Bauhaus-plakat: en farveflade med en beskåret cirkel,
// et kvadrat og titlen med små bogstaver. Hver skærm har sin egen farve.
// keepCase bevarer store bogstaver, fx i en løbeturs eget navn.
export default function ScreenHeading({ title, subtitle, color = "blue", size = "normal", keepCase = false }) {
  const [poster, circle, square, text] = posterThemes[color] ?? posterThemes.blue;
  const large = size === "large";
  return (
    <View>
      <View style={[styles.poster, poster, large && styles.posterLarge]}>
        <View style={[styles.posterCircle, circle, large && styles.posterCircleLarge]} />
        <View style={[styles.posterSquare, square]} />
        <Text style={[styles.posterTitle, text, large && styles.posterTitleLarge, keepCase && styles.keepCase]} accessibilityRole="header">
          {title}
        </Text>
      </View>
      {!!subtitle && <Text style={styles.subheading}>{subtitle}</Text>}
    </View>
  );
}
