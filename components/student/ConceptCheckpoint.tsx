import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ConceptCheckpoint({ concept, onContinue }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Concept Complete ✅</Text>
      <Text style={styles.sub}>{concept}</Text>
      <TouchableOpacity style={styles.btn} onPress={onContinue}>
        <Text style={styles.btnTxt}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ecfdf5",
    margin: 20,
    padding: 18,
    borderRadius: 14,
    alignItems: "center"
  },
  title: { fontWeight: "800", color: "#065f46" },
  sub: { color: "#064e3b", marginVertical: 8 },
  btn: {
    backgroundColor: "#1e88e5",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10
  },
  btnTxt: { color: "#fff", fontWeight: "900" }
});
