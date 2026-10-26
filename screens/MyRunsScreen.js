import React from "react";
import { View, Text } from "react-native";

import styles from "../styles";
import RunList from "../components/RunList";

// "Mine runs": de løbeture, brugeren selv har oprettet (listen filtreres i App.js).
export default function MyRunsScreen({ navigation, runs, loading, error, onRetry }) {
  return (
    <View style={styles.screen}>
      <RunList
        navigation={navigation}
        runs={runs}
        loading={loading}
        error={error}
        onRetry={onRetry}
        emptyMessage="Du har ikke oprettet nogen løbeture endnu."
        header={
          <View>
            <Text style={styles.heading}>Mine runs</Text>
            <Text style={styles.subheading}>Løbeture, du selv har oprettet. Du deltager som arrangør.</Text>
          </View>
        }
      />
    </View>
  );
}
