import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";

import styles from "../styles";
import RoutePreview from "../components/RoutePreview";
import ScreenHeading from "../components/ScreenHeading";
import { hasSocialActivity } from "../data/filters";
import { isValidPoint } from "../data/location";

// Én række i oplysningstabellen: en grå etiket til venstre og værdien til højre.
// Faste etiketter i stedet for emojis gør det tydeligt, hvad hver oplysning betyder.
function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

// "Detaljer": viser én løbetur og lader brugeren melde sig til eller fra.
// Turen findes i listen fra Firestore ud fra det id, der blev sendt med i navigationen.
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
    <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
      <Text style={styles.importantText}>Prøv igen</Text>
    </Pressable>
  );

  // Fjern en gammel fejlbesked, når tilmeldingen ændrer sig eller en anden tur åbnes.
  useEffect(() => {
    setSaveError("");
  }, [runId, joined]);

  // Skifter mellem "deltag" og "forlad". Arrangøren deltager altid og kan ikke melde sig fra.
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
    <ScrollView style={styles.scrollScreen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {!!(error || participationError) && (
        <View style={styles.card}>
          <Text accessibilityRole="alert" style={styles.cardText}>
            {[error, participationError].filter(Boolean).join("\n")}
          </Text>
          {retryButton}
        </View>
      )}
      <View>
        {/* Turens navn vises med de store bogstaver, arrangøren har skrevet. */}
        <ScreenHeading title={run.title} color="blue" keepCase />
        <View style={styles.infoTable}>
          <InfoRow label="Tempo" value={run.pace} />
          <InfoRow label="Distance" value={run.distance} />
          <InfoRow label="Tidspunkt" value={run.date} />
          <InfoRow label="Mødested" value={run.location} />
          <InfoRow label="Deltagere" value={String(run.participants ?? 1)} />
          <InfoRow label="Arrangør" value={run.organizer} />
          <InfoRow label="Efter løbet" value={hasSocialActivity(run) ? run.afterRun : "Ingen social aktivitet"} />
        </View>

        {/* Kortet vises kun for ture med start og slut. Ældre ture har ingen koordinater. */}
        {(isValidPoint(run.start) || isValidPoint(run.end)) && (
          <>
            <Text style={styles.sectionLabel}>Rute</Text>
            <RoutePreview start={run.start} end={run.end} />
          </>
        )}

        <Text style={styles.sectionLabel}>Om turen</Text>
        <Text style={styles.description}>{run.description}</Text>

        {isOrganizer ? (
          <Text style={styles.joinedMessage}>Du arrangerer og deltager i denne løbetur.</Text>
        ) : (
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: unavailable, busy: saving || participationLoading }}
              style={[styles.button, unavailable && styles.disabled]}
              onPress={setParticipation}
              disabled={unavailable}
            >
              <Text style={styles.buttonText}>
                {saving ? "Gemmer…" : participationLoading ? "Henter tilmelding…" : joined ? "Forlad løbetur" : "Deltag i løbetur"}
              </Text>
            </Pressable>
            {joined && <Text style={styles.joinedMessage}>Du er tilmeldt løbeturen ✓</Text>}
            {!!saveError && (
              <Text accessibilityRole="alert" style={[styles.cardText, styles.errorText, styles.feedbackText]}>
                {saveError}
              </Text>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
