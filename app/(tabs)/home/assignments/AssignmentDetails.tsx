import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, Paperclip } from "lucide-react-native";

export default function AssignmentDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const snap = await getDoc(doc(db, "assignments", id));
        if (snap.exists()) setAssignment({ id: snap.id, ...snap.data() });
      } catch (err) {
        console.error("Error loading assignment:", err);
      }
      setLoading(false);
    }
    if (id) fetchData();
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e88e5" />
        <Text style={styles.loadingText}>Loading assignment details...</Text>
      </View>
    );

  if (!assignment)
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Assignment not found</Text>
      </View>
    );

  return (
    <LinearGradient
      colors={["#eaf2ff", "#ffffff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Banner */}
        <LinearGradient
          colors={["#04254dff", "#07356eff", "#0c52a9ff"]}
          start={{ x: 1, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerCard}
        >
          <Text style={styles.assignmentTitle}>{assignment.title}</Text>
          <View style={styles.dueContainer}>
            <Calendar size={16} color="#fff" />
            <Text style={styles.dueText}>Due: {assignment.dueDate || "N/A"}</Text>
          </View>
        </LinearGradient>

        {/* Instruction Section */}
        <View style={styles.instructionsCard}>
          <Text style={styles.sectionTitle}>📘 Instructions</Text>
          <Text style={styles.instructionsText}>
            {assignment.instructions || "No instructions provided."}
          </Text>
        </View>

        {/* Attachments */}
        {assignment.attachments?.length > 0 && (
          <View style={styles.attachmentsBox}>
            <Text style={styles.sectionTitle}>📎 Attachments</Text>
            {assignment.attachments.map((file, i) => (
              <TouchableOpacity key={i} style={styles.fileRow}>
                <Paperclip size={16} color="#1565c0" />
                <Text style={styles.fileName}>{file.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: "/(stack)/assignments/[id]",
              params: { id: assignment.id },
            })
          }
        >
          <LinearGradient
            colors={["#1565c0", "#1e88e5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.submitGradient}
          >
            <Text style={styles.submitText}>Submit Assignment</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 18, paddingBottom: 100 },

  /** Loader **/
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#607d8b", fontSize: 14 },

  /** Header **/
  headerCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#1e88e5",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  assignmentTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  dueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dueText: {
    color: "#e3f2fd",
    fontWeight: "600",
    fontSize: 14,
  },

  /** Instructions Card **/
  instructionsCard: {
    backgroundColor: "#f8fbff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e88e5",
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14.5,
    color: "#37474f",
    lineHeight: 22,
  },

  /** Attachments **/
  attachmentsBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 25,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  fileName: {
    fontSize: 14,
    color: "#1565c0",
    fontWeight: "600",
  },

  /** Submit Button **/
  submitBtn: {
    borderRadius: 14,
    overflow: "hidden",
  },
  submitGradient: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1565c0",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
