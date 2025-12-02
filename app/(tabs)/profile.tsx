import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useActiveStudent } from "@/contexts/ActiveStudentContext";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config"; // make sure this path matches your structure

export default function Profile() {
  const { activeStudent, clearStudent } = useActiveStudent();
  const router = useRouter();

  const switchStudent = async () => {
    await clearStudent();
    router.replace("/accounts");
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            await clearStudent();
            router.replace("/(auth)/login");
          } catch (err) {
            console.error("Logout error:", err);
            Alert.alert("Error", "Failed to log out. Please try again.");
          }
        },
      },
    ]);
  };

  if (!activeStudent)
    return (
      <View style={styles.center}>
        <Text style={styles.warning}>No student selected</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Student Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{activeStudent.fullName}</Text>

        <Text style={styles.label}>School ID:</Text>
        <Text style={styles.value}>{activeStudent.schoolId}</Text>

        <Text style={styles.label}>Class:</Text>
        <Text style={styles.value}>{activeStudent.className}</Text>

        <Text style={styles.label}>Roll Number:</Text>
        <Text style={styles.value}>{activeStudent.rollNumber}</Text>
      </View>

      <TouchableOpacity style={styles.switchBtn} onPress={switchStudent}>
        <Text style={styles.switchText}>🔁 Switch Student</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8faff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 12, elevation: 3 },
  label: { fontSize: 14, color: "#666", marginTop: 8 },
  value: { fontSize: 16, fontWeight: "600" },
  switchBtn: {
    marginTop: 30,
    backgroundColor: "#1e88e5",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  switchText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  logoutBtn: {
    marginTop: 15,
    backgroundColor: "#e53935",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  warning: { fontSize: 16, color: "#999" },
});
