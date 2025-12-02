import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { db } from "@/firebase/config";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useActiveStudent } from "@/contexts/ActiveStudentContext";
import SubmissionQuestion from "./SubmissionQuestion";
import { LinearGradient } from "expo-linear-gradient";

export default function AssignmentResponse() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { activeStudent } = useActiveStudent();

  const [assignment, setAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const storage = getStorage();

  useEffect(() => {
    async function fetchAssignment() {
      try {
        const snap = await getDoc(doc(db, "assignments", id));
        if (snap.exists()) {
          const data = snap.data();
          setAssignment({ id: snap.id, ...data });

          const initial = {};
          (data.questions || []).forEach((q) => (initial[q.qNo] = ""));
          setAnswers(initial);
        }

        if (activeStudent?.id) {
          const qSub = query(
            collection(db, "submissions"),
            where("assignmentId", "==", id),
            where("studentId", "==", activeStudent.id)
          );
          const snapSub = await getDocs(qSub);
          if (!snapSub.empty) setAlreadySubmitted(true);
        }
      } catch (err) {
        console.error("Error loading assignment:", err);
      }
      setLoading(false);
    }

    if (id && activeStudent) fetchAssignment();
  }, [id, activeStudent]);

  const handleFilePick = async (qNo) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result?.assets?.length) {
        const file = result.assets[0];
        const uri = file.uri;
        const fileName = `${activeStudent?.id || "anon"}_${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `submissions/${activeStudent?.id}/${fileName}`);

        setUploadProgress((prev) => ({ ...prev, [qNo]: 0 }));

        const fileResponse = await fetch(uri);
        const blob = await fileResponse.blob();
        const uploadTask = await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(uploadTask.ref);

        setAnswers((prev) => ({
          ...prev,
          [qNo]: { name: file.name, url: downloadURL },
        }));

        setUploadProgress((prev) => ({ ...prev, [qNo]: 100 }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
      Alert.alert("Upload failed", "Please try again.");
    }
  };

  const handleChange = (qNo, val) => {
    setAnswers((prev) => ({ ...prev, [qNo]: val }));
  };
  function evaluateSubmission(assignment, answers) {
    let totalMarks = 0;
    let obtainedMarks = 0;

    assignment.questions.forEach((q) => {
      const userAns = answers[q.qNo];
      const correct = q.correct || [];
      const marks = Number(q.marks || 1);

      totalMarks += marks;

      // MCQ
      if (q.type === "mcq") {
        if (userAns === correct[0]) obtainedMarks += marks;
      }

      // MSQ
      if (q.type === "msq") {
        if (
          Array.isArray(userAns) &&
          userAns.length === correct.length &&
          userAns.every((opt) => correct.includes(opt))
        ) {
          obtainedMarks += marks;
        }
      }

      // TRUE/FALSE
      if (q.type === "tf") {
        if (String(userAns) === String(correct[0])) {
          obtainedMarks += marks;
        }
      }

      // NUMERIC
      if (q.type === "numeric") {
        const expected = Number(correct[0]);
        const tolerance = Number(q.tolerance || 0);
        const val = Number(userAns);

        if (!isNaN(val) && Math.abs(val - expected) <= tolerance) {
          obtainedMarks += marks;
        }
      }

      // Short, Long, File → teacher will grade later
    });

    return { totalMarks, obtainedMarks };
  }


  const handleSubmit = async () => {
    if (!activeStudent) return Alert.alert("No student found");

    const studentId = activeStudent?.id || activeStudent?.uid || "unknown";
    const studentName =
      activeStudent?.name ||
      activeStudent?.fullName ||
      activeStudent?.displayName ||
      "Unnamed Student";
    const className = activeStudent?.className || "Unknown Class";

    setSubmitting(true);

    try {
      // 🔥 AUTO EVALUATION HERE
      const { totalMarks, obtainedMarks } = evaluateSubmission(assignment, answers);

      await addDoc(collection(db, "submissions"), {
        assignmentId: id,
        studentId,
        studentName,
        className,
        answers,
        submittedAt: serverTimestamp(),
        status: "submitted",

        // 🔥 SAVE SCORE
        score: obtainedMarks,
        totalMarks,
        percentage: Number(((obtainedMarks / totalMarks) * 100).toFixed(2)),

        // Optional for teacher detailed evaluation
        autoEvaluated: true,
      });

      Alert.alert("✅ Submitted successfully!");
      router.replace("/(tabs)/home/assignments");

    } catch (err) {
      console.error("Error submitting:", err);
      Alert.alert("❌ Failed to submit assignment");
    }

    setSubmitting(false);
  };


  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e88e5" />
        <Text style={styles.loadingText}>Loading Assignment...</Text>
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
      colors={["#eaf3ff", "#ffffff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Card */}
        <LinearGradient
          colors={["#1e88e5", "#42a5f5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <Text style={styles.assignmentTitle}>{assignment.title}</Text>
          <Text style={styles.assignmentDue}>
            📅 Due: {assignment.dueDate || "N/A"}
          </Text>
        </LinearGradient>

        {/* Instruction Box */}
        <View style={styles.instructionsBox}>
          <Text style={styles.sectionHeading}>🧾 Instructions</Text>
          <Text style={styles.instructionsText}>
            {assignment.instructions || "No instructions provided."}
          </Text>
        </View>

        {alreadySubmitted ? (
          <View style={styles.completedBox}>
            <Text style={styles.completedText}>
              ✅ You have already submitted this assignment.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionHeading}>📘 Questions</Text>
            <View style={styles.questionList}>
              {assignment.questions?.map((q) => (
                <SubmissionQuestion
                  key={q.qNo}
                  question={q}
                  answer={answers[q.qNo]}
                  onChange={handleChange}
                  onFilePick={handleFilePick}
                  uploadProgress={uploadProgress[q.qNo]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
              disabled={submitting}
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#1565c0", "#1e88e5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitGradient}
              >
                <Text style={styles.submitText}>
                  {submitting ? "Submitting..." : "Submit Responses"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 18, paddingBottom: 100 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#607d8b", marginTop: 10, fontSize: 14 },

  headerCard: {
    top: 10,
    padding: 20,
    borderRadius: 20,
    marginBottom: 18,
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
  assignmentDue: {
    fontSize: 14,
    color: "#e3f2fd",
    fontWeight: "600",
  },

  instructionsBox: {
    backgroundColor: "#f5f9ff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e88e5",
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: "#455a64",
    lineHeight: 22,
  },

  questionList: { gap: 12, marginBottom: 24 },

  submitBtn: { marginTop: 10, borderRadius: 12, overflow: "hidden" },
  submitGradient: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  completedBox: {
    backgroundColor: "#e6f4ea",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#81c784",
    marginTop: 20,
  },
  completedText: {
    color: "#2e7d32",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 15,
  },
});
