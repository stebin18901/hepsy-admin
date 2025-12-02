import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const actions = [
  { title: "Assignments", path: "/(tabs)/home/assignments" },
  { title: "Schedule", path: "/(tabs)/home/schedule" },
  { title: "Messages", path: "/(tabs)/home/messages" },
  { title: "Reports", path: "/(tabs)/home/reports" },
  { title: "Settings", path: "/(tabs)/home/settings" },
];

export default function QuickActions() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {actions.map((a, i) => (
        <TouchableOpacity key={i} style={styles.action} onPress={() => router.push(a.path)}>
          <Text style={styles.text}>{a.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 12 },
  action: { width: "48%", backgroundColor: "#e3f2fd", paddingVertical: 14, borderRadius: 10, marginBottom: 12, alignItems: "center" },
  text: { fontSize: 15, color: "#1e88e5", fontWeight: "600" },
});