import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View, useWindowDimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import MyRunsScreen from "./screens/MyRunsScreen";
import JoinedRunsScreen from "./screens/JoinedRunsScreen";
import RunDetailsScreen from "./screens/RunDetailsScreen";
import CreateRunScreen from "./screens/CreateRunScreen";
import { auth } from "./firebase";
import { saveRun, setRunParticipation, subscribeToJoinedRuns, subscribeToRuns } from "./data/runRepository";
import styles, { colors } from "./styles";

// Navigationen består af en stack (oversigt -> detaljer) med fire faner øverst i oversigten.
const Stack = createNativeStackNavigator();
const Tabs = createMaterialTopTabNavigator();

// De fire faner: Find runs, Mine runs, Tilmeldte og Opret.
// Alle faner får de samme løbeture fra Firestore og filtrerer dem efter, hvad de skal vise.
function RunTabs({ user, runs, joinedRunIds, loading, error, participationLoading, participationError, onRetry }) {
  const { width } = useWindowDimensions();
  const shared = { loading, error, onRetry };
  return (
    <Tabs.Navigator
      initialRouteName="FindRuns"
      initialLayout={{ width }}
      backBehavior="history"
      screenOptions={{
        lazy: true,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.inactive,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIndicatorStyle: styles.tabBarIndicator,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen name="FindRuns" options={{ title: "Find runs", tabBarAccessibilityLabel: "Find løbeture" }}>
        {(props) => <HomeScreen {...props} {...shared} runs={runs} />}
      </Tabs.Screen>
      {/* Kun ture, som brugeren selv har oprettet. */}
      <Tabs.Screen name="MyRuns" options={{ title: "Mine runs" }}>
        {(props) => <MyRunsScreen {...props} {...shared} runs={runs.filter((run) => run.organizerId === user.uid)} />}
      </Tabs.Screen>
      {/* Kun ture, som brugeren har meldt sig til. */}
      <Tabs.Screen name="JoinedRuns" options={{ title: "Tilmeldte", tabBarAccessibilityLabel: "Tilmeldte runs" }}>
        {(props) => <JoinedRunsScreen {...props} runs={runs.filter((run) => joinedRunIds.includes(run.id))} loading={loading || participationLoading} error={error || participationError} onRetry={onRetry} />}
      </Tabs.Screen>
      {/* Swipe er slået fra her, så man ikke skifter fane ved et uheld midt i formularen. */}
      <Tabs.Screen name="CreateRun" options={{ title: "Opret", tabBarAccessibilityLabel: "Opret løbetur", swipeEnabled: false }}>
        {(props) => <CreateRunScreen {...props} addRun={saveRun} />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}

// Den del af appen, man ser, når man er logget ind.
// Her lytter vi live til Firestore, så nye løbeture og tilmeldinger vises med det samme.
function UserApp({ user }) {
  const [runs, setRuns] = useState([]);
  const [joinedRunIds, setJoinedRunIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participationLoading, setParticipationLoading] = useState(true);
  const [error, setError] = useState("");
  const [participationError, setParticipationError] = useState("");
  const [retry, setRetry] = useState(0);

  // Start abonnementer på løbeture og brugerens tilmeldinger. Når "retry" ændres
  // (knappen "Prøv igen"), startes de forfra. Abonnementerne stoppes, når brugeren logger ud.
  useEffect(() => {
    setLoading(true);
    setParticipationLoading(true);
    setError("");
    setParticipationError("");
    const stopRuns = subscribeToRuns((items) => {
      setRuns(items); setLoading(false); setError("");
    }, () => {
      setLoading(false);
      setError("Kunne ikke hente løbeture. Kontrollér forbindelsen og de opdaterede Firestore-regler.");
    });
    const stopJoined = subscribeToJoinedRuns(user.uid, (ids) => {
      setJoinedRunIds(ids); setParticipationLoading(false); setParticipationError("");
    }, () => {
      setParticipationLoading(false);
      setParticipationError("Kunne ikke hente dine tilmeldinger. Prøv igen, og kontrollér Firestore-reglerne.");
    });
    return () => { stopRuns(); stopJoined(); };
  }, [user.uid, retry]);

  const onRetry = () => setRetry((value) => value + 1);
  const shared = { loading, error, onRetry };
  const logout = async () => {
    try { await signOut(auth); }
    catch { Alert.alert("Kunne ikke logge ud", "Prøv igen."); }
  };

  return (
      <Stack.Navigator
        initialRouteName="RunTabs"
        screenOptions={{
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="RunTabs" options={{
          title: "Social Runs",
          headerTitle: () => <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Social Runs</Text>
            <Text numberOfLines={1} style={styles.headerSubtitle}>Hej {user.displayName || "løber"}</Text>
          </View>,
          headerRight: () => <Pressable accessibilityRole="button" onPress={logout} hitSlop={8} style={styles.headerButton}><Text style={styles.headerButtonText}>Log ud</Text></Pressable>,
        }}>
          {() => <RunTabs user={user} runs={runs} joinedRunIds={joinedRunIds} {...shared} participationLoading={participationLoading} participationError={participationError} />}
        </Stack.Screen>
        {/* Detaljeskærmen lægges oven på fanerne, så tilbage-knappen fører tilbage til listen. */}
        <Stack.Screen name="RunDetails" options={{ title: "Detaljer" }}>
          {(props) => <RunDetailsScreen {...props} {...shared} runs={runs} user={user} joinedRunIds={joinedRunIds} participationLoading={participationLoading} participationError={participationError} onSetParticipation={setRunParticipation} />}
        </Stack.Screen>

      </Stack.Navigator>
  );
}

// Appens startpunkt: viser login, indtil Firebase Auth melder en indlogget bruger.
export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(Boolean(auth));
  const [registering, setRegistering] = useState(false);

  // Firebase husker login (via AsyncStorage på telefonen), så brugeren forbliver logget ind.
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser && !currentUser.isAnonymous ? currentUser : null);
      setCheckingAuth(false);
    });
  }, []);

  // Opretter brugeren og gemmer navnet, så andre kan se, hvem der arrangerer en tur.
  // "registering" holder login-skærmen fremme, indtil navnet er gemt.
  const register = async (name, email, password) => {
    setRegistering(true);
    let created = false;
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      created = true;
      await updateProfile(credential.user, { displayName: name });
      setUser(credential.user);
    } catch (error) {
      if (created) {
        setUser(null);
        try { await signOut(auth); }
        catch { /* Bliv på login-skærmen, selv hvis udlogningen også fejler. */ }
        const profileError = new Error("Kontoen blev oprettet, men navnet kunne ikke gemmes. Log ind med din e-mail og adgangskode.");
        profileError.code = "auth/profile-update-failed";
        throw profileError;
      }
      throw error;
    } finally {
      setRegistering(false);
    }
  };

  if (checkingAuth) return <View style={[styles.screen, styles.centered]}><ActivityIndicator /><Text style={styles.cardText}>Henter din bruger…</Text></View>;

  return <NavigationContainer>
    {user && !registering ? <UserApp key={user.uid} user={user} /> : <AuthScreen onRegister={register} />}
  </NavigationContainer>;
}
