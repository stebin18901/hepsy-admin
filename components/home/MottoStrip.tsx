import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MottoStrip() {
  return (
    <View style={styles.strip}>
      <Text style={styles.text}>“No child falls behind.”</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    padding: 16,
    backgroundColor: "#1e88e5",
    marginHorizontal: 20,
    borderRadius: 14,
    marginTop: 24,
    alignItems: "center",
  },
  text: { color: "#fff", fontWeight: "800" },
});