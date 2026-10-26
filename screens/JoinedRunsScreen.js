import React from "react";
import { View } from "react-native";

import styles from "../styles";
import RunList from "../components/RunList";
import ScreenHeading from "../components/ScreenHeading";

// "Tilmeldte": de løbeture, brugeren har meldt sig til (listen filtreres i App.js).
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
        header={<ScreenHeading color="yellow" title="Tilmeldte runs" subtitle="Løbeture fra andre arrangører, som du har meldt dig til." />}
      />
    </View>
  );
}
