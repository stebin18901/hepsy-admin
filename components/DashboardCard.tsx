
// components/DashboardCard.tsx
// ----------------------------------------------------------
// Reusable card for showing dashboard stats
// ----------------------------------------------------------

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DashboardCard({ title, value, color }) {
  return (
    <View style={[styles.card, { borderLeftColor: color || "#007bff" }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: { fontSize: 16, color: "#555", marginBottom: 6 },
  value: { fontSize: 22, fontWeight: "bold", color: "#111" },
});
