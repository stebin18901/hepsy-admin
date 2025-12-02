import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function NotificationCard() {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push("/(tabs)/home/notifications/details")}>
      <Text style={styles.title}>New Notification</Text>
      <Text style={styles.subtitle}>Tap to view details</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 14, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
  title: { fontSize: 16, fontWeight: "700", color: "#1e88e5" },
  subtitle: { fontSize: 13, color: "#555", marginTop: 4 },
});