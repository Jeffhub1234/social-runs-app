import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
});
