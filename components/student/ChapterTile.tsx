import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function ChapterTile({ title, index, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.badge}><Text style={styles.badgeText}>{index + 1}</Text></View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    width: "48%",
    marginBottom: 14,
    elevation: 3
  },
  badge: {
    backgroundColor: "#1e88e5",
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    borderRadius: 8
  },
  badgeText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  title: { marginTop: 10, fontSize: 15, fontWeight: "700", color: "#0f172a" }
});
