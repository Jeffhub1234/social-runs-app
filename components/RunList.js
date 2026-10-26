import React from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator } from "react-native";

import styles from "../styles";

export default function RunList({ navigation, runs = [], loading, error, onRetry, header, emptyMessage }) {
  return (
    <FlatList
      style={{ flex: 1 }}
      data={runs}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
      ListHeaderComponent={
        <View>
          {header}
          {loading && <ActivityIndicator style={{ marginBottom: 16 }} accessibilityLabel="Henter løbeture" />}
          {!!error && (
            <View style={styles.card}>
              <Text accessibilityRole="alert" style={styles.cardText}>{error}</Text>
              {onRetry && (
                <Pressable accessibilityRole="button" onPress={onRetry} style={{ paddingVertical: 8 }}>
                  <Text style={styles.importantText}>Prøv igen</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      }
      ListEmptyComponent={!loading && !error ? <Text style={styles.cardText}>{emptyMessage}</Text> : null}
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
          <Text style={styles.cardText}>📍 {item.location}</Text>
          <Text style={styles.cardText}>👥 {item.participants ?? 1} deltagere</Text>
          {!!item.afterRun && <Text style={styles.cardText}>☕ {item.afterRun}</Text>}
        </Pressable>
      )}
    />
  );
}
