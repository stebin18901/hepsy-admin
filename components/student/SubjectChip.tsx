import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function SubjectChip({ subject, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={() => onPress(subject)}
      style={[styles.chip, selected && styles.active]}
    >
      <Text style={[styles.label, selected && styles.activeLabel]}>{subject}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "#E4ECF7",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    elevation: 1
  },
  active: { backgroundColor: "#1e88e5" },
  label: { color: "#1e293b", fontWeight: "600" },
  activeLabel: { color: "#fff", fontWeight: "700" }
});
