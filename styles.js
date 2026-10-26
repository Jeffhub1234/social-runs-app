import { Platform, StyleSheet } from "react-native";
import { DefaultTheme } from "@react-navigation/native";

// Al styling til appen samles i denne fil, så skærmene kun indeholder layout og logik.
// Stilen bygger på Bauhaus: kun små bogstaver (som Herbert Bayers typografi), store flader i
// grundfarverne rød, gul og blå, cirklen som bærende form, tynde sorte linjer i et stramt
// gitter og en geometrisk skrift (Futura).

// Farver, som også bruges direkte som props (faner, header og nåle på kortet).
export const colors = {
  ink: "#121212",
  paper: "#FAFAF7",
  white: "#FFFFFF",
  red: "#E1251B",
  yellow: "#FFC20E",
  blue: "#1B3F8F",
  muted: "#666660",
  inactive: "#8A8A85",
  start: "#1B3F8F",
  end: "#E1251B",
};

// Futura er indbygget på iPhone. På Android bruges systemets skrift.
const type = Platform.select({ ios: { fontFamily: "Futura" }, default: {} });

// Tema til React Navigation, så baggrunden bag skærmene passer til appen.
export const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.paper, card: colors.paper, primary: colors.ink, text: colors.ink },
};

// Stil til de rå HTML-<input>-felter i RunDateTimeField.web.js. Det er CSS til browseren,
// derfor ligger den uden for StyleSheet.create.
export const webInputStyle = { padding: "12px 0", fontSize: 16, border: "none", borderBottom: "2px solid #121212", borderRadius: 0, background: "transparent", width: "100%", boxSizing: "border-box", fontFamily: "Futura, sans-serif" };

const styles = StyleSheet.create({
  // Generelle skærme og layout
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.paper,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 60,
    backgroundColor: colors.paper,
  },

  // Plakat-overskrift: en farveflade med en beskåret cirkel og et lille sort kvadrat
  poster: { minHeight: 104, padding: 16, paddingRight: 60, justifyContent: "flex-end", overflow: "hidden" },
  posterLarge: { minHeight: 190 },
  posterBlue: { backgroundColor: colors.blue },
  posterRed: { backgroundColor: colors.red },
  posterYellow: { backgroundColor: colors.yellow },
  posterBlack: { backgroundColor: colors.ink },
  posterCircle: { position: "absolute", width: 120, height: 120, borderRadius: 60, top: -36, right: -24 },
  posterCircleLarge: { width: 210, height: 210, borderRadius: 105, top: -70, right: -60 },
  posterSquare: { position: "absolute", width: 24, height: 24, right: 18, bottom: 18 },
  fillRed: { backgroundColor: colors.red },
  fillYellow: { backgroundColor: colors.yellow },
  fillBlue: { backgroundColor: colors.blue },
  fillInk: { backgroundColor: colors.ink },
  fillWhite: { backgroundColor: colors.white },
  posterTitle: { ...type, fontSize: 30, lineHeight: 34, fontWeight: "700", letterSpacing: -0.5, textTransform: "lowercase" },
  posterTitleLarge: { fontSize: 46, lineHeight: 48 },
  keepCase: { textTransform: "none" },
  textLight: { color: colors.white },
  textDark: { color: colors.ink },
  subheading: {
    ...type,
    fontSize: 15,
    lineHeight: 21,
    color: colors.muted,
    marginTop: 10,
    marginBottom: 12,
  },
  heading: {
    ...type,
    fontSize: 26,
    fontWeight: "700",
    textTransform: "lowercase",
    color: colors.ink,
    marginTop: 20,
  },

  // Lister som en typografisk tabel: rækker adskilt af sorte linjer
  listRule: { height: 2, backgroundColor: colors.ink },
  runRow: { flexDirection: "row", gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.ink },
  runRowBody: { flex: 1 },
  // Distancen vises som et stort tal i en farvet cirkel
  disc: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  discValue: { ...type, fontSize: 20, lineHeight: 22, fontWeight: "700" },
  discUnit: { ...type, fontSize: 11, fontWeight: "700", textTransform: "lowercase" },
  metaLabel: { color: colors.muted },

  card: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: colors.ink,
  },

  cardTitle: {
    ...type,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    color: colors.ink,
  },

  cardText: {
    ...type,
    fontSize: 15,
    marginBottom: 4,
    color: colors.ink,
  },

  cardMeta: {
    ...type,
    fontSize: 14,
    lineHeight: 19,
    color: colors.ink,
  },

  importantText: {
    ...type,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    color: colors.ink,
  },

  // Knapper: sort blok med hvid tekst, eller sort kontur
  button: {
    backgroundColor: colors.ink,
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
  },

  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.ink,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 16,
  },

  buttonText: {
    ...type,
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
    textTransform: "lowercase",
    letterSpacing: 0.5,
  },

  secondaryButtonText: {
    ...type,
    color: colors.ink,
    fontSize: 17,
    fontWeight: "700",
    textTransform: "lowercase",
    letterSpacing: 0.5,
  },

  // Detaljeskærmen: etiket til venstre, værdi til højre, adskilt af linjer
  infoTable: { borderTopWidth: 2, borderTopColor: colors.ink, marginTop: 16 },
  infoRow: { flexDirection: "row", paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.ink },
  infoLabel: { ...type, width: 104, fontSize: 14, color: colors.muted, textTransform: "lowercase", paddingTop: 1 },
  infoValue: { ...type, flex: 1, fontSize: 16, fontWeight: "700", color: colors.ink },
  sectionLabel: { ...type, fontSize: 14, fontWeight: "700", textTransform: "lowercase", letterSpacing: 0.5, color: colors.ink, marginTop: 22, marginBottom: 2 },

  description: {
    ...type,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 6,
    marginBottom: 8,
    color: colors.ink,
  },

  joinedMessage: {
    ...type,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 14,
    textAlign: "center",
    color: colors.blue,
  },

  // Formularer: felter med en streg under i stedet for en kasse
  label: {
    ...type,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "lowercase",
    letterSpacing: 0.5,
    marginBottom: 2,
    marginTop: 20,
    color: colors.ink,
  },

  input: {
    ...type,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
    paddingVertical: 10,
    fontSize: 17,
    color: colors.ink,
  },

  // Beskrivelsen vokser med teksten, men højst til 180, så den altid kan ses over tastaturet.
  multilineInput: {
    minHeight: 90,
    maxHeight: 180,
    textAlignVertical: "top",
  },
  fieldText: { ...type, fontSize: 17, color: colors.ink },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(18,18,18,0.5)" },
  selectionSheet: { backgroundColor: colors.paper, padding: 24, paddingBottom: 40, borderTopWidth: 2, borderTopColor: colors.ink, maxHeight: "75%" },
  sheetTitle: { ...type, fontSize: 24, fontWeight: "700", textTransform: "lowercase", color: colors.ink, marginBottom: 12 },
  choiceOption: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.ink },
  // Bjælken med "færdig" over iPhonens taltastatur
  keyboardAccessory: { flexDirection: "row", justifyContent: "flex-end", backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.ink, paddingHorizontal: 16, paddingVertical: 10 },
  keyboardAccessoryText: { ...type, fontSize: 17, fontWeight: "700", textTransform: "lowercase", color: colors.blue },

  // Liste/kort-skift og filtre på "Find runs"
  hintText: { ...type, fontSize: 13, color: colors.muted, marginTop: 6 },
  noteText: { ...type, fontSize: 13, color: colors.muted, marginBottom: 8 },
  filterRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12, marginBottom: 8 },
  linkText: { ...type, fontSize: 15, fontWeight: "700", color: colors.blue, textDecorationLine: "underline" },
  toolbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  segmented: { flexDirection: "row", borderWidth: 2, borderColor: colors.ink },
  segment: { paddingVertical: 8, paddingHorizontal: 18 },
  segmentWide: { flex: 1, alignItems: "center" },
  segmentSelected: { backgroundColor: colors.ink },
  segmentText: { ...type, fontSize: 15, fontWeight: "700", textTransform: "lowercase", color: colors.ink },
  segmentTextSelected: { color: colors.white },
  filterButton: { borderWidth: 2, borderColor: colors.ink, paddingVertical: 8, paddingHorizontal: 16 },
  filterButtonActive: { backgroundColor: colors.blue, borderColor: colors.blue },
  filterButtonTextActive: { color: colors.white },

  // Filterarket og valg-chips (runde, som Bauhaus-cirklen)
  filterSheet: { maxHeight: "90%" },
  sheetScroll: { flexShrink: 1 },
  filterSection: { marginBottom: 18 },
  filterTitle: { ...type, fontSize: 14, fontWeight: "700", textTransform: "lowercase", letterSpacing: 0.5, marginBottom: 8, color: colors.ink },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  chip: { borderWidth: 2, borderColor: colors.ink, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 14 },
  chipSelected: { backgroundColor: colors.ink },
  chipText: { ...type, fontSize: 14, color: colors.ink },
  chipTextSelected: { color: colors.white, fontWeight: "700" },
  sheetButtons: { flexDirection: "row", gap: 12, marginTop: 12 },
  sheetButton: { flex: 1, marginTop: 0, marginBottom: 0 },

  // Kort
  mapContainer: { flex: 1, borderWidth: 2, borderColor: colors.ink, overflow: "hidden" },
  map: { flex: 1 },
  mapNotice: { position: "absolute", top: 12, left: 12, right: 12, backgroundColor: colors.paper, borderWidth: 2, borderColor: colors.ink, padding: 12 },
  mapCard: { position: "absolute", left: 12, right: 12, bottom: 12, backgroundColor: colors.paper, borderWidth: 2, borderColor: colors.ink, padding: 16, paddingRight: 44 },
  mapCardLink: { marginTop: 8 },
  mapCardClose: { position: "absolute", top: 10, right: 14, padding: 4 },
  routePreview: { height: 200, borderWidth: 2, borderColor: colors.ink, overflow: "hidden", marginTop: 8 },
  pickerScreen: { flex: 1, backgroundColor: colors.paper },
  pickerContent: { flex: 1, padding: 16 },
  pickerSegmented: { marginBottom: 12 },

  // Navigation: header og faner (App.js)
  navHeader: { backgroundColor: colors.paper },
  navHeaderTitle: { ...type, fontSize: 17, fontWeight: "700", color: colors.ink },
  headerTitleBox: { alignItems: "center" },
  headerTitle: { ...type, fontSize: 18, fontWeight: "700", textTransform: "lowercase", color: colors.ink },
  headerSubtitle: { ...type, fontSize: 12, color: colors.muted, maxWidth: 180 },
  headerButton: { paddingVertical: 8 },
  headerButtonText: { ...type, fontSize: 15, fontWeight: "700", textTransform: "lowercase", color: colors.red },
  tabBar: { backgroundColor: colors.paper, elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: colors.ink },
  tabBarLabel: { ...type, fontSize: 14, fontWeight: "700", textTransform: "lowercase" },
  tabBarItem: { paddingHorizontal: 4, minHeight: 48 },
  tabBarIndicator: { backgroundColor: colors.ink, height: 3 },

  // Login-skærmen
  keyboardScreen: { flex: 1, backgroundColor: colors.paper },
  centeredContent: { flexGrow: 1, justifyContent: "center" },
  authContainer: { width: "100%", maxWidth: 480, alignSelf: "center" },
  linkButton: { padding: 12, alignItems: "center", marginBottom: 12 },
  underline: { textDecorationLine: "underline" },

  // Fælles hjælpestile
  flex: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  scrollScreen: { backgroundColor: colors.paper },
  listContent: { paddingBottom: 24 },
  loader: { marginVertical: 16 },
  retryButton: { paddingVertical: 8 },
  disabled: { opacity: 0.4 },
  errorText: { color: colors.red },
  successText: { color: "#236B36" },
  feedbackText: { marginTop: 14 },
  setupWarning: { marginBottom: 12 },
});

// Farverne til plakat-overskrifterne: [flade, cirkel, kvadrat, tekst].
export const posterThemes = {
  blue: [styles.posterBlue, styles.fillYellow, styles.fillInk, styles.textLight],
  red: [styles.posterRed, styles.fillBlue, styles.fillInk, styles.textLight],
  yellow: [styles.posterYellow, styles.fillRed, styles.fillInk, styles.textDark],
  black: [styles.posterBlack, styles.fillRed, styles.fillWhite, styles.textLight],
};

// Farverne til distance-cirklerne i listerne, som skifter for hver række: [cirkel, tekst].
export const discThemes = [
  [styles.fillRed, styles.textLight],
  [styles.fillBlue, styles.textLight],
  [styles.fillYellow, styles.textDark],
];

export default styles;
