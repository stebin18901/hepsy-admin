import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useActiveStudent } from "@/contexts/ActiveStudentContext";

export default function ReportCardScreen() {
  const { chapter } = useLocalSearchParams<{ chapter: string }>();
  const { activeStudent } = useActiveStudent();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      if (!activeStudent) return;
      setLoading(true);
      try {
        const reportId = `${activeStudent.uid || activeStudent.id}_${encodeURIComponent(String(chapter))}`;
        const ref = doc(db, "reports", reportId);
        const snap = await getDoc(ref);
        if (snap.exists()) setReport(snap.data());
        else setNotFound(true);
      } catch (err) {
        console.error("Error fetching report:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [chapter, activeStudent]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e88e5" />
        <Text style={styles.muted}>Loading report...</Text>
      </View>
    );

  if (notFound || !report)
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>No report found for this quiz.</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace("/(tabs)/student/chapters")}
        >
          <Text style={styles.btnTxt}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );

  const percentage = ((report.score / report.total) * 100).toFixed(1);

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
      <Text style={styles.title}>📊 Report Card</Text>
      <Text style={styles.meta}><Text style={styles.bold}>Chapter:</Text> {report.chapter}</Text>
      <Text style={styles.meta}><Text style={styles.bold}>Score:</Text> {report.score}/{report.total} ({percentage}%)</Text>
      <Text style={styles.meta}><Text style={styles.bold}>Completed on:</Text> {formatDate(report.createdAt)}</Text>

      <View style={styles.divider} />

      <Text style={styles.subtitle}>🔍 Detailed Review:</Text>
      {report.responses && report.responses.length > 0 ? (
        report.responses.map((item: any, index: number) => (
          <View
            key={index}
            style={[
              styles.card,
              item.selected === item.correct ? styles.correct : styles.wrong,
            ]}
          >
            <Text style={styles.qTitle}>
              <Text style={styles.bold}>Q{index + 1}:</Text> {item.question}
            </Text>

            {["A", "B", "C", "D"].map((opt) => (
              <Text key={opt} style={styles.option}>
                <Text style={styles.bold}>{opt}.</Text> {item.options?.[opt]}
                {opt === item.correct && <Text style={styles.correctTxt}> ✔️</Text>}
                {opt === item.selected && opt !== item.correct && <Text style={styles.wrongTxt}> ❌</Text>}
              </Text>
            ))}

            <Text style={styles.detail}>
              <Text style={styles.bold}>Your Answer:</Text>{" "}
              {item.selected ? item.options?.[item.selected] : "Not answered"}
            </Text>

            <Text style={styles.detail}>
              <Text style={styles.bold}>Correct Answer:</Text>{" "}
              {item.options?.[item.correct] || "N/A"}
            </Text>

            {item.explanation && (
              <Text style={styles.explanation}>
                <Text style={styles.bold}>Explanation:</Text> {item.explanation}
              </Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.muted}>No detailed responses found.</Text>
      )}

      <TouchableOpacity
        style={[styles.btn, { marginTop: 20 }]}
        onPress={() => router.replace("/(tabs)/student/chapters")}
      >
        <Text style={styles.btnTxt}>Go to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#f9fbff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: "#64748b", fontWeight: "600", marginTop: 10 },
  title: { fontSize: 22, fontWeight: "900", color: "#0f172a", marginBottom: 12 },
  subtitle: { fontSize: 18, fontWeight: "800", color: "#1e88e5", marginBottom: 10 },
  meta: { fontSize: 14, marginVertical: 2, color: "#334155" },
  bold: { fontWeight: "900", color: "#0f172a" },
  divider: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 12 },
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
  correct: { borderLeftWidth: 6, borderLeftColor: "#22c55e" },
  wrong: { borderLeftWidth: 6, borderLeftColor: "#ef4444" },
  qTitle: { fontWeight: "700", color: "#0f172a", marginBottom: 6 },
  option: { marginVertical: 2, color: "#334155" },
  detail: { fontSize: 13, color: "#475569", marginTop: 6 },
  explanation: { marginTop: 8, color: "#1e293b", fontWeight: "600" },
  correctTxt: { color: "#22c55e", fontWeight: "bold" },
  wrongTxt: { color: "#ef4444", fontWeight: "bold" },
  btn: {
    backgroundColor: "#1e88e5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnTxt: { color: "#fff", fontWeight: "900" },
});
