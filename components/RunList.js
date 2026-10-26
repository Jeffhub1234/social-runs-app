import React from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator } from "react-native";

import styles from "../styles";
import { distanceKm, formatKm, isValidPoint } from "../data/location";

// Fælles liste over løbeture, som bruges på "Find runs", "Mine runs" og "Tilmeldte".
// Viser også indlæsning og fejlbesked, så skærmene ikke skal gentage den logik.
// Kender vi brugerens position (userLocation), vises afstanden til hver turs startsted.
export default function RunList({ navigation, runs = [], loading, error, onRetry, header, emptyMessage, userLocation }) {
  return (
    <FlatList
      style={styles.flex}
      data={runs}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <View>
          {header}
          {loading && <ActivityIndicator style={styles.loader} accessibilityLabel="Henter løbeture" />}
          {!!error && (
            <View style={styles.card}>
              <Text accessibilityRole="alert" style={styles.cardText}>{error}</Text>
              {onRetry && (
                <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
                  <Text style={styles.importantText}>Prøv igen</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      }
      ListEmptyComponent={!loading && !error ? <Text style={styles.cardText}>{emptyMessage}</Text> : null}
      // Hvert kort er en knap, der åbner detaljeskærmen (stack-navigation) med turens id.
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          style={styles.card}
          onPress={() => navigation.navigate("RunDetails", { runId: item.id })}
        >
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.importantText}>Tempo: {item.pace}</Text>
          <Text style={styles.cardText}>Distance: {item.distance}</Text>
          <Text style={styles.cardText}>{item.date}</Text>
          <Text style={styles.cardText}>
            📍 {item.location}
            {userLocation && isValidPoint(item.start) ? ` · ${formatKm(distanceKm(userLocation, item.start))} fra dig` : ""}
          </Text>
          <Text style={styles.cardText}>👥 {item.participants ?? 1} deltagere</Text>
          {!!item.afterRun && <Text style={styles.cardText}>☕ {item.afterRun}</Text>}
        </Pressable>
      )}
    />
  );
}
