import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";

import { auth, firebaseConfigured } from "../firebase";
import styles from "../styles";

// Oversætter Firebase-fejlkoder til forståelige danske beskeder.
function authErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "E-mail eller adgangskode er forkert. Prøv igen.";
    case "auth/email-already-in-use":
      return "Der findes allerede en bruger med denne e-mail. Log ind eller nulstil din adgangskode.";
    case "auth/invalid-email":
      return "Skriv en gyldig e-mailadresse.";
    case "auth/weak-password":
    case "auth/password-does-not-meet-requirements":
      return "Adgangskoden opfylder ikke kravene. Brug mindst 6 tegn, eller en stærkere adgangskode.";
    case "auth/user-disabled":
      return "Denne bruger er deaktiveret. Kontakt appens administrator.";
    case "auth/too-many-requests":
      return "Der har været for mange forsøg. Vent lidt, og prøv igen.";
    case "auth/network-request-failed":
      return "Kunne ikke få forbindelse. Kontrollér din internetforbindelse, og prøv igen.";
    case "auth/operation-not-allowed":
    case "auth/admin-restricted-operation":
      return "Login med e-mail er ikke aktiveret endnu. Følg afsnittet om Authentication i FIREBASE_SETUP.md.";
    case "auth/invalid-api-key":
    case "auth/app-not-authorized":
      return "Firebase-opsætningen skal kontrolleres. Se FIREBASE_SETUP.md.";
    case "auth/profile-update-failed":
      return "Kontoen blev oprettet, men navnet kunne ikke gemmes. Log ind med din e-mail og adgangskode.";
    default:
      return "Handlingen kunne ikke gennemføres. Prøv igen om lidt.";
  }
}

// Login-skærmen har tre tilstande: "login", "register" (opret bruger) og "reset" (glemt adgangskode).
export default function AuthScreen({ onRegister }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // useRef i stedet for state, så et dobbelttryk ikke sender to forespørgsler, før skærmen er opdateret.
  const busy = useRef(false);
  const configured = firebaseConfigured && Boolean(auth);
  const isRegister = mode === "register";
  const isReset = mode === "reset";
  const disabled = loading || !configured;

  const changeMode = (nextMode) => {
    if (busy.current) return;
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  };

  const submit = async () => {
    if (busy.current || !configured) return;
    setError("");
    setMessage("");
    const normalizedEmail = email.trim().toLowerCase();
    const displayName = name.trim();

    // Tjek felterne i appen først, så brugeren får en hurtig og præcis besked.
    if (isRegister && !displayName) {
      setError("Skriv dit navn, så andre kan se, hvem der arrangerer løbeturen.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Skriv en gyldig e-mailadresse.");
      return;
    }
    if (!isReset && !password) {
      setError("Skriv din adgangskode.");
      return;
    }
    if (isRegister && password.length < 6) {
      setError("Adgangskoden skal være mindst 6 tegn lang.");
      return;
    }
    if (isRegister && password !== confirmPassword) {
      setError("De to adgangskoder skal være ens.");
      return;
    }

    busy.current = true;
    setLoading(true);
    try {
      if (isReset) {
        await sendPasswordResetEmail(auth, normalizedEmail);
        setMessage("Hvis der findes en bruger med denne e-mail, modtager du et link til en ny adgangskode. Tjek også spam-mappen.");
      } else if (isRegister) {
        await onRegister(displayName, normalizedEmail, password);
      } else {
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
      }
    } catch (submitError) {
      // Ældre Firebase-projekter afslører, om en e-mail findes, når man nulstiller adgangskoden.
      // Vi viser samme besked for alle e-mails, så man ikke kan se, hvem der har en bruger.
      if (isReset && submitError?.code === "auth/user-not-found") {
        setMessage("Hvis der findes en bruger med denne e-mail, modtager du et link til en ny adgangskode. Tjek også spam-mappen.");
      } else {
        setError(authErrorMessage(submitError));
      }
    } finally {
      busy.current = false;
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardScreen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, styles.centeredContent]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.authContainer}>
          <Text style={[styles.subheading, styles.brandText]}>Social Runs</Text>
          <Text style={styles.heading}>
            {isReset ? "Glemt adgangskode?" : isRegister ? "Opret en bruger" : "Velkommen tilbage"}
          </Text>
          <Text style={styles.subheading}>
            {isReset
              ? "Skriv din e-mail for at få et link til en ny adgangskode."
              : isRegister
                ? "Find løbemakkere, opret dine egne runs og hold styr på dine tilmeldinger."
                : "Log ind for at finde og oprette løbeture og se de runs, du er meldt til."}
          </Text>

          {!configured && (
            <Text style={[styles.cardText, styles.errorText, styles.setupWarning]} accessibilityRole="alert">
              Firebase mangler opsætning. Følg FIREBASE_SETUP.md og udfyld .env, og genstart derefter appen.
            </Text>
          )}

          {isRegister && (
            <>
              <Text style={styles.label}>Dit navn</Text>
              <TextInput
                style={styles.input}
                accessibilityLabel="Dit navn"
                placeholder="Fx Emma Nielsen"
                value={name}
                onChangeText={setName}
                maxLength={80}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                editable={!loading}
              />
            </>
          )}

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            accessibilityLabel="E-mail"
            placeholder="dig@eksempel.dk"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            maxLength={254}
            editable={!loading}
            returnKeyType={isReset ? "done" : "next"}
            onSubmitEditing={isReset ? submit : undefined}
          />

          {!isReset && (
            <>
              <Text style={styles.label}>Adgangskode</Text>
              <TextInput
                style={styles.input}
                accessibilityLabel="Adgangskode"
                placeholder={isRegister ? "Mindst 6 tegn" : "Din adgangskode"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete={isRegister ? "new-password" : "current-password"}
                textContentType={isRegister ? "newPassword" : "password"}
                editable={!loading}
                returnKeyType={isRegister ? "next" : "done"}
                onSubmitEditing={isRegister ? undefined : submit}
              />
            </>
          )}

          {isRegister && (
            <>
              <Text style={styles.label}>Gentag adgangskode</Text>
              <TextInput
                style={styles.input}
                accessibilityLabel="Gentag adgangskode"
                placeholder="Skriv adgangskoden igen"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={submit}
              />
            </>
          )}

          {Boolean(error) && (
            <Text
              style={[styles.cardText, styles.errorText, styles.feedbackText]}
              accessibilityRole="alert"
              accessibilityLiveRegion="assertive"
            >
              {error}
            </Text>
          )}
          {Boolean(message) && (
            <Text
              style={[styles.cardText, styles.successText, styles.feedbackText]}
              accessibilityLiveRegion="polite"
            >
              {message}
            </Text>
          )}

          <Pressable
            style={[styles.button, disabled && styles.disabled]}
            onPress={submit}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ disabled, busy: loading }}
          >
            <Text style={styles.buttonText}>
              {loading ? "Vent et øjeblik…" : isReset ? "Send link" : isRegister ? "Opret bruger" : "Log ind"}
            </Text>
          </Pressable>

          {mode === "login" && (
            <Pressable
              onPress={() => changeMode("reset")}
              disabled={loading}
              style={styles.linkButton}
              accessibilityRole="button"
              accessibilityState={{ disabled: loading }}
            >
              <Text style={[styles.cardText, styles.underline]}>Glemt adgangskode?</Text>
            </Pressable>
          )}

          <Pressable
            style={[styles.secondaryButton, loading && styles.disabled]}
            onPress={() => changeMode(mode === "login" ? "register" : "login")}
            disabled={loading}
            accessibilityRole="button"
            accessibilityState={{ disabled: loading }}
          >
            <Text style={styles.secondaryButtonText}>
              {mode === "login" ? "Ny her? Opret bruger" : "Tilbage til login"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
