import React from "react";
import { View } from "react-native";

import styles from "../styles";
import RunList from "../components/RunList";
import ScreenHeading from "../components/ScreenHeading";

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
        header={<ScreenHeading color="red" title="Mine runs" subtitle="Løbeture, du selv har oprettet. Du deltager som arrangør." />}
      />
    </View>
  );
}
