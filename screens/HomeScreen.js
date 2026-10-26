import React from "react";
import { View, Text } from "react-native";

import styles from "../styles";
import RunList from "../components/RunList";

export default function HomeScreen({ navigation, runs, loading, error, onRetry }) {
  const header = (
    <View>
      <Text style={styles.heading}>Løbeture nær dig</Text>
      <Text style={styles.subheading}>Find en social løbetur, der passer til dit tempo.</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <RunList
        navigation={navigation}
        runs={runs}
        loading={loading}
        error={error}
        onRetry={onRetry}
        header={header}
        emptyMessage="Ingen løbeture endnu. Opret den første!"
      />
    </View>
  );
}
