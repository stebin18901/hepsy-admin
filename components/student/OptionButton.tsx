import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function OptionButton({ label, text, selected, correct, wrong, onPress }) {
  return (
    <TouchableOpacity
      disabled={correct || wrong}
      style={[
        styles.opt,
        selected && styles.sel,
        correct && styles.correct,
        wrong && styles.wrong
      ]}
      onPress={onPress}
    >
      <Text style={[styles.key, (selected||correct) && styles.selTxt]}>{label}.</Text>
      <Text style={[styles.txt, selected && styles.selTxt]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  opt: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    marginBottom: 10
  },
  sel: { backgroundColor: "#E3F2FD" },
  correct: { backgroundColor: "#E8F5E9" },
  wrong: { backgroundColor: "#FFEBEE" },
  key: { fontWeight: "900", marginRight: 10 },
  txt: { fontSize: 14, flex: 1, fontWeight: "700" },
  selTxt: { color: "#1e88e5" }
});
