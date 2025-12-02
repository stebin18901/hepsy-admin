import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";

const toMillis = (v: any) => {
  if (!v) return 0;
  if (typeof v === "number") return v;
  if (typeof v.toMillis === "function") return v.toMillis();
  const t = Date.parse(v);
  return Number.isNaN(t) ? 0 : t;
};

export default function ConceptsPreview() {
  const { subject, cls, chapter, label } = useLocalSearchParams<{
    subject: string;
    cls: string;
    chapter: string;
    label?: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [quizList, setQuizList] = useState<
    { quizId: string; concept: string; createdAt: number; questions: any[] }[]
  >([]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "quizzes"));
        const arr: any[] = [];
        snap.forEach((d) => {
          const data: any = d.data();
          const md = data?.metadata || {};
          if (
            md.subject === subject &&
            String(md.class) === String(cls) &&
            md.chapter === chapter
          ) {
            arr.push({
              quizId: d.id,
              concept: md.concept || "",
              createdAt: toMillis(md.createdAt),
              questions: data?.questions || [],
            });
          }
        });
        arr.sort((a, b) => a.createdAt - b.createdAt);
        setQuizList(arr);
      } finally {
        setLoading(false);
      }
    };
    if (subject && cls && chapter) run();
  }, [subject, cls, chapter]);

  const concepts = useMemo(() => {
    const seen = new Set<string>();
    const ordered: string[] = [];
    quizList.forEach((q) => {
      const c = q.concept || "Concept";
      if (!seen.has(c)) {
        seen.add(c);
        ordered.push(c);
      }
    });
    return ordered;
  }, [quizList]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#42a5f5" />
      </View>
    );

  // subject emoji
  const subjectIcons: Record<string, string> = {
    math: "🧮",
    science: "🧪",
    english: "📘",
    social: "🌍",
    computer: "💻",
    gk: "🧠",
    physics: "⚛️",
    chemistry: "⚗️",
    biology: "🧬",
    hindi: "📝",
  };
  const icon =
    subjectIcons[subject?.toLowerCase()] ||
    subjectIcons[
      Object.keys(subjectIcons).find((key) =>
        subject?.toLowerCase().includes(key)
      ) || ""
    ] ||
    "📚";

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* HEADER */}
      <LinearGradient
        colors={["#42a5f5", "#5c6bc0", "#7e57c2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroEmoji}>{icon}</Text>
        <Text style={styles.title}>{chapter}</Text>
        <Text style={styles.sub}>
          {subject} • Class {label || cls}
        </Text>
      </LinearGradient>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.heading}>✨ In this chapter, you will learn:</Text>

        <View style={styles.conceptList}>
          {concepts.length > 0 ? (
            concepts.map((c, i) => (
              <View key={c + i} style={styles.row}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: colors[i % colors.length] },
                  ]}
                />
                <Text style={styles.item}>{c}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.muted, { marginTop: 10 }]}>
              No concepts found.
            </Text>
          )}
        </View>
      </View>

      {/* START QUIZ BUTTON */}
      <TouchableOpacity
        disabled={quizList.length === 0}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/student/quiz",
            params: { chapter, subject, cls, label },
          })
        }
        style={{ marginHorizontal: 20, marginTop: 30 }}
      >
        <LinearGradient
          colors={
            quizList.length === 0
              ? ["#bcd9ff", "#c7d9ff"]
              : ["#42a5f5", "#7e57c2"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.cta,
            quizList.length === 0 && { opacity: 0.6 },
          ]}
        >
          <Text style={styles.ctaTxt}>
            🚀 {quizList.length === 0 ? "No Quiz Available" : "Start Quiz"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Gradient dot colors
const colors = [
  "#FF9A8B",
  "#F6D365",
  "#84FAB0",
  "#A1C4FD",
  "#FFD1FF",
  "#B5FFFC",
  "#FDA085",
];

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#f2f7ff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    elevation: 8,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroEmoji: {
    fontSize: 42,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  sub: {
    fontSize: 14,
    color: "#e3f2fd",
    marginTop: 6,
    fontWeight: "600",
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
  },
  conceptList: {
    marginTop: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  item: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
    flexShrink: 1,
  },
  muted: {
    color: "#64748b",
    fontWeight: "700",
  },
  cta: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  ctaTxt: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
