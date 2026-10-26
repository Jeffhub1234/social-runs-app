import { StyleSheet } from "react-native";

// Al styling til appen samles i denne fil, så skærmene kun indeholder layout og logik.

// Farver, som navigationens faner bruger direkte som props (ikke som style-objekter).
export const colors = {
  text: "#111",
  inactive: "#777",
};

// Stil til de rå HTML-<input>-felter i RunDateTimeField.web.js. Det er CSS til browseren,
// derfor ligger den uden for StyleSheet.create.
export const webInputStyle = { padding: 12, fontSize: 16, border: "1px solid #d5d5d5", borderRadius: 10, background: "white", width: "100%", boxSizing: "border-box" };

export default StyleSheet.create({
  // Generelle skærme og layout
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 60,
    backgroundColor: "#f7f7f7",
  },

  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
  },

  subheading: {
    fontSize: 15,
    marginBottom: 16,
    color: "#555",
  },

  // Kort i lister
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 15,
    marginBottom: 4,
  },

  importantText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  // Knapper
  button: {
    backgroundColor: "#111",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
  },

  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#111",
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButtonText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "700",
  },

  // Detaljeskærmen
  detailBox: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  detailTitle: {
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 14,
  },

  detailText: {
    fontSize: 16,
    marginBottom: 9,
  },

  description: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
    marginBottom: 8,
  },

  joinedMessage: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 14,
    textAlign: "center",
  },

  // Formularer og valgfelter
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d5d5d5",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },

  multilineInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  fieldText: { fontSize: 16, color: "#111" },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" },
  selectionSheet: { backgroundColor: "#fff", padding: 24, paddingBottom: 40, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "75%" },
  choiceOption: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },

  // Søgning og tempofilter på "Find runs"
  filterBox: { marginBottom: 16 },
  hintText: { fontSize: 13, color: "#555", marginTop: 6 },
  filterRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  linkText: { fontSize: 15, fontWeight: "700", textDecorationLine: "underline" },

  // Navigation: header og faner (App.js)
  headerTitleBox: { alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  headerSubtitle: { fontSize: 12, color: "#555", maxWidth: 180 },
  headerButton: { paddingVertical: 8 },
  headerButtonText: { fontSize: 14, color: "#555" },
  tabBar: { backgroundColor: "white", elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: "#e5e5e5" },
  tabBarLabel: { fontSize: 13, fontWeight: "700", textTransform: "none" },
  tabBarItem: { paddingHorizontal: 4, minHeight: 48 },
  tabBarIndicator: { backgroundColor: "#111", height: 3 },

  // Login-skærmen
  keyboardScreen: { flex: 1, backgroundColor: "#f7f7f7" },
  centeredContent: { flexGrow: 1, justifyContent: "center" },
  authContainer: { width: "100%", maxWidth: 480, alignSelf: "center" },
  brandText: { fontWeight: "700" },
  linkButton: { padding: 12, alignItems: "center", marginBottom: 12 },
  underline: { textDecorationLine: "underline" },

  // Fælles hjælpestile
  flex: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  scrollScreen: { backgroundColor: "#f7f7f7" },
  listContent: { paddingBottom: 24 },
  loader: { marginBottom: 16 },
  retryButton: { paddingVertical: 8 },
  disabled: { opacity: 0.5 },
  errorText: { color: "#9b1c1c" },
  successText: { color: "#236b36" },
  feedbackText: { marginTop: 14 },
  setupWarning: { marginBottom: 12 },
});
