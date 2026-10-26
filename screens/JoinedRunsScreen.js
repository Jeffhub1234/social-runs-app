import React from "react";
import { View, Text } from "react-native";

import styles from "../styles";
import RunList from "../components/RunList";

export default function JoinedRunsScreen({ navigation, runs, loading, error, onRetry }) {
  return (
    <View style={styles.screen}>
      <RunList
        navigation={navigation}
        runs={runs}
        loading={loading}
        error={error}
        onRetry={onRetry}
        emptyMessage="Du er ikke tilmeldt nogen løbeture endnu."
        header={
          <View>
            <Text style={styles.heading}>Tilmeldte runs</Text>
            <Text style={styles.subheading}>Løbeture fra andre arrangører, som du har meldt dig til.</Text>
          </View>
        }
      />
    </View>
  );
}
