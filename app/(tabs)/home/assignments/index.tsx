import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useActiveStudent } from "@/contexts/ActiveStudentContext";
import AssignmentCard from "./AssignmentCard";
import { useRouter } from "expo-router";
import { ClipboardList, CheckCircle2 } from "lucide-react-native";

export default function StudentAssignments() {
  const { activeStudent } = useActiveStudent();
  const router = useRouter();

  const [assignments, setAssignments] = useState([]);
  const [submittedIds, setSubmittedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAssignments = useCallback(async () => {
    if (!activeStudent?.className) return;
    setLoading(true);

    try {
      const q = query(
        collection(db, "assignments"),
        where("assignedClasses", "array-contains", activeStudent.className),
        where("status", "==", "published"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAssignments(data);

      if (activeStudent?.id) {
        const qSub = query(
          collection(db, "submissions"),
          where("studentId", "==", activeStudent.id)
        );
        const subSnap = await getDocs(qSub);
        const ids = subSnap.docs.map((d) => d.data().assignmentId);
        setSubmittedIds(ids);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }

    setLoading(false);
  }, [activeStudent]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAssignments().finally(() => setRefreshing(false));
  }, [fetchAssignments]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e88e5" />
        <Text style={styles.loadingText}>Loading assignments...</Text>
      </View>
    );

  const pendingAssignments = assignments.filter((a) => !submittedIds.includes(a.id));
  const completedAssignments = assignments.filter((a) => submittedIds.includes(a.id));

  return (
    <LinearGradient
      colors={["#eaf2ff", "#ffffff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1e88e5"]} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={["#04254dff", "#07356eff", "#0c52a9ff"]}
          start={{ x: 1, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerCard}
        >
          <Text style={styles.heading}>Assignments</Text>
          <Text style={styles.subheading}>Track your homework and submissions</Text>
        </LinearGradient>

        {/* Pending Assignments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ClipboardList size={18} color="#1e88e5" />
            <Text style={styles.sectionTitle}>Pending Assignments</Text>
          </View>

          {pendingAssignments.length ? (
            pendingAssignments.map((a) => (
              <AssignmentCard
                key={a.id}
                item={{ ...a, status: "pending" }}
                onPress={() => router.push(`/(tabs)/home/assignments/${a.id}`)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>🎉 All caught up! No pending assignments.</Text>
          )}
        </View>

        {/* Completed Assignments */}
        <View style={[styles.section, { marginTop: 30 }]}>
          <View style={styles.sectionHeader}>
            <CheckCircle2 size={18} color="#2e7d32" />
            <Text style={[styles.sectionTitle, { color: "#2e7d32" }]}>
              Completed Assignments
            </Text>
          </View>

          {completedAssignments.length ? (
            completedAssignments.map((a) => (
              <AssignmentCard
                key={a.id}
                item={{ ...a, status: "completed" }}
                onPress={() => {}}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No completed assignments yet.</Text>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 100 },

  /** Header **/
  headerCard: {
    padding: 25,
    marginBottom: 24,
    shadowColor: "#1e88e5",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: "#e3f2fd",
    fontWeight: "600",
  },

  /** Section **/
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e88e5",
  },

  /** Text **/
  emptyText: {
    fontSize: 14,
    color: "#607d8b",
    marginVertical: 10,
    textAlign: "center",
    fontWeight: "500",
  },

  /** Loader **/
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#607d8b" },
});
