import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import ProgressBar from "./ProgressBar";
import OptionButton from "./OptionButton";
import ConceptCheckpoint from "./ConceptCheckpoint";

type QuizListItem = { quizId: string; concept: string; createdAt: number; questions: any[] };

export default function QuizScreen({
  chapter,
  quizList,
  userId,
  onFinish,
}: {
  chapter: string;
  quizList: QuizListItem[];
  userId: string;
  onFinish: () => void;
}) {
  const merged = useMemo(() => {
    const out: any[] = [];
    quizList.forEach(q => {
      (q.questions || []).forEach((qq: any) => {
        out.push({ ...qq, concept: qq?.concept || q.concept || "" });
      });
    });
    return out;
  }, [quizList]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [checkpoint, setCheckpoint] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);

  const total = merged.length;
  const q = merged[idx];

  useEffect(() => {
    // Reset when chapter changes
    setIdx(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setCheckpoint(false);
    setResponses([]);
  }, [chapter, quizList]);

  if (!total || !q)
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>No questions</Text>
      </View>
    );

  const isLast = idx === total - 1;

  const handleSubmit = () => {
    if (!selected) return;
    const correct = String(selected).toUpperCase() === String(q?.answer || "").toUpperCase();

    // Save question response
    const newResponse = {
      question: q?.question,
      options: q?.options,
      selected: selected,
      correct: q?.answer,
      explanation: q?.explanation || "",
      concept: q?.concept || "",
      example: q?.example || "",
    };

    setResponses(prev => {
      const updated = [...prev];
      updated[idx] = newResponse;
      return updated;
    });

    if (correct) setScore(s => s + 1);
    setShowResult(true);
  };

  const next = async () => {
    const nextIdx = idx + 1;

    // ✅ When quiz ends, save full report
    if (isLast) {
      const percentage = ((score / total) * 100).toFixed(1);
      await setDoc(doc(db, "reports", `${userId}_${encodeURIComponent(chapter)}`), {
        userId,
        chapter,
        total,
        score,
        percentage,
        responses,
        createdAt: serverTimestamp(),
      });
      onFinish();
      return;
    }

    const conceptChange = (merged[idx]?.concept || "") !== (merged[nextIdx]?.concept || "");
    if (conceptChange) {
      setCheckpoint(true);
    } else {
      advance();
    }
  };

  const advance = () => {
    setIdx(i => i + 1);
    setSelected(null);
    setShowResult(false);
    setCheckpoint(false);
  };

  const optionsKeys = useMemo(
    () => Object.keys(q?.options || {}).filter(k => ["A", "B", "C", "D"].includes(k)),
    [q]
  );

  return (
    <View style={styles.wrap}>
      <ProgressBar current={idx} total={total} />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <Text style={styles.concept}>{q?.concept || "Concept"}</Text>
        <Text style={styles.question}>Q{idx + 1}. {q?.question}</Text>

        <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
          {optionsKeys.map(key => (
            <OptionButton
              key={key}
              label={key}
              text={String((q?.options || {})[key] ?? "")}
              selected={selected === key}
              correct={showResult && key === String(q?.answer || "")}
              wrong={showResult && selected === key && key !== String(q?.answer || "")}
              onPress={() => !showResult && setSelected(key)}
            />
          ))}
        </View>

        {showResult ? (
          <View style={styles.explain}>
            <Text style={styles.expHead}>Explanation</Text>
            <Text style={styles.expTxt}>{String(q?.explanation || "No explanation provided.")}</Text>
          </View>
        ) : null}

        {checkpoint ? (
          <ConceptCheckpoint concept={q?.concept} onContinue={advance} />
        ) : null}
      </ScrollView>

      {!checkpoint ? (
        <View style={styles.footer}>
          {!showResult ? (
            <TouchableOpacity
              style={[styles.btn, !selected && styles.btnDisabled]}
              disabled={!selected}
              onPress={handleSubmit}
            >
              <Text style={styles.btnTxt}>Submit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.btn} onPress={next}>
              <Text style={styles.btnTxt}>{isLast ? "Finish" : "Next"}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.meta}>Score {score}/{total}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#f6f9ff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: "#64748b", fontWeight: "700" },
  concept: { fontSize: 13, marginTop: 16, marginLeft: 20, fontWeight: "700", color: "#475569" },
  question: { marginHorizontal: 20, marginTop: 10, fontSize: 16, fontWeight: "800", color: "#0f172a" },
  explain: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
    padding: 14,
  },
  expHead: { fontWeight: "900", fontSize: 13, color: "#0f172a" },
  expTxt: { marginTop: 6, color: "#334155", fontWeight: "600" },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 12,
  },
  btn: {
    backgroundColor: "#1e88e5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnDisabled: { backgroundColor: "#9ec9ff" },
  btnTxt: { color: "#fff", fontWeight: "900" },
  meta: { textAlign: "center", marginTop: 8, color: "#64748b", fontWeight: "800" },
});
