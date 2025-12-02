
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useActiveStudent } from "@/contexts/ActiveStudentContext";
import { useAssignments } from "@/hooks/useAssignments";

export default function AssignmentsPage() {
  const { activeStudent } = useActiveStudent();
  const { assignments, loading } = useAssignments(activeStudent);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading assignments...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#E3F2FD", "#FFFFFF"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📘 Pending Assignments</Text>

        {(!assignments || assignments.length === 0) ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No assignments pending.</Text>
            <Text style={styles.subText}>You're all caught up!</Text>
          </View>
        ) : (
          assignments.map((a) => (
            <View key={a.id} style={styles.card}>
              <Text style={styles.cardTitle}>{a.title}</Text>
              {a.dueDate && <Text style={styles.due}>Due: {a.dueDate}</Text>}
              <Text style={styles.desc}>
                {a.instructions?.length > 100
                  ? a.instructions.slice(0, 100) + "..."
                  : a.instructions || "No description provided."}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: "800", color: "#1A1A1A", marginBottom: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loadingText: { marginTop: 10, color: "#444", fontWeight: "600" },
  emptyBox: { marginTop: 60, alignItems: "center" },
  emptyText: { fontSize: 18, fontWeight: "700", color: "#444" },
  subText: { fontSize: 14, color: "#777", marginTop: 6 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  due: { color: "#007AFF", fontWeight: "600", marginTop: 4 },
  desc: { color: "#555", marginTop: 8, fontSize: 13 },
});
