import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";

import styles from "../styles";

export default function RunDetailsScreen({
  route,
  runs = [],
  user,
  joinedRunIds = [],
  onSetParticipation,
  loading,
  error,
  onRetry,
  participationLoading,
  participationError,
}) {
  const runId = route.params?.runId;
  const run = runs.find((item) => item.id === runId);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const joined = joinedRunIds.includes(runId);
  const isOrganizer = !!user && run?.organizerId === user.uid;
  const retryButton = onRetry && (
    <Pressable accessibilityRole="button" onPress={onRetry} style={{ paddingVertical: 8 }}>
      <Text style={styles.importantText}>Prøv igen</Text>
    </Pressable>
  );

  useEffect(() => {
    setSaveError("");
  }, [runId, joined]);

  const setParticipation = async () => {
    if (saving || loading || error || participationLoading || participationError || isOrganizer || !run) return;
    setSaving(true);
    setSaveError("");
    try {
      await onSetParticipation(run.id, !joined);
    } catch {
      setSaveError("Kunne ikke ændre din tilmelding. Kontrollér din internetforbindelse, og prøv igen.");
    } finally {
      setSaving(false);
    }
  };

  if (!run) {
    return (
      <View style={styles.screen}>
        {loading ? (
          <ActivityIndicator accessibilityLabel="Henter løbeturen" />
        ) : (
          <>
            <Text style={styles.cardText} accessibilityRole={error ? "alert" : undefined}>
              {error || "Løbeturen findes ikke længere."}
            </Text>
            {!!error && retryButton}
          </>
        )}
      </View>
    );
  }

  const unavailable = saving || loading || participationLoading || !!participationError || !!error;

  return (
    <ScrollView style={{ backgroundColor: "#f7f7f7" }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {!!(error || participationError) && (
        <View style={styles.card}>
          <Text accessibilityRole="alert" style={styles.cardText}>
            {[error, participationError].filter(Boolean).join("\n")}
          </Text>
          {retryButton}
        </View>
      )}
      <View style={styles.detailBox}>
        <Text style={styles.detailTitle}>{run.title}</Text>
        <Text style={styles.detailText}>🏃 Tempo: {run.pace}</Text>
        <Text style={styles.detailText}>📏 Distance: {run.distance}</Text>
        <Text style={styles.detailText}>🕒 {run.date}</Text>
        <Text style={styles.detailText}>📍 {run.location}</Text>
        <Text style={styles.detailText}>👥 {run.participants ?? 1} deltagere</Text>
        <Text style={styles.detailText}>🙋 Arrangør: {run.organizer}</Text>
        {!!run.afterRun && <Text style={styles.detailText}>☕ {run.afterRun}</Text>}
        <Text style={styles.description}>{run.description}</Text>

        {isOrganizer ? (
          <Text style={styles.joinedMessage}>Du arrangerer og deltager i denne løbetur.</Text>
        ) : (
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: unavailable, busy: saving || participationLoading }}
              style={[styles.button, unavailable && { opacity: 0.6 }]}
              onPress={setParticipation}
              disabled={unavailable}
            >
              <Text style={styles.buttonText}>
                {saving ? "Gemmer…" : participationLoading ? "Henter tilmelding…" : joined ? "Forlad løbetur" : "Deltag i løbetur"}
              </Text>
            </Pressable>
            {joined && <Text style={styles.joinedMessage}>Du er tilmeldt løbeturen ✓</Text>}
            {!!saveError && (
              <Text accessibilityRole="alert" style={[styles.cardText, { color: "#a21a1a", marginTop: 12 }]}>
                {saveError}
              </Text>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
