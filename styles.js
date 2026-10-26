import { Platform, StyleSheet } from "react-native";
import { DefaultTheme } from "@react-navigation/native";

// Al styling til appen samles i denne fil, så skærmene kun indeholder layout og logik.
// Stilen er inspireret af Bauhaus: grundfarverne rød, gul og blå sammen med sort og papirhvid,
// skarpe hjørner, tykke sorte kanter, geometriske former og en geometrisk skrift (Futura).

// Farver, som også bruges direkte som props (faner, header og nåle på kortet).
export const colors = {
  ink: "#111111",
  paper: "#F3EEE3",
  white: "#FFFFFF",
  red: "#D7352B",
  yellow: "#F2B705",
  blue: "#1D4E9E",
  muted: "#5A5A5A",
  inactive: "#6B6B6B",
  start: "#1D4E9E",
  end: "#D7352B",
};

// Futura er indbygget på iPhone. På Android bruges systemets skrift.
const type = Platform.select({ ios: { fontFamily: "Futura" }, default: {} });

// Tema til React Navigation, så baggrunden bag skærmene også er papirhvid.
export const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.paper, card: colors.paper, primary: colors.red, text: colors.ink },
};

// Stil til de rå HTML-<input>-felter i RunDateTimeField.web.js. Det er CSS til browseren,
// derfor ligger den uden for StyleSheet.create.
export const webInputStyle = { padding: 12, fontSize: 16, border: "2px solid #111111", borderRadius: 0, background: "white", width: "100%", boxSizing: "border-box", fontFamily: "Futura, sans-serif" };

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

  // Overskrifter: versaler, en asymmetrisk stribe i de tre grundfarver og en undertekst
  headingBlock: { marginBottom: 12 },
  heading: {
    ...type,
    fontSize: 28,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.ink,
    marginTop: 8,
  },
  colorRule: { flexDirection: "row", width: "70%", height: 8, marginTop: 8, marginBottom: 10 },
  ruleRed: { flex: 3, backgroundColor: colors.red },
  ruleYellow: { flex: 1, backgroundColor: colors.yellow },
  ruleBlue: { flex: 2, backgroundColor: colors.blue },
  subheading: {
    ...type,
    fontSize: 15,
    lineHeight: 21,
    color: colors.muted,
  },

  // Bauhaus-mærket: cirkel, kvadrat og trekant
  markRow: { flexDirection: "row", alignItems: "flex-end", gap: 6 },
  markRowLarge: { gap: 12, marginBottom: 20 },
  markCircle: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.red },
  markSquare: { width: 16, height: 16, backgroundColor: colors.blue },
  // Trekanten tegnes med kanter: en synlig bundkant og to gennemsigtige sidekanter.
  markTriangle: {
    width: 0, height: 0, borderLeftWidth: 9, borderRightWidth: 9, borderBottomWidth: 16,
    borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: colors.yellow,
  },
  markCircleLarge: { width: 48, height: 48, borderRadius: 24 },
  markSquareLarge: { width: 48, height: 48 },
  markTriangleLarge: { borderLeftWidth: 27, borderRightWidth: 27, borderBottomWidth: 48 },

  // Kort i lister. Venstre kant skifter mellem rød, blå og gul.
  card: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderLeftWidth: 10,
    borderColor: colors.ink,
  },
  accentRed: { borderLeftColor: colors.red },
  accentBlue: { borderLeftColor: colors.blue },
  accentYellow: { borderLeftColor: colors.yellow },

  cardTitle: {
    ...type,
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 8,
    color: colors.ink,
  },

  cardText: {
    ...type,
    fontSize: 15,
    marginBottom: 4,
    color: colors.ink,
  },

  importantText: {
    ...type,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    color: colors.ink,
  },

  // Tempoet vises som en gul etiket, fordi det er det vigtigste for at vælge en tur.
  paceTag: { alignSelf: "flex-start", backgroundColor: colors.yellow, borderWidth: 2, borderColor: colors.ink, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8 },
  paceTagText: { ...type, fontSize: 14, fontWeight: "700", letterSpacing: 0.5, color: colors.ink },

  // Knapper: rød blok med sort kant, eller hvid med sort kant
  button: {
    backgroundColor: colors.red,
    borderWidth: 2,
    borderColor: colors.ink,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
  },

  secondaryButton: {
    backgroundColor: colors.white,
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
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },

  secondaryButtonText: {
    ...type,
    color: colors.ink,
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },

  // Detaljeskærmen
  detailBox: {
    backgroundColor: colors.white,
    padding: 18,
    borderWidth: 2,
    borderTopWidth: 12,
    borderColor: colors.ink,
    borderTopColor: colors.blue,
  },

  detailTitle: {
    ...type,
    fontSize: 26,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 14,
    color: colors.ink,
  },

  detailText: {
    ...type,
    fontSize: 16,
    marginBottom: 9,
    color: colors.ink,
  },

  description: {
    ...type,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 12,
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

  // Formularer og valgfelter
  label: {
    ...type,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 16,
    color: colors.ink,
  },

  input: {
    ...type,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    padding: 12,
    fontSize: 16,
    color: colors.ink,
  },

  multilineInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  fieldText: { ...type, fontSize: 16, color: colors.ink },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(17,17,17,0.5)" },
  selectionSheet: { backgroundColor: colors.paper, padding: 24, paddingBottom: 40, borderTopWidth: 6, borderTopColor: colors.ink, maxHeight: "75%" },
  choiceOption: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#D9D2C3" },
  // Bjælken med "Færdig" over iPhonens taltastatur
  keyboardAccessory: { flexDirection: "row", justifyContent: "flex-end", backgroundColor: colors.paper, borderTopWidth: 2, borderTopColor: colors.ink, paddingHorizontal: 16, paddingVertical: 10 },
  keyboardAccessoryText: { ...type, fontSize: 16, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, color: colors.blue },

  // Liste/kort-skift og filtre på "Find runs"
  hintText: { ...type, fontSize: 13, color: colors.muted, marginTop: 6 },
  noteText: { ...type, fontSize: 13, color: colors.muted, marginBottom: 8 },
  filterRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12, marginBottom: 8 },
  linkText: { ...type, fontSize: 15, fontWeight: "700", color: colors.blue, textDecorationLine: "underline" },
  toolbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  segmented: { flexDirection: "row", borderWidth: 2, borderColor: colors.ink, backgroundColor: colors.white },
  segment: { paddingVertical: 8, paddingHorizontal: 18 },
  segmentWide: { flex: 1, alignItems: "center" },
  segmentSelected: { backgroundColor: colors.yellow },
  segmentText: { ...type, fontSize: 14, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, color: colors.ink },
  segmentTextSelected: { color: colors.ink },
  filterButton: { borderWidth: 2, borderColor: colors.ink, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: colors.white },
  filterButtonActive: { backgroundColor: colors.blue },
  filterButtonTextActive: { color: colors.white },

  // Filterarket og valg-chips
  filterSheet: { maxHeight: "90%" },
  sheetScroll: { flexShrink: 1 },
  filterSection: { marginBottom: 18 },
  filterTitle: { ...type, fontSize: 13, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, color: colors.ink },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 2, borderColor: colors.ink, paddingVertical: 7, paddingHorizontal: 12, backgroundColor: colors.white },
  chipSelected: { backgroundColor: colors.blue },
  chipText: { ...type, fontSize: 14, color: colors.ink },
  chipTextSelected: { color: colors.white, fontWeight: "700" },
  sheetButtons: { flexDirection: "row", gap: 12, marginTop: 12 },
  sheetButton: { flex: 1, marginTop: 0, marginBottom: 0 },

  // Kort
  mapContainer: { flex: 1, borderWidth: 2, borderColor: colors.ink, overflow: "hidden" },
  map: { flex: 1 },
  mapNotice: { position: "absolute", top: 12, left: 12, right: 12, backgroundColor: colors.white, borderWidth: 2, borderColor: colors.ink, padding: 12 },
  // Kortet med den valgte tur har en hård, forskudt skygge i stedet for en blød.
  mapCard: {
    position: "absolute", left: 12, right: 16, bottom: 16, backgroundColor: colors.white,
    borderWidth: 2, borderLeftWidth: 10, borderColor: colors.ink, borderLeftColor: colors.red, padding: 16, paddingRight: 44,
    shadowColor: colors.ink, shadowOpacity: 1, shadowRadius: 0, shadowOffset: { width: 5, height: 5 }, elevation: 6,
  },
  mapCardLink: { marginTop: 6 },
  mapCardClose: { position: "absolute", top: 10, right: 14, padding: 4 },
  routePreview: { height: 200, borderWidth: 2, borderColor: colors.ink, overflow: "hidden", marginTop: 8 },
  pickerScreen: { flex: 1, backgroundColor: colors.paper },
  pickerContent: { flex: 1, padding: 16 },
  pickerSegmented: { marginBottom: 12 },

  // Navigation: header og faner (App.js)
  navHeader: { backgroundColor: colors.paper },
  navHeaderTitle: { ...type, fontSize: 17, fontWeight: "700", color: colors.ink },
  headerTitleBox: { alignItems: "center" },
  headerTitle: { ...type, fontSize: 17, fontWeight: "700", textTransform: "uppercase", letterSpacing: 2, color: colors.ink },
  headerSubtitle: { ...type, fontSize: 12, color: colors.muted, maxWidth: 180 },
  headerButton: { paddingVertical: 8 },
  headerButtonText: { ...type, fontSize: 14, fontWeight: "700", textTransform: "uppercase", color: colors.red },
  tabBar: { backgroundColor: colors.paper, elevation: 0, shadowOpacity: 0, borderBottomWidth: 2, borderBottomColor: colors.ink },
  tabBarLabel: { ...type, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  tabBarItem: { paddingHorizontal: 4, minHeight: 48 },
  tabBarIndicator: { backgroundColor: colors.red, height: 4 },

  // Login-skærmen
  keyboardScreen: { flex: 1, backgroundColor: colors.paper },
  centeredContent: { flexGrow: 1, justifyContent: "center" },
  authContainer: { width: "100%", maxWidth: 480, alignSelf: "center" },
  brandText: { ...type, fontSize: 15, fontWeight: "700", textTransform: "uppercase", letterSpacing: 3, color: colors.red },
  linkButton: { padding: 12, alignItems: "center", marginBottom: 12 },
  underline: { textDecorationLine: "underline" },

  // Fælles hjælpestile
  flex: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  scrollScreen: { backgroundColor: colors.paper },
  listContent: { paddingBottom: 24 },
  loader: { marginBottom: 16 },
  retryButton: { paddingVertical: 8 },
  disabled: { opacity: 0.5 },
  errorText: { color: colors.red },
  successText: { color: "#236B36" },
  feedbackText: { marginTop: 14 },
  setupWarning: { marginBottom: 12 },
});

// Kantfarverne, som kortene i listerne skifter imellem.
export const cardAccents = [styles.accentRed, styles.accentBlue, styles.accentYellow];

export default styles;
