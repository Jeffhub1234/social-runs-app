import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "../styles";
import RunList from "../components/RunList";
import ChoiceField from "../components/ChoiceField";
import { matchesPace, paceOptions } from "../data/pace";

// Nøgle i AsyncStorage, så appen husker brugerens tempo, også når appen har været lukket.
const PACE_STORAGE_KEY = "socialRuns.preferredPace";

// "Find runs": viser alle løbeture og lader brugeren søge og filtrere efter sit eget tempo.
export default function HomeScreen({ navigation, runs, loading, error, onRetry }) {
  const [search, setSearch] = useState("");
  const [preferredPace, setPreferredPace] = useState("");

  // Hent det gemte tempo, når skærmen åbnes. Har brugeren allerede valgt et tempo, beholdes det.
  useEffect(() => {
    AsyncStorage.getItem(PACE_STORAGE_KEY)
      .then((saved) => { if (saved) setPreferredPace((current) => current || saved); })
      .catch(() => {}); // Kan tempoet ikke hentes, vises bare alle ture.
  }, []);

  // Gem det valgte tempo på telefonen, eller slet det, når filteret ryddes.
  const changePace = (pace) => {
    setPreferredPace(pace);
    const request = pace ? AsyncStorage.setItem(PACE_STORAGE_KEY, pace) : AsyncStorage.removeItem(PACE_STORAGE_KEY);
    request.catch(() => {});
  };

  const clearFilters = () => {
    setSearch("");
    changePace("");
  };

  // Søgningen kigger i navn, sted, arrangør og beskrivelse og skelner ikke mellem store og små bogstaver.
  // useMemo sørger for, at listen kun filtreres igen, når løbeture, søgning eller tempo ændrer sig.
  const filteredRuns = useMemo(() => {
    const term = search.trim().toLowerCase();
    return runs.filter((run) =>
      matchesPace(run.pace, preferredPace)
      && (!term || [run.title, run.location, run.organizer, run.description]
        .some((field) => String(field ?? "").toLowerCase().includes(term))));
  }, [runs, search, preferredPace]);

  const filtering = Boolean(search.trim() || preferredPace);

  const header = (
    <View style={styles.filterBox}>
      <Text style={styles.heading}>Løbeture nær dig</Text>
      <Text style={styles.subheading}>Find en social løbetur, der passer til dit tempo.</Text>

      <TextInput
        style={styles.input}
        placeholder="Søg efter navn, sted eller arrangør"
        accessibilityLabel="Søg i løbeture"
        value={search}
        onChangeText={setSearch}
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
        maxLength={100}
      />

      <Text style={styles.label}>Dit tempo</Text>
      <ChoiceField label="Dit tempo" value={preferredPace} options={paceOptions} onChange={changePace} />
      {!!preferredPace && (
        <Text style={styles.hintText}>Viser ture i dit tempo og ét interval hurtigere eller langsommere.</Text>
      )}

      {filtering && (
        <View style={styles.filterRow}>
          <Text style={styles.cardText}>{filteredRuns.length} af {runs.length} løbeture</Text>
          <Pressable accessibilityRole="button" onPress={clearFilters} hitSlop={8}>
            <Text style={styles.linkText}>Ryd filtre</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.screen}>
      <RunList
        navigation={navigation}
        runs={filteredRuns}
        loading={loading}
        error={error}
        onRetry={onRetry}
        header={header}
        emptyMessage={filtering
          ? "Ingen løbeture matcher din søgning. Prøv et andet tempo, eller ryd filtrene."
          : "Ingen løbeture endnu. Opret den første!"}
      />
    </View>
  );
}
