import React from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator } from "react-native";

import styles, { discThemes } from "../styles";
import { distanceKm, formatKm, isValidPoint } from "../data/location";
import { hasSocialActivity, parseKm } from "../data/filters";

// En linje med en grå etiket foran værdien, fx "mødested Fælledparken".
// Bruges også på kortet på "Find runs".
export function MetaLine({ label, children }) {
  return (
    <Text style={styles.cardMeta}>
      <Text style={styles.metaLabel}>{label} </Text>
      {children}
    </Text>
  );
}

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
          {/* En tyk linje over listen. Rækkerne adskilles af tynde linjer som i en tabel. */}
          {runs.length > 0 && <View style={styles.listRule} />}
        </View>
      }
      ListEmptyComponent={!loading && !error ? <Text style={styles.cardText}>{emptyMessage}</Text> : null}
      // Hver række er en knap, der åbner detaljeskærmen (stack-navigation) med turens id.
      // Distancen står som et stort tal i en cirkel, der skifter mellem rød, blå og gul.
      renderItem={({ item, index }) => {
        const [disc, discText] = discThemes[index % discThemes.length];
        const km = parseKm(item.distance);
        return (
          <Pressable
            accessibilityRole="button"
            style={styles.runRow}
            onPress={() => navigation.navigate("RunDetails", { runId: item.id })}
          >
            <View style={[styles.disc, disc]}>
              <Text style={[styles.discValue, discText]}>{km === null ? "?" : String(km).replace(".", ",")}</Text>
              <Text style={[styles.discUnit, discText]}>km</Text>
            </View>
            <View style={styles.runRowBody}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <MetaLine label="tempo">{item.pace}</MetaLine>
              <MetaLine label="tid">{item.date}</MetaLine>
              <MetaLine label="mødested">
                {item.location}
                {userLocation && isValidPoint(item.start) ? ` · ${formatKm(distanceKm(userLocation, item.start))} fra dig` : ""}
              </MetaLine>
              <MetaLine label="deltagere">{item.participants ?? 1}</MetaLine>
              {hasSocialActivity(item) && <MetaLine label="efter løbet">{item.afterRun}</MetaLine>}
            </View>
          </Pressable>
        );
      }}
    />
  );
}
