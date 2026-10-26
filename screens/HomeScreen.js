import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "../styles";
import RunList from "../components/RunList";
import RunMap from "../components/RunMap";
import FilterSheet from "../components/FilterSheet";
import { DEFAULT_FILTERS, countActiveFilters, matchesFilters, upcomingRuns } from "../data/filters";
import { useUserLocation } from "../data/location";

// Nøgle i AsyncStorage, så appen husker brugerens filtre, også når appen har været lukket.
const FILTER_STORAGE_KEY = "socialRuns.filters";

const views = [
  { key: "list", label: "Liste" },
  { key: "map", label: "Kort" },
];

// "Find runs": kommende løbeture som liste eller på et kort, med detaljerede filtre.
export default function HomeScreen({ navigation, runs, loading, error, onRetry }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState("list");
  // Brugerens position bruges til kortet, "km fra dig" og afstandsfilteret.
  const { location } = useUserLocation();

  // Hent de gemte filtre, når skærmen åbnes. Har brugeren allerede ændret et filter, beholdes det.
  useEffect(() => {
    AsyncStorage.getItem(FILTER_STORAGE_KEY)
      .then((saved) => {
        if (saved) setFilters((current) => (current === DEFAULT_FILTERS ? { ...DEFAULT_FILTERS, ...JSON.parse(saved) } : current));
      })
      .catch(() => {}); // Kan filtrene ikke hentes, starter vi bare uden filtre.
  }, []);

  // Gem filtrene på telefonen, hver gang de ændres.
  const changeFilters = (next) => {
    setFilters(next);
    AsyncStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  // Først kun kommende ture (snarest først), derefter brugerens filtre.
  // useMemo sørger for, at listen kun beregnes igen, når ture, filtre eller position ændrer sig.
  const upcoming = useMemo(() => upcomingRuns(runs), [runs]);
  const filteredRuns = useMemo(
    () => upcoming.filter((run) => matchesFilters(run, filters, { userLocation: location })),
    [upcoming, filters, location],
  );
  const activeCount = countActiveFilters(filters);

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Løbeture nær dig</Text>
      <Text style={styles.subheading}>Find en social løbetur, der passer til dit tempo.</Text>

      <View style={styles.toolbar}>
        <View style={styles.segmented}>
          {views.map((item) => (
            <Pressable
              key={item.key}
              style={[styles.segment, view === item.key && styles.segmentSelected]}
              onPress={() => setView(item.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: view === item.key }}
            >
              <Text style={[styles.segmentText, view === item.key && styles.segmentTextSelected]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          style={[styles.filterButton, activeCount > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilters(true)}
          accessibilityRole="button"
          accessibilityLabel={`Filtre, ${activeCount} aktive`}
        >
          <Text style={[styles.segmentText, activeCount > 0 && styles.segmentTextSelected]}>
            Filtre{activeCount > 0 ? ` (${activeCount})` : ""}
          </Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.cardText}>{filteredRuns.length} af {upcoming.length} kommende løbeture</Text>
        {activeCount > 0 && (
          <Pressable accessibilityRole="button" onPress={() => changeFilters(DEFAULT_FILTERS)} hitSlop={8}>
            <Text style={styles.linkText}>Ryd filtre</Text>
          </Pressable>
        )}
      </View>

      {view === "list" ? (
        <RunList
          navigation={navigation}
          runs={filteredRuns}
          loading={loading}
          error={error}
          onRetry={onRetry}
          userLocation={location}
          emptyMessage={activeCount
            ? "Ingen løbeture matcher dine filtre. Prøv at ændre eller rydde dem."
            : "Ingen kommende løbeture endnu. Opret den første!"}
        />
      ) : (
        <>
          {!!error && (
            <View style={styles.card}>
              <Text accessibilityRole="alert" style={styles.cardText}>{error}</Text>
              <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
                <Text style={styles.importantText}>Prøv igen</Text>
              </Pressable>
            </View>
          )}
          <RunMap runs={filteredRuns} userLocation={location} onOpenRun={(runId) => navigation.navigate("RunDetails", { runId })} />
        </>
      )}

      <FilterSheet
        visible={showFilters}
        filters={filters}
        onChange={changeFilters}
        onClose={() => setShowFilters(false)}
        resultCount={filteredRuns.length}
        locationAvailable={Boolean(location)}
      />
    </View>
  );
}
